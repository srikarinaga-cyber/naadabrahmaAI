"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const PitchVisualizer = dynamic(
  () => import("@/components/music/PitchVisualizer"),
  { ssr: false }
);

export default function StudentDashboardPage() {
  const RECOMMENDATIONS = [
    {
      title: "Perfect your G3 (Antara Gandhara)",
      desc: "Based on your last mock, your pitch accuracy in Sankarabharanam was 4.2Hz sharp on G3.",
      action: "Practice Scale",
      type: "Pitch Tune"
    },
    {
      title: "Explore Raga Hamsadhwani",
      desc: "A popular symmetric pentatonic Janya scale. Good for practicing basic compositions.",
      action: "Learn Scale",
      type: "Raga Study"
    },
    {
      title: "Adi Tala Structure Quiz",
      desc: "Review angas (1 Laghu, 2 Dhrutams) to master rhythmic calculations.",
      action: "Take Quiz",
      type: "Exam Prep"
    }
  ];

  const STATS = [
    { label: "Study Progress", val: "68%", sub: "12/18 lessons complete", color: "bg-[#800020]" },
    { label: "Ragas Discovered", val: "14", sub: "8 Melakartas, 6 Janyas", color: "bg-[#E68A00]" },
    { label: "Practice Score", val: "91%", sub: "Avg pitch correctness", color: "bg-[#D4AF37]" },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between"
          >
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                {stat.label}
              </p>
              <h4 className="text-3xl font-extrabold text-[#1A2228] mt-1">
                {stat.val}
              </h4>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${stat.color}`} />
              <span className="text-[10px] text-gray-500 font-medium">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Recommendations (Col Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-serif text-lg font-bold text-[#800020]">
              AI Guru Personal Recommendations
            </h4>
            <span className="text-[10px] bg-[#800020]/5 text-[#800020] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Updated Live
            </span>
          </div>

          <div className="space-y-3">
            {RECOMMENDATIONS.map((rec, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:border-[#D4AF37]/50 transition-all flex justify-between items-start gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                      {rec.type}
                    </span>
                  </div>
                  <h5 className="text-xs font-extrabold text-[#1A2228]">{rec.title}</h5>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{rec.desc}</p>
                </div>
                <button className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#F3EBE0] text-[10px] font-extrabold text-[#800020] border border-[#D4AF37]/20 transition-all">
                  {rec.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Study Details (Col Span 1) */}
        <div className="space-y-6">
          <PitchVisualizer />
          {/* Daily Goals */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <h4 className="font-serif text-md font-bold text-[#800020]">Daily Goals</h4>
            <div className="space-y-3">
              {[
                { task: "Practice Mayamalavagowla scales", done: true },
                { task: "Review 18th Century Composer eras", done: false },
                { task: "Perform a 5-minute Tanpura hum", done: false },
              ].map((goal, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-xs">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    goal.done 
                      ? "bg-green-100 border-green-300 text-green-700" 
                      : "bg-white border-gray-300 text-transparent"
                  }`}>
                    {goal.done && "✓"}
                  </span>
                  <span className={goal.done ? "text-gray-400 line-through" : "text-[#1A2228] font-medium"}>
                    {goal.task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bookmarks */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <h4 className="font-serif text-md font-bold text-[#800020]">Saved Bookmarks</h4>
            <div className="space-y-2.5">
              {[
                { title: "Kriti: Vatapi Ganapatim", raga: "Hamsadhwani" },
                { title: "Composer: Muthuswami Dikshitar", raga: "Carnatic Trinity" },
                { title: "Raga: Bhairavi (Janya)", raga: "Melakarta #20 parent" },
              ].map((bk, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-gray-50 last:border-0 last:pb-0">
                  <div>
                    <p className="font-extrabold text-[#1A2228]">{bk.title}</p>
                    <p className="text-[9px] text-gray-400">{bk.raga}</p>
                  </div>
                  <span className="text-[#D4AF37] cursor-pointer hover:scale-110 transition-transform">⭐</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
