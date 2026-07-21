// Sekcja na filmik w formacie TikTok (pionowy, 9:16)
// Jak bedziesz mial filmik:
// 1. Wrzuc plik mp4 do folderu /public np. /public/kwazar-video.mp4
// 2. Zmien src="/kwazar-video.mp4" ponizej
// LUB jesli chcesz osadzic film z TikToka/YouTube - daj mi znac, zrobimy iframe

export default function VideoSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex flex-col items-center">

        {/* Naglowek */}
        <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-orange">
          Zobacz nas w akcji
        </p>
        <h2 className="mb-12 font-display text-4xl font-bold tracking-tight text-center">
          Kwazar na zywo.
        </h2>

        {/* Kontener na filmik - format TikTok (pionowy 9:16) */}
        <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-steel/10 bg-navy-light">
          {/* Proporcje TikTok: 9:16 */}
          <div className="relative" style={{ paddingTop: "177.78%" }}>

            {/* OPCJA A: lokalny plik mp4 z folderu public */}
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/kwazar-video.mp4"
              autoPlay
              muted
              loop
              playsInline
            />

            {/* Placeholder - widoczny dopoki nie ma filmiku */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-light">
              <div className="mb-4 text-6xl">🎳</div>
              <p className="font-mono text-sm text-steel text-center px-6">
                Tu pojawi sie filmik z Kwazaru
              </p>
              <p className="mt-2 font-mono text-xs text-steel/50 text-center px-6">
                Wrzuc plik kwazar-video.mp4 do folderu /public
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
