import { useEffect, useRef } from 'react'
import './GlobalBackground.css'

interface GlobalBackgroundProps {
  mode?: 'dark' | 'light'
}

export default function GlobalBackground({ mode = 'dark' }: GlobalBackgroundProps) {
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

  const shapeColor = mode === 'dark' ? '#FFFFFF' : '#000000'
  const opacity = mode === 'dark' ? 0.10 : 0.12

  return (
    <div className="global-background" style={{ pointerEvents: 'none' }}>
      <div
        ref={circleARef}
        className="background-circle circle-a"
        style={{
          backgroundColor: shapeColor,
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
          backgroundColor: shapeColor,
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
          backgroundColor: shapeColor,
          opacity,
          bottom: '200px',
          left: '-10%',
          transform: 'rotate(-12deg)',
        }}
      />
    </div>
  )
}

