-- Migration: Create student_learning_paths table for AI Personalized Learning Path
CREATE TABLE IF NOT EXISTS public.student_learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_level TEXT NOT NULL DEFAULT 'beginner',
    learning_mode TEXT NOT NULL DEFAULT 'vocal',
    target_goal TEXT NOT NULL DEFAULT 'Learn Carnatic basics',
    daily_plan JSONB NOT NULL DEFAULT '{}'::jsonb,
    weak_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
    strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_learning_path UNIQUE (user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.student_learning_paths ENABLE ROW LEVEL SECURITY;

-- Policy: Students can view their own learning path
CREATE POLICY "Students can view own learning path"
    ON public.student_learning_paths
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Students can insert their own learning path
CREATE POLICY "Students can insert own learning path"
    ON public.student_learning_paths
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Students can update their own learning path
CREATE POLICY "Students can update own learning path"
    ON public.student_learning_paths
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Index for user_id lookup performance
CREATE INDEX IF NOT EXISTS idx_student_learning_paths_user_id ON public.student_learning_paths(user_id);
