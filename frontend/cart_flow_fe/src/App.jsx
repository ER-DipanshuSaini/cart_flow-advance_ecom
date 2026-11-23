import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '3rem 1.5rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '20px', background: '#e0e7ff', color: '#4338ca', fontWeight: '600', fontSize: '14px', marginBottom: '16px' }}>
        Phase 1 - Frontend Initialized
      </div>
      <h1 style={{ fontSize: '2.8rem', fontWeight: '800', margin: '0.5rem 0', color: '#1e293b' }}>
        🛒 CartFlow
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '2rem' }}>
        Advance E-Commerce Platform with AI Services
      </p>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', marginBottom: '2rem', textAlign: 'left', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>⚡ Setup Overview</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2' }}>
          <li>✅ <strong>Frontend:</strong> React 19 + Vite (Running)</li>
          <li>⏳ <strong>Next Step:</strong> Auth / Login & Signup Portal</li>
          <li>⏳ <strong>Core Backend:</strong> Django REST Framework (DRF)</li>
          <li>⏳ <strong>AI Microservice:</strong> FastAPI (Virtual Try-on / Recommendations)</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
        <button
          onClick={() => setCount((c) => c + 1)}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4f46e5')}
        >
          React State Test: Clicked {count} times
        </button>
      </div>
    </div>
  )
}

export default App
