"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePitchTracker } from "@/hooks/usePitchTracker";
import { Mic, Volume2, Square, Sparkles, Smartphone, Music } from "lucide-react";
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

// Target Carnatic Swara Matrix
const CARNATIC_SWARA_MATRIX = [
  { label: "S", full: "Shadjam (స/सा)", ratio: 1.0 },
  { label: "R1", full: "Suddha Rishabam (రి1/री1)", ratio: 1.0535 },
  { label: "G3", full: "Antara Gandharam (గ3/गा3)", ratio: 1.25 },
  { label: "M1", full: "Suddha Madhyamam (మ1/मा1)", ratio: 1.3333 },
  { label: "P", full: "Panchamam (ప/पा)", ratio: 1.5 },
  { label: "D1", full: "Suddha Dhaivatham (ద1/धा1)", ratio: 1.5802 },
  { label: "N3", full: "Kakali Nishadam (ని3/नी3)", ratio: 1.875 },
  { label: "S'", full: "Tara Shadjam (స'/सा')", ratio: 2.0 },
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
    playTestTone,
  } = usePitchTracker(selectedSruthi.freq);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pitchHistoryRef = useRef<number[]>([]);
  const maxHistory = 150;

  // Track pitch history without memory bloat
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

  // Smooth Throttled Canvas Drawing Loop (Zero Lag / Freeze)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animFrameId: number;

    const draw = () => {
      // 1. Draw Sandalwood background
      ctx.fillStyle = "#FAF6F0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw target Swara reference horizontal grid lines
      CARNATIC_SWARA_MATRIX.forEach((swara) => {
        const swaraHz = selectedSruthi.freq * swara.ratio;
        const y = hzToY(swaraHz, canvas.height);

        ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        // Labels
        const isMatched = matchedSwara && (matchedSwara.swara.startsWith(swara.label) || matchedSwara.name.startsWith(swara.label));
        ctx.fillStyle = isMatched ? "#800020" : "rgba(128, 0, 32, 0.4)";
        ctx.font = isMatched ? "bold 11px sans-serif" : "bold 9px sans-serif";
        ctx.fillText(swara.label, 6, y - 2);
      });

      // 3. Draw scrolling pitch trail
      const history = pitchHistoryRef.current;
      if (history.length > 1) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        let isDrawing = false;

        for (let i = 0; i < history.length; i++) {
          const hz = history[i];
          const x = (i / maxHistory) * canvas.width;

          if (hz && hz > 0) {
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
          ctx.strokeStyle = isTuned ? "#10B981" : "#800020";
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
  }, [selectedSruthi, matchedSwara]);

  return (
    <div className="glass-panel traditional-border traditional-glow rounded-2xl p-5 max-w-md w-full transition-all duration-300 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#800020]">Live Swara & Pitch Detector</h3>
          <p className="text-[11px] text-gray-500">Real-time Veena & Vocal Note Highlight</p>
        </div>
        <span className="flex items-center gap-1 text-xs text-kumkum bg-kumkum/10 px-2.5 py-1 rounded-full font-semibold">
          <Smartphone className="size-3.5" /> Mobile & Mic
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
          Adhara Shadja (Sruthi Key)
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

      {/* Real-time Swara Highlight Badge & Frequency Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-kumkum/10 to-amber-500/10 border border-swara-gold/40 rounded-2xl p-4 text-center min-h-[100px] flex flex-col justify-center items-center shadow-sm">
        {pitch > 0 && matchedSwara ? (
          <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1">
              <Sparkles className="size-3" /> ACTIVE SWARA: {matchedSwara.name}
            </span>
            <h4 className="font-serif text-4xl font-extrabold text-[#800020] tracking-tight">
              {matchedSwara.swara}
            </h4>
            <p className="text-[11px] text-gray-600 font-mono font-bold">
              {pitch.toFixed(1)} Hz | Clarity: {Math.round(clarity * 100)}%
            </p>
          </div>
        ) : (
          <div className="text-muted-foreground text-xs space-y-1.5 py-1">
            <p className="font-bold text-kumkum flex items-center justify-center gap-1">
              <Music className="size-4 text-swara-gold" />
              {isTuning ? "Sing or play Veena swara into mic..." : "Click below to start swara detector"}
            </p>
            <p className="text-[10px] text-gray-500">Real-time pitch detection highlights exact Swara notes (S, R, G, M, P, D, N)</p>
          </div>
        )}
      </div>

      {/* Interactive Glowing Carnatic Swara Matrix */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block text-center">
          Carnatic Scale Swara Matrix (Live Highlight):
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {CARNATIC_SWARA_MATRIX.map((swr) => {
            const isCurrent = matchedSwara && (matchedSwara.swara.startsWith(swr.label) || matchedSwara.name.startsWith(swr.label));
            return (
              <div
                key={swr.label}
                className={`rounded-xl p-2 text-center border transition-all duration-150 ${
                  isCurrent
                    ? "bg-amber-500 text-white font-extrabold border-amber-600 shadow-md scale-105"
                    : "bg-white text-gray-700 border-gray-200 font-semibold"
                }`}
              >
                <div className="text-xs font-bold">{swr.label}</div>
                <div className="text-[9px] opacity-80 truncate">{swr.full.split(" ")[0]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tuner Cent Dial Indicator */}
      {isTuning && pitch > 0 && matchedSwara && (
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[10px] font-mono text-gray-500 px-1 font-bold">
            <span>Flat (-50c)</span>
            <span className={Math.abs(matchedSwara.centsOffset) <= 10 ? "text-emerald-600 font-bold" : "text-kumkum font-bold"}>
              {matchedSwara.centsOffset > 0 ? `+${matchedSwara.centsOffset}` : matchedSwara.centsOffset} cents
            </span>
            <span>Sharp (+50c)</span>
          </div>

          <div className="h-2.5 bg-gray-200 rounded-full relative overflow-hidden">
            <div
              className={`absolute top-0 bottom-0 transition-all duration-100 ${
                Math.abs(matchedSwara.centsOffset) <= 10 ? "bg-emerald-500 w-3" : "bg-kumkum w-2"
              }`}
              style={{
                left: `${Math.min(Math.max(((matchedSwara.centsOffset + 50) / 100) * 100, 0), 100)}%`,
                transform: "translateX(-50%)",
              }}
            />
            <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-gray-400" />
          </div>
        </div>
      )}

      {/* Scrolling Pitch Canvas */}
      <div className="rounded-xl overflow-hidden border border-border shadow-inner">
        <canvas
          ref={canvasRef}
          width={400}
          height={120}
          className="w-full h-[120px] block bg-[#FAF6F0]"
        />
      </div>

      {/* Audio Test Generator Buttons */}
      <div className="rounded-xl bg-muted/40 p-2.5 space-y-2 border border-border/50">
        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
          <span className="flex items-center gap-1">
            <Volume2 className="size-3 text-swara-gold" /> Reference Tones Test:
          </span>
          <span className="text-[10px] text-gray-400">Click to play</span>
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
            <Square className="size-4 fill-current animate-pulse text-white" />
            <span>STOP PITCH DETECTOR</span>
          </>
        ) : (
          <>
            <Mic className="size-4" />
            <span>START SWARA & PITCH DETECTOR</span>
          </>
        )}
      </Button>
    </div>
  );
}
