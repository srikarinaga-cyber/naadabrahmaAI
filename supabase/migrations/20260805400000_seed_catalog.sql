-- Seed Talas, Composers, Janya Ragas, Kritis, and Exam Questions

-- Talas
insert into talas (name, beats, angas, description, metadata) values
('Adi Tala', 8, 'I4 O O', 'The most common tala in Carnatic music. One Laghu (4 beats) followed by two Dhrutams (2 beats each).', '{"category": "suladi", "common": true}'::jsonb),
('Rupaka Tala', 6, 'O I4', 'Two angas: one Dhrutam (2 beats) and one Laghu (4 beats).', '{"category": "suladi", "common": true}'::jsonb),
('Misra Chapu', 7, '3+4', 'Asymmetric tala with 3+4 grouping. Widely used in lighter compositions and padams.', '{"category": "chapu", "common": true}'::jsonb),
('Khanda Chapu', 5, '2+3', 'Five-beat chapu tala with 2+3 grouping.', '{"category": "chapu", "common": true}'::jsonb),
('Jhampa Tala', 10, 'I4 O I2', 'One Laghu (4), one Dhrutam (2), one Laghu (2).', '{"category": "suladi", "common": true}'::jsonb),
('Ata Tala', 14, 'I5 O O', 'Two Laghus of 5 beats each followed by two Dhrutams.', '{"category": "suladi", "common": true}'::jsonb),
('Dhruva Tala', 14, 'I4 O I4 O', 'Four angas with two Laghus and two Dhrutams.', '{"category": "suladi", "common": true}'::jsonb),
('Eka Tala', 4, 'I4', 'Single Laghu of 4 beats.', '{"category": "suladi", "common": false}'::jsonb),
('Triputa Tala', 7, 'I3 O O', 'One Laghu of 3 beats and two Dhrutams.', '{"category": "suladi", "common": false}'::jsonb),
('Matya Tala', 8, 'O I4 O', 'Dhrutam, Laghu, Dhrutam pattern.', '{"category": "suladi", "common": false}'::jsonb)
on conflict (name) do nothing;

-- Composers (Carnatic Trinity + notable composers)
insert into composers (name, era, biography, mudra, metadata) values
('Tyagaraja', '18th–19th Century', 'One of the Carnatic Trinity. Composed thousands of kritis primarily in Telugu, devoted to Lord Rama.', 'Tyagaraja', '{"trinity": true, "language": "Telugu"}'::jsonb),
('Muthuswami Dikshitar', '18th–19th Century', 'Carnatic Trinity composer known for Sanskrit kritis with rich raga and tala variety.', 'Guruguha', '{"trinity": true, "language": "Sanskrit"}'::jsonb),
('Syama Sastri', '18th–19th Century', 'Carnatic Trinity composer, master of swarajati and kriti forms, especially in Tamil and Telugu.', 'Syama Krishna', '{"trinity": true, "language": "Telugu/Tamil"}'::jsonb),
('Purandaradasa', '15th–16th Century', 'Haridasa saint-composer, foundational figure for Carnatic pedagogy and devarnama.', 'Purandara Vittala', '{"haridasa": true}'::jsonb),
('Annamacharya', '15th Century', 'Early Telugu composer of sankeertanas at Tirumala.', 'Annamayya', '{"padakavita": true}'::jsonb),
('Swati Tirunal', '19th Century', 'Maharaja of Travancore, prolific composer in Sanskrit, Malayalam, and other languages.', 'Padmanabha', '{"royal": true}'::jsonb)
on conflict (name) do nothing;

-- Janya Ragas (linked to parent melakartas by number)
insert into janyas (name, parent_melakarta_id, arohana, avarohana, vakra, bhashanga, upanga, description, metadata)
select 'Hamsadhwani', m.id, 'S R2 G3 P N3 S', 'S N3 P M1 G3 R2 S', false, false, true,
  'A popular pentatonic janya raga derived from Dheerasankarabharanam. Symmetric scale, ideal for beginners.',
  '{"type": "audava", "time_of_day": "Any"}'::jsonb
from melakartas m where m.number = 29
on conflict do nothing;

insert into janyas (name, parent_melakarta_id, arohana, avarohana, vakra, bhashanga, upanga, description, metadata)
select 'Mohanam', m.id, 'S R2 G3 P D2 S', 'S D2 P G3 R2 S', false, false, true,
  'Pentatonic janya raga from Dheerasankarabharanam. Bright, joyful character.',
  '{"type": "audava", "time_of_day": "Evening"}'::jsonb
from melakartas m where m.number = 29;

insert into janyas (name, parent_melakarta_id, arohana, avarohana, vakra, bhashanga, upanga, description, metadata)
select 'Bilahari', m.id, 'S R2 G3 P D2 S', 'S N3 D2 P M1 G3 R2 S', false, false, true,
  'Popular janya raga from Dheerasankarabharanam. Uses N3 in avarohana.',
  '{"type": "audava-sampurna", "time_of_day": "Morning"}'::jsonb
from melakartas m where m.number = 29;

