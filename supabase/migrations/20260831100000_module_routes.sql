-- Ensure each platform module routes to its own page (not all to AI Guru)

update platform_features set href = '/knowledge-hub' where title = 'Knowledge Hub';
update platform_features set href = '/ai-guru' where title = 'AI Guru';
update platform_features set href = '/instruments' where title = 'Multi-Instrument Support';
update platform_features set href = '/student' where title = 'Student Dashboard';
update platform_features set href = '/teacher' where title = 'Teacher Portal';
update platform_features set href = '/admin' where title = 'Academy & Admin';

-- Add dedicated Notes Generation module
insert into platform_features (title, description, icon, tag, href, sort_order)
select
    'Notes Generation',
    'Browse official syllabus PDFs, view ingested topics, and generate AI study notes from your exam syllabus.',
    'book-open',
    'Notes & PDFs',
    '/notes',
    7
where not exists (
    select 1 from platform_features where title = 'Notes Generation'
);
