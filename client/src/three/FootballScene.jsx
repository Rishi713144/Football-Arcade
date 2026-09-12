import { useEffect, useRef } from 'react';

function buildBallTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const g = c.getContext('2d');
  const W = c.width;
  const H = c.height;
  g.fillStyle = '#f4f6fb';
  g.fillRect(0, 0, W, H);
  g.strokeStyle = '#101418';
  g.lineWidth = 5;
  g.fillStyle = '#101418';
  const cols = 6;
  const rows = 3;
  const pw = W / cols;
  const ph = H / (rows + 0.5);
  for (let r = 0; r < rows; r++) {
    const ry = r * ph;
    for (let col = 0; col < cols + 1; col++) {
      const cx = (col - 0.5) * pw + (r % 2 ? pw / 2 : 0);
      const pent = (r + col) % 3 === 0;
      if (!pent) continue;
      if (cx < -40 || cx > W + 40 || ry < -40 || ry > H + 40) continue;
      g.beginPath();
      const s = 15;
      for (let k = 0; k < 5; k++) {
        const a = -Math.PI / 2 + (k * Math.PI * 2) / 5;
        const x = cx + Math.cos(a) * s;
        const y = ry + Math.sin(a) * s;
        k ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.fill();
      g.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

export default function FootballScene({ density = 'full' }) {
  const holderRef = useRef(null);

  useEffect(() => {
    let renderer;
    let raf = 0;
    let disposed = false;
    const holder = holderRef.current;
    if (!holder) return undefined;

    let THREE;
    let scene;
    let camera;
    let ball;
    let ballWrap;
    let rings = [];
    let points;
    let keyLight;
    let rimLight;
    let running = true;

    const pointer = { x: 0, y: 0 };

    function onPointer(e) {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    }

    function setup() {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: true
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      holder.appendChild(renderer.domElement);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.inset = '0';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.pointerEvents = 'none';

      scene = new THREE.Scene();
      const fov = 45;
      camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 50);
      camera.position.set(0, 0.2, 6.2);
      camera.lookAt(0, 0, 0);

      scene.add(new THREE.AmbientLight(0xffffff, 0.35));
      keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
      keyLight.position.set(3, 4, 4);
      scene.add(keyLight);
      rimLight = new THREE.PointLight(0x00fff2, 26, 40);
      rimLight.position.set(-3, 0, 2.5);
      scene.add(rimLight);
      const peach = new THREE.PointLight(0xffd27d, 18, 34);
      peach.position.set(2.6, -2.2, 2);
      scene.add(peach);

      const ballTex = buildBallTexture(THREE);
      const ballMat = new THREE.MeshStandardMaterial({ map: ballTex, roughness: 0.32, metalness: 0.05 });
      ball = new THREE.Mesh(new THREE.SphereGeometry(1.32, 40, 40), ballMat);
      ball.r = 0;
      ballWrap = new THREE.Group();
      ballWrap.add(ball);
      ballWrap.position.set(0, 0.4, 0);
      scene.add(ballWrap);

      const ringMatA = new THREE.MeshBasicMaterial({ color: 0x00fff2, transparent: true, opacity: 0.55 });
      const ringMatB = new THREE.MeshBasicMaterial({ color: 0xffd27d, transparent: true, opacity: 0.35 });
      const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.02, 10, 80), ringMatA);
      ringA.rotation.x = Math.PI / 2;
      const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.015, 10, 80), ringMatB);
      ringB.rotation.x = Math.PI / 2 - 0.55;
      ringB.rotation.y = 0.5;
      const ringC = new THREE.Mesh(new THREE.TorusGeometry(3.05, 0.012, 10, 80), ringMatA.clone());
      ringC.material.opacity = 0.2;
      ringC.rotation.x = Math.PI / 2 + 0.4;
      ringC.rotation.z = 0.6;
      rings = [ringA, ringB, ringC];
      rings.forEach(r => scene.add(r));

      const COUNT = density === 'min' ? 40 : 110;
      const pos = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        const r = 2.6 + Math.random() * 3.4;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
        pos[i * 3 + 2] = r * Math.cos(ph) * 0.4;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: 0x7bffd9,
        size: 0.045,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      points = new THREE.Points(geo, mat);
      scene.add(points);

      window.addEventListener('pointermove', onPointer, { passive: true });
      resize();
      running = !document.hidden && !reduceMotion;
      startLoop();
    }

    const nowMs = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

    function resize() {
      if (!renderer || !holder) return;
      const w = holder.clientWidth || window.innerWidth;
      const h = holder.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    function startLoop() {
      let last = nowMs();
      const step = time => {
        raf = requestAnimationFrame(step);
        if (!running || disposed) return;
        const dt = Math.min(0.05, (time - last) / 1000 || 0.016);
        last = time;
        const t = time / 1000;

        ball.rotation.y += dt * 0.34;
        ball.rotation.x += dt * 0.08;
        ballWrap.position.y = 0.4 + Math.sin(t * 0.9) * 0.07;

        rings.forEach((r, i) => {
          r.rotation.z += dt * (i === 1 ? 0.22 : 0.14);
        });
        ringB.rotation.y += dt * -0.3;

        if (points) {
          points.rotation.y += dt * 0.06;
          points.rotation.x += dt * 0.02;
          points.material.opacity = 0.45 + Math.sin(t * 2.1) * 0.18;
        }
        if (rimLight) rimLight.position.x = -3 + Math.sin(t * 0.5) * 1.2;
        if (keyLight) keyLight.position.x = 3 + Math.sin(t * 0.7 + 1) * 1;

        const tx = pointer.x * 0.45;
        const ty = -pointer.y * 0.3;
        camera.position.x += (tx - camera.position.x) * 0.05;
        camera.position.y += (ty - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(step);
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const runVisibility = () => {
      running = reduceMotion ? false : !document.hidden;
    };
    const io = new IntersectionObserver(([entry]) => {
      if (disposed) return;
      running = reduceMotion ? false : entry.isIntersecting && !document.hidden;
    });
    io.observe(holder);
    document.addEventListener('visibilitychange', runVisibility);

    let sizer = null;
    if (typeof ResizeObserver !== 'undefined') {
      sizer = new ResizeObserver(resize);
      sizer.observe(holder);
    }
    window.addEventListener('resize', resize);

    (async () => {
      try {
        THREE = await import('three');
        if (disposed) return;
        setup();
      } catch {
        if (holder) holder.innerHTML = '';
      }
    })();

    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', runVisibility);
      if (io) io.disconnect();
      if (sizer) sizer.disconnect();
      if (renderer) {
        if (scene) {
          scene.traverse(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
              const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
              mats.forEach(m => {
                if (m.map) m.map.dispose();
                m.dispose();
              });
            }
          });
        }
        renderer.dispose();
      }
      if (holder && renderer && renderer.domElement.parentNode === holder) {
        holder.removeChild(renderer.domElement);
      }
    };
  }, [density]);

  return <div ref={holderRef} className="bg-3d" aria-hidden="true" />;
}