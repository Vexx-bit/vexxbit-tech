import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Canvas3DProps {
  onPulseReady?: (triggerPulse: () => void) => void;
}

export const Canvas3D: React.FC<Canvas3DProps> = ({ onPulseReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pulseFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07080b, 0.12);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    containerRef.current.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 4, 20);
    cyanLight.position.set(4, 3, 4);
    scene.add(cyanLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 3, 20);
    emeraldLight.position.set(-4, -2, 2);
    scene.add(emeraldLight);

    const coreLight = new THREE.PointLight(0x00f2fe, 2, 8);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 3. Central Quantum Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner Crystalline Polyhedron
    const innerGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x050811,
      emissive: 0x004759,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    // Outer Wireframe Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.05, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const outerCage = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(outerCage);

    // Concentric Gyro Rings
    const rings: THREE.Mesh[] = [];
    const ringConfigs = [
      { radius: 1.45, tube: 0.015, color: 0x00f2fe, opacity: 0.7, rotAxis: 'x' },
      { radius: 1.85, tube: 0.012, color: 0x10b981, opacity: 0.6, rotAxis: 'y' },
      { radius: 2.25, tube: 0.01, color: 0x38bdf8, opacity: 0.5, rotAxis: 'z' },
    ];

    ringConfigs.forEach((cfg) => {
      const ringGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        wireframe: false,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      rings.push(ringMesh);
      coreGroup.add(ringMesh);
    });

    // Orbiting Satellite Nodes
    const satelliteCount = 6;
    const satellites: THREE.Mesh[] = [];
    for (let i = 0; i < satelliteCount; i++) {
      const satGeo = new THREE.SphereGeometry(0.04, 16, 16);
      const satMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00f2fe : 0x10b981,
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      satellites.push(sat);
      coreGroup.add(sat);
    }

    // 4. Background Synaptic Particle Constellation
    const particleCount = 750;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePos[i3] = (Math.random() - 0.5) * 25;
      particlePos[i3 + 1] = (Math.random() - 0.5) * 25;
      particlePos[i3 + 2] = (Math.random() - 0.5) * 20 - 2;
      particleScales[i] = Math.random();
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // 5. Mouse Interaction & Parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 6. Pulse Burst Shockwave Function
    let pulseScale = 1.0;
    let pulseTarget = 1.0;
    const triggerPulse = () => {
      pulseTarget = 1.45;
      cageMat.opacity = 0.9;
      innerMat.emissiveIntensity = 1.5;
      coreLight.intensity = 6;

      gsap.to(innerCore.scale, {
        x: 1.25,
        y: 1.25,
        z: 1.25,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });

      gsap.to(coreLight, {
        intensity: 2,
        duration: 1.2,
        ease: 'power2.out',
      });

      gsap.to(cageMat, {
        opacity: 0.35,
        duration: 0.8,
      });

      gsap.to(innerMat, {
        emissiveIntensity: 0.6,
        duration: 0.8,
      });
    };

    pulseFnRef.current = triggerPulse;
    if (onPulseReady) {
      onPulseReady(triggerPulse);
    }

    // 7. GSAP ScrollTrigger Choreography
    const ctx = gsap.context(() => {
      // Timeline pinned across sections
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#app-root',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });

      // Section 1: Move core to the right to feature the WhatsApp Study Agent
      tl.to(coreGroup.position, {
        x: 2.4,
        y: 0.2,
        z: -0.5,
        ease: 'power1.inOut',
      }, 0.2);

      tl.to(coreGroup.rotation, {
        x: 0.6,
        y: Math.PI * 1.2,
        ease: 'none',
      }, 0.2);

      // Section 2: Shift to left for Architecture specs
      tl.to(coreGroup.position, {
        x: -2.3,
        y: -0.3,
        z: -0.8,
        ease: 'power1.inOut',
      }, 0.5);

      tl.to(coreGroup.rotation, {
        x: -0.4,
        y: Math.PI * 2.2,
        ease: 'none',
      }, 0.5);

      // Section 3: Float higher in background over Terminal
      tl.to(coreGroup.position, {
        x: 0,
        y: 1.6,
        z: -3.2,
        ease: 'power1.inOut',
      }, 0.8);

      tl.to(coreGroup.scale, {
        x: 0.8,
        y: 0.8,
        z: 0.8,
        ease: 'power1.inOut',
      }, 0.8);
    });

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Base idle rotations
      innerCore.rotation.x = elapsedTime * 0.35 + mouse.y * 0.4;
      innerCore.rotation.y = elapsedTime * 0.45 + mouse.x * 0.4;

      outerCage.rotation.x = -elapsedTime * 0.25;
      outerCage.rotation.y = -elapsedTime * 0.3;

      // Concentric rings counter-rotation
      if (rings[0]) {
        rings[0].rotation.x = elapsedTime * 0.5 + mouse.y * 0.2;
        rings[0].rotation.y = elapsedTime * 0.2;
      }
      if (rings[1]) {
        rings[1].rotation.y = -elapsedTime * 0.4 + mouse.x * 0.2;
        rings[1].rotation.z = elapsedTime * 0.3;
      }
      if (rings[2]) {
        rings[2].rotation.z = elapsedTime * 0.45;
        rings[2].rotation.x = -elapsedTime * 0.25;
      }

      // Orbiting satellites
      satellites.forEach((sat, i) => {
        const angle = elapsedTime * (0.8 + i * 0.15) + (i * Math.PI * 2) / satelliteCount;
        const radius = 1.9 + Math.sin(elapsedTime * 2 + i) * 0.15;
        sat.position.x = Math.cos(angle) * radius;
        sat.position.y = Math.sin(angle * 1.2) * 0.6;
        sat.position.z = Math.sin(angle) * radius;
      });

      // Slowly drift background particle field
      particleField.rotation.y = elapsedTime * 0.02;
      particleField.rotation.x = Math.sin(elapsedTime * 0.05) * 0.05;

      // Pulse decay
      pulseScale += (pulseTarget - pulseScale) * 0.1;
      if (pulseTarget > 1.0) pulseTarget -= 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      ctx.revert();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [onPulseReady]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
