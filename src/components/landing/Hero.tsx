"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Hero() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 gap-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[200px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[200px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Badge */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
        className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-sm font-medium"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        Real-time market data powered by Finnhub
      </div>

      {/* Title */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
        }}
        className="flex flex-col gap-4 max-w-4xl"
      >
        <h1 className="text-5xl sm:text-7xl font-bold text-foreground leading-tight tracking-tight">
          Your personal
          <span className="text-primary"> stock market</span>
          {" "}dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Track your favorite stocks, analyze price trends, compare assets and stay on top of financial news — all in one place.
        </p>
      </div>

      {/* CTA buttons */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
        }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary/90 hover:scale-105 transition-all duration-200"
        >
          Get started →
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-card text-foreground border border-border px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-accent hover:scale-105 transition-all duration-200"
        >
          View demo
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
        }}
        className="flex items-center gap-12 mt-4 pt-8 border-t border-border"
      >
        {[
          { label: "Data refresh", value: "30s" },
          { label: "Stocks trackable", value: "∞" },
          { label: "Features", value: "10+" },
          { label: "Cost", value: "$0" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1">
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}