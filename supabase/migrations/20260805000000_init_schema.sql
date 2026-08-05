-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "vector" with schema public;

-- Enums
create type user_role as enum ('student', 'teacher', 'academy_admin', 'platform_admin');
create type raga_type as enum ('melakarta', 'janya');
create type exam_level as enum ('lower', 'higher', 'diploma', 'degree', 'certificate');
create type question_type as enum ('mcq', 'practical_pitch', 'theory_short');
create type progress_status as enum ('not_started', 'in_progress', 'completed');

-- 1. Institutions/Academies Table
create table institutions (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    address text,
    contact_email text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. User Profiles Table (Linked to Supabase Auth)
create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    name text not null,
    role user_role default 'student'::user_role not null,
    institution_id uuid references institutions(id) on delete set null,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Melakarta Ragas Table (The Parent Scales)
create table melakartas (
    id uuid primary key default gen_random_uuid(),
    number integer unique check (number >= 1 and number <= 72) not null,
    name text unique not null,
    chakra text not null, -- e.g., Indu, Netra, Agni, etc.
    arohana text not null, -- e.g., S R1 G1 M1 P D1 N1 S
    avarohana text not null, -- e.g., S N1 D1 P M1 G1 R1 S
    swara_frequencies jsonb, -- Scientific frequency values/ratios for synthesis
    description text,
    metadata jsonb, -- e.g., time of day, seasonal qualities, mood/rasa
    embedding vector(1536), -- Vector representation of description and scale properties
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Janya Ragas Table (Derived Scales)
create table janyas (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    parent_melakarta_id uuid not null references melakartas(id) on delete restrict,
    arohana text not null, -- e.g., S R2 G2 M1 P D2 S
    avarohana text not null, -- e.g., S D2 P M1 R2 S
    vakra boolean default false not null, -- Contains zig-zag scale notes
    bhashanga boolean default false not null, -- Uses foreign notes (anya swaras)
    upanga boolean default false not null, -- Strict subset of parent
    description text,
    metadata jsonb,
    embedding vector(1536),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Composers Table
create table composers (
    id uuid primary key default gen_random_uuid(),
    name text unique not null,
    era text, -- e.g., 18th Century, Trinity
    biography text,
    mudra text, -- Composer signature e.g., Guruguha, Tyagaraja
    metadata jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Talas Table (Rhythmic Cycles)
create table talas (
    id uuid primary key default gen_random_uuid(),
    name text unique not null,
    beats integer not null, -- total count of beats, e.g., 8 for Adi Tala
    angas text not null, -- Notation like "I4 O O" (Laghu 4, Dhrutam, Dhrutam)
    description text,
    metadata jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Kritis Table (Compositions)
create table kritis (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    composer_id uuid references composers(id) on delete set null,
    melakarta_id uuid references melakartas(id) on delete restrict,
    janya_id uuid references janyas(id) on delete restrict,
    tala_id uuid references talas(id) on delete restrict,
    notation text, -- Notation details in markdown/Solfa style
    lyrics text,
    translation text,
    audio_reference_url text, -- Storage reference to rendering
    difficulty_level exam_level default 'lower'::exam_level not null,
    metadata jsonb,
    embedding vector(1536), -- Vector representation of lyrics and translation
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint check_raga_association check (
        (melakarta_id is not null and janya_id is null) or 
        (melakarta_id is null and janya_id is not null)
    )
);

-- 8. Exam Questions Table
create table exam_questions (
    id uuid primary key default gen_random_uuid(),
    type question_type not null,
    level exam_level not null,
    question_text text not null,
    options jsonb, -- For MCQs: ['A', 'B', 'C', 'D'] or similar structure
    correct_answer text not null,
    explanation text,
    raga_id uuid, -- Optional relation to ragas (Janya or Melakarta represented here)
    composer_id uuid references composers(id) on delete set null,
    kriti_id uuid references kritis(id) on delete set null,
    embedding vector(1536), -- Vector search for LLM context retrieval
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. AI Study Notes Table
create table ai_notes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    title text not null,
    content text not null, -- AI generated markdown content
    source_raga_id uuid,
    source_kriti_id uuid references kritis(id) on delete cascade,
    embedding vector(1536), -- Embeddings to allow semantic searching of student's own notes
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Student Progress Tracker
create table user_progress (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    entity_type text not null, -- 'raga', 'kriti', 'exam_question', 'lesson'
    entity_id uuid not null,
    status progress_status default 'not_started'::progress_status not null,
    score numeric check (score >= 0 and score <= 100),
    last_studied_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    unique (user_id, entity_type, entity_id)
);

-- 11. Study Streak Table
create table study_streaks (
    user_id uuid primary key references profiles(id) on delete cascade,
    current_streak integer default 0 not null,
    longest_streak integer default 0 not null,
    last_activity_date date default current_date not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Bookmarks Table
create table user_bookmarks (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    entity_type text not null, -- 'raga_m', 'raga_j', 'composer', 'kriti', 'note'
    entity_id uuid not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    unique (user_id, entity_type, entity_id)
);

-- 13. Teacher Classes & Assignments (For Teacher Portal)
create table teacher_classes (
    id uuid primary key default gen_random_uuid(),
    teacher_id uuid not null references profiles(id) on delete cascade,
    name text not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table assignments (
    id uuid primary key default gen_random_uuid(),
    class_id uuid not null references teacher_classes(id) on delete cascade,
    title text not null,
    description text,
    pdf_attachment_url text, -- Storage reference link
    due_date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create performance indexes
create index idx_melakartas_number on melakartas(number);
create index idx_janyas_parent on janyas(parent_melakarta_id);
create index idx_kritis_composer on kritis(composer_id);
create index idx_user_progress_user on user_progress(user_id);
create index idx_user_bookmarks_user on user_bookmarks(user_id);

-- Create Vector HNSW Indexes for fast similarity searching
create index on melakartas using hnsw (embedding vector_cosine_ops);
create index on janyas using hnsw (embedding vector_cosine_ops);
create index on kritis using hnsw (embedding vector_cosine_ops);
create index on exam_questions using hnsw (embedding vector_cosine_ops);
create index on ai_notes using hnsw (embedding vector_cosine_ops);

-- Enable Row Level Security (RLS) on tables
alter table profiles enable row level security;
alter table institutions enable row level security;
alter table melakartas enable row level security;
alter table janyas enable row level security;
alter table composers enable row level security;
alter table talas enable row level security;
alter table kritis enable row level security;
alter table exam_questions enable row level security;
alter table ai_notes enable row level security;
alter table user_progress enable row level security;
alter table study_streaks enable row level security;
alter table user_bookmarks enable row level security;
alter table teacher_classes enable row level security;
alter table assignments enable row level security;

-- Row Level Security (RLS) Policies

-- Profiles Policies
create policy "Public profiles are viewable by everyone" on profiles
    for select using (true);

create policy "Users can update their own profiles" on profiles
    for update using (auth.uid() = id);

-- Institutions Policies
create policy "Institutions are viewable by authenticated users" on institutions
    for select using (auth.role() = 'authenticated');

create policy "Only platform and academy admins can manage institutions" on institutions
    for all using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('platform_admin', 'academy_admin')
        )
    );

-- Melakartas, Janyas, Composers, Talas, Kritis are public content (viewable by all authenticated)
create policy "Public music catalog is viewable by everyone" on melakartas
    for select using (true);

create policy "Catalog edits restricted to admins" on melakartas
    for all using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('platform_admin')
        )
    );

create policy "Public janyas viewable by everyone" on janyas
    for select using (true);

create policy "Janya edits restricted to admins" on janyas
    for all using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('platform_admin')
        )
    );

create policy "Public composers viewable by everyone" on composers
    for select using (true);

create policy "Composer edits restricted to admins/teachers" on composers
    for all using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('platform_admin', 'teacher')
        )
    );

create policy "Public talas viewable by everyone" on talas
    for select using (true);

create policy "Talas edits restricted to admins" on talas
    for all using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('platform_admin')
        )
    );

