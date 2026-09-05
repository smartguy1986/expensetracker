"use client";

import { useState } from "react";
import { updateUserProfile } from "@/app/actions";

export default function ClientProfile({ initialProfile }: { initialProfile: any }) {
  const [themePreference, setThemePreference] = useState(initialProfile.themePreference || "dark");
  const [accentColor, setAccentColor] = useState(initialProfile.accentColor || "#3b82f6");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateUserProfile({ themePreference, accentColor });
    setMessage("Profile updated successfully!");
    setIsSaving(false);
    
    // Apply changes locally immediately for better UX
    document.documentElement.setAttribute("data-theme", themePreference);
    document.documentElement.style.setProperty("--accent-color", accentColor);
    
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <h2 className="mb-3">Settings</h2>
      
      {message && <div className="mb-3 text-success font-bold">{message}</div>}

      <form onSubmit={handleSave}>
        <div className="form-group mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-input" value={initialProfile.username} disabled />
          <small className="text-muted">Username cannot be changed.</small>
        </div>
        
        <div className="form-group mb-3">
          <label className="form-label">Theme Preference</label>
          <select className="form-input" value={themePreference} onChange={(e) => setThemePreference(e.target.value)}>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>

        <div className="form-group mb-4">
          <label className="form-label">Accent Color</label>
          <div className="flex align-center">
            <input type="color" className="form-input" style={{ width: '60px', height: '40px', padding: '0', marginRight: '16px' }} value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
            <span>{accentColor}</span>
          </div>
        </div>

        <button type="submit" className="btn" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
