"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/app/actions";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState("dark");
  const [accent, setAccent] = useState("#8b5cf6");
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    getUserProfile().then((profile) => {
      if (profile) {
        setTheme(profile.themePreference);
        setAccent(profile.accentColor);
        document.documentElement.setAttribute("data-theme", profile.themePreference);
        document.documentElement.style.setProperty("--accent-color", profile.accentColor);
      }
      setProfileLoaded(true);
    });
  }, []);

  if (pathname === "/") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "🏠", path: "/dashboard", label: "Home" },
    { name: "📊", path: "/expenses", label: "Stats" },
    { name: "add", path: "/expenses", isFab: true },
    { name: "💳", path: "/credit-cards", label: "Wallet" },
    { name: "👤", path: "/profile", label: "Profile" },
  ];

  return (
    <div className="layout">
      <main className="main-content">
        {children}
      </main>
      
      <nav className="bottom-nav">
        {navItems.map((item, index) => {
          if (item.isFab) {
            return (
              <div key={index} className="nav-fab-wrapper">
                <Link href={item.path} className="nav-fab">
                  +
                </Link>
              </div>
            );
          }
          
          return (
            <Link 
              key={index} 
              href={item.path} 
              className={`nav-item ${pathname === item.path ? "active" : ""}`}
              title={item.label}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
