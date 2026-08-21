'use client'

import { Suspense, lazy, memo } from 'react'

// Lazy-imported once at module level — never recreated.
// Code-split so the heavy @splinetool/react-spline bundle only loads
// when SplineScene is actually rendered (controlled by IntersectionObserver
// in the parent section).
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

// Minimal inline fallback — a simple dark pulsing placeholder that
// occupies the exact same space as the scene without blocking layout.
// No heavy spinner, no layout shift.
function SplineFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent">
      <div className="w-8 h-8 rounded-full border border-border/40 border-t-accent/60 animate-spin" />
    </div>
  )
}

// memo: SplineScene props are stable strings — the parent's MotionValue
// changes should NEVER cause Spline to re-render. memo() guarantees this.
export const SplineScene = memo(function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense fallback={<SplineFallback />}>
      <Spline
        scene={scene}
        className={className}
      />
    </Suspense>
  )
})

SplineScene.displayName = 'SplineScene'
