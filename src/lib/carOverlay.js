import * as THREE from 'three'
import { buildCar } from './carModel.js'

/**
 * Create and attach a CarOverlay (OverlayView) to the given map.
 * Returns an object: { overlay, getThree }
 *   overlay   — the CarOverlay instance (also stored on window for sim use)
 *   getThree  — () => { scene, camera, renderer, carGroup }
 */
export function createCarOverlay(map) {
  let threeScene, threeCamera, threeRenderer, carGroup

  class CarOverlay extends google.maps.OverlayView {
    onAdd() {
      const mapDiv = map.getDiv()
      const W = mapDiv.offsetWidth
      const H = mapDiv.offsetHeight

      const canvas = document.createElement('canvas')
      canvas.width = W
      canvas.height = H
      canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:999999;'
      mapDiv.appendChild(canvas)
      this._canvas = canvas

      // Three.js — orthographic camera covering the full canvas in pixels
      threeRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      threeRenderer.setPixelRatio(window.devicePixelRatio)
      threeRenderer.setSize(W, H)

      // top=H, bottom=0 → Y increases upward (we flip pixel.y when positioning)
      threeCamera = new THREE.OrthographicCamera(0, W, H, 0, -5000, 5000)
      threeCamera.position.z = 100

      threeScene = new THREE.Scene()
      threeScene.add(new THREE.AmbientLight(0xffffff, 0.7))
      const sun = new THREE.DirectionalLight(0xffffff, 0.9)
      sun.position.set(0.5, 0.5, 1)
      threeScene.add(sun)
      const fill = new THREE.DirectionalLight(0x88aaff, 0.3)
      fill.position.set(-0.5, -0.3, 0.5)
      threeScene.add(fill)

      carGroup = buildCar()
      carGroup.visible = false
      threeScene.add(carGroup)

      this._ro = new ResizeObserver(() => {
        const nW = mapDiv.offsetWidth
        const nH = mapDiv.offsetHeight
        canvas.width = nW
        canvas.height = nH
        threeRenderer.setSize(nW, nH)
        threeCamera.right = nW
        threeCamera.top = nH
        threeCamera.updateProjectionMatrix()
      })
      this._ro.observe(mapDiv)
    }

    draw() {} // Maps calls this on pan/zoom — rendering is driven by RAF in startSim

    onRemove() {
      if (this._canvas && this._canvas.parentNode) {
        this._canvas.parentNode.removeChild(this._canvas)
      }
      this._ro?.disconnect()
      threeRenderer?.dispose()
    }
  }

  const overlay = new CarOverlay()
  overlay.setMap(map)

  return {
    overlay,
    getThree: () => ({ scene: threeScene, camera: threeCamera, renderer: threeRenderer, carGroup }),
  }
}
