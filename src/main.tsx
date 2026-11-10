import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const App = lazy(() => import('./App'))
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

let configured = Boolean(supabaseUrl && supabaseKey)
try {
  if (!supabaseUrl || !['http:', 'https:'].includes(new URL(supabaseUrl).protocol)) configured = false
} catch {
  configured = false
}

if (!configured) {
  console.error('Supabase configuration is missing or invalid. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY at build time.')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {configured ? (
      <Suspense fallback={<p className="p-6" role="status">Loading store…</p>}>
        <App />
      </Suspense>
    ) : (
      <main className="p-6" role="alert">The store is temporarily unavailable. Please try again later.</main>
    )}
  </React.StrictMode>,
)
