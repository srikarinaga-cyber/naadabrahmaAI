-- Auth trigger, practice sessions, class enrollments, profile insert policy

-- Practice sessions for Shruti/Practice MVP
create table practice_sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    shruti text not null default 'C',
    instrument text not null default 'vocal',
    duration_seconds integer default 0 check (duration_seconds >= 0),
    pitch_summary jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_practice_sessions_user on practice_sessions(user_id);
create index idx_practice_sessions_created on practice_sessions(created_at desc);

alter table practice_sessions enable row level security;

create policy "Users manage own practice sessions" on practice_sessions
    for all using (auth.uid() = user_id);

-- Class enrollments (teacher -> students)
create table class_enrollments (
    id uuid primary key default gen_random_uuid(),
    class_id uuid not null references teacher_classes(id) on delete cascade,
    student_id uuid not null references profiles(id) on delete cascade,
    enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (class_id, student_id)
);

create index idx_class_enrollments_class on class_enrollments(class_id);
create index idx_class_enrollments_student on class_enrollments(student_id);

alter table class_enrollments enable row level security;

create policy "Students view own enrollments" on class_enrollments
    for select using (auth.uid() = student_id);

create policy "Teachers manage class enrollments" on class_enrollments
    for all using (
        exists (
            select 1 from teacher_classes tc
            where tc.id = class_enrollments.class_id
            and tc.teacher_id = auth.uid()
        )
        or exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('platform_admin')
        )
    );

-- Profile insert policy for signup
create policy "Users can insert their own profile" on profiles
    for insert with check (auth.uid() = id);

-- Auto-create profile and streak on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, name, role)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        coalesce((new.raw_user_meta_data->>'role')::user_role, 'student'::user_role)
    )
    on conflict (id) do nothing;

    insert into public.study_streaks (user_id)
    values (new.id)
    on conflict (user_id) do nothing;

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Enable pg_trgm for partial text search (must precede GIN indexes)
create extension if not exists pg_trgm;

create index idx_melakartas_name_trgm on melakartas using gin (name gin_trgm_ops);
create index idx_janyas_name_trgm on janyas using gin (name gin_trgm_ops);
create index idx_composers_name_trgm on composers using gin (name gin_trgm_ops);
create index idx_talas_name_trgm on talas using gin (name gin_trgm_ops);
create index idx_kritis_title_trgm on kritis using gin (title gin_trgm_ops);
