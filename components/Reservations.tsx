"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Rezerwacja = {
  resource_id: number;
  date: string;
  start_time: string;
  end_time: string;
};

type Zasob = {
  id: number;
  name: string;
  type: string;
};

// Godziny otwarcia - co godzine od 13:00 do 23:00
const GODZINY = [
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00", "22:00", "23:00"
];

function czyZajety(
  resourceId: number,
  godzina: string,
  rezerwacje: Rezerwacja[]
): boolean {
  return rezerwacje.some((r) => {
    if (r.resource_id !== resourceId) return false;
    return r.start_time <= godzina && r.end_time > godzina;
  });
}

function SiatkaZasobow({
  zasoby,
  rezerwacje,
  tytul,
}: {
  zasoby: Zasob[];
  rezerwacje: Rezerwacja[];
  tytul: string;
}) {
  return (
    <div className="mb-10">
      <h3 className="mb-4 font-display text-xl font-bold text-bone">{tytul}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="py-2 pr-4 text-left font-mono text-xs text-steel">
                Godzina
              </th>
              {zasoby.map((z) => (
                <th
                  key={z.id}
                  className="px-2 py-2 text-center font-mono text-xs text-steel"
                >
                  {z.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GODZINY.map((godz) => (
              <tr key={godz} className="border-t border-steel/10">
                <td className="py-2 pr-4 font-mono text-xs text-steel">
                  {godz}
                </td>
                {zasoby.map((z) => {
                  const zajety = czyZajety(z.id, godz, rezerwacje);
                  return (
                    <td key={z.id} className="px-2 py-1 text-center">
                      <div
                        className={`mx-auto h-7 w-full max-w-[80px] rounded ${
                          zajety
                            ? "bg-orange/80 text-navy text-xs flex items-center justify-center font-mono"
                            : "bg-cyan/20 border border-cyan/30"
                        }`}
                      >
                        {zajety ? "Zajety" : ""}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Legenda */}
      <div className="mt-3 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-cyan/20 border border-cyan/30" />
          <span className="font-mono text-xs text-steel">Wolny</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-orange/80" />
          <span className="font-mono text-xs text-steel">Zajety</span>
        </div>
      </div>
    </div>
  );
}

export default function Reservations() {
  const [pokazSiatke, setPokazSiatke] = useState(false);
  const [rezerwacje, setRezerwacje] = useState<Rezerwacja[]>([]);
  const [zasoby, setZasoby] = useState<Zasob[]>([]);
  const [ladowanie, setLadowanie] = useState(false);
  const [dataWybrana, setDataWybrana] = useState(
    new Date().toISOString().split("T")[0]
  );

  const pobierzDane = async (data: string) => {
    setLadowanie(true);
    const [{ data: res }, { data: zas }] = await Promise.all([
      supabase
        .from("reservations")
        .select("resource_id, date, start_time, end_time")
        .eq("date", data),
      supabase.from("resources").select("id, name, type").order("id"),
    ]);
    setRezerwacje(res || []);
    setZasoby(zas || []);
    setLadowanie(false);
  };

  const handlePokazSiatke = () => {
    setPokazSiatke(true);
    pobierzDane(dataWybrana);
  };

  const toryBowling = zasoby.filter((z) => z.type === "bowling");
  const stolyBilard = zasoby.filter((z) => z.type === "billiards");

  return (
    <section id="rezerwacje" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-12 rounded-3xl border border-steel/10 bg-navy-light p-8 md:p-14">

        {/* Naglowek i info */}
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-orange">
              Rezerwacje
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight">
              Zarezerwuj tor telefonicznie.
            </h2>
            <p className="mt-5 text-steel">
              Kazda rezerwacja odbywa sie telefonicznie. Zadzwon do nas,
              odpowiemy na wszystkie pytania i dobierzemy dogodny termin.
            </p>
            <a
              href="tel:537523207"
              className="mt-8 inline-block rounded-full bg-orange px-8 py-3.5 font-mono text-lg font-medium text-navy transition-transform hover:scale-105"
            >
              537 523 207
            </a>
          </div>

          <div className="flex flex-col justify-center gap-4 font-mono">
            <div className="flex items-center justify-between border-b border-steel/10 pb-4">
              <span className="text-steel">Pon - Pt</span>
              <span className="text-bone">15:00 - 00:00</span>
            </div>
            <div className="flex items-center justify-between border-b border-steel/10 pb-4">
              <span className="text-steel">Sob - Nd</span>
              <span className="text-bone">13:00 - 00:00</span>
            </div>

            {/* Przycisk i wybor daty */}
            <div className="mt-2 flex flex-col gap-3">
              <input
                type="date"
                value={dataWybrana}
                onChange={(e) => {
                  setDataWybrana(e.target.value);
                  if (pokazSiatke) pobierzDane(e.target.value);
                }}
                className="rounded-lg border border-steel/20 bg-navy px-4 py-2 font-mono text-sm text-bone"
              />
              <button
  onClick={() => pokazSiatke ? setPokazSiatke(false) : handlePokazSiatke()}
  className="rounded-full border border-cyan/40 px-6 py-2.5 font-mono text-sm text-cyan transition-colors hover:bg-cyan/10"
>
  {pokazSiatke ? "Ukryj dostepnosc" : "Zobacz dostepnosc torow"}
</button>
            </div>
          </div>
        </div>

        {/* Siatka dostepnosci */}
        {pokazSiatke && (
          <div className="border-t border-steel/10 pt-10">
            {ladowanie ? (
              <p className="font-mono text-sm text-steel">Ladowanie...</p>
            ) : (
              <>
                <p className="mb-6 font-mono text-xs text-steel">
                  Dostepnosc na dzien: {dataWybrana}
                </p>
                <SiatkaZasobow
                  tytul="Tory bowlingowe"
                  zasoby={toryBowling}
                  rezerwacje={rezerwacje}
                />
                <SiatkaZasobow
                  tytul="Stoly bilardowe"
                  zasoby={stolyBilard}
                  rezerwacje={rezerwacje}
                />
              </>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
