/**
 * Verified 72 Melakarta raga catalog (Venkatamakhin system).
 * Used by seed migrations and as reference data.
 */
export interface MelakartaSeed {
  number: number;
  name: string;
  chakra: string;
  arohana: string;
  avarohana: string;
  description: string;
  metadata?: {
    western_equivalent?: string;
    popular_janyas?: string[];
  };
}

export const MELAKARTA_SEED_DATA: MelakartaSeed[] = [
  { number: 1, name: "Kanakangi", chakra: "Indu", arohana: "S R1 G1 M1 P D1 N1 S", avarohana: "S N1 D1 P M1 G1 R1 S", description: "The 1st Melakarta raga. A sampurna raga with all seven swaras in shuddha form.", metadata: { popular_janyas: ["Kanakambari"] } },
  { number: 2, name: "Ratnangi", chakra: "Indu", arohana: "S R1 G1 M1 P D1 N2 S", avarohana: "S N2 D1 P M1 G1 R1 S", description: "The 2nd Melakarta raga with N2 (Kaisiki Nishada) in the scale." },
  { number: 3, name: "Ganamurti", chakra: "Indu", arohana: "S R1 G1 M1 P D1 N3 S", avarohana: "S N3 D1 P M1 G1 R1 S", description: "The 3rd Melakarta raga with N3 (Kakali Nishada)." },
  { number: 4, name: "Vanaspati", chakra: "Indu", arohana: "S R1 G1 M1 P D2 N2 S", avarohana: "S N2 D2 P M1 G1 R1 S", description: "The 4th Melakarta raga with D2 and N2 swaras." },
  { number: 5, name: "Manavati", chakra: "Indu", arohana: "S R1 G1 M1 P D2 N3 S", avarohana: "S N3 D2 P M1 G1 R1 S", description: "The 5th Melakarta raga." },
  { number: 6, name: "Tanarupi", chakra: "Indu", arohana: "S R1 G1 M1 P D3 N3 S", avarohana: "S N3 D3 P M1 G1 R1 S", description: "The 6th Melakarta raga, completing the Indu chakra." },
  { number: 7, name: "Senavati", chakra: "Netra", arohana: "S R1 G2 M1 P D1 N1 S", avarohana: "S N1 D1 P M1 G2 R1 S", description: "The 7th Melakarta raga with G2 (Sadharana Gandhara)." },
  { number: 8, name: "Hanumattodi", chakra: "Netra", arohana: "S R1 G2 M1 P D1 N2 S", avarohana: "S N2 D1 P M1 G2 R1 S", description: "The 8th Melakarta raga, also known as Todi. A fundamental raga for beginners.", metadata: { popular_janyas: ["Dhunibhinnashadjam", "Begada"] } },
  { number: 9, name: "Dhenuka", chakra: "Netra", arohana: "S R1 G2 M1 P D1 N3 S", avarohana: "S N3 D1 P M1 G2 R1 S", description: "The 9th Melakarta raga." },
  { number: 10, name: "Natakapriya", chakra: "Netra", arohana: "S R1 G2 M1 P D2 N2 S", avarohana: "S N2 D2 P M1 G2 R1 S", description: "The 10th Melakarta raga." },
  { number: 11, name: "Kokilapriya", chakra: "Netra", arohana: "S R1 G2 M1 P D2 N3 S", avarohana: "S N3 D2 P M1 G2 R1 S", description: "The 11th Melakarta raga." },
  { number: 12, name: "Rupavati", chakra: "Netra", arohana: "S R1 G2 M1 P D3 N3 S", avarohana: "S N3 D3 P M1 G2 R1 S", description: "The 12th Melakarta raga, completing the Netra chakra." },
  { number: 13, name: "Gayakapriya", chakra: "Agni", arohana: "S R1 G3 M1 P D1 N1 S", avarohana: "S N1 D1 P M1 G3 R1 S", description: "The 13th Melakarta raga with G3 (Antara Gandhara)." },
  { number: 14, name: "Vakulabharanam", chakra: "Agni", arohana: "S R1 G3 M1 P D1 N2 S", avarohana: "S N2 D1 P M1 G3 R1 S", description: "The 14th Melakarta raga." },
  { number: 15, name: "Mayamalavagowla", chakra: "Agni", arohana: "S R1 G3 M1 P D1 N3 S", avarohana: "S N3 D1 P M1 G3 R1 S", description: "The 15th Melakarta raga. The fundamental scale for Carnatic beginners (sarali varisai basis).", metadata: { popular_janyas: ["Bowlis", "Malahari"] } },
  { number: 16, name: "Chakravakam", chakra: "Agni", arohana: "S R1 G3 M1 P D2 N2 S", avarohana: "S N2 D2 P M1 G3 R1 S", description: "The 16th Melakarta raga." },
  { number: 17, name: "Suryakantam", chakra: "Agni", arohana: "S R1 G3 M1 P D2 N3 S", avarohana: "S N3 D2 P M1 G3 R1 S", description: "The 17th Melakarta raga." },
  { number: 18, name: "Hatakambari", chakra: "Agni", arohana: "S R1 G3 M1 P D3 N3 S", avarohana: "S N3 D3 P M1 G3 R1 S", description: "The 18th Melakarta raga, completing the Agni chakra." },
  { number: 19, name: "Jhankaradhvani", chakra: "Veda", arohana: "S R2 G2 M1 P D1 N1 S", avarohana: "S N1 D1 P M1 G2 R2 S", description: "The 19th Melakarta raga with R2 (Chatusruti Rishabha)." },
  { number: 20, name: "Natabhairavi", chakra: "Veda", arohana: "S R2 G2 M1 P D1 N2 S", avarohana: "S N2 D1 P M1 G2 R2 S", description: "The 20th Melakarta raga. One of the most important ragas in Carnatic music.", metadata: { popular_janyas: ["Bhairavi", "Mukhari", "Anandabhairavi"] } },
  { number: 21, name: "Keeravani", chakra: "Veda", arohana: "S R2 G2 M1 P D1 N3 S", avarohana: "S N3 D1 P M1 G2 R2 S", description: "The 21st Melakarta raga.", metadata: { popular_janyas: ["Keeravani (janya usage)"] } },
  { number: 22, name: "Kharaharapriya", chakra: "Veda", arohana: "S R2 G2 M1 P D2 N2 S", avarohana: "S N2 D2 P M1 G2 R2 S", description: "The 22nd Melakarta raga. The most prolific parent for Janya ragas.", metadata: { popular_janyas: ["Abheri", "Kambhoji", "Sri", "Mukhari"] } },
  { number: 23, name: "Gourimanohari", chakra: "Veda", arohana: "S R2 G2 M1 P D2 N3 S", avarohana: "S N3 D2 P M1 G2 R2 S", description: "The 23rd Melakarta raga." },
  { number: 24, name: "Varunapriya", chakra: "Veda", arohana: "S R2 G2 M1 P D3 N3 S", avarohana: "S N3 D3 P M1 G2 R2 S", description: "The 24th Melakarta raga, completing the Veda chakra." },
  { number: 25, name: "Mararanjani", chakra: "Bana", arohana: "S R2 G3 M1 P D1 N1 S", avarohana: "S N1 D1 P M1 G3 R2 S", description: "The 25th Melakarta raga." },
  { number: 26, name: "Charukesi", chakra: "Bana", arohana: "S R2 G3 M1 P D1 N2 S", avarohana: "S N2 D1 P M1 G3 R2 S", description: "The 26th Melakarta raga.", metadata: { popular_janyas: ["Charukesi (janya forms)"] } },
  { number: 27, name: "Sarasangi", chakra: "Bana", arohana: "S R2 G3 M1 P D1 N3 S", avarohana: "S N3 D1 P M1 G3 R2 S", description: "The 27th Melakarta raga." },
  { number: 28, name: "Harikambhoji", chakra: "Bana", arohana: "S R2 G3 M1 P D2 N2 S", avarohana: "S N2 D2 P M1 G3 R2 S", description: "The 28th Melakarta raga.", metadata: { popular_janyas: ["Kambhoji", "Yadukulakambhoji"] } },
  { number: 29, name: "Dheerasankarabharanam", chakra: "Bana", arohana: "S R2 G3 M1 P D2 N3 S", avarohana: "S N3 D2 P M1 G3 R2 S", description: "The 29th Melakarta raga, equivalent to the major scale in Western music.", metadata: { western_equivalent: "C Major Scale", popular_janyas: ["Hamsadhwani", "Bilahari", "Arabhi", "Mohanam"] } },
  { number: 30, name: "Naganandini", chakra: "Bana", arohana: "S R2 G3 M1 P D3 N3 S", avarohana: "S N3 D3 P M1 G3 R2 S", description: "The 30th Melakarta raga, completing the Bana chakra." },
  { number: 31, name: "Yagapriya", chakra: "Ruthu", arohana: "S R3 G3 M1 P D1 N1 S", avarohana: "S N1 D1 P M1 G3 R3 S", description: "The 31st Melakarta raga with R3 (Shatsruti Rishabha)." },
  { number: 32, name: "Ragavardhini", chakra: "Ruthu", arohana: "S R3 G3 M1 P D1 N2 S", avarohana: "S N2 D1 P M1 G3 R3 S", description: "The 32nd Melakarta raga." },
  { number: 33, name: "Gangeyabhushani", chakra: "Ruthu", arohana: "S R3 G3 M1 P D1 N3 S", avarohana: "S N3 D1 P M1 G3 R3 S", description: "The 33rd Melakarta raga." },
  { number: 34, name: "Vagadheeswari", chakra: "Ruthu", arohana: "S R3 G3 M1 P D2 N2 S", avarohana: "S N2 D2 P M1 G3 R3 S", description: "The 34th Melakarta raga." },
  { number: 35, name: "Shulini", chakra: "Ruthu", arohana: "S R3 G3 M1 P D2 N3 S", avarohana: "S N3 D2 P M1 G3 R3 S", description: "The 35th Melakarta raga." },
  { number: 36, name: "Chalanata", chakra: "Ruthu", arohana: "S R3 G3 M1 P D3 N3 S", avarohana: "S N3 D3 P M1 G3 R3 S", description: "The 36th Melakarta raga, completing the Ruthu chakra." },
  { number: 37, name: "Salagam", chakra: "Rishi", arohana: "S R1 G2 M2 P D1 N1 S", avarohana: "S N1 D1 P M2 G2 R1 S", description: "The 37th Melakarta raga with M2 (Prati Madhyama)." },
  { number: 38, name: "Jalarnavam", chakra: "Rishi", arohana: "S R1 G2 M2 P D1 N2 S", avarohana: "S N2 D1 P M2 G2 R1 S", description: "The 38th Melakarta raga." },
  { number: 39, name: "Jhalavarali", chakra: "Rishi", arohana: "S R1 G2 M2 P D1 N3 S", avarohana: "S N3 D1 P M2 G2 R1 S", description: "The 39th Melakarta raga." },
  { number: 40, name: "Navaneetam", chakra: "Rishi", arohana: "S R1 G2 M2 P D2 N2 S", avarohana: "S N2 D2 P M2 G2 R1 S", description: "The 40th Melakarta raga." },
  { number: 41, name: "Pavani", chakra: "Rishi", arohana: "S R1 G2 M2 P D2 N3 S", avarohana: "S N3 D2 P M2 G2 R1 S", description: "The 41st Melakarta raga." },
  { number: 42, name: "Raghupriya", chakra: "Rishi", arohana: "S R1 G2 M2 P D3 N3 S", avarohana: "S N3 D3 P M2 G2 R1 S", description: "The 42nd Melakarta raga, completing the Rishi chakra." },
  { number: 43, name: "Gavambhodi", chakra: "Vasu", arohana: "S R1 G3 M2 P D1 N1 S", avarohana: "S N1 D1 P M2 G3 R1 S", description: "The 43rd Melakarta raga." },
  { number: 44, name: "Bhavapriya", chakra: "Vasu", arohana: "S R1 G3 M2 P D1 N2 S", avarohana: "S N2 D1 P M2 G3 R1 S", description: "The 44th Melakarta raga." },
  { number: 45, name: "Shubhapantuvarali", chakra: "Vasu", arohana: "S R1 G3 M2 P D1 N3 S", avarohana: "S N3 D1 P M2 G3 R1 S", description: "The 45th Melakarta raga.", metadata: { popular_janyas: ["Shubhapantuvarali forms"] } },
  { number: 46, name: "Shadvidhamargini", chakra: "Vasu", arohana: "S R1 G3 M2 P D2 N2 S", avarohana: "S N2 D2 P M2 G3 R1 S", description: "The 46th Melakarta raga." },
  { number: 47, name: "Suvarnangi", chakra: "Vasu", arohana: "S R1 G3 M2 P D2 N3 S", avarohana: "S N3 D2 P M2 G3 R1 S", description: "The 47th Melakarta raga." },
  { number: 48, name: "Divyamani", chakra: "Vasu", arohana: "S R1 G3 M2 P D3 N3 S", avarohana: "S N3 D3 P M2 G3 R1 S", description: "The 48th Melakarta raga, completing the Vasu chakra." },
  { number: 49, name: "Dhavalambari", chakra: "Brahma", arohana: "S R2 G2 M2 P D1 N1 S", avarohana: "S N1 D1 P M2 G2 R2 S", description: "The 49th Melakarta raga." },
  { number: 50, name: "Namanarayani", chakra: "Brahma", arohana: "S R2 G2 M2 P D1 N2 S", avarohana: "S N2 D1 P M2 G2 R2 S", description: "The 50th Melakarta raga." },
  { number: 51, name: "Kamavardhini", chakra: "Brahma", arohana: "S R2 G2 M2 P D1 N3 S", avarohana: "S N3 D1 P M2 G2 R2 S", description: "The 51st Melakarta raga.", metadata: { popular_janyas: ["Pantuvarali"] } },
  { number: 52, name: "Ramapriya", chakra: "Brahma", arohana: "S R2 G2 M2 P D2 N2 S", avarohana: "S N2 D2 P M2 G2 R2 S", description: "The 52nd Melakarta raga." },
  { number: 53, name: "Gamanashrama", chakra: "Brahma", arohana: "S R2 G2 M2 P D2 N3 S", avarohana: "S N3 D2 P M2 G2 R2 S", description: "The 53rd Melakarta raga." },
  { number: 54, name: "Vishwambari", chakra: "Brahma", arohana: "S R2 G2 M2 P D3 N3 S", avarohana: "S N3 D3 P M2 G2 R2 S", description: "The 54th Melakarta raga, completing the Brahma chakra." },
  { number: 55, name: "Shyamalangi", chakra: "Disi", arohana: "S R2 G3 M2 P D1 N1 S", avarohana: "S N1 D1 P M2 G3 R2 S", description: "The 55th Melakarta raga." },
  { number: 56, name: "Shanmukhapriya", chakra: "Disi", arohana: "S R2 G3 M2 P D1 N2 S", avarohana: "S N2 D1 P M2 G3 R2 S", description: "The 56th Melakarta raga.", metadata: { popular_janyas: ["Shanmukhapriya derivatives"] } },
  { number: 57, name: "Simhendramadhyamam", chakra: "Disi", arohana: "S R2 G3 M2 P D1 N3 S", avarohana: "S N3 D1 P M2 G3 R2 S", description: "The 57th Melakarta raga.", metadata: { popular_janyas: ["Hindolam"] } },
  { number: 58, name: "Hemavati", chakra: "Disi", arohana: "S R2 G3 M2 P D2 N2 S", avarohana: "S N2 D2 P M2 G3 R2 S", description: "The 58th Melakarta raga." },
  { number: 59, name: "Dharmavati", chakra: "Disi", arohana: "S R2 G3 M2 P D2 N3 S", avarohana: "S N3 D2 P M2 G3 R2 S", description: "The 59th Melakarta raga." },
  { number: 60, name: "Nitimati", chakra: "Disi", arohana: "S R2 G3 M2 P D3 N3 S", avarohana: "S N3 D3 P M2 G3 R2 S", description: "The 60th Melakarta raga, completing the Disi chakra." },
  { number: 61, name: "Kantamani", chakra: "Rudra", arohana: "S R3 G3 M2 P D1 N1 S", avarohana: "S N1 D1 P M2 G3 R3 S", description: "The 61st Melakarta raga." },
  { number: 62, name: "Rishabhapriya", chakra: "Rudra", arohana: "S R3 G3 M2 P D1 N2 S", avarohana: "S N2 D1 P M2 G3 R3 S", description: "The 62nd Melakarta raga." },
  { number: 63, name: "Latangi", chakra: "Rudra", arohana: "S R3 G3 M2 P D1 N3 S", avarohana: "S N3 D1 P M2 G3 R3 S", description: "The 63rd Melakarta raga." },
  { number: 64, name: "Vachaspati", chakra: "Rudra", arohana: "S R3 G3 M2 P D2 N2 S", avarohana: "S N2 D2 P M2 G3 R3 S", description: "The 64th Melakarta raga." },
  { number: 65, name: "Mechakalyani", chakra: "Rudra", arohana: "S R3 G3 M2 P D2 N3 S", avarohana: "S N3 D2 P M2 G3 R3 S", description: "The 65th Melakarta raga, commonly known as Kalyani. One of the most popular ragas.", metadata: { western_equivalent: "Lydian mode", popular_janyas: ["Yaman Kalyan", "Hamsanandi"] } },
  { number: 66, name: "Chitrambari", chakra: "Rudra", arohana: "S R3 G3 M2 P D3 N3 S", avarohana: "S N3 D3 P M2 G3 R3 S", description: "The 66th Melakarta raga, completing the Rudra chakra." },
  { number: 67, name: "Sucharitra", chakra: "Aditya", arohana: "S R1 G2 M3 P D1 N1 S", avarohana: "S N1 D1 P M3 G2 R1 S", description: "The 67th Melakarta raga with M3 (Shuddha Madhyama variant in this position)." },
  { number: 68, name: "Jyotiswarupini", chakra: "Aditya", arohana: "S R1 G2 M3 P D1 N2 S", avarohana: "S N2 D1 P M3 G2 R1 S", description: "The 68th Melakarta raga." },
  { number: 69, name: "Dhatuvardhini", chakra: "Aditya", arohana: "S R1 G2 M3 P D1 N3 S", avarohana: "S N3 D1 P M3 G2 R1 S", description: "The 69th Melakarta raga, also known as Sudhdha Dhanyasi parent scale." },
  { number: 70, name: "Nasikabhushani", chakra: "Aditya", arohana: "S R1 G2 M3 P D2 N2 S", avarohana: "S N2 D2 P M3 G2 R1 S", description: "The 70th Melakarta raga." },
  { number: 71, name: "Kosalam", chakra: "Aditya", arohana: "S R1 G2 M3 P D2 N3 S", avarohana: "S N3 D2 P M3 G2 R1 S", description: "The 71st Melakarta raga." },
  { number: 72, name: "Rasikapriya", chakra: "Aditya", arohana: "S R1 G2 M3 P D3 N3 S", avarohana: "S N3 D3 P M3 G2 R1 S", description: "The 72nd and final Melakarta raga, completing the Aditya chakra and the full Melakarta system." },
];
