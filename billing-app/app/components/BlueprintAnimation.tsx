"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import * as THREE from "three";

// ── Material factories ────────────────────────────────────────────────────────

const orangeMat = () =>
  new THREE.LineBasicMaterial({ color: 0xff8c40, transparent: true, opacity: 0 });

// ── Geometry helpers ──────────────────────────────────────────────────────────

function edgeBox(w: number, h: number, d: number) {
  return new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)),
    orangeMat()
  );
}

function addBox(g: THREE.Group, w: number, h: number, d: number, x: number, y: number, z: number) {
  const m = edgeBox(w, h, d);
  m.position.set(x, y + h / 2, z);
  g.add(m);
}

function rawLines(pts: number[]): THREE.LineSegments {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return new THREE.LineSegments(geo, orangeMat());
}

function faceWindows(
  faceW: number, faceH: number, baseY: number,
  cols: number, rows: number, winW: number, winH: number,
  axis: "x" | "z", axisVal: number, center = 0
): number[] {
  const pts: number[] = [];
  const cs = faceW / cols, rs = faceH / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const u = center - faceW / 2 + (c + 0.5) * cs;
      const yB = baseY + (r + 0.15) * rs;
      const yT = yB + winH;
      const uL = u - winW / 2, uR = u + winW / 2;
      if (axis === "z") {
        pts.push(
          uL, yB, axisVal, uR, yB, axisVal,
          uR, yB, axisVal, uR, yT, axisVal,
          uR, yT, axisVal, uL, yT, axisVal,
          uL, yT, axisVal, uL, yB, axisVal,
        );
      } else {
        pts.push(
          axisVal, yB, uL, axisVal, yB, uR,
          axisVal, yB, uR, axisVal, yT, uR,
          axisVal, yT, uR, axisVal, yT, uL,
          axisVal, yT, uL, axisVal, yB, uL,
        );
      }
    }
  }
  return pts;
}

function addWindows(g: THREE.Group, ...args: Parameters<typeof faceWindows>) {
  g.add(rawLines(faceWindows(...args)));
}

// ── Complex skyscraper ────────────────────────────────────────────────────────

