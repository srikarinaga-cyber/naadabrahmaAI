"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePitchTracker } from "@/hooks/usePitchTracker";
import { Mic, Volume2, Square, Sparkles, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    isPlayingSynth,
    startTracking,
    stopTracking,
    playTestTone,
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
        const y = hzToY(swaraHz, canvas.height);

        ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        // Labels
        ctx.fillStyle = "rgba(128, 0, 32, 0.5)";
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
          const isTuned = matchedSwara && Math.abs(matchedSwara.centsOffset) <= 10;
          ctx.strokeStyle = isTuned ? "#D4AF37" : "#800020";
          ctx.stroke();
        }
      }

      animFrameId = requestAnimationFrame(draw);
    };

    const hzToY = (hz: number, height: number): number => {
      const minHz = selectedSruthi.freq * 0.9;
      const maxHz = selectedSruthi.freq * 2.1;
      const logMin = Math.log2(minHz);
      const logMax = Math.log2(maxHz);
      const val = Math.log2(hz);

      const ratio = (val - logMin) / (logMax - logMin);
      return height - Math.max(0, Math.min(1, ratio)) * height;
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [isTuning, selectedSruthi, matchedSwara]);

  return (
    <div className="glass-panel traditional-border traditional-glow rounded-2xl p-5 max-w-md w-full transition-all duration-300 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#800020]">Vocal Pitch Tracker</h3>
          <p className="text-[11px] text-gray-500">Real-time Mobile & System Voice Detector</p>
        </div>
        <span className="flex items-center gap-1 text-xs text-kumkum bg-kumkum/10 px-2.5 py-1 rounded-full font-semibold">
          <Smartphone className="size-3.5" /> Mobile Ready
        </span>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Sruthi Base Key Selector */}
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-semibold text-foreground">
          Adhara Shadja (Sruthi)
        </label>
        <select
          value={selectedSruthi.name}
          onChange={(e) => {
            const selected = SRUTHIS.find((s) => s.name === e.target.value);
            if (selected) {
              setSelectedSruthi(selected);
              if (isTuning) stopTracking();
            }
          }}
          disabled={isTuning}
          className="bg-white rounded-lg border border-border p-1.5 text-xs font-semibold text-foreground focus:outline-none disabled:opacity-50"
        >
          {SRUTHIS.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name} ({s.freq.toFixed(1)} Hz)
            </option>
          ))}
        </select>
      </div>

      {/* Real-time Stats Display */}
      <div className="bg-white/60 border border-swara-gold/30 rounded-xl p-4 text-center min-h-[95px] flex flex-col justify-center items-center shadow-inner">
        {pitch > 0 && matchedSwara ? (
          <div className="space-y-1 animate-in fade-in duration-200">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest bg-[#F3EBE0] px-2.5 py-0.5 rounded-full">
              {matchedSwara.name}
            </span>
            <h4 className="font-serif text-3xl font-extrabold text-[#800020]">
              {matchedSwara.swara}
            </h4>
            <p className="text-[10px] text-gray-500 font-mono">
              {pitch.toFixed(1)} Hz | Clarity: {Math.round(clarity * 100)}%
            </p>
          </div>
        ) : (
          <div className="text-muted-foreground text-xs space-y-1">
            <p className="font-medium">
              {isTuning ? "Sing or hum into microphone to track pitch..." : "Click below to activate mic"}
            </p>
            <p className="text-[10px] text-gray-400">Supports Mobile Microphone & System Audio</p>
          </div>
        )}
      </div>

      {/* Tuner Cent Dial Indicator */}
      {isTuning && pitch > 0 && matchedSwara && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono text-gray-400 px-1">
            <span>Flat (-50c)</span>
            <span className={Math.abs(matchedSwara.centsOffset) <= 10 ? "text-emerald-600 font-bold" : "text-kumkum font-bold"}>
              {matchedSwara.centsOffset > 0 ? `+${matchedSwara.centsOffset}` : matchedSwara.centsOffset} cents
            </span>
            <span>Sharp (+50c)</span>
          </div>

          <div className="h-2 bg-gray-100 rounded-full relative overflow-hidden">
            <div
              className={`absolute top-0 bottom-0 transition-all duration-100 ${
                Math.abs(matchedSwara.centsOffset) <= 10 ? "bg-emerald-500 w-2" : "bg-kumkum w-1.5"
              }`}
              style={{
                left: `${Math.min(Math.max(((matchedSwara.centsOffset + 50) / 100) * 100, 0), 100)}%`,
                transform: "translateX(-50%)",
              }}
            />
            <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-gray-300" />
          </div>
        </div>
      )}

      {/* Scrolling Pitch Canvas */}
      <div className="rounded-xl overflow-hidden border border-border shadow-inner">
        <canvas
          ref={canvasRef}
          width={400}
          height={130}
          className="w-full h-[130px] block"
        />
      </div>

      {/* Audio Test Generator Buttons */}
      <div className="rounded-xl bg-muted/40 p-2.5 space-y-2 border border-border/50">
        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
          <span className="flex items-center gap-1">
            <Volume2 className="size-3 text-swara-gold" /> System Audio Test Tones:
          </span>
          <span className="text-[10px] text-gray-400">Click to play sound</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => playTestTone(1.0)}
            className="text-[11px] py-1 h-auto font-bold border-swara-gold/30 hover:bg-swara-gold/10"
          >
            Sa (Adhara)
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => playTestTone(1.5)}
            className="text-[11px] py-1 h-auto font-bold border-swara-gold/30 hover:bg-swara-gold/10"
          >
            Pa (Panchama)
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => playTestTone(2.0)}
            className="text-[11px] py-1 h-auto font-bold border-swara-gold/30 hover:bg-swara-gold/10"
          >
            S&apos; (Tara Sa)
          </Button>
        </div>
      </div>

      {/* Main Microphone Start/Stop Button */}
      <Button
        onClick={isTuning ? stopTracking : startTracking}
        className={`w-full py-3 rounded-xl font-serif text-xs font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
          isTuning
            ? "bg-kumkum hover:bg-kumkum-light text-white shadow-md"
            : "bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
        }`}
      >
        {isTuning ? (
          <>
            <Square className="size-4 fill-current animate-pulse" />
            <span>STOP PITCH TRACKER</span>
          </>
        ) : (
          <>
            <Mic className="size-4" />
            <span>START MICROPHONE</span>
          </>
        )}
      </Button>
    </div>
  );
}
