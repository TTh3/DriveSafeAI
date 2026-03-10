import * as THREE from 'three'
import carImgUrl from '../assets/convertible-automotive-design-vehicle-roadster-car.png'

const textureLoader = new THREE.TextureLoader()

/**
 * Build the 2D car model (ENU: X=East, Y=North, Z=Up).
 * Car "front" faces +X by default; rotation.z turns it to face the heading.
 * Returns a flat 2D shape geometric representation of a car.
 * Units = metres. Scale factor: each unit = 50 metres.
 * @returns {THREE.Group}
 */
export function buildCar() {
  const g = new THREE.Group()
  const texture = textureLoader.load(carImgUrl)

  // Re-scale to make the car look larger and avoid strict 2.0 stretch.
  // 2.2:1 usually fits real-world roadsters better.
  const w = 200.0
  const h = 200.0 / 2.2
  
  const geo = new THREE.PlaneGeometry(w, h)
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  })

  const carMesh = new THREE.Mesh(geo, mat)
  
  // The user stated the car in the image is facing the left side (-X).
  // The Three.js car simulation group expects the car's front to face Right (+X).
  // Therefore, we rotate the mesh 180 degrees (Math.PI) around Z to align it properly.
  carMesh.rotation.z = Math.PI

  g.add(carMesh)

  return g
}
