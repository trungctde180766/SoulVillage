import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Normalize direct links before HashRouter reads the initial location.
// replaceState inside an effect does not notify an already mounted router.
if (window.location.pathname !== '/' && !window.location.hash) {
  const targetHash = `#${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, '', `/${targetHash}`);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
