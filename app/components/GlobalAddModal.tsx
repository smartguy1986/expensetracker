"use client";

import { useState, useEffect } from "react";
import { X, ArrowUpCircle, ArrowDownCircle, ChevronLeft } from "lucide-react";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { addExpense, addIncome, getRecentTransactions } from "@/app/actions";

const EXPENSE_CATEGORIES: Record<string, string[]> = {
  "🍔 Food": ["Groceries", "Restaurant", "Food Delivery", "Coffee & Snacks"],
  "🚗 Transportation": ["Fuel", "Cab / Ride", "Public Transport", "Parking", "Vehicle Maintenance"],
  "🏠 Housing": ["Rent", "Maintenance", "Furnishing"],
  "🛍️ Shopping": ["Clothing", "Electronics", "Accessories"],
  "💡 Bills": ["Electricity", "Water", "Internet", "Phone"],
  "❤️ Health": ["Medicine", "Doctor", "Fitness"],
  "🎬 Entertainment": ["Movies", "Events", "Games", "Subscriptions"],
  "✈️ Travel": ["Flights", "Hotels", "Sightseeing"],
  "👨‍👩‍👧 Family & Personal": ["Childcare", "Pets", "Personal Care"],
  "💳 Financial": ["Taxes", "Insurance", "Fees"],
  "🎁 Gifts & Donations": ["Gifts", "Charity"],
  "📦 Other": ["Miscellaneous"]
};

const INCOME_CATEGORIES = [
  "Salary", "Freelance", "Business", "Gifts", "Refund", "Interest", "Other"
];

interface GlobalAddModalProps {
  onClose: () => void;
}

export default function GlobalAddModal({ onClose }: GlobalAddModalProps) {
  const { currencySymbol } = useCurrency();
  const [activeTab, setActiveTab] = useState<"SELECT" | "INCOME" | "EXPENSE">("SELECT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  // Form states
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [title, setTitle] = useState("");

  const loadRecent = () => {
    getRecentTransactions().then(setRecentTransactions);
  };

  useEffect(() => {
    loadRecent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedCategory) return;
    
    setIsSubmitting(true);
    try {
      const parsedAmount = parseFloat(amount);
      const finalTitle = title || selectedSubCategory || selectedCategory;

      if (activeTab === "EXPENSE") {
        await addExpense({
          title: finalTitle,
          categoryName: selectedCategory,
          subCategory: selectedSubCategory,
          monthlyCost: parsedAmount
        });
      } else if (activeTab === "INCOME") {
        await addIncome({
          title: finalTitle,
          categoryName: selectedCategory,
          amount: parsedAmount
        });
      }
      
      // Reset form & go back to SELECT
      setAmount("");
      setTitle("");
      setSelectedCategory("");
      setSelectedSubCategory("");
      setIsSubmitting(false);
      setActiveTab("SELECT");
      loadRecent(); // Refresh list
    } catch (error) {
      console.error("Error adding transaction:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      zIndex: 1000,
      display: 'flex', flexDirection: 'column',
      animation: 'slideUp 0.3s ease-out'
    }}>
      {/* Header */}
      <div className="top-bar-centered" style={{ padding: '24px' }}>
        <div style={{ width: '40px', textAlign: 'left' }}>
          <button onClick={() => activeTab !== "SELECT" ? setActiveTab("SELECT") : onClose()} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 0 }}>
            {activeTab !== "SELECT" ? <ChevronLeft size={28} /> : <X size={28} />}
          </button>
        </div>
        <div className="page-title">
          {activeTab === "SELECT" ? "Add" : activeTab === "INCOME" ? "Add Income" : "Add Expense"}
        </div>
        <div style={{ width: '40px' }}></div>
      </div>

      <div style={{ padding: '0 24px', flex: 1, overflowY: 'auto' }}>
        {activeTab === "SELECT" && (
          <div className="animate-in">
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
              <button 
                className="card"
                onClick={() => setActiveTab("INCOME")}
                style={{ flex: 1, margin: 0, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '8px', color: '#8b5cf6' }}><ArrowUpCircle /></div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Add Income</div>
              </button>
              
              <button 
                className="card"
                onClick={() => setActiveTab("EXPENSE")}
                style={{ flex: 1, margin: 0, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '8px', color: '#f97316' }}><ArrowDownCircle /></div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Add Expense</div>
              </button>
            </div>

            <h2 className="serif" style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Last Added</h2>
            <div className="tx-list">
              {recentTransactions.length === 0 && (
                <div style={{ opacity: 0.5, fontStyle: 'italic' }}>No recent transactions.</div>
              )}
              {recentTransactions.map((tx: any) => (
                <div key={tx.id} className="flex justify-between align-center" style={{ marginBottom: '20px' }}>
                  <div className="flex align-center">
                    <div style={{ 
                      width: '48px', height: '48px', background: 'var(--glass-bg)', 
                      borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem', marginRight: '16px'
                    }}>
                      {tx.type === 'income' ? '💵' : (tx.category.includes('🍔') ? '🍔' : '🧾')}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '4px' }}>{tx.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: '600', color: tx.type === 'income' ? 'var(--brand)' : 'var(--text-primary)', fontSize: '1.1rem' }}>
                      {tx.type === 'income' ? '+' : ''}{currencySymbol}{Math.abs(tx.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab !== "SELECT" && (
          <form onSubmit={handleSubmit} className="animate-in delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{currencySymbol}</span>
              <input 
                type="number" step="0.01" className="form-input" 
                style={{ paddingLeft: '32px', fontSize: '1.2rem', fontWeight: '600' }} 
                placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={selectedCategory} onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory("");
              }} required>
                <option value="" disabled>Select Category</option>
                {activeTab === "EXPENSE" ? (
                  Object.keys(EXPENSE_CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)
                ) : (
                  INCOME_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)
                )}
              </select>
            </div>

            {activeTab === "EXPENSE" && selectedCategory && (
              <div className="form-group animate-in">
                <label className="form-label">Subcategory</label>
                <select className="form-input" value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)} required>
                  <option value="" disabled>Select Subcategory</option>
                  {EXPENSE_CATEGORIES[selectedCategory]?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Note (Optional)</label>
              <input type="text" className="form-input" placeholder="Additional details..." value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <button type="submit" className="btn" style={{ marginTop: '16px' }} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </form>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
