'use client'

import { Suspense, lazy } from 'react'
import { Component, ReactNode } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

// Error boundary to prevent Spline failures from crashing the React tree
interface ErrorBoundaryState { hasError: boolean }
class SplineErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="w-full h-full flex items-center justify-center text-textMuted text-sm">
          3D scene unavailable
        </div>
      )
    }
    return this.props.children
  }
}

// WebGL support detection
function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  // Show graceful fallback if WebGL not supported
  if (typeof window !== 'undefined' && !isWebGLSupported()) {
    return (
      <div className="w-full h-full flex items-center justify-center text-textMuted text-sm">
        Your browser does not support 3D graphics.
      </div>
    )
  }

  return (
    <SplineErrorBoundary>
      <Suspense
        fallback={
          <div
            className="w-full h-full flex items-center justify-center"
            role="status"
            aria-label="Loading 3D scene"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
              <span className="text-textMuted text-xs font-medium">Loading 3D scene…</span>
            </div>
          </div>
        }
      >
        <Spline scene={scene} className={className} />
      </Suspense>
    </SplineErrorBoundary>
  )
}
