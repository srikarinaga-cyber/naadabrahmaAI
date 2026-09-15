-- Migration: Enable Teacher RLS Access to Enrolled Student Progress & Assessments
CREATE POLICY "Teachers view enrolled student music assessments"
    ON public.music_assessments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM class_enrollments ce
            JOIN teacher_classes tc ON tc.id = ce.class_id
            WHERE ce.student_id = music_assessments.user_id
            AND tc.teacher_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('platform_admin', 'academy_admin')
        )
    );

CREATE POLICY "Teachers view enrolled student learning paths"
    ON public.student_learning_paths
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM class_enrollments ce
            JOIN teacher_classes tc ON tc.id = ce.class_id
            WHERE ce.student_id = student_learning_paths.user_id
            AND tc.teacher_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('platform_admin', 'academy_admin')
        )
    );
