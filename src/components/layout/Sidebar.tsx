"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Market Overview", href: "/dashboard", icon: "▣" },
  { label: "Watchlist", href: "/watchlist", icon: "☆" },
  { label: "Compare", href: "/compare", icon: "⇄" },
  { label: "Calendar", href: "/calendar", icon: "◫" },
  { label: "News", href: "/news", icon: "◎" },
  { label: "Settings", href: "/settings", icon: "⚙" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useUIStore();

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
        sidebarOpen ? "w-56" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
          S
        </div>
        {sidebarOpen && (
          <span className="font-semibold text-sm text-foreground">
            StockDash
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {sidebarOpen && (
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Data by Finnhub
          </p>
        </div>
      )}
    </aside>
  );
}
