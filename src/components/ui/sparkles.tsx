import { useId } from 'react'
import { useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import type { Container, SingleOrMultiple } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'
import { cn } from '@/lib/utils'
import { motion, useAnimation } from 'framer-motion'

type ParticlesProps = {
  id?: string
  className?: string
  background?: string
  minSize?: number
  maxSize?: number
  speed?: number
  particleColor?: string
  particleDensity?: number
}

export const SparklesCore = (props: ParticlesProps) => {
  const { id, className, background, minSize, maxSize, speed, particleColor, particleDensity } = props
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setInit(true))
  }, [])

  const controls = useAnimation()
  const generatedId = useId()

  const particlesLoaded = async (container?: Container) => {
    if (container) {
      controls.start({ opacity: 1, transition: { duration: 1 } })
    }
  }

  return (
    <motion.div animate={controls} className={cn('opacity-0', className)}>
      {init && (
        <Particles
          id={id || generatedId}
          className="h-full w-full"
          particlesLoaded={particlesLoaded}
          options={{
            background: { color: { value: background || 'transparent' } },
            fullScreen: { enable: false, zIndex: 1 },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: { enable: true, mode: 'push' },
                onHover: { enable: false, mode: 'repulse' },
                resize: true as unknown as { delay: number },
              },
              modes: {
                push: { quantity: 4 },
                repulse: { distance: 200, duration: 0.4 },
              },
            },
            particles: {
              color: { value: particleColor || '#ffffff' },
              move: {
                enable: true,
                direction: 'none',
                outModes: { default: 'out' },
                speed: { min: 0.1, max: 1 },
                straight: false,
              },
              number: {
                density: { enable: true, width: 400, height: 400 },
                value: particleDensity || 120,
              },
              opacity: {
                value: { min: 0.1, max: 1 },
                animation: {
                  enable: true,
                  speed: speed || 4,
                  sync: false,
                  startValue: 'random' as const,
                  destroy: 'none' as const,
                },
              },
              shape: { type: 'circle' },
              size: {
                value: { min: minSize || 1, max: maxSize || 3 },
              },
              effect: {
                type: {} as SingleOrMultiple<string> | undefined,
                close: true,
                fill: true,
                options: {},
              },
            },
            detectRetina: true,
          }}
        />
      )}
    </motion.div>
  )
}
