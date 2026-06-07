import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const metadata = {
  title: "About — ReturnReady",
};

const stats = [
  { value: "43%", label: "of employers auto-reject CVs with employment gaps over 6 months (HireRight, 2023)" },
  { value: "50%", label: "fewer callbacks for returning parents compared to unemployed candidates (Harvard Business Review)" },
  { value: "2.2M", label: "people in the UK alone are 'hidden workers' — skilled but locked out (Harvard / Accenture)" },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      {/* Founder story */}
      <div className="bg-white border border-[#E5E0D8] rounded-3xl p-10 md:p-14 mb-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-[#4A7C6F] flex items-center justify-center text-white font-bold text-lg shrink-0">
            SSH
          </div>
          <div>
            <p className="font-semibold text-[#1B4F72]">Sayma Saymon Hia</p>
            <p className="text-[#6B7280] text-sm">Senior Software Engineer · Founder, ReturnReady</p>
          </div>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B4F72] mb-6 leading-snug">
          Why I built ReturnReady
        </h1>
        <div className="space-y-5 text-[#6B7280] leading-relaxed">
          <p>
            I&apos;m a Senior Software Engineer with 7+ years of experience across startup studios, a government ministry, and international clients. I&apos;ve built AI products, led engineering teams, and shipped systems used by the Bangladesh government.
          </p>
          <p>
            Then I took maternity leave. Five months. And when I started thinking about returning, something unexpected happened: I felt like I had to prove I still existed as an engineer.
          </p>
          <p>
            The gap wasn&apos;t the problem. The problem was that every interview tool I found was built for someone who had never left. The questions assumed continuous employment. The feedback didn&apos;t understand why someone would say &ldquo;I was just on leave&rdquo; instead of owning what they&apos;d done.
          </p>
          <p>
            I looked for something that understood what returning actually felt like. Nothing existed. So I built it.
          </p>
          <p>
            ReturnReady is for anyone who knows they can do the job — and just needs help remembering how to say so.
          </p>
        </div>
      </div>

      {/* Why it exists */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-[#1B4F72] mb-6">The research behind it</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {stats.map((stat) => (
            <div key={stat.value} className="bg-white border border-[#E5E0D8] rounded-xl p-6">
              <p className="font-serif text-4xl font-bold text-[#4A7C6F] mb-2">{stat.value}</p>
              <p className="text-[#6B7280] text-sm leading-relaxed">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Links */}
      <section className="bg-[#E8F2EF] border border-[#4A7C6F]/20 rounded-2xl p-8">
        <h2 className="font-semibold text-[#1B4F72] mb-5">Connect with Sayma</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="https://www.linkedin.com/in/sayma-hia-746979117"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border border-[#E5E0D8] text-[#1B4F72] text-sm font-medium px-4 py-2.5 rounded-lg hover:border-[#4A7C6F] transition-colors"
          >
            LinkedIn <ExternalLink size={13} />
          </Link>
          <Link
            href="https://sayma-portfolio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border border-[#E5E0D8] text-[#1B4F72] text-sm font-medium px-4 py-2.5 rounded-lg hover:border-[#4A7C6F] transition-colors"
          >
            Portfolio <ExternalLink size={13} />
          </Link>
          <a
            href="mailto:saymahia@gmail.com"
            className="inline-flex items-center gap-2 bg-white border border-[#E5E0D8] text-[#1B4F72] text-sm font-medium px-4 py-2.5 rounded-lg hover:border-[#4A7C6F] transition-colors"
          >
            saymahia@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}
