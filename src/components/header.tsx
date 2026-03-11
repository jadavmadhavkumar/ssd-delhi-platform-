"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@/components/providers";

const mainNavItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About",
    href: "/about",
    items: [
      { title: "Organization", href: "/about#organization" },
      { title: "Ideology", href: "/about#ideology" },
      { title: "Structure", href: "/about#structure" },
      { title: "Dr. Ambedkar", href: "/about#ambedkar" },
    ],
  },
  {
    title: "History",
    href: "/history",
  },
  {
    title: "Content",
    items: [
      { title: "Articles", href: "/articles" },
      { title: "Blogs", href: "/blog" },
      { title: "News", href: "/news" },
      { title: "Events", href: "/events" },
      { title: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Join",
    href: "/join",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 border-b",
      scrolled
        ? "bg-background/98 backdrop-blur-md shadow-lg border-primary/20"
        : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    )}>
      <div className="container flex h-20 items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#003285] shadow-lg group-hover:shadow-[#003285]/40 group-hover:scale-105 transition-all duration-300">
            <Shield className="h-7 w-7 text-[#FFDA78]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-[#003285]">
              SSD Delhi
            </span>
            <span className="text-[10px] text-[#2A629A] font-bold tracking-[0.2em] uppercase">
              समता सैनिक दल
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {mainNavItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                {item.items ? (
                  <>
                    <NavigationMenuTrigger className="font-medium text-sm uppercase tracking-wide">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[220px] gap-1 p-3">
                        {item.items.map((subItem) => (
                          <li key={subItem.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={subItem.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary",
                                  pathname === subItem.href && "bg-primary/10 text-primary font-semibold"
                                )}
                              >
                                <div className="text-sm font-medium leading-none">
                                  {subItem.title}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink
                    asChild
                    href={item.href}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "font-semibold text-xs uppercase tracking-widest text-[#2A629A] hover:text-[#003285] transition-colors",
                      pathname === item.href && "text-[#003285] font-bold"
                    )}
                  >
                    <a>
                      {item.title}
                    </a>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="hidden md:flex hover:bg-primary/10 hover:text-primary"
          >
            <Globe className="h-5 w-5" />
            <span className="sr-only">Toggle language</span>
          </Button>

          {/* Divider */}
          <div className="hidden md:block h-6 w-px bg-border" />

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <AuthButtons />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <nav className="container py-4 space-y-1">
            {mainNavItems.map((item) => (
              <div key={item.title}>
                {item.items ? (
                  <div className="space-y-1">
                    <div className="font-semibold text-primary px-3 py-2">{item.title}</div>
                    <div className="pl-4 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-3 py-2 font-semibold hover:bg-muted rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 mt-4 border-t flex items-center gap-2 px-3">
              <AuthButtons />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

// Separate component for auth buttons to ensure proper Clerk context
function AuthButtons() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="font-medium">Sign In</Button>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="default" size="sm" className="bg-[#FF7F3E] hover:bg-[#ff6a1a] text-white font-bold px-6 rounded-full shadow-md hover:shadow-lg transition-all">
            Sign In
          </Button>
        </SignInButton>
        {/* Custom sign-in page link */}
        <Link href="/sign-in">
          <Button variant="outline" size="sm" className="hidden md:inline-flex border-[#003285] text-[#003285] hover:bg-[#003285] hover:text-white">
            Sign In (Page)
          </Button>
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-9 w-9 ring-2 ring-primary/20 hover:ring-primary transition-all",
            }
          }}
        />
      </SignedIn>
    </>
  );
}
