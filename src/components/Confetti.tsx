import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Confetti() {
  const confettiRef = useRef<THREE.Points>(null!)
  
  const { positions, colors, velocities } = useMemo(() => {
    const count = 500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const velocities: THREE.Vector3[] = []
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Start from top center
      positions[i3] = (Math.random() - 0.5) * 5
      positions[i3 + 1] = Math.random() * 3 + 8
      positions[i3 + 2] = (Math.random() - 0.5) * 5
      
      // Bright festive colors
      const hue = Math.random()
      const color = new THREE.Color().setHSL(hue, 1, 0.6)
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
      
      // Random velocities
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        -Math.random() * 0.05 - 0.01,
        (Math.random() - 0.5) * 0.02
      ))
    }
    
    return { positions, colors, velocities, count }
  }, [])

  useFrame((state, delta) => {
    if (!confettiRef.current) return
    
    const positions = confettiRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < 500; i++) {
      const i3 = i * 3
      const velocity = velocities[i]
      
      // Update position
      positions[i3] += velocity.x
      positions[i3 + 1] += velocity.y
      positions[i3 + 2] += velocity.z
      
      // Add some rotation/flutter
      positions[i3] += Math.sin(state.clock.elapsedTime + i) * 0.001
      
      // Reset if fallen too low
      if (positions[i3 + 1] < -5) {
        positions[i3] = (Math.random() - 0.5) * 5
        positions[i3 + 1] = 12
        positions[i3 + 2] = (Math.random() - 0.5) * 5
      }
    }
    
    confettiRef.current.geometry.attributes.position.needsUpdate = true
    confettiRef.current.rotation.y += delta * 0.1
  })

  return (
    <points ref={confettiRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.9}
      />
    </points>
  )
}
