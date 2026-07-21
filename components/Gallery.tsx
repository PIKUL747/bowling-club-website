// Placeholder images — swap each `src` for real photos of the club
// (lanes, pool tables, the bar area, past events) before launch.
const photos = [
  "https://images.unsplash.com/photo-1538511516020-2f6e5f6b3c53?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571749215647-8548d7d0e295?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1610905112441-9f2a5f5c6e3b?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1608138278561-3b2b52f5b1e0?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600861195091-690c92f1f188?q=80&w=900&auto=format&fit=crop",
];

export default function Gallery() {
  return (
    <section id="galeria" className="mx-auto max-w-6xl px-6 py-24">
      <div className="reveal max-w-2xl">
        <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-orange">
          Galeria
        </p>
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Zobacz klimat Kwazaru.
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
        {photos.map((src, i) => (
          <div
            key={src}
            className={`overflow-hidden rounded-xl ${
              i === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >
            <img
              src={src}
              alt={`Zdjęcie z Kwazar Bowling Club #${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
