/* ==========================================================================
   THANAPAT PISAVONG — OVERDRIVE 3D CAD & SPATIAL BLUEPRINT ENGINE
   High-DPI 3D Matrix Projection Renderer, Interactive 3D Hero Gyro Core,
   3D Enterprise Topology Stage, Scroll-Reactive 3D Margin Wireframes,
   and Spring-Physics Multi-Plane 3D Cards
   ========================================================================== */

(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getPalette() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark
      ? {
          ink: '#e8e4da',
          inkMuted: 'rgba(197, 209, 222, 0.42)',
          grid: 'rgba(143, 163, 184, 0.22)',
          gridStrong: 'rgba(197, 209, 222, 0.38)',
          signal: '#f97316',
          valid: '#34d399',
          bg: '#152030'
        }
      : {
          ink: '#102238',
          inkMuted: 'rgba(16, 34, 56, 0.42)',
          grid: 'rgba(16, 34, 56, 0.14)',
          gridStrong: 'rgba(16, 34, 56, 0.28)',
          signal: '#9a3412',
          valid: '#166534',
          bg: '#f5f2eb'
        };
  }

  /* ===== 3D MATH & PROJECTION PRIMITIVES ===== */
  function rotate3D(pt, rx, ry, rz = 0) {
    let { x, y, z } = pt;
    // Rotate Y (yaw)
    const cy = Math.cos(ry);
    const sy = Math.sin(ry);
    const x1 = x * cy + z * sy;
    const z1 = -x * sy + z * cy;
    // Rotate X (pitch)
    const cx = Math.cos(rx);
    const sx = Math.sin(rx);
    const y2 = y * cx - z1 * sx;
    const z2 = y * sx + z1 * cx;
    // Rotate Z (roll)
    if (rz !== 0) {
      const cz = Math.cos(rz);
      const sz = Math.sin(rz);
      return { x: x1 * cz - y2 * sz, y: x1 * sz + y2 * cz, z: z2 };
    }
    return { x: x1, y: y2, z: z2 };
  }

  function project3D(pt, w, h, fov, camDist) {
    const zOffset = camDist - pt.z;
    const scale = fov / Math.max(zOffset, 0.5);
    return {
      x: w * 0.5 + pt.x * scale,
      y: h * 0.5 - pt.y * scale,
      scale,
      depth: zOffset
    };
  }

  function makeBoxWireframe(hx, hy, hz) {
    const v = [
      { x: -hx, y: -hy, z: -hz },
      { x: hx, y: -hy, z: -hz },
      { x: hx, y: hy, z: -hz },
      { x: -hx, y: hy, z: -hz },
      { x: -hx, y: -hy, z: hz },
      { x: hx, y: -hy, z: hz },
      { x: hx, y: hy, z: hz },
      { x: -hx, y: hy, z: hz }
    ];
    const e = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];
    return { v, e };
  }

  function makeOctahedronWireframe(r) {
    const v = [
      { x: 0, y: r, z: 0 },
      { x: 0, y: -r, z: 0 },
      { x: r, y: 0, z: 0 },
      { x: -r, y: 0, z: 0 },
      { x: 0, y: 0, z: r },
      { x: 0, y: 0, z: -r }
    ];
    const e = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [4, 3], [3, 5], [5, 2]
    ];
    return { v, e };
  }

  function makeCylinderWireframe(r, h, segs = 10) {
    const v = [];
    const e = [];
    const hh = h * 0.5;
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      const cx = Math.cos(a) * r;
      const cz = Math.sin(a) * r;
      v.push({ x: cx, y: -hh, z: cz });
      v.push({ x: cx, y: hh, z: cz });
      const b = i * 2;
      const next = ((i + 1) % segs) * 2;
      e.push([b, next], [b + 1, next + 1], [b, b + 1]);
    }
    return { v, e };
  }

  /* ========================================================================
     1. FIRST-VIEWPORT 3D CAD GYROSCOPE & SYSTEM CORE (#hero3dCoreCanvas)
     ======================================================================== */
  function initHero3dCore() {
    const wrap = document.getElementById('hero3dCoreWrap');
    const canvas = document.getElementById('hero3dCoreCanvas');
    const readout = document.getElementById('hero3dCoreReadout');
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 232;
    let h = 184;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = Math.max(rect.width, 200);
      h = Math.max(rect.height, 160);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const coreOct = makeOctahedronWireframe(1.15);
    const innerBox = makeBoxWireframe(0.58, 0.58, 0.58);

    // 3 Gimbal Rings
    const makeRing = (radius, axis, steps = 36) => {
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        if (axis === 'xz') pts.push({ x: Math.cos(a) * radius, y: 0, z: Math.sin(a) * radius });
        else if (axis === 'xy') pts.push({ x: Math.cos(a) * radius, y: Math.sin(a) * radius, z: 0 });
        else pts.push({ x: 0, y: Math.cos(a) * radius, z: Math.sin(a) * radius });
      }
      return pts;
    };

    const ringXZ = makeRing(1.65, 'xz');
    const ringXY = makeRing(1.42, 'xy');
    const ringYZ = makeRing(1.85, 'yz');

    const satellites = [
      { label: 'L12', angle: 0.2, radius: 1.85, speed: 0.018, plane: 'xz' },
      { label: 'N16', angle: 2.1, radius: 1.65, speed: -0.022, plane: 'xy' },
      { label: '.NET8', angle: 4.0, radius: 1.85, speed: 0.015, plane: 'yz' },
      { label: 'AWS', angle: 1.1, radius: 1.42, speed: 0.025, plane: 'xz' }
    ];

    let yaw = 0.6;
    let pitch = 0.38;
    let targetYaw = yaw;
    let targetPitch = pitch;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let spinPhase = 0;

    wrap.addEventListener('pointerdown', (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      wrap.setPointerCapture(e.pointerId);
    });

    wrap.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      targetYaw += (e.clientX - lastX) * 0.014;
      targetPitch = Math.max(-1.2, Math.min(1.2, targetPitch + (e.clientY - lastY) * 0.014));
      lastX = e.clientX;
      lastY = e.clientY;
    });

    const endDrag = () => {
      dragging = false;
    };
    wrap.addEventListener('pointerup', endDrag);
    wrap.addEventListener('pointercancel', endDrag);

    const draw = () => {
      const pal = getPalette();
      ctx.clearRect(0, 0, w, h);

      // Subtle CAD Crosshair Reticle
      ctx.strokeStyle = pal.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.5);
      ctx.lineTo(w, h * 0.5);
      ctx.moveTo(w * 0.5, 0);
      ctx.lineTo(w * 0.5, h);
      ctx.stroke();

      if (!prefersReducedMotion && !dragging) {
        targetYaw += 0.009;
      }
      spinPhase += 0.022;
      yaw += (targetYaw - yaw) * 0.12;
      pitch += (targetPitch - pitch) * 0.12;

      const fov = 175;
      const camDist = 4.6;

      // Draw 3 Gimbal Rings
      const drawRing = (pts, rRx, rRy, rRz, color, dashed = false) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.15;
        if (dashed) ctx.setLineDash([4, 3]);
        ctx.beginPath();
        pts.forEach((p, idx) => {
          const r1 = rotate3D(p, rRx, rRy, rRz);
          const r2 = rotate3D(r1, pitch, yaw);
          const pr = project3D(r2, w, h, fov, camDist);
          if (idx === 0) ctx.moveTo(pr.x, pr.y);
          else ctx.lineTo(pr.x, pr.y);
        });
        ctx.stroke();
        ctx.restore();
      };

      drawRing(ringXZ, 0.35, spinPhase * 0.6, 0, pal.inkMuted, false);
      drawRing(ringXY, -spinPhase * 0.5, 0.4, 0.2, pal.signal, true);
      drawRing(ringYZ, 0.2, -spinPhase * 0.4, 0.5, pal.valid, false);

      // Draw Inner Box
      const boxProj = innerBox.v.map((v) =>
        project3D(rotate3D(rotate3D(v, -spinPhase, -spinPhase * 1.2), pitch, yaw), w, h, fov, camDist)
      );
      ctx.strokeStyle = pal.valid;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      innerBox.e.forEach(([a, b]) => {
        ctx.moveTo(boxProj[a].x, boxProj[a].y);
        ctx.lineTo(boxProj[b].x, boxProj[b].y);
      });
      ctx.stroke();

      // Draw Outer Octahedron Core
      const octProj = coreOct.v.map((v) =>
        project3D(rotate3D(rotate3D(v, spinPhase * 0.4, spinPhase * 0.8), pitch, yaw), w, h, fov, camDist)
      );
      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 1.65;
      ctx.beginPath();
      coreOct.e.forEach(([a, b]) => {
        ctx.moveTo(octProj[a].x, octProj[a].y);
        ctx.lineTo(octProj[b].x, octProj[b].y);
      });
      ctx.stroke();

      // Draw Orbiting Satellites
      ctx.font = '700 9.5px "Commit Mono", monospace';
      satellites.forEach((s, idx) => {
        if (!prefersReducedMotion) s.angle += s.speed;
        let pt;
        if (s.plane === 'xz') pt = { x: Math.cos(s.angle) * s.radius, y: 0, z: Math.sin(s.angle) * s.radius };
        else if (s.plane === 'xy') pt = { x: Math.cos(s.angle) * s.radius, y: Math.sin(s.angle) * s.radius, z: 0 };
        else pt = { x: 0, y: Math.cos(s.angle) * s.radius, z: Math.sin(s.angle) * s.radius };

        const pr = project3D(rotate3D(pt, pitch, yaw), w, h, fov, camDist);
        ctx.fillStyle = idx % 2 === 0 ? pal.signal : pal.valid;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = pal.ink;
        ctx.fillText(s.label, pr.x + 5, pr.y + 3);
      });

      if (readout) {
        const degY = Math.round(((yaw * 180) / Math.PI) % 360);
        const degP = Math.round((pitch * 180) / Math.PI);
        readout.textContent = `ROT: ${degY}°/${degP}° · DRAG 3D`;
      }

      if (!prefersReducedMotion) {
        requestAnimationFrame(draw);
      }
    };

    draw();
  }

  /* ========================================================================
     2. INTERACTIVE 3D ENTERPRISE TOPOLOGY STAGE (#cad3dTopologyCanvas)
     ======================================================================== */
  function initTopology3dStage() {
    const stageWrap = document.getElementById('blueprint3dStage');
    const box = document.getElementById('cad3dTopologyBox');
    const canvas = document.getElementById('cad3dTopologyCanvas');
    const coordsEl = document.getElementById('cad3dTelemetryCoords');
    const readoutEl = document.getElementById('cad3dNodeReadout');
    if (!stageWrap || !box || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 900;
    let h = 360;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(box.clientWidth, 300);
      h = Math.max(box.clientHeight, 300);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // 5 Enterprise Nodes in 3D World Coordinates
    const nodes = {
      sap: {
        id: 'sap',
        name: '01 // SAP B1 ERP (MSSQL OWOR)',
        pos: { x: -5.2, y: 0.2, z: 0.6 },
        mesh: makeCylinderWireframe(1.05, 1.85, 12),
        colorKey: 'ink',
        rotSpeed: 0.008
      },
      sync: {
        id: 'sync',
        name: '02 // SYNC MIDDLEWARE (NODE.JS + .NET 8)',
        pos: { x: 0, y: 0.35, z: 0 },
        mesh: makeOctahedronWireframe(1.45),
        colorKey: 'signal',
        rotSpeed: 0.014
      },
      gmp: {
        id: 'gmp',
        name: '03 // EBR & MANHOUR GMP SHOP FLOOR',
        pos: { x: 5.2, y: 0.2, z: 0.6 },
        mesh: makeBoxWireframe(0.95, 0.95, 0.95),
        colorKey: 'valid',
        rotSpeed: -0.009
      },
      aws: {
        id: 'aws',
        name: '04 // AWS ECS FARGATE & AURORA DB',
        pos: { x: -2.4, y: 1.85, z: -2.5 },
        mesh: makeOctahedronWireframe(1.1),
        colorKey: 'ink',
        rotSpeed: 0.011
      },
      edge: {
        id: 'edge',
        name: '05 // ANDROID AUTO (MG S5 EV) & IOT',
        pos: { x: 2.5, y: -0.5, z: 2.6 },
        mesh: makeCylinderWireframe(0.95, 1.4, 6),
        colorKey: 'valid',
        rotSpeed: 0.012
      }
    };

    const links = [
      { from: 'sap', to: 'sync', accent: 'signal' },
      { from: 'sync', to: 'gmp', accent: 'valid' },
      { from: 'sync', to: 'aws', accent: 'signal' },
      { from: 'aws', to: 'gmp', accent: 'valid' },
      { from: 'sync', to: 'edge', accent: 'valid' }
    ];

    const packets = links.map((lk, idx) => ({
      link: lk,
      t: (idx * 0.23) % 1,
      speed: 0.005 + idx * 0.0007
    }));

    let targetYaw = 0.48;
    let targetPitch = 0.42;
    let curYaw = targetYaw;
    let curPitch = targetPitch;
    let autoOrbit = !prefersReducedMotion;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let localRot = 0;

    box.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.cad3d-label')) return;
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      box.setPointerCapture(e.pointerId);
    });

    box.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      targetYaw -= dx * 0.0075;
      targetPitch = Math.max(0.08, Math.min(1.38, targetPitch + dy * 0.0065));
    });

    const stopDrag = () => {
      isDragging = false;
    };
    box.addEventListener('pointerup', stopDrag);
    box.addEventListener('pointercancel', stopDrag);

    // Camera Preset Buttons
    const camBtns = stageWrap.querySelectorAll('.cad3d-btn[data-cam]');
    const orbitBtn = document.getElementById('cad3dOrbitBtn');
    camBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-cam');
        if (mode === 'orbit') {
          autoOrbit = !autoOrbit;
          btn.classList.toggle('active', autoOrbit);
          return;
        }
        camBtns.forEach((b) => {
          if (b !== orbitBtn) b.classList.remove('active');
        });
        btn.classList.add('active');
        if (mode === 'iso') {
          targetYaw = 0.52;
          targetPitch = 0.44;
        } else if (mode === 'top') {
          targetYaw = 0.0;
          targetPitch = 1.32;
        } else if (mode === 'front') {
          targetYaw = 0.0;
          targetPitch = 0.1;
        }
      });
    });

    const labelEls = Array.from(stageWrap.querySelectorAll('.cad3d-label[data-node]'));
    labelEls.forEach((lbl) => {
      lbl.addEventListener('pointerenter', () => {
        const key = lbl.getAttribute('data-node');
        if (nodes[key] && readoutEl) {
          readoutEl.textContent = `ACTIVE NODE // ${nodes[key].name}`;
        }
      });
    });

    const sampleCurve = (pA, pB, t) => {
      const mid = {
        x: (pA.x + pB.x) * 0.5,
        y: (pA.y + pB.y) * 0.5 + 0.95,
        z: (pA.z + pB.z) * 0.5
      };
      const u = 1 - t;
      return {
        x: u * u * pA.x + 2 * u * t * mid.x + t * t * pB.x,
        y: u * u * pA.y + 2 * u * t * mid.y + t * t * pB.y,
        z: u * u * pA.z + 2 * u * t * mid.z + t * t * pB.z
      };
    };

    const renderStage = () => {
      const pal = getPalette();
      ctx.clearRect(0, 0, w, h);

      if (autoOrbit && !isDragging && !prefersReducedMotion) {
        targetYaw += 0.003;
      }
      localRot += 0.015;
      curYaw += (targetYaw - curYaw) * 0.1;
      curPitch += (targetPitch - curPitch) * 0.1;

      const fov = Math.min(w, 960) * 0.68;
      const camDist = 13.5;
      const floorY = -2.1;

      // 1. Draw 3D CAD Floor Grid
      ctx.strokeStyle = pal.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let g = -8; g <= 8; g += 1) {
        const p1 = project3D(rotate3D({ x: g, y: floorY, z: -6 }, curPitch, curYaw), w, h, fov, camDist);
        const p2 = project3D(rotate3D({ x: g, y: floorY, z: 6 }, curPitch, curYaw), w, h, fov, camDist);
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (g >= -6 && g <= 6) {
          const p3 = project3D(rotate3D({ x: -8, y: floorY, z: g }, curPitch, curYaw), w, h, fov, camDist);
          const p4 = project3D(rotate3D({ x: 8, y: floorY, z: g }, curPitch, curYaw), w, h, fov, camDist);
          ctx.moveTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
        }
      }
      ctx.stroke();

      // 2. Draw Polar Reference Ring on Floor
      ctx.strokeStyle = pal.gridStrong;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        const rp = project3D(
          rotate3D({ x: Math.cos(a) * 5.8, y: floorY, z: Math.sin(a) * 5.8 }, curPitch, curYaw),
          w,
          h,
          fov,
          camDist
        );
        if (i === 0) ctx.moveTo(rp.x, rp.y);
        else ctx.lineTo(rp.x, rp.y);
      }
      ctx.stroke();

      // 3. Draw Arched 3D Conduits & Telemetry Packets
      links.forEach((lk) => {
        const pA = nodes[lk.from].pos;
        const pB = nodes[lk.to].pos;
        ctx.save();
        ctx.strokeStyle = pal.inkMuted;
        ctx.lineWidth = 1.4;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        for (let s = 0; s <= 24; s++) {
          const pt = sampleCurve(pA, pB, s / 24);
          const pr = project3D(rotate3D(pt, curPitch, curYaw), w, h, fov, camDist);
          if (s === 0) ctx.moveTo(pr.x, pr.y);
          else ctx.lineTo(pr.x, pr.y);
        }
        ctx.stroke();
        ctx.restore();
      });

      packets.forEach((pkt) => {
        if (!prefersReducedMotion) pkt.t = (pkt.t + pkt.speed) % 1;
        const pA = nodes[pkt.link.from].pos;
        const pB = nodes[pkt.link.to].pos;
        const pos = sampleCurve(pA, pB, pkt.t);
        const pr = project3D(rotate3D(pos, curPitch, curYaw), w, h, fov, camDist);

        ctx.fillStyle = pkt.link.accent === 'signal' ? pal.signal : pal.valid;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Draw 5 3D Enterprise Nodes & Pedestals
      Object.values(nodes).forEach((node) => {
        // Pedestal drop-line to floor
        const topP = project3D(rotate3D(node.pos, curPitch, curYaw), w, h, fov, camDist);
        const botP = project3D(rotate3D({ x: node.pos.x, y: floorY, z: node.pos.z }, curPitch, curYaw), w, h, fov, camDist);

        ctx.strokeStyle = pal.gridStrong;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(topP.x, topP.y);
        ctx.lineTo(botP.x, botP.y);
        ctx.stroke();

        // Floor anchor cross
        ctx.beginPath();
        ctx.arc(botP.x, botP.y, 3, 0, Math.PI * 2);
        ctx.stroke();

        // Transform & project wireframe vertices
        const nAngle = localRot * (node.rotSpeed * 60);
        const projVerts = node.mesh.v.map((v) => {
          const local = rotate3D(v, nAngle * 0.35, nAngle);
          const worldPt = {
            x: local.x + node.pos.x,
            y: local.y + node.pos.y,
            z: local.z + node.pos.z
          };
          return project3D(rotate3D(worldPt, curPitch, curYaw), w, h, fov, camDist);
        });

        ctx.strokeStyle = pal[node.colorKey];
        ctx.lineWidth = node.id === 'sync' ? 1.85 : 1.45;
        ctx.beginPath();
        node.mesh.e.forEach(([a, b]) => {
          ctx.moveTo(projVerts[a].x, projVerts[a].y);
          ctx.lineTo(projVerts[b].x, projVerts[b].y);
        });
        ctx.stroke();
      });

      // 5. Update Projected 2D Positions of HTML Node Labels
      labelEls.forEach((lbl) => {
        const key = lbl.getAttribute('data-node');
        const node = nodes[key];
        if (!node) return;
        const labelWorld = { x: node.pos.x, y: node.pos.y + 1.35, z: node.pos.z };
        const pr = project3D(rotate3D(labelWorld, curPitch, curYaw), w, h, fov, camDist);
        const cx = Math.max(92, Math.min(w - 92, pr.x));
        const cy = Math.max(24, Math.min(h - 52, pr.y));
        lbl.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) translate(-50%, -50%)`;
      });

      if (coordsEl) {
        const degY = Math.round(((curYaw * 180) / Math.PI) % 360);
        const degP = Math.round((curPitch * 180) / Math.PI);
        coordsEl.textContent = `AZIMUTH: ${degY}° / ELEV: +${degP}° · 5 NODES ACTIVE`;
      }

      if (!prefersReducedMotion) {
        requestAnimationFrame(renderStage);
      }
    };

    renderStage();
  }

  /* ========================================================================
     3. AMBIENT SCROLL-REACTIVE 3D CAD BACKGROUND (#cad3d-bg-canvas)
     ======================================================================== */
  function initBackgroundCadEngine() {
    const canvas = document.getElementById('cad3d-bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const leftPoly = makeOctahedronWireframe(2.6);
    const rightPoly = makeBoxWireframe(1.8, 1.8, 1.8);

    let scrollY = window.scrollY;
    let smoothScroll = scrollY;
    let pointerX = 0;
    let pointerY = 0;

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    }, { passive: true });

    window.addEventListener('pointermove', (e) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const renderBg = () => {
      const pal = getPalette();
      ctx.clearRect(0, 0, w, h);

      smoothScroll += (scrollY - smoothScroll) * 0.08;
      const sAngle = smoothScroll * 0.0018;

      const drawAssembly = (mesh, centerX, centerY, rx, ry, color) => {
        const proj = mesh.v.map((v) => {
          const r = rotate3D(v, rx, ry);
          const scale = 42;
          return { x: centerX + r.x * scale, y: centerY - r.y * scale };
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        mesh.e.forEach(([a, b]) => {
          ctx.moveTo(proj[a].x, proj[a].y);
          ctx.lineTo(proj[b].x, proj[b].y);
        });
        ctx.stroke();
      };

      drawAssembly(leftPoly, 70, h * 0.28, sAngle + pointerY * 0.3, sAngle * 1.3 + pointerX * 0.3, pal.gridStrong);
      drawAssembly(rightPoly, w - 70, h * 0.72, -sAngle + pointerY * 0.3, -sAngle * 1.1 + pointerX * 0.3, pal.gridStrong);

      if (!prefersReducedMotion) {
        requestAnimationFrame(renderBg);
      }
    };

    renderBg();
  }

  /* ========================================================================
     4. SPRING-PHYSICS SPATIAL 3D DEPTH CARDS (Z-Axis Parallax)
     ======================================================================== */
  function initSpatial3dCards() {
    if (prefersReducedMotion) return;
    const cards = document.querySelectorAll('.portrait-plate-wrap, .spec-cell, .portfolio-item, .blueprint-node');

    cards.forEach((card) => {
      card.classList.add('spatial-3d-card');
      let targetRx = 0;
      let targetRy = 0;
      let curRx = 0;
      let curRy = 0;
      let vx = 0;
      let vy = 0;
      let rafId = 0;
      let hovered = false;

      const stepSpring = () => {
        const stiffness = 0.14;
        const damping = 0.76;

        vx = (vx + (targetRx - curRx) * stiffness) * damping;
        vy = (vy + (targetRy - curRy) * stiffness) * damping;
        curRx += vx;
        curRy += vy;

        card.style.transform = `perspective(950px) rotateX(${curRx.toFixed(2)}deg) rotateY(${curRy.toFixed(2)}deg)`;

        const moving =
          Math.abs(curRx - targetRx) > 0.03 ||
          Math.abs(curRy - targetRy) > 0.03 ||
          Math.abs(vx) > 0.03 ||
          Math.abs(vy) > 0.03;
        if (hovered || moving) {
          rafId = requestAnimationFrame(stepSpring);
        } else {
          card.style.transform = '';
          card.classList.remove('is-tilting');
          rafId = 0;
        }
      };

      card.addEventListener('pointerenter', () => {
        hovered = true;
        card.classList.add('is-tilting');
        if (!rafId) rafId = requestAnimationFrame(stepSpring);
      });

      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        const maxDeg = card.classList.contains('portrait-plate-wrap') ? 10 : 6.5;
        targetRy = nx * maxDeg * 2;
        targetRx = -ny * maxDeg * 2;
        if (!rafId) rafId = requestAnimationFrame(stepSpring);
      });

      card.addEventListener('pointerleave', () => {
        hovered = false;
        targetRx = 0;
        targetRy = 0;
        if (!rafId) rafId = requestAnimationFrame(stepSpring);
      });
    });
  }

  /* ========================================================================
     5. VIEW TRANSITIONS API ENHANCEMENT FOR FILTER TABS
     ======================================================================== */
  function initViewTransitions() {
    if (!document.startViewTransition || prefersReducedMotion) return;
    const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
    filterBtns.forEach((btn) => {
      btn.addEventListener(
        'click',
        (e) => {
          if (e.isTrusted && document.startViewTransition) {
            document.startViewTransition(() => {});
          }
        },
        { capture: true }
      );
    });
  }

  function bootOverdrive() {
    initHero3dCore();
    initTopology3dStage();
    initBackgroundCadEngine();
    initSpatial3dCards();
    initViewTransitions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootOverdrive, { once: true });
  } else {
    bootOverdrive();
  }
})();
