"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/lib/hooks/use-auth";

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
];

const SEARCH_DEBOUNCE_MS = 320;

const burgerToggleClass =
  "flex min-h-11 min-w-11 flex-col items-center justify-center gap-[5px] rounded-lg border border-transparent bg-none p-2 cursor-pointer md:hidden z-[70] shrink-0";

function BurgerLines({
  open,
  burgerLineBase,
}: {
  open: boolean;
  burgerLineBase: string;
}) {
  return (
    <>
      <span
        className={`${burgerLineBase} ${open ? "translate-y-[6.5px] rotate-45" : ""}`}
      />
      <span className={`${burgerLineBase} ${open ? "opacity-0" : ""}`} />
      <span
        className={`${burgerLineBase} ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`}
      />
    </>
  );
}

function NavbarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qFromUrl = searchParams.get("q") ?? "";
  const { isAdmin } = useAuth();

  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollTicking = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchValue, setSearchValue] = useState(qFromUrl);

  const links = publicLinks;

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (pathname === "/products") setSearchValue(qFromUrl);
      else setSearchValue("");
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, qFromUrl]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const pushQueryToUrl = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");
      const qs = params.toString();
      router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
    },
    [router, searchParams]
  );

  const onSearchChange = (raw: string) => {
    setSearchValue(raw);
    if (pathname !== "/products") return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      pushQueryToUrl(raw);
    }, SEARCH_DEBOUNCE_MS);
  };

  const submitSearch = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    const trimmed = searchValue.trim();
    if (pathname === "/products") {
      pushQueryToUrl(searchValue);
      return;
    }
    router.push(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : "/products");
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTicking.current) return;
      scrollTicking.current = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        scrollTicking.current = false;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
  }, [menuOpen]);

  const burgerLineBase =
    "block w-6 h-[1.5px] bg-[#2d8c5f] dark:bg-sky-400 transition-all duration-300 ease-in-out";

  const searchInputClass =
    "bg-transparent text-sm text-slate-700 outline-none w-full placeholder:text-slate-500 dark:text-zinc-200 dark:placeholder:text-zinc-400";

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 sm:px-6 md:px-8 h-16 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:bg-zinc-950/95 dark:border-zinc-800"
            : "bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80"
        }`}
      >
        <Link
          href="/"
          aria-label="Kachu Kart home"
          className="flex min-h-11 min-w-0 items-center gap-2 rounded-lg py-1 [&_svg]:stroke-[#2d8c5f] dark:[&_svg]:stroke-sky-400"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span className="font-syne hidden sm:inline truncate font-bold text-lg md:text-xl tracking-tight text-[#2d8c5f] dark:text-sky-400">
            Kachu Kart
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-md px-1 py-2 text-sm font-medium text-slate-700 hover:text-[#2d8c5f] transition-colors dark:text-zinc-200 dark:hover:text-sky-400"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-200 w-52 dark:bg-zinc-900/80 dark:border-zinc-700">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <div className="flex-1 min-w-0">
              <label htmlFor="nav-search-desktop" className="sr-only">
                Search products
              </label>
              <input
                id="nav-search-desktop"
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                placeholder="Search products…"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitSearch();
                  }
                }}
                className={searchInputClass}
              />
            </div>
          </div>

          <ThemeToggle />

          {isAdmin ? (
            <Link
              href="/admin"
              title="Admin panel"
              aria-label="Admin panel"
              className="hidden h-11 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 dark:border-sky-500/40 dark:bg-sky-950/50 dark:text-sky-300 dark:hover:bg-sky-900/50 md:inline-flex"
            >
              Admin
            </Link>
          ) : null}

          {/* ponytail: account link (sign-in and profile) hidden entirely for now per request */}

          {menuOpen ? (
            <button
              type="button"
              title="Close menu"
              aria-expanded="true"
              aria-controls="mobile-nav-menu"
              aria-label="Close menu"
              className={burgerToggleClass}
              onClick={() => setMenuOpen(false)}
            >
              <BurgerLines open burgerLineBase={burgerLineBase} />
            </button>
          ) : (
            <button
              type="button"
              title="Open menu"
              aria-expanded="false"
              aria-controls="mobile-nav-menu"
              aria-label="Open menu"
              className={burgerToggleClass}
              onClick={() => setMenuOpen(true)}
            >
              <BurgerLines open={false} burgerLineBase={burgerLineBase} />
            </button>
          )}
        </div>
      </nav>

      <div
        id="mobile-nav-menu"
        className={`fixed inset-x-0 top-0 pt-20 pb-8 px-4 sm:px-6 bg-white z-[55] shadow-xl border-b border-gray-100 dark:bg-zinc-950 dark:border-zinc-800 transition-all duration-300 ease-in-out md:hidden ${
          menuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-200 dark:bg-zinc-900/80 dark:border-zinc-700">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <div className="flex-1 min-w-0">
              <label htmlFor="nav-search-mobile" className="sr-only">
                Search products
              </label>
              <input
                id="nav-search-mobile"
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                placeholder="Search products…"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitSearch();
                  }
                }}
                className={searchInputClass}
              />
            </div>
          </div>

          {links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block min-h-11 py-2 text-xl font-semibold text-gray-800 hover:text-[#2d8c5f] dark:text-zinc-200 dark:hover:text-sky-400"
            >
              {item.label}
            </Link>
          ))}
          {isAdmin ? (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="block min-h-11 py-2 text-xl font-semibold text-emerald-700 hover:text-[#2d8c5f] dark:text-sky-300 dark:hover:text-sky-200"
            >
              Admin panel
            </Link>
          ) : null}
          {/* ponytail: account link (sign-in and profile) hidden entirely for now per request */}
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[50] md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}
    </>
  );
}

function NavbarFallback() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] flex h-16 items-center justify-between border-b border-gray-100 bg-white/90 px-4 sm:px-6 md:px-8 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90" />
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<NavbarFallback />}>
      <NavbarContent />
    </Suspense>
  );
}
