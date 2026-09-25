import { Component, useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from 'three'

let webGLAvailable: boolean | undefined
function supportsWebGL2() {
  if (webGLAvailable !== undefined) return webGLAvailable
  if (typeof document === 'undefined') return false
  try {
    const probe = document.createElement('canvas')
    const context = probe.getContext('webgl2')
    webGLAvailable = Boolean(context)
    context?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch { webGLAvailable = false }
  return webGLAvailable
}

function StillLife() {
  return <div className="scene-fallback" style={{ position: 'absolute', inset: 0 }}>
    <img src="/images/hero-still-life.webp" alt="ORREN coffee still life" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </div>
}

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFailure() }
  render() { return this.state.failed ? <StillLife /> : this.props.children }
}

function SceneLifecycle({ active, onFailure }: { active: boolean; onFailure: () => void }) {
  const invalidate = useThree(state => state.invalidate)
  const gl = useThree(state => state.gl)
  useEffect(() => { if (active) invalidate() }, [active, invalidate])
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onFailure() }
    gl.domElement.addEventListener('webglcontextlost', lost)
    return () => gl.domElement.removeEventListener('webglcontextlost', lost)
  }, [gl, onFailure])
  return null
}

interface SceneShellProps {
  children: ReactNode
  className?: string
  label: string
  controls?: ReactNode
  note?: ReactNode
  cameraPosition?: [number, number, number]
  fov?: number
}

export default function SceneShell({ children, className = '', label, controls, note, cameraPosition = [0, 0.25, 6.4], fov = 38 }: SceneShellProps) {
  const container = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [visited, setVisited] = useState(false)
  const [failed, setFailed] = useState(false)
  const [supported] = useState(() => supportsWebGL2())
  const [dpr, setDpr] = useState(1)
  const onFailure = useCallback(() => setFailed(true), [])

  useEffect(() => {
    const element = container.current
    if (!element) return
    const media = window.matchMedia('(max-width: 700px), (pointer: coarse)')
    const setResolution = () => setDpr(Math.min(window.devicePixelRatio || 1, media.matches ? 1.25 : 1.75))
    setResolution()
    media.addEventListener('change', setResolution)
    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting && !document.hidden
      setActive(visible)
      if (visible) setVisited(true)
    }, { rootMargin: '80px' })
    observer.observe(element)
    const onVisibility = () => {
      const bounds = element.getBoundingClientRect()
      const visible = !document.hidden && bounds.bottom > -80 && bounds.top < window.innerHeight + 80
      setActive(visible)
      if (visible) setVisited(true)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', setResolution)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <div ref={container} className={`scene-wrap ${className}`} style={{ position: 'relative', height: '100%', minHeight: 360, overflow: 'hidden' }}>
    <SceneBoundary onFailure={onFailure}>
      {failed || !supported || !visited ? <StillLife /> : <Canvas
        role="img"
        aria-label={label}
        frameloop={active ? 'demand' : 'never'}
        dpr={dpr}
        shadows="soft"
        camera={{ position: cameraPosition, fov, near: 0.1, far: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        style={{ position: 'absolute', inset: 0, touchAction: 'pan-y' }}
        fallback={<StillLife />}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping
          gl.toneMappingExposure = 1.0
          gl.outputColorSpace = SRGBColorSpace
          gl.shadowMap.type = PCFSoftShadowMap
        }}
      >
        <SceneLifecycle active={active} onFailure={onFailure} />
        {children}
      </Canvas>}
    </SceneBoundary>
    {supported && !failed && visited && controls}
    {(note || !supported || failed) && <p className="scene-note">{!supported || failed ? 'Coffee still life · Interactive view unavailable' : note}</p>}
  </div>
}

export function StudioLights({ warm = false }: { warm?: boolean }) {
  return <>
    <ambientLight intensity={0.65} />
    <hemisphereLight args={['#fff7e8', '#685b44', 1.45]} />
    <directionalLight position={[-3.5, 6, 5]} intensity={3.1} color={warm ? '#ffd8ad' : '#fff7e7'} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-normalBias={0.035} shadow-bias={-0.00012} shadow-radius={4} />
    <directionalLight position={[4, 2, -3]} intensity={2.2} color="#ffffff" />
    <directionalLight position={[-2, 0, -2]} intensity={0.45} color="#c3caba" />
  </>
}

export function StudioFloor({ y = -1.55 }: { y?: number }) {
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
    <planeGeometry args={[200, 200]} />
    <shadowMaterial transparent opacity={0.16} />
  </mesh>
}
