-- Landing page content tables (public marketing data)

create table platform_features (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text not null,
    icon text not null,
    tag text not null,
    href text default '#',
    sort_order integer default 0 not null,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table platform_statistics (
    id uuid primary key default gen_random_uuid(),
    label text not null,
    value text not null,
    suffix text,
    icon text not null,
    sort_order integer default 0 not null,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table testimonials (
    id uuid primary key default gen_random_uuid(),
    quote text not null,
    author_name text not null,
    author_role text not null,
    author_institution text,
    instrument text,
    rating integer default 5 check (rating >= 1 and rating <= 5),
    sort_order integer default 0 not null,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_platform_features_sort on platform_features(sort_order) where is_active = true;
create index idx_platform_statistics_sort on platform_statistics(sort_order) where is_active = true;
create index idx_testimonials_sort on testimonials(sort_order) where is_active = true;

alter table platform_features enable row level security;
alter table platform_statistics enable row level security;
alter table testimonials enable row level security;

create policy "Platform features are publicly readable"
    on platform_features for select using (is_active = true);

create policy "Platform statistics are publicly readable"
    on platform_statistics for select using (is_active = true);

create policy "Testimonials are publicly readable"
    on testimonials for select using (is_active = true);

create policy "Only platform admins can manage features"
    on platform_features for all using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role = 'platform_admin'
        )
    );

create policy "Only platform admins can manage statistics"
    on platform_statistics for all using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role = 'platform_admin'
        )
    );

create policy "Only platform admins can manage testimonials"
    on testimonials for all using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role = 'platform_admin'
        )
    );

-- Seed platform features
insert into platform_features (title, description, icon, tag, href, sort_order) values
(
    'Knowledge Hub',
    'Explore 72 Melakarta Ragas, Janya derivatives, Talas, Composers, Kritis, Swaras, Gamakas, and comprehensive theory.',
    'book-open',
    'Catalog',
    '/knowledge-hub',
    1
),
(
    'AI Guru',
    'Ask musical doubts, compare ragas, generate quizzes and notes, and obtain personalized practice schedules powered by GPT.',
    'sparkles',
    'AI Assistant',
    '/ai-guru',
    2
),
(
    'Multi-Instrument Support',
    'Built for Vocal, Veena, Violin, Flute, Mridangam, and Keyboard — not limited to vocal music alone.',
    'music',
    'Instruments',
    '/instruments',
    3
),
(
    'Student Dashboard',
    'Track progress, bookmarks, study streaks, achievements, practice history, and AI-generated notes.',
    'graduation-cap',
    'Students',
    '/student',
    4
),
(
    'Teacher Portal',
    'Manage students, assignments, question papers, upload notes, and view class analytics.',
    'users',
    'Teachers',
    '/teacher',
    5
),
(
    'Academy & Admin',
    'Institution management, content curation, reports, and platform-wide analytics for academies and administrators.',
    'shield',
    'Enterprise',
    '/admin',
    6
),
(
    'Notes Generation',
    'Browse official syllabus PDFs, view ingested topics, and generate AI study notes from your exam syllabus.',
    'notebook-pen',
    'Notes & PDFs',
    '/notes',
    7
);

-- Seed platform statistics
insert into platform_statistics (label, value, suffix, icon, sort_order) values
('Melakarta Ragas', '72', '', 'layers', 1),
('Janya Ragas', '1000', '+', 'git-branch', 2),
('Talas Catalogued', '35', '+', 'timer', 3),
('Composers', '200', '+', 'user', 4),
('Instruments Supported', '6', '', 'music-2', 5),
('AI-Powered Learning', '24/7', '', 'bot', 6);

-- Seed testimonials
insert into testimonials (quote, author_name, author_role, author_institution, instrument, rating, sort_order) values
(
    'Naadabrahma AI transformed how I prepare for my diploma exam. The raga comparison tool and AI Guru explain concepts better than any textbook.',
    'Priya Ramanathan',
    'Diploma Student',
    'Kalakshetra Foundation',
    'Vocal',
    5,
    1
),
(
    'As a veena teacher managing 40 students, the analytics dashboard and assignment system save me hours every week. My students love the interactive raga graphs.',
    'Dr. Lakshmi Venkataraman',
    'Senior Faculty',
    'Chennai Music Academy',
    'Veena',
    5,
    2
),
(
    'Our academy adopted Naadabrahma for all branches. The Knowledge Hub is the most comprehensive Carnatic database I have seen in digital form.',
    'Raghav Iyer',
    'Academy Director',
    'Naada Kala Kendra',
    'Multi-instrument',
    5,
    3
);

-- Seed featured melakarta for Knowledge Hub preview
insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (
    29,
    'Dheerasankarabharanam',
    'Bana',
    'S R2 G3 M1 P D2 N3 S',
    'S N3 D2 P M1 G3 R2 S',
    'The 29th Melakarta raga, equivalent to the major scale in Western music. A foundational raga with numerous popular Janya derivatives including Hamsadhwani, Bilahari, and Arabhi.',
    '{"western_equivalent": "C Major Scale", "time_of_day": "Any", "mood": "Joyful, majestic", "popular_janyas": ["Hamsadhwani", "Bilahari", "Arabhi"]}'::jsonb
)
on conflict (number) do nothing;
