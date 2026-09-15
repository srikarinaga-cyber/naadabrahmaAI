export const siteConfig = {
  name: "Naadabrahma AI",
  tagline: "Where Tradition Meets Intelligence",
  description:
    "India's modern digital platform for Carnatic music. Learn ragas, talas, and theory with AI-powered guidance for vocal, veena, violin, flute, mridangam, and keyboard.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://naadabrahma.ai",
  keywords: [
    "Carnatic music",
    "Indian classical music",
    "Melakarta ragas",
    "Janya ragas",
    "Talas",
    "Music education",
    "AI music tutor",
    "Veena",
    "Violin",
    "Flute",
    "Mridangam",
    "Music academy",
  ],
  links: {
    github: "https://github.com/naadabrahma-ai",
    twitter: "https://twitter.com/naadabrahmaai",
  },
  nav: [
    { label: "Student Portal", href: "/student" },
    { label: "AI Guru", href: "/ai-guru" },
    { label: "Knowledge Hub", href: "/knowledge-hub" },
    { label: "Raga Explorer", href: "/knowledge-hub/explorer" },
    { label: "Teacher Portal", href: "/teacher" },
    { label: "Syllabus Notes", href: "/notes" },
  ],
} as const;
