'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function NeuralNodes() {
  const ref = useRef<THREE.Points>(null)
  
  const particlesCount = 800
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount; i++) {
      // Create a more interesting distribution - clusters and connections
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 15 + 5
      const height = (Math.random() - 0.5) * 20
      
      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 5
      positions[i * 3 + 1] = height
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 5
    }
    return positions
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#22d3ee"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  )
}

function ConnectionLines() {
  const ref = useRef<THREE.LineSegments>(null)
  
  const geometry = useMemo(() => {
    const lineCount = 150
    const positions = new Float32Array(lineCount * 6)
    
    for (let i = 0; i < lineCount; i++) {
      // Random start point
      const angle1 = Math.random() * Math.PI * 2
      const radius1 = Math.random() * 12 + 3
      const height1 = (Math.random() - 0.5) * 15
      
      // Random end point nearby
      const angle2 = angle1 + (Math.random() - 0.5) * 0.8
      const radius2 = radius1 + (Math.random() - 0.5) * 4
      const height2 = height1 + (Math.random() - 0.5) * 8
      
      positions[i * 6] = Math.cos(angle1) * radius1
      positions[i * 6 + 1] = height1
      positions[i * 6 + 2] = Math.sin(angle1) * radius1
      
      positions[i * 6 + 3] = Math.cos(angle2) * radius2
      positions[i * 6 + 4] = height2
      positions[i * 6 + 5] = Math.sin(angle2) * radius2
    }
    
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
  })

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#22d3ee" transparent opacity={0.15} />
    </lineSegments>
  )
}

function FloatingOrbs() {
  const orb1Ref = useRef<THREE.Mesh>(null)
  const orb2Ref = useRef<THREE.Mesh>(null)
  const orb3Ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    if (orb1Ref.current) {
      orb1Ref.current.position.x = Math.sin(t * 0.3) * 8
      orb1Ref.current.position.y = Math.cos(t * 0.2) * 4
      orb1Ref.current.position.z = Math.sin(t * 0.4) * 6
    }
    
    if (orb2Ref.current) {
      orb2Ref.current.position.x = Math.cos(t * 0.25) * 10
      orb2Ref.current.position.y = Math.sin(t * 0.35) * 3
      orb2Ref.current.position.z = Math.cos(t * 0.3) * 8
    }
    
    if (orb3Ref.current) {
      orb3Ref.current.position.x = Math.sin(t * 0.2 + 2) * 6
      orb3Ref.current.position.y = Math.cos(t * 0.25 + 1) * 5
      orb3Ref.current.position.z = Math.sin(t * 0.35 + 3) * 7
    }
  })

  return (
    <>
      <mesh ref={orb1Ref}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
      </mesh>
      <mesh ref={orb2Ref}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
      </mesh>
      <mesh ref={orb3Ref}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.3} />
      </mesh>
    </>
  )
}

export function NeuralNetwork3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 25], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <NeuralNodes />
        <ConnectionLines />
        <FloatingOrbs />
      </Canvas>
    </div>
  )
}
