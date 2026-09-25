import { BoxGeometry, BufferAttribute, BufferGeometry, CanvasTexture, SRGBColorSpace } from 'three'
import type { CoffeeProduct } from '../types/coffee'

function bagWidth(t: number) {
  const bottom = Math.min(1, t / 0.09)
  return (0.79 + 0.23 * bottom) * (1 - 0.058 * t) + Math.sin(t * Math.PI) * 0.026
}

function bagDepth(t: number) {
  return 0.045 + 0.38 * Math.pow(Math.max(0, Math.sin(Math.PI * t)), 0.54)
}

function pouchPoint(t: number, angle: number) {
  const c = Math.cos(angle), s = Math.sin(angle)
  let x = Math.sign(c) * Math.pow(Math.abs(c), 0.53) * bagWidth(t)
  let z = Math.sign(s) * Math.pow(Math.abs(s), 0.53) * bagDepth(t)
  const edge = Math.pow(Math.abs(c), 8)
  const crease = Math.sin(t * 31 + c * 5) * 0.013 * edge
  z += crease * Math.sin(Math.PI * t)
  const shoulder = Math.max(0, (t - 0.83) / 0.17)
  const foot = Math.max(0, (0.15 - t) / 0.15)
  z += Math.sin(angle * 13 + t * 16) * 0.018 * (shoulder + foot) * Math.sin(Math.PI * t)
  x += Math.sign(c) * Math.sin(t * 43 + s * 4) * 0.012 * edge * (0.4 + shoulder)
  const y = -1.46 + t * 2.92 + Math.cos(angle * 2) * 0.014 * Math.sin(Math.PI * t)
  return [x, y, z]
}

export function createPouchGeometry() {
  const levels = 42, segments = 88
  const positions: number[] = [], uvs: number[] = [], indices: number[] = []
  for (let level = 0; level <= levels; level++) {
    const t = level / levels
    for (let segment = 0; segment <= segments; segment++) {
      positions.push(...pouchPoint(t, segment / segments * Math.PI * 2))
      uvs.push(segment / segments, t)
    }
  }
  for (let y = 0; y < levels; y++) for (let x = 0; x < segments; x++) {
    const i = y * (segments + 1) + x
    indices.push(i, i + segments + 1, i + 1, i + 1, i + segments + 1, i + segments + 2)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
  geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export function createLabelGeometry() {
  const cols = 30, rows = 28
  const positions: number[] = [], uvs: number[] = [], indices: number[] = []
  for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) {
    const x = (i / cols - 0.5) * 1.55
    const y = (j / rows - 0.5) * 2.06 - 0.025
    const t = (y + 1.46) / 2.92
    const xRatio = Math.min(0.999, Math.abs(x / bagWidth(t)))
    const c = Math.pow(xRatio, 1 / 0.53)
    const z = Math.pow(Math.sqrt(1 - c * c), 0.53) * bagDepth(t) + 0.012
    positions.push(x, y, z)
    uvs.push(i / cols, j / rows)
  }
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const a = j * (cols + 1) + i
    indices.push(a, a + 1, a + cols + 1, a + 1, a + cols + 2, a + cols + 1)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
  geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export function createSealGeometry() {
  const geometry = new BoxGeometry(1.927, 0.091, 0.082, 48, 3, 2)
  const positions = geometry.attributes.position
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i)
    const fold = Math.sin(x * 5.4 + 0.3) * 0.009 + Math.sin(x * 23) * 0.0025
    positions.setXYZ(i, x, y + fold, z + Math.sin(x * 11 + 0.4) * 0.006 + y * 0.12)
  }
  geometry.computeVertexNormals()
  return geometry
}

export function createPaperTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const data = ctx.createImageData(256, 256)
  let seed = 37
  for (let i = 0; i < data.data.length; i += 4) {
    seed = (seed * 16807) % 2147483647
    const value = 206 + seed % 40
    data.data[i] = data.data[i + 1] = data.data[i + 2] = value
    data.data[i + 3] = 255
  }
  ctx.putImageData(data, 0, 0)
  const texture = new CanvasTexture(canvas)
  return texture
}

function tracked(ctx: CanvasRenderingContext2D, text: string, center: number, y: number, spacing = 6) {
  const width = [...text].reduce((sum, char) => sum + ctx.measureText(char).width, 0) + (text.length - 1) * spacing
  let x = center - width / 2
  ctx.textAlign = 'left'
  for (const char of text) { ctx.fillText(char, x, y); x += ctx.measureText(char).width + spacing }
  ctx.textAlign = 'center'
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    const attempt = line ? `${line} ${word}` : word
    if (ctx.measureText(attempt).width > maxWidth && line) { lines.push(line); line = word } else line = attempt
  }
  if (line) lines.push(line)
  return lines
}

export function createLabelTexture(product: CoffeeProduct) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024; canvas.height = 1360
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#eee8d9'; ctx.fillRect(0, 0, 1024, 1360)
  // Deterministic tiny fibers keep the printed stock tactile at close range.
  let seed = 71
  for (let i = 0; i < 11000; i++) {
    seed = (seed * 48271) % 2147483647
    const x = seed % 1024
    seed = (seed * 48271) % 2147483647
    ctx.fillStyle = i % 2 ? 'rgba(70,53,31,.027)' : 'rgba(255,255,255,.12)'
    ctx.fillRect(x, seed % 1360, 1, 2)
  }
  ctx.fillStyle = '#27382f'; ctx.strokeStyle = '#27382f'; ctx.textAlign = 'center'
  ctx.font = '27px Arial, sans-serif'; tracked(ctx, 'A DAILY RITUAL, REFINED.', 512, 99, 5)
  ctx.font = '172px Georgia, serif'; tracked(ctx, 'ORREN', 512, 280, 8)
  ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(104, 332); ctx.lineTo(920, 332); ctx.stroke()
  ctx.font = '28px Arial, sans-serif'; tracked(ctx, product.category.toUpperCase(), 512, 406, 4)
  ctx.font = '102px Georgia, serif'
  const names = wrap(ctx, product.name, 830).slice(0, 2)
  const nameY = names.length === 1 ? 565 : 520
  names.forEach((line, index) => ctx.fillText(line, 512, nameY + index * 105))
  ctx.font = '34px Arial, sans-serif'; tracked(ctx, product.origin.toUpperCase(), 512, 707, 4)
  // A small orbital maker's mark, printed as fine ink rather than decoration in space.
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.ellipse(512, 845, 53, 68, -0.32, 0, Math.PI * 2); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(502, 782); ctx.bezierCurveTo(546, 819, 476, 858, 522, 907); ctx.stroke()
  ctx.font = '36px Georgia, serif'
  const noteLines = wrap(ctx, product.tastingNotes.join('  ·  '), 820)
  noteLines.forEach((line, i) => ctx.fillText(line, 512, 1000 + i * 46))
  ctx.beginPath(); ctx.moveTo(104, 1125); ctx.lineTo(920, 1125); ctx.stroke()
  ctx.font = '25px Arial, sans-serif'; tracked(ctx, `${product.roastLevel.toUpperCase()} ROAST`, 512, 1192, 4)
  ctx.font = '23px Arial, sans-serif'; tracked(ctx, `${product.weight}g  /  WHOLE BEAN`, 512, 1262, 3)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  return texture
}
