"use client";

import React, { useRef, useMemo, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture, Environment } from "@react-three/drei";
import { MotionValue, useMotionValue, useTransform, motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";

const RADIUS = 2.0;

const RealisticMoon = ({ onClick, scrollProgress }: { onClick?: () => void; scrollProgress?: MotionValue<number> }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // FIX: Ensure cursor is reset to auto on unmount, in case pointer was over moon when component unmounts
  React.useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') document.body.style.cursor = 'auto';
    };
  }, []);

  const colorMap = useTexture("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg");

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Auto rotation + scroll progress driven rotation (rotate up to 3.5 times PI)
      const scrollRotation = scrollProgress ? scrollProgress.get() * Math.PI * 3.5 : 0;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05 + scrollRotation;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      castShadow 
      receiveShadow 
      onClick={onClick}
      onPointerOver={() => { if (typeof window !== "undefined") document.body.style.cursor = 'pointer'; }} 
      onPointerOut={() => { if (typeof window !== "undefined") document.body.style.cursor = 'auto'; }}
    >
      <sphereGeometry args={[RADIUS, 64, 64]} />
      <meshStandardMaterial 
        map={colorMap} 
        bumpMap={colorMap} 
        bumpScale={0.02} 
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
};

const particlesCount = 60000; 
const [ringPositions, ringColors, ringRandoms] = (() => {
  const pos = new Float32Array(particlesCount * 3);
  const col = new Float32Array(particlesCount * 3);
  const rnd = new Float32Array(particlesCount);

  for(let i=0; i<particlesCount; i++) {
    const angle = Math.random() * Math.PI * 2;

    const rDist = Math.pow(Math.random(), 1.5);
    const radius = 2.2 + rDist * 2.2; 

    const thickness = 0.4 - (rDist * 0.2); 
    const ySpread = (Math.random() + Math.random() + Math.random() - 1.5);
    const y = ySpread * thickness; 

    pos[i*3] = Math.cos(angle) * radius;
    pos[i*3+1] = y;
    pos[i*3+2] = Math.sin(angle) * radius;

    const intensity = 1.0 - rDist; 

    const paletteType = Math.random();
    let baseR, baseG, baseB;

    if (paletteType < 0.80) {
      baseR = 0.25; baseG = 0.30; baseB = 0.35;
    } else if (paletteType < 0.92) {
      baseR = 0.0; baseG = 0.6; baseB = 0.8;
    } else {
      baseR = 0.6; baseG = 0.2; baseB = 0.8;
    }

    baseR = Math.min(1.0, Math.max(0.0, baseR + (Math.random() - 0.5) * 0.1));
    baseG = Math.min(1.0, Math.max(0.0, baseG + (Math.random() - 0.5) * 0.1));
    baseB = Math.min(1.0, Math.max(0.0, baseB + (Math.random() - 0.5) * 0.1));

    const sparkle = Math.random() > 0.95 ? 2.5 : 1.0;

    col[i*3] = baseR * intensity * sparkle;     
    col[i*3+1] = baseG * intensity * sparkle;   
    col[i*3+2] = baseB * intensity * sparkle;   
    rnd[i] = Math.random();
  }
  return [pos, col, rnd];
})();

