import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { convexUrl } from '@/lib/convex'

function withConvexProvider(children: ReactNode) {
  if (!convexUrl) return children

  const client = new ConvexReactClient(convexUrl)
  return <ConvexProvider client={client}>{children}</ConvexProvider>
}

createRoot(document.getElementById('root')!).render(
  withConvexProvider(
    <StrictMode>
      <App />
    </StrictMode>,
  ),
)
