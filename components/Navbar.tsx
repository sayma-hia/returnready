"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";

const publicLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
];

const authLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Narrative", href: "/narrative" },
  { label: "Practice", href: "/practice" },
  { label: "Progress", href: "/progress" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isSignedIn = !!session;
  const links = isSignedIn ? authLinks : publicLinks;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-[#FAF8F4]/95 backdrop-blur-md shadow-sm border-b border-[#E5E0D8]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-semibold text-[#4A7C6F] tracking-tight">
          ReturnReady
        </Link>

        <ul className="hidden md:flex items-center gap-7">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? "text-[#4A7C6F]" : "text-[#6B7280] hover:text-[#1B4F72]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          {isSignedIn ? (
            <li>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-[#6B7280] hover:text-[#1B4F72] transition-colors font-medium"
              >
                Sign out
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link
                  href="/api/auth/signin"
                  className="text-sm font-medium text-[#6B7280] hover:text-[#1B4F72] transition-colors"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href="/onboard"
                  className="text-sm font-medium bg-[#4A7C6F] hover:bg-[#2E5C52] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Start for free
                </Link>
              </li>
            </>
          )}
        </ul>

        <button
          className="md:hidden text-[#1B4F72] p-1"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#FAF8F4] border-t border-[#E5E0D8] px-4 pb-4">
          <ul className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm text-[#6B7280] hover:text-[#1B4F72] font-medium transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {isSignedIn ? (
              <li className="pt-2">
                <button
                  onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="block w-full text-left py-2 text-sm text-[#6B7280] hover:text-[#1B4F72] font-medium transition-colors"
                >
                  Sign out
                </button>
              </li>
            ) : (
              <li className="pt-2">
                <Link
                  href="/onboard"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center text-sm font-medium bg-[#4A7C6F] text-white px-4 py-2.5 rounded-lg"
                >
                  Start for free
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
