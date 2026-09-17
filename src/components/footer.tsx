import Link from "next/link";

const footerLinks = {
  company: [
    { href: "/about", label: "About" },
    { href: "/careers", label: "Careers" },
    { href: "/press", label: "Press" },
  ],
  support: [
    { href: "/help", label: "Help Center" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ],
  legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-midnight">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                <span className="text-sm font-black text-white">S</span>
              </div>
              <span className="text-lg font-bold">
                <span className="text-white">SUB</span>
                <span className="text-gray-400">FLIX</span>
              </span>
            </Link>
            <p className="text-sm text-muted max-w-xs">
              Stream. Download. Watch Anywhere. Premium cinematic experience for
              everyone.
            </p>
            {/* Social placeholders */}
            <div className="flex gap-3">
              {["Twitter", "Instagram", "YouTube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-xs font-medium text-muted hover:bg-violet-600/20 hover:text-violet-300 transition-colors"
                  aria-label={social}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-violet-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Support
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-violet-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-violet-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} SUBFLIX. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Made with care for movie lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
