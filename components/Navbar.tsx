"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#hero", label: "Strona główna" },
  { href: "#o-nas", label: "O nas" },
  { href: "#cennik", label: "Cennik" },
  { href: "#rezerwacje", label: "Rezerwacje" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-navy/90 backdrop-blur-md shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
       <a href="#hero" className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-white overflow-hidden">
  <img src="/logo.png" alt="Kwazar Logo" className="w-full h-full object-contain" />
</a>
        {/* Desktop links */}
        <ul className="hidden gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-steel transition-colors hover:text-cyan"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="tel:537523207"
          className="hidden rounded-full bg-orange px-5 py-2 font-mono text-sm font-medium text-navy transition-transform hover:scale-105 md:inline-block"
        >
          537 523 207
        </a>

        {/* Mobile toggle */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Otwórz menu"
          aria-expanded={open}
        >
          <span className="h-0.5 w-6 bg-bone" />
          <span className="h-0.5 w-6 bg-bone" />
          <span className="h-0.5 w-4 bg-orange" />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className="flex flex-col gap-1 bg-navy-light px-6 pb-6 md:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-base font-medium text-bone"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="tel:537523207" className="mt-2 block font-mono text-orange">
              537 523 207
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
