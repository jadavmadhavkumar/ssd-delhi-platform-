import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "YouTube", href: "#", icon: Youtube },
];

const footerLinks = {
  organization: [
    { name: "About Us", href: "/about" },
    { name: "History", href: "/history" },
    { name: "Ideology", href: "/about#ideology" },
    { name: "Structure", href: "/about#structure" },
  ],
  content: [
    { name: "Articles", href: "/articles" },
    { name: "Blogs", href: "/blog" },
    { name: "News", href: "/news" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
  ],
  community: [
    { name: "Join SSD", href: "/join" },
    { name: "Membership", href: "/dashboard" },
    { name: "Volunteer", href: "/join" },
    { name: "Donate", href: "/donate" },
  ],
  support: [
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-[#003285] text-white">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white shadow-lg">
                <span className="text-2xl">⚔️</span>
              </div>
              <div>
                <h3 className="font-bold text-xl tracking-tight text-white">SSD Delhi</h3>
                <p className="text-xs text-blue-200/80 font-medium tracking-widest uppercase">समता सैनिक दल</p>
              </div>
            </div>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Soldiers for Equality — Building a Casteless Society
            </p>
            <p className="text-xs text-blue-200/70 italic">
              Founded by Dr. B.R. Ambedkar in 1924
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-900/50 text-blue-100 hover:bg-[#FF7F3E] hover:text-white transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Organization Links */}
          <div>
            <h4 className="font-semibold mb-6 text-[#FFDA78] uppercase tracking-wider text-xs">Organization</h4>
            <ul className="space-y-3 text-sm">
              {footerLinks.organization.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-blue-100/80 hover:text-[#FFDA78] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Content Links */}
          <div>
            <h4 className="font-semibold mb-6 text-[#FFDA78] uppercase tracking-wider text-xs">Content</h4>
            <ul className="space-y-3 text-sm">
              {footerLinks.content.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-blue-100/80 hover:text-[#FFDA78] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-6 text-[#FFDA78] uppercase tracking-wider text-xs">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-blue-900/50">
                  <MapPin className="h-4 w-4 text-[#FFDA78]" />
                </div>
                <span className="text-blue-100/80 leading-relaxed">
                  Samta Sainik Dal Delhi<br />
                  New Delhi, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-900/50">
                  <Mail className="h-4 w-4 text-[#FFDA78]" />
                </div>
                <a href="mailto:info@ssddelhi.org" className="text-blue-100/80 hover:text-white transition-colors">
                  info@ssddelhi.org
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-900/50">
                  <Phone className="h-4 w-4 text-[#FFDA78]" />
                </div>
                <a href="tel:+911112345678" className="text-blue-100/80 hover:text-white transition-colors">
                  +91 11 1234 5678
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-blue-200/60 text-center md:text-left">
              © {new Date().getFullYear()} Samta Sainik Dal Delhi. All rights reserved.
            </p>
            <div className="flex gap-8 text-xs font-medium text-blue-200/60">
              <Link href="/privacy" className="hover:text-[#FFDA78] transition-colors uppercase tracking-widest">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#FFDA78] transition-colors uppercase tracking-widest">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
