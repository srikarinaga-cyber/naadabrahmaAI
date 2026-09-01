"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, BookOpen, Music, Users, X, Award, Globe, HeartHandshake } from "lucide-react";

interface VaggeyakaraFullInfo {
  id: string;
  name: string;
  title: string;
  era: string;
  mudra: string;
  language: string;
  picture: string;
  summary: string;
  contributions: string[];
  famousKritis: string[];
  popularRagas: string[];
  musicalStyle: string;
}

const EXTENDED_VAGGEYAKARAS: VaggeyakaraFullInfo[] = [
  {
    id: "tyagaraja",
    name: "Saint Tyagaraja",
    title: "Sangeetha Kalanidhi / Carnatic Trinity Master",
    era: "1767 – 1847 AD (Tiruvaiyaru, Tanjore)",
    mudra: "Tyagaraja",
    language: "Telugu & Sanskrit",
    picture: "/composers/tyagaraja.png",
    summary: "Revered as the greatest composer in Carnatic music history. One of the Tanjore Trinity who composed thousands of soul-stirring Kritis in praise of Lord Rama.",
    contributions: [
      "Pioneered the 'Sangati' variation technique where a musical line is progressively ornamented.",
      "Composed the famous 5 Pancharatna Kritis (Five Gems of Carnatic Music).",
      "Authored 2 Opera Dance-Dramas: Nauka Charitam and Prahlada Bhakti Vijayam.",
      "Composed Divya Nama Kirtanas and Utsava Sampradaya Kirtanas for daily worship.",
    ],
    famousKritis: [
      "Endaro Mahanubhavulu (Sri Raga / Adi Tala)",
      "Jagadanandakaraka (Nata Raga / Adi Tala)",
      "Vatapi Ganapatim (Hamsadhwani / Adi Tala)",
      "Nagumomu Ganaleni (Abheri Raga / Adi Tala)",
      "Samajavaragamana (Hindolam Raga / Adi Tala)",
    ],
    popularRagas: ["Kharaharapriya", "Mayamalavagowla", "Harikambhoji", "Abheri", "Hindolam"],
    musicalStyle: "Emotional Bhakti Bhava, intricate Sangati variations, rapid Madhyama Kala flow.",
  },
  {
    id: "dikshitar",
    name: "Muthuswami Dikshitar",
    title: "Guruguha / Tanjore Trinity Master",
    era: "1775 – 1835 AD (Tiruvarur, Tanjore)",
    mudra: "Guruguha",
    language: "Sanskrit",
    picture: "/composers/trinity-bg.png",
    summary: "Master of majestic Sanskrit Kritis and 72 Melakarta Ragas according to Venkatamakhin's system. Known for profound Advaita Vedanta philosophy and slow, majestic Vilambita Kala tempo.",
    contributions: [
      "Composed the legendary 9 Kamalamba Navavarna Kritis and Navagraha Kritis.",
      "Integrated Western Band tunes into Carnatic Nottuswara compositions.",
      "Incorporated Raga mudra (embedding the raga's name seamlessly into the lyrics).",
      "Preserved rare Asampurna Melakarta raga traditions.",
    ],
    famousKritis: [
      "Vatapi Ganapatim (Hamsadhwani / Adi Tala)",
      "Kamalambam Bhajare (Kalyani / Adi Tala)",
      "Sri Subrahmanyaya Namaste (Kambhoji / Rupaka Tala)",
      "Meenakshi Memudam (Gamaka Kriya / Adi Tala)",
    ],
    popularRagas: ["Hamsadhwani", "Mechakalyani", "Kambhoji", "Anandabhairavi", "Gamaka Kriya"],
    musicalStyle: "Profound Sanskrit Dhyana Sloka structure, Vilambita Kala majesty, Raga Mudra inclusion.",
  },
  {
    id: "syama-sastri",
    name: "Syama Sastri",
    title: "Kamakshi Hard-Core Devotee / Tanjore Trinity Master",
    era: "1762 – 1827 AD (Tiruvarur, Tanjore)",
    mudra: "Shyamakrishna",
    language: "Telugu & Sanskrit",
    picture: "/composers/trinity-bg.png",
    summary: "Senior-most of the Tanjore Trinity, legendary master of intricate rhythm (Tala-Prasthara) and soul-stirring Swarajathis dedicated to Goddess Kamakshi of Kanchipuram.",
    contributions: [
      "Created the architectural form of Swarajathi compositions for vocal & dance concert platforms.",
      "Mastered Misra Chapu (7 beats) and Viloma Chapu complex rhythmic calculations.",
      "Pioneered the rich melodic usage of Raga Anandabhairavi and Saveri.",
    ],
    famousKritis: [
      "Kamakshi Swarajathi (Bhairavi / Chapu Tala)",
      "O Jagadamba (Anandabhairavi / Adi Tala)",
      "Marivere Gati (Anandabhairavi / Chapu Tala)",
      "Ninne Namminanu (Todi / Misra Chapu Tala)",
    ],
    popularRagas: ["Anandabhairavi", "Bhairavi", "Saveri", "Todi", "Kalyani"],
    musicalStyle: "Intricate cross-rhythmic patterns, deep maternal Bhakti toward Goddess Kamakshi.",
  },
  {
    id: "purandara-dasa",
    name: "Purandara Dasa",
    title: "Karnataka Sangeeta Pitamaha (Father of Carnatic Music)",
    era: "1484 – 1564 AD (Hampi, Karnataka)",
    mudra: "Purandara Vittala",
    language: "Kannada & Sanskrit",
    picture: "/composers/trinity-bg.png",
    summary: "Venerated as the Father of Carnatic Music. Systematized the entire Carnatic music pedagogy starting from Sarali Varisai in Mayamalavagowla raga.",
    contributions: [
      "Designed the foundational Carnatic curriculum: Sarali, Jantai, Alankara Varisais, and Pillari Geethams.",
      "Chosen Mayamalavagowla as the initial scale for beginner vocalists due to symmetric swarasthanas.",
      "Composed over 475,000 Devaranamas and Dasa Sahitya songs.",
    ],
    famousKritis: [
      "Sri Gananatha (Malahari / Rupaka Tala)",
      "Lambodara Lakumikara (Malahari / Rupaka Tala)",
      "Jagadoddharana (Kapi / Adi Tala)",
      "Bhagyada Lakshmi Baramma (Madhyamavati / Adi Tala)",
    ],
    popularRagas: ["Mayamalavagowla", "Malahari", "Kapi", "Kalyani", "Madhyamavati"],
    musicalStyle: "Simple yet profound devotional Dasa Sahitya, structured pedagogical exercises.",
  },
  {
    id: "swathi-thirunal",
    name: "Swathi Thirunal Rama Varma",
    title: "Maharaja of Travancore / Royal Music Scholar",
    era: "1813 – 1846 AD (Trivandrum, Kerala)",
    mudra: "Padmanabha / Sripadmanabha",
    language: "Sanskrit, Malayalam, Telugu, Hindi, Kannada, Tamil",
    picture: "/composers/trinity-bg.png",
    summary: "Royal composer king of Travancore who authored iconic Navaratri Kritis, Tillanas, and Ragamalikas blending Carnatic and Hindustani musical traditions.",
    contributions: [
      "Composed the famous 9 Navaratri Kritis sung during the Dasara festival at Trivandrum.",
      "Mastered Hindustani musical genres including Dhrupad, Khayal, and Bhajan forms in Carnatic ragas.",
      "Authored 8-language Ragamalikas such as Bhavayami Raghuramam.",
    ],
    famousKritis: [
      "Bhavayami Raghuramam (Ragamalika / Rupaka Tala)",
      "Devaneke Pahi (Sankarabharanam / Adi Tala)",
      "Gopalaka Pahimam (Revagupti / Misra Chapu)",
    ],
    popularRagas: ["Mohanam", "Sankarabharanam", "Revagupti", "Hindolam", "Khamas"],
    musicalStyle: "Poetic royal elegance, multi-lingual lyrical dexterity, Hindustani-Carnatic synthesis.",
  },
  {
    id: "annamacharya",
    name: "Tallapaka Annamacharya",
    title: "Padakavitha Pitamaha (Grandfather of Song Composition)",
    era: "1408 – 1503 AD (Tirumala / Tallapaka, Andhra Pradesh)",
    mudra: "Venkateswara / Venkata",
    language: "Telugu & Sanskrit",
    picture: "/composers/trinity-bg.png",
    summary: "The earliest known Indian musician to compose Sankeertanas. Authored 32,000 copper plate songs in praise of Lord Venkateswara at Tirumala.",
    contributions: [
      "Invented the Sankeertana format with Pallavi, Anupallavi, and Charanam verses.",
      "Categorized compositions into Adhyatma (Spiritual) and Sringara (Romantic Devotional) Kirthanas.",
      "Inscribed 32,000 songs onto copper plates stored in the Tirumala Temple Hundi vault.",
    ],
    famousKritis: [
      "Brahmam Okate (Bouli / Adi Tala)",
      "Narayana The Namo Namo (Behag / Adi Tala)",
      "Kondalalo Keneeti (Todi / Adi Tala)",
      "Paluku Thenetala Thalli (Phalamanjari / Adi Tala)",
    ],
    popularRagas: ["Bouli", "Desakshi", "Kondamalahari", "Samanta", "Mukhari"],
    musicalStyle: "Philosophy of universal equality ('Brahmam Okate'), sweet folk-classical Telugu melody.",
  },
  {
    id: "ramadasu",
    name: "Bhadrachala Ramadasu (Kancharla Gopanna)",
    title: "Bhadrachala Devotional Bard",
    era: "1620 – 1680 AD (Bhadrachalam, Telangana)",
    mudra: "Ramadasu",
    language: "Telugu",
    picture: "/composers/trinity-bg.png",
    summary: "Pioneer of Carnatic Kirthanas whose emotional prison songs in Golconda fort directly inspired Saint Tyagaraja.",
    contributions: [
      "Built the famous Bhadrachalam Sri Rama Temple.",
      "Composed Ramadasu Keertanalu expressing absolute surrender (Saranagati).",
      "Created popular Namasankeertanam songs sung in traditional Bhajan Sampradayam.",
    ],
    famousKritis: [
      "Ikshvaku Kula Tilaka (Yadukulakambhoji / Adi Tala)",
      "Paluke Bangaramayana (Anandabhairavi / Adi Tala)",
      "O Rama Nee Namam (Pantuvarali / Adi Tala)",
    ],
    popularRagas: ["Yadukulakambhoji", "Anandabhairavi", "Pantuvarali", "Kambhoji"],
    musicalStyle: "Heartrending Saranagati Bhakti, direct emotional conversation with the Almighty.",
  },
  {
    id: "papanasam-sivan",
    name: "Papanasam Sivan",
    title: "Tamil Tyagayya / Modern Master",
    era: "1890 – 1973 AD (Tamil Nadu)",
    mudra: "Ramadasan",
    language: "Tamil & Sanskrit",
    picture: "/composers/trinity-bg.png",
    summary: "Revered as 'Tamil Tyagayya'. Composed over 800 classical Tamil Kritis and film classical songs that revitalized Tamil in concert platforms.",
    contributions: [
      "Popularized Tamil lyrics in classical Carnatic concert platforms.",
      "Composed kritis for classical dance, vocal concerts, and devotional bhajan melas.",
      "Awarded the Sangeetha Kalanidhi by the Music Academy Madras.",
    ],
    famousKritis: [
      "Karpagame Kanparaai (Madhyamavati / Adi Tala)",
      "Kaa Vaa Vaa (Vachaspati / Adi Tala)",
      "Kana Kann Kodi (Kambhoji / Adi Tala)",
    ],
    popularRagas: ["Madhyamavati", "Vachaspati", "Kambhoji", "Charukesi", "Shanmukhapriya"],
    musicalStyle: "Deep Tamil emotion, accessible classical phrasing, melodic simplicity.",
  },
];

