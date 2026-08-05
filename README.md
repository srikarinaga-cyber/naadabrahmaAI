# Naadabrahma AI

**Where Tradition Meets Intelligence**

India's modern digital platform for Carnatic music — built for students, teachers, academies, and administrators across vocal, veena, violin, flute, mridangam, and keyboard.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion
- **Backend:** Supabase (Auth, PostgreSQL, Storage, pgvector)
- **Deployment:** Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and add your Supabase credentials:

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Run database migrations

Apply migrations in `supabase/migrations/` via the Supabase CLI or SQL Editor:

```bash
supabase db push
```

Or run each migration file manually in the Supabase Dashboard SQL Editor.

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── landing/            # Landing page sections
│   ├── layout/             # Navbar, Footer, ThemeToggle
│   ├── providers/          # Theme provider
│   └── ui/                 # shadcn/ui components
├── config/                 # Site configuration
├── lib/
│   ├── data/               # Server-side data fetching
│   └── supabase/           # Supabase client utilities
└── types/                  # TypeScript types
```

## Milestone 1 — Foundation (Complete)

- [x] Project structure
- [x] Supabase configuration
- [x] shadcn/ui setup
- [x] Landing page with Hero, Features, Statistics, Knowledge Hub preview, AI Guru preview, Testimonials, Footer
- [x] Responsive Navbar with mobile menu
- [x] Dark mode
- [x] SEO metadata
- [x] Framer Motion animations

## License

Proprietary — Naadabrahma AI
