"use client";

import { useState } from "react";

const facilities = [
  {
    id: "bowling",
    title: "6 torow bowlingowych",
    desc: "Profesjonalne tory z automatyczna obsluga punktacji - dla rodziny i firm.",
    img: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?q=80&w=1200&auto=format&fit=crop",
    details: {
      naglowek: "Jak grac w bowling?",
      opis: "Bowling to gra, w ktorej gracz toczy kule po torze, aby przewrocic jak najwiecej sposrod 10 pinow ustawionych na koncu toru. Kazda runda (ramka) sklada sie z 2 rzutow, chyba ze w pierwszym rzucie trafisz strike - wtedy ramka konczy sie po jednym rzucie. Gra sklada sie z 10 ramek.",
      zasady: [
        "Strike (X) - wszystkie 10 pinow w pierwszym rzucie. Wynik: 10 + suma kolejnych 2 rzutow.",
        "Spare (/) - wszystkie piny w 2 rzutach. Wynik: 10 + kolejny rzut.",
        "Maksymalny wynik to 300 punktow (same strike'i).",
        "Buty bowlingowe sa obowiazkowe - dostepne w wypoyczalni.",
        "Kule dobierz do swojej wagi - dla poczatkujacych polecamy 8-10 funtow.",
      ],
    },
  },
  {
    id: "bilard",
    title: "4 stoly bilardowe",
    desc: "Pelnowymiarowe stoly bilardowe w osobnej strefie - idealne na przerwe miedzy kolejkami.",
    img: "https://images.unsplash.com/photo-1611315764615-3e788573f31e?q=80&w=1200&auto=format&fit=crop",
    details: {
      naglowek: "Jak grac w bilard?",
      opis: "Bilard to gra na stole pokrytym suknem, w ktorej gracze uzywaja kija bilardowego do uderzania bil. Najpopularniejsza odmiana to 8-ball, gdzie jeden gracz gra bilami pelnokolorowymi (1-7), a drugi pasiastymi (9-15). Wygrywa ten, kto pierwszy wbije wszystkie swoje bile, a na koniec czarna 8.",
      zasady: [
        "Rozbicie: bila biala musi dotknac trojkata bil. Jesli wpadnie bila - to faul.",
        "Po rozbiciu gracz strzelajacy wybiera swoja grupe (pelne lub pasiaste) po pierwszym wbitym bila.",
        "Faul: bila biala wpada do luzy, lub gracz nie trafi zadnej bili.",
        "Po faulu przeciwnik ustawia bile biala w dowolnym miejscu.",
        "Czarna 8 wbijamy jako ostatnia - jesli wpadnie wczesniej, przegrywasz.",
      ],
    },
  },
  {
    id: "strefa",
    title: "Strefa relaksu",
    desc: "Wygodne siedziska, bar i przestrzen do swietowania kazdego strike'a.",
    img: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=1200&auto=format&fit=crop",
    details: {
      naglowek: "Nasza strefa relaksu",
      opis: "Kwazar to nie tylko gra - to miejsce gdzie mozna sie zrelaksowac, napic zimnego drinka i swietowac kazdy strike z przyjaznymi. Nasza strefa relaksu jest dostepna dla wszystkich gosci.",
      zasady: [
        "Bar z napojami chlodzonymi, kawami i przekaskami.",
        "Wygodne kanapy i stoliki dla grup.",
        "Ekrany pokazujace wyniki z wszystkich torow.",
        "Mozliwosc rezerwacji strefy na imprezy prywatne i urodziny.",
        "Przyjazna atmosfera - idealna dla rodzin z dziecmi.",
      ],
    },
  },
];

export default function About() {
  const [otwarty, setOtwarty] = useState<string | null>(null);

  const toggleKafelek = (id: string) => {
    setOtwarty(otwarty === id ? null : id);
  };

  return (
    <section id="o-nas" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-orange">
          O nas
        </p>
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Wiecej niz kregle.
        </h2>
        <p className="mt-5 text-lg text-steel">
          Kwazar Bowling Club w Tarnowie to miejsce spotkan dla rodzin, ekip
          znajomych i firm. Szesc torow bowlingowych i cztery stoly bilardowe
          w jednej, energetycznej przestrzeni.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {facilities.map((f) => (
          <div key={f.id}>
            {/* Kafelek */}
            <div
              className="group cursor-pointer overflow-hidden rounded-2xl border border-steel/10 bg-navy-light"
              onClick={() => toggleKafelek(f.id)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={f.img}
                  alt={f.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                  {/* Strzalka pokazujaca czy rozwiniety */}
                  <span className={`text-orange transition-transform duration-300 ${otwarty === f.id ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </div>
                <p className="mt-2 text-sm text-steel">{f.desc}</p>
              </div>
            </div>

            {/* Rozwijany opis pod kafelkiem */}
            {otwarty === f.id && (
              <div className="mt-2 rounded-2xl border border-orange/20 bg-navy-light p-6">
                <h4 className="font-display text-lg font-bold text-orange mb-3">
                  {f.details.naglowek}
                </h4>
                <p className="text-sm text-steel mb-4">
                  {f.details.opis}
                </p>
                <ul className="space-y-2">
                  {f.details.zasady.map((zasada, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-steel">
                      <span className="mt-1 text-cyan text-xs">●</span>
                      {zasada}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
