import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-color)', position: 'relative' }}>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Placeholder for 3D Wallet illustration */}
        <div style={{ width: '200px', height: '200px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
          👛
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--card-bg)', padding: '40px 32px', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', textAlign: 'center', boxShadow: '0 -10px 20px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--text-color)', fontWeight: '700', lineHeight: 1.2 }}>
          Save your money with<br/>Expense Tracker
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.5 }}>
          Save money! The more your money<br/>works for you, the less you have to<br/>work for money.
        </p>
        <Link href="/dashboard" className="btn" style={{ width: '100%', padding: '20px', borderRadius: '20px', fontSize: '1.1rem', backgroundColor: 'var(--accent-color)' }}>
          Let's Start
        </Link>
      </div>

    </div>
  );
}
