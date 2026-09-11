"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/app/actions";
import { CurrencyProvider } from "@/app/components/CurrencyProvider";
import { Home, Wallet, Plus, BarChart2, Settings } from "lucide-react";
import GlobalAddModal from "@/app/components/GlobalAddModal";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    getUserProfile()
      .then((profile) => {
        setProfileLoaded(true);
      })
      .catch((error) => {
        // User not logged in, ignore the error
        console.log("No active session.");
        setProfileLoaded(true);
      });
  }, []);

  if (pathname === "/") {
    return <>{children}</>;
  }

  const navItems = [
    { icon: <Home size={24} />, path: "/dashboard", label: "Home" },
    { icon: <Wallet size={24} />, path: "/categories", label: "Categories" },
    { icon: <Plus size={32} />, path: "/add", isFab: true },
    { icon: <BarChart2 size={24} />, path: "/statistics", label: "Statistics" },
    { icon: <Settings size={24} />, path: "/profile", label: "Settings" },
  ];

  return (
    <CurrencyProvider>
      <div className="layout">
        <main className="main-content">
          {children}
        </main>
        
        <nav className="bottom-nav">
          {navItems.map((item, index) => {
            if (item.isFab) {
              return (
                <button 
                  key={index} 
                  onClick={() => setShowAddModal(true)} 
                  className="nav-fab animate-in"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  {item.icon}
                </button>
              );
            }
            
            return (
              <Link 
                key={index} 
                href={item.path} 
                className={`nav-item ${pathname === item.path ? "active" : ""}`}
                title={item.label}
              >
                {item.icon}
              </Link>
            );
          })}
        </nav>
      </div>

      {showAddModal && <GlobalAddModal onClose={() => setShowAddModal(false)} />}
    </CurrencyProvider>
  );
}
