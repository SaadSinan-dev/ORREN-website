import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  CanvasTexture, CatmullRomCurve3, Color, InstancedMesh, LatheGeometry, MathUtils,
  Object3D, SphereGeometry, SRGBColorSpace, TubeGeometry, Vector2, Vector3,
} from 'three'
import type { Group, MeshStandardMaterial } from 'three'
import SceneShell, { StudioFloor, StudioLights } from './SceneShell'
import useReducedMotion from './useReducedMotion'
import { createPaperTexture } from './bagGeometry'

interface JourneySceneProps { progress: number; className?: string }

function beanGeometry() {
  const geometry = new SphereGeometry(1, 56, 40)
  const position = geometry.attributes.position
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i) * 0.69
    const y = position.getY(i) * 1.06
    let z = position.getZ(i) * 0.43
    const seam = x + Math.sin(y * 3.4) * 0.05
    if (z > 0) z -= Math.exp(-seam * seam / 0.007) * 0.13 * Math.min(1, z * 7)
    position.setXYZ(i, x * (1 + 0.06 * Math.sin(y * 2.8)), y, z)
  }
  geometry.computeVertexNormals()
  return geometry
}

function coffeeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 512
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(239, 247, 10, 256, 256, 250)
  gradient.addColorStop(0, '#24140c')
  gradient.addColorStop(0.75, '#392016')
  gradient.addColorStop(0.92, '#633919')
  gradient.addColorStop(0.97, '#ab7b42')
  gradient.addColorStop(1, '#452510')
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 512, 512)
  ctx.strokeStyle = 'rgba(216,170,102,0.17)'
  ctx.lineWidth = 2
  for (let i = 0; i < 13; i++) {
    ctx.beginPath()
    ctx.arc(256, 256, 224 + Math.sin(i * 3) * 13, i * 0.6, i * 0.6 + 0.35)
    ctx.stroke()
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

function Cup() {
  const geometry = useMemo(() => new LatheGeometry([
    new Vector2(0, -0.65), new Vector2(0.48, -0.65), new Vector2(0.62, -0.62),
    new Vector2(0.71, -0.50), new Vector2(0.77, -0.23), new Vector2(0.815, 0.26),
    new Vector2(0.834, 0.56), new Vector2(0.836, 0.62), new Vector2(0.813, 0.656),
    new Vector2(0.787, 0.637), new Vector2(0.777, 0.568), new Vector2(0.755, 0.11),
    new Vector2(0.681, -0.44), new Vector2(0.57, -0.53), new Vector2(0, -0.54),
  ], 80), [])
  const handle = useMemo(() => new TubeGeometry(new CatmullRomCurve3([
    new Vector3(0.80, 0.44, 0), new Vector3(1.18, 0.45, 0),
    new Vector3(1.38, 0.20, 0), new Vector3(1.28, -0.17, 0), new Vector3(0.74, -0.36, 0),
  ]), 36, 0.102, 16, false), [])
  const paper = useMemo(() => createPaperTexture(), [])
  const coffee = useMemo(() => coffeeTexture(), [])
  useEffect(() => () => { geometry.dispose(); handle.dispose(); paper.dispose(); coffee.dispose() }, [geometry, handle, paper, coffee])
  return <group rotation={[0, -0.12, 0]}>
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial color="#e6dec9" roughness={0.31} clearcoat={0.2} clearcoatRoughness={0.35} bumpMap={paper} bumpScale={0.009} />
    </mesh>
    <mesh geometry={handle} castShadow receiveShadow>
      <meshPhysicalMaterial color="#e6dec9" roughness={0.31} clearcoat={0.2} bumpMap={paper} bumpScale={0.007} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.545, 0]} receiveShadow>
      <circleGeometry args={[0.774, 80]} />
      <meshPhysicalMaterial map={coffee} roughness={0.18} clearcoat={1} clearcoatRoughness={0.12} />
    </mesh>
    <mesh position={[0, -0.64, 0]} castShadow>
      <cylinderGeometry args={[0.5, 0.5, 0.047, 64]} />
      <meshStandardMaterial color="#d0c5ab" roughness={0.72} />
    </mesh>
  </group>
}

function Grounds() {
  const mesh = useRef<InstancedMesh>(null)
  useEffect(() => {
    if (!mesh.current) return
    const object = new Object3D()
    const color = new Color()
    let seed = 91
    const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
    for (let index = 0; index < 240; index++) {
      const radius = Math.sqrt(random()) * 1.27
      const angle = random() * Math.PI * 2
      const height = Math.pow(1 - radius / 1.27, 1.5) * 0.43
      object.position.set(Math.cos(angle) * radius, 0.029 + random() * height, Math.sin(angle) * radius * 0.68)
      object.rotation.set(random() * 3, random() * 3, random() * 3)
      const size = 0.026 + random() * 0.025
      object.scale.set(size * 1.4, size, size * 1.15)
      object.updateMatrix()
      mesh.current.setMatrixAt(index, object.matrix)
      color.setHSL(0.066 + random() * 0.02, 0.35 + random() * 0.18, 0.10 + random() * 0.08)
      mesh.current.setColorAt(index, color)
    }
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [])
  return <instancedMesh ref={mesh} args={[undefined, undefined, 240]} castShadow receiveShadow>
    <dodecahedronGeometry args={[1, 0]} />
    <meshStandardMaterial roughness={0.93} />
  </instancedMesh>
}

const clamp = (value: number) => MathUtils.clamp(value, 0, 1)
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t) }

