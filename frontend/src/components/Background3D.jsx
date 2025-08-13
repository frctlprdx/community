// File: Background3D.jsx
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

const Stars = () => {
  const ref = useRef();
  const count = 500;
  const positions = new Float32Array(count * 3);

  // Generate posisi acak untuk partikel
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20; // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
  }

  // Rotasi perlahan untuk efek 3D
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0005;
      ref.current.rotation.x += 0.0003;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#00FFFF"
        size={0.1}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
};

const Background3D = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      className="absolute inset-0 z-0"
    >
      <Stars />
    </Canvas>
  );
};

export default Background3D;
