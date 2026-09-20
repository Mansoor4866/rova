import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Rova3DCanvasProps {
  colorScheme?: 'crimson' | 'cyan' | 'purple' | 'emerald';
  speedMultiplier?: number;
  className?: string;
  onInteract?: () => void;
}

const COLOR_PALETTES = {
  crimson: {
    primary: new THREE.Color(0xff2244),
    secondary: new THREE.Color(0xff6677),
    accent: new THREE.Color(0xffffff),
    ambient: new THREE.Color(0x330008),
  },
  cyan: {
    primary: new THREE.Color(0x00d4ff),
    secondary: new THREE.Color(0x00f5d4),
    accent: new THREE.Color(0xffffff),
    ambient: new THREE.Color(0x001a24),
  },
  purple: {
    primary: new THREE.Color(0x9d4edd),
    secondary: new THREE.Color(0xc77dff),
    accent: new THREE.Color(0xffffff),
    ambient: new THREE.Color(0x19082b),
  },
  emerald: {
    primary: new THREE.Color(0x00e599),
    secondary: new THREE.Color(0x52ffb8),
    accent: new THREE.Color(0xffffff),
    ambient: new THREE.Color(0x002416),
  },
};

export const Rova3DCanvas: React.FC<Rova3DCanvasProps> = ({
  colorScheme = 'crimson',
  speedMultiplier = 1,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070a, 0.0018);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(0, 0, 480);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 4. Generate Cylinder / Toroid Matrix Particle Lattice (Knox Signature Style)
    const particleCount = 4200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const originalPositions = new Float32Array(particleCount * 3);

    const palette = COLOR_PALETTES[colorScheme] || COLOR_PALETTES.crimson;

    const rings = 70;
    const pointsPerRing = Math.floor(particleCount / rings);
    const cylinderRadius = 240;
    const cylinderHeight = 520;

    let pIndex = 0;
    for (let r = 0; r < rings; r++) {
      const vNorm = r / (rings - 1); // 0 to 1
      const y = (vNorm - 0.5) * cylinderHeight;

      // Profile curve: barrel shaped (wider in center, tapering slightly at ends)
      const barrelFactor = Math.sin(vNorm * Math.PI) * 0.45 + 0.65;
      const currentRadius = cylinderRadius * barrelFactor;

      for (let p = 0; p < pointsPerRing; p++) {
        if (pIndex >= particleCount) break;

        const theta = (p / pointsPerRing) * Math.PI * 2;
        // Subtle organic noise offset
        const radialOffset = (Math.random() - 0.5) * 16;
        const x = (currentRadius + radialOffset) * Math.cos(theta);
        const z = (currentRadius + radialOffset) * Math.sin(theta);

        positions[pIndex * 3] = x;
        positions[pIndex * 3 + 1] = y;
        positions[pIndex * 3 + 2] = z;

        originalPositions[pIndex * 3] = x;
        originalPositions[pIndex * 3 + 1] = y;
        originalPositions[pIndex * 3 + 2] = z;

        // Color gradient based on depth & height
        const mixRatio = Math.random();
        let pointColor: THREE.Color;
        if (mixRatio > 0.88) {
          pointColor = palette.accent;
          sizes[pIndex] = Math.random() * 3.5 + 2.5;
        } else if (mixRatio > 0.4) {
          pointColor = palette.primary;
          sizes[pIndex] = Math.random() * 2.5 + 1.5;
        } else {
          pointColor = palette.secondary;
          sizes[pIndex] = Math.random() * 1.8 + 1.0;
        }

        colors[pIndex * 3] = pointColor.r;
        colors[pIndex * 3 + 1] = pointColor.g;
        colors[pIndex * 3 + 2] = pointColor.b;

        pIndex++;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom Particle Texture (Sharp circular glow)
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)');
      gradient.addColorStop(0.5, 'rgba(255, 50, 80, 0.45)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const particleTexture = createParticleTexture();

    const pointsMaterial = new THREE.PointsMaterial({
      size: 3.5,
      vertexColors: true,
      map: particleTexture || undefined,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, pointsMaterial);
    scene.add(particleSystem);

    // 5. Add Secondary Orbital Neon Ring and Cyber Wireframe Nodes
    const ringGeo = new THREE.TorusGeometry(260, 1.2, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: palette.primary,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const orbitalRing = new THREE.Mesh(ringGeo, ringMat);
    orbitalRing.rotation.x = Math.PI / 2.3;
    scene.add(orbitalRing);

    const ringGeo2 = new THREE.TorusGeometry(280, 0.8, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: palette.secondary,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const orbitalRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    orbitalRing2.rotation.x = -Math.PI / 3;
    scene.add(orbitalRing2);

    // 6. Ambient Floating Cyber Dust
    const dustCount = 350;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 800;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 600;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 600;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 2.0,
      color: palette.secondary,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const dustSystem = new THREE.Points(dustGeo, dustMat);
    scene.add(dustSystem);

    // 7. Interactive Mouse / Parallax Controller
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0.15;
    let targetRotationY = 0;
    let currentRotationX = 0.15;
    let currentRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;
      mouseX = (clientX / rect.width) * 2 - 1;
      mouseY = -(clientY / rect.height) * 2 + 1;

      targetRotationY = mouseX * 0.45;
      targetRotationX = 0.15 - mouseY * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 8. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime() * speedMultiplier;

      // Smooth inertia rotation
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      particleSystem.rotation.y = elapsedTime * 0.2 + currentRotationY;
      particleSystem.rotation.x = currentRotationX;
      particleSystem.rotation.z = Math.sin(elapsedTime * 0.15) * 0.05;

      orbitalRing.rotation.z = elapsedTime * 0.12;
      orbitalRing.rotation.y = currentRotationY * 0.5;
      orbitalRing2.rotation.z = -elapsedTime * 0.08;

      dustSystem.rotation.y = -elapsedTime * 0.05;
      dustSystem.rotation.x = elapsedTime * 0.03;

      // Wave distortion on particle vertices
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];
        const oz = originalPositions[i * 3 + 2];

        // Harmonic sine wave ripple
        const angle = Math.atan2(oz, ox);
        const wave = Math.sin(oy * 0.02 + elapsedTime * 1.8 + angle * 2) * 8.0;
        const radialScale = 1 + wave / cylinderRadius;

        posArray[i * 3] = ox * radialScale;
        posArray[i * 3 + 1] = oy + Math.cos(angle * 3 + elapsedTime) * 2;
        posArray[i * 3 + 2] = oz * radialScale;
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      pointsMaterial.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      if (particleTexture) particleTexture.dispose();
      renderer.dispose();
    };
  }, [colorScheme, speedMultiplier]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};
