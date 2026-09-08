"use client";

import { useCurrency } from "@/app/components/CurrencyProvider";
import { ChevronLeft, Receipt, ShoppingBag, CreditCard, TrendingUp, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ClientCategoryHub({ categories }: { categories: any[] }) {
  const router = useRouter();
  const { currencySymbol } = useCurrency();

  const getCategoryTheme = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('bill') || n.includes('fixed')) return { icon: <Receipt size={24} />, bg: 'rgba(0, 0, 0, 0.05)', color: '#000000' };
    if (n.includes('shop') || n.includes('variable')) return { icon: <ShoppingBag size={24} />, bg: 'rgba(0, 0, 0, 0.05)', color: '#000000' };
    if (n.includes('loan') || n.includes('emi') || n.includes('credit')) return { icon: <CreditCard size={24} />, bg: 'rgba(0, 0, 0, 0.05)', color: '#000000' };
    if (n.includes('invest')) return { icon: <TrendingUp size={24} />, bg: 'rgba(0, 0, 0, 0.05)', color: '#000000' };
    return { icon: <Sparkles size={24} />, bg: 'rgba(0, 0, 0, 0.05)', color: '#000000' };
  };

  return (
    <div style={{ paddingBottom: '120px' }}>
      <div className="top-bar-centered animate-in" style={{ padding: '24px 24px 16px 24px' }}>
        <div style={{ width: '40px' }}></div>
        <div className="page-title">Categories</div>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="animate-in delay-1" style={{ padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {categories.map((cat) => {
          const theme = getCategoryTheme(cat.name);
          return (
            <Link key={cat.id} href={`/categories/${cat.id}`} style={{ textDecoration: 'none' }}>
              <div 
                className="card" 
                style={{ 
                  margin: 0, 
                  padding: '24px 16px', 
                  border: `1px solid ${theme.color}40`,
                  background: theme.bg,
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ marginBottom: '16px', color: theme.color, width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.5)' }}>
                  {theme.icon}
                </div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)', textAlign: 'center', marginBottom: '8px' }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: theme.color, fontWeight: '700' }}>
                  {currencySymbol}{cat.totalSpent.toLocaleString()}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
