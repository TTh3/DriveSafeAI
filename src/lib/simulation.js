/**
 * Format seconds → "Xh Ym" or "Xm YYs"
 * @param {number} sec
 * @returns {string}
 */
export function fmtDur(sec) {
  sec = Math.max(0, Math.floor(sec))
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return h ? `${h}h ${m}m` : `${m}m ${String(s).padStart(2, '0')}s`
}

/**
 * Pixels-per-metre at a given zoom level and latitude.
 * @param {number} lat
 * @param {number} zoom
 * @returns {number}
 */
export function ppm(lat, zoom) {
  return Math.pow(2, zoom) / (156543.03392 * Math.cos((lat * Math.PI) / 180))
}

/**
 * Binary search: find the waypoint segment index at simT seconds.
 * @param {Array} wps
 * @param {number} simT
 * @returns {number}
 */
export function bsearch(wps, simT) {
  let lo = 0,
    hi = wps.length - 2
  while (lo < hi) {
    const m = (lo + hi) >> 1
    wps[m + 1].elapsed < simT ? (lo = m + 1) : (hi = m)
  }
  return lo
}

/**
 * Start the simulation animation loop.
 *
 * @param {{
 *   routeData: { wps: Array, totalSec: number, totalDist: number },
 *   overlayRef: { overlay: object, getThree: () => object },
 *   map: google.maps.Map,
 *   getMultiplier: () => number,
 *   getPaused: () => boolean,
 *   onFrame: (stats: object) => void,
 *   onDone: () => void,
 * }} opts
 * @returns {() => void}  call to cancel the loop
 */
export function startSim({ routeData, overlayRef, map, getMultiplier, getPaused, onFrame, onDone }) {
  const { wps, totalSec, totalDist } = routeData
  const { overlay, getThree } = overlayRef

  map.setZoom(15)
  map.panTo({ lat: wps[0].lat, lng: wps[0].lng })

  let lastFrameTime = performance.now()
  let animId = null
  let accSimT = 0 // Accumulated simulation seconds

  function frame() {
    const { renderer, scene, camera, carGroup } = getThree()
    if (!renderer) {
      animId = requestAnimationFrame(frame)
      return
    }

    const isPaused = getPaused ? getPaused() : false
    const multiplier = getMultiplier ? getMultiplier() : 1
    const wallNow = performance.now()
    const dtSeconds = (wallNow - lastFrameTime) / 1000
    lastFrameTime = wallNow

    if (!isPaused) {
      accSimT += dtSeconds * multiplier
    }

    const t = Math.min(accSimT / totalSec, 1.0)
    const simT = accSimT

    const idx = bsearch(wps, simT)
    const wp0 = wps[idx]
    const wp1 = wps[Math.min(idx + 1, wps.length - 1)]
    const seg =
      wp1.elapsed > wp0.elapsed
        ? Math.max(0, Math.min(1, (simT - wp0.elapsed) / (wp1.elapsed - wp0.elapsed)))
        : 0

    const lat = wp0.lat + (wp1.lat - wp0.lat) * seg
    const lng = wp0.lng + (wp1.lng - wp0.lng) * seg

    // Project lat/lng → canvas pixel
    const proj = overlayRef.overlay.getProjection()
    if (!proj) return
    const pixel = proj.fromLatLngToContainerPixel(new google.maps.LatLng(lat, lng))
    if (!pixel) return // safety skip on extreme edge cases
    const H = renderer.domElement.height / window.devicePixelRatio
    // Three.js: Y=0 at bottom, Y=H at top; screen: Y=0 at top → flip
    carGroup.position.set(pixel.x, H - pixel.y, 0)

    // Scale car to be a fixed meaningful size in pixels
    const zoom = map.getZoom()
    const carM = 6.0 // smaller footprint size so it matches the route lines perfectly
    const carPx = Math.max(30, carM * ppm(lat, zoom))
    carGroup.scale.setScalar(carPx / 200) // 200 = base scale from buildCar

    // Heading: compute screen-space direction to next waypoint
    const pn = proj.fromLatLngToContainerPixel(new google.maps.LatLng(wp1.lat, wp1.lng))
    if (!pn) return
    const sdx = pn.x - pixel.x
    const sdy = pixel.y - pn.y // flip Y for right-handed world
    if (Math.hypot(sdx, sdy) > 0.5) {
      carGroup.rotation.z = Math.atan2(sdy, sdx)
    }
    const headingDeg = ((Math.atan2(sdx, sdy) * 180) / Math.PI + 360) % 360

    carGroup.visible = true
    renderer.render(scene, camera)

    // Follow car instantly
    map.setCenter({ lat, lng })
    
    // As the user requested, if this is the very first frame of simulation start, zoom in close to the car.
    // We achieve this securely without breaking the rest of the simulation by explicitly maintaining a close zoom.
    if (t === 0 && map.getZoom() < 17) {
        map.setZoom(18)
    }

    // Compute HUD stats
    const east = (wp1.lng - wp0.lng) * Math.cos((lat * Math.PI) / 180) * 111320
    const north = (wp1.lat - wp0.lat) * 111320
    const segM = Math.hypot(east, north)
    const segSec = wp1.elapsed - wp0.elapsed || 1
    // During pause, speed is effectively 0 visually but we report the active segment speed
    const kmh = isPaused ? "0" : ((segM / segSec) * 3.6).toFixed(0)
    const distKm = ((t * totalDist) / 1000).toFixed(1)
    
    // Remaining real-world seconds based on current multiplier
    const remSec = Math.max(0, (totalSec - accSimT) / multiplier)

    // Extract the active maneuver instruction from the waypoint timeline
    const instruction = wp0.instruction || null

    onFrame({ 
      kmh, 
      distKm, 
      totalDistKm: (totalDist / 1000).toFixed(0), 
      simT, 
      remSec, 
      progress: t, 
      heading: headingDeg, 
      lat, 
      lng,
      instruction 
    })

    if (t < 1.0) {
      animId = requestAnimationFrame(frame)
    } else {
      if (!isPaused) onDone()
      else animId = requestAnimationFrame(frame)
    }
  }

  animId = requestAnimationFrame(frame)
  return () => {
    if (animId) cancelAnimationFrame(animId)
  }
}
