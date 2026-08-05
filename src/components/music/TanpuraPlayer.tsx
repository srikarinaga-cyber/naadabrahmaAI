"use client";

import React, { useState, useRef, useEffect } from "react";

// Standard pitch frequencies in Hz for the Adhara Shadja (Root Note)
const PITCHES = [
  { name: "A", freq: 110.00 },
  { name: "A#", freq: 116.54 },
  { name: "B", freq: 123.47 },
  { name: "C", freq: 130.81 },
  { name: "C#", freq: 138.59 },
  { name: "D", freq: 146.83 },
  { name: "D#", freq: 155.56 },
  { name: "E", freq: 164.81 },
  { name: "F", freq: 174.61 },
  { name: "F#", freq: 185.00 },
  { name: "G", freq: 196.00 },
  { name: "G#", freq: 207.65 },
];

type TuningType = "Pa" | "Ma" | "Ni";

export default function TanpuraPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState("C");
  const [tuning, setTuning] = useState<TuningType>("Pa");
  const [tempo, setTempo] = useState(1.5); // seconds per string pluck
  const [volume, setVolume] = useState(0.8);
  const [activeString, setActiveString] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const volumeNodeRef = useRef<GainNode | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const currentPluckRef = useRef(0);

  // Initialize Audio Context on demand (user interaction)
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.connect(ctx.destination);
      
      audioCtxRef.current = ctx;
      volumeNodeRef.current = gainNode;
    }
  };

  // Adjust volume dynamically
  useEffect(() => {
    if (volumeNodeRef.current && audioCtxRef.current) {
      volumeNodeRef.current.gain.linearRampToValueAtTime(volume, audioCtxRef.current.currentTime + 0.1);
    }
  }, [volume]);

  // Stop sound synthesis
  const stopTanpura = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    setIsPlaying(false);
    setActiveString(null);
  };

  // Synthesize a single string pluck with Jawari (buzzing) harmonics
  const pluckString = (frequency: number, duration: number) => {
    const ctx = audioCtxRef.current;
    const masterGain = volumeNodeRef.current;
    if (!ctx || !masterGain) return;

    // Create a voice gain node to prevent popping
    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    voiceGain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.08); // plucking attack
    voiceGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.6); // decay
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration); // release
    voiceGain.connect(masterGain);

    // Multi-harmonic oscillators to synthesize the rich jawari sound (buzzing bridge)
    const harmonics = [1, 2, 3, 4, 5, 6];
    const harmonicGains = [1.0, 0.4, 0.25, 0.12, 0.06, 0.02];
    const oscillators: OscillatorNode[] = [];

    harmonics.forEach((h, index) => {
      const osc = ctx.createOscillator();
      
      // Traditional Tanpura has a rich mix of sawtooth and triangle waves for buzzing
      osc.type = index % 2 === 0 ? "triangle" : "sawtooth";
      osc.frequency.setValueAtTime(frequency * h, ctx.currentTime);

      // Create a specific gain node for this harmonic
      const hGain = ctx.createGain();
      hGain.gain.setValueAtTime(harmonicGains[index], ctx.currentTime);

      // Add a tiny detune to create a lush, organic chorusing/bridge rattle effect
      if (index > 0) {
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, ctx.currentTime);
      }

      osc.connect(hGain);
      hGain.connect(voiceGain);
      osc.start();
      oscillators.push(osc);
    });

    // Cleanup oscillators after decay cycle complete
    setTimeout(() => {
      oscillators.forEach(o => {
        try {
          o.stop();
          o.disconnect();
        } catch (e) {
          // ignore
        }
      });
      voiceGain.disconnect();
    }, duration * 1000 + 100);
  };

  // Schedule string pluck sequence: 1 -> 2 -> 3 -> 4
  const startTanpura = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    setIsPlaying(true);
    const rootItem = PITCHES.find(p => p.name === selectedPitch) || PITCHES[3]; // Default to C
    const rootFreq = rootItem.freq;

    // Define frequencies for 4 strings:
    // String 1: Pa (0.75 * root) or Ma (0.667 * root) or Ni (0.9375 * root)
    // String 2: Sa middle (1.0 * root)
    // String 3: Sa middle (1.0 * root)
    // String 4: Sa low (0.5 * root)
    let str1Freq = rootFreq * 0.75;
    if (tuning === "Ma") str1Freq = rootFreq * (4 / 3) / 2; // Lower octave Ma
    if (tuning === "Ni") str1Freq = rootFreq * (15 / 8) / 2; // Lower octave Ni

    const frequencies = [
      str1Freq,
      rootFreq,
      rootFreq,
      rootFreq * 0.5
    ];

    currentPluckRef.current = 0;
    const runSequence = () => {
      const idx = currentPluckRef.current;
      setActiveString(idx);
      pluckString(frequencies[idx], tempo * 1.8);
      currentPluckRef.current = (idx + 1) % 4;
    };

    // Execute first pluck immediately
    runSequence();

    // Schedule subsequent plucks
    intervalIdRef.current = setInterval(runSequence, tempo * 1000);
  };

  const handleToggle = () => {
    if (isPlaying) {
      stopTanpura();
    } else {
      startTanpura();
    }
  };

  useEffect(() => {
    if (isPlaying) {
      stopTanpura();
      startTanpura();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPitch, tuning, tempo]);

  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  return (
    <div className="glass-panel traditional-border traditional-glow rounded-2xl p-6 max-w-sm w-full transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-serif text-xl font-semibold text-[#800020]">Electronic Tanpura</h3>
          <p className="text-xs text-[#1A2228]/60 mt-0.5">Adhara Shadja Drone Anchor</p>
        </div>
        <div className="flex space-x-1">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-1.5 h-6 rounded-full transition-all duration-300 ${
                activeString === idx
                  ? "bg-[#D4AF37] scale-y-125 shadow-[0_0_8px_#D4AF37]"
                  : isPlaying
                  ? "bg-[#800020]/20"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Pitch / Key Selection */}
        <div>
          <label className="text-xs font-semibold text-[#1A2228]/70 block mb-1.5">
            Key (Sruthi / Base Pitch)
          </label>
          <div className="grid grid-cols-6 gap-1">
            {PITCHES.map((p) => (
              <button
                key={p.name}
                onClick={() => setSelectedPitch(p.name)}
                className={`py-1.5 rounded text-xs font-medium border transition-all duration-200 ${
                  selectedPitch === p.name
                    ? "bg-[#800020] text-white border-[#800020] shadow-sm"
                    : "bg-white text-[#1A2228] border-gray-200 hover:border-[#D4AF37]"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tuning Type */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs font-semibold text-[#1A2228]/70 block mb-1.5">
              Tuning String 1
            </label>
            <div className="flex bg-white rounded-lg border border-gray-200 p-0.5">
              {(["Pa", "Ma", "Ni"] as TuningType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTuning(t)}
                  className={`flex-1 py-1 rounded text-xs font-medium transition-all duration-200 ${
                    tuning === t
                      ? "bg-[#F3EBE0] text-[#800020] font-semibold"
                      : "text-[#1A2228]/70 hover:text-[#1A2228]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Pluck Tempo */}
          <div className="w-1/3">
            <label className="text-xs font-semibold text-[#1A2228]/70 block mb-1.5">
              Pluck Interval
            </label>
            <select
              value={tempo}
              onChange={(e) => setTempo(parseFloat(e.target.value))}
              className="w-full bg-white rounded-lg border border-gray-200 p-1 text-xs font-medium text-[#1A2228] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="1.0">Fast (1s)</option>
              <option value="1.5">Medium (1.5s)</option>
              <option value="2.0">Slow (2s)</option>
              <option value="2.5">V. Slow (2.5s)</option>
            </select>
          </div>
        </div>

        {/* Volume Slider */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-[#1A2228]/70">Volume</label>
            <span className="text-[10px] text-[#1A2228]/50 font-medium">
              {Math.round(volume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#800020]"
          />
        </div>

        {/* Start / Stop Button */}
        <button
          onClick={handleToggle}
          className={`w-full py-3 rounded-xl font-serif text-sm font-semibold tracking-wide transition-all duration-300 flex items-center justify-center space-x-2 ${
            isPlaying
              ? "bg-[#800020] hover:bg-[#9E1B32] text-white shadow-md"
              : "bg-gradient-to-r from-[#D4AF37] to-[#F0A500] hover:from-[#E68A00] hover:to-[#D4AF37] text-white shadow-lg"
          }`}
        >
          {isPlaying ? (
            <>
              <svg className="w-4 h-4 fill-current animate-pulse" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
              <span>PAUSE TANPURA</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>PLAY TANPURA</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
