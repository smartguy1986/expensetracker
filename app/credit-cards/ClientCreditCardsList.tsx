"use client";

import { useState } from "react";
import { deleteEmi, deleteCreditCard } from "@/app/actions";
import { useCurrency } from "@/app/components/CurrencyProvider";
import Link from "next/link";
import { ChevronLeft, Plus, CreditCard, Layers } from "lucide-react";

export default function ClientCreditCardsList({ initialCards, initialEmis }: { initialCards: any[], initialEmis: any[] }) {
  const { currencySymbol } = useCurrency();

  const gradients = [
    'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
    'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 100%)',
    'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 100%)',
  ];

  return (
    <div style={{ paddingBottom: '120px' }}>
      <div className="top-bar-centered animate-in" style={{ padding: '24px 24px 16px 24px' }}>
        <div style={{ width: '40px', textAlign: 'left' }}>
          <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 0 }}>
            <ChevronLeft size={28} />
          </button>
        </div>
        <div className="page-title">My Cards</div>
        <div style={{ width: '40px', textAlign: 'right' }}>
          <Link href="/credit-cards/add" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 0 }}>
              <Plus size={28} />
            </button>
          </Link>
        </div>
      </div>

      <div className="animate-in delay-1" style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {initialCards.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center', marginTop: '40px' }}>No cards added yet.</p>
        ) : (
          initialCards.map((card, index) => {
            const gradient = gradients[index % gradients.length];
            const parts = card.details.split(' - ');
            const holder = parts[0] || "Card Holder";
            const last4 = parts[1] || "****";
            
            return (
              <Link key={card.id} href={`/credit-cards/${card.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: gradient,
                  borderRadius: '24px',
                  padding: '24px',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--glass-shadow)',
                  border: '1px solid var(--glass-border)',
                  backdropFilter: 'blur(24px)',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(0,0,0,0.02)', pointerEvents: 'none' }}></div>
                  
                  <div className="flex justify-between" style={{ position: 'relative' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', fontStyle: 'italic', letterSpacing: '-1px' }}>VISA</div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Current Balance</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{currencySymbol}{card.availableBalance.toLocaleString()}</div>
                    </div>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <div style={{ fontSize: '1.2rem', letterSpacing: '3px', marginBottom: '8px' }}>
                      **** **** **** {last4}
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                      {holder}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <div className="animate-in delay-2" style={{ padding: '0 24px', marginTop: '24px' }}>
        <div className="card">
          <h2 className="mb-4" style={{ color: 'var(--text-primary)' }}>Active EMIs</h2>
          {initialEmis.length === 0 && <p className="text-muted mb-4">No EMIs currently.</p>}
          {initialEmis.map((emi) => (
            <div key={emi.id} className="tx-item" style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <div className="flex align-center">
                <div className="tx-icon" style={{ borderColor: 'var(--text-muted)', color: 'var(--text-primary)' }}><Layers size={20} /></div>
                <div style={{ marginLeft: '16px' }}>
                  <div style={{ fontWeight: '600' }}>{emi.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.85rem' }}>{currencySymbol}{emi.amount}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="animate-in delay-3" style={{ padding: '0 24px', marginTop: '16px' }}>
        <Link href="/credit-cards/add-emi" style={{ display: 'block', textDecoration: 'none' }}>
          <button className="btn" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <Plus size={20} /> Add New EMI
          </button>
        </Link>
      </div>
    </div>
  );
}