const ParticleRing = ({ scrollProgress, massiveAsteroidsRef }: { scrollProgress: MotionValue<number>, massiveAsteroidsRef: React.MutableRefObject<Float32Array> }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const uniforms = useRef({
    uProgress: { value: 0 },
    uAsteroids: { value: new Float32Array(75 * 4) },
    time: { value: 0 }
  });

  // FIX: Pre-allocate reusable objects outside useFrame to eliminate per-frame GC pressure.
  // Previously: new Matrix4, new Float32Array(300), and 75x new Vector3 were allocated every frame.
  const _invMat = useRef(new THREE.Matrix4());
  const _localAsteroids = useRef(new Float32Array(75 * 4));
  const _astVec = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.02;
      pointsRef.current.updateMatrix();

      // Reuse pre-allocated Matrix4 instead of allocating new one every frame
      _invMat.current.copy(pointsRef.current.matrix).invert();

      for(let i = 0; i < 75; i++) {
        // Reuse pre-allocated Vector3 instead of allocating 75 new ones per frame
        _astVec.current.set(
          massiveAsteroidsRef.current[i*4],
          massiveAsteroidsRef.current[i*4+1],
          massiveAsteroidsRef.current[i*4+2]
        );
        _astVec.current.applyMatrix4(_invMat.current);
        _localAsteroids.current[i*4] = _astVec.current.x;
        _localAsteroids.current[i*4+1] = _astVec.current.y;
        _localAsteroids.current[i*4+2] = _astVec.current.z;
        _localAsteroids.current[i*4+3] = massiveAsteroidsRef.current[i*4+3];
      }
      uniforms.current.uAsteroids.value = _localAsteroids.current;
    }
    uniforms.current.time.value = state.clock.elapsedTime;
    uniforms.current.uProgress.value = scrollProgress.get();
  });

  const onBeforeCompile = (shader: any) => {
    shader.uniforms.uProgress = uniforms.current.uProgress;
    shader.uniforms.uAsteroids = uniforms.current.uAsteroids;
    shader.uniforms.time = uniforms.current.time;

    shader.vertexShader = shader.vertexShader.replace(
      `void main() {`,
      `
      uniform float uProgress;
      uniform vec4 uAsteroids[75];
      uniform float time;
      attribute float aRandom;
      varying float vProgress; 
      void main() {
      `
    );

    shader.vertexShader = shader.vertexShader.replace(
      `#include <begin_vertex>`,
      `
      vec3 transformed = vec3(position);

      float angle = atan(transformed.x, transformed.z);
      float normalizedAngle = abs(angle) / 3.14159265359;
      float spawnThreshold = 1.0 - normalizedAngle; 

      float progressValue = (uProgress * 1.4) - spawnThreshold;
      float particleProgress = smoothstep(0.0, 0.4, progressValue);
      vProgress = particleProgress;

      transformed.y += sin(angle * 10.0 + time) * 0.05 * aRandom;

      if (uProgress > 0.5) {
        for(int i = 0; i < 75; i++) {
          vec4 astData = uAsteroids[i];
          vec3 delta = transformed - astData.xyz;
          float dist = length(delta);

          float rad = astData.w * 2.0 + 0.15;

          if (dist < rad) {
             float force = pow((rad - dist) / rad, 2.0); 
             transformed += normalize(delta) * force * 0.4;
             transformed.y += force * 0.20 * (aRandom - 0.5);
          }
        }
      }

      float swirl = (1.0 - particleProgress) * 4.0; 
      float s = sin(swirl);
      float c = cos(swirl);
      transformed.xz = mat2(c, -s, s, c) * transformed.xz;

      transformed.y += (1.0 - particleProgress) * (transformed.y >= 0.0 ? 1.0 : -1.0);

      vec3 moonSurface = normalize(transformed) * 2.1;
      transformed = mix(moonSurface, transformed, particleProgress);
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `void main() {`,
      `
      varying float vProgress;
      void main() {
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <color_fragment>`,
      `
      #include <color_fragment>
      diffuseColor.a *= vProgress;
      `
    );
  };

  return (
    <points ref={pointsRef} rotation={[-Math.PI / 2, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particlesCount}
          array={ringPositions}
          itemSize={3}
          args={[ringPositions, 3]}
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={particlesCount}
          array={ringColors}
          itemSize={3}
          args={[ringColors, 3]}
        />
        <bufferAttribute 
          attach="attributes-aRandom" 
          count={particlesCount}
          array={ringRandoms}
          itemSize={1}
          args={[ringRandoms, 1]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.008} 
        vertexColors 
        transparent 
        opacity={0.8} 
        sizeAttenuation={true} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
        onBeforeCompile={onBeforeCompile} 
      />
    </points>
  );
};

const generateAsteroids = (count: number) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const baseRadius = 2.8 + Math.random() * 2.0; 
    const radialAmplitude = 0.5 + Math.random() * 1.5; 
    const radialSpeed = 0.15 + Math.random() * 0.25; 
    const phase = Math.random() * Math.PI * 2;

    const angle = Math.random() * Math.PI * 2;
    const zOffset = (Math.random() - 0.5) * 0.8; 

    const speed = (0.04 + Math.random() * 0.08) * (Math.random() > 0.5 ? 1 : -1);

    const rotationSpeedX = (Math.random() - 0.5) * 0.05;
    const rotationSpeedY = (Math.random() - 0.5) * 0.05;
    const rotationSpeedZ = (Math.random() - 0.5) * 0.05;

    const scale = 0.02 + Math.pow(Math.random(), 4) * 0.18;

    data.push({
      angle, baseRadius, radialAmplitude, radialSpeed, phase, zOffset, speed,
      rx: Math.random() * Math.PI, ry: Math.random() * Math.PI, rz: Math.random() * Math.PI,
      rsx: rotationSpeedX, rsy: rotationSpeedY, rsz: rotationSpeedZ,
      scale
    });
  }
  data.sort((a, b) => b.scale - a.scale);
  return data;
};

const AsteroidBelt = ({ scrollProgress, massiveAsteroidsRef }: { scrollProgress: MotionValue<number>, massiveAsteroidsRef: React.MutableRefObject<Float32Array> }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const [colorMap, bumpMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg'
  ]);

  const count = 75; 
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const [asteroids] = useState(() => generateAsteroids(count));

  const scaleRef = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Directly bind scale of asteroid belt to scroll progress MotionValue
    scaleRef.current = scrollProgress.get();

    if (scaleRef.current < 0.01) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    asteroids.forEach((ast, i) => {

      ast.angle += ast.speed * delta; 

      ast.phase += ast.radialSpeed * delta;
      let currentRadius = ast.baseRadius + Math.sin(ast.phase) * ast.radialAmplitude;

      if (currentRadius < 2.15) {
        const penetration = 2.15 - currentRadius;
        currentRadius = 2.15 + penetration * 0.85;
      }

      const x = Math.cos(ast.angle) * currentRadius;
      const y = Math.sin(ast.angle) * currentRadius;

      massiveAsteroidsRef.current[i * 4] = x;
      massiveAsteroidsRef.current[i * 4 + 1] = y;
      massiveAsteroidsRef.current[i * 4 + 2] = ast.zOffset;
      massiveAsteroidsRef.current[i * 4 + 3] = ast.scale;

      ast.rx += ast.rsx;
      ast.ry += ast.rsy;
      ast.rz += ast.rsz;

      dummy.position.set(x, y, ast.zOffset);
      dummy.rotation.set(ast.rx, ast.ry, ast.rz);
      dummy.scale.setScalar(ast.scale * scaleRef.current);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        map={colorMap} 
        bumpMap={bumpMap} 
        bumpScale={0.08}
        color="#ffffff"
        roughness={0.7}
        metalness={0.1}
      />
    </instancedMesh>
  );
};

const SceneGroup = ({ 
  scrollProgress, 
  massiveAsteroidsRef 
}: { 
  scrollProgress: MotionValue<number>; 
  massiveAsteroidsRef: React.MutableRefObject<Float32Array> 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      const p = scrollProgress.get();
      // Map progress [0 -> 0.4] to scale [0.25 -> 1.0]
      const progressFactor = Math.min(1.0, Math.max(0.0, p / 0.4));
      const currentScale = 0.25 + progressFactor * 0.75;
      groupRef.current.scale.setScalar(currentScale);
    }
  });

  // Map progress [0.4 -> 0.95] to orbit progress (after moon is settled)
  const orbitProgress = useTransform(scrollProgress, [0.4, 0.95], [0, 1], { clamp: true });

  return (
    <group ref={groupRef} rotation={[Math.PI / 8, 0, 0]}>
      <RealisticMoon scrollProgress={scrollProgress} />
      <ParticleRing scrollProgress={orbitProgress} massiveAsteroidsRef={massiveAsteroidsRef} />
      <AsteroidBelt scrollProgress={orbitProgress} massiveAsteroidsRef={massiveAsteroidsRef} />
    </group>
  );
};

export interface LunarGravityCardProps {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  scrollProgress?: MotionValue<number>;
}

export default function LunarGravityCard({ 
  className,
  title = (
    <>
      <span className="text-zinc-50 drop-shadow-sm font-heading">Interactive</span>
      <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent drop-shadow-md font-heading">
        3D Design.
      </span>
    </>
  ),
  description = "Pearlio builds immersive 3D websites, e-commerce stores, and high-performance landing pages that captivate visitors. Click the moon to trigger gravity fields and experience next-gen web technology.",
  scrollProgress
}: LunarGravityCardProps) {
  const massiveAsteroidsRef = useRef<Float32Array>(new Float32Array(75 * 4));
  const fallbackProgress = useMotionValue(1.0);
  const activeProgress = scrollProgress || fallbackProgress;

  // Map scroll progress [0 -> 0.4] to canvas flying-in entry transforms (with clamp to prevent coordinate warping)
  const canvasX = useTransform(activeProgress, [0, 0.4], [600, 0], { clamp: true });
  const canvasY = useTransform(activeProgress, [0, 0.4], [350, 0], { clamp: true });
  const canvasOpacity = useTransform(activeProgress, [0, 0.25], [0, 1], { clamp: true });

  // Map scroll progress [0.15 -> 0.45] to text entry transforms
  const textOpacity = useTransform(activeProgress, [0.15, 0.45], [0, 1], { clamp: true });
  const textY = useTransform(activeProgress, [0.15, 0.45], [40, 0], { clamp: true });

  return (
    <div className={cn("w-full max-w-7xl mx-auto px-6 md:px-12 min-h-[600px] flex flex-col md:flex-row relative overflow-hidden", className)}>
      
      <div className="absolute top-0 left-0 md:inset-y-0 md:left-0 w-full h-[60%] md:h-full md:w-[60%] bg-gradient-to-b md:bg-gradient-to-r from-[#0A0915] via-[#0A0915]/90 to-transparent z-10 pointer-events-none"></div>

      <motion.div 
        style={{ opacity: textOpacity, y: textY }}
        className="w-full md:w-[45%] flex flex-col justify-center py-10 md:py-0 relative z-20 pointer-events-none text-left"
      >
        <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6">
          {title}
        </h2>
        <p className="text-base md:text-lg text-textMuted font-medium leading-relaxed max-w-[340px]">
          {description}
        </p>
      </motion.div>
     
      <motion.div 
        style={{ x: canvasX, y: canvasY, opacity: canvasOpacity }}
        className="relative md:absolute md:right-0 md:top-0 w-full h-[380px] md:h-full md:w-[65%] pointer-events-auto z-0 flex items-center justify-center"
      >
        <div className="absolute inset-0 w-full h-full">
          <Canvas
            shadows
            camera={{ position: [0, 4, 10], fov: 45 }}
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
            }}
          >
            <Environment preset="city" />

            <ambientLight intensity={0.02} />
            <directionalLight position={[8, 5, 5]} intensity={1.5} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} />
            <directionalLight position={[-5, -3, -5]} intensity={0.15} color="#8b5cf6" />

            <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />

            <Suspense fallback={null}>
              <SceneGroup scrollProgress={activeProgress} massiveAsteroidsRef={massiveAsteroidsRef} />
            </Suspense>
          </Canvas>
        </div>
      </motion.div>
    </div>
  );
}

export { LunarGravityCard as Component };
