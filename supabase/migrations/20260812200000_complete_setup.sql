-- Supabase Migration: Complete database setup for Carnatic Music Theory app tables

-- 1. Create ragas table if not exists (holds simplified or supplementary raga data)
create table if not exists public.ragas (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    melakarta_number integer,
    arohanam text not null,
    avarohanam text not null,
    swaras text,
    parent_melakarta text,
    rasa text,
    time text,
    famous_kritis text[],
    audio_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ragas enable row level security;

create policy "Ragas viewable by everyone" on public.ragas
    for select using (true);

-- 2. Make sure syllabus_knowledge table exists and contains the requested fields
create table if not exists public.syllabus_knowledge (
    id uuid primary key default gen_random_uuid(),
    title text,
    section text,
    content text not null,
    source_file text not null,
    page_number integer not null default 0,
    chunk_index integer not null default 0,
    language text not null default 'English',
    embedding public.vector(1536),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Dynamically add chunk_index column if it does not exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name='syllabus_knowledge' and column_name='chunk_index') then
        alter table public.syllabus_knowledge add column chunk_index integer not null default 0;
    end if;
end $$;

-- 3. Alter talas table to add missing aksharas and structure fields
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name='talas' and column_name='aksharas') then
        alter table public.talas add column aksharas integer;
    end if;
    if not exists (select 1 from information_schema.columns where table_name='talas' and column_name='structure') then
        alter table public.talas add column structure text;
    end if;
end $$;

-- 4. Alter composers table to add biography (if biography text field is needed, already exists) and famous_compositions
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name='composers' and column_name='famous_compositions') then
        alter table public.composers add column famous_compositions text[];
    end if;
end $$;

-- 5. Create quizzes table if not exists
create table if not exists public.quizzes (
    id uuid primary key default gen_random_uuid(),
    question text not null,
    option_a text not null,
    option_b text not null,
    option_c text not null,
    option_d text not null,
    correct_answer text not null,
    difficulty text,
    topic text,
    explanation text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.quizzes enable row level security;

create policy "Quizzes viewable by everyone" on public.quizzes
    for select using (true);

-- 6. Alter user_progress table to support topics_completed, quiz_score, daily_streak, badges, and updated_at
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name='user_progress' and column_name='topics_completed') then
        alter table public.user_progress add column topics_completed text[];
    end if;
    if not exists (select 1 from information_schema.columns where table_name='user_progress' and column_name='quiz_score') then
        alter table public.user_progress add column quiz_score numeric;
    end if;
    if not exists (select 1 from information_schema.columns where table_name='user_progress' and column_name='daily_streak') then
        alter table public.user_progress add column daily_streak integer default 0;
    end if;
    if not exists (select 1 from information_schema.columns where table_name='user_progress' and column_name='badges') then
        alter table public.user_progress add column badges text[];
    end if;
    if not exists (select 1 from information_schema.columns where table_name='user_progress' and column_name='updated_at') then
        alter table public.user_progress add column updated_at timestamp with time zone default timezone('utc'::text, now()) not null;
    end if;
end $$;

-- 7. Create ai_chat_history table if not exists (user-specific AI conversation logging)
create table if not exists public.ai_chat_history (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    user_message text not null,
    ai_response text not null,
    language text not null default 'en',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_chat_history enable row level security;

create policy "Users can manage their own chat history" on public.ai_chat_history
    for all using (auth.uid() = user_id);

-- Performance Indexes
create index if not exists idx_ragas_name on public.ragas(name);
create index if not exists idx_quizzes_topic on public.quizzes(topic);
create index if not exists idx_ai_chat_history_user on public.ai_chat_history(user_id);
create index if not exists idx_syllabus_knowledge_chunk on public.syllabus_knowledge(source_file, chunk_index);
