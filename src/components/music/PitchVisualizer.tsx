"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePitchTracker } from "@/hooks/usePitchTracker";

// Base pitch names and their frequencies
const SRUTHIS = [
  { name: "C3", freq: 130.81 },
  { name: "C#3", freq: 138.59 },
  { name: "D3", freq: 146.83 },
  { name: "D#3", freq: 155.56 },
  { name: "E3", freq: 164.81 },
  { name: "F3", freq: 174.61 },
  { name: "F#3", freq: 185.00 },
  { name: "G3", freq: 196.00 },
  { name: "G#3", freq: 207.65 },
  { name: "A3", freq: 220.00 },
  { name: "A#3", freq: 233.08 },
  { name: "B3", freq: 246.94 },
];

// Target scale notes for reference lines (relative ratios)
const TARGET_SWARAS = [
  { label: "S", ratio: 1.0 },       // Sa
  { label: "R1", ratio: 1.0535 },    // Suddha Rishabha
  { label: "G3", ratio: 1.25 },      // Antara Gandhara
  { label: "M1", ratio: 1.3333 },    // Suddha Madhyama
  { label: "P", ratio: 1.5 },        // Panchama
  { label: "D1", ratio: 1.5802 },    // Suddha Dhaivata
  { label: "N3", ratio: 1.875 },     // Kakali Nishada
  { label: "S'", ratio: 2.0 },       // High Sa
];