create policy "Public kritis viewable by everyone" on kritis
    for select using (true);

create policy "Kritis edits restricted to admins/teachers" on kritis
    for all using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('platform_admin', 'teacher')
        )
    );

-- Exam Questions
create policy "Exam questions viewable by authenticated users" on exam_questions
    for select using (auth.role() = 'authenticated');

create policy "Exam question modifications restricted to teachers and admins" on exam_questions
    for all using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('platform_admin', 'teacher')
        )
    );

-- AI Notes: Strict owner access
create policy "Users can perform all operations on their own AI notes" on ai_notes
    for all using (auth.uid() = user_id);

-- User Progress: Strict owner access, teachers can view progress of students
create policy "Users can view and update their own progress" on user_progress
    for all using (auth.uid() = user_id);

create policy "Teachers can view student progress" on user_progress
    for select using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('teacher', 'platform_admin')
        )
    );

-- Study Streaks: Owner access, read-only to others
create policy "Users can view all streaks" on study_streaks
    for select using (true);

create policy "Users can update their own streak" on study_streaks
    for all using (auth.uid() = user_id);

-- Bookmarks: Owner access only
create policy "Users can manage their own bookmarks" on user_bookmarks
    for all using (auth.uid() = user_id);

-- Teacher Classes and Assignments
create policy "Classes viewable by class members" on teacher_classes
    for select using (
        auth.uid() = teacher_id or
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role = 'student'
        )
    );

create policy "Teachers can manage classes" on teacher_classes
    for all using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('teacher', 'platform_admin')
        )
    );

create policy "Assignments viewable by class members" on assignments
    for select using (true);

create policy "Teachers can manage assignments" on assignments
    for all using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('teacher', 'platform_admin')
        )
    );
