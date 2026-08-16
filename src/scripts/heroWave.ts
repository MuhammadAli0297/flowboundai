// Real WebGL particle wave for the homepage hero, via three.js. Scoped entirely to this one
// component: no other page imports this script, so three.js never ships outside the homepage.
// Colors are the ocean palette (tailwind.config.js: ocean-950 -> ocean-500 -> ocean-100).
import * as THREE from "three"
import { watchScrollProgress } from "./scrollProgress"

const SHADOW = new THREE.Color(0x104866) // ocean-950
const MID = new THREE.Color(0x4a6fa5) // ocean-500, smart blue
const BRIGHT = new THREE.Color(0xdbe9ee) // ocean-100, alice blue

const COLS = 130
const ROWS = 42
const SPAN_X = 34
const SPAN_Z = 13

function initHeroWave() {
  const canvas = document.getElementById("hero-wave") as HTMLCanvasElement | null
  const section = document.getElementById("top")
  if (!canvas || !section) return

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)

  const count = COLS * ROWS
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  let i = 0
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      positions[i * 3] = (c / (COLS - 1) - 0.5) * SPAN_X
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = -(r / (ROWS - 1)) * SPAN_Z
      i++
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.13,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  })

  const points = new THREE.Points(geometry, material)
  points.position.set(0, -2.9, -1)
  points.rotation.x = -0.24
  scene.add(points)

  function resize() {
    const rect = section!.getBoundingClientRect()
    const width = Math.max(rect.width, 1)
    const height = Math.max(rect.height, 1)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener("resize", resize)

  let scrollProgress = 0
  watchScrollProgress(section, (p) => {
    scrollProgress = p
  })

  const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute
  const colorAttr = geometry.getAttribute("color") as THREE.BufferAttribute
  const tmpColor = new THREE.Color()

  // Circular distance on a 0..1 ring: without this, a sweep value that wraps via `% 1` produces a
  // visible snap every cycle (distance jumps from ~0 to ~1 the instant the sweep crosses back
  // through 0). Wrapping the distance itself keeps the whole thing perfectly continuous forever.
  function ringDist(a: number, b: number) {
    const d = Math.abs(a - b)
    return Math.min(d, 1 - d)
  }

  // Three independent highlights at non-matching speeds and starting phases, rather than one
  // single sweep: even though each one is technically periodic, their combination has no short
  // repeating pattern, so the motion never reads as "a loop."
  function updateWave(t: number) {
    const sweepA = (t * 0.000091) % 1
    const sweepB = (t * 0.000163 + 0.35) % 1
    const sweepC = (t * 0.00013 + 0.7) % 1

    let idx = 0
    for (let r = 0; r < ROWS; r++) {
      const rowT = r / (ROWS - 1)
      for (let c = 0; c < COLS; c++) {
        const colT = c / (COLS - 1)
        const wave =
          Math.sin(colT * 9 + t * 0.0006 + rowT * 2.2) * 0.6 +
          Math.sin(colT * 20 - t * 0.001 + rowT * 3.1) * 0.25
        posAttr.setY(idx, wave)

        const glowA = Math.max(0, 1 - ringDist(colT, sweepA) * 3.2)
        const glowB = Math.max(0, 1 - ringDist(colT, sweepB) * 4) * 0.7
        const glowC = Math.max(0, 1 - ringDist(colT, sweepC) * 5) * 0.55
        const glow = Math.max(glowA, glowB, glowC)
        const brightness = Math.min(1, (1 - rowT) * 0.4 + glow * 0.85)

        if (brightness < 0.5) {
          tmpColor.copy(SHADOW).lerp(MID, brightness * 2)
        } else {
          tmpColor.copy(MID).lerp(BRIGHT, (brightness - 0.5) * 2)
        }

        // feather the grid's edges to near-black (invisible under additive blending) instead of
        // cutting off in a hard rectangle
        const edgeX = Math.min(1, Math.sin(Math.max(colT, 0.0001) * Math.PI) * 1.6)
        const edgeZ = 1 - Math.pow(rowT, 3)
        tmpColor.multiplyScalar(edgeX * edgeZ)

        colorAttr.setXYZ(idx, tmpColor.r, tmpColor.g, tmpColor.b)
        idx++
      }
    }
    posAttr.needsUpdate = true
    colorAttr.needsUpdate = true
  }

  function render(t: number) {
    updateWave(t)
    camera.position.set(0, 0.7 + scrollProgress * 1.3, 6 - scrollProgress * 1.6)
    camera.lookAt(0, -1.7 - scrollProgress * 0.5, -3)
    renderer.render(scene, camera)
  }

  if (reduceMotion) {
    render(0)
    return
  }

  let frame = 0
  function loop(t: number) {
    render(t)
    frame = requestAnimationFrame(loop)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries[0]?.isIntersecting
      if (visible && !frame) {
        frame = requestAnimationFrame(loop)
      } else if (!visible && frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    },
    { threshold: 0 }
  )
  observer.observe(section)
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeroWave)
} else {
  initHeroWave()
}
