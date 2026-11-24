/** Mounts one independent mascot. React owns the SVG; this controller owns motion and cleans up on unmount. */
export function mountWaterMascot(root: HTMLElement) {
  const controller = new AbortController();
  let inView = true, destroyed = false;
  const svg = root.querySelector<SVGSVGElement>('svg')!;
  const body = root.querySelector<SVGPathElement>('.body')!;
  const character = root.querySelector<SVGGElement>('.character')!;
  const bodyMotion = root.querySelector<SVGGElement>('.body-motion')!;
  const eyes = root.querySelector<SVGGElement>('.eyes')!;
  const eyeLeft = root.querySelector<SVGPathElement>('.eye-left')!;
  const eyeRight = root.querySelector<SVGPathElement>('.eye-right')!;
  const heartLeft = root.querySelector<SVGPathElement>('.heart-left')!;
  const heartRight = root.querySelector<SVGPathElement>('.heart-right')!;
  const dizzyLeft = root.querySelector<SVGPathElement>('.dizzy-left')!;
  const dizzyRight = root.querySelector<SVGPathElement>('.dizzy-right')!;
  const smile = root.querySelector<SVGPathElement>('.smile')!;
  const dizzyMouth = root.querySelector<SVGPathElement>('.dizzy-mouth')!;
  const angryBrows = root.querySelector<SVGPathElement>('.angry-brows')!;
  const angryMouth = root.querySelector<SVGPathElement>('.angry-mouth')!;
  const sleepMouth = root.querySelector<SVGPathElement>('.sleep-mouth')!;
  const particles = [...root.querySelectorAll<SVGPathElement>('.satellites path')];
  const escapingDrops = [...root.querySelectorAll<SVGPathElement>('.escaping-drops path')];
  const necks = [...root.querySelectorAll<SVGPathElement>('.water-necks path')];
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motionPreference.matches;
  let t = 0, last: number | null = null, frame = 0;
  let pointer: {
    x: number;
    y: number;
  } | null = null;
  const gaze = { x: 0, y: 0 };
  let jumpAt = -100, lastStroke = -100, strokeEnergy = 0;
  let holdAt: number | null = null, press = 0, jumpPower = 1, eggAt = -100, suppressClickUntil = -100;
  let clicks: number[] = [];
  let dizzyAt = -100, dizzyDirection = 1, angryAt = -100, angrySoothing = 0;
  let interactionCenter = [330, 300];
  let circleTrace: {
    angle: number | null;
    winding: number;
    lastTime: number;
    started: number;
    radius: number;
  } = { angle: null, winding: 0, lastTime: -100, started: 0, radius: 0 };
  let lastInteraction = 0, sleep = 0, sleepPose = 0;
  const wake = () => { lastInteraction = t; };
  const template = body.getAttribute('d')!;
  const a = template.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  const b = ('M339 64 C404 64 451 101 477 155 C502 207 539 222 581 254 C630 291 644 335 625 382 C606 430 562 455 512 450 C466 447 448 415 408 421 C352 426 341 474 304 508 C265 546 215 532 184 491 C153 451 164 415 180 364 C197 311 173 275 177 222 C181 134 250 64 339 64 Z').match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  if (a.length !== b.length)
    throw new Error('Shape point counts must match');
  const glances = [[0, 0], [34, -24], [34, -24], [-31, 8], [-31, 8], [6, 31], [6, 31], [-18, -25], [0, 0]];
  const orbit = [0.18, 2.55, 4.45];
  const size = [[33, 30], [16, 14], [9, 8], [40, 36], [19, 17], [10, 9], [27, 25], [14, 13], [8, 7]];
  const clusterAngles = [0, -0.24, 0.22];
  const smooth = (value: number) => value * value * (3 - 2 * value);
  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  const ease = (value: number) => { const u = clamp(value); return u * u * u * (u * (u * 6 - 15) + 10); };
  function fusionState(phase: number, envelope: number, freeGap: number) {
    let separation;
    if (phase < 3)
      separation = 0;
    else if (phase < 10)
      separation = ease((phase - 3) / 7);
    else if (phase < 16)
      separation = 1;
    else if (phase < 22)
      separation = 1 - ease((phase - 16) / 6);
    else
      separation = 0;
    const pull = phase > 3 && phase < 10 ? Math.pow(Math.sin(Math.PI * (phase - 3) / 7), 2) : 0;
    const returning = phase > 16 && phase < 22 ? Math.pow(Math.sin(Math.PI * (phase - 16) / 6), 2) * 0.3 : 0;
    const neck = phase < 3 || phase >= 22 ? 1 : phase < 8.8 ? 1 - ease((phase - 3) / 5.8) : phase > 18.5 ? ease((phase - 18.5) / 3.5) : 0;
    return { gap: -envelope * 0.68 + (freeGap + envelope * 0.68) * separation, pull: pull + returning, neck };
  }
  function shapeAt(time: number) {
    const blend = (1 - Math.cos(time * Math.PI / 9)) / 2 * (1 - sleep) + sleepPose * sleep;
    return a.map((value, i) => value + (b[i] - value) * blend);
  }
  // Analytic tangents keep the whole contour round, including its closing seam.
  // Only broad, gentle asymmetry: no high-frequency ripples or pointed lobes.
  function dropPath(rx: number, ry: number, time: number, seed: number, softness = 1) {
    const phase = time * 0.55 + seed * 1.7;
    const sample = (angle: number) => {
      const r = 1 + softness * (0.075 * Math.cos(angle + phase) + 0.035 * Math.sin(2 * angle - phase));
      const dr = softness * (-0.075 * Math.sin(angle + phase) + 0.07 * Math.cos(2 * angle - phase));
      const c = Math.cos(angle), s = Math.sin(angle);
      return { x: rx * r * c, y: ry * r * s, dx: rx * (dr * c - r * s), dy: ry * (dr * s + r * c) };
    };
    const number = (value: number) => value.toFixed(2);
    const step = Math.PI / 8, handle = step / 3;
    let p = sample(0);
    let path = `M${number(p.x)} ${number(p.y)}`;
    for (let i = 1; i <= 16; i++) {
      const q = sample(i * step);
      path += ` C${number(p.x + p.dx * handle)} ${number(p.y + p.dy * handle)} ${number(q.x - q.dx * handle)} ${number(q.y - q.dy * handle)} ${number(q.x)} ${number(q.y)}`;
      p = q;
    }
    return path + ' Z';
  }
  // Broad silhouettes inspired by the reference: full round blobs, a soft
  // peanut, rounded three-lobed shapes, beans and a pillow-like rounded square.
  // Periodic cubic B-splines round every lobe with C2 continuity, even as the
  // whole silhouette morphs. Eye contours retain their own subtler animation.
  const waterProfiles = [
    { x: 1, y: 1, h2: 0.03, h3: 0.05, h4: 0, bend: 0.03 },
    { x: 1.08, y: 0.98, h2: 0.32, h3: 0.02, h4: -0.06, bend: 0 },
    { x: 1, y: 1.05, h2: -0.03, h3: 0.27, h4: 0, bend: 0.08 },
    { x: 1.02, y: 1, h2: 0.02, h3: 0, h4: 0, bend: 0.66 },
    { x: 1, y: 1, h2: 0, h3: 0.02, h4: -0.17, bend: 0 },
    { x: 1.05, y: 1, h2: 0.12, h3: -0.2, h4: 0, bend: -0.22 }
  ].map(profile => Array.from({ length: 12 }, (_, i) => {
    const angle = i * Math.PI / 6, c = Math.cos(angle), s = Math.sin(angle);
    const r = 1 + profile.h2 * Math.cos(2 * angle) + profile.h3 * Math.cos(3 * angle) + profile.h4 * Math.cos(4 * angle);
    return [profile.x * (r * c + profile.bend * (s * s - 0.5)), profile.y * r * s];
  }));
  function waterPath(rx: number, ry: number, time: number, seed: number, richness = 1) {
    const phase = time * (0.2 + 0.012 * Math.sin(seed * 2.3)) + seed * 1.37;
    const index = Math.floor(phase), fraction = phase - index;
    const blend = fraction * fraction * fraction * (fraction * (fraction * 6 - 15) + 10);
    const from = waterProfiles[index % waterProfiles.length];
    const to = waterProfiles[(index + 1) % waterProfiles.length];
    const fullness = Math.min(1, Math.max(rx, ry) / 10) * richness;
    const points = from.map((point, i) => {
      const angle = i * Math.PI / 6;
      const x = point[0] + (to[i][0] - point[0]) * blend;
      const y = point[1] + (to[i][1] - point[1]) * blend;
      return [rx * 1.05 * (Math.cos(angle) + (x - Math.cos(angle)) * fullness), ry * 1.05 * (Math.sin(angle) + (y - Math.sin(angle)) * fullness)];
    });
    const at = (i: number) => points[(i + 12) % 12];
    const number = (value: number) => value.toFixed(2);
    let path = '';
    for (let i = 0; i < 12; i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      const start = p1.map((v, k) => (p0[k] + 4 * v + p2[k]) / 6);
      const c1 = p1.map((v, k) => (4 * v + 2 * p2[k]) / 6);
      const c2 = p1.map((v, k) => (2 * v + 4 * p2[k]) / 6);
      const end = p1.map((v, k) => (v + 4 * p2[k] + p3[k]) / 6);
      if (i === 0)
        path = `M${start.map(number).join(' ')}`;
      path += ` C${[...c1, ...c2, ...end].map(number).join(' ')}`;
    }
    return path + ' Z';
  }
  function sampleOutline(coords: number[], transform: (point: number[]) => number[]) {
    const points = [];
    for (let segment = 0; segment < 10; segment++) {
      const start = segment === 0 ? 0 : 2 + (segment - 1) * 6 + 4, offset = 2 + segment * 6;
      for (let j = 0; j < 18; j++) {
        const u = j / 18, v = 1 - u;
        const point = [0, 1].map(k => v * v * v * coords[start + k] + 3 * v * v * u * coords[offset + k] + 3 * v * u * u * coords[offset + 2 + k] + u * u * u * coords[offset + 4 + k]);
        points.push(transform(point));
      }
    }
    return points;
  }
  function distanceToOutline(point: number[], outline: number[][]) {
    let nearest = Infinity;
    for (let i = 0; i < outline.length; i++) {
      const a = outline[i], b = outline[(i + 1) % outline.length];
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const u = Math.max(0, Math.min(1, ((point[0] - a[0]) * dx + (point[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)));
      nearest = Math.min(nearest, Math.hypot(point[0] - a[0] - u * dx, point[1] - a[1] - u * dy));
    }
    return nearest;
  }
  function nearestOnOutline(point: number[], outline: number[][]) {
    let distance = Infinity, nearest = outline[0];
    for (let i = 0; i < outline.length; i++) {
      const a = outline[i], b = outline[(i + 1) % outline.length];
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const u = clamp(((point[0] - a[0]) * dx + (point[1] - a[1]) * dy) / (dx * dx + dy * dy || 1));
      const q = [a[0] + u * dx, a[1] + u * dy];
      const d = Math.hypot(point[0] - q[0], point[1] - q[1]);
      if (d < distance) {
        distance = d;
        nearest = q;
      }
    }
    return nearest;
  }
  // A real tapering ligament stretches between the contour and the droplet.
  // Its two cubic sides narrow continuously before surface tension pinches it off.
  function waterNeck(element: SVGPathElement, point: number[], envelope: number, amount: number, outline: number[][]) {
    if (amount < 0.001 || envelope < 13) {
      element.setAttribute('d', '');
      return;
    }
    const anchor = nearestOnOutline(point, outline);
    const dx = point[0] - anchor[0], dy = point[1] - anchor[1], length = Math.hypot(dx, dy) || 1;
    const contact = ease((length / envelope - 0.85) / 0.6);
    if (contact < 0.001) {
      element.setAttribute('d', '');
      return;
    }
    const n = [dx / length, dy / length], tangent = [-n[1], n[0]];
    const base = envelope * 0.6 * Math.pow(amount, 0.2) * contact;
    const tip = envelope * 0.48;
    const waist = envelope * 0.65 * Math.sqrt(amount) * contact;
    const end = [point[0] - n[0] * envelope * 0.28, point[1] - n[1] * envelope * 0.28];
    const start = [anchor[0] - n[0] * 5, anchor[1] - n[1] * 5];
    const span = Math.max(1, Math.hypot(end[0] - start[0], end[1] - start[1]));
    const mid = [start[0] + (end[0] - start[0]) * 0.55, start[1] + (end[1] - start[1]) * 0.55];
    const offset = (p: number[], w: number, along = 0) => p.map((v, k) => v + tangent[k] * w + n[k] * along);
    const f = (p: number[]) => p.map(v => v.toFixed(2)).join(' ');
    const top = offset(start, base), middle = offset(mid, waist), finish = offset(end, tip);
    const bottom = offset(start, -base), midBottom = offset(mid, -waist), endBottom = offset(end, -tip);
    element.setAttribute('d', `M${f(top)} C${f(offset(top, 0, span * 0.28))} ${f(offset(middle, 0, -span * 0.18))} ${f(middle)} C${f(offset(middle, 0, span * 0.18))} ${f(offset(finish, 0, -span * 0.25))} ${f(finish)} L${f(endBottom)} C${f(offset(endBottom, 0, -span * 0.25))} ${f(offset(midBottom, 0, span * 0.18))} ${f(midBottom)} C${f(offset(midBottom, 0, -span * 0.18))} ${f(offset(bottom, 0, span * 0.28))} ${f(bottom)} Z`);
  }
  function heartPath(width: number, height: number) {
    const f = (x: number, y: number) => `${(x * width).toFixed(2)} ${(y * height).toFixed(2)}`;
    return `M${f(0, 0.9)} C${f(-1.45, 0.05)} ${f(-1.2, -0.9)} ${f(-0.55, -0.85)} C${f(-0.25, -0.87)} ${f(-0.08, -0.62)} ${f(0, -0.4)} C${f(0.08, -0.62)} ${f(0.25, -0.87)} ${f(0.55, -0.85)} C${f(1.2, -0.9)} ${f(1.45, 0.05)} ${f(0, 0.9)} Z`;
  }
  function spiralPath(age: number, direction: number) {
    const rotation = direction * (age * 3 - age * age * 0.2);
    let path = '';
    for (let i = 0; i <= 90; i++) {
      const u = i / 90, angle = u * Math.PI * 4 + rotation;
      const radius = 1.5 + u * 19;
      const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius * 1.2;
      path += `${i === 0 ? 'M' : ' L'}${x.toFixed(2)} ${y.toFixed(2)}`;
    }
    return path;
  }
  function resetCircleTrace() {
    circleTrace = { angle: null, winding: 0, lastTime: -100, started: t, radius: 0 };
  }
  function trackCircles(point: {
    x: number;
    y: number;
  }) {
    if (paused || motionPreference.matches || t - dizzyAt < 9)
      return;
    const dx = point.x - interactionCenter[0], dy = point.y - interactionCenter[1];
    const radius = Math.hypot(dx, dy), angle = Math.atan2(dy, dx);
    if (radius < 100 || radius > 370) {
      resetCircleTrace();
      return;
    }
    const trace = circleTrace;
    const elapsed = t - trace.lastTime;
    if (trace.angle === null || elapsed > 0.75 || t - trace.started > 7.5 || Math.abs(radius - trace.radius) > 85) {
      circleTrace = { angle, winding: 0, lastTime: t, started: t, radius };
      return;
    }
    const delta = Math.atan2(Math.sin(angle - trace.angle), Math.cos(angle - trace.angle));
    if (Math.abs(delta) > Math.PI / 2) {
      resetCircleTrace();
      return;
    }
    // Signed winding makes back-and-forth strokes cancel; angle unwrapping
    // detects clockwise and counterclockwise turns across the +/-pi seam.
    trace.winding += delta;
    trace.angle = angle;
    trace.lastTime = t;
    trace.radius = radius;
    if (Math.abs(trace.winding) >= Math.PI * 3.6) {
      dizzyDirection = Math.sign(trace.winding);
      dizzyAt = t;
      eggAt = -100;
      angryAt = -100;
      resetCircleTrace();
    }
  }
  function getGrumpy(event?: Event) {
    if (paused || motionPreference.matches)
      return;
    event?.preventDefault?.();
    wake();
    angryAt = t;
    angrySoothing = 0;
    eggAt = -100;
    dizzyAt = -100;
    resetCircleTrace();
  }
  // Position relative to the actual animated edge, never a fixed orbit that
  // can accidentally pass through the body. A negative gap is deliberate fusion.
  function placeBubble(angle: number, envelope: number, gap: number, outline: number[][], center: number[]) {
    const direction = [Math.cos(angle), Math.sin(angle)];
    let boundary = 0;
    for (let i = 0; i < outline.length; i++) {
      const a = outline[i], b = outline[(i + 1) % outline.length];
      const ex = b[0] - a[0], ey = b[1] - a[1];
      const ax = a[0] - center[0], ay = a[1] - center[1];
      const determinant = direction[0] * ey - direction[1] * ex;
      if (Math.abs(determinant) < 0.00001)
        continue;
      const distance = (ax * ey - ay * ex) / determinant;
      const u = (ax * direction[1] - ay * direction[0]) / determinant;
      if (distance > 0 && u >= 0 && u <= 1)
        boundary = Math.max(boundary, distance);
    }
    let distance = boundary + envelope + gap;
    let point = center.map((v, k) => v + direction[k] * distance);
    if (gap >= 0)
      for (let i = 0; i < 5; i++) {
        const clearance = distanceToOutline(point, outline);
        const correction = envelope + gap - clearance;
        if (correction < 0.15)
          break;
        distance += correction;
        point = center.map((v, k) => v + direction[k] * distance);
      }
    return point;
  }
  function bubbleEnvelope(path: string) {
    const values = path.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    let radius = 0;
    for (let i = 0; i < values.length; i += 2)
      radius = Math.max(radius, Math.hypot(values[i], values[i + 1]));
    return radius;
  }
  function render() {
    const idle = t - lastInteraction;
    const targetSleep = holdAt === null ? ease((idle - 12) / 8) : 0;
    if (sleep < 0.03)
      sleepPose = (1 - Math.cos(t * Math.PI / 9)) / 2;
    sleep += (targetSleep - sleep) * (targetSleep < sleep ? 0.12 : 0.035);
    root.setAttribute('data-mascot-state', sleep > 0.95 ? 'sleeping' : sleep > 0.08 ? 'sleepy' : 'awake');
    const blend = (1 - Math.cos(t * Math.PI / 9)) / 2 * (1 - sleep) + sleepPose * sleep;
    let n = 0;
    body.setAttribute('d', template.replace(/-?\d+(?:\.\d+)?/g, () => {
      const i = n++;
      return (a[i] + (b[i] - a[i]) * blend).toFixed(2);
    }));
    const floatY = Math.sin(t * 0.8) * (6 - 3 * sleep);
    const dizzyAge = t - dizzyAt;
    const dizzy = dizzyAge >= 0 && dizzyAge < 6.5 ? ease(dizzyAge / 0.5) * (1 - ease((dizzyAge - 3.5) / 3)) : 0;
    const eggAge = t - eggAt;
    const dance = (eggAge >= 0 && eggAge < 7 ? ease(eggAge / 0.7) * (1 - ease((eggAge - 5.8) / 1.2)) : 0) * (1 - dizzy);
    const angryAge = t - angryAt + angrySoothing;
    const angry = (angryAge >= 0 && angryAge < 5.5 ? ease(angryAge / 0.4) * (1 - ease((angryAge - 3.3) / 2.2)) : 0) * (1 - dizzy);
    const holdTarget = holdAt === null ? 0 : clamp((t - holdAt) / 1.2);
    press += (holdTarget - press) * 0.08;
    const jumpAge = t - jumpAt;
    const hopping = jumpAge >= 0 && jumpAge < 1.25;
    const jump = (hopping ? -26 * jumpPower * Math.sin(Math.PI * Math.min(1, jumpAge / 0.85)) * (jumpAge < 0.85 ? 1 : 0) : 0) - dance * 10 * Math.pow(Math.sin(eggAge * 4.5), 2);
    const squash = (hopping ? 0.045 * jumpPower * Math.cos(jumpAge * 11) * Math.exp(-jumpAge * 2.4) : 0) + press * 0.09 + angry * 0.035 + sleep * 0.012 * Math.sin(t * 0.85);
    const pet = strokeEnergy * Math.exp(-Math.max(0, t - lastStroke) * 1.9);
    const tilt = pet * Math.sin(t * 7) * 2.6 + dance * Math.sin(eggAge * 6) * 5 + dizzy * Math.sin(dizzyAge * 4.4) * 8 * dizzyDirection + angry * 2.2 * Math.sin(angryAge * 13) * Math.exp(-Math.max(0, angryAge) * 0.45) + sleep * 5;
    const lean = gaze.x * 0.07 + dizzy * 5 * Math.sin(dizzyAge * 3.3);
    const bodyTransform = `translate(${lean.toFixed(2)} ${(floatY + jump).toFixed(2)}) translate(330 300) rotate(${tilt.toFixed(2)}) scale(${(1 + squash).toFixed(4)} ${(1 - squash).toFixed(4)}) translate(-330 -300)`;
    character.setAttribute('transform', bodyTransform);
    bodyMotion.setAttribute('transform', bodyTransform);
    const rotation = tilt * Math.PI / 180;
    const transformPoint = (point: number[]) => {
      const x = (point[0] - 330) * (1 + squash), y = (point[1] - 300) * (1 - squash);
      return [330 + lean + x * Math.cos(rotation) - y * Math.sin(rotation), 300 + floatY + jump + x * Math.sin(rotation) + y * Math.cos(rotation)];
    };
    const outline = sampleOutline(shapeAt(t), transformPoint);
    const center = transformPoint([330, 300]);
    interactionCenter = center;
    const cx = 307 + 27 * blend;
    const cy = 292 - 51 * blend;
    const index = Math.floor(t / 2.35) % glances.length;
    const next = glances[index];
    let target = { x: next[0], y: next[1] };
    if (pointer)
      target = { x: Math.max(-36, Math.min(36, (pointer.x - cx) * 0.14)), y: Math.max(-29, Math.min(29, (pointer.y - cy) * 0.12)) };
    target = { x: target.x * (1 - dizzy) + dizzy * 7 * Math.cos(dizzyAge * 4), y: target.y * (1 - dizzy) + dizzy * 5 * Math.sin(dizzyAge * 4) };
    target = { x: target.x * (1 - sleep), y: target.y * (1 - sleep) + sleep * 8 };
    gaze.x += (target.x - gaze.x) * 0.075;
    gaze.y += (target.y - gaze.y) * 0.075;
    eyes.setAttribute('transform', `translate(${(cx - 307 + gaze.x).toFixed(2)} ${(cy - 290 + gaze.y + floatY * 0.15).toFixed(2)}) rotate(${(-3 * blend).toFixed(2)} 307 290)`);
    const blinkPhase = t % 5.8;
    const blink = blinkPhase > 4.8 && blinkPhase < 5.04 ? 1 - Math.sin((blinkPhase - 4.8) / 0.24 * Math.PI) * 0.94 : 1;
    const leftWidth = 25.5 * (1 + 0.045 * Math.sin(t * 0.67));
    const rightWidth = 27.5 * (1 + 0.05 * Math.sin(t * 0.61 + 1.5));
    const contentment = 1 - pet * 0.4;
    const leftHeight = 38 * (1 + 0.065 * Math.sin(t * 0.72 + 0.8)) * blink * contentment * (1 - angry * 0.46) * (1 - sleep * 0.95);
    const rightHeight = 41 * (1 + 0.055 * Math.sin(t * 0.58 + 2.1)) * blink * contentment * (1 - angry * 0.49) * (1 - sleep * 0.95);
    eyeLeft.setAttribute('d', dropPath(leftWidth, leftHeight, t, 1.2, 0.65));
    eyeRight.setAttribute('d', dropPath(rightWidth, rightHeight, t, 4.4, 0.7));
    eyeLeft.setAttribute('opacity', ((1 - dance) * (1 - dizzy)).toFixed(3));
    eyeRight.setAttribute('opacity', ((1 - dance) * (1 - dizzy)).toFixed(3));
    heartLeft.setAttribute('d', heartPath(leftWidth, leftHeight * 0.9));
    heartRight.setAttribute('d', heartPath(rightWidth, rightHeight * 0.9));
    heartLeft.setAttribute('opacity', dance.toFixed(3));
    heartRight.setAttribute('opacity', dance.toFixed(3));
    dizzyLeft.setAttribute('d', spiralPath(dizzyAge, dizzyDirection));
    dizzyRight.setAttribute('d', spiralPath(dizzyAge + 0.3, dizzyDirection));
    dizzyLeft.setAttribute('opacity', dizzy.toFixed(3));
    dizzyRight.setAttribute('opacity', dizzy.toFixed(3));
    smile.setAttribute('opacity', dance.toFixed(3));
    smile.setAttribute('transform', `translate(${(cx - 307 + gaze.x * 0.35).toFixed(2)} ${(cy - 290).toFixed(2)})`);
    dizzyMouth.setAttribute('opacity', dizzy.toFixed(3));
    dizzyMouth.setAttribute('transform', smile.getAttribute('transform') ?? '');
    angryBrows.setAttribute('opacity', angry.toFixed(3));
    angryMouth.setAttribute('opacity', angry.toFixed(3));
    angryMouth.setAttribute('transform', smile.getAttribute('transform') ?? '');
    const yawn = idle > 12 && idle < 20 ? Math.sin((idle - 12) / 8 * Math.PI) * sleep : 0;
    sleepMouth.setAttribute('opacity', Math.max(0, yawn).toFixed(3));
    sleepMouth.setAttribute('transform', smile.getAttribute('transform') ?? '');
    eyeLeft.setAttribute('transform', `translate(267 ${(291 + 1.6 * Math.sin(t * 0.7)).toFixed(2)}) rotate(${(-3 + 1.5 * Math.sin(t * 0.5) + angry * 20).toFixed(2)})`);
    eyeRight.setAttribute('transform', `translate(344 ${(286 + 2 * Math.sin(t * 0.6 + 1)).toFixed(2)}) rotate(${(3 + 1.8 * Math.sin(t * 0.6 + 2) - angry * 20).toFixed(2)})`);
    heartLeft.setAttribute('transform', eyeLeft.getAttribute('transform') ?? '');
    heartRight.setAttribute('transform', eyeRight.getAttribute('transform') ?? '');
    dizzyLeft.setAttribute('transform', 'translate(267 291)');
    dizzyRight.setAttribute('transform', 'translate(344 286)');
    particles.forEach((particle, i) => {
      const group = Math.floor(i / 3), member = i % 3;
      const angle = orbit[group] + clusterAngles[member] + t * 0.035 + 0.025 * Math.sin(t * 0.35 + group) + dance * 0.28 * Math.sin(eggAge * 1.8) + angry * 0.012 * Math.sin(angryAge * 5 + group);
      const pulse = 1 + 0.16 * Math.sin(t * 0.85 + i * 1.7);
      const phase = ((t + group * 8 - member * 0.9) % 24 + 24) % 24;
      const state = fusionState(phase, Math.max(...size[i]) * pulse, 24 + member * 4);
      const stretch = 1 + 0.06 * Math.sin(t * 0.8 + i) + 0.56 * state.pull;
      const path = waterPath(size[i][0] * pulse * stretch, size[i][1] * pulse / Math.sqrt(stretch), t, i);
      const envelope = bubbleEnvelope(path);
      const normalGap = fusionState(phase, envelope, 24 + member * 4).gap;
      const gap = normalGap + angry * 8;
      const [x, y] = placeBubble(angle, envelope, gap, outline, center);
      particle.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(angle * 180 / Math.PI + 7 * Math.sin(t * 0.35 + i)).toFixed(2)})`);
      particle.setAttribute('d', path);
      waterNeck(necks[i], [x, y], envelope, state.neck, outline);
    });
    escapingDrops.forEach((drop, i) => {
      const firstBirth = 4;
      if (t < firstBirth) {
        drop.setAttribute('opacity', '0');
        return;
      }
      const cycle = Math.floor((t - firstBirth) / 13);
      const born = firstBirth + cycle * 13;
      const age = t - born;
      const lifetime = 9;
      if (age >= lifetime) {
        drop.setAttribute('opacity', '0');
        necks[9].setAttribute('d', '');
        return;
      }
      const u = age / lifetime;
      const seed = i + cycle * 4;
      const shrink = 1 - ease((u - 0.35) / 0.65);
      const radius = (20 + 6 * (0.5 + 0.5 * Math.sin(seed * 2.4))) * shrink;
      const stretch = 1 + 0.6 * Math.pow(Math.sin(Math.PI * clamp(u / 0.65)), 2);
      const path = waterPath(radius * stretch, radius / Math.sqrt(stretch), t, seed + 10, 1 - 0.65 * u);
      const envelope = bubbleEnvelope(path);
      const angle = orbit[cycle % 3] + born * 0.035 + 0.06 * Math.sin(u * Math.PI);
      const [x, y] = placeBubble(angle, envelope, -envelope * 0.85 + 95 * ease(u), outline, center);
      drop.setAttribute('d', path);
      drop.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(angle * 180 / Math.PI).toFixed(2)})`);
      drop.setAttribute('opacity', (1 - smooth(Math.max(0, (u - 0.25) / 0.75))).toFixed(3));
      waterNeck(necks[9], [x, y], envelope, 1 - ease(u / 0.53), outline);
    });
  }
  function tick(now: number) {
    if (paused || destroyed || !inView || document.hidden || !root.isConnected) {
      frame = 0;
      return;
    }
    if (last !== null)
      t += Math.min((now - last) / 1000, 0.05);
    last = now;
    render();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    root.dataset.paused = String(paused);
    if (paused || destroyed || !inView || document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      last = null;
    }
    else if (!frame) {
      last = null;
      frame = requestAnimationFrame(tick);
    }
  }
  svg.addEventListener('pointermove', event => {
    const rect = svg.getBoundingClientRect();
    const nextPointer = { x: -90 + (event.clientX - rect.left) * 880 / rect.width, y: -90 + (event.clientY - rect.top) * 790 / rect.height };
    if (pointer && (event.target === body || (event.target instanceof Node && character.contains(event.target))) && Math.hypot(nextPointer.x - pointer.x, nextPointer.y - pointer.y) > 1) {
      strokeEnergy = Math.min(1, strokeEnergy * Math.exp(-Math.max(0, t - lastStroke) * 1.9) + 0.12);
      lastStroke = t;
      if (t - angryAt < 5.5)
        angrySoothing = Math.min(2, angrySoothing + 0.08);
    }
    pointer = nextPointer;
    wake();
    trackCircles(nextPointer);
  }, { signal: controller.signal });
  svg.addEventListener('pointerleave', () => { pointer = null; }, { signal: controller.signal });
  window.addEventListener('pointermove', event => {
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height)
      return;
    const point = { x: -90 + (event.clientX - rect.left) * 880 / rect.width, y: -90 + (event.clientY - rect.top) * 790 / rect.height };
    if (Math.hypot(point.x - interactionCenter[0], point.y - interactionCenter[1]) < 360) {
      pointer = point;
      wake();
      trackCircles(point);
    }
    else
      resetCircleTrace();
  }, { ...{ passive: true }, signal: controller.signal });
  function hop(power = 1) {
    if (paused || motionPreference.matches)
      return;
    wake();
    jumpPower = power;
    jumpAt = t;
  }
  function activateMascot() {
    if (paused || motionPreference.matches || t < suppressClickUntil)
      return;
    hop();
    clicks = clicks.filter(time => t - time < 2.5);
    clicks.push(t);
    if (clicks.length >= 5) {
      eggAt = t;
      dizzyAt = -100;
      angryAt = -100;
      clicks = [];
      resetCircleTrace();
    }
  }
  character.addEventListener('click', activateMascot, { signal: controller.signal });
  body.addEventListener('click', activateMascot, { signal: controller.signal });
  particles.forEach(particle => particle.addEventListener('dblclick', getGrumpy, { signal: controller.signal }));
  svg.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activateMascot();
    }
    if (event.key.toLowerCase() === 'b')
      getGrumpy(event);
  }, { signal: controller.signal });
  svg.addEventListener('pointerdown', event => {
    if (paused || motionPreference.matches || (event.button !== undefined && event.button !== 0))
      return;
    if (event.target !== body && !(event.target instanceof Node && character.contains(event.target)))
      return;
    holdAt = t;
    wake();
  }, { signal: controller.signal });
  function releaseHold() {
    if (holdAt === null)
      return;
    const duration = t - holdAt;
    holdAt = null;
    if (duration > 0.25) {
      hop(1 + press * 0.7);
      suppressClickUntil = t + 0.35;
    }
  }
  svg.addEventListener('pointerup', releaseHold, { signal: controller.signal });
  window.addEventListener('pointerup', releaseHold, { signal: controller.signal });
  root.addEventListener('focusin', wake, { signal: controller.signal });
  svg.addEventListener('pointercancel', () => { holdAt = null; }, { signal: controller.signal });
  svg.addEventListener('lostpointercapture', () => { holdAt = null; }, { signal: controller.signal });
  motionPreference.addEventListener('change', event => { paused = event.matches; sync(); }, { signal: controller.signal });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      last = null;
    }
    else
      sync();
  }, { signal: controller.signal });
  const visibility = new IntersectionObserver(entries => {
    inView = entries[0]?.isIntersecting ?? false;
    sync();
  }, { rootMargin: '80px' });
  visibility.observe(root);
  render();
  sync();
  return () => {
    destroyed = true;
    controller.abort();
    visibility.disconnect();
    cancelAnimationFrame(frame);
  };
}
