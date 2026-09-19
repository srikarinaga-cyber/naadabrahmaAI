"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PlatformFeature } from "@/types/database";
import { useLanguage } from "@/components/providers/language-provider";

interface FeatureCardsProps {
  features: PlatformFeature[];
}

const FEATURE_TRANSLATIONS: Record<
  string,
  Record<string, { title: string; description: string; tag: string }>
> = {
  te: {
    "Knowledge Hub": {
      title: "జ్ఞాన నిధి (Knowledge Hub)",
      description: "72 మేళకర్త రాగాలు, జన్య రాగాలు, 35 సుళాది తాళాలు, వాగ్గేయకారులు, కీర్తనలు మరియు స్వరస్థాన సిద్ధాంతాన్ని అన్వేషించండి.",
      tag: "రాగ నిధి",
    },
    "AI Guru": {
      title: "AI గురు చాట్",
      description: "సంగీత సందేహాలు అడగండి, రాగాలను పోల్చండి, నోట్స్ పొందండి మరియు వ్యక్తిగత సాధన షెడ్యూల్స్ పొందే 24/7 సహాయకం.",
      tag: "AI గురువు",
    },
    "Notes Generation": {
      title: "పాఠ్యాంశ నోట్స్ (Notes & PDFs)",
      description: "అధికారిక పాఠ్యాంశ PDFలను అన్వేషించండి, విభాగాలు చూడండి మరియు పరీక్షల కోసం ప్రత్యేక AI నోట్స్ తయారు చేసుకోండి.",
      tag: "పాఠ్యాంశాలు",
    },
    "Multi-Instrument Support": {
      title: "బహుళ వాద్య సాధన (Instruments)",
      description: "గాత్రం, వీణ, వయోలిన్, పిల్లనగ్రోవి, మృదంగం మరియు కీబోర్డ్ సాధకుల కోసం శ్రుతి సాధనాలు మరియు నాద అమరిక.",
      tag: "వాద్యాలు",
    },
    "Student Dashboard": {
      title: "విద్యార్థి పోర్టల్",
      description: "మీ సాధన పురోగతి, బుక్‌మార్క్‌లు, విజయాలు, సాధన చరిత్ర మరియు AI నోట్స్ విధానాన్ని ట్రాక్ చేయండి.",
      tag: "విద్యార్థులు",
    },
    "Teacher Portal": {
      title: "ఉపాధ్యాయుల పోర్టల్",
      description: "విద్యార్థులు, అసైన్‌మెంట్‌లు, ప్రశ్నాపత్రాలు, నోట్స్ అప్‌లోడ్ మరియు తరగతుల విశ్లేషణను నిర్వహించండి.",
      tag: "ఉపాధ్యాయులు",
    },
    "Academy & Admin": {
      title: "అకాడమీ & అడ్మిన్",
      description: "సంగీత విద్యాసంస్థల నిర్వహణ, పాఠ్యాంశాల ఎంపిక మరియు అడ్మినిస్ట్రేటర్ విశ్లేషణ విధానం.",
      tag: "విద్యాసంస్థలు",
    },
  },
};

export function FeatureCards({ features }: FeatureCardsProps) {
  const { language } = useLanguage();
  const isTe = language === "te";

  return (
    <section id="features" className="border-y border-swara-gold/15 bg-sandalwood-dark/40 py-24 dark:bg-muted/20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl font-extrabold text-[#800020] dark:text-amber-100 md:text-4xl">
            {isTe ? "నాదబ్రహ్మ 6 ప్రధాన రంగాలు (Six Pillars)" : "Six Pillars of Naadabrahma"}
          </h2>
          <p className="mt-4 text-sm md:text-base leading-relaxed text-foreground/90 font-medium">
            {isTe
              ? "ప్రతి విభాగం విద్యార్థులు, ఉపాధ్యాయులు మరియు శాస్త్రీయ రాగ సనాతన సంప్రదాయాన్ని AI సహాయంతో అనుసంధానిస్తుంది."
              : "Every module connects students, teachers, and classical heritage in a continuous knowledge loop — from ragas to examinations to AI guidance."}
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = getIcon(feature.icon);
            const translated = FEATURE_TRANSLATIONS[language]?.[feature.title];
            const title = translated?.title || feature.title;
            const description = translated?.description || feature.description;
            const tag = translated?.tag || feature.tag;

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card className="group traditional-border h-full border-swara-gold/30 bg-card/90 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-card/70">
                  <CardHeader className="pb-3">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-[#800020]/15 ring-1 ring-swara-gold/30 transition-colors group-hover:bg-[#800020]/25">
                        <Icon className="size-5 text-[#800020] dark:text-amber-300" aria-hidden />
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-swara-gold/15 text-[10px] font-extrabold uppercase tracking-wider text-[#800020] dark:text-amber-200 border border-swara-gold/30"
                      >
                        {tag}
                      </Badge>
                    </div>
                    <CardTitle className="font-serif text-lg font-extrabold text-[#800020] dark:text-amber-100 group-hover:text-[#A00028] transition-colors">
                      {title}
                    </CardTitle>
                    <CardDescription className="leading-relaxed text-foreground/80 font-medium text-xs">
                      {description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={feature.href}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#800020] dark:text-amber-200 transition-colors hover:text-[#A00028]"
                    >
                      {isTe ? "మరిన్ని వివరాలు" : "Explore Module"}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 text-swara-gold" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
