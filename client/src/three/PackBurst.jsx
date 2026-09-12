import { useEffect, useRef } from 'react';

const SHAKE_MS = 950;
const BURST_MS = 750;
const FADE_MS = 220;

function buildPackTexture(THREE, title) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 640;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 512, 640);
  grad.addColorStop(0, '#0d2930');
  grad.addColorStop(0.5, '#123a3f');
  grad.addColorStop(1, '#0b1c21');
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 640);
  g.strokeStyle = 'rgba(125,255,226,.7)';
  g.lineWidth = 10;
  g.strokeRect(18, 18, 476, 604);
  g.strokeStyle = 'rgba(255,215,0,.85)';
  g.lineWidth = 3;
  g.strokeRect(36, 36, 440, 568);
  const cx = 256;
  g.fillStyle = '#ffd700';
  g.beginPath();
  for (let k = 0; k < 8; k++) {
    const a = -Math.PI / 2 + (k * Math.PI * 2) / 8;
    const r = k % 2 ? 34 : 58;
    const x = cx + Math.cos(a) * r;
    const y = 210 + Math.sin(a) * r;
    k ? g.lineTo(x, y) : g.moveTo(x, y);
  }
  g.closePath();
  g.fill();
  g.strokeStyle = '#0b1c21';
  g.lineWidth = 6;
  g.stroke();
  g.textAlign = 'center';
  g.fillStyle = '#eaf7f5';
  g.font = '900 46px "Barlow Condensed", sans-serif';
  g.fillText(title, cx, 310);
  g.font = '700 24px "Saira Condensed", sans-serif';
  g.fillStyle = 'rgba(125,255,226,.85)';
  g.fillText('FOOTBALLER-PREDICTOR', cx, 356);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function PackBurst({ title = 'PREMIUM PACK', onDone }) {
  const holderRef = useRef(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return undefined;
    let THREE;
    let renderer;
    let scene;
    let camera;
    let raf = 0;
    let disposed = false;
    let animObjs = [];

    const finish = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      onDone && onDone();
    };

    const disposeAll = () => {
      if (renderer) {
        if (scene) {
          scene.traverse(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
              const ms = Array.isArray(obj.material) ? obj.material : [obj.material];
              ms.forEach(m => {
                if (m.map) m.map.dispose();
                m.dispose();
              });
            }
          });
        }
        renderer.dispose();
        if (renderer.domElement.parentNode === holder) holder.removeChild(renderer.domElement);
      }
    };

    function boot() {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: true
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      holder.appendChild(renderer.domElement);
      const cv = renderer.domElement;
      cv.style.position = 'absolute';
      cv.style.inset = '0';
      cv.style.width = '100%';
      cv.style.height = '100%';

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);

      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const gold = new THREE.PointLight(0xffd700, 60, 20);
      gold.position.set(3, 4, 5);
      scene.add(gold);
      const cyan = new THREE.PointLight(0x00fff2, 40, 18);
      cyan.position.set(-4, -2, 4);
      scene.add(cyan);

      const packMat = new THREE.MeshStandardMaterial({ map: buildPackTexture(THREE, title), roughness: 0.45, metalness: 0.15 });
      const pack = new THREE.Mesh(new THREE.BoxGeometry(2, 2.6, 0.9), packMat);
      animObjs.push(pack);
      scene.add(pack);

      const goldMat = new THREE.LineBasicMaterial({ color: 0xffd700 });
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2.6, 0.9)), goldMat);
      animObjs.push(edge);
      edge.renderOrder = 1;
      scene.add(edge);

      const burstRoot = new THREE.Group();
      scene.add(burstRoot);

      const shardGeo = new THREE.BoxGeometry(0.34, 0.2, 0.12);
      const shardColors = [0xffd700, 0x123a3f, 0x2a5c5f, 0x00fff2, 0xeaf7f5];
      const shards = [];
      for (let i = 0; i < 26; i++) {
        const mat = new THREE.MeshStandardMaterial({ color: shardColors[i % shardColors.length], roughness: 0.5 });
        const m = new THREE.Mesh(shardGeo, mat);
        m.userData = {
          v: new THREE.Vector3((Math.random() - 0.5) * 9, (Math.random() - 0.5) * 9, (Math.random() - 0.5) * 6),
          rv: new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10)
        };
        m.visible = false;
        burstRoot.add(m);
        shards.push(m);
        animObjs.push(m);
      }

      const coinGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.045, 12);
      const coinMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3, metalness: 0.6 });
      const coins = [];
      for (let i = 0; i < 18; i++) {
        const m = new THREE.Mesh(coinGeo, coinMat);
        m.userData = {
          v: new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8 + 2.5, (Math.random() - 0.5) * 6),
          rv: new THREE.Vector3(Math.random() * 12, Math.random() * 12, Math.random() * 12)
        };
        m.visible = false;
        burstRoot.add(m);
        coins.push(m);
        animObjs.push(m);
      }

      const sparkCount = 150;
      const sparkPos = new Float32Array(sparkCount * 3);
      const sparkVel = [];
      for (let i = 0; i < sparkCount; i++) {
        const dir = new THREE.Vector3((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)).normalize();
        const sp = 3 + Math.random() * 6;
        sparkPos[i * 3] = dir.x * 0.4;
        sparkPos[i * 3 + 1] = dir.y * 0.4;
        sparkPos[i * 3 + 2] = dir.z * 0.4;
        sparkVel.push(dir.multiplyScalar(sp));
      }
      const sparkGeo = new THREE.BufferGeometry();
      sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
      const sparkMat = new THREE.PointsMaterial({ color: 0xffe28a, size: 0.07, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
      const sparks = new THREE.Points(sparkGeo, sparkMat);
      sparks.visible = false;
      burstRoot.add(sparks);
      animObjs.push(sparks);

      const flash = new THREE.Mesh(
        new THREE.SphereGeometry(3.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xfff6d5, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      flash.visible = false;
      burstRoot.add(flash);
      animObjs.push(flash);

      const resize = () => {
        const w = holder.clientWidth || window.innerWidth;
        const h = holder.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', resize);
      resize();

      let start = null;
      let burstAt = null;
      let doneTimer = null;

      const frame = time => {
        raf = requestAnimationFrame(frame);
        if (disposed) return;
        if (start === null) start = time;
        let t = time - start;

        const shakeDur = SHAKE_MS;
        if (t < shakeDur) {
          const p = t / shakeDur;
          pack.visible = true;
          edge.visible = true;
          pack.rotation.z = Math.sin(t * 0.045) * 0.09 * p;
          pack.rotation.x = Math.sin(t * 0.021) * 0.06 * p + 0.08;
          const s = 1 + Math.sin(t * 0.03) * 0.02;
          pack.scale.set(s, s, s);
          pack.position.y = Math.abs(Math.sin(t * 0.028)) * 0.25;
          camera.position.x = Math.sin(t * 0.05) * 0.05;
          camera.position.y = Math.cos(t * 0.04) * 0.04;
        } else if (burstAt === null) {
          burstAt = time;
          pack.visible = false;
          edge.visible = false;
          shards.forEach(m => { m.visible = true; });
          coins.forEach(m => { m.visible = true; });
          sparks.visible = true;
          flash.visible = true;
        }

        const bt = burstAt !== null ? time - burstAt : 0;
        if (burstAt !== null) {
          const p = Math.min(1, bt / BURST_MS);
          shards.forEach(m => {
            m.position.addScaledVector(m.userData.v, 0.016);
            m.userData.v.y -= 0.02;
            m.rotation.x += m.userData.rv.x * 0.016;
            m.rotation.y += m.userData.rv.y * 0.016;
            m.rotation.z += m.userData.rv.z * 0.016;
          });
          coins.forEach(m => {
            m.position.addScaledVector(m.userData.v, 0.016);
            m.userData.v.y -= 0.045;
            m.rotation.x += m.userData.rv.x * 0.016;
            m.rotation.z += m.userData.rv.z * 0.016;
          });
          const sparkAttr = sparks.geometry.attributes.position;
          const arr = sparkAttr.array;
          for (let i = 0; i < sparkCount; i++) {
            arr[i * 3] += sparkVel[i].x * 0.016;
            arr[i * 3 + 1] += sparkVel[i].y * 0.016;
            arr[i * 3 + 2] += sparkVel[i].z * 0.016;
          }
          sparkAttr.needsUpdate = true;
          sparkMat.opacity = Math.max(0, 0.9 * (1 - p));
          flash.material.opacity = Math.sin(Math.min(1, p * 1.7) * Math.PI) * 0.85;
          flash.scale.setScalar(1 + p * 2.3);
          gold.intensity = 60 + Math.sin(Math.min(1, p * 1.6) * Math.PI) * 240;
          cyan.intensity = 40 + Math.sin(Math.min(1, p * 1.6) * Math.PI) * 160;
          camera.position.x = Math.sin(bt * 0.008) * 0.08;
          camera.position.y = Math.cos(bt * 0.006) * 0.06;
          if (bt >= BURST_MS && !doneTimer) {
            doneTimer = setTimeout(() => {
              holder.classList.add('pack-cine-out');
              setTimeout(finish, FADE_MS);
            }, 120);
          }
          if (bt >= BURST_MS * 1.4) {
            camera.position.z = 8 + (bt - BURST_MS * 1.4) * 0.012;
            camera.position.y += 0.02;
            camera.lookAt(0, -0.4, 0);
          }
        }

        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(frame);

      return () => {
        window.removeEventListener('resize', resize);
        if (doneTimer) clearTimeout(doneTimer);
      };
    }

    (async () => {
      try {
        THREE = await import('three');
        if (disposed) return;
        boot();
      } catch {
        finish();
      }
    })();

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      const t = setTimeout(finish, 60);
      return () => clearTimeout(t);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      disposeAll();
    };
  }, [onDone, title]);

  return <div ref={holderRef} className="pack-cine" aria-hidden="true" />;
}