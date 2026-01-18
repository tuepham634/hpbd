import { useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Galaxy } from './Galaxy'
import { MemoryStar } from './MemoryStar'
import { FloatingParticles } from './FloatingParticles'
import { ShootingStars } from './ShootingStars'
import { Confetti } from './Confetti'
import * as THREE from 'three'

export function Experience() {
  const { camera } = useThree()
  const light1Ref = useRef<THREE.PointLight>(null!)
  const light2Ref = useRef<THREE.PointLight>(null!)

  // Initial camera position
  camera.position.set(0, 3, 8)

  useFrame((state) => {
    // Pulsing lights
    if (light1Ref.current) {
      light1Ref.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
    if (light2Ref.current) {
      light2Ref.current.intensity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5 + 1) * 0.2
    }
  })

  return (
    <>
      <color attach="background" args={['#050505']} />
      
      <OrbitControls 
        enablePan={false} 
        minDistance={2} 
        maxDistance={20} 
        autoRotate 
        autoRotateSpeed={0.5}
      />

      {/* Lighting with pulsing effect */}
      <ambientLight intensity={0.5} />
      <pointLight ref={light1Ref} position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight ref={light2Ref} position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      <pointLight position={[0, 5, -10]} intensity={0.8} color="#00ffff" />
      
      {/* Visual Effects */}
      <FloatingParticles />
      <ShootingStars />
      <Confetti />

      {/* Main Galaxy - Dreamy Purple/Pink Theme */}
      <Galaxy 
        count={20000} 
        radius={10} 
        branches={3} 
        randomness={0.5} 
        randomnessPower={3} 
        insideColor="#ff6030"
        outsideColor="#1b3984" 
      />

      {/* Birthday Memories/Wishes - Auto Reveal Sequence */}
      <group>
        <MemoryStar 
          position={[0, 3, 0]} 
          message="Happy Birthday!" 
          color="#ff00ff" 
          startTime={2}
        />
        <MemoryStar 
          position={[-4, 1, 3]} 
          message="Vũ Thị Ánh Nguyệt" 
          color="#00ffff"
          startTime={4}
        />
        <MemoryStar 
          position={[4, -0.5, 3]} 
          message="18/01/2004" 
          color="#ffd700" 
          startTime={6}
        />
        <MemoryStar 
          position={[3, 2.5, -2]} 
          message="Tuổi 22 Rực Rỡ" 
          color="#ff4500" 
          startTime={8}
        />
        <MemoryStar 
          position={[-3, -1.5, -2]} 
          message="Luôn Xinh Đẹp & Hạnh Phúc" 
          color="#32cd32" 
          startTime={10}
        />
      </group>

      {/* Enhanced Post Processing */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.15} 
          mipmapBlur 
          intensity={2} 
          radius={0.8} 
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.001, 0.001)}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.2} />
      </EffectComposer>
    </>
  )
}
