import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useMotion } from '../context/MotionContext'

// Every Pokemon will be normalized so its largest dimension equals this world-unit size
const TARGET_SIZE = 3.2

interface ModelProps {
  url: string
  autoRotate?: boolean
}

function PokemonGLTFModel({ url, autoRotate = true }: ModelProps) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  // ─── Measure BEFORE rendering ──────────────────────────────────────────────
  // We measure from the ORIGINAL scene (not a clone) so that SkinnedMesh
  // skeleton bone matrices are properly evaluated by Three.js.
  // We never mutate scene.position / scene.scale – we only apply transforms
  // to the outer <group>, so the shared useGLTF cache is not corrupted.
  const { uniformScale, centerOffset } = useMemo(() => {
    scene.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    const maxDim = Math.max(size.x, size.y, size.z)
    const s = maxDim > 0 ? TARGET_SIZE / maxDim : 1

    // Offset in unscaled local space: centers the geometry exactly at group origin (0, 0, 0)
    return {
      uniformScale: s,
      centerOffset: new THREE.Vector3(
        -center.x,
        -center.y,
        -center.z
      ),
    }
  }, [scene])

  // Camera distance halved so model appears 2x larger and fills the middle of the viewport
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const fovRad = (camera.fov * Math.PI) / 180
      const distance = ((TARGET_SIZE * 1.7) / Math.tan(fovRad / 2)) * 0.5
      camera.position.set(0, 0, distance)
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
    }
  }, [camera, uniformScale])

  // Slow Y-axis rotation around the model's exact center when auto-rotate is enabled
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4
    }
  })

  return (
    // Outer group rotates around (0,0,0) and scales
    <group
      ref={groupRef}
      scale={[uniformScale, uniformScale, uniformScale]}
    >
      {/* Inner group translates the geometric center directly to (0,0,0) */}
      <group position={centerOffset}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

// ─── Error Boundary ───────────────────────────────────────────────────────────
interface ErrorBoundaryProps {
  fallback: React.ReactNode
  children: React.ReactNode
  onCatch?: () => void
  resetKey?: string | number
}
interface ErrorBoundaryState { hasError: boolean }

class ModelErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: unknown) {
    console.warn('[PokemonViewer] Failed to load 3D GLB model:', error)
    this.props.onCatch?.()
  }
  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

// ─── Public Props ─────────────────────────────────────────────────────────────
export interface PokemonViewerProps {
  id: number
  name: string
  fallbackImage: string
  cryUrl?: string | null
}

