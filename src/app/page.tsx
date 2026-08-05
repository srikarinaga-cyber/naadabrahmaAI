import Image from "next/image";
import TanpuraWrapper from "@/components/music/TanpuraWrapper";

export default function Home() {
  const MODULES = [
    {
      title: "Knowledge Hub",
      description: "Explore the comprehensive theory of 72 Melakarta Ragas, Janya derivatives, Talas, Composers, and notations.",
      icon: "📖",
      tag: "Catalog"
    },
    {
      title: "AI Guru",
      description: "Ask musical doubts, compare complex ragas, generate notes, and obtain daily study plans based on your progress.",
      icon: "🧘‍♂️",
      tag: "AI Assistant"
    },
    {
      title: "Exam Hub",
      description: "Prepare for Lower, Higher, Diploma, and Degree state certifications with mock papers, MCQs, and pitch practice.",
      icon: "🎯",
      tag: "Certificates"
    },
    {
      title: "Student Dashboard",
      description: "Track your study streaks, log achievements, identify weak areas, and follow AI-personalized learning steps.",
      icon: "📊",
      tag: "Analytics"
    },
    {
      title: "Teacher Portal",
      description: "Instructors can upload PDFs/notes, assign tasks, design custom quizes, and monitor class-wide statistics.",
      icon: "🎓",
      tag: "Academic"
    },
    {
      title: "Admin Panel",
      description: "Manage system-wide curriculum databases, query papers, media hosting, and platform-wide engagement metrics.",
      icon: "🛡️",
      tag: "Control"
    }
  ];

  return (
    <div className="flex-1 chandan-grid min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-[#D4AF37]/20 sticky top-0 bg-[#FAF6F0]/90 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🕉️</span>
            <div>
              <h1 className="font-serif text-lg font-bold text-[#800020] tracking-wide leading-tight">
                NAADABRAHMA AI
              </h1>
              <p className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold -mt-0.5">
                Where Tradition Meets Intelligence
              </p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8 text-xs font-semibold text-[#1A2228]/80">
            <a href="#features" className="hover:text-[#800020] transition-colors">Core Modules</a>
            <a href="#tanpura" className="hover:text-[#800020] transition-colors">Virtual Tanpura</a>
            <a href="#curriculum" className="hover:text-[#800020] transition-colors">Curriculum</a>
            <a href="#about" className="hover:text-[#800020] transition-colors">Our Mission</a>
          </nav>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 rounded-lg text-xs font-semibold text-[#800020] hover:bg-[#F3EBE0] transition-all">
              Sign In
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#800020] text-white hover:bg-[#9E1B32] shadow-sm transition-all">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12 flex-1">
        <div className="flex-1 text-center md:text-left space-y-6">
          <span className="inline-block px-3 py-1 rounded-full bg-[#800020]/5 border border-[#800020]/15 text-xs font-semibold text-[#800020]">
            ✨ The Future of Indian Classical Music Education
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#1A2228] leading-[1.1] tracking-tight">
            Preserving Heritage. <br />
            <span className="bg-gradient-to-r from-[#800020] to-[#E68A00] bg-clip-text text-transparent">
              Empowering Minds.
            </span>
          </h2>
          <p className="text-base text-[#1A2228]/70 leading-relaxed max-w-xl">
            Naadabrahma AI is a startup-grade SaaS platform built for music students, teachers, and academies. Combining centuries of Carnatic and Hindustani music theory with advanced pitch tracking algorithms and artificial intelligence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <button className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#800020] text-white hover:bg-[#9E1B32] shadow-md transition-all">
              Launch Learning Portal
            </button>
            <a
              href="#tanpura"
              className="px-6 py-3.5 rounded-xl text-sm font-semibold border border-[#D4AF37]/50 text-[#800020] hover:bg-[#FAF6F0] flex items-center justify-center space-x-2 transition-all"
            >
              <span>Practice with Tanpura</span>
              <span>⚡</span>
            </a>
          </div>
        </div>

        {/* Hero Interactive Area */}
        <div id="tanpura" className="flex-1 flex justify-center items-center w-full">
          <div className="relative w-full max-w-sm flex justify-center">
            {/* Artistic Background Aura */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#800020]/5 to-[#E68A00]/5 blur-3xl rounded-full -z-10" />
            <TanpuraWrapper />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-[#F3EBE0]/40 py-24 border-y border-[#D4AF37]/15">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <h3 className="font-serif text-3xl font-bold text-[#800020]">
              Six Pillars of Naadabrahma
            </h3>
            <p className="text-sm text-[#1A2228]/70 leading-relaxed">
              Every tool and module is integrated to form a continuous knowledge loop connecting students, teachers, and classical history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((m) => (
              <div
                key={m.title}
                className="bg-white rounded-2xl p-6 traditional-border hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-3xl">{m.icon}</span>
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider bg-[#F3EBE0]/40 px-2 py-0.5 rounded">
                      {m.tag}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#1A2228] group-hover:text-[#800020] transition-colors mb-2">
                    {m.title}
                  </h4>
                  <p className="text-xs text-[#1A2228]/60 leading-relaxed">
                    {m.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center text-xs font-semibold text-[#800020] hover:text-[#9E1B32] cursor-pointer">
                  <span>Explore Module</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Theory & Raga Preview Section */}
      <section id="curriculum" className="max-w-6xl mx-auto px-6 py-24 space-y-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#800020]">
              Melakarta Raga Knowledge Graph
            </h3>
            <p className="text-sm text-[#1A2228]/70 leading-relaxed">
              In Carnatic music, all compositions map back to the 72 Melakarta Ragas (parent scales). Our database structure acts as an interactive graph, showing the melodic lineage of every Janya raga, critical notations, and related composer kritis.
            </p>
            <div className="space-y-3">
              {[
                { title: "72 Melakarta Parent Scales", desc: "Rigorous pitch profiles with custom microtone mapping." },
                { title: "Janya Scale Lineage Tracker", desc: "Identifies vakra (crooked) and bhashanga (foreign-note) variations." },
                { title: "Composer Mudra Identification", desc: "Trace lyrics back to composer signatures and traditional contexts." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <span className="text-[#D4AF37] font-semibold text-lg">✦</span>
                  <div>
                    <h5 className="text-xs font-bold text-[#1A2228]">{item.title}</h5>
                    <p className="text-[11px] text-[#1A2228]/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-white border border-[#D4AF37]/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between aspect-video relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#800020]/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#800020] uppercase tracking-wider">
                    Melakarta Raga #29
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#1A2228]">Dheerasankarabharanam</h4>
                </div>
                <span className="text-xs font-medium text-gray-500">Chakra V (Bana)</span>
              </div>
              <div className="space-y-2 mt-4 font-mono text-xs">
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-gray-400">Arohana:</span>
                  <span className="text-[#800020] font-semibold">S R2 G3 M1 P D2 N3 S</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-gray-400">Avarohana:</span>
                  <span className="text-[#800020] font-semibold">S N3 D2 P M1 G3 R2 S</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Western Equiv:</span>
                  <span className="text-[#E68A00]">C Major Scale</span>
                </div>
              </div>
            </div>
            <div className="bg-[#FAF6F0] rounded-xl p-3 border border-gray-100 mt-6 text-[10px] text-gray-500">
              💡 <span className="font-bold text-gray-700">AI Guru Note:</span> Prominent Janya ragas derived include Hamsadhwani, Bilahari, and Arabhi. Often sung at the beginning of concert segments.
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D4AF37]/15 bg-[#1A2228] text-white py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-serif text-md font-bold text-[#FAF6F0] tracking-wide">
              NAADABRAHMA AI
            </h4>
            <p className="text-[10px] text-[#FAF6F0]/60 tracking-wider">
              Where Tradition Meets Intelligence.
            </p>
          </div>
          <p className="text-[10px] text-[#FAF6F0]/40">
            © {new Date().getFullYear()} Naadabrahma AI. All rights reserved. Designed for scale and heritage preservation.
          </p>
        </div>
      </footer>
    </div>
  );
}
