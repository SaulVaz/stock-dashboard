export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            S
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">StockDash</p>
            <p className="text-xs text-muted-foreground">Real-time stock market dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {[
            { label: "Next.js 16", color: "text-foreground" },
            { label: "TypeScript", color: "text-blue-500" },
            { label: "Tailwind CSS", color: "text-teal-500" },
            { label: "Finnhub API", color: "text-amber-500" },
          ].map((tech) => (
            <span key={tech.label} className={`text-xs font-medium ${tech.color}`}>
              {tech.label}
            </span>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Data provided by Finnhub · Not financial advice
        </p>
      </div>
    </footer>
  );
}