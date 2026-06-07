"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Baby, Heart, Flame, GraduationCap } from "lucide-react";

const stats = [
  { value: "43%", label: "of employers auto-reject CVs with gaps over 6 months" },
  { value: "50%", label: "fewer callbacks for returning parents vs unemployed candidates" },
  { value: "0", label: "tools built specifically for returners — until now" },
];

const steps = [
  {
    num: "01",
    title: "Tell us about your break",
    desc: "Two minutes to share your story. It's private, and it shapes everything we build for you.",
  },
  {
    num: "02",
    title: "Build your gap narrative with AI",
    desc: "We turn your honest answers into a confident, interview-ready story in three formats.",
  },
  {
    num: "03",
    title: "Practice until you feel ready",
    desc: "Progressively harder interview sessions with returner-aware feedback that catches underselling.",
  },
];

const personas = [
  {
    icon: Baby,
    title: "Maternity returner",
    quote: "I know I can do the job. I just don't know how to talk about the gap.",
  },
  {
    icon: Flame,
    title: "Burnout recovery",
    quote: "I've been out 18 months. Am I still good enough?",
  },
  {
    icon: Heart,
    title: "Carer returner",
    quote: "I did something meaningful. Why do I feel I have to hide it?",
  },
  {
    icon: GraduationCap,
    title: "Retraining career changer",
    quote: "I don't look like a typical engineer. How do I prove I'm serious?",
  },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex items-center px-4 sm:px-6 pt-20">
        <div className="max-w-5xl mx-auto py-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 bg-[#E8F2EF] text-[#4A7C6F] text-sm font-medium rounded-full mb-6">
              Built for engineers returning after a career break
            </span>
          </motion.div>

          <motion.h1
            className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-[#1B4F72] leading-tight mb-6 max-w-4xl"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Your gap is not your weakness. Let&apos;s make it your story.
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-[#6B7280] max-w-2xl leading-relaxed mb-10"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            AI-powered interview coaching built for engineers returning after a career break.
            Practice, prepare, and walk in ready.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/onboard"
              className="inline-flex items-center gap-2 bg-[#4A7C6F] hover:bg-[#2E5C52] text-white font-medium px-7 py-3.5 rounded-xl transition-all hover:scale-105"
            >
              Start for free <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 border border-[#E5E0D8] hover:border-[#4A7C6F] text-[#1B4F72] font-medium px-7 py-3.5 rounded-xl transition-all hover:bg-[#E8F2EF]"
            >
              See how it works
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-y border-[#E5E0D8] py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <FadeIn key={stat.value} delay={i * 0.1}>
              <p className="font-serif text-4xl font-bold text-[#4A7C6F] mb-2">{stat.value}</p>
              <p className="text-[#6B7280] text-sm leading-snug">{stat.label}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B4F72] mb-16 text-center">
              How it works
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.12}>
                <div className="flex flex-col gap-4">
                  <span className="font-serif text-5xl font-bold text-[#E8F2EF] text-[#4A7C6F]/20">
                    {step.num}
                  </span>
                  <h3 className="font-semibold text-[#1B4F72] text-lg">{step.title}</h3>
                  <p className="text-[#6B7280] leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-white py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B4F72] mb-4 text-center">
              Built for people like you
            </h2>
            <p className="text-[#6B7280] text-center mb-14 max-w-xl mx-auto">
              We know what it feels like to return. We built ReturnReady around that specific experience.
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-5">
            {personas.map((persona, i) => (
              <FadeIn key={persona.title} delay={i * 0.08}>
                <div className="bg-[#FAF8F4] border border-[#E5E0D8] rounded-2xl p-7 hover:border-[#4A7C6F]/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F2EF] flex items-center justify-center mb-4">
                    <persona.icon size={20} className="text-[#4A7C6F]" />
                  </div>
                  <h3 className="font-semibold text-[#1B4F72] mb-2">{persona.title}</h3>
                  <p className="text-[#6B7280] italic text-sm leading-relaxed">
                    &ldquo;{persona.quote}&rdquo;
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Founder story */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="bg-white border border-[#E5E0D8] rounded-3xl p-10 md:p-14">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-[#4A7C6F] flex items-center justify-center text-white font-bold text-lg shrink-0">
                  SSH
                </div>
                <div>
                  <p className="font-semibold text-[#1B4F72]">Sayma Saymon Hia</p>
                  <p className="text-[#6B7280] text-sm">Senior Software Engineer · Founder</p>
                </div>
              </div>
              <blockquote className="font-serif text-xl text-[#1B4F72] leading-relaxed">
                &ldquo;I built ReturnReady because I am the person it&apos;s for. I&apos;m a Senior
                Software Engineer with 7+ years of experience. I took maternity leave and suddenly
                felt like I had to justify my existence in every interview. No tool existed that
                understood what that actually felt like. So I built one.&rdquo;
              </blockquote>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#4A7C6F] py-20 px-4 sm:px-6 text-center">
        <FadeIn>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to build your story?
          </h2>
          <p className="text-[#E8F2EF] mb-8 max-w-md mx-auto">
            Start in under two minutes. No credit card. No judgment.
          </p>
          <Link
            href="/onboard"
            className="inline-flex items-center gap-2 bg-white text-[#4A7C6F] hover:bg-[#FAF8F4] font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105"
          >
            Start for free <ArrowRight size={16} />
          </Link>
        </FadeIn>
      </section>
    </>
  );
}
