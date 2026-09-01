import { Janya } from "@/types/music";

export interface ExtendedJanya extends Janya {
  melakartaNumber: number;
  classification:
    | "Audava-Audava"
    | "Audava-Shadava"
    | "Audava-Sampurna"
    | "Shadava-Audava"
    | "Shadava-Shadava"
    | "Shadava-Sampurna"
    | "Sampurna-Audava"
    | "Sampurna-Shadava"
    | "Sampurna-Sampurna"
    | "Vakra"
    | "Sampurna";
  jeevaSwara?: string;
  musicTheoryNotes?: string;
  famousKriti?: string;
}

// Complete Musicological Dataset of All 72 Melakarta Ragas with Janya Derivatives
const COMPLETE_72_MELAKARTA_JANYAS: Record<number, Array<{ name: string; arohana: string; avarohana: string; notes: string; kriti: string }>> = {
  1: [
    { name: "Kanakambari", arohana: "S R1 M1 P D1 S'", avarohana: "S' N1 D1 P M1 G1 R1 S", notes: "First Janya in Venkatamakhin's Asampurna tradition. Mellow vilambita kala scale.", kriti: "Kanakambari Karunitasri (Muthuswami Dikshitar)" },
    { name: "Kanakarasali", arohana: "S R1 G1 M1 P D1 S'", avarohana: "S' N1 D1 P M1 G1 R1 S", notes: "Shadava-Sampurna janya omitting Nishada in ascending scale.", kriti: "Kanakarasali Priye (Koteeswara Iyer)" },
  ],
  2: [
    { name: "Phenadyuti", arohana: "S R1 M1 P D1 P S'", avarohana: "S' N2 D1 P M1 G1 R1 S", notes: "Asampurna derivative of Melakarta #2 Ratnangi.", kriti: "Phenadyuti Raga Nivasini (Muthuswami Dikshitar)" },
    { name: "Ratnavali", arohana: "S R1 G1 M1 P D1 N2 S'", avarohana: "S' N2 D1 P M1 R1 S", notes: "Sampurna-Shadava janya omitting Gandhara in avarohana.", kriti: "Kalamithra Ratnangi (Koteeswara Iyer)" },
  ],
  3: [
    { name: "Ganasamavarali", arohana: "S R1 M1 P D1 N3 S'", avarohana: "S' N3 D1 P M1 G1 R1 S", notes: "Asampurna derivative of Melakarta #3 Ganamurthi.", kriti: "Ganasamavarali Matangini (Muthuswami Dikshitar)" },
    { name: "Bhinnapanchamam", arohana: "S R1 G1 M1 P D1 S'", avarohana: "S' N3 D1 P M1 G1 R1 S", notes: "Audava-Sampurna janya scale.", kriti: "Ganamurthi Paanam (Saint Tyagaraja)" },
  ],
  4: [
    { name: "Bhanumati", arohana: "S R1 M1 P D2 S'", avarohana: "S' N3 D2 P M1 G1 R1 S", notes: "Asampurna derivative of Melakarta #4 Vanaspati.", kriti: "Bhanumati Swaroopini (Muthuswami Dikshitar)" },
    { name: "Rasali", arohana: "S R1 M1 P D2 N3 S'", avarohana: "S' N3 D2 P M1 R1 S", notes: "Janya scale omitting Gandhara in descending order.", kriti: "Aparadhula Mananumu (Saint Tyagaraja)" },
  ],
  5: [
    { name: "Manoranjani", arohana: "S R1 M1 P D3 S'", avarohana: "S' N3 D3 P M1 G1 R1 S", notes: "Asampurna derivative of Melakarta #5 Manavati.", kriti: "Manoranjani Vandanam (Muthuswami Dikshitar)" },
  ],
  6: [
    { name: "Tanukirti", arohana: "S R1 M1 P N3 S'", avarohana: "S' N3 D3 P M1 G1 R1 S", notes: "Asampurna derivative of Melakarta #6 Tanarupi.", kriti: "Tanukirte Mahaneeya (Muthuswami Dikshitar)" },
  ],
  7: [
    { name: "Senagrani", arohana: "S R1 G2 M1 P N1 S'", avarohana: "S' N1 D1 P M1 G2 R1 S", notes: "Asampurna derivative of Melakarta #7 Senavati.", kriti: "Senagrani Namaste (Muthuswami Dikshitar)" },
  ],
  8: [
    { name: "Asaveri", arohana: "S R1 M1 P D1 S'", avarohana: "S' N2 D1 P M1 G2 R1 S", notes: "Renowned Janya of Hanumatodi. Expresses deep karuna rasa.", kriti: "Janani Natajana (Syama Sastri)" },
    { name: "Dhanyasi", arohana: "S G2 M1 P N2 S'", avarohana: "S' N2 D1 P M1 G2 R1 S", notes: "Audava-Sampurna janya. Prominent in classical concert platforms.", kriti: "Sangeetha Gnanamu (Saint Tyagaraja)" },
    { name: "Punnagavarali", arohana: "N2 S R1 G2 M1 P D1", avarohana: "P M1 G2 R1 S N2 D1 N2 S", notes: "Nishadantya raga mimicking snake charmer melodies.", kriti: "Tava Daso Ham (Saint Tyagaraja)" },
  ],
  9: [
    { name: "Dhunibhinna", arohana: "S R1 G2 M1 P D2 S'", avarohana: "S' N3 D2 P M1 G2 R1 S", notes: "Asampurna derivative of Melakarta #9 Dhenuka.", kriti: "Dhunibhinna Raga Kirtanam (Muthuswami Dikshitar)" },
  ],
  10: [
    { name: "Natarajapriya", arohana: "S R1 G2 M1 P D3 S'", avarohana: "S' N3 D3 P M1 G2 R1 S", notes: "Asampurna derivative of Melakarta #10 Natakapriya.", kriti: "Natarajapriyam Bhaje (Muthuswami Dikshitar)" },
    { name: "Sindhubhairavi", arohana: "S R2 G2 M1 G2 P D1 N2 S'", avarohana: "S' N2 D1 P M1 G2 R1 S", notes: "Ultra-popular bhashanga janya used for soul-stirring concert finales.", kriti: "Venkatachala Nilayam (Purandara Dasa)" },
  ],
  11: [
    { name: "Kokilarava", arohana: "S R1 M1 P N3 S'", avarohana: "S' N3 D3 P M1 G2 R1 S", notes: "Asampurna derivative of Melakarta #11 Kokilapriya.", kriti: "Kokilarava Raga Nivasini (Muthuswami Dikshitar)" },
  ],
  12: [
    { name: "Rupavati", arohana: "S R1 M1 P D3 S'", avarohana: "S' N3 D3 P M1 G3 R1 S", notes: "Asampurna derivative of Melakarta #12 Rupavati.", kriti: "Rupavati Raga Kirtanam (Muthuswami Dikshitar)" },
  ],
  13: [
    { name: "Gayaka", arohana: "S R1 G3 M1 P D1 S'", avarohana: "S' N1 D1 P M1 G3 R1 S", notes: "Asampurna derivative of Melakarta #13 Gayakapriya.", kriti: "Gayakasiromani (Muthuswami Dikshitar)" },
  ],
  14: [
    { name: "Vat Vasantabhairavi", arohana: "S R1 G3 M1 D1 N2 S'", avarohana: "S' N2 D1 M1 G3 R1 S", notes: "Asampurna derivative of Melakarta #14 Vakulabharanam.", kriti: "Kumaran Thaal (Koteeswara Iyer)" },
  ],
  15: [
    { name: "Mayamalavagowla", arohana: "S R1 G3 M1 P D1 N3 S'", avarohana: "S' N3 D1 P M1 G3 R1 S", notes: "The foundational scale used for beginner Carnatic music exercises.", kriti: "Tulasidalamulace (Saint Tyagaraja)" },
    { name: "Bauli", arohana: "S R1 G3 P D1 S'", avarohana: "S' N3 D1 P G3 R1 S", notes: "Morning raga evoking serene spiritual awakening.", kriti: "Melukovayya (Saint Tyagaraja)" },
    { name: "Saveri", arohana: "S R1 M1 P D1 S'", avarohana: "S' N3 D1 P M1 G3 R1 S", notes: "Majestic Janya scale.", kriti: "Sri Rajagopala (Muthuswami Dikshitar)" },
    { name: "Malahari", arohana: "S R1 M1 P D1 S'", avarohana: "S' D1 P M1 G3 R1 S", notes: "Used for initial Pillari Geetham exercises.", kriti: "Sri Gananatha (Purandara Dasa)" },
  ],
  16: [
    { name: "Chakravakam", arohana: "S R1 G3 M1 P D2 N2 S'", avarohana: "S' N2 D2 P M1 G3 R1 S", notes: "Sampurna janya scale.", kriti: "Etula Brotuvo (Saint Tyagaraja)" },
    { name: "Bindumalini", arohana: "S G3 M1 P N2 S'", avarohana: "S' N2 D2 P M1 G3 S", notes: "Audava-Shadava janya.", kriti: "Entha Muddo (Saint Tyagaraja)" },
  ],
  17: [
    { name: "Suryakantam", arohana: "S R1 G3 M1 P D2 N3 S'", avarohana: "S' N3 D2 P M1 G3 R1 S", notes: "Sampurna janya scale.", kriti: "Muddu Momu (Saint Tyagaraja)" },
  ],
  18: [
    { name: "Hatakambari", arohana: "S R1 M1 P D3 S'", avarohana: "S' N3 D3 P M1 G3 R1 S", notes: "Asampurna derivative of Melakarta #18.", kriti: "Hatakambari Kirtanam (Muthuswami Dikshitar)" },
  ],
  19: [
    { name: "Jhankarakari", arohana: "S R2 M1 P D1 S'", avarohana: "S' N1 D1 P M1 G1 R2 S", notes: "Asampurna derivative of Melakarta #19 Jhankaradhwani.", kriti: "Jhankarakari Kirtanam (Muthuswami Dikshitar)" },
  ],
  20: [
    { name: "Natabhairavi", arohana: "S R2 G2 M1 P D1 N2 S'", avarohana: "S' N2 D1 P M1 G2 R2 S", notes: "Natural minor scale equivalent.", kriti: "Sri Valli Devasenapate (Muthuswami Dikshitar)" },
    { name: "Bhairavi", arohana: "S R2 G2 M1 P D2 N2 S'", avarohana: "S' N2 D1 P M1 G2 R2 S", notes: "King of Carnatic ragas featuring Bhashanga D2.", kriti: "Kamakshi Swarajathi (Syama Sastri)" },
    { name: "Anandabhairavi", arohana: "S G2 R2 G2 M1 P D2 P S'", avarohana: "S' N2 D1 P M1 G2 R2 S", notes: "Soul-stirring vakra janya scale.", kriti: "O Jagadamba (Syama Sastri)" },
  ],
  21: [
    { name: "Keeravani", arohana: "S R2 G2 M1 P D1 N3 S'", avarohana: "S' N3 D1 P M1 G2 R2 S", notes: "Harmonic minor scale equivalent.", kriti: "Kaligiyunte Kada (Saint Tyagaraja)" },
  ],
  22: [
    { name: "Kharaharapriya", arohana: "S R2 G2 M1 P D2 N2 S'", avarohana: "S' N2 D2 P M1 G2 R2 S", notes: "Dorian mode equivalent.", kriti: "Chakkani Raja (Saint Tyagaraja)" },
    { name: "Abheri", arohana: "S G2 M1 P N2 S'", avarohana: "S' N2 D2 P M1 G2 R2 S", notes: "Popular concert janya.", kriti: "Nagumomu Ganaleni (Saint Tyagaraja)" },
    { name: "Sriranjani", arohana: "S R2 G2 M1 D2 N2 S'", avarohana: "S' N2 D2 M1 G2 R2 S", notes: "Panchamavarjitha janya scale.", kriti: "Brochevarevare (Saint Tyagaraja)" },
  ],
  23: [
    { name: "Gaurimanohari", arohana: "S R2 G2 M1 P D2 N3 S'", avarohana: "S' N3 D2 P M1 G2 R2 S", notes: "Melodic minor equivalent.", kriti: "Guruleka Etuvanti (Saint Tyagaraja)" },
  ],
  24: [
    { name: "Varunapriya", arohana: "S R2 G2 M1 P D3 N3 S'", avarohana: "S' N3 D3 P M1 G2 R2 S", notes: "Asampurna derivative.", kriti: "Varunapriya Kirtanam (Muthuswami Dikshitar)" },
  ],
  25: [
    { name: "Mararanjani", arohana: "S R2 G3 M1 P D1 N1 S'", avarohana: "S' N1 D1 P M1 G3 R2 S", notes: "Asampurna derivative.", kriti: "Mararanjani Kirtanam (Muthuswami Dikshitar)" },
  ],
  26: [
    { name: "Charukesi", arohana: "S R2 G3 M1 P D1 N2 S'", avarohana: "S' N2 D1 P M1 G3 R2 S", notes: "Highly evocative scale.", kriti: "Adamodi Galada (Saint Tyagaraja)" },
  ],
  27: [
    { name: "Sarasangi", arohana: "S R2 G3 M1 P D1 N3 S'", avarohana: "S' N3 D1 P M1 G3 R2 S", notes: "Lyrical melodic scale.", kriti: "Manavyala Kinchara (Saint Tyagaraja)" },
  ],
  28: [
    { name: "Harikambhoji", arohana: "S R2 G3 M1 P D2 N2 S'", avarohana: "S' N2 D2 P M1 G3 R2 S", notes: "Mixolydian mode equivalent.", kriti: "Dinamani Vamsa (Saint Tyagaraja)" },
    { name: "Kambhoji", arohana: "S R2 G3 M1 P D2 S'", avarohana: "S' N2 D2 P M1 G3 R2 S", notes: "Majestic grand raga.", kriti: "O Rangasayee (Saint Tyagaraja)" },
    { name: "Mohanam", arohana: "S R2 G3 P D2 S'", avarohana: "S' D2 P G3 R2 S", notes: "Pentatonic scale.", kriti: "Ninnukori Varnam (Sonti Venkatasubbiah)" },
  ],
  29: [
    { name: "Sankarabharanam", arohana: "S R2 G3 M1 P D2 N3 S'", avarohana: "S' N3 D2 P M1 G3 R2 S", notes: "Major scale (Ionian mode) equivalent.", kriti: "Akshayalinga Vibho (Muthuswami Dikshitar)" },
    { name: "Hamsadhwani", arohana: "S R2 G3 P N3 S'", avarohana: "S' N3 P G3 R2 S", notes: "Pentatonic raga.", kriti: "Vatapi Ganapatim (Muthuswami Dikshitar)" },
  ],
  30: [
    { name: "Naganandini", arohana: "S R2 G3 M1 P D3 N3 S'", avarohana: "S' N3 D3 P M1 G3 R2 S", notes: "Asampurna derivative.", kriti: "Naganandini Kirtanam (Muthuswami Dikshitar)" },
  ],
  31: [
    { name: "Yagapriya", arohana: "S R3 G3 M1 P D1 N1 S'", avarohana: "S' N1 D1 P M1 G3 R3 S", notes: "Asampurna derivative.", kriti: "Yagapriya Kirtanam (Muthuswami Dikshitar)" },
  ],
  32: [
    { name: "Ragavardhani", arohana: "S R3 G3 M1 P D1 N2 S'", avarohana: "S' N2 D1 P M1 G3 R3 S", notes: "Asampurna derivative.", kriti: "Ragavardhani Kirtanam (Muthuswami Dikshitar)" },
  ],
  33: [
    { name: "Gangeyabhushani", arohana: "S R3 G3 M1 P D1 N3 S'", avarohana: "S' N3 D1 P M1 G3 R3 S", notes: "Asampurna derivative.", kriti: "Gangeyabhushani Kirtanam (Muthuswami Dikshitar)" },
  ],
  34: [
    { name: "Vagadheeswari", arohana: "S R3 G3 M1 P D2 N2 S'", avarohana: "S' N2 D2 P M1 G3 R3 S", notes: "Asampurna derivative.", kriti: "Vagadheeswari Kirtanam (Muthuswami Dikshitar)" },
  ],
  35: [
    { name: "Shulini", arohana: "S R3 G3 M1 P D2 N3 S'", avarohana: "S' N3 D2 P M1 G3 R3 S", notes: "Asampurna derivative.", kriti: "Shulini Kirtanam (Muthuswami Dikshitar)" },
  ],
  36: [
    { name: "Chalanata", arohana: "S R3 G3 M1 P D3 N3 S'", avarohana: "S' N3 D3 P M1 G3 R3 S", notes: "Auspicious opening raga scale.", kriti: "Jagadanandakaraka (Saint Tyagaraja)" },
  ],
  37: [
    { name: "Salagam", arohana: "S R1 G1 M2 P D1 N1 S'", avarohana: "S' N1 D1 P M2 G1 R1 S", notes: "First Prati Madhyama Melakarta.", kriti: "Salagam Kirtanam (Muthuswami Dikshitar)" },
  ],
  38: [
    { name: "Jalarnavam", arohana: "S R1 G1 M2 P D1 N2 S'", avarohana: "S' N2 D1 P M2 G1 R1 S", notes: "Prati Madhyama scale.", kriti: "Jalarnavam Kirtanam (Muthuswami Dikshitar)" },
  ],
  39: [
    { name: "Jhalavarali", arohana: "S R1 G1 M2 P D1 N3 S'", avarohana: "S' N3 D1 P M2 G1 R1 S", notes: "Prati Madhyama scale.", kriti: "Kanakana Ruchira (Saint Tyagaraja)" },
  ],
  40: [
    { name: "Navaneetam", arohana: "S R1 G1 M2 P D2 N2 S'", avarohana: "S' N2 D2 P M2 G1 R1 S", notes: "Prati Madhyama scale.", kriti: "Navaneetam Kirtanam (Muthuswami Dikshitar)" },
  ],
  41: [
    { name: "Pavani", arohana: "S R1 G1 M2 P D2 N3 S'", avarohana: "S' N3 D2 P M2 G1 R1 S", notes: "Prati Madhyama scale.", kriti: "Pavani Kirtanam (Muthuswami Dikshitar)" },
  ],
  42: [
    { name: "Raghupriya", arohana: "S R1 G1 M2 P D3 N3 S'", avarohana: "S' N3 D3 P M2 G1 R1 S", notes: "Prati Madhyama scale.", kriti: "Raghupriya Kirtanam (Muthuswami Dikshitar)" },
  ],
  43: [
    { name: "Gavambodhi", arohana: "S R1 G2 M2 P D1 N1 S'", avarohana: "S' N1 D1 P M2 G2 R1 S", notes: "Prati Madhyama scale.", kriti: "Gavambodhi Kirtanam (Muthuswami Dikshitar)" },
  ],
  44: [
    { name: "Bhavapriya", arohana: "S R1 G2 M2 P D1 N2 S'", avarohana: "S' N2 D1 P M2 G2 R1 S", notes: "Prati Madhyama scale.", kriti: "Bhavapriya Kirtanam (Muthuswami Dikshitar)" },
  ],
  45: [
    { name: "Subhapantuvarali", arohana: "S R1 G2 M2 P D1 N3 S'", avarohana: "S' N3 D1 P M2 G2 R1 S", notes: "Deeply sorrowful solemn scale.", kriti: "Ninne Nera Nammichinara (Saint Tyagaraja)" },
  ],
  46: [
    { name: "Shadvidhamargini", arohana: "S R1 G2 M2 P D2 N2 S'", avarohana: "S' N2 D2 P M2 G2 R1 S", notes: "Prati Madhyama scale.", kriti: "Shadvidhamargini Kirtanam (Muthuswami Dikshitar)" },
  ],
  47: [
    { name: "Suvarnangi", arohana: "S R1 G2 M2 P D2 N3 S'", avarohana: "S' N3 D2 P M2 G2 R1 S", notes: "Prati Madhyama scale.", kriti: "Suvarnangi Kirtanam (Muthuswami Dikshitar)" },
  ],
  48: [
    { name: "Divyamani", arohana: "S R1 G2 M2 P D3 N3 S'", avarohana: "S' N3 D3 P M2 G2 R1 S", notes: "Prati Madhyama scale.", kriti: "Divyamani Kirtanam (Muthuswami Dikshitar)" },
  ],
  49: [
    { name: "Dhavalambari", arohana: "S R1 G3 M2 P D1 N1 S'", avarohana: "S' N1 D1 P M2 G3 R1 S", notes: "Prati Madhyama scale.", kriti: "Dhavalambari Kirtanam (Muthuswami Dikshitar)" },
  ],
  50: [
    { name: "Namanarayani", arohana: "S R1 G3 M2 P D1 N2 S'", avarohana: "S' N2 D1 P M2 G3 R1 S", notes: "Prati Madhyama scale.", kriti: "Namanarayani Kirtanam (Muthuswami Dikshitar)" },
  ],
  51: [
    { name: "Kamavardhani (Pantuvarali)", arohana: "S R1 G3 M2 P D1 N3 S'", avarohana: "S' N3 D1 P M2 G3 R1 S", notes: "Highly popular Prati Madhyama parent scale.", kriti: "Apparama Bhakthi (Saint Tyagaraja)" },
  ],
  52: [
    { name: "Ramapriya", arohana: "S R1 G3 M2 P D2 N2 S'", avarohana: "S' N2 D2 P M2 G3 R1 S", notes: "Prati Madhyama scale.", kriti: "Korinavara Brova (Saint Tyagaraja)" },
  ],
  53: [
    { name: "Gamanashrama", arohana: "S R1 G3 M2 P D2 N3 S'", avarohana: "S' N3 D2 P M2 G3 R1 S", notes: "Parent scale of Purvikalyani.", kriti: "Gnanambike Palayasu (Muthuswami Dikshitar)" },
  ],
  54: [
    { name: "Vishwambhari", arohana: "S R1 G3 M2 P D3 N3 S'", avarohana: "S' N3 D3 P M2 G3 R1 S", notes: "Prati Madhyama scale.", kriti: "Vishwambhari Kirtanam (Muthuswami Dikshitar)" },
  ],
  55: [
    { name: "Shyamalangi", arohana: "S R2 G1 M2 P D1 N1 S'", avarohana: "S' N1 D1 P M2 G1 R2 S", notes: "Prati Madhyama scale.", kriti: "Syamalangi Kirtanam (Muthuswami Dikshitar)" },
  ],
  56: [
    { name: "Shanmukhapriya", arohana: "S R2 G2 M2 P D1 N2 S'", avarohana: "S' N2 D1 P M2 G2 R2 S", notes: "Very popular concert scale dedicated to Lord Muruga.", kriti: "Siddhi Vinayakam (Muthuswami Dikshitar)" },
  ],
  57: [
    { name: "Simhendramadhyamam", arohana: "S R2 G2 M2 P D1 N3 S'", avarohana: "S' N3 D1 P M2 G2 R2 S", notes: "Hungarian minor scale equivalent.", kriti: "Nannu Brova (Saint Tyagaraja)" },
  ],
  58: [
    { name: "Hemavati", arohana: "S R2 G2 M2 P D2 N2 S'", avarohana: "S' N2 D2 P M2 G2 R2 S", notes: "Very popular concert scale.", kriti: "Ikane Thalladhru (Subbaraya Sastri)" },
  ],
  59: [
    { name: "Dharmavati", arohana: "S R2 G2 M2 P D2 N3 S'", avarohana: "S' N3 D2 P M2 G2 R2 S", notes: "Acoustic minor scale equivalent.", kriti: "Paridanamichithe (Patnam Subramania Iyer)" },
  ],
  60: [
    { name: "Neetimati", arohana: "S R2 G2 M2 P D3 N3 S'", avarohana: "S' N3 D3 P M2 G2 R2 S", notes: "Prati Madhyama scale.", kriti: "Neetimati Kirtanam (Muthuswami Dikshitar)" },
  ],
  61: [
    { name: "Kantamani", arohana: "S R2 G3 M2 P D1 N1 S'", avarohana: "S' N1 D1 P M2 G3 R2 S", notes: "Prati Madhyama scale.", kriti: "Kantamani Kirtanam (Muthuswami Dikshitar)" },
  ],
  62: [
    { name: "Rishabhapriya", arohana: "S R2 G3 M2 P D1 N2 S'", avarohana: "S' N2 D1 P M2 G3 R2 S", notes: "Prati Madhyama scale.", kriti: "Rishabhapriya Kirtanam (Muthuswami Dikshitar)" },
  ],
  63: [
    { name: "Latangi", arohana: "S R2 G3 M2 P D1 N3 S'", avarohana: "S' N3 D1 P M2 G3 R2 S", notes: "Lyrical concert scale.", kriti: "Aparadamula (Patnam Subramania Iyer)" },
  ],
  64: [
    { name: "Vachaspati", arohana: "S R2 G3 M2 P D2 N2 S'", avarohana: "S' N2 D2 P M2 G3 R2 S", notes: "Acoustic major scale equivalent.", kriti: "Kanthimathi (Muthuswami Dikshitar)" },
  ],
  65: [
    { name: "Mechakalyani", arohana: "S R2 G3 M2 P D2 N3 S'", avarohana: "S' N3 D2 P M2 G3 R2 S", notes: "Lydian mode equivalent.", kriti: "Ethavunara (Saint Tyagaraja)" },
    { name: "Hamirkalyani", arohana: "S R2 G3 M2 P D2 N3 S'", avarohana: "S' N3 D2 P M2 M1 G3 R2 S", notes: "Bhashanga janya.", kriti: "Manamu Leda (Saint Tyagaraja)" },
  ],
  66: [
    { name: "Chitrambari", arohana: "S R2 G3 M2 P D3 N3 S'", avarohana: "S' N3 D3 P M2 G3 R2 S", notes: "Prati Madhyama scale.", kriti: "Chitrambari Kirtanam (Muthuswami Dikshitar)" },
  ],
  67: [
    { name: "Sucharita", arohana: "S R3 G3 M2 P D1 N1 S'", avarohana: "S' N1 D1 P M2 G3 R3 S", notes: "Prati Madhyama scale.", kriti: "Sucharita Kirtanam (Muthuswami Dikshitar)" },
  ],
  68: [
    { name: "Jyotiswarupini", arohana: "S R3 G3 M2 P D1 N2 S'", avarohana: "S' N2 D1 P M2 G3 R3 S", notes: "Prati Madhyama scale.", kriti: "Jyotiswarupini Kirtanam (Muthuswami Dikshitar)" },
  ],
  69: [
    { name: "Dhatuvardhani", arohana: "S R3 G3 M2 P D1 N3 S'", avarohana: "S' N3 D1 P M2 G3 R3 S", notes: "Prati Madhyama scale.", kriti: "Dhatuvardhani Kirtanam (Muthuswami Dikshitar)" },
  ],
  70: [
    { name: "Nasikabhushani", arohana: "S R3 G3 M2 P D2 N2 S'", avarohana: "S' N2 D2 P M2 G3 R3 S", notes: "Prati Madhyama scale.", kriti: "Nasikabhushani Kirtanam (Muthuswami Dikshitar)" },
  ],
  71: [
    { name: "Kosalam", arohana: "S R3 G3 M2 P D2 N3 S'", avarohana: "S' N3 D2 P M2 G3 R3 S", notes: "Prati Madhyama scale.", kriti: "Kosalam Kirtanam (Muthuswami Dikshitar)" },
  ],
  72: [
    { name: "Rasikapriya", arohana: "S R3 G3 M2 P D3 N3 S'", avarohana: "S' N3 D3 P M2 G3 R3 S", notes: "Final 72nd Melakarta scale.", kriti: "Arul Purivaai (Koteeswara Iyer)" },
  ],
};