function createBuilding(): THREE.Group {
  const g = new THREE.Group();

  // ─ Podium (y 0–0.4) ─────────────────────────────────────────────────────
  addBox(g, 2.0, 0.4, 1.4, 0, 0, 0);
  addBox(g, 2.0, 0.03, 1.4, 0, 0.14, 0);
  addBox(g, 2.0, 0.03, 1.4, 0, 0.27, 0);

  // Entrance arch (front face z=0.7)
  g.add(rawLines([
    -0.22, 0, 0.701,  0.22, 0, 0.701,
    -0.22, 0, 0.701, -0.22, 0.28, 0.701,
     0.22, 0, 0.701,  0.22, 0.28, 0.701,
    -0.22, 0.28, 0.701, -0.1, 0.38, 0.701,
    -0.1,  0.38, 0.701,  0.1, 0.38, 0.701,
     0.1,  0.38, 0.701,  0.22, 0.28, 0.701,
     0,    0, 0.701,   0,   0.38, 0.701,
    -0.22, 0.28, 0.701, 0.22, 0.28, 0.701,
  ]));

  // Pilasters on podium front
  for (const sx of [-0.9, -0.3, 0.3, 0.9]) {
    g.add(rawLines([sx, 0, 0.701, sx, 0.4, 0.701]));
  }

  // ─ Mid setback (y 0.4–1.2) ──────────────────────────────────────────────
  addBox(g, 1.4, 0.8, 1.0, 0, 0.4, 0);
  addBox(g, 1.5, 0.04, 1.1, 0, 0.4, 0);   // transition ledge
  addBox(g, 1.45, 0.03, 1.05, 0, 0.42, 0);

  addWindows(g, 1.25, 0.78, 0.4, 5, 4, 0.14, 0.12, "z",  0.501);
  addWindows(g, 1.25, 0.78, 0.4, 5, 4, 0.14, 0.12, "z", -0.501);
  addWindows(g, 0.85, 0.78, 0.4, 3, 4, 0.14, 0.12, "x",  0.701);
  addWindows(g, 0.85, 0.78, 0.4, 3, 4, 0.14, 0.12, "x", -0.701);

  // ─ Primary tower (y 1.2–3.0) ────────────────────────────────────────────
  addBox(g, 0.9, 1.8, 0.7, 0, 1.2, 0);
  addBox(g, 1.0, 0.05, 0.78, 0, 1.2, 0);
  addBox(g, 0.95, 0.04, 0.74, 0, 1.23, 0);

  // Structural corner lines
  for (const [sx, sz] of [[-0.45,-0.35],[-0.45,0.35],[0.45,-0.35],[0.45,0.35]] as [number,number][]) {
    g.add(rawLines([sx, 1.2, sz, sx, 3.0, sz]));
  }

  // Mechanical bands
  for (const y of [1.65, 2.1, 2.55]) addBox(g, 0.9, 0.04, 0.7, 0, y, 0);

  addWindows(g, 0.82, 1.78, 1.2, 4, 10, 0.11, 0.12, "z",  0.351);
  addWindows(g, 0.82, 1.78, 1.2, 4, 10, 0.11, 0.12, "z", -0.351);
  addWindows(g, 0.62, 1.78, 1.2, 2, 10, 0.14, 0.12, "x",  0.451);
  addWindows(g, 0.62, 1.78, 1.2, 2, 10, 0.14, 0.12, "x", -0.451);

  // Art deco crown steps
  addBox(g, 1.0, 0.06, 0.78, 0, 3.0, 0);
  addBox(g, 0.94, 0.04, 0.73, 0, 3.04, 0);
  addBox(g, 0.88, 0.04, 0.68, 0, 3.07, 0);

  // ─ Upper tower (y 3.1–4.5) ──────────────────────────────────────────────
  addBox(g, 0.6, 1.4, 0.5, 0, 3.1, 0);

  for (const [sx, sz] of [[-0.3,-0.25],[-0.3,0.25],[0.3,-0.25],[0.3,0.25]] as [number,number][]) {
    g.add(rawLines([sx, 3.1, sz, sx, 4.5, sz]));
  }

  for (const y of [3.5, 3.9, 4.3]) addBox(g, 0.6, 0.035, 0.5, 0, y, 0);

  addWindows(g, 0.52, 1.38, 3.1, 3, 8, 0.1, 0.12, "z",  0.251);
  addWindows(g, 0.52, 1.38, 3.1, 3, 8, 0.1, 0.12, "z", -0.251);
  addWindows(g, 0.42, 1.38, 3.1, 2, 8, 0.12, 0.12, "x",  0.301);
  addWindows(g, 0.42, 1.38, 3.1, 2, 8, 0.12, 0.12, "x", -0.301);

  addBox(g, 0.7, 0.06, 0.58, 0, 4.5, 0);
  addBox(g, 0.65, 0.04, 0.54, 0, 4.54, 0);
  addBox(g, 0.6, 0.04, 0.5, 0, 4.57, 0);

  // ─ Pinnacle (y 4.6–5.08) ────────────────────────────────────────────────
  addBox(g, 0.32, 0.48, 0.26, 0, 4.6, 0);
  addBox(g, 0.42, 0.05, 0.34, 0, 4.6, 0);
  addBox(g, 0.38, 0.04, 0.3, 0, 4.63, 0);

  addWindows(g, 0.24, 0.46, 4.6, 2, 4, 0.07, 0.08, "z",  0.131);
  addWindows(g, 0.24, 0.46, 4.6, 2, 4, 0.07, 0.08, "z", -0.131);

  addBox(g, 0.38, 0.05, 0.31, 0, 5.08, 0);
  addBox(g, 0.33, 0.04, 0.27, 0, 5.11, 0);

  // ─ Spire ────────────────────────────────────────────────────────────────
  g.add(rawLines([
    0, 5.13, 0,    0, 5.95, 0,
    -0.05, 5.15, 0,  0.05, 5.15, 0,
     0, 5.15, -0.05,  0, 5.15, 0.05,
    -0.025, 5.55, 0,  0.025, 5.55, 0,
     0, 5.55, -0.025,  0, 5.55, 0.025,
  ]));

  return g;
}

// ── Spiral construction path ──────────────────────────────────────────────────

function buildSpiralPath(): Float32Array {
  const pts: number[] = [];
  const totalH = 5.95;
  const levels = 80;
  const spl = 100;

  function profile(t: number): [number, number] {
    if (t < 0.07) return [1.0, 0.7];
    if (t < 0.22) return [0.7, 0.5];
    if (t < 0.53) return [0.45, 0.35];
    if (t < 0.77) return [0.3, 0.25];
    if (t < 0.87) return [0.16, 0.13];
    return [0.03, 0.03];
  }

  for (let lvl = 0; lvl <= levels; lvl++) {
    const t = lvl / levels;
    const y = t * totalH;
    const swirl = Math.pow(Math.max(0, 1 - t * 1.4), 1.6);
    const [bw, bd] = profile(t);

    for (let s = 0; s <= spl; s++) {
      const a = (s / spl) * Math.PI * 2;
      const cosA = Math.cos(a), sinA = Math.sin(a);
      const rScale = 1 / (Math.max(Math.abs(cosA) / bw, Math.abs(sinA) / bd) + 1e-9);
      const rx = cosA * rScale, rz = sinA * rScale;
      const r = Math.max(bw, bd) * (1.8 + swirl * 2);
      pts.push(
        Math.cos(a) * r * swirl + rx * (1 - swirl),
        y,
        Math.sin(a) * r * swirl + rz * (1 - swirl),
      );
    }
  }
  return new Float32Array(pts);
}

