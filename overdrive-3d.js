/* ==========================================================================
   THANAPAT PISAVONG — ARCHITECTURAL 3D CAD & WEBGL SPATIAL ENGINE (overdrive-3d.js)
   Three.js WebGL Hardware-Accelerated Digital Twin, Custom CAD Shaders/Wireframes,
   Exploded Axonometric Assembly, Multi-Plane 3D Cards & Modal 3D Topology
   Harmonized with DESIGN.md (Drafting Vellum & Prussian Blueprint)
   ========================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  // Global shared pointer & scroll telemetry
  const pointer = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
    nx: 0,
    ny: 0,
    tx: 0,
    ty: 0
  };

  let scrollY = window.scrollY || 0;
  let smoothScroll = scrollY;
  let scrollVelocity = 0;

  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.tx = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      pointer.ty = (e.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
    },
    { passive: true }
  );

  window.addEventListener(
    'scroll',
    () => {
      scrollY = window.scrollY || 0;
    },
    { passive: true }
  );

  /* ==========================================================================
     THEME PALETTE SYNCHRONIZER (Drafting Vellum vs Prussian Blueprint)
     ========================================================================== */
  function isDarkTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function getThemePalette() {
    if (isDarkTheme()) {
      return {
        dark: true,
        inkHex: 0xe8e4da,
        inkSubHex: 0x94a9be,
        ruleHex: 0x466385,
        gridHex: 0x29405c,
        surfaceHex: 0x1b2a3e,
        elevatedHex: 0x243852,
        sheetHex: 0x152030,
        signalHex: 0xf97316,
        validHex: 0x34d399,
        ink: 'rgba(232, 228, 218, 0.88)',
        inkMuted: 'rgba(148, 169, 190, 0.34)',
        inkFaint: 'rgba(148, 169, 190, 0.12)',
        signal: 'rgba(249, 115, 22, 0.95)',
        signalSoft: 'rgba(249, 115, 22, 0.24)',
        valid: 'rgba(52, 211, 153, 0.92)',
        surface: 'rgba(27, 42, 62, 0.82)',
        sheet: '#152030'
      };
    }
    return {
      dark: false,
      inkHex: 0x102238,
      inkSubHex: 0x32475c,
      ruleHex: 0x102238,
      gridHex: 0xc8c2b4,
      surfaceHex: 0xe5e0d5,
      elevatedHex: 0xfaf8f3,
      sheetHex: 0xf5f2eb,
      signalHex: 0x9a3412,
      validHex: 0x166534,
      ink: 'rgba(16, 34, 56, 0.88)',
      inkMuted: 'rgba(16, 34, 56, 0.30)',
      inkFaint: 'rgba(16, 34, 56, 0.09)',
      signal: 'rgba(154, 52, 18, 0.95)',
      signalSoft: 'rgba(154, 52, 18, 0.18)',
      valid: 'rgba(22, 101, 52, 0.92)',
      surface: 'rgba(234, 230, 220, 0.85)',
      sheet: '#f5f2eb'
    };
  }

  const themeListeners = [];
  function onThemeChange(fn) {
    themeListeners.push(fn);
  }

  const themeObserver = new MutationObserver(() => {
    const pal = getThemePalette();
    themeListeners.forEach((fn) => {
      try {
        fn(pal);
      } catch (err) {
        console.warn('Theme listener error:', err);
      }
    });
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  /* ==========================================================================
     HELPER: BUILD CAD SOLID + WIREFRAME MESH (ARCHITECTURAL DUAL-PASS)
     ========================================================================== */
  function createCadMesh(geometry, materialOpts, edgeColorHex, edgeOpacity) {
    const THREE = window.THREE;
    const group = new THREE.Group();

    const mat = new THREE.MeshStandardMaterial(
      Object.assign(
        {
          color: 0xe5e0d5,
          roughness: 0.55,
          metalness: 0.18,
          flatShading: true,
          polygonOffset: true,
          polygonOffsetFactor: 1,
          polygonOffsetUnits: 1
        },
        materialOpts || {}
      )
    );

    const solid = new THREE.Mesh(geometry, mat);
    group.add(solid);

    const edgesGeo = new THREE.EdgesGeometry(geometry, 18);
    const edgesMat = new THREE.LineBasicMaterial({
      color: edgeColorHex !== undefined ? edgeColorHex : 0x102238,
      transparent: true,
      opacity: edgeOpacity !== undefined ? edgeOpacity : 0.78
    });
    const wire = new THREE.LineSegments(edgesGeo, edgesMat);
    group.add(wire);

    group.userData.solid = solid;
    group.userData.wire = wire;
    return group;
  }

  /* ==========================================================================
     1. FIRST VIEWPORT: WEBGL 3D HERO ARCHITECTURAL GYRO-CORE (#hero3dCoreCanvas)
     ========================================================================== */
  function initHero3DCore() {
    const canvas = document.getElementById('hero3dCoreCanvas');
    const wrap = document.getElementById('hero3dCoreWrap');
    const readout = document.getElementById('hero3dCoreReadout');
    const explodeBtn = document.getElementById('hero3dExplodeBtn');
    if (!canvas || !wrap) return;

    const THREE = window.THREE;
    if (!THREE) return;

    // Create crisp 2D HUD overlay canvas on top of WebGL canvas for callouts
    let hudCanvas = wrap.querySelector('.hero-3d-hud-overlay');
    if (!hudCanvas) {
      hudCanvas = document.createElement('canvas');
      hudCanvas.className = 'hero-3d-hud-overlay';
      hudCanvas.style.cssText =
        'position:absolute;left:0;top:29px;width:100%;height:184px;pointer-events:none;z-index:2;';
      wrap.appendChild(hudCanvas);
    }
    const hudCtx = hudCanvas.getContext('2d');

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.3, 5.5);
    camera.lookAt(0, 0, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight1.position.set(4, 6, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf97316, 0.55);
    dirLight2.position.set(-4, -3, 3);
    scene.add(dirLight2);

    const corePointLight = new THREE.PointLight(0x9a3412, 1.4, 8);
    scene.add(corePointLight);

    // Root assembly group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    let pal = getThemePalette();

    // 1A. Inner Glowing Reactor Core (Octahedron + Icosahedron)
    const innerCoreGeo = new THREE.OctahedronGeometry(0.58, 0);
    const innerCoreMesh = createCadMesh(
      innerCoreGeo,
      {
        color: pal.signalHex,
        emissive: pal.signalHex,
        emissiveIntensity: 0.28,
        roughness: 0.25,
        metalness: 0.4
      },
      pal.inkHex,
      0.95
    );
    rootGroup.add(innerCoreMesh);

    const outerCageGeo = new THREE.IcosahedronGeometry(0.92, 0);
    const outerCageEdges = new THREE.EdgesGeometry(outerCageGeo);
    const outerCageMat = new THREE.LineBasicMaterial({
      color: pal.inkHex,
      transparent: true,
      opacity: 0.65
    });
    const outerCageWire = new THREE.LineSegments(outerCageEdges, outerCageMat);
    rootGroup.add(outerCageWire);

    // 1B. 8 Explodable Precision Octant Shield Plates
    const shieldGroup = new THREE.Group();
    rootGroup.add(shieldGroup);
    const shieldPlates = [];
    const octantDirs = [
      [1, 1, 1],
      [-1, 1, 1],
      [1, -1, 1],
      [-1, -1, 1],
      [1, 1, -1],
      [-1, 1, -1],
      [1, -1, -1],
      [-1, -1, -1]
    ];
    const plateGeo = new THREE.BoxGeometry(0.36, 0.36, 0.12);
    octantDirs.forEach((dir) => {
      const v = new THREE.Vector3(dir[0], dir[1], dir[2]).normalize();
      const plate = createCadMesh(
        plateGeo,
        {
          color: pal.surfaceHex,
          roughness: 0.5,
          metalness: 0.2,
          transparent: true,
          opacity: 0.88
        },
        pal.inkHex,
        0.8
      );
      plate.position.copy(v).multiplyScalar(0.76);
      plate.lookAt(v.clone().multiplyScalar(3));
      shieldGroup.add(plate);
      shieldPlates.push({ mesh: plate, dir: v });
    });

    // 1C. 3 Orthogonal CNC Gimbal Rings
    const gimbalGroup = new THREE.Group();
    rootGroup.add(gimbalGroup);

    const ring1Geo = new THREE.TorusGeometry(1.32, 0.022, 8, 48);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: pal.inkHex,
      roughness: 0.3,
      metalness: 0.5
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI * 0.38;
    gimbalGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.52, 0.018, 8, 48);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: pal.signalHex,
      roughness: 0.35,
      metalness: 0.4
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI * 0.35;
    ring2.rotation.x = -Math.PI * 0.2;
    gimbalGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(1.72, 0.014, 6, 40);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: pal.validHex,
      roughness: 0.4,
      metalness: 0.3
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI * 0.25;
    gimbalGroup.add(ring3);

    // 1D. 5 Orbital Stack Satellites (L12, N16, .NET8, AWS, KT)
    const satDefs = [
      { label: 'L12', radius: 1.62, speed: 0.85, phase: 0.2, tiltX: 0.45, tiltZ: 0.2, isSignal: true },
      { label: 'N16', radius: 1.72, speed: -0.72, phase: 1.6, tiltX: -0.5, tiltZ: 0.35, isSignal: false },
      { label: '.NET8', radius: 1.58, speed: 0.64, phase: 3.1, tiltX: 0.25, tiltZ: -0.55, isSignal: true },
      { label: 'AWS', radius: 1.76, speed: -0.58, phase: 4.4, tiltX: -0.35, tiltZ: -0.3, isSignal: false },
      { label: 'KT', radius: 1.65, speed: 0.78, phase: 5.5, tiltX: 0.6, tiltZ: -0.15, isSignal: false }
    ];

    const satGeo = new THREE.OctahedronGeometry(0.11, 0);
    const satellites = satDefs.map((def) => {
      const satMesh = createCadMesh(
        satGeo,
        {
          color: def.isSignal ? pal.signalHex : pal.validHex,
          emissive: def.isSignal ? pal.signalHex : pal.validHex,
          emissiveIntensity: 0.35
        },
        pal.inkHex,
        0.9
      );
      rootGroup.add(satMesh);
      return Object.assign({}, def, { mesh: satMesh });
    });

    // Update materials on theme toggle
    onThemeChange((newPal) => {
      pal = newPal;
      innerCoreMesh.userData.solid.material.color.setHex(pal.signalHex);
      innerCoreMesh.userData.solid.material.emissive.setHex(pal.signalHex);
      innerCoreMesh.userData.wire.material.color.setHex(pal.inkHex);
      outerCageMat.color.setHex(pal.inkHex);
      shieldPlates.forEach((p) => {
        p.mesh.userData.solid.material.color.setHex(pal.surfaceHex);
        p.mesh.userData.wire.material.color.setHex(pal.inkHex);
      });
      ring1Mat.color.setHex(pal.inkHex);
      ring2Mat.color.setHex(pal.signalHex);
      ring3Mat.color.setHex(pal.validHex);
      satellites.forEach((s) => {
        const hex = s.isSignal ? pal.signalHex : pal.validHex;
        s.mesh.userData.solid.material.color.setHex(hex);
        s.mesh.userData.solid.material.emissive.setHex(hex);
        s.mesh.userData.wire.material.color.setHex(pal.inkHex);
      });
    });

    // Sizing
    let width = 240;
    let height = 184;
    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(rect.width || 232, 180);
      height = Math.max(rect.height || 184, 150);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      hudCanvas.width = Math.floor(width * dpr);
      hudCanvas.height = Math.floor(height * dpr);
      hudCanvas.style.height = height + 'px';
      hudCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // Interactive state
    let rotX = -0.32;
    let rotY = 0.52;
    let velX = 0.002;
    let velY = 0.009;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let isExploded = false;
    let explodeProgress = 0;

    function toggleExplode(e) {
      if (e) e.stopPropagation();
      isExploded = !isExploded;
      if (explodeBtn) {
        explodeBtn.classList.toggle('active', isExploded);
        explodeBtn.textContent = isExploded ? 'ASSEMBLE' : 'EXPLODE';
      }
    }

    if (explodeBtn) {
      explodeBtn.addEventListener('click', toggleExplode);
    }
    wrap.addEventListener('dblclick', toggleExplode);

    wrap.addEventListener('pointerdown', (e) => {
      if (e.target === explodeBtn) return;
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      if (wrap.setPointerCapture) {
        try {
          wrap.setPointerCapture(e.pointerId);
        } catch (_) {}
      }
    });

    wrap.addEventListener('pointermove', (e) => {
      if (!isDragging) {
        const rect = wrap.getBoundingClientRect();
        const hx = (e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
        const hy = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
        velY += hx * 0.0012;
        velX += hy * 0.0012;
        return;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      velY = dx * 0.013;
      velX = dy * 0.013;
      rotY += velY;
      rotX = Math.max(-1.35, Math.min(1.35, rotX + velX));
    });

    const stopDrag = () => {
      isDragging = false;
    };
    wrap.addEventListener('pointerup', stopDrag);
    wrap.addEventListener('pointercancel', stopDrag);

    const projVec = new THREE.Vector3();
    const centerVec = new THREE.Vector3();

    function renderFrame(now) {
      const t = now * 0.001;

      if (!isDragging) {
        rotY += velY;
        rotX += velX;
        velX *= 0.94;
        velY = velY * 0.96 + (prefersReducedMotion ? 0 : 0.0085) * 0.04;
        rotX += (-0.28 - rotX) * 0.03;
      }

      // Smooth explode transition
      const targetExplode = isExploded ? 1 : 0;
      explodeProgress += (targetExplode - explodeProgress) * 0.1;

      rootGroup.rotation.x = rotX;
      rootGroup.rotation.y = rotY;

      // Animate inner core & shield plates
      const pulse = 1 + Math.sin(t * 3.2) * 0.05 + explodeProgress * 0.14;
      innerCoreMesh.scale.setScalar(pulse);
      innerCoreMesh.rotation.y = -t * 0.9;
      innerCoreMesh.rotation.z = t * 0.5;

      outerCageWire.scale.setScalar(1 + explodeProgress * 0.35);
      outerCageWire.rotation.y = t * 0.35;

      shieldPlates.forEach((p, idx) => {
        const dist = 0.72 + explodeProgress * 0.62 + Math.sin(t * 2.2 + idx) * 0.03;
        p.mesh.position.copy(p.dir).multiplyScalar(dist);
      });

      // Counter-rotate gimbal rings
      ring1.rotation.z = t * 0.7;
      ring1.scale.setScalar(1 + explodeProgress * 0.18);
      ring2.rotation.x = -Math.PI * 0.2 + t * 0.55;
      ring2.scale.setScalar(1 + explodeProgress * 0.24);
      ring3.rotation.y = t * -0.48;
      ring3.scale.setScalar(1 + explodeProgress * 0.3);

      // Update orbital satellites
      satellites.forEach((s) => {
        const angle = t * s.speed + s.phase;
        const r = s.radius * (1 + explodeProgress * 0.16);
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const y = Math.sin(angle * 1.5) * 0.45;
        s.mesh.position.set(
          x,
          y * Math.cos(s.tiltX) - z * Math.sin(s.tiltX),
          y * Math.sin(s.tiltX) + z * Math.cos(s.tiltX)
        );
        s.mesh.rotation.x = t * 1.8;
        s.mesh.rotation.y = t * 1.4;
      });

      renderer.render(scene, camera);

      // Render crisp 2D HUD Telemetry & Leader Callouts
      hudCtx.clearRect(0, 0, width, height);

      // Corner drafting reticles
      hudCtx.strokeStyle = pal.inkMuted;
      hudCtx.lineWidth = 1;
      const b = 7;
      const m = 6;
      hudCtx.beginPath();
      hudCtx.moveTo(m, m + b);
      hudCtx.lineTo(m, m);
      hudCtx.lineTo(m + b, m);
      hudCtx.moveTo(width - m - b, m);
      hudCtx.lineTo(width - m, m);
      hudCtx.lineTo(width - m, m + b);
      hudCtx.moveTo(m, height - m - b);
      hudCtx.lineTo(m, height - m);
      hudCtx.lineTo(m + b, height - m);
      hudCtx.moveTo(width - m - b, height - m);
      hudCtx.lineTo(width - m, height - m);
      hudCtx.lineTo(width - m, height - m - b);
      hudCtx.stroke();

      // Project satellite labels
      centerVec.set(0, 0, 0).project(camera);
      const cx = (centerVec.x * 0.5 + 0.5) * width;
      const cy = (-centerVec.y * 0.5 + 0.5) * height;

      hudCtx.font = '700 9.5px "Commit Mono", monospace';
      satellites.forEach((s) => {
        s.mesh.getWorldPosition(projVec);
        projVec.project(camera);
        if (projVec.z > 1) return;
        const sx = (projVec.x * 0.5 + 0.5) * width;
        const sy = (-projVec.y * 0.5 + 0.5) * height;

        // Subtle leader line from core center
        hudCtx.strokeStyle = s.isSignal ? pal.signalSoft : pal.inkFaint;
        hudCtx.beginPath();
        hudCtx.moveTo(cx, cy);
        hudCtx.lineTo(sx, sy);
        hudCtx.stroke();

        // Callout tag
        const tw = hudCtx.measureText(s.label).width + 8;
        hudCtx.fillStyle = pal.sheet;
        hudCtx.fillRect(sx + 5, sy - 7, tw, 13);
        hudCtx.strokeStyle = s.isSignal ? pal.signal : pal.inkMuted;
        hudCtx.strokeRect(sx + 5, sy - 7, tw, 13);
        hudCtx.fillStyle = s.isSignal ? pal.signal : pal.ink;
        hudCtx.fillText(s.label, sx + 9, sy + 2.5);
      });

      if (readout) {
        const degX = Math.round((rotX * 180) / Math.PI);
        const degY = Math.round(((rotY * 180) / Math.PI) % 360);
        const modeTag = isExploded ? 'EXPLODED' : 'WEBGL 3D';
        readout.textContent = `${modeTag} · X:${degX}° Y:${degY}°`;
      }

      if (!prefersReducedMotion) {
        requestAnimationFrame(renderFrame);
      }
    }

    requestAnimationFrame(renderFrame);
  }

  /* ==========================================================================
     2. ENTERPRISE 3D WEBGL DIGITAL TWIN STAGE (#cad3dTopologyCanvas)
     ========================================================================== */
  function initEnterprise3DTopology() {
    const canvas = document.getElementById('cad3dTopologyCanvas');
    const box = document.getElementById('cad3dTopologyBox');
    const readout = document.getElementById('cad3dNodeReadout');
    const telemetry = document.getElementById('cad3dTelemetryCoords');
    const camBtns = document.querySelectorAll('.cad3d-btn[data-cam]');
    const wireBtn = document.getElementById('cad3dWireBtn');
    const explodeBtn = document.getElementById('cad3dExplodeBtn');
    const labelBtns = document.querySelectorAll('.cad3d-label[data-node]');
    if (!canvas || !box) return;

    const THREE = window.THREE;
    if (!THREE) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      return;
    }

    let pal = getThemePalette();
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, 16 / 9, 0.1, 120);
    const camTarget = new THREE.Vector3(0, 0.25, 0);

    // Lighting Setup
    const ambient = new THREE.AmbientLight(0xffffff, 0.78);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.95);
    keyLight.position.set(8, 14, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(pal.signalHex, 0.55);
    rimLight.position.set(-10, 6, -8);
    scene.add(rimLight);

    const syncCoreLight = new THREE.PointLight(pal.signalHex, 1.5, 9);
    syncCoreLight.position.set(0, 1.2, 0);
    scene.add(syncCoreLight);

    // Master World Group
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 2A. 3D Architectural Drafting Floor & Radar Rings
    const floorGroup = new THREE.Group();
    worldGroup.add(floorGroup);

    const gridVerts = [];
    const gridExtent = 6.5;
    const gridStep = 0.65;
    for (let i = -gridExtent; i <= gridExtent + 0.001; i += gridStep) {
      gridVerts.push(-gridExtent, 0, i, gridExtent, 0, i);
      gridVerts.push(i, 0, -gridExtent, i, 0, gridExtent);
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridVerts, 3));
    const gridMat = new THREE.LineBasicMaterial({
      color: pal.gridHex,
      transparent: true,
      opacity: 0.42
    });
    const gridLines = new THREE.LineSegments(gridGeo, gridMat);
    floorGroup.add(gridLines);

    // Outer perimeter drafting frame on floor
    const borderGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(gridExtent * 2, 0.02, gridExtent * 2));
    const borderMat = new THREE.LineBasicMaterial({
      color: pal.inkHex,
      transparent: true,
      opacity: 0.65
    });
    const borderFrame = new THREE.LineSegments(borderGeo, borderMat);
    floorGroup.add(borderFrame);

    // Concentric elevation radar rings around central SYNC node
    const radarRingGeo1 = new THREE.RingGeometry(1.35, 1.38, 64);
    radarRingGeo1.rotateX(-Math.PI / 2);
    const radarRingMat1 = new THREE.MeshBasicMaterial({
      color: pal.signalHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    const radarRing1 = new THREE.Mesh(radarRingGeo1, radarRingMat1);
    radarRing1.position.y = 0.01;
    floorGroup.add(radarRing1);

    const radarRingGeo2 = new THREE.RingGeometry(2.8, 2.83, 64);
    radarRingGeo2.rotateX(-Math.PI / 2);
    const radarRingMat2 = new THREE.MeshBasicMaterial({
      color: pal.inkHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.22
    });
    const radarRing2 = new THREE.Mesh(radarRingGeo2, radarRingMat2);
    radarRing2.position.y = 0.01;
    floorGroup.add(radarRing2);

    // 2B. Node Specifications & Custom 3D Monument Builders
    const nodeSpecs = [
      {
        id: 'sap',
        title: '01 // SAP BUSINESS ONE (MSSQL)',
        pos: new THREE.Vector3(-3.6, 0, -1.35),
        spec: 'SAP B1 ERP: Production Orders (OWOR), BOM Routing & Inventory MSSQL Database',
        role: 'standard'
      },
      {
        id: 'sync',
        title: '02 // SYNC ENGINE (.NET 8 / NODE)',
        pos: new THREE.Vector3(0, 0.15, 0),
        spec: 'BIDIRECTIONAL SYNC CORE: Node.js ESM Cron + ASP.NET Core 8 Web API & Serilog',
        role: 'core'
      },
      {
        id: 'gmp',
        title: '03 // EBR & MANHOUR GMP PLANT',
        pos: new THREE.Vector3(3.6, 0, -1.35),
        spec: 'PHARMA GMP SHOP FLOOR: Laravel 12 + Next.js 16 Digital Batch Record & Audit Trail',
        role: 'valid'
      },
      {
        id: 'aws',
        title: '04 // AWS ECS FARGATE & AURORA',
        pos: new THREE.Vector3(-2.4, 0, 1.95),
        spec: 'CLOUD INFRASTRUCTURE: Multi-AZ Aurora PostgreSQL, ECS Containers, Cognito PKCE & SAM IaC',
        role: 'standard'
      },
      {
        id: 'edge',
        title: '05 // ANDROID AUTO & EDGE IOT',
        pos: new THREE.Vector3(2.4, 0, 1.95),
        spec: 'EDGE & AUTOMOTIVE: Kotlin 60fps Wireless Projection (MG S5 EV) & Industrial RS-232/RFID',
        role: 'valid'
      }
    ];

    const allCadMeshes = [];
    const nodeMap = {};
    const raycastTargets = [];

    function registerCadPart(cadGroup, tierIndex, role) {
      cadGroup.userData.tierIndex = tierIndex || 0;
      cadGroup.userData.baseY = cadGroup.position.y;
      cadGroup.userData.role = role || 'standard';
      allCadMeshes.push(cadGroup);
      if (cadGroup.userData.solid) {
        raycastTargets.push(cadGroup.userData.solid);
      }
    }

    nodeSpecs.forEach((spec) => {
      const monument = new THREE.Group();
      monument.position.copy(spec.pos);
      worldGroup.add(monument);

      // Base foundation pad on the drafting grid
      const padGeo = new THREE.BoxGeometry(1.75, 0.08, 1.45);
      const pad = createCadMesh(
        padGeo,
        { color: pal.surfaceHex, roughness: 0.7 },
        pal.inkHex,
        0.65
      );
      pad.position.y = 0.04;
      monument.add(pad);
      registerCadPart(pad, 0, 'pad');

      const parts = [pad];

      if (spec.id === 'sap') {
        // SAP B1: 3-tier Cylindrical Database Platter Stack + Outer Cage
        for (let i = 0; i < 3; i++) {
          const cylGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.26, 20);
          const cyl = createCadMesh(
            cylGeo,
            { color: i === 2 ? pal.elevatedHex : pal.surfaceHex, metalness: 0.25 },
            pal.inkHex,
            0.85
          );
          cyl.position.y = 0.26 + i * 0.34;
          monument.add(cyl);
          registerCadPart(cyl, i + 1, 'standard');
          parts.push(cyl);
        }
        const capRingGeo = new THREE.TorusGeometry(0.66, 0.02, 8, 32);
        capRingGeo.rotateX(Math.PI / 2);
        const capRing = createCadMesh(
          capRingGeo,
          { color: pal.signalHex, emissive: pal.signalHex, emissiveIntensity: 0.2 },
          pal.signalHex,
          0.9
        );
        capRing.position.y = 1.18;
        monument.add(capRing);
        registerCadPart(capRing, 4, 'core');
        parts.push(capRing);
        monument.userData.rotor = capRing;
      } else if (spec.id === 'sync') {
        // SYNC ENGINE: Stepped Core Pedestal + Floating Octahedral Reactor + Dual Gimbal Frames
        const baseStepGeo = new THREE.CylinderGeometry(0.68, 0.82, 0.24, 8);
        const baseStep = createCadMesh(
          baseStepGeo,
          { color: pal.surfaceHex, metalness: 0.3 },
          pal.inkHex,
          0.85
        );
        baseStep.position.y = 0.2;
        monument.add(baseStep);
        registerCadPart(baseStep, 1, 'standard');
        parts.push(baseStep);

        const coreGeo = new THREE.OctahedronGeometry(0.52, 0);
        const core = createCadMesh(
          coreGeo,
          {
            color: pal.signalHex,
            emissive: pal.signalHex,
            emissiveIntensity: 0.32,
            roughness: 0.25,
            metalness: 0.45
          },
          pal.inkHex,
          0.95
        );
        core.position.y = 0.92;
        monument.add(core);
        registerCadPart(core, 2, 'core');
        parts.push(core);
        monument.userData.rotor = core;

        const frameGeo = new THREE.TorusGeometry(0.82, 0.025, 6, 24);
        const frame = createCadMesh(
          frameGeo,
          { color: pal.inkHex, metalness: 0.5 },
          pal.signalHex,
          0.85
        );
        frame.position.y = 0.92;
        monument.add(frame);
        registerCadPart(frame, 3, 'core');
        parts.push(frame);
        monument.userData.secondaryRotor = frame;
      } else if (spec.id === 'gmp') {
        // GMP PLANT: Modular Cleanroom Complex + Validation Tower
        const mainHallGeo = new THREE.BoxGeometry(1.32, 0.48, 0.98);
        const mainHall = createCadMesh(
          mainHallGeo,
          { color: pal.surfaceHex },
          pal.inkHex,
          0.85
        );
        mainHall.position.y = 0.32;
        monument.add(mainHall);
        registerCadPart(mainHall, 1, 'standard');
        parts.push(mainHall);

        for (let b = -1; b <= 1; b++) {
          const bayGeo = new THREE.BoxGeometry(0.36, 0.32, 0.84);
          const bay = createCadMesh(
            bayGeo,
            { color: pal.elevatedHex },
            pal.validHex,
            0.85
          );
          bay.position.set(b * 0.42, 0.72, 0);
          monument.add(bay);
          registerCadPart(bay, 2, 'valid');
          parts.push(bay);
        }

        const beaconGeo = new THREE.OctahedronGeometry(0.22, 0);
        const beacon = createCadMesh(
          beaconGeo,
          { color: pal.validHex, emissive: pal.validHex, emissiveIntensity: 0.3 },
          pal.inkHex,
          0.9
        );
        beacon.position.y = 1.15;
        monument.add(beacon);
        registerCadPart(beacon, 3, 'valid');
        parts.push(beacon);
        monument.userData.rotor = beacon;
      } else if (spec.id === 'aws') {
        // AWS CLOUD: 3 Horizontal Server Rack Blades + Multi-AZ Halo
        for (let l = 0; l < 3; l++) {
          const bladeGeo = new THREE.BoxGeometry(1.24, 0.2, 0.88);
          const blade = createCadMesh(
            bladeGeo,
            { color: l === 2 ? pal.elevatedHex : pal.surfaceHex, metalness: 0.3 },
            pal.inkHex,
            0.85
          );
          blade.position.y = 0.24 + l * 0.3;
          monument.add(blade);
          registerCadPart(blade, l + 1, 'standard');
          parts.push(blade);
        }
        const cloudHaloGeo = new THREE.TorusGeometry(0.68, 0.02, 8, 32);
        cloudHaloGeo.rotateX(Math.PI / 2);
        const cloudHalo = createCadMesh(
          cloudHaloGeo,
          { color: pal.validHex, emissive: pal.validHex, emissiveIntensity: 0.2 },
          pal.validHex,
          0.85
        );
        cloudHalo.position.y = 1.12;
        monument.add(cloudHalo);
        registerCadPart(cloudHalo, 4, 'valid');
        parts.push(cloudHalo);
        monument.userData.rotor = cloudHalo;
      } else if (spec.id === 'edge') {
        // ANDROID AUTO & IOT: Pedestal + Tilted 12.8" Cockpit Display + Telemetry Dish
        const dockGeo = new THREE.BoxGeometry(1.1, 0.26, 0.8);
        const dock = createCadMesh(
          dockGeo,
          { color: pal.surfaceHex },
          pal.inkHex,
          0.85
        );
        dock.position.y = 0.21;
        monument.add(dock);
        registerCadPart(dock, 1, 'standard');
        parts.push(dock);

        const screenGeo = new THREE.BoxGeometry(1.18, 0.62, 0.09);
        const screen = createCadMesh(
          screenGeo,
          { color: pal.elevatedHex, metalness: 0.35 },
          pal.validHex,
          0.9
        );
        screen.position.y = 0.72;
        screen.rotation.x = -0.24;
        monument.add(screen);
        registerCadPart(screen, 2, 'valid');
        parts.push(screen);

        const emitterGeo = new THREE.OctahedronGeometry(0.18, 0);
        const emitter = createCadMesh(
          emitterGeo,
          { color: pal.signalHex, emissive: pal.signalHex, emissiveIntensity: 0.28 },
          pal.inkHex,
          0.9
        );
        emitter.position.y = 1.22;
        monument.add(emitter);
        registerCadPart(emitter, 3, 'core');
        parts.push(emitter);
        monument.userData.rotor = emitter;
      }

      // Attach nodeId to all child solid meshes for Raycasting
      monument.traverse((child) => {
        child.userData.nodeId = spec.id;
      });

      nodeMap[spec.id] = {
        spec,
        group: monument,
        parts,
        hoverLift: 0
      };
    });

    // 2C. 3D Curved Bezier Data Conduits & Flowing Telemetry Packets
    const conduitDefs = [
      { from: 'sap', to: 'sync', peak: 1.85, isPrimary: true },
      { from: 'sync', to: 'gmp', peak: 1.85, isPrimary: true },
      { from: 'sync', to: 'aws', peak: 1.55, isPrimary: true },
      { from: 'sync', to: 'edge', peak: 1.55, isPrimary: false },
      { from: 'aws', to: 'gmp', peak: 1.4, isPrimary: false },
      { from: 'sap', to: 'aws', peak: 1.35, isPrimary: false }
    ];

    const conduits = [];
    const packets = [];
    const packetGeo = new THREE.OctahedronGeometry(0.085, 0);

    conduitDefs.forEach((def, cIdx) => {
      const p0 = nodeMap[def.from].spec.pos.clone().add(new THREE.Vector3(0, 0.75, 0));
      const p2 = nodeMap[def.to].spec.pos.clone().add(new THREE.Vector3(0, 0.75, 0));
      const mid = p0.clone().add(p2).multiplyScalar(0.5);
      mid.y = def.peak;

      const curve = new THREE.QuadraticBezierCurve3(p0, mid, p2);
      const pts = curve.getPoints(40);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({
        color: def.isPrimary ? pal.signalHex : pal.inkSubHex,
        transparent: true,
        opacity: def.isPrimary ? 0.75 : 0.42
      });
      const line = new THREE.Line(lineGeo, lineMat);
      worldGroup.add(line);

      conduits.push({ def, curve, line, lineMat });

      // Spawn 3 bi-directional 3D packets per conduit
      for (let k = 0; k < 3; k++) {
        const isReverse = k === 1;
        const pktMat = new THREE.MeshBasicMaterial({
          color: def.isPrimary ? pal.signalHex : pal.validHex
        });
        const pktMesh = new THREE.Mesh(packetGeo, pktMat);
        worldGroup.add(pktMesh);

        packets.push({
          mesh: pktMesh,
          mat: pktMat,
          curve,
          from: def.from,
          to: def.to,
          isPrimary: def.isPrimary,
          t: (k * 0.33 + cIdx * 0.14) % 1,
          speed: (0.24 + (k % 2) * 0.08) * (isReverse ? -1 : 1)
        });
      }
    });

    // 2D. X-Ray Wireframe & Explode Mode States
    let isWireframeMode = false;
    let isExplodeMode = false;
    let explodeAmount = 0;
    let focusedNodeId = null;

    function syncMaterialsToTheme() {
      gridMat.color.setHex(pal.gridHex);
      borderMat.color.setHex(pal.inkHex);
      radarRingMat1.color.setHex(pal.signalHex);
      radarRingMat2.color.setHex(pal.inkHex);
      rimLight.color.setHex(pal.signalHex);
      syncCoreLight.color.setHex(pal.signalHex);

      allCadMeshes.forEach((cadGroup) => {
        const role = cadGroup.userData.role;
        const solidMat = cadGroup.userData.solid.material;
        const wireMat = cadGroup.userData.wire.material;

        if (role === 'core') {
          solidMat.color.setHex(pal.signalHex);
          solidMat.emissive.setHex(pal.signalHex);
          solidMat.emissiveIntensity = 0.28;
        } else if (role === 'valid') {
          solidMat.color.setHex(pal.elevatedHex);
          solidMat.emissive.setHex(pal.validHex);
          solidMat.emissiveIntensity = 0.12;
        } else {
          solidMat.color.setHex(pal.surfaceHex);
          solidMat.emissive.setHex(0x000000);
        }

        solidMat.transparent = isWireframeMode;
        solidMat.opacity = isWireframeMode ? 0.14 : 0.94;
        wireMat.color.setHex(role === 'core' ? pal.signalHex : pal.inkHex);
        wireMat.opacity = isWireframeMode ? 0.95 : 0.78;
      });

      conduits.forEach((c) => {
        c.lineMat.color.setHex(c.def.isPrimary ? pal.signalHex : pal.inkSubHex);
      });
      packets.forEach((p) => {
        p.mat.color.setHex(p.isPrimary ? pal.signalHex : pal.validHex);
      });
    }

    onThemeChange((newPal) => {
      pal = newPal;
      syncMaterialsToTheme();
    });

    if (wireBtn) {
      wireBtn.addEventListener('click', () => {
        isWireframeMode = !isWireframeMode;
        wireBtn.classList.toggle('active', isWireframeMode);
        syncMaterialsToTheme();
      });
    }

    if (explodeBtn) {
      explodeBtn.addEventListener('click', () => {
        isExplodeMode = !isExplodeMode;
        explodeBtn.classList.toggle('active', isExplodeMode);
      });
    }

    // 2E. Camera Orbit & Preset Controls
    let camSpherical = {
      radius: 10.6,
      theta: 0.58,
      phi: 1.06
    };
    let targetSpherical = {
      radius: 10.6,
      theta: 0.58,
      phi: 1.06
    };
    let autoOrbit = !prefersReducedMotion;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    camBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-cam');
        if (mode === 'orbit') {
          autoOrbit = !autoOrbit;
          btn.classList.toggle('active', autoOrbit);
          return;
        }
        camBtns.forEach((b) => {
          if (b.getAttribute('data-cam') !== 'orbit') b.classList.remove('active');
        });
        btn.classList.add('active');

        if (mode === 'iso') {
          targetSpherical.phi = 1.06;
          targetSpherical.theta = 0.58;
          targetSpherical.radius = 10.6;
        } else if (mode === 'top') {
          targetSpherical.phi = 0.22;
          targetSpherical.theta = 0.0;
          targetSpherical.radius = 11.4;
          autoOrbit = false;
          const ob = document.getElementById('cad3dOrbitBtn');
          if (ob) ob.classList.remove('active');
        } else if (mode === 'front') {
          targetSpherical.phi = 1.44;
          targetSpherical.theta = 0.0;
          targetSpherical.radius = 10.2;
          autoOrbit = false;
          const ob = document.getElementById('cad3dOrbitBtn');
          if (ob) ob.classList.remove('active');
        }
      });
    });

    // Label & Raycast Node Focus
    function setFocusedNode(nodeId) {
      if (focusedNodeId === nodeId) return;
      focusedNodeId = nodeId;

      labelBtns.forEach((b) => {
        b.classList.toggle('is-focused', b.getAttribute('data-node') === nodeId);
      });

      if (nodeId && nodeMap[nodeId]) {
        const n = nodeMap[nodeId];
        if (readout) {
          readout.textContent = `${n.spec.title} — ${n.spec.spec}`;
        }
      } else if (readout) {
        readout.textContent = '3D WEBGL DIGITAL TWIN // DRAG TO ORBIT · CLICK NODE OR X-RAY / EXPLODE';
      }
    }

    labelBtns.forEach((btn) => {
      const nid = btn.getAttribute('data-node');
      btn.addEventListener('pointerenter', () => setFocusedNode(nid));
      btn.addEventListener('pointerleave', () => setFocusedNode(null));
      btn.addEventListener('focus', () => setFocusedNode(nid));
      btn.addEventListener('blur', () => setFocusedNode(null));
    });

    // Pointer Drag + Raycast Hover/Click on 3D Monuments
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    box.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.cad3d-label')) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      pointerDownPos = { x: e.clientX, y: e.clientY };
      if (box.setPointerCapture) {
        try {
          box.setPointerCapture(e.pointerId);
        } catch (_) {}
      }
    });

    box.addEventListener('pointermove', (e) => {
      const rect = box.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1;

      if (isDragging) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        targetSpherical.theta -= dx * 0.0075;
        targetSpherical.phi = Math.max(0.2, Math.min(1.48, targetSpherical.phi - dy * 0.0065));
        return;
      }

      // Raycast hover when not dragging
      if (!e.target.closest('.cad3d-label')) {
        raycaster.setFromCamera(mouseNDC, camera);
        const hits = raycaster.intersectObjects(raycastTargets, false);
        if (hits.length > 0 && hits[0].object.userData.nodeId) {
          setFocusedNode(hits[0].object.userData.nodeId);
          box.style.cursor = 'pointer';
        } else {
          setFocusedNode(null);
          box.style.cursor = 'grab';
        }
      }
    });

    const endDrag = (e) => {
      if (isDragging && e && e.type === 'pointerup') {
        const moved = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
        if (moved < 5 && focusedNodeId) {
          const matchingBtn = document.querySelector(`.cad3d-label[data-node="${focusedNodeId}"]`);
          if (matchingBtn) matchingBtn.click();
        }
      }
      isDragging = false;
    };
    box.addEventListener('pointerup', endDrag);
    box.addEventListener('pointercancel', endDrag);

    // Sizing
    let width = 800;
    let height = 420;
    function resize() {
      const rect = box.getBoundingClientRect();
      width = Math.max(rect.width || 800, 280);
      height = Math.max(rect.height || 420, 260);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    let isVisible = true;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );
      io.observe(box);
    }

    const labelVec = new THREE.Vector3();

    function renderTopology(now) {
      const t = now * 0.001;

      if (isVisible) {
        if (autoOrbit && !isDragging) {
          targetSpherical.theta += 0.0032;
        }

        camSpherical.theta += (targetSpherical.theta - camSpherical.theta) * 0.09;
        camSpherical.phi += (targetSpherical.phi - camSpherical.phi) * 0.09;
        camSpherical.radius += (targetSpherical.radius - camSpherical.radius) * 0.09;

        camera.position.x =
          camSpherical.radius * Math.sin(camSpherical.phi) * Math.sin(camSpherical.theta);
        camera.position.y = camSpherical.radius * Math.cos(camSpherical.phi);
        camera.position.z =
          camSpherical.radius * Math.sin(camSpherical.phi) * Math.cos(camSpherical.theta);
        camera.lookAt(camTarget);

        // Smooth explode factor
        const targetExplode = isExplodeMode ? 1 : 0;
        explodeAmount += (targetExplode - explodeAmount) * 0.1;

        // Animate radar rings
        radarRing1.scale.setScalar(1 + Math.sin(t * 2.5) * 0.04);
        radarRing2.rotation.z = t * 0.2;

        // Animate monuments & exploded tiers
        Object.keys(nodeMap).forEach((id) => {
          const item = nodeMap[id];
          const isFocused = focusedNodeId === id;
          const targetLift = isFocused ? 0.28 : 0;
          item.hoverLift += (targetLift - item.hoverLift) * 0.14;
          item.group.position.y = item.spec.pos.y + item.hoverLift;

          item.parts.forEach((part) => {
            const tier = part.userData.tierIndex || 0;
            const nodeExplode = explodeAmount + (isFocused ? 0.35 : 0);
            part.position.y = part.userData.baseY + tier * 0.26 * nodeExplode;
          });

          if (item.group.userData.rotor) {
            item.group.userData.rotor.rotation.y = t * (id === 'sync' ? 1.25 : 0.8);
            if (id === 'sync') {
              item.group.userData.rotor.rotation.z = Math.sin(t * 1.5) * 0.3;
            }
          }
          if (item.group.userData.secondaryRotor) {
            item.group.userData.secondaryRotor.rotation.x = t * 0.9;
            item.group.userData.secondaryRotor.rotation.y = -t * 0.6;
          }
        });

        // Animate 3D packets along conduits
        packets.forEach((pkt) => {
          pkt.t += pkt.speed * 0.011;
          if (pkt.t > 1) pkt.t -= 1;
          if (pkt.t < 0) pkt.t += 1;
          pkt.curve.getPoint(pkt.t, pkt.mesh.position);

          const isHighlighted =
            focusedNodeId && (pkt.from === focusedNodeId || pkt.to === focusedNodeId);
          pkt.mesh.scale.setScalar(isHighlighted ? 1.45 : 1.0);
          pkt.mesh.rotation.y = t * 3;
        });

        renderer.render(scene, camera);

        // Project 3D monument tops to HTML .cad3d-label coordinates
        labelBtns.forEach((btn) => {
          const nid = btn.getAttribute('data-node');
          const item = nodeMap[nid];
          if (!item) return;

          labelVec.copy(item.group.position);
          labelVec.y += 1.65 + explodeAmount * 0.75;
          labelVec.project(camera);

          const sx = (labelVec.x * 0.5 + 0.5) * width;
          const sy = (-labelVec.y * 0.5 + 0.5) * height;
          const clampedX = Math.max(85, Math.min(width - 85, sx));
          const clampedY = Math.max(24, Math.min(height - 56, sy));
          btn.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px, 0) translate(-50%, -100%)`;
        });

        if (telemetry) {
          const degPhi = Math.round(90 - (camSpherical.phi * 180) / Math.PI);
          const degTheta = Math.round(((camSpherical.theta * 180) / Math.PI) % 360);
          const modeLabel = isExplodeMode
            ? 'EXPLODED AXONOMETRIC'
            : isWireframeMode
            ? 'X-RAY BLUEPRINT'
            : 'WEBGL SOLID+WIRE';
          telemetry.textContent = `MODE: ${modeLabel} · PITCH: ${degPhi}° · YAW: ${degTheta}°`;
        }
      }

      if (!prefersReducedMotion) {
        requestAnimationFrame(renderTopology);
      }
    }

    syncMaterialsToTheme();
    requestAnimationFrame(renderTopology);
  }

  /* ==========================================================================
     3. FULL-VIEWPORT 3D SPATIAL BLUEPRINT HORIZON (#cad3d-bg-canvas)
     ========================================================================== */
  function initSpatialBackgroundCanvas() {
    let canvas = document.getElementById('cad3d-bg-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'cad3d-bg-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // Margin 3D architectural wireframe solids
    const solids = [
      { side: -1, yRatio: 0.2, z: 140, radius: 38, speedX: 0.007, speedY: 0.011 },
      { side: 1, yRatio: 0.35, z: 170, radius: 44, speedX: -0.008, speedY: 0.009 },
      { side: -1, yRatio: 0.68, z: 150, radius: 34, speedX: 0.01, speedY: -0.007 },
      { side: 1, yRatio: 0.82, z: 130, radius: 40, speedX: -0.006, speedY: -0.01 }
    ];

    const octaVerts = [
      [0, 1, 0],
      [0, -1, 0],
      [1, 0, 0],
      [-1, 0, 0],
      [0, 0, 1],
      [0, 0, -1]
    ];
    const octaEdges = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [4, 3], [3, 5], [5, 2]
    ];

    function renderBg(now) {
      const t = now * 0.001;
      const prevSmooth = smoothScroll;
      smoothScroll += (scrollY - smoothScroll) * 0.09;
      scrollVelocity = smoothScroll - prevSmooth;
      pointer.nx += (pointer.tx - pointer.nx) * 0.06;
      pointer.ny += (pointer.ty - pointer.ny) * 0.06;

      ctx.clearRect(0, 0, width, height);
      if (width < 1100) {
        if (!prefersReducedMotion) requestAnimationFrame(renderBg);
        return;
      }

      const pal = getThemePalette();
      const fov = 560;
      const cx = width * 0.5 + pointer.nx * 24;
      const cy = height * 0.5 + pointer.ny * 16;

      // Render margin 3D drafting solids
      solids.forEach((s, idx) => {
        const marginX = s.side < 0 ? 64 : width - 64;
        const sy = ((s.yRatio * height - smoothScroll * 0.14) % (height + 180));
        const finalY = sy < -90 ? sy + height + 180 : sy;

        const rx = t * s.speedX * 55 + smoothScroll * 0.003 + idx;
        const ry = t * s.speedY * 55 + pointer.nx * 0.4;

        const cosX = Math.cos(rx), sinX = Math.sin(rx);
        const cosY = Math.cos(ry), sinY = Math.sin(ry);

        const pts = octaVerts.map((v) => {
          let x = v[0] * s.radius;
          let y = v[1] * s.radius;
          let z = v[2] * s.radius;

          const y1 = y * cosX - z * sinX;
          const z1 = y * sinX + z * cosX;
          const x2 = x * cosY + z1 * sinY;
          const z2 = -x * sinY + z1 * cosY + s.z;

          const scale = fov / Math.max(fov + z2, 60);
          return {
            x: marginX + x2 * scale,
            y: finalY + y1 * scale
          };
        });

        ctx.strokeStyle = idx % 2 === 0 ? pal.inkMuted : pal.signalSoft;
        ctx.lineWidth = 1;
        ctx.beginPath();
        octaEdges.forEach((e) => {
          ctx.moveTo(pts[e[0]].x, pts[e[0]].y);
          ctx.lineTo(pts[e[1]].x, pts[e[1]].y);
        });
        ctx.stroke();

        // Dimension crosshair at center
        ctx.fillStyle = pal.signal;
        ctx.fillRect(marginX - 1.5, finalY - 1.5, 3, 3);
      });

      // Subtle architectural coordinate tick marks along outer left/right rails
      ctx.fillStyle = pal.inkFaint;
      for (let y = 40; y < height; y += 64) {
        const offset = (y - (smoothScroll * 0.25) % 64);
        ctx.fillRect(12, offset, 8, 1);
        ctx.fillRect(width - 20, offset, 8, 1);
      }

      if (!prefersReducedMotion) {
        requestAnimationFrame(renderBg);
      }
    }

    requestAnimationFrame(renderBg);
  }

  /* ==========================================================================
     4. MULTI-PLANE 3D HOLOGRAPHIC CARD SPRING PHYSICS & SCROLL 3D SHEETS
     ========================================================================== */
  function initSpatialCardPhysics() {
    if (prefersReducedMotion || isCoarsePointer) return;

    const selectors = [
      '.portrait-plate-wrap',
      '.spec-cell',
      '.portfolio-item',
      '.blueprint-node',
      '.blueprint-mini-card',
      '.tech-category',
      '.special-item',
      '.skill'
    ];

    const cards = document.querySelectorAll(selectors.join(','));

    cards.forEach((card) => {
      card.classList.add('spatial-3d-card');

      const maxTilt = card.classList.contains('portrait-plate-wrap') ? 9 : 5.5;
      let targetRX = 0;
      let targetRY = 0;
      let targetZ = 0;
      let currRX = 0;
      let currRY = 0;
      let currZ = 0;
      let velRX = 0;
      let velRY = 0;
      let velZ = 0;
      let rafId = 0;
      let hovered = false;

      function stepSpring() {
        const stiffness = 0.15;
        const damping = 0.74;

        velRX = (velRX + (targetRX - currRX) * stiffness) * damping;
        velRY = (velRY + (targetRY - currRY) * stiffness) * damping;
        velZ = (velZ + (targetZ - currZ) * stiffness) * damping;

        currRX += velRX;
        currRY += velRY;
        currZ += velZ;

        card.style.transform = `perspective(1050px) rotateX(${currRX.toFixed(2)}deg) rotateY(${currRY.toFixed(2)}deg) translateZ(${currZ.toFixed(1)}px)`;
        card.style.setProperty('--shadow-x', `${(-currRY * 1.6).toFixed(1)}px`);
        card.style.setProperty('--shadow-y', `${(8 + currRX * 1.4).toFixed(1)}px`);

        const stillMoving =
          Math.abs(velRX) > 0.01 ||
          Math.abs(velRY) > 0.01 ||
          Math.abs(targetRX - currRX) > 0.02 ||
          Math.abs(targetRY - currRY) > 0.02 ||
          Math.abs(targetZ - currZ) > 0.05;

        if (hovered || stillMoving) {
          rafId = requestAnimationFrame(stepSpring);
        } else {
          card.style.transform = '';
          card.classList.remove('is-tilting');
          rafId = 0;
        }
      }

      card.addEventListener('pointerenter', () => {
        hovered = true;
        targetZ = 8;
        card.classList.add('is-tilting');
        if (!rafId) rafId = requestAnimationFrame(stepSpring);
      });

      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / Math.max(rect.width, 1);
        const py = (e.clientY - rect.top) / Math.max(rect.height, 1);
        targetRY = (px - 0.5) * maxTilt * 2;
        targetRX = (0.5 - py) * maxTilt * 2;
        card.style.setProperty('--mouse-x', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${(py * 100).toFixed(1)}%`);
        if (!rafId) rafId = requestAnimationFrame(stepSpring);
      });

      card.addEventListener('pointerleave', () => {
        hovered = false;
        targetRX = 0;
        targetRY = 0;
        targetZ = 0;
        if (!rafId) rafId = requestAnimationFrame(stepSpring);
      });
    });

    // Subtle Scroll-Driven 3D Sheet Entrance Perspective
    const sheets = document.querySelectorAll('.folio-sheet:not(.hero)');
    sheets.forEach((sheet) => sheet.classList.add('sheet-3d-stage'));

    function updateSheetPerspective() {
      const vh = window.innerHeight;
      sheets.forEach((sheet) => {
        const rect = sheet.getBoundingClientRect();
        if (rect.top > vh * 0.92) {
          sheet.style.transform = 'perspective(1600px) rotateX(3.5deg) translateY(14px)';
        } else {
          sheet.style.transform = 'perspective(1600px) rotateX(0deg) translateY(0px)';
        }
      });
    }
    window.addEventListener('scroll', updateSheetPerspective, { passive: true });
    updateSheetPerspective();
  }

  /* ==========================================================================
     5. INTERACTIVE 3D ARCHITECTURE PIPELINE IN PROJECT MODAL (#projectDetailModal)
     ========================================================================== */
  function initModal3DArchitectureHook() {
    const origOpen = window.openProjectDetail;
    if (typeof origOpen !== 'function') return;

    let activeModalRAF = 0;
    let activeModalRenderer = null;

    function cleanupModal3D() {
      if (activeModalRAF) {
        cancelAnimationFrame(activeModalRAF);
        activeModalRAF = 0;
      }
      if (activeModalRenderer) {
        try {
          activeModalRenderer.dispose();
        } catch (_) {}
        activeModalRenderer = null;
      }
    }

    const origClose = window.closeProjectDetailModal;
    if (typeof origClose === 'function') {
      window.closeProjectDetailModal = function () {
        cleanupModal3D();
        return origClose.apply(this, arguments);
      };
    }

    window.openProjectDetail = function (projectId) {
      cleanupModal3D();
      origOpen.apply(this, arguments);

      const THREE = window.THREE;
      const contentEl = document.getElementById('projectDetailContent');
      const diagramBox = contentEl ? contentEl.querySelector('.modal-diagram-box') : null;
      if (!THREE || !contentEl || !diagramBox) return;

      // Extract bracketed node names from ASCII diagram to build a custom 3D pipeline
      const rawDiagram = diagramBox.textContent || '';
      const matches = [];
      const regex = /\[([^\]]+)\]/g;
      let m;
      while ((m = regex.exec(rawDiagram)) !== null) {
        if (matches.length < 5) matches.push(m[1]);
      }
      const nodeLabels =
        matches.length >= 2
          ? matches
          : ['Client Interface', 'Application Engine', 'Core Database', 'Cloud / Storage'];

      // Create 3D stage wrapper above the ASCII diagram
      const stageWrap = document.createElement('div');
      stageWrap.className = 'modal-3d-stage-wrap';
      stageWrap.innerHTML = `
        <div class="modal-3d-stage-bar">
          <span><i class="fas fa-cube"></i> 3D INTERACTIVE SYSTEM PIPELINE // ${String(projectId).toUpperCase()}</span>
          <span>DRAG TO ORBIT 3D</span>
        </div>
        <div class="modal-3d-canvas-host" id="modal3dCanvasHost">
          <canvas id="modal3dProjectCanvas"></canvas>
        </div>
      `;
      diagramBox.parentNode.insertBefore(stageWrap, diagramBox);

      const host = document.getElementById('modal3dCanvasHost');
      const canvas = document.getElementById('modal3dProjectCanvas');
      if (!host || !canvas) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        activeModalRenderer = renderer;
      } catch (e) {
        return;
      }

      const pal = getThemePalette();
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 3, 0.1, 100);

      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const dLight = new THREE.DirectionalLight(0xffffff, 0.9);
      dLight.position.set(5, 8, 6);
      scene.add(dLight);

      const group = new THREE.Group();
      scene.add(group);

      // Floor grid
      const gridHelper = new THREE.GridHelper(9, 14, pal.inkHex, pal.gridHex);
      gridHelper.position.y = -0.55;
      group.add(gridHelper);

      const count = nodeLabels.length;
      const spacing = Math.min(2.1, 6.8 / Math.max(count - 1, 1));
      const startX = -((count - 1) * spacing) * 0.5;
      const nodePositions = [];
      const nodeMeshes = [];

      nodeLabels.forEach((lbl, idx) => {
        const x = startX + idx * spacing;
        const z = idx % 2 === 0 ? -0.35 : 0.35;
        const pos = new THREE.Vector3(x, 0, z);
        nodePositions.push(pos);

        const geo =
          idx === 0
            ? new THREE.BoxGeometry(0.75, 0.55, 0.55)
            : idx === count - 1
            ? new THREE.CylinderGeometry(0.42, 0.42, 0.65, 16)
            : new THREE.OctahedronGeometry(0.45, 0);

        const mesh = createCadMesh(
          geo,
          {
            color: idx === 1 ? pal.signalHex : pal.surfaceHex,
            emissive: idx === 1 ? pal.signalHex : 0x000000,
            emissiveIntensity: idx === 1 ? 0.25 : 0
          },
          pal.inkHex,
          0.9
        );
        mesh.position.copy(pos);
        group.add(mesh);
        nodeMeshes.push(mesh);
      });

      // Conduits & packets between sequential pipeline nodes
      const modalPackets = [];
      const pktGeo = new THREE.OctahedronGeometry(0.08, 0);
      for (let i = 0; i < nodePositions.length - 1; i++) {
        const p0 = nodePositions[i];
        const p2 = nodePositions[i + 1];
        const mid = p0.clone().add(p2).multiplyScalar(0.5);
        mid.y += 0.75;
        const curve = new THREE.QuadraticBezierCurve3(p0, mid, p2);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(28));
        const line = new THREE.Line(
          lineGeo,
          new THREE.LineBasicMaterial({ color: pal.signalHex })
        );
        group.add(line);

        for (let k = 0; k < 2; k++) {
          const pkt = new THREE.Mesh(
            pktGeo,
            new THREE.MeshBasicMaterial({ color: k === 0 ? pal.signalHex : pal.validHex })
          );
          group.add(pkt);
          modalPackets.push({ mesh: pkt, curve, t: k * 0.5 });
        }
      }

      let rotY = 0.28;
      let rotX = 0.36;
      let dragging = false;
      let lx = 0;
      let ly = 0;

      host.addEventListener('pointerdown', (e) => {
        dragging = true;
        lx = e.clientX;
        ly = e.clientY;
      });
      host.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        rotY += (e.clientX - lx) * 0.01;
        rotX = Math.max(0.1, Math.min(1.1, rotX + (e.clientY - ly) * 0.01));
        lx = e.clientX;
        ly = e.clientY;
      });
      window.addEventListener('pointerup', () => {
        dragging = false;
      });

      function resizeModalCanvas() {
        const rect = host.getBoundingClientRect();
        const w = Math.max(rect.width || 640, 260);
        const h = Math.max(rect.height || 220, 180);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      setTimeout(resizeModalCanvas, 20);

      function animateModal(now) {
        const t = now * 0.001;
        if (!dragging) rotY += 0.0035;

        camera.position.set(
          Math.sin(rotY) * 6.8 * Math.cos(rotX),
          Math.sin(rotX) * 6.8 + 0.6,
          Math.cos(rotY) * 6.8 * Math.cos(rotX)
        );
        camera.lookAt(0, 0, 0);

        nodeMeshes.forEach((m, idx) => {
          m.position.y = Math.sin(t * 2 + idx) * 0.08;
          if (idx > 0 && idx < nodeMeshes.length - 1) {
            m.rotation.y = t * 0.9;
          }
        });

        modalPackets.forEach((p) => {
          p.t = (p.t + 0.008) % 1;
          p.curve.getPoint(p.t, p.mesh.position);
        });

        renderer.render(scene, camera);
        activeModalRAF = requestAnimationFrame(animateModal);
      }

      resizeModalCanvas();
      activeModalRAF = requestAnimationFrame(animateModal);
    };
  }

  /* ==========================================================================
     BOOT SEQUENCE INITIALIZATION (WITH AUTOMATIC THREE.JS FALLBACK LOADER)
     ========================================================================== */
  function startAll3DEngines() {
    initSpatialBackgroundCanvas();
    initHero3DCore();
    initEnterprise3DTopology();
    initSpatialCardPhysics();
    initModal3DArchitectureHook();
  }

  function boot() {
    if (window.THREE) {
      startAll3DEngines();
      return;
    }
    // Dynamic fallback if Three.js script is still loading
    const existingScript = document.querySelector('script[src*="three"]');
    if (existingScript) {
      existingScript.addEventListener('load', startAll3DEngines, { once: true });
      setTimeout(() => {
        if (window.THREE) startAll3DEngines();
      }, 800);
    } else {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      s.onload = startAll3DEngines;
      document.head.appendChild(s);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
