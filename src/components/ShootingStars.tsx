// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ShootingStars() {
  const starsRef = useRef<THREE.Group>(null!)
  
  // Create 5 shooting stars
  const stars = Array.from({ length: 5 }, () => ({
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      Math.random() * 10 + 5,
      (Math.random() - 0.5) * 20
    ),
    velocity: new THREE.Vector3(
      -Math.random() * 0.1 - 0.05,
      -Math.random() * 0.05 - 0.02,
      (Math.random() - 0.5) * 0.05
    ),
    reset: Math.random() * 10,
    color: new THREE.Color().setHSL(Math.random(), 1, 0.7)
  }))

  useFrame((_, delta) => {
    if (!starsRef.current) return

    starsRef.current.children.forEach((star, i) => {
      const data = stars[i]
      
      // Update position
      star.position.add(data.velocity)
      
      // Reset if out of bounds
      if (star.position.y < -10 || star.position.x < -15) {
        star.position.set(
          Math.random() * 10 + 10,
          Math.random() * 5 + 10,
          (Math.random() - 0.5) * 20
        )
      }
      
      // Rotate for sparkle effect
      star.rotation.z += delta * 2
    })
  })

  return (
    <group ref={starsRef}>
      {stars.map((star, i) => (
        <mesh key={i} position={star.position}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={star.color} />
          {/* Tail effect */}
          <mesh position={[0.3, 0.1, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.8, 0.05, 0.05]} />
            <meshBasicMaterial color={star.color} transparent opacity={0.6} />
          </mesh>
        </mesh>
      ))}
    </group>
  )
}
