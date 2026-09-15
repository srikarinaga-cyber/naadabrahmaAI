-- Migration: Create music_assessments table for AI Music Assessment Engine
CREATE TABLE IF NOT EXISTS public.music_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_name TEXT NOT NULL DEFAULT 'Adhara Shadja (Sa) Sustained Hold',
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    pitch_accuracy NUMERIC NOT NULL DEFAULT 0,
    rhythm_score NUMERIC NOT NULL DEFAULT 0,
    swara_accuracy NUMERIC NOT NULL DEFAULT 0,
    pitch_stability NUMERIC NOT NULL DEFAULT 0,
    overall_score NUMERIC NOT NULL DEFAULT 0,
    notes_detected TEXT[] DEFAULT ARRAY[]::TEXT[],
    ai_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.music_assessments ENABLE ROW LEVEL SECURITY;

-- Policy: Students can view only their own assessment records
CREATE POLICY "Students can view own music assessments"
    ON public.music_assessments
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Students can insert only their own assessment records
CREATE POLICY "Students can insert own music assessments"
    ON public.music_assessments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Students can update only their own assessment records
CREATE POLICY "Students can update own music assessments"
    ON public.music_assessments
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Students can delete only their own assessment records
CREATE POLICY "Students can delete own music assessments"
    ON public.music_assessments
    FOR DELETE
    USING (auth.uid() = user_id);

-- Index for lookup performance
CREATE INDEX IF NOT EXISTS idx_music_assessments_user_id ON public.music_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_music_assessments_created_at ON public.music_assessments(created_at DESC);
