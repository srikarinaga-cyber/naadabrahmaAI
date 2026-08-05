import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getLandingPageData } from "@/lib/data/landing";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AnimatedBackground } from "@/components/landing/animated-background";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureCards } from "@/components/landing/feature-cards";
import { StatisticsSection } from "@/components/landing/statistics-section";
import { KnowledgeHubPreview } from "@/components/landing/knowledge-hub-preview";
import { AiGuruPreview } from "@/components/landing/ai-guru-preview";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { SupabaseSetupBanner } from "@/components/landing/supabase-setup-banner";

export const revalidate = 3600;

export default async function HomePage() {
  const data = await getLandingPageData();
  const supabaseReady = isSupabaseConfigured();

  return (
    <>
      <AnimatedBackground />
      {!supabaseReady && <SupabaseSetupBanner />}
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        {data.features.length > 0 && <FeatureCards features={data.features} />}
        {data.statistics.length > 0 && (
          <StatisticsSection statistics={data.statistics} />
        )}
        <KnowledgeHubPreview featuredRaga={data.featuredRaga} />
        <AiGuruPreview />
        {data.testimonials.length > 0 && (
          <TestimonialsSection testimonials={data.testimonials} />
        )}
      </main>
      <Footer />
    </>
  );
}
