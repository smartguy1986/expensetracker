"use client";

import { useState } from "react";
import { updateUserProfile } from "@/app/actions";
import { signOut } from "next-auth/react";

export default function ClientProfile({ initialProfile }: { initialProfile: any }) {
  const [currency, setCurrency] = useState(initialProfile.currency || "USD");
  const [themePreference, setThemePreference] = useState(initialProfile.themePreference || "light");
  const [accentColor, setAccentColor] = useState(initialProfile.accentColor || "#8b5cf6");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateUserProfile({ themePreference, accentColor, currency });
    setMessage("Settings saved successfully!");
    setIsSaving(false);
    
    // Apply changes locally immediately
    document.documentElement.setAttribute("data-theme", themePreference);
    document.documentElement.style.setProperty("--primary-purple", accentColor);
    
    setTimeout(() => setMessage(""), 3000);
  };

  const handleGenerateReport = () => {
    alert("Report generation started! Your PDF will be ready shortly.");
  };

  return (
    <div>
      {/* Settings Header */}
      <div className="hero-header" style={{ paddingBottom: '80px' }}>
        <div className="hero-header-content text-center">
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Settings</h1>
          <p style={{ opacity: 0.9 }}>Manage your preferences and account</p>
        </div>
      </div>

      <div className="overlap-container" style={{ marginTop: '-60px', paddingBottom: '40px' }}>
        
        {message && (
          <div style={{ backgroundColor: 'var(--success)', color: 'white', padding: '12px 20px', borderRadius: '16px', marginBottom: '16px', textAlign: 'center', fontWeight: '600' }}>
            {message}
          </div>
        )}

        {/* Preferences Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Preferences</h2>
          <form onSubmit={handleSave}>
            
            <div className="form-group mb-3">
              <label className="form-label">Currency</label>
              <select className="form-input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
            
            <div className="form-group mb-3">
              <label className="form-label">Theme Mode</label>
              <select className="form-input" value={themePreference} onChange={(e) => setThemePreference(e.target.value)}>
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Accent Color</label>
              <div className="flex align-center">
                <input type="color" className="form-input" style={{ width: '80px', height: '48px', padding: '0', marginRight: '16px' }} value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                <span className="font-semibold">{accentColor}</span>
              </div>
            </div>

            <button type="submit" className="btn" style={{ width: '100%' }} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
          </form>
        </div>

        {/* Actions Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Data & Reports</h2>
          
          <button onClick={handleGenerateReport} className="tx-item" style={{ width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: '0' }}>
            <div className="flex align-center">
              <div className="tx-icon" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>📄</div>
              <div>
                <div className="font-semibold" style={{ fontSize: '1.05rem', color: 'var(--text-color)' }}>Generate Report</div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>Download your financial summary as PDF</div>
              </div>
            </div>
          </button>
        </div>

        {/* Account Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Account</h2>
          
          <button onClick={() => alert("Terms & Conditions will open here.")} className="tx-item" style={{ width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: '12px' }}>
            <div className="flex align-center">
              <div className="tx-icon" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>📜</div>
              <div>
                <div className="font-semibold" style={{ fontSize: '1.05rem', color: 'var(--text-color)' }}>Terms & Conditions</div>
              </div>
            </div>
          </button>
          
          <button onClick={() => signOut({ callbackUrl: '/' })} className="tx-item" style={{ width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: '0' }}>
            <div className="flex align-center">
              <div className="tx-icon" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>🚪</div>
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
