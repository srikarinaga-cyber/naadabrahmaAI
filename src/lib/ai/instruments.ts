export type Instrument =
  | "vocal"
  | "veena"
  | "violin"
  | "flute"
  | "mridangam"
  | "keyboard";

export const INSTRUMENTS: { id: Instrument; label: string }[] = [
  { id: "vocal", label: "Vocal" },
  { id: "veena", label: "Veena" },
  { id: "violin", label: "Violin" },
  { id: "flute", label: "Flute" },
  { id: "mridangam", label: "Mridangam" },
  { id: "keyboard", label: "Keyboard" },
];

export function instrumentGuidance(instrument: Instrument): string {
  const guidance: Record<Instrument, string> = {
    vocal: "Focus on shruti alignment, gamaka clarity, and breath control for sustained notes.",
    veena: "Emphasize left-hand meend (pulling) for gamakas and right-hand plucking clarity.",
    violin: "Use bow pressure and finger slides to express gamakas; maintain steady shruti on open strings.",
    flute: "Control breath and finger hole coverage; practice slow alapana for pitch stability.",
    mridangam: "Relate raga knowledge to tala patterns and konnakol; focus on rhythmic syllables.",
    keyboard: "Map swaras to keys; use sustained notes to hear shruti alignment clearly.",
  };
  return guidance[instrument];
}
