export default function ContactFooter() {
  return (
    <>
      <section id="kontakt" className="mx-auto max-w-6xl px-6 py-24">
        <div className="reveal grid gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-orange">
              Kontakt
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight">
              Znajdź nas w Tarnowie.
            </h2>
            <div className="mt-8 space-y-4 text-steel">
              <p>
                <span className="block text-sm text-steel/70">Telefon</span>
                <a href="tel:537523207" className="font-mono text-xl text-bone">
                  537 523 207
                </a>
              </p>
              <p>
                <span className="block text-sm text-steel/70">Godziny otwarcia</span>
                <span className="font-mono text-bone">
                  Pon–Pt 15:00–00:00 · Sob–Nd 13:00–00:00
                </span>
              </p>
            </div>
          </div>

          {/* Replace with a real embedded Google Map (club address) */}
          <div className="aspect-video overflow-hidden rounded-2xl border border-steel/10 bg-navy-light">
            <iframe
              title="Mapa – Kwazar Bowling Club, Tarnów"
              className="h-full w-full"
              loading="lazy"
              src="https://www.google.com/maps?q=Tarn%C3%B3w&output=embed"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-steel/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-steel md:flex-row">
          <p className="font-display font-semibold text-bone">
            KWAZAR<span className="text-orange">.</span>
          </p>
          <p>© {new Date().getFullYear()} Kwazar Bowling Club, Tarnów. Wszystkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </>
  );
}
