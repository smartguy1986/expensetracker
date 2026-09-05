"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/app/actions";

function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [theme, setTheme] = useState("dark");
  const [accent, setAccent] = useState("#3b82f6");

  useEffect(() => {
    if (session) {
      getUserProfile().then((profile) => {
        if (profile) {
          setTheme(profile.themePreference);
          setAccent(profile.accentColor);
          document.documentElement.setAttribute("data-theme", profile.themePreference);
          document.documentElement.style.setProperty("--accent-color", profile.accentColor);
        }
      });
    }
  }, [session]);

  if (!session) {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Bank Accounts", path: "/bank-accounts" },
    { name: "Expenses", path: "/expenses" },
    { name: "Credit Cards & EMIs", path: "/credit-cards" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">ExpenseTracker</div>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.path} className={`nav-item ${pathname === item.path ? "active" : ""}`}>
              <Link href={item.path}>{item.name}</Link>
            </li>
          ))}
          <li className="nav-item" style={{ marginTop: "auto" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); signOut(); }}>
              Sign Out
            </a>
          </li>
        </ul>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppLayout>{children}</AppLayout>
    </SessionProvider>
  );
}