insert into janyas (name, parent_melakarta_id, arohana, avarohana, vakra, bhashanga, upanga, description, metadata)
select 'Arabhi', m.id, 'S R2 M1 P D2 S', 'S N3 D2 P M1 R2 S', false, false, true,
  'Utsava prasanga raga from Dheerasankarabharanam. Associated with Tyagaraja kritis.',
  '{"type": "audava-sampurna", "time_of_day": "Any"}'::jsonb
from melakartas m where m.number = 29;

insert into janyas (name, parent_melakarta_id, arohana, avarohana, vakra, bhashanga, upanga, description, metadata)
select 'Bhairavi', m.id, 'S R2 G2 M1 P D1 N2 S', 'S N2 D1 P M1 G2 R2 S', false, true, false,
  'One of the most important janya ragas, derived from Natabhairavi. Uses bhashanga swaras.',
  '{"type": "sampurna", "time_of_day": "Morning"}'::jsonb
from melakartas m where m.number = 20;

insert into janyas (name, parent_melakarta_id, arohana, avarohana, vakra, bhashanga, upanga, description, metadata)
select 'Kambhoji', m.id, 'S R2 G3 M1 P D2 S', 'S N2 D2 P M1 G3 R2 S', false, false, true,
  'Major janya from Harikambhoji (28th Melakarta). Rich, majestic raga.',
  '{"type": "shadava-sampurna", "time_of_day": "Evening"}'::jsonb
from melakartas m where m.number = 28;

insert into janyas (name, parent_melakarta_id, arohana, avarohana, vakra, bhashanga, upanga, description, metadata)
select 'Abheri', m.id, 'S R2 M1 P N2 S', 'S N2 P M1 R2 S', false, false, true,
  'Pentatonic janya from Kharaharapriya. Popular in light classical and film music.',
  '{"type": "audava", "time_of_day": "Any"}'::jsonb
from melakartas m where m.number = 22;

insert into janyas (name, parent_melakarta_id, arohana, avarohana, vakra, bhashanga, upanga, description, metadata)
select 'Anandabhairavi', m.id, 'S G2 R2 G2 M1 P D1 N2 S', 'S N2 D1 P M1 G2 R2 S', true, true, false,
  'Vakra and bhashanga janya from Natabhairavi. Deep emotional rasa.',
  '{"type": "sampurna", "time_of_day": "Any"}'::jsonb
from melakartas m where m.number = 20;

insert into janyas (name, parent_melakarta_id, arohana, avarohana, vakra, bhashanga, upanga, description, metadata)
select 'Malahari', m.id, 'S R1 M1 P D1 S', 'S D1 P M1 R1 S', false, false, true,
  'Pentatonic janya from Mayamalavagowla. Used in early lessons and geetams.',
  '{"type": "audava", "time_of_day": "Morning"}'::jsonb
from melakartas m where m.number = 15;

insert into janyas (name, parent_melakarta_id, arohana, avarohana, vakra, bhashanga, upanga, description, metadata)
select 'Hindolam', m.id, 'S G2 M1 D1 N2 S', 'S N2 D1 M1 G2 S', false, false, true,
  'Pentatonic janya from Simhendramadhyamam. Omits Ri and Pa.',
  '{"type": "audava", "time_of_day": "Morning"}'::jsonb
from melakartas m where m.number = 57;

insert into janyas (name, parent_melakarta_id, arohana, avarohana, vakra, bhashanga, upanga, description, metadata)
select 'Shankarabharanam', m.id, 'S R2 G3 M1 P D2 N3 S', 'S N3 D2 P M1 G3 R2 S', false, false, true,
  'Janya usage of the 29th Melakarta scale itself as a performance raga.',
  '{"type": "sampurna", "time_of_day": "Any"}'::jsonb
from melakartas m where m.number = 29;

-- Kritis (placeholder lyrics — no copyrighted text)
insert into kritis (title, composer_id, janya_id, tala_id, notation, lyrics, translation, difficulty_level, metadata)
select 'Vatapi Ganapatim Bhajeham',
  (select id from composers where name = 'Muthuswami Dikshitar'),
  (select id from janyas where name = 'Hamsadhwani' limit 1),
  (select id from talas where name = 'Adi Tala'),
  'S R2 G3 | P N3 S | ...',
  '[Lyrics placeholder — refer to authorized notation sources]',
  'I worship Ganapati of Vatapi (reference translation placeholder)',
  'lower',
  '{"composer_mudra": "Guruguha", "deity": "Ganesha"}'::jsonb;

insert into kritis (title, composer_id, janya_id, tala_id, notation, lyrics, translation, difficulty_level, metadata)
select 'Nagumomu Ganaleni',
  (select id from composers where name = 'Tyagaraja'),
  (select id from janyas where name = 'Abheri' limit 1),
  (select id from talas where name = 'Adi Tala'),
  null,
  '[Lyrics placeholder — refer to authorized notation sources]',
  'Reference translation placeholder for Tyagaraja composition in Abheri',
  'lower',
  '{"language": "Telugu"}'::jsonb;

