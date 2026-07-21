const plans = [
  {
    name: "Godzina gry",
    price: "60",
    unit: "zł / tor / godz.",
    features: ["Do 6 osób na torze", "Buty w cenie", "Automatyczna punktacja"],
    highlighted: false,
  },
  {
    name: "Wieczór Kwazar",
    price: "220",
    unit: "zł / tor / 4 godz.",
    features: [
      "Do 6 osób na torze",
      "Buty w cenie",
      "Rezerwacja stołu bilardowego -50%",
      "Najpopularniejsza opcja",
    ],
    highlighted: true,
  },
  {
    name: "Bilard",
    price: "35",
    unit: "zł / stół / godz.",
    features: ["Sprzęt w cenie", "Możliwość łączenia z torem"],
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="cennik" className="mx-auto max-w-6xl px-6 py-24">
      <div className="reveal max-w-2xl">
        <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-orange">
          Cennik
        </p>
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Proste ceny, bez niespodzianek.
        </h2>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-8 ${
              plan.highlighted
                ? "border-orange bg-navy-light shadow-[0_0_40px_-10px_rgba(255,107,53,0.35)]"
                : "border-steel/10 bg-navy-light/50"
            }`}
          >
            <h3 className="font-display text-lg font-semibold text-steel">
              {plan.name}
            </h3>
            <p className="mt-4 font-mono">
              <span className="text-5xl font-bold text-bone">{plan.price}</span>
              <span className="ml-2 text-sm text-steel">{plan.unit}</span>
            </p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-steel">
                  <span className="mt-1 text-cyan">●</span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#rezerwacje"
              className={`mt-8 block rounded-full px-6 py-3 text-center font-medium transition-transform hover:scale-105 ${
                plan.highlighted
                  ? "bg-orange text-navy"
                  : "border border-steel/30 text-bone"
              }`}
            >
              Zarezerwuj
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
