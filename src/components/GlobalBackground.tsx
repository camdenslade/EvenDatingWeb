import { useEffect, useRef } from 'react'
import './GlobalBackground.css'

interface GlobalBackgroundProps {
  mode?: 'dark' | 'light' | 'teal'
}

export default function GlobalBackground({ mode = 'teal' }: GlobalBackgroundProps) {
  const circleARef = useRef<HTMLDivElement>(null)
  const circleBRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Start animations
    if (circleARef.current) {
      circleARef.current.style.animation = 'driftY 9s ease-in-out infinite'
    }
    if (circleBRef.current) {
      circleBRef.current.style.animation = 'driftX 11s ease-in-out infinite'
    }
    if (rectRef.current) {
      rectRef.current.style.animation = 'driftXRect 13s ease-in-out infinite'
    }
  }, [])

  // Teal theme matches mobile app default theme
  const circleColor = mode === 'teal' ? '#7FDDE0' : mode === 'dark' ? '#FFFFFF' : '#000000'
  const rectColor = mode === 'teal' ? '#198686' : mode === 'dark' ? '#FFFFFF' : '#000000'
  const opacity = mode === 'teal' ? 0.5 : mode === 'dark' ? 0.10 : 0.12

  return (
    <div className="global-background" style={{ pointerEvents: 'none' }}>
      <div
        ref={circleARef}
        className="background-circle circle-a"
        style={{
          backgroundColor: circleColor,
          opacity,
          width: '260px',
          height: '260px',
          top: '-40px',
          left: '-60px',
        }}
      />
      <div
        ref={circleBRef}
        className="background-circle circle-b"
        style={{
          backgroundColor: circleColor,
          opacity,
          width: '180px',
          height: '180px',
          bottom: '120px',
          right: '-40px',
        }}
      />
      <div
        ref={rectRef}
        className="background-rect"
        style={{
          backgroundColor: rectColor,
          opacity,
          bottom: '200px',
          left: '-10%',
          transform: 'rotate(-12deg)',
        }}
      />
    </div>
  )
}