insert into kritis (title, composer_id, janya_id, tala_id, notation, lyrics, translation, difficulty_level, metadata)
select 'Brochevarevarura',
  (select id from composers where name = 'Muthuswami Dikshitar'),
  (select id from janyas where name = 'Kambhoji' limit 1),
  (select id from talas where name = 'Adi Tala'),
  null,
  '[Lyrics placeholder — refer to authorized notation sources]',
  'Reference translation placeholder — Kambhoji kriti',
  'higher',
  '{"language": "Telugu"}'::jsonb;

insert into kritis (title, composer_id, janya_id, tala_id, notation, lyrics, translation, difficulty_level, metadata)
select 'Endaro Mahanubhavulu',
  (select id from composers where name = 'Tyagaraja'),
  (select id from janyas where name = 'Sri' limit 1),
  (select id from talas where name = 'Adi Tala'),
  null,
  '[Lyrics placeholder]',
  'Reference translation placeholder',
  'diploma',
  '{"language": "Telugu"}'::jsonb;

-- Sri janya may not exist - use melakarta Kharaharapriya instead for Endaro
update kritis set janya_id = null, melakarta_id = (select id from melakartas where number = 22)
where title = 'Endaro Mahanubhavulu';

-- Exam Questions (seed quiz bank)
insert into exam_questions (type, level, question_text, options, correct_answer, explanation) values
('mcq', 'lower', 'How many Melakarta ragas are there in the Venkatamakhin system?',
 '["48", "72", "96", "108"]'::jsonb, '72',
 'The Venkatamakhin Melakarta system defines exactly 72 parent scales organized into 12 chakras.'),

('mcq', 'lower', 'Which tala has the anga pattern I4 O O (Laghu + 2 Dhrutams)?',
 '["Rupaka", "Adi", "Jhampa", "Eka"]'::jsonb, 'Adi',
 'Adi Tala is the most common tala with 8 beats: one Laghu of 4 and two Dhrutams of 2 each.'),

('mcq', 'lower', 'Hamsadhwani is a janya raga of which Melakarta?',
 '["Kharaharapriya (#22)", "Dheerasankarabharanam (#29)", "Mayamalavagowla (#15)", "Natabhairavi (#20)"]'::jsonb,
 'Dheerasankarabharanam (#29)',
 'Hamsadhwani is derived from the 29th Melakarta Dheerasankarabharanam.'),

('mcq', 'lower', 'What swaras does Mohanam use in its arohana?',
 '["S R2 G3 P D2 S", "S R2 G3 P N3 S", "S R2 G3 M1 P D2 S", "S R1 G3 P D2 S"]'::jsonb,
 'S R2 G3 P D2 S',
 'Mohanam is a pentatonic raga omitting Ma and Ni, using S R2 G3 P D2 S.'),

('mcq', 'higher', 'Which composer used the mudra "Guruguha"?',
 '["Tyagaraja", "Muthuswami Dikshitar", "Syama Sastri", "Purandaradasa"]'::jsonb,
 'Muthuswami Dikshitar',
 'Muthuswami Dikshitar signed his compositions with the mudra Guruguha.'),

('mcq', 'higher', 'Bhairavi is a janya of which Melakarta?',
 '["Hanumattodi (#8)", "Natabhairavi (#20)", "Kharaharapriya (#22)", "Harikambhoji (#28)"]'::jsonb,
 'Natabhairavi (#20)',
 'Bhairavi is derived from the 20th Melakarta Natabhairavi, though it uses bhashanga swaras.'),

('mcq', 'higher', 'How many beats are in Khanda Chapu tala?',
 '["3", "5", "7", "9"]'::jsonb, '5',
 'Khanda Chapu has 5 beats grouped as 2+3.'),

('mcq', 'diploma', 'What distinguishes a Bhashanga raga?',
 '["It has exactly 5 swaras", "It uses foreign swaras not in the parent scale", "It is always vakra", "It has no avarohana"]'::jsonb,
 'It uses foreign swaras not in the parent scale',
 'Bhashanga ragas introduce anya swaras (foreign notes) beyond the parent Melakarta scale.'),

('mcq', 'diploma', 'Mayamalavagowla is which Melakarta number?',
 '["8", "15", "22", "29"]'::jsonb, '15',
 'Mayamalavagowla is the 15th Melakarta and the basis for sarali varisai lessons.'),

('mcq', 'degree', 'In Adi Tala, what does "I4" represent?',
 '["One Dhrutam of 4 beats", "One Laghu of 4 beats", "One Anudhrutam", "Four Dhrutams"]'::jsonb,
 'One Laghu of 4 beats',
 'In tala notation, I followed by a number indicates a Laghu with that many beats.'),

('theory_short', 'lower', 'Name the three composers known as the Carnatic Trinity.',
 null, 'Tyagaraja, Muthuswami Dikshitar, Syama Sastri',
 'The Trinity shaped the modern Carnatic kriti repertoire in the 18th-19th centuries.'),

('mcq', 'lower', 'Which instrument is NOT listed in Naadabrahma multi-instrument support?',
 '["Veena", "Sitar", "Flute", "Mridangam"]'::jsonb, 'Sitar',
 'Naadabrahma supports Vocal, Veena, Violin, Flute, Mridangam, and Keyboard.');