export default function PokemonViewer({ id, name, fallbackImage, cryUrl }: PokemonViewerProps) {
  const { reducedMotion } = useMotion()
  const [isShiny, setIsShiny] = useState(false)
  const [hasModelError, setHasModelError] = useState(false)
  const [isPlayingCry, setIsPlayingCry] = useState(false)
  const [isAutoRotating, setIsAutoRotating] = useState(() => !reducedMotion)
  const [isCanvasVisible, setIsCanvasVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/${id}.png`

  useEffect(() => {
    setIsShiny(false)
    setHasModelError(false)
    if (reducedMotion) {
      setIsAutoRotating(false)
    }
  }, [id, reducedMotion])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsCanvasVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const category = isShiny ? 'shiny' : 'regular'
  const modelUrl = `https://raw.githubusercontent.com/Pokemon-3D-api/assets/main/models/opt/${category}/${id}.glb`

  const handlePlayCry = () => {
    if (!cryUrl) return
    if (!audioRef.current) {
      audioRef.current = new Audio(cryUrl)
      audioRef.current.onended = () => setIsPlayingCry(false)
      audioRef.current.onerror = () => setIsPlayingCry(false)
    } else {
      audioRef.current.src = cryUrl
    }
    setIsPlayingCry(true)
    audioRef.current.currentTime = 0
    audioRef.current.play().catch((err) => {
      console.warn('Audio play error:', err)
      setIsPlayingCry(false)
    })
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[460px] md:h-[540px] lg:h-[620px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200 border border-slate-200 shadow-sm flex flex-col"
    >
      {/* ── Top Bar ── */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-20 flex items-center justify-between gap-2 pointer-events-none flex-nowrap">
        <div className="pointer-events-auto flex items-center bg-white/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm min-w-0 max-w-[45%] sm:max-w-none">
          <h2 className="text-xs sm:text-base font-black tracking-wide text-slate-800 capitalize truncate">{name}</h2>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 flex-row flex-nowrap flex-shrink-0">
          {cryUrl && (
            <button
              type="button"
              onClick={handlePlayCry}
              onTouchEnd={(e) => { e.preventDefault(); handlePlayCry() }}
              disabled={isPlayingCry}
              className={`flex items-center justify-center gap-1.5 w-[34px] sm:w-[108px] h-[34px] rounded-full text-xs font-semibold backdrop-blur-md transition-all duration-200 border shadow-sm flex-shrink-0 select-none active:scale-95 ${isPlayingCry
                  ? 'bg-amber-100 text-amber-800 border-amber-400 scale-105'
                  : 'bg-white/90 text-slate-700 hover:text-slate-900 hover:bg-white border-slate-200'
                }`}
              title="Play Pokemon Cry"
              aria-label="Play Pokemon Cry"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-3.5 h-3.5 flex-shrink-0 ${isPlayingCry ? 'animate-bounce text-amber-600' : 'text-slate-600'}`}
              >
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.5A2.25 2.25 0 002.25 9.75v4.5a2.25 2.25 0 002.25 2.25h1.94l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
              </svg>
              <span className="truncate hidden sm:inline">{isPlayingCry ? 'Playing...' : 'Play Cry'}</span>
            </button>
          )}

          {/* Shiny Form Toggle */}
          <button
            type="button"
            onClick={() => { setHasModelError(false); setIsShiny(!isShiny) }}
            onTouchEnd={(e) => { e.preventDefault(); setHasModelError(false); setIsShiny(!isShiny) }}
            className={`flex items-center justify-center gap-1.5 w-[34px] sm:w-[108px] h-[34px] rounded-full text-xs font-semibold backdrop-blur-md transition-colors duration-200 border shadow-sm select-none active:scale-95 flex-shrink-0 ${isShiny
                ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 font-bold border-yellow-400 ring-2 ring-yellow-400/40 shadow-yellow-500/20'
                : 'bg-white/90 text-slate-700 hover:text-slate-900 hover:bg-white border-slate-200'
              }`}
            title="Toggle Standard/Shiny Form"
            aria-label={isShiny ? 'Switch to Standard form' : 'Switch to Shiny form'}
          >
            <span className={`text-xs leading-none flex-shrink-0 ${isShiny ? '' : 'grayscale opacity-60'}`}>✨</span>
            <span className="truncate hidden sm:inline">{isShiny ? 'Shiny' : 'Standard'}</span>
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            onTouchEnd={(e) => { e.preventDefault(); setIsAutoRotating(!isAutoRotating) }}
            className={`flex items-center justify-center gap-1.5 w-[34px] sm:w-[108px] h-[34px] rounded-full text-xs font-semibold backdrop-blur-md transition-colors duration-200 border shadow-sm select-none active:scale-95 flex-shrink-0 ${isAutoRotating
                ? 'bg-blue-50/95 text-blue-700 border-blue-200 ring-1 ring-blue-300/40 hover:bg-blue-100 hover:border-blue-300'
                : 'bg-white/90 text-slate-700 hover:text-slate-900 hover:bg-white border-slate-200'
              }`}
            title={isAutoRotating ? 'Pause Auto-Rotate' : 'Enable Auto-Rotate'}
            aria-label={isAutoRotating ? 'Pause Auto-rotating' : 'Enable Auto-rotate'}
          >
            {isAutoRotating ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5 text-blue-600 flex-shrink-0"
                >
                  <rect x="5" y="4" width="4.5" height="16" rx="1.5" />
                  <rect x="14.5" y="4" width="4.5" height="16" rx="1.5" />
                </svg>
                <span className="truncate hidden sm:inline">Auto-rotating</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5 text-slate-600 flex-shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="truncate hidden sm:inline">Auto-rotate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── 3D Canvas or Sprite Fallback ── */}
      <div className="relative w-full h-full flex items-center justify-center">
        {hasModelError ? (
          <div className="flex flex-col items-center justify-center p-6 text-center z-10">
            <img
              src={spriteUrl}
              alt={name}
              className="w-48 h-48 sm:w-64 sm:h-64 object-contain filter drop-shadow-lg"
              onError={(e) => {
                if (fallbackImage && e.currentTarget.src !== fallbackImage) {
                  e.currentTarget.src = fallbackImage
                }
              }}
            />
            <p className="mt-4 text-xs font-medium text-slate-600 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              3D model unavailable • Displaying sprite fallback
            </p>
          </div>
        ) : isCanvasVisible ? (
          <ModelErrorBoundary
            resetKey={`${id}-${category}`}
            onCatch={() => setHasModelError(true)}
            fallback={
              <div className="flex flex-col items-center justify-center p-6 text-center z-10">
                <img
                  src={spriteUrl}
                  alt={name}
                  className="w-48 h-48 sm:w-64 sm:h-64 object-contain filter drop-shadow-lg"
                  onError={(e) => {
                    if (fallbackImage && e.currentTarget.src !== fallbackImage) {
                      e.currentTarget.src = fallbackImage
                    }
                  }}
                />
                <p className="mt-3 text-xs text-slate-500">3D model loading failed • Displaying sprite fallback</p>
              </div>
            }
          >
            <Canvas
              shadows
              camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 100 }}
              resize={{ debounce: 0, scroll: false }}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.9} />
              <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow
                shadow-mapSize-width={1024} shadow-mapSize-height={1024}
                shadow-camera-near={0.5} shadow-camera-far={50} />
              <directionalLight position={[-5, 4, -4]} intensity={0.5} color="#90cdf4" />
              <pointLight position={[0, -1, 2]} intensity={0.4} color="#fbd38d" />

              <Suspense fallback={null}>
                <PokemonGLTFModel key={modelUrl} url={modelUrl} autoRotate={isAutoRotating} />
              </Suspense>

              <OrbitControls
                makeDefault
                enablePan={false}
                enableZoom={false}
                enableDamping
                dampingFactor={0.06}
                target={[0, 0, 0]}
              />
            </Canvas>
          </ModelErrorBoundary>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <img
              src={spriteUrl}
              alt={name}
              className="w-48 h-48 sm:w-64 sm:h-64 object-contain filter drop-shadow-lg"
              onError={(e) => {
                if (fallbackImage && e.currentTarget.src !== fallbackImage) {
                  e.currentTarget.src = fallbackImage
                }
              }}
            />
          </div>
        )}
      </div>

      {/* ── Hint ── */}
      <div className="absolute bottom-3 left-0 right-0 pointer-events-none flex justify-center z-10">
        <span className="text-[11px] font-medium text-slate-500 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 shadow-sm">
          Drag to rotate
        </span>
      </div>
    </div>
  )
}
