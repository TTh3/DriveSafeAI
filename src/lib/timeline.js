/**
 * Build a flat waypoint timeline from a Directions API route.
 * Each waypoint: { lat, lng, elapsed }  (elapsed in real seconds)
 *
 * @param {object} route  – best DirectionsRoute from the API
 * @param {number} totalDist – total distance in metres
 * @returns {{ wps: Array, totalSec: number, totalDist: number }}
 */
export function buildTimeline(route, totalDist) {
  const wps = []
  let elapsed = 0

  route.legs.forEach((leg) => {
    leg.steps.forEach((step) => {
      const pts = google.maps.geometry.encoding.decodePath(step.polyline.points)
      const dur = step.duration.value
      const n = pts.length - 1

      if (n === 0) {
        if (!wps.length) wps.push({ lat: pts[0].lat(), lng: pts[0].lng(), elapsed, instruction: step.instructions })
        elapsed += dur
        return
      }

      // Proportional arc-length timing within each step
      const segL = []
      let arc = 0
      for (let i = 0; i < n; i++) {
        const d = google.maps.geometry.spherical.computeDistanceBetween(pts[i], pts[i + 1])
        segL.push(d)
        arc += d
      }
      if (!arc) arc = 1

      if (!wps.length) wps.push({ lat: pts[0].lat(), lng: pts[0].lng(), elapsed: 0, instruction: step.instructions })

      let cum = 0
      for (let i = 0; i < n; i++) {
        cum += segL[i]
        wps.push({
          lat: pts[i + 1].lat(),
          lng: pts[i + 1].lng(),
          elapsed: elapsed + (cum / arc) * dur,
          instruction: step.instructions
        })
      }
      elapsed += dur
    })
  })

  return { wps, totalSec: elapsed, totalDist }
}