// ── Opacity helpers ───────────────────────────────────────────────────────────

function setGroupOpacity(group: THREE.Group, opacity: number) {
  group.traverse((obj) => {
    const ls = obj as THREE.LineSegments;
    if (ls.isLineSegments) {
      (ls.material as THREE.LineBasicMaterial).opacity = opacity;
    }
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BlueprintAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const interactiveRef = useRef(false);
  const [hintVisible, setHintVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const cvs = canvas; // non-null alias for closures

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x060e1e, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(3.5, 2.5, 5);
    camera.lookAt(0, 2.5, 0);

    // ── Grid floor ────────────────────────────────────────────────────────────
    const gridPts: number[] = [];
    const gs = 3.5, gd = 14, st = (gs * 2) / gd;
    for (let i = 0; i <= gd; i++) {
      const v = -gs + i * st;
      gridPts.push(-gs, 0, v, gs, 0, v, v, 0, -gs, v, 0, gs);
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(gridPts, 3));
    scene.add(new THREE.LineSegments(gridGeo,
      new THREE.LineBasicMaterial({ color: 0x1a3a6e, transparent: true, opacity: 0.35 })
    ));

    // ── Spiral ────────────────────────────────────────────────────────────────
    const spiralData = buildSpiralPath();
    const spiralGeo = new THREE.BufferGeometry();
    spiralGeo.setAttribute("position", new THREE.BufferAttribute(spiralData, 3));
    spiralGeo.setDrawRange(0, 0);
    const spiralMat = new THREE.LineBasicMaterial({ color: 0x4a9eff, transparent: true, opacity: 0.85 });
    const spiral = new THREE.Line(spiralGeo, spiralMat);
    scene.add(spiral);

    // ── Building ──────────────────────────────────────────────────────────────
    const building = createBuilding();
    scene.add(building);

    // ── Resize ────────────────────────────────────────────────────────────────
    function resize() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ── Interaction ───────────────────────────────────────────────────────────
    const rot = { y: 0, x: 0.15 };
    let dragging = false, lastX = 0, lastY = 0, autoRotate = true;

    function onPointerDown(e: PointerEvent) {
      if (!interactiveRef.current) return;
      dragging = true;
      lastX = e.clientX; lastY = e.clientY;
      autoRotate = false;
      cvs.style.cursor = "grabbing";
      cvs.setPointerCapture(e.pointerId);
    }
    function onPointerMove(e: PointerEvent) {
      if (!dragging) return;
      rot.y += (e.clientX - lastX) * 0.01;
      rot.x = Math.max(-0.5, Math.min(0.7, rot.x + (e.clientY - lastY) * 0.008));
      lastX = e.clientX; lastY = e.clientY;
    }
    function onPointerUp() {
      dragging = false;
      if (interactiveRef.current) cvs.style.cursor = "grab";
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerUp);

    // ── Render loop ───────────────────────────────────────────────────────────
    let rafId: number;
    function animate() {
      rafId = requestAnimationFrame(animate);
      if (autoRotate) rot.y += 0.004;
      scene.rotation.y = rot.y;
      scene.rotation.x = rot.x;
      renderer.render(scene, camera);
    }
    animate();

    // ── Construction animation ────────────────────────────────────────────────
    const totalV = spiralData.length / 3;
    const proxy = { count: 0, fade: 0 };

    const tl = gsap.timeline({ delay: 0.4 });

    tl.to(proxy, {
      count: totalV, duration: 3.5, ease: "none",
      onUpdate() { spiralGeo.setDrawRange(0, Math.round(proxy.count)); },
    });

    tl.to(proxy, {
      fade: 1, duration: 1.2, ease: "power2.inOut",
      onUpdate() {
        spiralMat.opacity = 0.85 * (1 - proxy.fade);
        setGroupOpacity(building, proxy.fade);
      },
    });

    tl.call(() => {
      interactiveRef.current = true;
      cvs.style.cursor = "grab";
      setHintVisible(true);
      setTimeout(() => setHintVisible(false), 2500);
    });

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
      tl.kill();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-mono tracking-widest text-blue-300/60 pointer-events-none transition-opacity duration-700"
        style={{ opacity: hintVisible ? 1 : 0 }}
      >
        drag to rotate
      </div>
    </div>
  );
}