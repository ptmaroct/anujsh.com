// anujsh.com — minimal script

// ---- Easter egg: a small note for the devtools-curious ----
try {
    const style = 'color:#ff6a36;font:600 13px/1.4 ui-monospace,monospace;';
    const dim   = 'color:#a8a8a0;font:400 12px/1.4 ui-monospace,monospace;';
    console.log('%cwell, hello.', style);
    console.log('%c  /news  \u2192 daily HN, curated.\n  /happy \u2192 a morning paper for good news.', dim);
}
catch (_) { /* no-op */ }

// ---- Block pinch-zoom + double-tap zoom (iOS Safari ignores user-scalable=no) ----
['gesturestart', 'gesturechange', 'gestureend'].forEach(evt => {
    document.addEventListener(evt, (e) => e.preventDefault());
});

document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
}, false);

// ---- Nav scroll state ----
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- Mobile menu ----
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

function setMenuOpen(open) {
    mobileMenu.classList.toggle('open', open);
    navToggle.classList.toggle('active', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
}

navToggle.addEventListener('click', () => {
    setMenuOpen(!mobileMenu.classList.contains('open'));
});

mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) setMenuOpen(false);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        setMenuOpen(false);
    }
});

document.querySelectorAll('.mobile-menu-items a, .mobile-menu-items button').forEach(el => {
    el.addEventListener('click', () => setMenuOpen(false));
});

// ---- Scroll reveal (staggered; progressive enhancement) ----
// Auto-stagger siblings within the same section when no explicit delay is set
document.querySelectorAll('.project-grid, .experience-list, .notes-grid, .contact-links').forEach(list => {
    [...list.children].forEach((child, i) => {
        if (!child.style.getPropertyValue('--reveal-delay')) {
            child.style.setProperty('--reveal-delay', `${i * 60}ms`);
        }
    });
});

// Enable the "hidden until revealed" state only after JS is running
document.body.classList.add('js-ready');

const revealables = document.querySelectorAll('.reveal');

// Anything already in viewport on first paint: mark visible immediately.
// Everything below the fold: animate in via IntersectionObserver on scroll.
requestAnimationFrame(() => {
    const vh = window.innerHeight;
    revealables.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
            el.classList.add('visible');
        }
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealables.forEach(el => {
        if (!el.classList.contains('visible')) revealObserver.observe(el);
    });
});

// ---- Active section highlight ----
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = [...navAnchors]
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

