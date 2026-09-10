"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "@/app/components/Icons";
import { Edit2 } from "lucide-react";
import GlobalEditModal, { EntityType } from "../components/GlobalEditModal";

export default function ClientRecentActivity({ transactions, currencySymbol }: { transactions: any[], currencySymbol: string }) {
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [editModalData, setEditModalData] = useState<{ type: EntityType, data: any } | null>(null);

  const filtered = transactions.filter(tx => {
    if (filter === 'credit') return tx.type === 'income';
    if (filter === 'debit') return tx.type === 'expense';
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button 
          onClick={() => setFilter('all')} 
          style={{ padding: '6px 14px', fontSize: '0.85rem', fontWeight: '500', borderRadius: '20px', border: '1px solid var(--glass-border)', background: filter === 'all' ? 'var(--static-highlight)' : 'var(--glass-bg)', color: filter === 'all' ? '#000' : 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s ease' }}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('credit')} 
          style={{ padding: '6px 14px', fontSize: '0.85rem', fontWeight: '500', borderRadius: '20px', border: '1px solid var(--glass-border)', background: filter === 'credit' ? 'var(--static-highlight)' : 'var(--glass-bg)', color: filter === 'credit' ? '#000' : 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s ease' }}
        >
          Credit
        </button>
        <button 
          onClick={() => setFilter('debit')} 
          style={{ padding: '6px 14px', fontSize: '0.85rem', fontWeight: '500', borderRadius: '20px', border: '1px solid var(--glass-border)', background: filter === 'debit' ? 'var(--static-highlight)' : 'var(--glass-bg)', color: filter === 'debit' ? '#000' : 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s ease' }}
        >
          Debit
        </button>
      </div>

      <div className="tx-list">
        {filtered.length === 0 && <div className="text-muted text-center py-4" style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>No recent activity.</div>}
        {filtered.slice(0, 10).map(tx => (
          <div key={tx.id} className="tx-item" style={{ borderBottom: '1px solid var(--glass-border)', padding: '16px 0', margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="flex align-center" style={{ gap: '16px' }}>
              <div className="tx-icon" style={{ borderColor: 'var(--glass-border)', color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                {tx.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '500', marginBottom: '4px', color: 'var(--text-primary)' }}>{tx.title}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => {
                  let type: any = "EXPENSE";
                  let realId = tx.id;
                  if (tx.id.startsWith("inc-")) { type = "INCOME"; realId = tx.id.replace("inc-", ""); }
                  else if (tx.id.startsWith("exp-")) { type = "EXPENSE"; realId = tx.id.replace("exp-", ""); }
                  else if (tx.id.startsWith("fe-")) { type = "FIXED_ENTRY"; realId = tx.id.replace("fe-", ""); }
                  else if (tx.id.startsWith("ve-")) { type = "VARIABLE_ENTRY"; realId = tx.id.replace("ve-", ""); }
                  
                  setEditModalData({
                    type,
                    data: { id: realId, title: tx.title, amount: tx.amount, date: tx.date }
                  });
                }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <Edit2 size={16} />
              </button>
              <div style={{ color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)', fontWeight: '600', fontSize: '1.1rem' }}>
                {tx.type === 'income' ? '+' : '-'}{currencySymbol}{Math.abs(tx.amount).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editModalData && (
        <GlobalEditModal
          entityType={editModalData.type}
          entityData={editModalData.data}
          onClose={() => setEditModalData(null)}
        />
      )}
    </div>
  );
}
