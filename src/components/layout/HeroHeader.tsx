export function HeroHeader() {
  return (
    <div className="text-center mb-12 space-y-4">
      <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
        Encuentra el hogar que
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/prefieras.png"
          alt="prefieras"
          className="inline-block h-[1.6em] w-auto object-contain align-middle -ml-2"
          style={{ transform: 'translateY(3px)' }}
        />
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Accede a las mejores propiedades del mercado inmobiliario chileno con datos actualizados en tiempo real.
      </p>
    </div>
  );
}