if (sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navAnchors.forEach(a => {
                    a.classList.toggle('nav-link-active', a.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => sectionObserver.observe(s));
}

// ---- Résumé preview modal + download ----
const resumeBtn = document.getElementById('resumeBtn');
const mobileResumeBtn = document.getElementById('mobileResumeBtn');
const resumeModal = document.getElementById('resumeModal');
const resumeModalOverlay = document.getElementById('resumeModalOverlay');
const resumeCloseBtn = document.getElementById('resumeCloseBtn');
const resumeDownloadBtn = document.getElementById('resumeDownloadBtn');
const resumeCanvasContainer = document.getElementById('resumeCanvasContainer');
const resumePreviewStatus = document.getElementById('resumePreviewStatus');

const RESUME_URL = 'Resume-AnujSharma.pdf';
const PDFJS_VERSION = '4.0.379';
const PDFJS_BASE = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`;
const PDFJS_MODULE = `${PDFJS_BASE}/pdf.min.mjs`;
const PDFJS_WORKER = `${PDFJS_BASE}/pdf.worker.min.mjs`;

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

function downloadResume() {
    // iOS Safari ignores the download attribute, so open inline and let the user save from there.
    if (isIOS()) {
        window.open(RESUME_URL, '_blank', 'noopener');
        return;
    }
    const link = document.createElement('a');
    link.href = RESUME_URL;
    link.download = 'Resume-AnujSharma.pdf';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

let pdfjsLibPromise = null;
function loadPdfJs() {
    if (!pdfjsLibPromise) {
        pdfjsLibPromise = import(/* @vite-ignore */ PDFJS_MODULE).then(mod => {
            mod.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
            return mod;
        });
    }
    return pdfjsLibPromise;
}

let pdfDocPromise = null;
function loadPdfDoc() {
    if (!pdfDocPromise) {
        pdfDocPromise = loadPdfJs().then(pdfjsLib =>
            pdfjsLib.getDocument(RESUME_URL).promise
        );
    }
    return pdfDocPromise;
}

let resumeRendered = false;
let resumeRendering = false;

async function renderResumePreview() {
    if (resumeRendered || resumeRendering) return;
    resumeRendering = true;
    try {
        const pdf = await loadPdfDoc();

        const cssWidth = resumeCanvasContainer.clientWidth;
        if (!cssWidth) throw new Error('container has zero width');

        const dpr = window.devicePixelRatio || 1;
        // Oversample: bitmap = cssWidth * dpr * 1.25. No cap — DPR=3 iPhones
        // render at 3.75x for near-native crispness. Display size stays cssWidth.
        const bitmapScale = dpr * 1.25;

        resumeCanvasContainer.replaceChildren();

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const baseViewport = page.getViewport({ scale: 1 });
            const cssScale = cssWidth / baseViewport.width;
            const renderViewport = page.getViewport({ scale: cssScale * bitmapScale });

            const canvas = document.createElement('canvas');
            canvas.className = 'resume-page-canvas';
            canvas.width = Math.floor(renderViewport.width);
            canvas.height = Math.floor(renderViewport.height);

            const ctx = canvas.getContext('2d');
            resumeCanvasContainer.appendChild(canvas);

            await page.render({ canvasContext: ctx, viewport: renderViewport }).promise;
        }

        resumePreviewStatus.hidden = true;
        resumeRendered = true;
    } catch (err) {
        console.warn('[resume] preview failed:', err);
        resumePreviewStatus.textContent = 'Preview unavailable';
        resumePreviewStatus.hidden = false;
    } finally {
        resumeRendering = false;
    }
}

let lastFocusedBeforeResume = null;

function openResumeModal() {
    lastFocusedBeforeResume = document.activeElement;
    resumeModal.classList.add('open');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('resume-open');

    // Two rAFs so the modal has finished laying out before we measure container width.
    requestAnimationFrame(() => requestAnimationFrame(() => {
        renderResumePreview();
        resumeDownloadBtn.focus();
    }));
}

function closeResumeModal() {
    resumeModal.classList.remove('open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('resume-open');
    if (lastFocusedBeforeResume && typeof lastFocusedBeforeResume.focus === 'function') {
        lastFocusedBeforeResume.focus();
    }
}

resumeBtn.addEventListener('click', openResumeModal);
mobileResumeBtn.addEventListener('click', openResumeModal);
resumeCloseBtn.addEventListener('click', closeResumeModal);
resumeModalOverlay.addEventListener('click', closeResumeModal);
resumeDownloadBtn.addEventListener('click', downloadResume);

document.addEventListener('keydown', (e) => {
    if (!resumeModal.classList.contains('open')) return;

    if (e.key === 'Escape') {
        e.preventDefault();
        closeResumeModal();
        return;
    }

    if (e.key === 'Tab') {
        const focusable = [resumeDownloadBtn, resumeCloseBtn];
        const currentIndex = focusable.indexOf(document.activeElement);
        if (currentIndex === -1) {
            e.preventDefault();
            focusable[0].focus();
            return;
        }
        const nextIndex = e.shiftKey
            ? (currentIndex - 1 + focusable.length) % focusable.length
            : (currentIndex + 1) % focusable.length;
        e.preventDefault();
        focusable[nextIndex].focus();
    }
});

// ---- Smooth anchor scroll ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ---- Hero shader background (WebGL) ----
(function initHeroShader() {
    const canvas = document.querySelector('.hero-bg');
    const hero = document.querySelector('.hero');
    if (!canvas || !hero) return;

    const gl = canvas.getContext('webgl', {
        premultipliedAlpha: true,
        antialias: false,
        alpha: true,
        powerPreference: 'low-power',
    });
    if (!gl) return;

    const VERT = `
        attribute vec2 aPos;
        void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
    `;

    const FRAG = `
        precision highp float;
        uniform float uTime;
        uniform vec2 uRes;
        uniform vec2 uMouse;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        uniform float uIntensity;

        vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v){
            const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                                -0.577350269189626, 0.024390243902439);
            vec2 i = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                           + i.x + vec3(0.0, i1.x, 1.0));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                                    dot(x12.zw,x12.zw)), 0.0);
            m = m*m; m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
            vec3 g;
            g.x = a0.x * x0.x + h.x * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        float fbm(vec2 p){
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 4; i++) {
                v += a * snoise(p);
                p *= 2.0;
                a *= 0.5;
            }
            return v;
        }

        void main(){
            vec2 uv = gl_FragCoord.xy / uRes.xy;
            vec2 p = uv * 2.0 - 1.0;
            p.x *= uRes.x / uRes.y;

            float t = uTime * 0.035;

            // Mouse offset in normalized-ish space (-1..1 range on both axes)
            vec2 m = (uMouse * 2.0 - 1.0);
            m.x *= uRes.x / uRes.y;

            vec2 warp = vec2(
                fbm(p * 0.55 + vec2(t, t * 0.6) + m * 0.22),
                fbm(p * 0.55 + vec2(-t * 0.8, t * 0.4) - m * 0.22)
            );

            float field  = fbm(p * 0.95 + warp * 1.35 + vec2(t * 0.25, 0.0) + m * 0.12);
            float field2 = fbm(p * 0.45 + vec2(-t * 0.5, t * 0.7) + m * 0.08);

            float f  = smoothstep(-0.55, 0.70, field);
            float f2 = smoothstep(-0.35, 0.55, field2);

            vec3 col = mix(uColorA, uColorB, f);
            col = mix(col, uColorC, f2 * 0.45);

            // Soft spotlight that trails the cursor
            float spot = 1.0 - smoothstep(0.0, 1.1, length(p - m * 0.9));
            col += spot * 0.09;

            // gentle top-weighted falloff, soft edge vignette
            float vy = smoothstep(1.35, -0.15, uv.y);
            float vx = smoothstep(1.25, 0.25, abs(uv.x - 0.5) * 2.0);
            float a = uIntensity * vy * mix(0.55, 1.0, vx);
            a += spot * 0.05 * uIntensity;

            gl_FragColor = vec4(col * a, a);
        }
    `;

    function compile(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.warn('[hero-bg] shader:', gl.getShaderInfoLog(s));
            return null;
        }
        return s;
    }

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.warn('[hero-bg] link:', gl.getProgramInfoLog(prog));
        return;
    }
    gl.useProgram(prog);

    // full-screen triangle (covers clip space)
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uColA = gl.getUniformLocation(prog, 'uColorA');
    const uColB = gl.getUniformLocation(prog, 'uColorB');
    const uColC = gl.getUniformLocation(prog, 'uColorC');
    const uIntensity = gl.getUniformLocation(prog, 'uIntensity');

    // Mouse tracking — target updated on move, actual lerps toward it each frame
    const mouseTarget = { x: 0.5, y: 0.4 };
    const mouse = { x: 0.5, y: 0.4 };

    function onPointerMove(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1.0 - (e.clientY - rect.top) / rect.height;
        mouseTarget.x = Math.max(-0.2, Math.min(1.2, x));
        mouseTarget.y = Math.max(-0.2, Math.min(1.2, y));
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', () => {
        mouseTarget.x = 0.5;
        mouseTarget.y = 0.4;
    }, { passive: true });

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const isDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
    const palette = () => isDark()
        ? {
            a: [0.20, 0.19, 0.42],  // deep indigo (muted)
            b: [0.38, 0.28, 0.55],  // violet (muted)
            c: [0.22, 0.32, 0.58],  // dusty blue
            intensity: 0.28,
          }
        : {
            a: [0.78, 0.76, 0.94],  // soft lavender
            b: [0.90, 0.82, 0.92],  // pale mauve
            c: [0.82, 0.88, 0.99],  // pale sky
            intensity: 0.38,
          };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const rect = canvas.getBoundingClientRect();
        const w = Math.max(1, Math.floor(rect.width * dpr));
        const h = Math.max(1, Math.floor(rect.height * dpr));
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
        }
    }

    function updateOpacity() {
        const h = hero.offsetHeight || window.innerHeight;
        const s = Math.max(0, Math.min(1, window.scrollY / (h * 0.85)));
        canvas.style.opacity = (1 - s).toFixed(3);
    }

    let t = 0;
    let last = performance.now();
    let running = true;
    let raf;

    function frame(now) {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!reduced.matches) t += dt;

        // Ease mouse toward target — frame-rate independent
        const k = 1 - Math.pow(0.001, dt);
        mouse.x += (mouseTarget.x - mouse.x) * k;
        mouse.y += (mouseTarget.y - mouse.y) * k;

        const p = palette();
        gl.uniform1f(uTime, t);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.uniform3fv(uColA, p.a);
        gl.uniform3fv(uColB, p.b);
        gl.uniform3fv(uColC, p.c);
        gl.uniform1f(uIntensity, p.intensity);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        if (running && !reduced.matches) {
            raf = requestAnimationFrame(frame);
        }
    }

    function start() {
        resize();
        updateOpacity();
        canvas.classList.add('ready');
        last = performance.now();
        running = true;
        raf = requestAnimationFrame(frame);
    }

    function stop() {
        running = false;
        cancelAnimationFrame(raf);
    }

    // Pause when hero is out of view (saves GPU)
    const heroObserver = new IntersectionObserver((entries) => {
        const e = entries[0];
        if (e.isIntersecting) {
            if (!running) { last = performance.now(); running = true; raf = requestAnimationFrame(frame); }
        } else {
            stop();
        }
    }, { threshold: 0 });
    heroObserver.observe(hero);

    window.addEventListener('resize', () => { resize(); updateOpacity(); }, { passive: true });
    window.addEventListener('scroll', updateOpacity, { passive: true });
    reduced.addEventListener?.('change', () => {
        if (reduced.matches) stop();
        else if (!running) { last = performance.now(); running = true; raf = requestAnimationFrame(frame); }
        // always render at least one frame with new state
        requestAnimationFrame(frame);
    });

    start();
    if (reduced.matches) {
        t = 1.8;
        requestAnimationFrame(frame);
        stop();
    }
})();

// ---- Console greeting ----
console.log('%c anuj.sh ', 'background:#8b8fff;color:#08090a;padding:2px 6px;border-radius:3px;font-weight:600');
console.log('%cLooking under the hood? Say hi — me@anujsh.com', 'color:#8a8f98');
