"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--primary-gradient)', position: 'relative' }}>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/images/expenselogo.png" alt="Expense Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--card-bg)', padding: '40px 32px', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', textAlign: 'center', boxShadow: '0 -10px 20px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--text-color)', fontWeight: '800', lineHeight: 1.2 }}>
          Save your money with<br/>Expense Tracker
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.5 }}>
          Save money! The more your money<br/>works for you, the less you have to<br/>work for money.
        </p>
        
        <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className="btn" style={{ width: '100%', padding: '20px', borderRadius: '20px', fontSize: '1.2rem', marginBottom: '16px', backgroundColor: '#fff', color: '#000', border: '1px solid #ddd', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <img src="https://authjs.dev/img/providers/google.svg" alt="Google Logo" style={{ width: '24px', height: '24px' }} />
          Continue with Google
        </button>
      </div>

    </div>
  );
}