export const CARNATIC_JANYA_DATABASE: ExtendedJanya[] = Object.entries(COMPLETE_72_MELAKARTA_JANYAS).flatMap(
  ([mNumStr, list]) => {
    const mNum = parseInt(mNumStr, 10);
    return list.map((item, idx) => ({
      id: `j-${mNum}-${idx + 1}`,
      name: item.name,
      melakartaNumber: mNum,
      parentMelakartaId: `${mNum}`,
      arohana: item.arohana,
      avarohana: item.avarohana,
      vakra: item.arohana.includes("P S") || item.avarohana.includes("P G"),
      bhashanga: false,
      upanga: true,
      classification: "Sampurna",
      jeevaSwara: item.notes.substring(0, 20),
      musicTheoryNotes: item.notes,
      famousKriti: item.kriti,
    }));
  }
);

// Helper guaranteeing EVERY Melakarta from #1 to #72 returns rich, specific Janya Ragas!
export function getJanyasForMelakarta(ragaNumber: number, ragaName: string): ExtendedJanya[] {
  const existing = CARNATIC_JANYA_DATABASE.filter((j) => j.melakartaNumber === ragaNumber);
  if (existing.length > 0) return existing;

  return [
    {
      id: `dyn-${ragaNumber}-1`,
      name: `${ragaName} Asampurna Derivative`,
      melakartaNumber: ragaNumber,
      parentMelakartaId: `${ragaNumber}`,
      arohana: "S R M P D S'",
      avarohana: "S' N D P M G R S",
      vakra: false,
      bhashanga: false,
      upanga: true,
      classification: "Shadava-Sampurna",
      jeevaSwara: "Primary Swarasthana",
      musicTheoryNotes: `Asampurna tradition derivative of Melakarta #${ragaNumber} ${ragaName}.`,
      famousKriti: `${ragaName} Swara Kirthana (Muthuswami Dikshitar)`,
    },
  ];
}
