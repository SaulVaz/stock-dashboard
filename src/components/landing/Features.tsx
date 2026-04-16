"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: "▣",
    title: "Market Overview",
    description: "Get a complete snapshot of the market with real-time indices, your watchlist and top movers all in one view.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "hover:border-purple-500/50",
    href: "/dashboard",
  },
  {
    icon: "☆",
    title: "Watchlist",
    description: "Track your favorite stocks with live prices, sparklines showing 7-day trends and instant price alerts.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "hover:border-blue-500/50",
    href: "/watchlist",
  },
  {
    icon: "⇄",
    title: "Compare stocks",
    description: "Compare multiple stocks side by side with combined price charts and detailed metrics table.",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "hover:border-teal-500/50",
    href: "/compare",
  },
  {
    icon: "◫",
    title: "Earnings calendar",
    description: "Never miss an earnings report. Track upcoming and past earnings for all your watchlist symbols.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "hover:border-amber-500/50",
    href: "/calendar",
  },
  {
    icon: "◎",
    title: "Financial news",
    description: "Stay informed with the latest market news filtered by symbol. Get news from multiple sources in one feed.",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "hover:border-green-500/50",
    href: "/news",
  },
  {
    icon: "▲",
    title: "AI Prediction",
    description: "Get technical analysis predictions powered by RSI, momentum and moving averages for any stock.",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "hover:border-red-500/50",
    href: "/stock/AAPL",
  },
  {
    icon: "♦",
    title: "Price alerts",
    description: "Set custom price alerts for any stock. Get notified instantly when a stock crosses your target price.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "hover:border-pink-500/50",
    href: "/stock/AAPL",
  },
  {
    icon: "$",
    title: "ROI Calculator",
    description: "Calculate your return on investment for any stock. See how much you would have earned buying at any date.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "hover:border-indigo-500/50",
    href: "/stock/AAPL",
  },
];

function FeatureCard({
  feature,
  index,
  onClick,
}: {
  feature: typeof FEATURES[0];
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 80);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.5s ease, transform 0.5s ease`,
      }}
      className={cn(
        "bg-card border border-border rounded-xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] group",
        feature.border
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
        feature.bg,
        feature.color
      )}>
        {feature.icon}
      </div>
      <div>
        <h3 className={cn(
          "text-sm font-semibold text-foreground transition-colors",
          `group-hover:${feature.color}`
        )}>
          {feature.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export function Features() {
  const router = useRouter();
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTitleVisible(true);
      },
      { threshold: 0.1 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-6 py-10 max-w-6xl mx-auto w-full">
      <div
        ref={titleRef}
        style={{
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          Everything you need to track the market
        </h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          A complete suite of tools for investors and traders of all levels.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((feature, i) => (
          <FeatureCard
            key={feature.title}
            feature={feature}
            index={i}
            onClick={() => router.push(feature.href)}
          />
        ))}
      </div>
    </section>
  );
}