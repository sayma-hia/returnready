import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E0D8] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="font-serif text-lg font-semibold text-[#4A7C6F]">ReturnReady</p>
            <p className="text-[#6B7280] text-sm mt-1">
              Interview coaching built for engineers who are coming back.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "How it works", href: "/#how-it-works" },
              { label: "About", href: "/about" },
              { label: "Privacy", href: "/privacy" },
              { label: "Contact", href: "mailto:saymahia@gmail.com" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#6B7280] hover:text-[#4A7C6F] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="text-xs text-[#6B7280] mt-8 pt-6 border-t border-[#E5E0D8]">
          © 2025 ReturnReady · Built by Sayma Saymon Hia
        </p>
      </div>
    </footer>
  );
}
