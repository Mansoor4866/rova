import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Radio, 
  Layers,
  ArrowUpRight,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { soundService } from '../services/soundService';

export const Hero3DVisual: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentLivePrice, setCurrentLivePrice] = useState<number>(92485.40);
  const [liveDelta, setLiveDelta] = useState<number>(1.45);
  const [recentPayout, setRecentPayout] = useState<{ asset: string; amount: number; direction: 'UP' | 'DOWN'; time: string }>({
    asset: 'BTC-USD',
    amount: 19.00,
    direction: 'UP',
    time: '2s ago',
  });
  const [activeTab, setActiveTab] = useState<'radar' | 'stream'>('radar');

  // 1. Live Simulated Payout / Oracle Ticks for the HUD
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * 12;
      setCurrentLivePrice(prev => +(prev + delta).toFixed(2));
      setLiveDelta(prev => +(prev + (Math.random() - 0.5) * 0.1).toFixed(2));

      // Random payout notification cycle
      if (Math.random() > 0.45) {
        const assets = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'NVDA-USD'];
        const randomAsset = assets[Math.floor(Math.random() * assets.length)];
        const randomDir = Math.random() > 0.4 ? 'UP' : 'DOWN';
        const randomAmt = +(15 + Math.random() * 45).toFixed(2);
        setRecentPayout({
          asset: randomAsset,
          amount: randomAmt,
          direction: randomDir,
          time: 'just now',
        });
      }
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  // 2. Three.js 3D Holographic Sphere & Orbital Prediction Rings
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    let width = container.clientWidth || 480;
    let height = container.clientHeight || 420;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 320);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Geometry & Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Core Glowing Holographic Icosahedron Sphere
    const coreGeo = new THREE.IcosahedronGeometry(72, 3);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xf243ac, // Facto Pink
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // 2. Outer Geodesic Volatility Shell
    const outerGeo = new THREE.IcosahedronGeometry(96, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x00e599, // Facto Emerald Green
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    mainGroup.add(outerMesh);

    // 3. Orbital Neon Prediction Rings
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xf243ac,
      transparent: true,
      opacity: 0.65,
    });
    const ringGeo1 = new THREE.TorusGeometry(120, 1.2, 16, 100);
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 3;
    mainGroup.add(ringMesh1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00e599,
      transparent: true,
      opacity: 0.45,
    });
    const ringGeo2 = new THREE.TorusGeometry(132, 0.9, 16, 100);
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = -Math.PI / 3.5;
    ringMesh2.rotation.y = Math.PI / 5;
    mainGroup.add(ringMesh2);

    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8, // Sky blue accent
      transparent: true,
      opacity: 0.4,
    });
    const ringGeo3 = new THREE.TorusGeometry(142, 0.7, 16, 90);
    const ringMesh3 = new THREE.Mesh(ringGeo3, ringMat3);
    ringMesh3.rotation.z = Math.PI / 4;
    mainGroup.add(ringMesh3);

    // 4. Volumetric Particle Cloud (Oracle Data Points)
    const particleCount = 650;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const originalPos = new Float32Array(particleCount * 3);

    const pinkColor = new THREE.Color(0xf243ac);
    const greenColor = new THREE.Color(0x00e599);
    const whiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const radius = 60 + Math.random() * 95;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      originalPos[i * 3] = x;
      originalPos[i * 3 + 1] = y;
      originalPos[i * 3 + 2] = z;

      const rand = Math.random();
      const col = rand > 0.6 ? pinkColor : rand > 0.25 ? greenColor : whiteColor;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 2.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleSystem);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = mouseX * 0.35;
      targetY = mouseY * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth inertia
      mainGroup.rotation.y += (targetX - mainGroup.rotation.y) * 0.05 + 0.005;
      mainGroup.rotation.x += (targetY - mainGroup.rotation.x) * 0.05 + 0.002;

      // Internal rotations
      coreMesh.rotation.y = -elapsed * 0.25;
      coreMesh.rotation.x = elapsed * 0.15;
      outerMesh.rotation.y = elapsed * 0.18;
      outerMesh.rotation.z = -elapsed * 0.12;

      ringMesh1.rotation.z = elapsed * 0.35;
      ringMesh2.rotation.z = -elapsed * 0.25;
      ringMesh3.rotation.y = elapsed * 0.3;

      // Particle oscillation & harmonic wave
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const ox = originalPos[i * 3];
        const oy = originalPos[i * 3 + 1];
        const oz = originalPos[i * 3 + 2];

        const pulse = 1 + Math.sin(elapsed * 2.5 + i * 0.1) * 0.06;
        arr[i * 3] = ox * pulse;
        arr[i * 3 + 1] = oy * pulse;
        arr[i * 3 + 2] = oz * pulse;
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 480;
      const h = container.clientHeight || 420;
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
      coreGeo.dispose();
      coreMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      ringGeo3.dispose();
      ringMat3.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] sm:h-[460px] lg:h-[500px] flex items-center justify-center select-none">
      
      {/* 1. Holographic 3D Ambient Background Glows */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full bg-gradient-to-tr from-facto-pink/20 via-facto-green/15 to-transparent blur-3xl animate-pulse-glow" />
      </div>

      {/* 2. Three.js Canvas Container */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
      />

      {/* 3. Floating Overlay Card: Top Left (Live Settlement Feed) */}
      <div className="absolute top-2 left-0 sm:-left-2 z-20 animate-float-slow">
        <div className="bg-app-card/85 dark:bg-app-card/90 backdrop-blur-xl border border-app-border rounded-2xl p-3 sm:p-3.5 shadow-xl shadow-black/5 hover:border-facto-pink/50 transition-all group">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-facto-green/10 border border-facto-green/20 flex items-center justify-center text-facto-green">
              {recentPayout.direction === 'UP' ? (
                <TrendingUp className="w-4 h-4 animate-bounce" />
              ) : (
                <TrendingDown className="w-4 h-4 animate-bounce" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono font-bold text-app-fg">{recentPayout.asset}</span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-mono font-semibold bg-facto-green/15 text-facto-green border border-facto-green/30">
                  +1.90x
                </span>
              </div>
              <div className="text-[12px] font-bold font-mono text-facto-green flex items-center gap-1">
                <span>+${recentPayout.amount.toFixed(2)} USDG</span>
                <span className="text-[10px] font-normal text-app-fg-dim">({recentPayout.time})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Floating Overlay Card: Top Right (Oracle Consensus Badge) */}
      <div 
        className="absolute top-6 right-0 sm:-right-2 z-20 animate-float-slow"
        style={{ animationDelay: '2.5s' }}
      >
        <div className="bg-app-card/85 dark:bg-app-card/90 backdrop-blur-xl border border-app-border rounded-2xl p-3 sm:p-3.5 shadow-xl shadow-black/5 hover:border-facto-pink/40 transition-all">
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-facto-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-facto-green" />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-app-fg-muted font-bold">
              ORACLE SETTLEMENT
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-xs font-mono">
            <span className="text-app-fg font-semibold">Latency: 38ms</span>
            <span className="text-facto-pink font-semibold">ERC-4663</span>
          </div>
        </div>
      </div>

      {/* 5. Floating Overlay Card: Bottom (Live Real-Time Micro-Option Wave Box) */}
      <div className="absolute bottom-2 inset-x-2 sm:inset-x-8 z-20 animate-hero-fade">
        <div className="bg-app-card/90 dark:bg-app-card/95 backdrop-blur-xl border border-app-border rounded-2xl p-3.5 sm:p-4 shadow-2xl shadow-black/10 hover:border-app-fg/20 transition-all">
          
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-app-border-subtle">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-facto-pink animate-pulse" />
              <span className="text-xs font-mono font-bold text-app-fg tracking-wide">
                BTC / USDG • 5s Option Strike
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="font-bold text-app-fg">${currentLivePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span className={liveDelta >= 0 ? 'text-facto-green text-[11px] font-semibold' : 'text-facto-red text-[11px] font-semibold'}>
                {liveDelta >= 0 ? '+' : ''}{liveDelta}%
              </span>
            </div>
          </div>

          {/* Interactive Dynamic SVG Price Wave */}
          <div className="relative h-12 w-full flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 300 48" fill="none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="heroWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f243ac" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#ff4ca0" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#00e599" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="heroWaveFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f243ac" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#f243ac" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Fill */}
              <path
                d="M 0 38 Q 40 12, 80 26 T 160 16 T 240 32 T 300 14 L 300 48 L 0 48 Z"
                fill="url(#heroWaveFill)"
              />

              {/* Animated Path */}
              <path
                d="M 0 38 Q 40 12, 80 26 T 160 16 T 240 32 T 300 14"
                stroke="url(#heroWaveGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Live Pulsing Head Dot */}
              <circle cx="300" cy="14" r="4.5" fill="#00e599" className="animate-ping" opacity="0.75" />
              <circle cx="300" cy="14" r="3" fill="#ffffff" stroke="#00e599" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Micro Footer Inside Card */}
          <div className="flex items-center justify-between text-[10px] font-mono text-app-fg-dim pt-2 border-t border-app-border-subtle">
            <div className="flex items-center gap-1.5 text-facto-green font-semibold">
              <Zap className="w-3 h-3" />
              <span>100% On-Chain Vault Solvency</span>
            </div>
            <div className="flex items-center gap-1 text-app-fg-muted">
              <ShieldCheck className="w-3 h-3 text-facto-pink" />
              <span>Verifiable Proofs</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
