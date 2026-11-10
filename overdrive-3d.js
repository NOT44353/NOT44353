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
        inkHex: 0xe2e8f0,
        inkSubHex: 0x94a3b8,
        ruleHex: 0x334155,
        gridHex: 0x1e293b,
        surfaceHex: 0x14192b,
        elevatedHex: 0x1e2642,
        sheetHex: 0x0d101c,
        signalHex: 0x818cf8,
        validHex: 0x38bdf8,
        ink: 'rgba(248, 250, 252, 0.92)',
        inkMuted: 'rgba(148, 163, 184, 0.34)',
        inkFaint: 'rgba(129, 140, 248, 0.14)',
        signal: 'rgba(129, 140, 248, 0.95)',
        signalSoft: 'rgba(129, 140, 248, 0.24)',
        valid: 'rgba(56, 189, 248, 0.92)',
        surface: 'rgba(20, 25, 43, 0.86)',
        sheet: '#0d101c'
      };
    }
    return {
      dark: false,
      inkHex: 0x0f172a,
      inkSubHex: 0x475569,
      ruleHex: 0x94a3b8,
      gridHex: 0xcbd5e1,
      surfaceHex: 0xf1f5f9,
      elevatedHex: 0xffffff,
      sheetHex: 0xffffff,
      signalHex: 0x4f46e5,
      validHex: 0x0284c7,
      ink: 'rgba(15, 23, 42, 0.90)',
      inkMuted: 'rgba(71, 85, 105, 0.30)',
      inkFaint: 'rgba(79, 70, 229, 0.12)',
      signal: 'rgba(79, 70, 229, 0.95)',
      signalSoft: 'rgba(79, 70, 229, 0.20)',
      valid: 'rgba(2, 132, 199, 0.92)',
      surface: 'rgba(241, 245, 249, 0.90)',
      sheet: '#ffffff'
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

    // 1D. 6 Orbital Stack Satellites (CDK, N16, MCP, L12, .NET8, KT)
    const satDefs = [
      { label: 'CDK', radius: 1.76, speed: -0.58, phase: 4.4, tiltX: -0.35, tiltZ: -0.3, isSignal: true },
      { label: 'N16', radius: 1.72, speed: -0.72, phase: 1.6, tiltX: -0.5, tiltZ: 0.35, isSignal: false },
      { label: 'MCP', radius: 1.68, speed: 0.74, phase: 2.3, tiltX: -0.25, tiltZ: 0.5, isSignal: true },
      { label: 'L12', radius: 1.62, speed: 0.85, phase: 0.2, tiltX: 0.45, tiltZ: 0.2, isSignal: false },
      { label: '.NET8', radius: 1.58, speed: 0.64, phase: 3.1, tiltX: 0.25, tiltZ: -0.55, isSignal: true },
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
     3. FULL-VIEWPORT THREE.JS WEBGL 3D CYBER-ARCHITECTURAL WORLD (#cad3d-bg-canvas)
     ========================================================================== */
  function initSpatialBackgroundCanvas() {
    let canvas = document.getElementById('cad3d-bg-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'cad3d-bg-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.prepend(canvas);
    }

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
    const camera = new THREE.PerspectiveCamera(48, window.innerWidth / Math.max(window.innerHeight, 1), 0.1, 140);
    camera.position.set(0, 0, 18);

    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(pal.signalHex, 0.9);
    dirLight.position.set(8, 12, 10);
    scene.add(dirLight);

    const world = new THREE.Group();
    scene.add(world);

    // 3A. Infinite-style Upper & Lower 3D Perspective Architectural Grid Horizons
    const floorGrid = new THREE.GridHelper(90, 48, pal.signalHex, pal.gridHex);
    floorGrid.position.y = -7.5;
    floorGrid.material.transparent = true;
    floorGrid.material.opacity = 0.36;
    world.add(floorGrid);

    const ceilingGrid = new THREE.GridHelper(90, 48, pal.validHex, pal.gridHex);
    ceilingGrid.position.y = 7.5;
    ceilingGrid.material.transparent = true;
    ceilingGrid.material.opacity = 0.24;
    world.add(ceilingGrid);

    // 3B. 18 Floating 3D Architectural Polyhedra & TorusKnots Across Viewport
    const polyGeos = [
      new THREE.IcosahedronGeometry(1.15, 0),
      new THREE.OctahedronGeometry(1.1, 0),
      new THREE.TorusKnotGeometry(0.75, 0.16, 48, 8),
      new THREE.TorusGeometry(1.05, 0.06, 8, 28),
      new THREE.BoxGeometry(1.2, 1.2, 1.2)
    ];

    const floatingMonuments = [];
    for (let i = 0; i < 18; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const geo = polyGeos[i % polyGeos.length];
      const isSignal = i % 3 === 0;
      const meshGroup = createCadMesh(
        geo,
        {
          color: isSignal ? pal.signalHex : pal.surfaceHex,
          emissive: isSignal ? pal.signalHex : pal.validHex,
          emissiveIntensity: isSignal ? 0.22 : 0.08,
          transparent: true,
          opacity: 0.32
        },
        isSignal ? pal.signalHex : pal.inkHex,
        0.55
      );

      // Place along outer corridors and deep Z space so they frame and shine through the sheets
      const xSpread = (i % 3 === 2 ? (Math.random() - 0.5) * 14 : side * (8.2 + (i % 4) * 2.4));
      const ySpread = 10 - i * 2.6;
      const zSpread = -2 - (i % 5) * 3.8;
      meshGroup.position.set(xSpread, ySpread, zSpread);
      world.add(meshGroup);

      floatingMonuments.push({
        group: meshGroup,
        baseX: xSpread,
        baseY: ySpread,
        baseZ: zSpread,
        rotSpeedX: (0.25 + (i % 4) * 0.12) * (i % 2 === 0 ? 1 : -1),
        rotSpeedY: (0.32 + (i % 3) * 0.14) * (side),
        isSignal
      });
    }

    // 3C. 240 3D Spatial Telemetry Particles
    const particleCount = 240;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 44;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 36;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 28 - 4;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: pal.signalHex,
      size: 0.16,
      transparent: true,
      opacity: 0.65
    });
    const particleSystem = new THREE.Points(pGeo, pMat);
    world.add(particleSystem);

    // 3D. Interactive 3D Shockwave Ring on Click / Card Hover
    const waveGeo = new THREE.RingGeometry(0.8, 0.95, 48);
    const waveMat = new THREE.MeshBasicMaterial({
      color: pal.signalHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });
    const shockwave = new THREE.Mesh(waveGeo, waveMat);
    shockwave.position.z = 2;
    scene.add(shockwave);
    let waveScale = 0.1;
    let waveAlpha = 0;

    window.addEventListener(
      'pointerdown',
      () => {
        waveScale = 0.2;
        waveAlpha = 0.85;
        shockwave.position.x = pointer.tx * 7;
        shockwave.position.y = -pointer.ty * 4.5;
      },
      { passive: true }
    );

    onThemeChange((newPal) => {
      pal = newPal;
      dirLight.color.setHex(pal.signalHex);
      pMat.color.setHex(pal.signalHex);
      waveMat.color.setHex(pal.signalHex);
      floatingMonuments.forEach((m) => {
        const solidMat = m.group.userData.solid.material;
        const wireMat = m.group.userData.wire.material;
        solidMat.color.setHex(m.isSignal ? pal.signalHex : pal.surfaceHex);
        wireMat.color.setHex(m.isSignal ? pal.signalHex : pal.inkHex);
      });
    });

    function resize() {
      const w = window.innerWidth;
      const h = Math.max(window.innerHeight, 1);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    function renderBg(now) {
      const t = now * 0.001;
      const prevSmooth = smoothScroll;
      smoothScroll += (scrollY - smoothScroll) * 0.08;
      scrollVelocity = smoothScroll - prevSmooth;
      pointer.nx += (pointer.tx - pointer.nx) * 0.06;
      pointer.ny += (pointer.ty - pointer.ny) * 0.06;

      // Fly camera & grids with scroll and mouse parallax
      camera.position.x = pointer.nx * 2.2;
      camera.position.y = -pointer.ny * 1.4;
      camera.rotation.z = -pointer.nx * 0.035;
      camera.rotation.x = pointer.ny * 0.03 + Math.max(-0.12, Math.min(0.12, scrollVelocity * 0.0015));

      const gridZOffset = (smoothScroll * 0.025) % 3.75;
      floorGrid.position.z = gridZOffset;
      ceilingGrid.position.z = gridZOffset;

      floatingMonuments.forEach((m, idx) => {
        m.group.rotation.x = t * m.rotSpeedX + smoothScroll * 0.0018;
        m.group.rotation.y = t * m.rotSpeedY + pointer.nx * 0.5;
        const cyclicY = ((m.baseY + smoothScroll * 0.012 + 22) % 44) - 22;
        m.group.position.y = cyclicY;
        m.group.position.x = m.baseX + Math.sin(t * 0.8 + idx) * 0.45;
      });

      particleSystem.rotation.y = t * 0.04 + pointer.nx * 0.12;
      particleSystem.position.y = (smoothScroll * 0.008) % 12;

      if (waveAlpha > 0.01) {
        waveScale += 0.28;
        waveAlpha *= 0.91;
        shockwave.scale.setScalar(waveScale);
        waveMat.opacity = waveAlpha;
        shockwave.rotation.z = t * 2;
      } else {
        waveMat.opacity = 0;
      }

      renderer.render(scene, camera);

      if (!prefersReducedMotion) {
        requestAnimationFrame(renderBg);
      }
    }

    requestAnimationFrame(renderBg);
  }

  /* ==========================================================================
     4. LIVE 3D HOLOGRAM CANVASES + UNFLATTENED MULTI-PLANE 3D CARDS
     ========================================================================== */
  function initSpatialCardPhysics() {
    const selectors = [
      '.portrait-plate-wrap',
      '.spec-cell',
      '.metric-box',
      '.sheet-cell',
      '.timeline-item',
      '.portfolio-item',
      '.blueprint-node',
      '.blueprint-mini-card',
      '.tech-category',
      '.special-item',
      '.skill'
    ];

    const cards = document.querySelectorAll(selectors.join(','));

    // Staggered 3D Scroll Unfold Choreography Observer
    const revealCards = document.querySelectorAll(
      '.portfolio-item, .blueprint-node, .blueprint-mini-card, .tech-category, .special-item, .skill, .timeline-item, .sheet-cell'
    );

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
      revealCards.forEach((c, idx) => {
        c.style.setProperty('--stagger-delay', `${(idx % 4) * 65}ms`);
        c.classList.add('card-3d-init');
      });

      const cardObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.remove('card-3d-init');
              entry.target.classList.add('card-3d-visible');
              cardObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
      );

      revealCards.forEach((c) => cardObserver.observe(c));

      const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
      filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const visibleItems = document.querySelectorAll('.portfolio-item:not(.is-hidden)');
          visibleItems.forEach((item, i) => {
            item.style.setProperty('--stagger-delay', `${(i % 3) * 60}ms`);
            item.classList.remove('card-3d-visible');
            item.classList.add('card-3d-init');
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                item.classList.remove('card-3d-init');
                item.classList.add('card-3d-visible');
              });
            });
          });
        });
      });
    }

    // 3D Geometry definitions for the Live Rotating 3D Hologram Canvas inside each Box
    const tesseractVerts = [];
    for (let i = 0; i < 16; i++) {
      const s = i < 8 ? 0.52 : 1.0;
      tesseractVerts.push([
        (i & 1 ? 1 : -1) * s,
        (i & 2 ? 1 : -1) * s,
        (i & 4 ? 1 : -1) * s
      ]);
    }
    const tesseractEdges = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        const diff = i ^ j;
        if (diff === 1 || diff === 2 || diff === 4 || diff === 8) {
          tesseractEdges.push([i, j]);
        }
      }
    }

    const phi = (1 + Math.sqrt(5)) / 2;
    const icosaVerts = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ].map((v) => {
      const len = Math.hypot(v[0], v[1], v[2]);
      return [v[0] / len, v[1] / len, v[2] / len];
    });
    const icosaEdges = [];
    for (let i = 0; i < icosaVerts.length; i++) {
      for (let j = i + 1; j < icosaVerts.length; j++) {
        const d = Math.hypot(
          icosaVerts[i][0] - icosaVerts[j][0],
          icosaVerts[i][1] - icosaVerts[j][1],
          icosaVerts[i][2] - icosaVerts[j][2]
        );
        if (d < 1.25) icosaEdges.push([i, j]);
      }
    }

    const activeHoloCards = [];

    cards.forEach((card, index) => {
      card.classList.add('spatial-3d-card');

      // 1. Inject Dedicated .cad-box-surface (holds Laser Scanline + Live 3D Hologram Canvas)
      let holoCanvas = null;
      let holoCtx = null;
      if (!card.querySelector('.cad-box-surface')) {
        const surface = document.createElement('div');
        surface.className = 'cad-box-surface';
        surface.setAttribute('aria-hidden', 'true');

        const laser = document.createElement('div');
        laser.className = 'cad-laser-line';
        surface.appendChild(laser);

        if (!card.classList.contains('portrait-plate-wrap')) {
          holoCanvas = document.createElement('canvas');
          holoCanvas.className = 'cad-box-holo-canvas';
          holoCanvas.width = 118;
          holoCanvas.height = 118;
          surface.appendChild(holoCanvas);
          holoCtx = holoCanvas.getContext('2d');
        }

        card.prepend(surface);
      }

      // 2. Inject Floating CAD Corner Brackets & Live 3D Telemetry Badge at Z=48px
      let coordsBadge = null;
      if (!card.querySelector('.cad-box-hud')) {
        const hud = document.createElement('div');
        hud.className = 'cad-box-hud';
        hud.setAttribute('aria-hidden', 'true');
        hud.innerHTML =
          '<span class="cad-corner tl"></span>' +
          '<span class="cad-corner tr"></span>' +
          '<span class="cad-corner bl"></span>' +
          '<span class="cad-corner br"></span>' +
          `<span class="cad-box-coords">3D // SYS-${String(index + 1).padStart(2, '0')}</span>`;
        card.appendChild(hud);
        coordsBadge = hud.querySelector('.cad-box-coords');
      }

      const isWideBox =
        card.classList.contains('timeline-item') || card.classList.contains('sheet-cell');
      const maxTilt = card.classList.contains('portrait-plate-wrap')
        ? 5.5
        : isWideBox
        ? 1.1
        : 2.4;
      const liftTarget = isWideBox ? 2 : 4;

      const cardState = {
        card,
        holoCtx,
        shapeType: index % 3,
        hovered: false,
        inView: false,
        currRX: 0,
        currRY: 0,
        currZ: 0,
        phase: index * 0.7
      };
      activeHoloCards.push(cardState);

      if (prefersReducedMotion || isCoarsePointer) return;

      let targetRX = 0;
      let targetRY = 0;
      let targetZ = 0;
      let velRX = 0;
      let velRY = 0;
      let velZ = 0;
      let rafId = 0;

      function stepSpring() {
        const stiffness = 0.16;
        const damping = 0.75;

        velRX = (velRX + (targetRX - cardState.currRX) * stiffness) * damping;
        velRY = (velRY + (targetRY - cardState.currRY) * stiffness) * damping;
        velZ = (velZ + (targetZ - cardState.currZ) * stiffness) * damping;

        cardState.currRX += velRX;
        cardState.currRY += velRY;
        cardState.currZ += velZ;

        card.style.transform = `perspective(1400px) rotateX(${cardState.currRX.toFixed(2)}deg) rotateY(${cardState.currRY.toFixed(2)}deg) translateY(${(-cardState.currZ).toFixed(1)}px)`;

        const stillMoving =
          Math.abs(velRX) > 0.01 ||
          Math.abs(velRY) > 0.01 ||
          Math.abs(targetRX - cardState.currRX) > 0.02 ||
          Math.abs(targetRY - cardState.currRY) > 0.02 ||
          Math.abs(targetZ - cardState.currZ) > 0.05;

        if (cardState.hovered || stillMoving) {
          rafId = requestAnimationFrame(stepSpring);
        } else {
          card.style.transform = '';
          card.classList.remove('is-tilting');
          rafId = 0;
        }
      }

      card.addEventListener('pointerenter', () => {
        cardState.hovered = true;
        targetZ = liftTarget;
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
        cardState.hovered = false;
        targetRX = 0;
        targetRY = 0;
        targetZ = 0;
        if (!rafId) rafId = requestAnimationFrame(stepSpring);
      });
    });

    // Observe visible cards to animate their internal 3D Rotating Hologram Canvases at 60fps
    if ('IntersectionObserver' in window) {
      const holoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const st = activeHoloCards.find((item) => item.card === entry.target);
            if (st) st.inView = entry.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );
      activeHoloCards.forEach((st) => holoObserver.observe(st.card));
    }

    function renderCardHolograms(now) {
      const t = now * 0.001;
      const pal = getThemePalette();

      activeHoloCards.forEach((st) => {
        if (!st.holoCtx || (!st.inView && !st.hovered)) return;
        const ctx = st.holoCtx;
        ctx.clearRect(0, 0, 118, 118);

        const speedMult = st.hovered ? 2.8 : 0.85;
        const rx = t * 0.7 * speedMult + st.phase + st.currRX * 0.08;
        const ry = t * 0.95 * speedMult + st.phase + st.currRY * 0.08;
        const cosX = Math.cos(rx), sinX = Math.sin(rx);
        const cosY = Math.cos(ry), sinY = Math.sin(ry);

        const verts = st.shapeType === 0 ? tesseractVerts : icosaVerts;
        const edges = st.shapeType === 0 ? tesseractEdges : icosaEdges;
        const radius = st.hovered ? 35 : 29;

        // Draw outer holographic radar ring when hovered
        if (st.hovered) {
          ctx.strokeStyle = pal.valid;
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(59, 59, 46, t * 2, t * 2 + Math.PI * 1.65);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        const projected = verts.map((v) => {
          const x = v[0] * radius;
          const y = v[1] * radius;
          const z = v[2] * radius;
          const y1 = y * cosX - z * sinX;
          const z1 = y * sinX + z * cosX;
          const x2 = x * cosY + z1 * sinY;
          const z2 = -x * sinY + z1 * cosY;
          const scale = 160 / (160 + z2);
          return { x: 59 + x2 * scale, y: 59 + y1 * scale };
        });

        ctx.strokeStyle = st.hovered ? pal.signal : pal.inkMuted;
        ctx.lineWidth = st.hovered ? 1.35 : 1;
        ctx.beginPath();
        edges.forEach((e) => {
          ctx.moveTo(projected[e[0]].x, projected[e[0]].y);
          ctx.lineTo(projected[e[1]].x, projected[e[1]].y);
        });
        ctx.stroke();

        // Glowing vertices
        ctx.fillStyle = st.hovered ? pal.valid : pal.signal;
        projected.forEach((p, idx) => {
          if (idx % 2 === 0 || st.hovered) {
            ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
          }
        });
      });

      if (!prefersReducedMotion) {
        requestAnimationFrame(renderCardHolograms);
      }
    }
    requestAnimationFrame(renderCardHolograms);
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
     6. LIVE ENTERPRISE ARCHITECTURE TRANSACTION SIMULATOR (#archWorkflowSim)
     ========================================================================== */
  function initArchitectureWorkflowSimulator() {
    const container = document.getElementById('archWorkflowSim');
    const stepsEl = document.getElementById('archSimSteps');
    const logEl = document.getElementById('archSimLog');
    const badgeEl = document.getElementById('archSimLatencyBadge');
    if (!container || !stepsEl || !logEl) return;

    const SCENARIOS = {
      iam: {
        totalLatency: '14ms · ZERO-PASSWORD IAM VERIFIED',
        cadNode: 'aws',
        steps: [
          {
            title: 'ECS Fargate Task Role (IAM)',
            desc: 'Requests temporary credentials via AWS Task Metadata Endpoint v4',
            latency: '3ms',
            log: '[00:00.003] IAM_ROLE > Assumed EbrTaskRole (ap-southeast-7) via STS'
          },
          {
            title: '@aws-sdk/rds-signer Token Engine',
            desc: 'Signs cryptographic SigV4 DB token (15-min TTL, port 5432)',
            latency: '4ms',
            log: '[00:00.007] RDS_SIGNER > Generated ephemeral SigV4 auth token (rds-db:connect)'
          },
          {
            title: 'Prisma 7.9 (@prisma/adapter-pg)',
            desc: 'Establishes TLS 1.3 connection pool to Aurora without static password',
            latency: '5ms',
            log: '[00:00.012] PRISMA_7 > TLS 1.3 handshake verified with Aurora PostgreSQL 16'
          },
          {
            title: 'Aurora PostgreSQL Multi-AZ Commit',
            desc: 'Executes GMP Batch Record transaction with immutable audit log',
            latency: '2ms',
            log: '[00:00.014] AURORA_DB > COMMIT OK (0 static passwords stored in env/secrets)'
          }
        ]
      },
      sap: {
        totalLatency: '22ms · 2-WAY SAP B1 SYNC OK',
        cadNode: 'sap',
        steps: [
          {
            title: 'SAP Business One MSSQL (OWOR / ITT1)',
            desc: 'Extracts active Production Orders, BOM components & Route Stages',
            latency: '6ms',
            log: '[00:00.006] SAP_MSSQL > Polled 48 active OWOR production orders (lock-free read)'
          },
          {
            title: 'Node.js ESM Delta Sync Engine',
            desc: 'Computes idempotent hash diff and normalizes routing stages',
            latency: '5ms',
            log: '[00:00.011] NODE_SYNC > Delta computed: 12 updated stages, 0 schema conflicts'
          },
          {
            title: 'Laravel 12 / PHP 8.4 ManHour API',
            desc: 'Broadcasts shop-floor QR job queues & caches state in Redis 7',
            latency: '4ms',
            log: '[00:00.015] LARAVEL_12 > Synced ManHour MySQL & invalidated shop-floor cache'
          },
          {
            title: 'ASP.NET Core 8 SAP Write-Back',
            desc: 'Commits actual labor hours & yield metrics back to SAP B1',
            latency: '7ms',
            log: '[00:00.022] DOTNET8_API > 2-Way SAP write-back verified (Serilog audit recorded)'
          }
        ]
      },
      mcp: {
        totalLatency: '34ms · MCP CONTEXT STREAMED',
        cadNode: 'gmp',
        steps: [
          {
            title: 'Central Cognito OIDC PKCE Auth',
            desc: 'Validates jose JWT session & Cross-App Department RBAC permissions',
            latency: '3ms',
            log: '[00:00.003] COGNITO_SSO > Verified OIDC PKCE session & department RBAC scope'
          },
          {
            title: 'TP Drug Connect (Next.js 16 / React 19)',
            desc: 'Dispatches structured tool request to internal MCP Server',
            latency: '4ms',
            log: '[00:00.007] NEXTJS_16 > Invoking MCP tool: sharepoint.search_documents()'
          },
          {
            title: 'SharePoint MCP & M365 Graph API',
            desc: 'Retrieves authorized SOP PDFs & organizational calendar slots',
            latency: '9ms',
            log: '[00:00.016] MCP_SERVER > Retrieved 5 GMP SOP documents & M365 calendar feed'
          },
          {
            title: 'Hybrid AI Agent Synthesis (Vercel AI SDK)',
            desc: 'Streams grounded engineering answer with zero token leakage',
            latency: '18ms',
            log: '[00:00.034] AI_AGENT > Streamed cited response via Vercel AI SDK (HttpOnly safe)'
          }
        ]
      },
      devsecops: {
        totalLatency: '30ms · QUALITY GATE PASSED',
        cadNode: 'sync',
        steps: [
          {
            title: 'Polyglot Docker DevContainer Matrix',
            desc: 'Spins up isolated Postgres 15, MySQL 8, MSSQL 2022 & Redis 7 test beds',
            latency: '8ms',
            log: '[00:00.008] DEVCONTAINER > Multi-DB test containers healthy (Postgres/MySQL/MSSQL)'
          },
          {
            title: 'SonarQube 26.10 SAST Security Gate',
            desc: 'Scans TypeScript, PHP 8.4 & C# for vulnerabilities and code smells',
            latency: '6ms',
            log: '[00:00.014] SONARQUBE_26 > Quality Gate PASSED (0 Bugs, 0 Security Hotspots)'
          },
          {
            title: 'Playwright 1.61 Automated E2E Suite',
            desc: 'Executes headless browser verification of EBR digital signatures & PDFs',
            latency: '11ms',
            log: '[00:00.025] PLAYWRIGHT_E2E > 42/42 E2E specs passed (Batch Record + PDF export)'
          },
          {
            title: 'GitHub OIDC -> AWS CDK / IIS Watcher',
            desc: 'Deploys changed stacks & dispatches Microsoft Teams Webhook alert',
            latency: '5ms',
            log: '[00:00.030] DEPLOY_OPS > Zero-downtime rollout complete + Teams notification sent'
          }
        ]
      }
    };

    let timers = [];
    function clearSimTimers() {
      timers.forEach((id) => clearTimeout(id));
      timers = [];
    }

    function runScenario(key) {
      const data = SCENARIOS[key] || SCENARIOS.iam;
      clearSimTimers();

      container.querySelectorAll('.arch-sim-btn').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-sim') === key);
      });

      if (badgeEl) {
        badgeEl.textContent = 'SIMULATING PACKET FLOW...';
      }

      stepsEl.innerHTML = data.steps
        .map(
          (s, i) => `
          <div class="arch-sim-step" data-step-idx="${i}">
            <span class="arch-step-num">0${i + 1}</span>
            <div class="arch-step-info">
              <strong>${s.title}</strong>
              <span>${s.desc}</span>
            </div>
            <span class="arch-step-latency">${s.latency}</span>
          </div>
        `
        )
        .join('');

      logEl.textContent = `>>> INIT SCENARIO [${key.toUpperCase()}] // STREAMING TELEMETRY...\n`;

      const stepNodes = stepsEl.querySelectorAll('.arch-sim-step');
      data.steps.forEach((s, idx) => {
        const tId = setTimeout(() => {
          stepNodes.forEach((node, nIdx) => {
            node.classList.toggle('is-active', nIdx === idx);
            node.classList.toggle('is-done', nIdx < idx);
          });
          logEl.textContent += s.log + '\n';
          logEl.scrollTop = logEl.scrollHeight;

          if (idx === data.steps.length - 1) {
            const doneId = setTimeout(() => {
              stepNodes.forEach((node) => {
                node.classList.remove('is-active');
                node.classList.add('is-done');
              });
              if (badgeEl) badgeEl.textContent = 'LATENCY: ' + data.totalLatency;
              logEl.textContent += `>>> STATUS: TRANSACTION VERIFIED (100% INTEGRITY)\n`;
            }, 360);
            timers.push(doneId);
          }
        }, idx * 420 + 80);
        timers.push(tId);
      });
    }

    container.querySelectorAll('.arch-sim-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-sim');
        if (key) runScenario(key);
      });
    });

    // Expose global trigger so Command Palette can launch simulations
    window.triggerArchSimulation = function (key) {
      const archSection = document.getElementById('architecture');
      if (archSection) archSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      runScenario(key);
    };

    runScenario('iam');
  }

  /* ==========================================================================
     7. INTERACTIVE 60FPS T-SHAPED COMPETENCY RADAR & TRACEABILITY INSPECTOR
     ========================================================================== */
  function initSkillRadarAndTraceability() {
    const canvas = document.getElementById('skillRadarCanvas');
    const titleEl = document.getElementById('traceSkillTitle');
    const descEl = document.getElementById('traceSkillDesc');
    const badgeEl = document.getElementById('traceDomainBadge');
    const scoreEl = document.getElementById('traceScoreValue');
    const archEl = document.getElementById('traceArchPattern');
    const impactEl = document.getElementById('traceImpactMetric');
    const pillsEl = document.getElementById('traceProjectPills');
    const overlayLegend = document.getElementById('radarOverlayLegend');
    if (!canvas || !titleEl || !pillsEl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SKILL_DATA = {
      csharp: {
        badge: 'DOMAIN 01 // ENTERPRISE .NET & ERP',
        score: '95% CALIBRATED',
        title: 'C# / ASP.NET Core 8 & Enterprise ERP Sync',
        desc: 'พัฒนา Web API ประสิทธิภาพสูงด้วย .NET 8 และ Entity Framework Core 8 สตรีมมิ่งไฟล์ PDF ขนาดใหญ่ผ่าน HTTP Range Requests, ซิงค์ข้อมูลกับ SAP Business One และเชื่อมต่อหัวชั่งรถบรรทุก RS-232',
        arch: 'ASP.NET Core 8 Web API · EF Core 8 · PdfProxy Streaming · RS-232 Serial',
        impact: 'Sub-second QR PDF Streaming · 24/7 SAP Sync · Zero Weighbridge Fraud',
        radarIdx: 2,
        projects: [
          { id: 'leaflet', name: 'E-Leaflet (.NET 8 + PdfProxy)' },
          { id: 'manhour', name: 'ManHour SAP B1 Sync API' },
          { id: 'ants', name: 'ANTS SMS Platform' },
          { id: 'truckscale', name: 'IoT Truck Scale System' }
        ]
      },
      php: {
        badge: 'DOMAIN 02 // MANUFACTURING BACKEND',
        score: '88% CALIBRATED',
        title: 'PHP 8.4 / Laravel 12 Manufacturing Ecosystem',
        desc: 'ออกแบบระบบคำนวณชั่วโมงแรงงานและต้นทุนสายการผลิตโรงงานยาด้วย Laravel 12, PHP 8.4, Blade และ Vite 7 พร้อม Queue Workers, Sanctum Auth และ Yajra DataTables',
        arch: 'Laravel 12 REST API · Blade + Vite 7 · Redis Queue · MySQL 8 Indexing',
        impact: '99.9% Shop-Floor Uptime · >70% Faster Labor Cost Calculation',
        radarIdx: 0,
        projects: [
          { id: 'manhour', name: 'ManHour Production Ecosystem' },
          { id: 'hongthong', name: 'Enterprise HR & Payroll Engine' }
        ]
      },
      ts: {
        badge: 'DOMAIN 03 // CLOUD IaC & TYPESCRIPT 5',
        score: '92% CALIBRATED',
        title: 'TypeScript 5 & AWS CDK (7-Stack Cloud IaC)',
        desc: 'เขียนโครงสร้างพื้นฐาน Cloud ทั้งหมดด้วย AWS CDK (TypeScript) แยก 7 Stacks พร้อมระบบเชื่อมต่อฐานข้อมูล Aurora แบบไร้รหัสผ่าน (@aws-sdk/rds-signer) และ Type-safe Zod 4 Validation',
        arch: 'AWS CDK (TypeScript) · @aws-sdk/rds-signer · GitHub OIDC Matrix · Zod 4',
        impact: '0 Static DB Passwords · 65% Faster Selective CI/CD Deployments',
        radarIdx: 1,
        projects: [
          { id: 'aws', name: 'AWS CDK 7-Stack Infrastructure' },
          { id: 'ebr', name: 'Electronic Batch Record (EBR)' },
          { id: 'corporate', name: '4-App SSO & SharePoint MCP' },
          { id: 'jarvis', name: 'JARVIS AI Agent OS' }
        ]
      },
      nextjs: {
        badge: 'DOMAIN 04 // MODERN FULL-STACK & SSR',
        score: '90% CALIBRATED',
        title: 'Next.js 16 / React 19 Compiler / Bun 1.3',
        desc: 'สร้างเว็บแอปพลิเคชันระดับ Enterprise ด้วย Next.js 16 App Router, React 19 Compiler และ Bun 1.3 Runtime เชื่อมต่อฐานข้อมูลผ่าน Prisma 7.9 และสร้างเอกสาร PDF ฝั่งเซิร์ฟเวอร์ด้วย pdf-lib',
        arch: 'Next.js 16 SSR · React 19 Compiler · Bun 1.3 · Prisma 7.9 · Cognito OIDC',
        impact: '100% Paperless GMP Batch Record · 4 Unified Intranet Apps',
        radarIdx: 0,
        projects: [
          { id: 'ebr', name: 'Electronic Batch Record (EBR)' },
          { id: 'corporate', name: 'TP Drug Connect & Employee SSO' },
          { id: 'tdmaster', name: 'TD Master Quant Journal' },
          { id: 'crossmatch', name: 'CrossMatch Multi-Branch POS' }
        ]
      },
      kotlin: {
        badge: 'DOMAIN 05 // AUTOMOTIVE & REAL-TIME DSP',
        score: '88% CALIBRATED',
        title: 'Android Kotlin (Android Auto) & 60fps Acoustic DSP',
        desc: 'พัฒนา Native Android (Kotlin) สื่อสารกับ Android Auto SDK เพื่อยิงภาพหน้าจอขึ้นจอรถ MG S5 EV 12.8" แบบไร้สาย และพัฒนาเอนจินวิเคราะห์เสียงเครื่องยนต์ 60fps FFT Spectrogram',
        arch: 'Kotlin CarAppService · MediaProjection · Web Audio 2048-Bin FFT DSP',
        impact: 'Zero-Hotspot 60fps In-Car Projection · Real-Time 8-Fault Engine AI',
        radarIdx: 5,
        projects: [
          { id: 'carshare', name: 'Car Share Mirror (MG S5 EV)' },
          { id: 'acousticar', name: 'AcoustiCar AI (60fps FFT DSP)' }
        ]
      },
      node: {
        badge: 'DOMAIN 06 // ETL MIDDLEWARE & MCP SERVERS',
        score: '88% CALIBRATED',
        title: 'Node.js (ESM) Sync & Model Context Protocol (MCP)',
        desc: 'พัฒนาสคริปต์ซิงค์ข้อมูล 2 ทิศทางระหว่าง SAP Business One (MSSQL) กับ MySQL แบบ Idempotent และสร้าง SharePoint MCP Server (@modelcontextprotocol/sdk) เชื่อมต่อเอกสารองค์กร',
        arch: 'Node.js ESM ETL · @modelcontextprotocol/sdk · SharePoint & M365 Graph',
        impact: '24/7 Lock-Free SAP ERP Sync · Enterprise-Ready AI Context',
        radarIdx: 4,
        projects: [
          { id: 'corporate', name: 'SharePoint MCP & Connect Intranet' },
          { id: 'manhour', name: 'SAP Business One 2-Way Sync' },
          { id: 'jarvis', name: 'JARVIS MCP Tool Runner' }
        ]
      },
      go: {
        badge: 'DOMAIN 07 // DEVSECOPS & CONTAINERS',
        score: '90% CALIBRATED',
        title: 'DevSecOps Quality Gates, Docker & High-Concurrency APIs',
        desc: 'ยกระดับคุณภาพโค้ดด้วย SonarQube 26.10 SAST, ชุดทดสอบ Playwright 1.61 E2E และสร้าง Polyglot Docker DevContainer ที่รัน Postgres, MySQL, MSSQL และ Redis พร้อมกันในคำสั่งเดียว',
        arch: 'SonarQube 26 SAST · Playwright 1.61 E2E · Polyglot Docker DevContainer',
        impact: '1-Command Developer Onboarding · Automated Zero-Downtime Rollback',
        radarIdx: 3,
        projects: [
          { id: 'devtools', name: 'SonarQube & Docker DevContainer' },
          { id: 'ebr', name: 'Playwright E2E Verified EBR' },
          { id: 'aws', name: 'ECS Fargate Container Infra' }
        ]
      },
      python: {
        badge: 'DOMAIN 08 // AI AGENTS, VISION & CLOUD LAMBDA',
        score: '89% CALIBRATED',
        title: 'AI Agents, Hybrid LLM (Ollama/Groq) & Cloud Automation',
        desc: 'ผสานโมเดล AI ทั้งแบบ Local (Ollama qwen3.6:27b) และ Cloud (Groq llama-3.3-70b) เข้ากับระบบตรวจจับท่าทางมือ MediaPipe Vision, Three.js 3D และ AWS Lambda',
        arch: 'Vercel AI SDK · Ollama / Groq · MediaPipe Tasks Vision · Python Lambda',
        impact: 'Multimodal Voice/Gesture AI Control · Automated Cloud DB Bootstrap',
        radarIdx: 4,
        projects: [
          { id: 'jarvis', name: 'JARVIS Multimodal AI OS' },
          { id: 'acousticar', name: 'AcoustiCar AI Diagnostics' },
          { id: 'tdmaster', name: 'TD Master TradingView MCP' }
        ]
      }
    };

    const RADAR_AXES = [
      { label: 'Full-Stack Web', short: 'NEXT16 / L12', value: 0.94, skillKey: 'nextjs' },
      { label: 'Cloud & CDK IaC', short: 'AWS CDK / IAM', value: 0.92, skillKey: 'ts' },
      { label: 'ERP & .NET 8', short: 'SAP B1 / C#', value: 0.95, skillKey: 'csharp' },
      { label: 'DevSecOps & QA', short: 'SONAR / E2E', value: 0.90, skillKey: 'go' },
      { label: 'AI & MCP SDK', short: 'MCP / LLM', value: 0.89, skillKey: 'python' },
      { label: 'Automotive & DSP', short: 'KOTLIN / FFT', value: 0.88, skillKey: 'kotlin' }
    ];

    const OVERLAYS = {
      none: null,
      frontend: [0.92, 0.35, 0.30, 0.48, 0.45, 0.25],
      devops: [0.40, 0.92, 0.42, 0.88, 0.38, 0.20]
    };

    let activeOverlay = 'none';
    let selectedRadarIdx = 2; // Starts on C# / .NET 8

    function selectSkill(key) {
      const info = SKILL_DATA[key];
      if (!info) return;

      selectedRadarIdx = info.radarIdx;
      if (badgeEl) badgeEl.textContent = info.badge;
      if (scoreEl) scoreEl.textContent = info.score;
      titleEl.textContent = info.title;
      if (descEl) descEl.textContent = info.desc;
      if (archEl) archEl.textContent = info.arch;
      if (impactEl) impactEl.textContent = info.impact;

      pillsEl.innerHTML = info.projects
        .map(
          (p) =>
            `<button type="button" class="trace-proj-pill" onclick="openProjectDetail('${p.id}')"><i class="fas fa-cube"></i> ${p.name} →</button>`
        )
        .join('');

      document.querySelectorAll('.skill[data-skill-key]').forEach((el) => {
        el.classList.toggle('is-selected', el.getAttribute('data-skill-key') === key);
      });
    }

    document.querySelectorAll('.skill[data-skill-key]').forEach((el) => {
      el.addEventListener('click', () => {
        const key = el.getAttribute('data-skill-key');
        if (key) selectSkill(key);
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const key = el.getAttribute('data-skill-key');
          if (key) selectSkill(key);
        }
      });
    });

    document.querySelectorAll('.radar-cmp-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeOverlay = btn.getAttribute('data-overlay') || 'none';
        document.querySelectorAll('.radar-cmp-btn').forEach((b) => {
          b.classList.toggle('active', b === btn);
        });
        if (overlayLegend) {
          overlayLegend.hidden = activeOverlay === 'none';
        }
      });
    });

    // Click on Radar Canvas vertex to inspect that domain
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * canvas.width;
      const my = ((e.clientY - rect.top) / Math.max(rect.height, 1)) * canvas.height;
      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.52;
      const angle = Math.atan2(my - cy, mx - cx);
      let norm = angle + Math.PI * 0.5;
      if (norm < 0) norm += Math.PI * 2;
      const step = (Math.PI * 2) / RADAR_AXES.length;
      const idx = Math.round(norm / step) % RADAR_AXES.length;
      const axis = RADAR_AXES[idx];
      if (axis) selectSkill(axis.skillKey);
    });

    function renderRadar(now) {
      const t = now * 0.001;
      const pal = getThemePalette();
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.52;
      const maxR = Math.min(w, h) * 0.34;

      ctx.clearRect(0, 0, w, h);

      // Draw concentric hexagonal rings
      for (let ring = 1; ring <= 4; ring++) {
        const r = (maxR * ring) / 4;
        ctx.beginPath();
        RADAR_AXES.forEach((_, idx) => {
          const a = (idx * Math.PI * 2) / RADAR_AXES.length - Math.PI * 0.5;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.strokeStyle = ring === 4 ? pal.inkMuted : pal.inkFaint;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Axis spokes
      RADAR_AXES.forEach((axis, idx) => {
        const a = (idx * Math.PI * 2) / RADAR_AXES.length - Math.PI * 0.5;
        const x = cx + Math.cos(a) * maxR;
        const y = cy + Math.sin(a) * maxR;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = idx === selectedRadarIdx ? pal.signal : pal.inkFaint;
        ctx.lineWidth = idx === selectedRadarIdx ? 1.5 : 1;
        ctx.stroke();
      });

      // Optional comparison overlay polygon
      const ov = OVERLAYS[activeOverlay];
      if (ov) {
        ctx.beginPath();
        ov.forEach((val, idx) => {
          const a = (idx * Math.PI * 2) / RADAR_AXES.length - Math.PI * 0.5;
          const r = maxR * val;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.14)';
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.6;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Primary T-Shaped Polygon
      ctx.beginPath();
      const pts = RADAR_AXES.map((axis, idx) => {
        const a = (idx * Math.PI * 2) / RADAR_AXES.length - Math.PI * 0.5;
        const pulse = Math.sin(t * 2.2 + idx) * 0.015;
        const r = maxR * (axis.value + pulse);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        return { x, y, a, axis, idx };
      });
      ctx.closePath();
      ctx.fillStyle = pal.signalSoft;
      ctx.fill();
      ctx.strokeStyle = pal.signal;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Vertices & Labels
      ctx.font = '700 10px "Commit Mono", monospace';
      ctx.textAlign = 'center';
      pts.forEach((p) => {
        const isSel = p.idx === selectedRadarIdx;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isSel ? 5.5 : 3.8, 0, Math.PI * 2);
        ctx.fillStyle = isSel ? pal.valid : pal.signal;
        ctx.fill();

        const lx = cx + Math.cos(p.a) * (maxR + 28);
        const ly = cy + Math.sin(p.a) * (maxR + 22);
        ctx.fillStyle = isSel ? pal.signal : pal.ink;
        ctx.fillText(p.axis.label, lx, ly);
        ctx.fillStyle = pal.inkMuted;
        ctx.fillText(`${Math.round(p.axis.value * 100)}%`, lx, ly + 12);
      });

      if (!prefersReducedMotion) {
        requestAnimationFrame(renderRadar);
      }
    }

    selectSkill('csharp');
    requestAnimationFrame(renderRadar);
  }

  /* ==========================================================================
     8. EXECUTIVE COMMAND PALETTE & PERSONA LENS (Ctrl+K)
     ========================================================================== */
  function initExecutiveCommandPalette() {
    const floatBtn = document.getElementById('execCmdFloatingBtn');
    const modal = document.getElementById('execCommandModal');
    const backdrop = document.getElementById('execCmdBackdrop');
    const closeBtn = document.getElementById('execCmdCloseBtn');
    const input = document.getElementById('execCmdInput');
    const resultsEl = document.getElementById('execCmdResults');
    const lensPills = document.querySelectorAll('.exec-lens-pill');
    if (!modal || !resultsEl || !input) return;

    const COMMAND_ITEMS = [
      {
        title: 'Simulate: Zero-Password IAM DB Handshake (@aws-sdk/rds-signer)',
        sub: 'Live Interactive Architecture Trace · Aurora PostgreSQL 16 + ECS Fargate',
        tag: 'LIVE SIMULATOR',
        icon: 'fa-shield-alt',
        lens: 'cto',
        action: () => window.triggerArchSimulation && window.triggerArchSimulation('iam')
      },
      {
        title: 'Simulate: SAP Business One 2-Way Production Sync (OWOR)',
        sub: 'Live Interactive Architecture Trace · MSSQL ↔ Node.js ↔ Laravel 12 ↔ .NET 8',
        tag: 'LIVE SIMULATOR',
        icon: 'fa-sync-alt',
        lens: 'erp',
        action: () => window.triggerArchSimulation && window.triggerArchSimulation('sap')
      },
      {
        title: 'Simulate: SharePoint MCP Server & Hybrid AI Agent Call',
        sub: 'Live Interactive Architecture Trace · Cognito OIDC ↔ Next.js 16 ↔ MCP SDK',
        tag: 'LIVE SIMULATOR',
        icon: 'fa-robot',
        lens: 'fullstack',
        action: () => window.triggerArchSimulation && window.triggerArchSimulation('mcp')
      },
      {
        title: 'Simulate: SonarQube 26 SAST + Playwright E2E Quality Gate',
        sub: 'Live Interactive Architecture Trace · Docker DevContainer ↔ GitHub OIDC',
        tag: 'LIVE SIMULATOR',
        icon: 'fa-check-double',
        lens: 'cto',
        action: () => window.triggerArchSimulation && window.triggerArchSimulation('devsecops')
      },
      {
        title: 'Electronic Batch Record (EBR) — GMP Digital Manufacturing',
        sub: 'Next.js 16 · React 19 Compiler · Bun 1.3 · Prisma 7.9 · RDS IAM Signer · Playwright E2E',
        tag: 'PROJECT #01',
        icon: 'fa-pills',
        lens: 'erp',
        action: () => window.openProjectDetail && window.openProjectDetail('ebr')
      },
      {
        title: 'Enterprise AWS CDK (TypeScript) 7-Stack Cloud Infrastructure',
        sub: 'CloudFront+ACM · Multi-Tier VPC · ECS Fargate · Aurora IAM DB · GitHub OIDC',
        tag: 'PROJECT #09',
        icon: 'fa-cloud',
        lens: 'cto',
        action: () => window.openProjectDetail && window.openProjectDetail('aws')
      },
      {
        title: 'TP Drug 4-App Intranet, Central Cognito SSO & SharePoint MCP',
        sub: 'Employee IdP · AppCenter Portal · Connect Intranet · M365 Graph · Cross-App RBAC',
        tag: 'PROJECT #08',
        icon: 'fa-network-wired',
        lens: 'fullstack',
        action: () => window.openProjectDetail && window.openProjectDetail('corporate')
      },
      {
        title: 'ManHour Production Ecosystem & SAP Business One Sync',
        sub: 'Laravel 12 · PHP 8.4 · MySQL · SAP MSSQL · Node.js ESM · ASP.NET Core 8',
        tag: 'PROJECT #02',
        icon: 'fa-industry',
        lens: 'erp',
        action: () => window.openProjectDetail && window.openProjectDetail('manhour')
      },
      {
        title: 'JARVIS AI — Multimodal Agentic OS & MCP Engine',
        sub: 'Vercel AI SDK · @modelcontextprotocol/sdk · Ollama Qwen 3.6 · React Three Fiber 3D',
        tag: 'PROJECT #06',
        icon: 'fa-microchip',
        lens: 'fullstack',
        action: () => window.openProjectDetail && window.openProjectDetail('jarvis')
      },
      {
        title: 'AcoustiCar AI™ — 60fps FFT Vehicle Acoustic Diagnostics',
        sub: 'Web Audio API Raw DSP · Waterfall Spectrogram · Polar Radar · 8-Fault Synthesizer',
        tag: 'PROJECT #13',
        icon: 'fa-wave-square',
        lens: 'fullstack',
        action: () => window.openProjectDetail && window.openProjectDetail('acousticar')
      },
      {
        title: 'DevSecOps Quality Gates & Polyglot Docker DevContainer',
        sub: 'SonarQube 26 SAST · Playwright 1.61 E2E · 1-Command Multi-DB Docker · IIS Watcher',
        tag: 'PROJECT #14',
        icon: 'fa-cubes',
        lens: 'cto',
        action: () => window.openProjectDetail && window.openProjectDetail('devtools')
      },
      {
        title: 'Car Share Mirror — Wireless Android Auto (MG S5 EV 12.8")',
        sub: 'Native Android Kotlin · Android Auto SDK · MediaProjection 60fps Streaming',
        tag: 'PROJECT #04',
        icon: 'fa-car',
        lens: 'fullstack',
        action: () => window.openProjectDetail && window.openProjectDetail('carshare')
      },
      {
        title: 'E-Leaflet — Smart Drug Registration & Patient QR Streaming',
        sub: 'C# ASP.NET Core 8 · EF Core 8 · HTTP Range Request PdfProxy · Expiry Alerts',
        tag: 'PROJECT #03',
        icon: 'fa-qrcode',
        lens: 'erp',
        action: () => window.openProjectDetail && window.openProjectDetail('leaflet')
      },
      {
        title: 'Launch Interactive Mini-Projects Lab (Cyber Strike Game, E-Commerce, Mobile UI)',
        sub: 'Open live playable showcase modal',
        tag: 'INTERACTIVE LAB',
        icon: 'fa-flask',
        lens: 'all',
        action: () => window.openProjectsModal && window.openProjectsModal()
      }
    ];

    let activeLens = 'all';

    function applyPortfolioLensHighlight(lens) {
      const map = {
        cto: ['aws', 'devtools', 'ebr', 'corporate'],
        fullstack: ['ebr', 'jarvis', 'corporate', 'acousticar', 'carshare', 'tdmaster'],
        erp: ['ebr', 'manhour', 'leaflet', 'hongthong', 'truckscale', 'ants']
      };
      const priorityIds = map[lens] || [];
      document.querySelectorAll('.portfolio-item[data-project-id]').forEach((card) => {
        const pid = card.getAttribute('data-project-id');
        card.classList.toggle('lens-priority', priorityIds.includes(pid));
      });
    }

    function renderResults() {
      const q = (input.value || '').trim().toLowerCase();
      const filtered = COMMAND_ITEMS.filter((item) => {
        const matchesLens = activeLens === 'all' || item.lens === activeLens || item.lens === 'all';
        const matchesQuery =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.sub.toLowerCase().includes(q) ||
          item.tag.toLowerCase().includes(q);
        return matchesLens && matchesQuery;
      });

      resultsEl.innerHTML = filtered
        .map(
          (item, idx) => `
          <button type="button" class="exec-cmd-item ${idx === 0 ? 'is-focused' : ''}" data-cmd-idx="${idx}">
            <div class="exec-cmd-item-left">
              <span class="exec-cmd-icon"><i class="fas ${item.icon}"></i></span>
              <div>
                <span class="exec-cmd-item-title">${item.title}</span>
                <span class="exec-cmd-item-sub">${item.sub}</span>
              </div>
            </div>
            <span class="exec-cmd-tag">${item.tag}</span>
          </button>
        `
        )
        .join('');

      resultsEl.querySelectorAll('.exec-cmd-item').forEach((btn, idx) => {
        btn.addEventListener('click', () => {
          const chosen = filtered[idx];
          closePalette();
          if (chosen && typeof chosen.action === 'function') chosen.action();
        });
      });
    }

    function openPalette() {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      input.value = '';
      renderResults();
      setTimeout(() => input.focus(), 40);
    }

    function closePalette() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }

    if (floatBtn) floatBtn.addEventListener('click', openPalette);
    if (backdrop) backdrop.addEventListener('click', closePalette);
    if (closeBtn) closeBtn.addEventListener('click', closePalette);
    input.addEventListener('input', renderResults);

    lensPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        activeLens = pill.getAttribute('data-lens') || 'all';
        lensPills.forEach((p) => p.classList.toggle('active', p === pill));
        applyPortfolioLensHighlight(activeLens);
        renderResults();
      });
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modal.classList.contains('is-open')) closePalette();
        else openPalette();
      } else if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closePalette();
      }
    });
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
    initArchitectureWorkflowSimulator();
    initSkillRadarAndTraceability();
    initExecutiveCommandPalette();
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
