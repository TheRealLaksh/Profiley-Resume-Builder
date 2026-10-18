import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// /laksh is hand-built (not a Firestore share): its own page, loaded as a separate chunk
// so visitors never download the editor or Firebase for it.
const App = lazy(() => import('./App.jsx'))
const LakshResume = lazy(() => import('./laksh/LakshResume.jsx'))
const LakshClassic = lazy(() => import('./laksh/LakshClassic.jsx'))
const isLakshPage = /^\/laksh\/?$/i.test(window.location.pathname)
// Strict readers get the standard Profiley resume by default; ?view=creative opts in to the creative page.
const wantsCreative = new URLSearchParams(window.location.search).get('view') === 'creative'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={null}>
      {isLakshPage ? (wantsCreative ? <LakshResume /> : <LakshClassic />) : <App />}
    </Suspense>
  </StrictMode>,
)
