// Leg colours for each route segment
export const LEG_COLORS = [
  '#E53935',
  '#1E88E5',
  '#43A047',
  '#FB8C00',
  '#8E24AA',
  '#00ACC1',
  '#F4511E',
  '#3949AB',
]

/**
 * Initialise a Google Maps Map instance.
 * @param {HTMLElement} el
 * @returns {google.maps.Map}
 */
export function initMap(el) {
  return new google.maps.Map(el, {
    zoom: 7,
    center: { lat: -36.0, lng: 141.5 },
    fullscreenControl: false,
  })
}

/**
 * Fetch driving directions and call back with the best (shortest) route.
 * @param {google.maps.Map} map
 * @param {string|object} origin
 * @param {string|object} destination
 * @param {string} region code (e.g. 'AU')
 * @param {(route: object, totalDist: number) => void} onSuccess
 * @param {(status: string) => void} onError
 */
export function fetchRoute(map, origin, destination, region, onSuccess, onError) {
  new google.maps.DirectionsService().route(
    {
      origin,
      destination,
      region,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    },
    (res, status) => {
      if (status !== 'OK') {
        onError(status)
        return
      }

      // Pick shortest route
      let best = res.routes[0],
        minD = Infinity
      res.routes.forEach((r) => {
        const d = r.legs.reduce((a, l) => a + l.distance.value, 0)
        if (d < minD) {
          minD = d
          best = r
        }
      })

      onSuccess(best, minD)
    }
  )
}

/**
 * Draw coloured polylines for each leg and fit the map bounds.
 * @param {google.maps.Map} map
 * @param {object} route
 */
export function drawLegs(map, route) {
  const bounds = new google.maps.LatLngBounds()
  route.legs.forEach((leg, i) => {
    const path = []
    leg.steps.forEach((s) =>
      google.maps.geometry.encoding.decodePath(s.polyline.points).forEach((p) => {
        path.push(p)
        bounds.extend(p)
      })
    )
    new google.maps.Polyline({
      path,
      map,
      strokeColor: LEG_COLORS[i % LEG_COLORS.length],
      strokeOpacity: 0.85,
      strokeWeight: 5,
    })
  })
  map.fitBounds(bounds)
}