function JourneyObjects({ progress, reduced }: { progress: number; reduced: boolean }) {
  const bean = useRef<Group>(null)
  const grounds = useRef<Group>(null)
  const cup = useRef<Group>(null)
  const material = useRef<MeshStandardMaterial>(null)
  const current = useRef(progress)
  const camera = useThree(state => state.camera)
  const invalidate = useThree(state => state.invalidate)
  const geometry = useMemo(() => beanGeometry(), [])
  const paper = useMemo(() => createPaperTexture(), [])
  const green = useMemo(() => new Color('#88916a'), [])
  const roast = useMemo(() => new Color('#4d2817'), [])
  const targetPoint = useMemo(() => new Vector3(0, -0.2, 0), [])
  useEffect(() => () => { geometry.dispose(); paper.dispose() }, [geometry, paper])
  useEffect(() => { invalidate() }, [progress, reduced, invalidate])

  useFrame((_, delta) => {
    // Motion preference uses one stable composition for each editorial stage.
    const target = reduced ? (progress < 0.25 ? 0 : progress < 0.5 ? 0.33 : progress < 0.75 ? 0.6 : 1) : progress
    current.current = reduced ? target : MathUtils.damp(current.current, target, 10, Math.min(delta, 0.055))
    const p = current.current
    const roasting = smooth((p - 0.13) / 0.15)
    const grinding = smooth((p - 0.44) / 0.11)
    const brewing = smooth((p - 0.71) / 0.10)
    if (material.current) {
      material.current.color.copy(green).lerp(roast, roasting)
      material.current.roughness = 0.84 - roasting * 0.24
    }
    if (bean.current) {
      const scale = Math.max(0.001, 1 - grinding)
      bean.current.visible = scale > 0.005
      bean.current.scale.setScalar(scale)
      bean.current.position.y = -1.42 + 1.1 * scale
      bean.current.rotation.set(-0.10 + roasting * 0.03, -0.08 + roasting * 0.23, -0.17)
    }
    if (grounds.current) {
      const reveal = Math.max(0.001, grinding * (1 - brewing))
      grounds.current.visible = reveal > 0.005
      grounds.current.scale.setScalar(reveal)
    }
    if (cup.current) {
      const scale = Math.max(0.001, brewing * 1.35)
      cup.current.visible = brewing > 0.005
      cup.current.scale.setScalar(scale)
      cup.current.position.y = -1.43 + 0.67 * scale
    }
    camera.position.set(0.18 * (1 - brewing), 1.18 + grinding * 0.4 + brewing * 1.16, 6.0 - grinding * 0.25 + brewing * 0.35)
    targetPoint.set(0, -0.35 - grinding * 0.28 + brewing * 0.30, 0)
    camera.lookAt(targetPoint)
    if (Math.abs(p - target) > 0.0002) invalidate()
  })

  return <>
    <StudioLights warm={progress > 0.18 && progress < 0.68} />
    <StudioFloor y={-1.45} />
    <group ref={bean}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial ref={material} color="#88916a" roughness={0.84} bumpMap={paper} bumpScale={0.021} />
      </mesh>
      <mesh geometry={geometry} position={[-0.97, -0.83, 0.27]} scale={0.24} rotation={[0.4, 0.5, 1.32]} castShadow>
        <meshStandardMaterial color="#665236" roughness={0.88} bumpMap={paper} bumpScale={0.01} />
      </mesh>
    </group>
    <group ref={grounds} position={[0, -1.43, 0]} visible={false}><Grounds /></group>
    <group ref={cup} visible={false}><Cup /></group>
  </>
}

export default function JourneyScene({ progress, className }: JourneySceneProps) {
  const reduced = useReducedMotion()
  const safeProgress = Number.isFinite(progress) ? clamp(progress) : 0
  const stage = safeProgress < 0.25 ? 'Green coffee' : safeProgress < 0.5 ? 'The roast' : safeProgress < 0.75 ? 'Freshly ground' : 'Your daily ritual'
  return <SceneShell className={className} label="The coffee journey: a green bean, a roasted bean, fresh grounds, and a ceramic cup of coffee." note={stage} cameraPosition={[0.18, 1.18, 6]} fov={39}>
    <JourneyObjects progress={safeProgress} reduced={reduced} />
  </SceneShell>
}
