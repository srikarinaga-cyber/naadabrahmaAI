-- Migration to create the syllabus_knowledge table and similarity search function.

create table if not exists public.syllabus_knowledge (
    id uuid primary key default gen_random_uuid(),
    title text,
    section text,
    content text not null,
    source_file text not null,
    page_number integer not null,
    language text not null default 'English',
    embedding public.vector(1536),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on the table
alter table public.syllabus_knowledge enable row level security;

-- Policies for public reading
create policy "Syllabus knowledge is viewable by everyone" on public.syllabus_knowledge
    for select using (true);

-- Policies for admin writing
create policy "Syllabus knowledge is manageable by admins only" on public.syllabus_knowledge
    for all using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.role = 'platform_admin'::public.user_role
        )
    );

-- Create HNSW index for cosine distance similarity search
create index if not exists idx_syllabus_knowledge_embedding
on public.syllabus_knowledge
using hnsw (embedding public.vector_cosine_ops);

-- Create trigram index on content and title for fallback text-based search
create index if not exists idx_syllabus_knowledge_content_trgm
on public.syllabus_knowledge
using gin (content public.gin_trgm_ops);

create index if not exists idx_syllabus_knowledge_title_trgm
on public.syllabus_knowledge
using gin (title public.gin_trgm_ops);

-- Create a Postgres function for cosine similarity matching
create or replace function public.match_syllabus_knowledge(
  query_embedding public.vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  section text,
  content text,
  source_file text,
  page_number integer,
  language text,
  similarity float
)
language plpgsql stable
security definer set search_path = public
as $$
begin
  return query
  select
    sk.id,
    sk.title,
    sk.section,
    sk.content,
    sk.source_file,
    sk.page_number,
    sk.language,
    (1 - (sk.embedding <=> query_embedding))::float as similarity
  from public.syllabus_knowledge sk
  where (1 - (sk.embedding <=> query_embedding)) > match_threshold
  order by sk.embedding <=> query_embedding asc
  limit match_count;
end;
$$;
