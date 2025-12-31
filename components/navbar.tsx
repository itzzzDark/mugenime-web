"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  Search,
  Home,
  Calendar,
  Zap,
  CheckCircle,
  List,
  Tags,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import SearchInput from "./searchInput";
import Image from "next/image";

// Define menu items with icons for the mobile drawer
const navLinks = [
  { name: "Beranda", href: "/", icon: Home },
  { name: "Jadwal", href: "/jadwal-anime", icon: Calendar },
  { name: "Ongoing", href: "/ongoing-anime", icon: Zap },
  { name: "Completed", href: "/completed-anime", icon: CheckCircle },
  { name: "List Anime", href: "/list-anime", icon: List },
  { name: "Genre", href: "/genre-anime", icon: Tags },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Detect scroll to toggle navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out border-b",
        isScrolled
          ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 shadow-xs"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* --- 1. LOGO SECTION --- */}
        <Link
          href="/"
          className="flex items-center gap-2 group shrink-0 relative z-50"
        >
          <div className="relative h-9 md:h-10 w-auto aspect-[1142/249] transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/assets/logo.png"
              alt="Mugenime Logo"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 120px, 160px"
            />
          </div>
        </Link>

        {/* --- 2. DESKTOP NAVIGATION --- */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-800 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* --- 3. ACTIONS (Search & Mobile Menu) --- */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {/* Desktop Search */}
          <div className="hidden md:block w-full max-w-[260px] lg:max-w-[300px] transition-all focus-within:max-w-[320px]">
            <SearchInput />
          </div>

          {/* Mobile Search Icon Trigger (Optional if you want to save space on mobile) */}
          {/* You can implement a toggle search view for mobile here later */}

          {/* Mobile Menu Trigger (Sheet) */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Menu className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[85vw] sm:w-[380px] p-0 border-l-zinc-200 dark:border-l-zinc-800">
              <SheetHeader className="p-6 border-b border-zinc-100 dark:border-zinc-800 text-left">
                 <div className="relative h-8 w-32">
                    <Image
                      src="/assets/logo.png"
                      alt="Mugenime Logo"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col h-full overflow-y-auto">
                {/* Mobile Search Area */}
                <div className="p-6 pb-2">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                    Pencarian
                  </h4>
                  <SearchInput onSearchSubmit={() => setIsOpen(false)} />
                </div>

                {/* Mobile Links */}
                <div className="p-6 space-y-1">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                    Menu Utama
                  </h4>
                  {navLinks.map((link) => {
                     const Icon = link.icon;
                     const isActive = pathname === link.href;
                     
                     return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                          isActive
                            ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                        )}
                      >
                        <div className={cn(
                            "p-2 rounded-lg transition-colors",
                            isActive 
                                ? "bg-indigo-100 dark:bg-indigo-500/20" 
                                : "bg-zinc-100 dark:bg-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-700 shadow-xs"
                        )}>
                            <Icon className="w-4.5 h-4.5" />
                        </div>
                        {link.name}
                        
                        {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                        )}
                      </Link>
                     )
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}