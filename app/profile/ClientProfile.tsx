"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { 
  ChevronRight, 
  User, 
  Shield, 
  Coins, 
  Tags, 
  CreditCard, 
  Repeat, 
  Target, 
  Palette, 
  Bell, 
  Calendar, 
  DownloadCloud, 
  UploadCloud, 
  Cloud, 
  HelpCircle, 
  Info,
  LogOut
} from "lucide-react";
import { updateUserProfile } from "@/app/actions";

export default function ClientProfile({ initialProfile }: { initialProfile: any }) {
  const { currencySymbol, setCurrency: updateGlobalCurrency } = useCurrency();
  const [currency, setCurrency] = useState(initialProfile.currency || "USD");

  const handleCurrencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCur = e.target.value;
    setCurrency(newCur);
    updateGlobalCurrency(newCur);
    await updateUserProfile({ themePreference: "dark", accentColor: "#000000", currency: newCur });
  };

  const [username, setUsername] = useState(initialProfile.username || "Arijit");
  const [isEditingName, setIsEditingName] = useState(false);
  const [avatarImage, setAvatarImage] = useState(initialProfile.image || null);
  const email = initialProfile.email || "arijit@email.com";
  const avatarText = username.charAt(0).toUpperCase();

  const handleSaveName = async () => {
    setIsEditingName(false);
    await updateUserProfile({ username });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setAvatarImage(base64String);
        await updateUserProfile({ image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const ListItem = ({ icon: Icon, label, value, onClick, color = "var(--text-primary)", children }: any) => (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '16px', 
        borderBottom: '1px solid var(--glass-border)',
        cursor: onClick ? 'pointer' : 'default',
        background: 'var(--bg-color)',
        color
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Icon size={20} />
        <span style={{ fontWeight: '500', fontSize: '1.05rem' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
        {value && <span style={{ fontSize: '0.95rem' }}>{value}</span>}
        {children}
        {onClick && <ChevronRight size={18} opacity={0.5} />}
      </div>
    </div>
  );

  const GroupHeader = ({ title }: { title: string }) => (
    <div className="serif" style={{ 
      padding: '24px 16px 8px 16px', 
      fontSize: '0.85rem', 
      fontWeight: '600', 
      color: 'var(--text-muted)',
      letterSpacing: '1px',
      textTransform: 'uppercase'
    }}>
      {title}
    </div>
  );

  return (
    <div style={{ paddingBottom: '120px', background: 'transparent' }}>
      
      {/* Top Bar */}
      <div style={{ padding: '24px 24px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: '60px' }}></div>
        <div className="page-title" style={{ fontSize: '1.2rem' }}></div>
        <div style={{ width: '60px', textAlign: 'right' }}>
          <button 
            onClick={() => {
              if (isEditingName) handleSaveName();
              else setIsEditingName(true);
            }} 
            style={{ background: 'transparent', border: 'none', color: 'var(--brand, #8b5cf6)', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }}
          >
            {isEditingName ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '16px 24px 24px',
      }}>
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <label style={{ cursor: 'pointer' }}>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            {avatarImage ? (
              <div style={{
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundImage: `url(${avatarImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }} />
            ) : (
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'var(--brand, #8b5cf6)', 
                color: 'white',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {avatarText}
              </div>
            )}
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--brand, #8b5cf6)', borderRadius: '50%', padding: '4px', border: '2px solid white' }}>
              <User size={12} color="white" />
            </div>
          </label>
        </div>
        {isEditingName ? (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              style={{ margin: 0, textAlign: 'center', fontSize: '1.2rem', padding: '4px 8px' }}
              autoFocus
            />
          </div>
        ) : (
          <div className="page-title" style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
            {username}
          </div>
        )}
        <p style={{ color: 'var(--text-muted)', margin: '0 0 20px 0', fontSize: '0.9rem' }}>
          {email}
        </p>
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{ background: 'var(--glass-bg)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
          
          <GroupHeader title="Finance" />
          <ListItem icon={Coins} label="Currency">
            <select 
              value={currency} 
              onChange={handleCurrencyChange} 
              style={{ 
                border: 'none', 
                background: 'transparent', 
                color: 'var(--text-muted)', 
                fontSize: '0.95rem',
                textAlign: 'right',
                outline: 'none',
                WebkitAppearance: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
            <ChevronRight size={18} opacity={0.5} />
          </ListItem>

          <div style={{ padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            {initialProfile?.lastLoginAt && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Last login: {new Date(initialProfile.lastLoginAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            )}
            <button 
              onClick={() => signOut({ callbackUrl: '/' })} 
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--danger)', 
                fontSize: '1.1rem', 
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <LogOut size={20} /> Sign Out
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
