/* Globo terrestre 3D real (WebGL / three.js r128).
   1 volta completa = 3 segundos, rotação linear e contínua.
   Textura: NASA Blue Marble (via Solar System Scope), Wikimedia Commons. */
(function(){
  const container = document.getElementById('globe-canvas');
  if(!container || typeof THREE === 'undefined') return;

  const ROTATION_SECONDS = 3;
  const RADIANS_PER_MS = (Math.PI * 2) / (ROTATION_SECONDS * 1000);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 3.1;

  const renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  function fitSize(){
    const box = container.parentElement.getBoundingClientRect();
    const size = Math.max(160, Math.min(box.width, box.height || box.width));
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  const loader = new THREE.TextureLoader();
  loader.crossOrigin = 'anonymous';
  const EARTH_TEXTURE_URL = 'https://commons.wikimedia.org/wiki/Special:FilePath/Solarsystemscope_texture_2k_earth_daymap.jpg';

  const isSmall = window.innerWidth < 700;
  const segments = isSmall ? 40 : 64;
  const geometry = new THREE.SphereGeometry(1.35, segments, segments);

  const fallbackMaterial = new THREE.MeshPhongMaterial({ color: 0x0a3d2e, shininess: 8 });
  const globe = new THREE.Mesh(geometry, fallbackMaterial);
  scene.add(globe);

  loader.load(
    EARTH_TEXTURE_URL,
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace || THREE.sRGBEncoding;
      globe.material = new THREE.MeshPhongMaterial({
        map: tex,
        shininess: 6,
        specular: 0x113322
      });
    },
    undefined,
    () => { /* mantém material de fallback sólido — nunca deixa o globo quebrado */ }
  );

  // atmosfera sutil (glow cyber)
  const atmosphereGeo = new THREE.SphereGeometry(1.42, segments, segments);
  const atmosphereMat = new THREE.MeshBasicMaterial({
    color: 0x35f2a0, transparent: true, opacity: 0.08, side: THREE.BackSide
  });
  scene.add(new THREE.Mesh(atmosphereGeo, atmosphereMat));

  const ambient = new THREE.AmbientLight(0x6fa89a, 1.1);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffffff, 1.15);
  sun.position.set(4, 2, 5);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x22d3ee, 0.5);
  rim.position.set(-4, -1, -3);
  scene.add(rim);

  fitSize();
  window.addEventListener('resize', fitSize);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let last = performance.now();
  let visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

  function animate(now){
    requestAnimationFrame(animate);
    const dt = now - last;
    last = now;
    if(visible){
      globe.rotation.y += RADIANS_PER_MS * dt * (reduceMotion ? 0.15 : 1);
      renderer.render(scene, camera);
    }
  }
  requestAnimationFrame(animate);
})();
