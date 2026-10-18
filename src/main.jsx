import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// /laksh is hand-built (not a Firestore share): its own page, loaded as a separate chunk
// so visitors never download the editor or Firebase for it.
const App = lazy(() => import('./App.jsx'))
const LakshResume = lazy(() => import('./laksh/LakshResume.jsx'))
const isLakshPage = /^\/laksh\/?$/i.test(window.location.pathname)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={null}>
      {isLakshPage ? <LakshResume /> : <App />}
    </Suspense>
  </StrictMode>,
)
