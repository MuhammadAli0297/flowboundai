// WebGL hero background for /product: reuses the homepage's three.js approach (see heroWave.ts)
// but a distinct composition, "Convergent Signals". Four streams of particles drift in from the
// four corners and merge into a single glowing point positioned to the right of the headline,
// then fade and repeat on staggered, non-matching cycles so the loop never reads as repeating.
// Visualizes the page's actual thesis: four ways in, one engine underneath. Scoped entirely to
// this one script; only / and /product ever load three.js.
import * as THREE from "three"
import { watchScrollProgress } from "./scrollProgress"

const SHADOW = new THREE.Color(0x104866) // ocean-950
const MID = new THREE.Color(0x4a6fa5) // ocean-500, smart blue
const BRIGHT = new THREE.Color(0xdbe9ee) // ocean-100, alice blue

const PER_CORNER = 90
// world-space starting points, one cluster per corner of the frame
const CORNERS = [
  { x: -11, y: 5.5, speed: 0.000063 },
  { x: -11, y: -5.5, speed: 0.000081 },
  { x: 11, y: 6, speed: 0.000071 },
  { x: 11, y: -6, speed: 0.000058 },
]
// convergence point: right of the text column, where the hero's gradient overlay is lightest
const TARGET = { x: 3.4, y: 0.3 }

function initProductHero() {
  const canvas = document.getElementById("product-hero-wave") as HTMLCanvasElement | null
  const section = document.getElementById("top")
  if (!canvas || !section) return

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
  camera.position.set(0, 0, 9)

  const count = PER_CORNER * CORNERS.length
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const phase = new Float32Array(count)
  const cornerIdx = new Uint8Array(count)
  const depth = new Float32Array(count)
  const curve = new Float32Array(count)

  let i = 0
  for (let c = 0; c < CORNERS.length; c++) {
    for (let p = 0; p < PER_CORNER; p++) {
      phase[i] = p / PER_CORNER
      cornerIdx[i] = c
      depth[i] = (Math.random() - 0.5) * 3.5
      curve[i] = (Math.random() - 0.5) * 2.4
      i++
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.11,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  })

  const points = new THREE.Points(geometry, material)
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

  // accelerating ease so particles feel pulled into the hub rather than drifting at a flat rate
  function easeInQuad(t: number) {
    return t * t
  }

  function updateStreams(t: number) {
    for (let idx = 0; idx < count; idx++) {
      const c = CORNERS[cornerIdx[idx]]
      const cycle = (t * c.speed + phase[idx]) % 1
      const travel = easeInQuad(cycle)

      // gentle perpendicular bow so each stream reads as a curved line flowing inward, not a
      // straight ray, and a hint of shared origin as bundles of particles from the same corner
      // arrive along neighboring paths rather than one exact overlapping line
      const bow = Math.sin(travel * Math.PI) * curve[idx] * 0.5

      const x = c.x + (TARGET.x - c.x) * travel
      const y = c.y + (TARGET.y - c.y) * travel + bow
      const z = depth[idx] * (1 - travel)

      posAttr.setXYZ(idx, x, y, z)

      // fade in leaving the corner, hold mid-flight, fade out as it merges into the hub glow
      const fadeIn = Math.min(1, cycle * 7)
      const fadeOut = Math.min(1, (1 - cycle) * 5)
      const brightness = Math.min(fadeIn, fadeOut)

      if (brightness < 0.5) {
        tmpColor.copy(SHADOW).lerp(MID, brightness * 2)
      } else {
        tmpColor.copy(MID).lerp(BRIGHT, (brightness - 0.5) * 2)
      }
      tmpColor.multiplyScalar(brightness)

      colorAttr.setXYZ(idx, tmpColor.r, tmpColor.g, tmpColor.b)
    }
    posAttr.needsUpdate = true
    colorAttr.needsUpdate = true
  }

  function render(t: number) {
    updateStreams(t)
    camera.position.x = -scrollProgress * 1.1
    camera.lookAt(TARGET.x * 0.2, TARGET.y * 0.2, 0)
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
  document.addEventListener("DOMContentLoaded", initProductHero)
} else {
  initProductHero()
}