export default function ComposersPage() {
  const [selectedComposer, setSelectedComposer] = useState<VaggeyakaraFullInfo | null>(null);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image: Traditional Carnatic Trinity Artwork */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-15 mix-blend-multiply"
        style={{ backgroundImage: "url('/trinity-theme-bg.png')" }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-background/80 via-background/60 to-background/95" />

      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <Link
          href="/knowledge-hub"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-kumkum mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Janaka Ragas
        </Link>

        <div className="mb-10">
          <Badge variant="outline" className="border-kumkum/20 text-kumkum mb-4 font-bold">
            Vaggeyakaras Directory
          </Badge>
          <h1 className="font-serif text-3xl font-bold text-kumkum md:text-4xl">
            Great Carnatic Music Composers (Vaggeyakaras)
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed">
            Click on any composer below to inspect their complete biography, picture, mudras, key musical innovations, and signature kritis.
          </p>
        </div>

        {/* Composer Card Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {EXTENDED_VAGGEYAKARAS.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedComposer(c)}
              className="glass-panel rounded-3xl border border-swara-gold/25 bg-card/95 backdrop-blur-md p-6 flex flex-col justify-between hover:border-kumkum/60 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border-2 border-swara-gold/40 shadow-md bg-kumkum/10">
                    <Image
                      src={c.picture}
                      alt={c.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <Badge className="bg-kumkum/10 text-kumkum border-none text-[10px] mb-1 font-bold">
                      Mudra: {c.mudra}
                    </Badge>
                    <h3 className="font-serif text-xl font-bold text-kumkum group-hover:text-kumkum-light">
                      {c.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-mono">{c.language}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {c.summary}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border/50 text-xs flex items-center justify-between text-foreground">
                <span className="text-[11px] text-muted-foreground font-mono">{c.era}</span>
                <span className="text-kumkum font-bold flex items-center gap-1 text-xs">
                  <Sparkles className="size-3.5 text-swara-gold" /> Inspect Bio & Kritis →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Composer Modal */}
        {selectedComposer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-swara-gold/40 bg-card p-6 md:p-8 space-y-6 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setSelectedComposer(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-muted hover:bg-kumkum hover:text-white transition-colors"
                title="Close Modal"
              >
                <X className="size-5" />
              </button>

              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-border pb-6">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border-2 border-swara-gold/50 shadow-md bg-kumkum/10">
                  <Image
                    src={selectedComposer.picture}
                    alt={selectedComposer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-kumkum text-white text-xs font-bold">
                      {selectedComposer.title}
                    </Badge>
                    <Badge variant="outline" className="border-swara-gold/40 text-swara-gold text-xs font-bold">
                      Mudra: {selectedComposer.mudra}
                    </Badge>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-kumkum">
                    {selectedComposer.name}
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono">
                    Era: {selectedComposer.era} | Language: {selectedComposer.language}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-kumkum flex items-center gap-2">
                  <BookOpen className="size-4 text-swara-gold" /> Biography & Overview
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedComposer.summary}
                </p>
              </div>

              {/* Key Musical Contributions */}
              <div className="space-y-2 bg-muted/40 p-4 rounded-2xl border border-border/50">
                <h4 className="font-serif text-sm font-bold text-kumkum flex items-center gap-2">
                  <Award className="size-4 text-swara-gold" /> Key Musical Innovations & Contributions
                </h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4 leading-relaxed">
                  {selectedComposer.contributions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Famous Kritis & Masterpieces */}
              <div className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-kumkum flex items-center gap-2">
                  <Music className="size-4 text-swara-gold" /> Signature Kritis & Masterpieces
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {selectedComposer.famousKritis.map((k, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-swara-gold/20 bg-card/80 text-xs font-medium flex items-center gap-2 text-foreground"
                    >
                      <Sparkles className="size-3.5 text-swara-gold shrink-0" />
                      <span>{k}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Musical Style & Popular Ragas */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border">
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-foreground">Musical Style:</span>
                  <p className="text-muted-foreground leading-relaxed">{selectedComposer.musicalStyle}</p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-foreground">Popular Ragas Used:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedComposer.popularRagas.map((r) => (
                      <span
                        key={r}
                        className="bg-kumkum/10 text-kumkum border border-kumkum/20 text-[10px] font-bold px-2 py-0.5 rounded-md"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
