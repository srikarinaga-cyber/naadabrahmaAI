-- Seed all 72 Melakarta ragas

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (1, 'Kanakangi', 'Indu', 'S R1 G1 M1 P D1 N1 S', 'S N1 D1 P M1 G1 R1 S', 'The 1st Melakarta raga. A sampurna raga with all seven swaras in shuddha form.', '{"popular_janyas":["Kanakambari"]}'::jsonb)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (2, 'Ratnangi', 'Indu', 'S R1 G1 M1 P D1 N2 S', 'S N2 D1 P M1 G1 R1 S', 'The 2nd Melakarta raga with N2 (Kaisiki Nishada) in the scale.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (3, 'Ganamurti', 'Indu', 'S R1 G1 M1 P D1 N3 S', 'S N3 D1 P M1 G1 R1 S', 'The 3rd Melakarta raga with N3 (Kakali Nishada).', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (4, 'Vanaspati', 'Indu', 'S R1 G1 M1 P D2 N2 S', 'S N2 D2 P M1 G1 R1 S', 'The 4th Melakarta raga with D2 and N2 swaras.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (5, 'Manavati', 'Indu', 'S R1 G1 M1 P D2 N3 S', 'S N3 D2 P M1 G1 R1 S', 'The 5th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (6, 'Tanarupi', 'Indu', 'S R1 G1 M1 P D3 N3 S', 'S N3 D3 P M1 G1 R1 S', 'The 6th Melakarta raga, completing the Indu chakra.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (7, 'Senavati', 'Netra', 'S R1 G2 M1 P D1 N1 S', 'S N1 D1 P M1 G2 R1 S', 'The 7th Melakarta raga with G2 (Sadharana Gandhara).', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (8, 'Hanumattodi', 'Netra', 'S R1 G2 M1 P D1 N2 S', 'S N2 D1 P M1 G2 R1 S', 'The 8th Melakarta raga, also known as Todi. A fundamental raga for beginners.', '{"popular_janyas":["Dhunibhinnashadjam","Begada"]}'::jsonb)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (9, 'Dhenuka', 'Netra', 'S R1 G2 M1 P D1 N3 S', 'S N3 D1 P M1 G2 R1 S', 'The 9th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (10, 'Natakapriya', 'Netra', 'S R1 G2 M1 P D2 N2 S', 'S N2 D2 P M1 G2 R1 S', 'The 10th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (11, 'Kokilapriya', 'Netra', 'S R1 G2 M1 P D2 N3 S', 'S N3 D2 P M1 G2 R1 S', 'The 11th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (12, 'Rupavati', 'Netra', 'S R1 G2 M1 P D3 N3 S', 'S N3 D3 P M1 G2 R1 S', 'The 12th Melakarta raga, completing the Netra chakra.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (13, 'Gayakapriya', 'Agni', 'S R1 G3 M1 P D1 N1 S', 'S N1 D1 P M1 G3 R1 S', 'The 13th Melakarta raga with G3 (Antara Gandhara).', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (14, 'Vakulabharanam', 'Agni', 'S R1 G3 M1 P D1 N2 S', 'S N2 D1 P M1 G3 R1 S', 'The 14th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (15, 'Mayamalavagowla', 'Agni', 'S R1 G3 M1 P D1 N3 S', 'S N3 D1 P M1 G3 R1 S', 'The 15th Melakarta raga. The fundamental scale for Carnatic beginners (sarali varisai basis).', '{"popular_janyas":["Bowlis","Malahari"]}'::jsonb)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (16, 'Chakravakam', 'Agni', 'S R1 G3 M1 P D2 N2 S', 'S N2 D2 P M1 G3 R1 S', 'The 16th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (17, 'Suryakantam', 'Agni', 'S R1 G3 M1 P D2 N3 S', 'S N3 D2 P M1 G3 R1 S', 'The 17th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (18, 'Hatakambari', 'Agni', 'S R1 G3 M1 P D3 N3 S', 'S N3 D3 P M1 G3 R1 S', 'The 18th Melakarta raga, completing the Agni chakra.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (19, 'Jhankaradhvani', 'Veda', 'S R2 G2 M1 P D1 N1 S', 'S N1 D1 P M1 G2 R2 S', 'The 19th Melakarta raga with R2 (Chatusruti Rishabha).', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (20, 'Natabhairavi', 'Veda', 'S R2 G2 M1 P D1 N2 S', 'S N2 D1 P M1 G2 R2 S', 'The 20th Melakarta raga. One of the most important ragas in Carnatic music.', '{"popular_janyas":["Bhairavi","Mukhari","Anandabhairavi"]}'::jsonb)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (21, 'Keeravani', 'Veda', 'S R2 G2 M1 P D1 N3 S', 'S N3 D1 P M1 G2 R2 S', 'The 21st Melakarta raga.', '{"popular_janyas":["Keeravani (janya usage)"]}'::jsonb)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (22, 'Kharaharapriya', 'Veda', 'S R2 G2 M1 P D2 N2 S', 'S N2 D2 P M1 G2 R2 S', 'The 22nd Melakarta raga. The most prolific parent for Janya ragas.', '{"popular_janyas":["Abheri","Kambhoji","Sri","Mukhari"]}'::jsonb)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (23, 'Gourimanohari', 'Veda', 'S R2 G2 M1 P D2 N3 S', 'S N3 D2 P M1 G2 R2 S', 'The 23rd Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (24, 'Varunapriya', 'Veda', 'S R2 G2 M1 P D3 N3 S', 'S N3 D3 P M1 G2 R2 S', 'The 24th Melakarta raga, completing the Veda chakra.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (25, 'Mararanjani', 'Bana', 'S R2 G3 M1 P D1 N1 S', 'S N1 D1 P M1 G3 R2 S', 'The 25th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (26, 'Charukesi', 'Bana', 'S R2 G3 M1 P D1 N2 S', 'S N2 D1 P M1 G3 R2 S', 'The 26th Melakarta raga.', '{"popular_janyas":["Charukesi (janya forms)"]}'::jsonb)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (27, 'Sarasangi', 'Bana', 'S R2 G3 M1 P D1 N3 S', 'S N3 D1 P M1 G3 R2 S', 'The 27th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (28, 'Harikambhoji', 'Bana', 'S R2 G3 M1 P D2 N2 S', 'S N2 D2 P M1 G3 R2 S', 'The 28th Melakarta raga.', '{"popular_janyas":["Kambhoji","Yadukulakambhoji"]}'::jsonb)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (29, 'Dheerasankarabharanam', 'Bana', 'S R2 G3 M1 P D2 N3 S', 'S N3 D2 P M1 G3 R2 S', 'The 29th Melakarta raga, equivalent to the major scale in Western music.', '{"western_equivalent":"C Major Scale","popular_janyas":["Hamsadhwani","Bilahari","Arabhi","Mohanam"]}'::jsonb)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (30, 'Naganandini', 'Bana', 'S R2 G3 M1 P D3 N3 S', 'S N3 D3 P M1 G3 R2 S', 'The 30th Melakarta raga, completing the Bana chakra.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (31, 'Yagapriya', 'Ruthu', 'S R3 G3 M1 P D1 N1 S', 'S N1 D1 P M1 G3 R3 S', 'The 31st Melakarta raga with R3 (Shatsruti Rishabha).', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (32, 'Ragavardhini', 'Ruthu', 'S R3 G3 M1 P D1 N2 S', 'S N2 D1 P M1 G3 R3 S', 'The 32nd Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (33, 'Gangeyabhushani', 'Ruthu', 'S R3 G3 M1 P D1 N3 S', 'S N3 D1 P M1 G3 R3 S', 'The 33rd Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (34, 'Vagadheeswari', 'Ruthu', 'S R3 G3 M1 P D2 N2 S', 'S N2 D2 P M1 G3 R3 S', 'The 34th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (35, 'Shulini', 'Ruthu', 'S R3 G3 M1 P D2 N3 S', 'S N3 D2 P M1 G3 R3 S', 'The 35th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (36, 'Chalanata', 'Ruthu', 'S R3 G3 M1 P D3 N3 S', 'S N3 D3 P M1 G3 R3 S', 'The 36th Melakarta raga, completing the Ruthu chakra.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (37, 'Salagam', 'Rishi', 'S R1 G2 M2 P D1 N1 S', 'S N1 D1 P M2 G2 R1 S', 'The 37th Melakarta raga with M2 (Prati Madhyama).', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (38, 'Jalarnavam', 'Rishi', 'S R1 G2 M2 P D1 N2 S', 'S N2 D1 P M2 G2 R1 S', 'The 38th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (39, 'Jhalavarali', 'Rishi', 'S R1 G2 M2 P D1 N3 S', 'S N3 D1 P M2 G2 R1 S', 'The 39th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (40, 'Navaneetam', 'Rishi', 'S R1 G2 M2 P D2 N2 S', 'S N2 D2 P M2 G2 R1 S', 'The 40th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (41, 'Pavani', 'Rishi', 'S R1 G2 M2 P D2 N3 S', 'S N3 D2 P M2 G2 R1 S', 'The 41st Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (42, 'Raghupriya', 'Rishi', 'S R1 G2 M2 P D3 N3 S', 'S N3 D3 P M2 G2 R1 S', 'The 42nd Melakarta raga, completing the Rishi chakra.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (43, 'Gavambhodi', 'Vasu', 'S R1 G3 M2 P D1 N1 S', 'S N1 D1 P M2 G3 R1 S', 'The 43rd Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (44, 'Bhavapriya', 'Vasu', 'S R1 G3 M2 P D1 N2 S', 'S N2 D1 P M2 G3 R1 S', 'The 44th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (45, 'Shubhapantuvarali', 'Vasu', 'S R1 G3 M2 P D1 N3 S', 'S N3 D1 P M2 G3 R1 S', 'The 45th Melakarta raga.', '{"popular_janyas":["Shubhapantuvarali forms"]}'::jsonb)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (46, 'Shadvidhamargini', 'Vasu', 'S R1 G3 M2 P D2 N2 S', 'S N2 D2 P M2 G3 R1 S', 'The 46th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (47, 'Suvarnangi', 'Vasu', 'S R1 G3 M2 P D2 N3 S', 'S N3 D2 P M2 G3 R1 S', 'The 47th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (48, 'Divyamani', 'Vasu', 'S R1 G3 M2 P D3 N3 S', 'S N3 D3 P M2 G3 R1 S', 'The 48th Melakarta raga, completing the Vasu chakra.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (49, 'Dhavalambari', 'Brahma', 'S R2 G2 M2 P D1 N1 S', 'S N1 D1 P M2 G2 R2 S', 'The 49th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (50, 'Namanarayani', 'Brahma', 'S R2 G2 M2 P D1 N2 S', 'S N2 D1 P M2 G2 R2 S', 'The 50th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (51, 'Kamavardhini', 'Brahma', 'S R2 G2 M2 P D1 N3 S', 'S N3 D1 P M2 G2 R2 S', 'The 51st Melakarta raga.', '{"popular_janyas":["Pantuvarali"]}'::jsonb)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (52, 'Ramapriya', 'Brahma', 'S R2 G2 M2 P D2 N2 S', 'S N2 D2 P M2 G2 R2 S', 'The 52nd Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (53, 'Gamanashrama', 'Brahma', 'S R2 G2 M2 P D2 N3 S', 'S N3 D2 P M2 G2 R2 S', 'The 53rd Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (54, 'Vishwambari', 'Brahma', 'S R2 G2 M2 P D3 N3 S', 'S N3 D3 P M2 G2 R2 S', 'The 54th Melakarta raga, completing the Brahma chakra.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (55, 'Shyamalangi', 'Disi', 'S R2 G3 M2 P D1 N1 S', 'S N1 D1 P M2 G3 R2 S', 'The 55th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (56, 'Shanmukhapriya', 'Disi', 'S R2 G3 M2 P D1 N2 S', 'S N2 D1 P M2 G3 R2 S', 'The 56th Melakarta raga.', '{"popular_janyas":["Shanmukhapriya derivatives"]}'::jsonb)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (57, 'Simhendramadhyamam', 'Disi', 'S R2 G3 M2 P D1 N3 S', 'S N3 D1 P M2 G3 R2 S', 'The 57th Melakarta raga.', '{"popular_janyas":["Hindolam"]}'::jsonb)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (58, 'Hemavati', 'Disi', 'S R2 G3 M2 P D2 N2 S', 'S N2 D2 P M2 G3 R2 S', 'The 58th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (59, 'Dharmavati', 'Disi', 'S R2 G3 M2 P D2 N3 S', 'S N3 D2 P M2 G3 R2 S', 'The 59th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (60, 'Nitimati', 'Disi', 'S R2 G3 M2 P D3 N3 S', 'S N3 D3 P M2 G3 R2 S', 'The 60th Melakarta raga, completing the Disi chakra.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (61, 'Kantamani', 'Rudra', 'S R3 G3 M2 P D1 N1 S', 'S N1 D1 P M2 G3 R3 S', 'The 61st Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (62, 'Rishabhapriya', 'Rudra', 'S R3 G3 M2 P D1 N2 S', 'S N2 D1 P M2 G3 R3 S', 'The 62nd Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (63, 'Latangi', 'Rudra', 'S R3 G3 M2 P D1 N3 S', 'S N3 D1 P M2 G3 R3 S', 'The 63rd Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (64, 'Vachaspati', 'Rudra', 'S R3 G3 M2 P D2 N2 S', 'S N2 D2 P M2 G3 R3 S', 'The 64th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (65, 'Mechakalyani', 'Rudra', 'S R3 G3 M2 P D2 N3 S', 'S N3 D2 P M2 G3 R3 S', 'The 65th Melakarta raga, commonly known as Kalyani. One of the most popular ragas.', '{"western_equivalent":"Lydian mode","popular_janyas":["Yaman Kalyan","Hamsanandi"]}'::jsonb)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (66, 'Chitrambari', 'Rudra', 'S R3 G3 M2 P D3 N3 S', 'S N3 D3 P M2 G3 R3 S', 'The 66th Melakarta raga, completing the Rudra chakra.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (67, 'Sucharitra', 'Aditya', 'S R1 G2 M3 P D1 N1 S', 'S N1 D1 P M3 G2 R1 S', 'The 67th Melakarta raga with M3 (Shuddha Madhyama variant in this position).', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (68, 'Jyotiswarupini', 'Aditya', 'S R1 G2 M3 P D1 N2 S', 'S N2 D1 P M3 G2 R1 S', 'The 68th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (69, 'Dhatuvardhini', 'Aditya', 'S R1 G2 M3 P D1 N3 S', 'S N3 D1 P M3 G2 R1 S', 'The 69th Melakarta raga, also known as Sudhdha Dhanyasi parent scale.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (70, 'Nasikabhushani', 'Aditya', 'S R1 G2 M3 P D2 N2 S', 'S N2 D2 P M3 G2 R1 S', 'The 70th Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (71, 'Kosalam', 'Aditya', 'S R1 G2 M3 P D2 N3 S', 'S N3 D2 P M3 G2 R1 S', 'The 71st Melakarta raga.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

insert into melakartas (number, name, chakra, arohana, avarohana, description, metadata)
values (72, 'Rasikapriya', 'Aditya', 'S R1 G2 M3 P D3 N3 S', 'S N3 D3 P M3 G2 R1 S', 'The 72nd and final Melakarta raga, completing the Aditya chakra and the full Melakarta system.', null)
on conflict (number) do update set
  name = excluded.name, chakra = excluded.chakra, arohana = excluded.arohana,
  avarohana = excluded.avarohana, description = excluded.description, metadata = excluded.metadata;

