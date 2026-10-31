import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Pulse = () => void;
interface Canvas3DProps { onPulseReady?: (trigger: Pulse | null) => void }
interface Pose { x: number; y: number; z: number; ry: number; scale: number }

// Exact names verified in core.glb; short aliases are accepted for future revisions.
const PIVOTS = {
  nucleus: ['Quantum_Processor', 'Nucleus'],
  crystal: ['Floating_Crystal'],
  x: ['Gimbal_01_Inner_X', 'Gimbal_X'],
  y: ['Gimbal_02_Middle_Y', 'Gimbal_Y'],
  z: ['Gimbal_03_Outer_Z', 'Gimbal_Z'],
  sensors: ['Satellite_Sensors', 'Sensor_Nodes'],
} as const;

function disposeModel(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    const slots = Array.isArray(object.material) ? object.material : [object.material];
    slots.forEach((material: THREE.Material) => {
      materials.add(material);
      Object.values(material).forEach((value: unknown) => {
        if (value instanceof THREE.Texture) textures.add(value);
      });
    });
  });
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
}

export function Canvas3D({ onPulseReady }: Canvas3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;
    let disposed = false;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      host.dataset.coreStatus = 'webgl-unavailable';
      return; // All page content and navigation remain available without WebGL.
    }
    host.dataset.coreStatus = 'loading';
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.transmissionResolutionScale = 0.5;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
    camera.position.set(0, 0, 8.6);
    const choreography = new THREE.Group();
    const responsiveFit = new THREE.Group();
    choreography.add(responsiveFit);
    scene.add(choreography);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    room.dispose();
    pmrem.dispose();
    scene.environment = environment.texture;
    scene.environmentIntensity = 1.4;
    scene.add(new THREE.HemisphereLight(0xc6edff, 0x081525, 1.5));
    const key = new THREE.DirectionalLight(0xecfaff, 4);
    key.position.set(3, 4, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0x00f2fe, 26, 18, 2);
    rim.position.set(-3, 1, 3);
    scene.add(rim);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pose: Pose = { x: 0, y: 0, z: 0, ry: 0, scale: 1 };
    const impulse = { energy: 0, scale: 1 };
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const emissive = new Map<THREE.MeshStandardMaterial, number>();
    const pivots: Partial<Record<keyof typeof PIVOTS, THREE.Object3D>> = {};
    const sensorCenters: { object: THREE.Mesh; center: THREE.Vector3; phase: number }[] = [];
    let model: THREE.Object3D | null = null;
    let master: THREE.Object3D | null = null;
    let timeline: gsap.core.Timeline | null = null;
    let frameId = 0;
    let time = 0;
    let lastTime = 0;
    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;
    let frameCount = 0;
    let fpsStart = 0;
    let contextLost = false;
    const yAxis = new THREE.Vector3(0, 1, 0);
    const orbitPoint = new THREE.Vector3();

    const applyPose = () => {
      choreography.position.set(pose.x, pose.y, pose.z);
      choreography.rotation.y = pose.ry;
      choreography.scale.setScalar(pose.scale);
    };
    const draw = () => {
      applyPose();
      renderer.render(scene, camera);
    };
    const rebuildScroll = () => {
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
      timeline = null;
      Object.assign(pose, { x: 0, y: 0, z: 0, ry: 0, scale: 1 });
      if (reducedMotion.matches) { draw(); return; }
      const stages: { selector: string; pose: Pose }[] = [
        { selector: '#featured-project', pose: { x: 2.4, y: 0.2, z: -0.5, ry: Math.PI / 2, scale: 1 } },
        { selector: '#architecture', pose: { x: -2.3, y: -0.3, z: -0.8, ry: -Math.PI / 3, scale: 1 } },
        { selector: '#terminal', pose: { x: 0, y: 1.6, z: -3.2, ry: 0, scale: 0.8 } },
      ];
      let previous = 0;
      const track = gsap.timeline({ paused: true });
      stages.forEach((stage) => {
        const element = document.querySelector(stage.selector);
        if (!element) return;
        const stop = Math.max(previous + 1, element.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35);
        track.to(pose, { ...stage.pose, duration: stop - previous, ease: 'none' });
        previous = stop;
      });
      timeline = track;
      ScrollTrigger.create({
        trigger: '#app-root', start: 'top top', end: previous,
        animation: track, scrub: 1, invalidateOnRefresh: true,
      });
    };

    const resize = () => {
      const width = host.clientWidth || window.innerWidth;
      const height = host.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 768 ? 1.5 : 2));
      renderer.setSize(width, height);
      // Keep the exact scroll poses separate from responsive model fitting.
      responsiveFit.scale.setScalar(Math.min(1, camera.aspect / 0.9));
      rebuildScroll();
      draw();
    };
    const animate = (now: number) => {
      frameId = 0;
      if (disposed || document.hidden || contextLost) return;
      const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
      lastTime = now;
      if (!reducedMotion.matches) {
        time += delta;
        const damping = 1 - Math.exp(-5 * delta);
        mouse.x += (mouse.targetX - mouse.x) * damping;
        mouse.y += (mouse.targetY - mouse.y) * damping;
        const speed = 1 + impulse.energy * 4;
        angleX += delta * 0.24 * speed;
        angleY -= delta * 0.19 * speed;
        angleZ += delta * 0.1 * speed;
        if (pivots.x) pivots.x.rotation.x = angleX + mouse.y * 0.22;
        if (pivots.y) pivots.y.rotation.y = angleY + mouse.x * 0.22;
        if (pivots.z) pivots.z.rotation.y = angleZ; // Blender Z becomes glTF/Three Y-up.
        if (pivots.crystal) {
          pivots.crystal.position.y = Math.sin(time * 2) * 0.08;
          pivots.crystal.rotation.y += delta * 0.65 * speed;
        }
        if (pivots.nucleus) {
          pivots.nucleus.rotation.y += delta * 0.06 * speed;
          pivots.nucleus.scale.setScalar(impulse.scale);
        }
        if (pivots.sensors) pivots.sensors.rotation.y = time * 0.12;
        sensorCenters.forEach(({ object, center, phase }) => {
          // Vertices have baked world-center pivots. Translate by the CENTER DELTA;
          // replacing object.position with an orbit position would double the radius.
          orbitPoint.copy(center).applyAxisAngle(yAxis, time * 0.025 * Math.sin(phase));
          orbitPoint.multiplyScalar(1 + Math.sin(time * 1.3 + phase) * 0.045);
          object.position.copy(orbitPoint).sub(center);
        });
        if (master) {
          master.rotation.x = mouse.y * 0.08;
          master.rotation.z = -mouse.x * 0.06;
        }
      }
      emissive.forEach((base, material) => { material.emissiveIntensity = base * (1 + impulse.energy * 2); });
      draw();
      frameCount++;
      if (!fpsStart) fpsStart = now;
      if (now - fpsStart >= 2000) {
        host.dataset.coreFps = (frameCount * 1000 / (now - fpsStart)).toFixed(1);
        fpsStart = now; frameCount = 0;
      }
      if (!reducedMotion.matches || impulse.energy > 0.001) frameId = requestAnimationFrame(animate);
    };
    const start = () => {
      lastTime = 0;
      if (!frameId && !disposed && !document.hidden && !contextLost) frameId = requestAnimationFrame(animate);
    };
    const pulse = () => {
      if (!model || disposed) return;
      gsap.killTweensOf(impulse);
      // 3x peak emission, then exponential decay. Reduced-motion users get a
      // short light-only response, with no rotation or scale impulse.
      impulse.energy = 1;
      impulse.scale = reducedMotion.matches ? 1 : 1.16;
      gsap.to(impulse, { energy: 0, scale: 1, duration: reducedMotion.matches ? 0.35 : 1.4, ease: 'expo.out', overwrite: true });
      host.dataset.corePulseCount = String(Number(host.dataset.corePulseCount || 0) + 1);
      start();
    };
    const pointerMove = (event: PointerEvent) => {
      mouse.targetX = event.clientX / window.innerWidth * 2 - 1;
      mouse.targetY = event.clientY / window.innerHeight * 2 - 1;
    };
    const visibilityChange = () => {
      if (document.hidden) { cancelAnimationFrame(frameId); frameId = 0; }
      else start();
    };
    const loseContext = (event: Event) => {
      event.preventDefault(); contextLost = true;
      cancelAnimationFrame(frameId); frameId = 0;
      host.dataset.coreStatus = 'context-lost';
    };
    const restoreContext = () => { contextLost = false; host.dataset.coreStatus = 'ready'; start(); };
    const motionChange = () => { gsap.killTweensOf(impulse); impulse.energy = 0; impulse.scale = 1; resize(); start(); };
    window.addEventListener('pointermove', pointerMove, { passive: true });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibilityChange);
    reducedMotion.addEventListener('change', motionChange);
    renderer.domElement.addEventListener('webglcontextlost', loseContext);
    renderer.domElement.addEventListener('webglcontextrestored', restoreContext);
    resize();
    start();

    const requestStart = performance.now();
    new GLTFLoader().load(`${import.meta.env.BASE_URL}assets/core.glb`, (gltf) => {
      if (disposed) { disposeModel(gltf.scene); return; }
      model = gltf.scene;
      master = model.getObjectByName('Vexxbit_Core') || model;
      try {
        for (const [key, names] of Object.entries(PIVOTS)) {
          const pivot = names.map((name) => model?.getObjectByName(name)).find(Boolean);
          if (!pivot) throw new Error(`Missing core pivot: ${names.join(' / ')}`);
          pivots[key as keyof typeof PIVOTS] = pivot;
        }
        const tuned = new Set<THREE.Material>();
        model.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          const slots: THREE.Material[] = Array.isArray(object.material) ? object.material : [object.material];
          slots.forEach((material) => {
            if (tuned.has(material)) return;
            tuned.add(material);
            if (!(material instanceof THREE.MeshStandardMaterial)) return;
            if (material.name === 'Mat_Obsidian_Hull') {
              material.color.set('#0B0D14'); material.metalness = 0.92; material.roughness = 0.18;
              if (material instanceof THREE.MeshPhysicalMaterial) material.clearcoat = 0.8;
            } else if (material.name === 'Mat_Cyan_Emissive' || material.name === 'Mat_Emerald_Nodes') {
              const cyan = material.name === 'Mat_Cyan_Emissive';
              material.color.set(cyan ? '#00F2FE' : '#10B981');
              material.emissive.copy(material.color);
              material.emissiveIntensity = cyan ? 5 : 3.5;
              emissive.set(material, material.emissiveIntensity);
            } else if (material.name === 'Mat_Quantum_Glass' && material instanceof THREE.MeshPhysicalMaterial) {
              material.transmission = 0.95; material.roughness = 0.05; material.ior = 1.52;
            }
          });
        });
        pivots.sensors?.children.forEach((object, index) => {
          if (!(object instanceof THREE.Mesh)) return;
          object.geometry.computeBoundingBox();
          const center = object.geometry.boundingBox?.getCenter(new THREE.Vector3());
          if (center) sensorCenters.push({ object, center, phase: index * Math.PI / 3 });
        });
        responsiveFit.add(model);
        host.dataset.coreLoadMs = (performance.now() - requestStart).toFixed(1);
        host.dataset.coreStatus = 'ready';
        host.dataset.corePivots = String(Object.keys(pivots).length);
        onPulseReady?.(pulse);
        draw();
        start();
      } catch (error) {
        host.dataset.coreStatus = 'invalid-model';
        console.error('Vexxbit core hierarchy validation failed', error);
        disposeModel(model); model = null;
      }
    }, undefined, (error: unknown) => {
      if (!disposed) { host.dataset.coreStatus = 'load-error'; console.error('Vexxbit core failed to load', error); }
    });

    return () => {
      disposed = true;
      onPulseReady?.(null);
      cancelAnimationFrame(frameId);
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
      gsap.killTweensOf(impulse);
      window.removeEventListener('pointermove', pointerMove);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibilityChange);
      reducedMotion.removeEventListener('change', motionChange);
      renderer.domElement.removeEventListener('webglcontextlost', loseContext);
      renderer.domElement.removeEventListener('webglcontextrestored', restoreContext);
      if (model) disposeModel(model);
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onPulseReady]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true" data-vexxbit-core="true" />;
}
