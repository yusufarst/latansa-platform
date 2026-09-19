"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LatansaLogo } from "@/components/brand/latansa-logo";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Menu, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublicHeaderProps {
  className?: string;
}

export function PublicHeader({ className }: PublicHeaderProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/products", label: "Katalog" },
    { href: "/compare", label: "Bandingkan" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-xs transition-colors",
        className
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-hidden">
          <LatansaLogo width={110} height={36} className="transition-transform group-hover:scale-102" />
          <div className="hidden sm:flex flex-col">
            <span className="font-bold tracking-tight text-sm text-foreground uppercase">
              LATANSA
            </span>
            <span className="text-[10px] text-muted-foreground font-medium -mt-0.5 tracking-wider">
              ELECTRONICS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground relative py-1",
                  isActive
                    ? "text-brand font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-brand"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className:
                "h-9 px-4 text-xs font-medium border-border/80 hover:bg-stone-100 dark:hover:bg-stone-800 text-foreground",
            })}
          >
            Masuk
          </Link>
          <Link
            href="/products"
            className={buttonVariants({
              size: "sm",
              className:
                "h-9 px-4 text-xs font-medium bg-brand hover:bg-brand-hover text-brand-foreground shadow-xs",
            })}
          >
            Lihat Katalog
          </Link>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <Sheet>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "icon-sm" }),
                "h-9 w-9 border-border/80 text-foreground"
              )}
              aria-label="Buka Menu Navigasi"
            >
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-6 flex flex-col justify-between">
              <div>
                <SheetHeader className="p-0 mb-6 text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <LatansaLogo width={90} height={30} />
                  </SheetTitle>
                </SheetHeader>

                <div className="space-y-1 py-4 border-y border-border/80">
                  {navLinks.map((link) => {
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href);
                    return (
                      <SheetClose key={link.href} render={
                        <Link
                          href={link.href}
                          className={cn(
                            "flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                            isActive
                              ? "bg-stone-100 dark:bg-stone-800 text-brand font-semibold"
                              : "text-foreground hover:bg-stone-100/60 dark:hover:bg-stone-800/60"
                          )}
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      } />
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-6">
                <SheetClose render={
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full justify-center text-xs h-10 border-border/80 font-medium"
                    )}
                  >
                    Masuk Portal Internal
                  </Link>
                } />
                <SheetClose render={
                  <Link
                    href="/products"
                    className={cn(
                      buttonVariants(),
                      "w-full justify-center text-xs h-10 bg-brand hover:bg-brand-hover text-brand-foreground font-medium shadow-xs"
                    )}
                  >
                    Lihat Katalog Produk
                  </Link>
                } />
                <div className="text-[11px] text-center text-muted-foreground pt-2">
                  &copy; {new Date().getFullYear()} LATANSA Platform
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
