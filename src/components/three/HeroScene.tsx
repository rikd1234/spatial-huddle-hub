import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Float, Trail } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedSphere({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
      <Trail width={2} length={6} color={color} attenuation={(t) => t * t}>
        <mesh ref={meshRef} position={position}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Trail>
    </Float>
  )
}

function ConnectionLines() {
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i < 20; i++) {
      pts.push(new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      ))
    }
    return pts
  }, [])

  return (
    <group>
      {points.map((point, i) => (
        <AnimatedSphere 
          key={i}
          position={[point.x, point.y, point.z]} 
          color={i % 2 === 0 ? "#a855f7" : "#06b6d4"} 
        />
      ))}
    </group>
  )
}

export const HeroScene = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#06b6d4" />
        
        <ConnectionLines />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}