export default function PitchVisualizer() {
  const [selectedSruthi, setSelectedSruthi] = useState(SRUTHIS[0]); // Default to C3
  const {
    isTuning,
    pitch,
    clarity,
    matchedSwara,
    errorMsg,
    startTracking,
    stopTracking,
  } = usePitchTracker(selectedSruthi.freq);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pitchHistoryRef = useRef<number[]>([]);
  const maxHistory = 200;

  // Track pitch history for scrolling canvas visualizer
  useEffect(() => {
    if (isTuning) {
      pitchHistoryRef.current.push(pitch > 0 ? pitch : -1);
      if (pitchHistoryRef.current.length > maxHistory) {
        pitchHistoryRef.current.shift();
      }
    } else {
      pitchHistoryRef.current = [];
    }
  }, [pitch, isTuning]);

  // Handle Canvas Drawing Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Sandalwood background
      ctx.fillStyle = "#FAF6F0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw target Swara reference horizontal grid lines
      TARGET_SWARAS.forEach((swara) => {
        const swaraHz = selectedSruthi.freq * swara.ratio;
        // Map log frequency to Y-axis
        const y = hzToY(swaraHz, canvas.height);

        ctx.strokeStyle = "rgba(212, 175, 55, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        // Labels
        ctx.fillStyle = "rgba(128, 0, 32, 0.4)";
        ctx.font = "bold 9px sans-serif";
        ctx.fillText(swara.label, 8, y - 3);
      });

      // 3. Draw scrolling pitch trail
      const history = pitchHistoryRef.current;
      if (history.length > 1) {
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        let isDrawing = false;

        for (let i = 0; i < history.length; i++) {
          const hz = history[i];
          const x = (i / maxHistory) * canvas.width;

          if (hz > 0) {
            const y = hzToY(hz, canvas.height);
            if (!isDrawing) {
              ctx.moveTo(x, y);
              isDrawing = true;
            } else {
              ctx.lineTo(x, y);
            }
          } else {
            if (isDrawing) {
              ctx.stroke();
              ctx.beginPath();
              isDrawing = false;
            }
          }
        }
        if (isDrawing) {
          // If we matched the note within 10 cents, color the path Gold, otherwise Crimson
          const isTuned = matchedSwara && Math.abs(matchedSwara.centsOffset) <= 10;
          ctx.strokeStyle = isTuned ? "#D4AF37" : "#800020";
          ctx.stroke();
        }
      }

      animFrameId = requestAnimationFrame(draw);
    };

    // Y-axis logarithmic frequency scaling
    const hzToY = (hz: number, height: number): number => {
      const minHz = selectedSruthi.freq * 0.9;
      const maxHz = selectedSruthi.freq * 2.1;
      const logMin = Math.log2(minHz);
      const logMax = Math.log2(maxHz);
      const val = Math.log2(hz);
      
      // Keep inside bounds
      const ratio = (val - logMin) / (logMax - logMin);
      return height - ratio * height;
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [isTuning, selectedSruthi, matchedSwara]);

  return (
    <div className="glass-panel traditional-border traditional-glow rounded-2xl p-6 max-w-md w-full transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-serif text-xl font-semibold text-[#800020]">Vocal Pitch Tracker</h3>
          <p className="text-xs text-[#1A2228]/60 mt-0.5">Real-time Swara & Gamaka Visualizer</p>
        </div>
        <span className="text-2xl animate-pulse">🎤</span>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 mb-4">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="space-y-6">
        {/* Sruthi Base Key Selector */}
        <div className="flex items-center justify-between gap-4">
          <label className="text-xs font-semibold text-[#1A2228]/70">
            Adhara Shadja (Sruthi / Base)
          </label>
          <select
            value={selectedSruthi.name}
            onChange={(e) => {
              const selected = SRUTHIS.find((s) => s.name === e.target.value);
              if (selected) {
                setSelectedSruthi(selected);
                if (isTuning) {
                  stopTracking();
                }
              }
            }}
            disabled={isTuning}
            className="bg-white rounded-lg border border-gray-200 p-1 text-xs font-semibold text-[#1A2228] focus:outline-none focus:border-[#D4AF37] disabled:opacity-50"
          >
            {SRUTHIS.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} ({s.freq.toFixed(1)} Hz)
              </option>
            ))}
          </select>
        </div>

        {/* Real-time Stats Card */}
        <div className="bg-white/50 traditional-border rounded-xl p-4 text-center min-h-[100px] flex flex-col justify-center items-center">
          {pitch > 0 && matchedSwara ? (
            <div className="space-y-1 animate-fade-in">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest bg-[#F3EBE0] px-2 py-0.5 rounded-full">
                {matchedSwara.name}
              </span>
              <h4 className="font-serif text-4xl font-extrabold text-[#800020]">
                {matchedSwara.swara}
              </h4>
              <p className="text-[10px] text-gray-500 font-mono">
                {pitch.toFixed(1)} Hz | Clarity: {Math.round(clarity * 100)}%
              </p>
            </div>
          ) : (
            <div className="text-gray-400 text-xs">
              {isTuning ? "Sing or whistle a note to detect pitch..." : "Activate the mic to start tuning"}
            </div>
          )}
        </div>

        {/* Tuner Cent Dial Indicator */}
        {isTuning && pitch > 0 && matchedSwara && (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-gray-400 px-1">
              <span>Flat (-50c)</span>
              <span className={Math.abs(matchedSwara.centsOffset) <= 10 ? "text-green-600 font-bold" : "text-[#800020] font-bold"}>
                {matchedSwara.centsOffset > 0 ? `+${matchedSwara.centsOffset}` : matchedSwara.centsOffset} cents
              </span>
              <span>Sharp (+50c)</span>
            </div>

            {/* Slider track needle */}
            <div className="h-2 bg-gray-100 rounded-full relative overflow-hidden">
              <div
                className={`absolute top-0 bottom-0 w-1 transition-all duration-100 ${
                  Math.abs(matchedSwara.centsOffset) <= 10 ? "bg-green-500 w-2" : "bg-[#800020]"
                }`}
                style={{
                  left: `${Math.min(Math.max(((matchedSwara.centsOffset + 50) / 100) * 100, 0), 100)}%`,
                  transform: "translateX(-50%)",
                }}
              />
              {/* Target center deadzone indicator */}
              <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-gray-300" />
            </div>
          </div>
        )}

        {/* HTML5 Scrolling Pitch Canvas */}
        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-inner">
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            className="w-full h-[150px] block"
          />
        </div>

        {/* Toggle Button */}
        <button
          onClick={isTuning ? stopTracking : startTracking}
          className={`w-full py-3 rounded-xl font-serif text-sm font-semibold tracking-wide transition-all duration-300 flex items-center justify-center space-x-2 ${
            isTuning
              ? "bg-[#800020] hover:bg-[#9E1B32] text-white shadow-md"
              : "bg-gradient-to-r from-[#D4AF37] to-[#F0A500] hover:from-[#E68A00] hover:to-[#D4AF37] text-white shadow-lg"
          }`}
        >
          {isTuning ? (
            <>
              <svg className="w-4 h-4 fill-current animate-pulse" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
              <span>STOP TRACKER</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
              <span>START MICROPHONE</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
