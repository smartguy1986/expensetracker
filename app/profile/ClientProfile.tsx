"use client";

import { useState } from "react";
import { updateUserProfile } from "@/app/actions";
import { signOut } from "next-auth/react";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { ChevronLeft, FileText, ScrollText, LogOut, Settings as SettingsIcon } from "lucide-react";

export default function ClientProfile({ initialProfile }: { initialProfile: any }) {
  const { setCurrency: updateGlobalCurrency } = useCurrency();
  const [currency, setCurrency] = useState(initialProfile.currency || "USD");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateUserProfile({ themePreference: "dark", accentColor: "#000000", currency });
    setMessage("Settings saved successfully!");
    setIsSaving(false);
    
    // Apply changes locally immediately
    updateGlobalCurrency(currency);
    
    setTimeout(() => setMessage(""), 3000);
  };

  const handleGenerateReport = () => {
    alert("Report generation started! Your PDF will be ready shortly.");
  };

  return (
    <div>
      {/* Settings Header */}
      <div className="top-bar-centered animate-in" style={{ padding: '24px 24px 16px 24px' }}>
        <div style={{ width: '40px', textAlign: 'left' }}>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <ChevronLeft size={28} />
          </button>
        </div>
        <div className="page-title">User Profile</div>
        <div style={{ width: '40px', textAlign: 'right', cursor: 'pointer', opacity: 0.8, color: 'var(--text-primary)' }}>
          <SettingsIcon size={24} />
        </div>
      </div>

      <div className="overlap-container animate-in delay-1" style={{ paddingBottom: '40px' }}>
        
        {message && (
          <div style={{ backgroundColor: 'var(--accent-color)', color: '#000', padding: '12px 20px', borderRadius: '16px', marginBottom: '16px', textAlign: 'center', fontWeight: '600' }}>
            {message}
          </div>
        )}

        {/* Preferences Card */}
        <div className="card">
          <h2 className="serif" style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Preferences</h2>
          <form onSubmit={handleSave}>
            
            <div className="form-group mb-4">
              <label className="form-label">Currency</label>
              <select className="form-input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            <button type="submit" className="btn" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
          </form>
        </div>

        {/* Actions Card */}
        <div className="card animate-in delay-2">
          <h2 className="serif" style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Data & Reports</h2>
          
          <button onClick={handleGenerateReport} className="tx-item" style={{ width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: '0' }}>
            <div className="flex align-center">
              <div className="tx-icon" style={{ backgroundColor: 'transparent', color: 'var(--text-primary)' }}><FileText size={20} /></div>
              <div>
                <div className="font-semibold" style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>Generate Report</div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>Download your financial summary as PDF</div>
              </div>
            </div>
          </button>
        </div>

        {/* Account Card */}
        <div className="card animate-in delay-3">
          <h2 className="serif" style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Account</h2>
          
          <button onClick={() => alert("Terms & Conditions will open here.")} className="tx-item" style={{ width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: '12px' }}>
            <div className="flex align-center">
              <div className="tx-icon" style={{ backgroundColor: 'transparent', color: 'var(--text-primary)' }}><ScrollText size={20} /></div>
              <div>
                <div className="font-semibold" style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>Terms & Conditions</div>
              </div>
            </div>
          </button>
          
          <button onClick={() => signOut({ callbackUrl: '/' })} className="tx-item" style={{ width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: '0' }}>
            <div className="flex align-center">
              <div className="tx-icon" style={{ backgroundColor: 'transparent', color: 'var(--danger)', borderColor: 'var(--danger)' }}><LogOut size={20} /></div>
              <div>
                <div className="font-semibold" style={{ fontSize: '1.05rem', color: 'var(--danger)' }}>Logout</div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>Sign out of your account securely</div>
              </div>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
