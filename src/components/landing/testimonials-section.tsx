"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import type { Testimonial } from "@/types/database";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto mb-14 max-w-xl text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-3xl font-bold md:text-4xl">
            Trusted by Musicians & Academies
          </h2>
          <p className="mt-3 text-muted-foreground">
            From diploma students to academy directors — Naadabrahma AI is
            reshaping how Carnatic music is learned and taught.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="traditional-border h-full border-swara-gold/20 bg-card/80 dark:bg-card/60">
                <CardHeader className="pb-2">
                  <Quote className="size-8 text-swara-gold/40" aria-hidden />
                  <div className="flex gap-0.5" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-3.5 fill-marigold text-marigold"
                        aria-hidden
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 ring-2 ring-swara-gold/20">
                      <AvatarFallback className="bg-kumkum/10 text-xs font-semibold text-kumkum">
                        {getInitials(testimonial.author_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardDescription className="font-semibold text-foreground">
                        {testimonial.author_name}
                      </CardDescription>
                      <CardDescription className="text-xs">
                        {testimonial.author_role}
                        {testimonial.author_institution &&
                          ` · ${testimonial.author_institution}`}
                      </CardDescription>
                      {testimonial.instrument && (
                        <CardDescription className="text-[10px] uppercase tracking-wider text-swara-gold">
                          {testimonial.instrument}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
