export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      {/* Zdjecie w tle */}
      <div className="absolute inset-0">
        <img
          src="/Kregielnia tlo.jpg"
          alt="Kwazar Bowling Club"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/40 to-transparent" />
      </div>

      {/* Tresc */}
      <div className="relative mx-auto max-w-6xl px-6 w-full">

        <p className="mb-6 font-mono text-base uppercase tracking-[0.25em] text-cyan font-semibold">
          Tarnow · 6 torow · 4 stoly bilardowe
        </p>

        <h1 className="max-w-3xl font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
          Kwazar<br />
          <span className="text-orange">Bowling Club</span>
        </h1>

        <p className="mt-6 max-w-lg text-lg text-bone/80" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          Miejsce, gdzie wieczor ze znajomymi zamienia sie w prawdziwa rywalizacje.
          Tory, bilard i atmosfera, ktora trzyma do ostatniej kregli.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#rezerwacje"
            className="rounded-full bg-orange px-8 py-3.5 font-medium text-navy transition-transform hover:scale-105"
          >
            Zarezerwuj tor
          </a>
          <a
            href="#cennik"
            className="rounded-full border border-white/30 px-8 py-3.5 font-medium text-bone transition-colors hover:border-cyan hover:text-cyan"
          >
            Zobacz cennik
          </a>
        </div>

        <div className="mt-16 grid max-w-sm grid-cols-2 gap-6 font-mono">
          <div>
            <p className="text-4xl font-bold text-cyan">6</p>
            <p className="text-sm text-bone/60">torow bowlingowych</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-cyan">4</p>
            <p className="text-sm text-bone/60">stoly bilardowe</p>
          </div>
        </div>
      </div>

      {/* Strzalka scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-1 text-bone/40">
          <div className="h-8 w-px bg-bone/30" />
          <span className="text-xs font-mono tracking-widest">SCROLL</span>
        </div>
      </div>
    </section>
  );
}
