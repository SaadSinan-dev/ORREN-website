import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { MathUtils } from 'three'
import type { Group } from 'three'
import type { CoffeeProduct } from '../types/coffee'
import SceneShell, { StudioFloor, StudioLights } from './SceneShell'
import useReducedMotion from './useReducedMotion'
import { createLabelGeometry, createLabelTexture, createPaperTexture, createPouchGeometry, createSealGeometry } from './bagGeometry'

interface ProductSceneProps { product: CoffeeProduct; className?: string }

function Pouch({ product, angle, reduced, onRotate }: { product: CoffeeProduct; angle: number; reduced: boolean; onRotate: (value: number) => void }) {
  const group = useRef<Group>(null)
  const drag = useRef<{ x: number; angle: number; id: number } | null>(null)
  const invalidate = useThree(state => state.invalidate)
  const body = useMemo(() => createPouchGeometry(), [])
  const label = useMemo(() => createLabelGeometry(), [])
  const paper = useMemo(() => createPaperTexture(), [])
  const seal = useMemo(() => createSealGeometry(), [])
  const print = useMemo(() => createLabelTexture(product), [product])
  useEffect(() => () => { body.dispose(); label.dispose(); paper.dispose(); seal.dispose() }, [body, label, paper, seal])
  useEffect(() => () => print.dispose(), [print])
  useEffect(() => { invalidate() }, [angle, product, reduced, invalidate])

  useFrame((_, delta) => {
    if (!group.current) return
    const target = -0.28 + angle
    if (reduced) group.current.rotation.y = target
    else {
      group.current.rotation.y = MathUtils.damp(group.current.rotation.y, target, 12, Math.min(delta, 0.06))
      if (Math.abs(group.current.rotation.y - target) > 0.0003) invalidate()
    }
  })

  const start = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    drag.current = { x: event.clientX, angle, id: event.pointerId }
    const target = event.target as unknown as { setPointerCapture: (id: number) => void }
    target.setPointerCapture(event.pointerId)
  }
  const move = (event: ThreeEvent<PointerEvent>) => {
    if (!drag.current) return
    event.stopPropagation()
    onRotate(MathUtils.clamp(drag.current.angle + (event.clientX - drag.current.x) * 0.008, -1.16, 1.16))
  }
  const end = (event: ThreeEvent<PointerEvent>) => {
    if (!drag.current) return
    const target = event.target as unknown as { releasePointerCapture: (id: number) => void }
    target.releasePointerCapture(drag.current.id)
    drag.current = null
  }

  return <group ref={group} rotation={[0.025, -0.28, -0.035]} position={[0, 0.04, 0]} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={() => { drag.current = null }}>
    <mesh geometry={body} castShadow receiveShadow>
      <meshStandardMaterial color={product.color || '#36483a'} roughness={0.83} metalness={0.015} bumpMap={paper} bumpScale={0.013} />
    </mesh>
    <mesh geometry={label} castShadow receiveShadow>
      <meshStandardMaterial map={print} roughness={0.92} bumpMap={paper} bumpScale={0.003} polygonOffset polygonOffsetFactor={-1} />
    </mesh>
    <mesh geometry={seal} position={[0, 1.425, 0]} castShadow>
      <meshStandardMaterial color={product.color || '#36483a'} roughness={0.94} bumpMap={paper} bumpScale={0.006} />
    </mesh>
    <mesh position={[0, 1.367, 0.049]}>
      <boxGeometry args={[1.90, 0.016, 0.008]} />
      <meshStandardMaterial color="#1b2820" roughness={1} />
    </mesh>
    <mesh position={[0, -1.455, 0]} castShadow>
      <boxGeometry args={[1.56, 0.025, 0.08]} />
      <meshStandardMaterial color={product.color || '#36483a'} roughness={1} />
    </mesh>
  </group>
}

function ProductView({ product, className }: ProductSceneProps) {
  const [angle, setAngle] = useState(0)
  const reduced = useReducedMotion()
  const rotate = (amount: number) => setAngle(value => MathUtils.clamp(value + amount, -1.16, 1.16))
  const controls = <div className="scene-controls" role="group" aria-label="Rotate coffee bag">
    <button type="button" aria-label="Rotate bag left" title="Rotate left" onClick={() => rotate(-0.3)} disabled={angle <= -1.16}><span aria-hidden="true">↶</span></button>
    <button type="button" aria-label="Reset coffee bag view" title="Reset view" onClick={() => setAngle(0)}><span aria-hidden="true">⟳</span></button>
    <button type="button" aria-label="Rotate bag right" title="Rotate right" onClick={() => rotate(0.3)} disabled={angle >= 1.16}><span aria-hidden="true">↷</span></button>
  </div>
  return <SceneShell className={className} label={`${product.name}, a sculpted ORREN whole-bean coffee pouch.`} controls={controls} note="Drag to explore · Roasted with intention" cameraPosition={[0, 0.2, 6.15]}>
    <StudioLights />
    <StudioFloor y={-1.5} />
    <Pouch product={product} angle={angle} reduced={reduced} onRotate={setAngle} />
  </SceneShell>
}

export default function ProductScene(props: ProductSceneProps) {
  return <ProductView key={props.product.id} {...props} />
}
