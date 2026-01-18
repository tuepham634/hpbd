import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'

interface MemoryStarProps {
  position: [number, number, number]
  message: string
  color?: string
  startTime?: number
}

export function MemoryStar({ position, message, color = 'gold', startTime = 0 }: MemoryStarProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const [falling, setFalling] = useState(false)
  const initialY = useMemo(() => position[1] + 15, [position])

  useFrame((state, delta) => {
    // Auto-activate logic
    if (!active && startTime > 0 && state.clock.elapsedTime > startTime) {
        setActive(true)
        setFalling(true)
    }

    // Falling animation
    if (falling && groupRef.current) {
      const targetY = position[1]
      const currentY = groupRef.current.position.y
      
      if (currentY > targetY) {
        // Fall down with gravity-like acceleration
        const fallSpeed = 0.1
        groupRef.current.position.y -= fallSpeed
      } else {
        // Bounce effect when landing
        groupRef.current.position.y = targetY
        setFalling(false)
      }
    }

    if (active) {
        meshRef.current.rotation.x += delta * 0.5
        meshRef.current.rotation.y += delta * 0.5
    } else {
        meshRef.current.rotation.x += delta * 0.2
        meshRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <group ref={groupRef} position={[position[0], initialY, position[2]]}>
            <mesh
                ref={meshRef}
                onClick={(e) => {
                    e.stopPropagation()
                    setActive((prev) => !prev)
                }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                scale={active ? 1.2 : hovered ? 1.1 : 1}
            >
                <icosahedronGeometry args={[0.15, 1]} />
                <meshStandardMaterial 
                    color={active ? '#fff' : color} 
                    emissive={active ? color : color}
                    emissiveIntensity={active ? 1 : 0.3}
                    toneMapped={false}
                />
            </mesh>
            
            {(hovered || active) && (
                <Html distanceFactor={10}>
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(5px)',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: '#e0e0e0',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        transform: 'translate3d(-50%, -150%, 0)',
                        textAlign: 'center',
                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                        transition: 'transform 0.3s ease',
                        opacity: active ? 0.95 : 0.8,
                        animation: active ? 'pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' : 'none'
                    }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600 }}>{message}</p>
                    </div>
                </Html>
            )}
        </group>
    </Float>
  )
}
