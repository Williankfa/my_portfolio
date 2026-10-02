(() => {

  const CFG = {
    yaw: 0.6, pitch: 0.12, dist: 38,
    autoRotate: 0.050,
    diskSpeed: 1.2,
    warmth: 0.35,        // 0 = branco/cinza (original), 1 = quente (laranja nas bordas frias)
    stars: false,
    maxDPR: 2,
    respectReducedMotion: false
  };

  const canvas = document.getElementById('bh-canvas');
  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' });
  if (!gl) return;

  const FRAG = `
  precision highp float;
  uniform vec2 u_res;
  uniform vec3 u_cam, u_right, u_up, u_fwd;
  uniform float u_time, u_stars, u_warm;
  #define RIN 3.0
  #define ROUT 7.5

  float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float hash13(vec3 p){ p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }

  float pn(vec2 p, float P){
    vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
    float a = hash(vec2(mod(i.x, P), i.y)),      b = hash(vec2(mod(i.x + 1., P), i.y));
    float c = hash(vec2(mod(i.x, P), i.y + 1.)), d = hash(vec2(mod(i.x + 1., P), i.y + 1.));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  // 4 oitavas: mais detalhe fino em filamentos
  float fbm(vec2 p){
    float s = 0., a = .55, P = 28.; vec2 q = vec2(p.x * P, p.y * 4.);
    for (int i = 0; i < 4; i++){ s += a * pn(q, P); q = vec2(q.x * 2., q.y * 2. + 3.1); P *= 2.; a *= .5; }
    return s;
  }
  vec3 heat(float t){
    t = clamp(t, 0., 2.);
    vec3 lo  = mix(vec3(.6), vec3(.62, .42, .30), u_warm);
    vec3 mid = mix(vec3(1.), vec3(1., .90, .78), u_warm);
    vec3 c = mix(lo, mid, smoothstep(0., 1., t));
    return mix(c, vec3(.92, .96, 1.), smoothstep(1., 2., t));
  }
  // Doppler + redshift gravitacional (fator de brilho/cor do plasma em órbita)
  float beam(vec3 p, vec3 v, float r){
    vec3 bt = normalize(vec3(p.z, 0., -p.x));
    float beta = sqrt(.5 / r);
    float D = 1. / ((1. / sqrt(1. - beta*beta)) * (1. - beta * dot(bt, -normalize(v))));
    return D * sqrt(max(1. - 1. / r, 0.));
  }
  vec3 stars(vec3 d){
    vec3 col = vec3(0.);
    for (int k = 0; k < 2; k++){
      vec3 p = d * (k == 0 ? 60. : 130.), i = floor(p), f = fract(p) - .5;
      float h = hash13(i + float(k) * 17.);
      if (h > .985){
        vec3 o = (vec3(hash13(i + 1.), hash13(i + 2.), hash13(i + 3.)) - .5) * .6;
        col += vec3(smoothstep(.14, 0., length(f - o)) * (h - .985) / .015 * (k == 0 ? 1.2 : .7));
      }
    }
    return col;
  }

  void main(){
    vec2 uv = (gl_FragCoord.xy - .5 * u_res) / min(u_res.x, u_res.y);
    vec3 vel = normalize(u_fwd * 2.2 + u_right * uv.x + u_up * uv.y);
    vec3 pos = u_cam;
    vec3 hv = cross(pos, vel); float h2 = dot(hv, hv);
    vec3 col = vec3(0.); float T = 1.; bool esc = false; float rmin = 99.;

    for (int i = 0; i < 300; i++){
      float r = length(pos);
      if (r < 1.) break;
      if (r > 60. && dot(pos, vel) > 0.){ esc = true; break; }

      float dt = clamp(.05 * (r - .8), .02, .6);
      vel += -1.5 * h2 * pos / (r*r*r*r*r) * dt;
      vec3 np = pos + vel * dt;

      float rr = length(pos.xz);
      float env = smoothstep(RIN - .3, RIN + 1., rr) * (1. - smoothstep(ROUT - 3., ROUT, rr));
      float k = pow(RIN / max(rr, RIN), 1.2);

      // névoa volumétrica do disco: espessura cresce com o raio + Doppler
      if (env > .001){
        float H = .10 + .04 * rr;
        float bm = beam(pos, vel, max(rr, RIN));
        col += T * heat(.9 * k * bm) * exp(-abs(pos.y) / H) * env * k * bm * bm * dt * .05;
      }

      rmin = min(rmin, r);

      if (pos.y * np.y < 0.){
        vec3 hit = mix(pos, np, pos.y / (pos.y - np.y));
        float rh = length(hit.xz);
        if (rh > RIN && rh < ROUT){
          float om = sqrt(.5 / (rh*rh*rh));
          float ang = atan(hit.z, hit.x);
          // duas camadas com cisalhamento diferente + leve ondulação = fluxo que "ferve"
          float u  = fract((ang + om * u_time) / 6.2831853 + .012 * sin(rh * 2.3 - u_time * .35));
          float u2 = fract((ang + om * u_time * .8 + 1.7) / 6.2831853);
          float n = .6 * fbm(vec2(u, rh)) + .4 * fbm(vec2(u2, rh * 1.7 + 5.));
          float e = smoothstep(RIN, RIN + .4, rh) * (1. - smoothstep(ROUT - 3., ROUT, rh));
          float a = clamp(e * mix(.4, 1., smoothstep(.15, .7, n)), 0., 1.);

          float sh = beam(hit, vel, rh);

          // beaming mais forte (~D^3): lado que se aproxima bem mais brilhante
          float I = pow(RIN / rh, 1.2) * sh * sh * sh * (.55 + .9 * n);
          col += T * a * heat(pow(RIN / rh, .75) * sh) * I * 1.8;
          T *= 1. - a;
          if (T < .02) break;
        }
      }
      pos = np;
    }

    // anel de fótons fino: só raios que escapam rente à sombra (o miolo continua preto)
    if (esc) col += T * vec3(1., .96, .90) * exp(-pow((rmin - 1.5) * 8., 2.)) * .35;
    if (esc && u_stars > .5) col += T * stars(normalize(vel));

    col = 1. - exp(-col * 2.2);
    float mask = 1. - smoothstep(.40, .5, length(uv));
    float alpha = esc ? max(col.r, max(col.g, col.b)) : 1.;
    // dither leve: evita faixas (banding) nos gradientes
    col = max(col + (hash(gl_FragCoord.xy + fract(u_time) * 100.) - .5) / 255. * alpha, 0.);
    gl_FragColor = vec4(col * mask, alpha * mask);
  }`;

  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o);
    if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const prog = gl.createProgram();
  try {
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }'));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) { console.error(e); return; }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['u_res', 'u_cam', 'u_right', 'u_up', 'u_fwd', 'u_time', 'u_stars', 'u_warm'].forEach(n => U[n] = gl.getUniformLocation(prog, n));
  gl.uniform1f(U.u_stars, CFG.stars ? 1 : 0);
  gl.uniform1f(U.u_warm, CFG.warmth);

  const reduce = CFG.respectReducedMotion && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const cam = { yaw: CFG.yaw, pitch: CFG.pitch }, tgt = { ...cam };
  let vyaw = 0, vpitch = 0, lastInput = performance.now(), drag = null;

  canvas.addEventListener('pointerdown', e => {
    canvas.setPointerCapture(e.pointerId); drag = { id: e.pointerId, x: e.clientX, y: e.clientY }; lastInput = performance.now();
  });
  canvas.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return; lastInput = performance.now();
    vyaw = -(e.clientX - drag.x) * .006; vpitch = (e.clientY - drag.y) * .006;
    tgt.yaw += vyaw; tgt.pitch = clamp(tgt.pitch + vpitch, -1.45, 1.45);
    drag.x = e.clientX; drag.y = e.clientY;
  });
  ['pointerup', 'pointercancel'].forEach(ev => canvas.addEventListener(ev, () => drag = null));
  canvas.addEventListener('dblclick', () => { tgt.yaw = CFG.yaw; tgt.pitch = CFG.pitch; vyaw = vpitch = 0; });
  canvas.addEventListener('keydown', e => {
    const s = .12, k = e.key; lastInput = performance.now();
    if (k === 'ArrowLeft') tgt.yaw -= s; else if (k === 'ArrowRight') tgt.yaw += s;
    else if (k === 'ArrowUp') tgt.pitch = clamp(tgt.pitch + s, -1.45, 1.45);
    else if (k === 'ArrowDown') tgt.pitch = clamp(tgt.pitch - s, -1.45, 1.45);
    else return;
    e.preventDefault();
  });

  let q = 1, ema = 16.7, frames = 0;
  const resize = () => {
    const s = Math.min(window.devicePixelRatio || 1, CFG.maxDPR) * q;
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * s));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * s));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U.u_res, canvas.width, canvas.height);
  };
  new ResizeObserver(resize).observe(canvas);

  let raf = 0, last = performance.now(), simTime = 0, sway = 0;
  const draw = now => {
    const ms = now - last; last = now;
    ema += (ms - ema) * .05;
    if (++frames % 30 === 0 && ema > 26 && q > .5) { q *= .85; resize(); }

    if (!drag) {
      tgt.yaw += vyaw; tgt.pitch = clamp(tgt.pitch + vpitch, -1.45, 1.45); vyaw *= .95; vpitch *= .95;
      if (!reduce && CFG.autoRotate && now - lastInput > 3000) tgt.yaw += CFG.autoRotate;
    } else { vyaw *= .85; vpitch *= .85; }
    cam.yaw += (tgt.yaw - cam.yaw) * .12; cam.pitch += (tgt.pitch - cam.pitch) * .12;
    if (!reduce) simTime += Math.min(ms, 50) / 1000 * CFG.diskSpeed;

    sway += ((!drag && !reduce && now - lastInput > 1500 ? 1 : 0) - sway) * .03;
    const t = now / 1000, pe = cam.pitch + sway * Math.sin(t * .5) * .12, ye = cam.yaw + sway * Math.sin(t * .3) * .3;
    const cp = Math.cos(pe), sp = Math.sin(pe), cy = Math.cos(ye), sy = Math.sin(ye), d = CFG.dist;
    gl.uniform3f(U.u_cam, d * cp * sy, d * sp, d * cp * cy);
    gl.uniform3f(U.u_fwd, -cp * sy, -sp, -cp * cy);
    gl.uniform3f(U.u_right, cy, 0, -sy);
    gl.uniform3f(U.u_up, -sy * sp, cp, -cy * sp);
    gl.uniform1f(U.u_time, simTime);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(draw);
  };
  new IntersectionObserver(([en]) => {
    cancelAnimationFrame(raf);
    if (en.isIntersecting) { last = performance.now(); raf = requestAnimationFrame(draw); }
  }).observe(canvas);
})();