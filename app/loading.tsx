export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
      minHeight: '60vh',
    }}>
      <img 
        src="/images/loader.gif" 
        alt="Loading..." 
        style={{ 
          width: '180px', 
          height: '180px', 
          opacity: 0.8 
        }} 
      />
    </div>
  );
}
