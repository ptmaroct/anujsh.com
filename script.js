// anujsh.com — minimal script

// ---- Nav scroll state ----
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- Mobile menu ----
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mobile-menu a, .mobile-menu button').forEach(el => {
    el.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ---- Scroll reveal (staggered; progressive enhancement) ----
// Auto-stagger siblings within the same section when no explicit delay is set
document.querySelectorAll('.work-list, .experience-list').forEach(list => {
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

// ---- Résumé download ----
const resumeBtn = document.getElementById('resumeBtn');
const mobileResumeBtn = document.getElementById('mobileResumeBtn');

function downloadResume() {
    const link = document.createElement('a');
    link.href = 'Resume-AnujSharma.pdf';
    link.download = 'Resume-AnujSharma.pdf';
    link.click();
}

resumeBtn.addEventListener('click', downloadResume);
mobileResumeBtn.addEventListener('click', downloadResume);

// ---- Command palette ----
const commandPalette = document.getElementById('commandPalette');
const paletteOverlay = document.getElementById('paletteOverlay');
const paletteInput = document.getElementById('paletteInput');
const commandItems = [...document.querySelectorAll('.command-item')];

let selectedIndex = 0;

function visibleItems() {
    return commandItems.filter(i => i.style.display !== 'none');
}

function updateSelected() {
    const items = visibleItems();
    commandItems.forEach(i => i.classList.remove('selected'));
    if (items[selectedIndex]) items[selectedIndex].classList.add('selected');
}

function openPalette() {
    commandPalette.classList.add('open');
    paletteInput.focus();
    selectedIndex = 0;
    updateSelected();
}

function closePalette() {
    commandPalette.classList.remove('open');
    paletteInput.value = '';
    commandItems.forEach(i => { i.style.display = ''; });
    selectedIndex = 0;
    updateSelected();
}

function executeCommand(command) {
    const urls = {
        email: 'mailto:me@anujsh.com',
        github: 'https://github.com/ptmaroct',
        linkedin: 'https://www.linkedin.com/in/ptmaroct/',
        twitter: 'https://x.com/waahbete',
        resume: 'Resume-AnujSharma.pdf',
    };

    if (command === 'secret') {
        closePalette();
        openSecretMode();
        return;
    }

    if (command === 'resume') {
        downloadResume();
    } else if (urls[command]) {
        window.open(urls[command], '_blank', 'noopener');
    }

    closePalette();
}

paletteInput.addEventListener('input', () => {
    const q = paletteInput.value.toLowerCase().trim();
    commandItems.forEach(item => {
        const text = item.querySelector('.command-text').textContent.toLowerCase();
        item.style.display = text.includes(q) ? '' : 'none';
    });
    selectedIndex = 0;
    updateSelected();
});

paletteOverlay.addEventListener('click', closePalette);

commandItems.forEach((item) => {
    item.addEventListener('click', () => executeCommand(item.dataset.command));
    item.addEventListener('mouseenter', () => {
        const vis = visibleItems();
        selectedIndex = vis.indexOf(item);
        updateSelected();
    });
});

document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        commandPalette.classList.contains('open') ? closePalette() : openPalette();
        return;
    }

    if (!commandPalette.classList.contains('open')) return;

    if (e.key === 'Escape') {
        closePalette();
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const vis = visibleItems();
        if (!vis.length) return;
        selectedIndex = (selectedIndex + 1) % vis.length;
        updateSelected();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const vis = visibleItems();
        if (!vis.length) return;
        selectedIndex = (selectedIndex - 1 + vis.length) % vis.length;
        updateSelected();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        const vis = visibleItems();
        if (vis[selectedIndex]) executeCommand(vis[selectedIndex].dataset.command);
    }
});

// ---- Konami code easter egg ----
const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.code === konami[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konami.length) {
            openSecretMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// ---- Secret mode ----
const secretMode = document.getElementById('secretMode');
const closeSecretBtn = document.getElementById('closeSecret');

function openSecretMode() {
    secretMode.classList.add('open');
}

closeSecretBtn.addEventListener('click', () => secretMode.classList.remove('open'));
secretMode.addEventListener('click', (e) => {
    if (e.target === secretMode) secretMode.classList.remove('open');
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

            vec2 warp = vec2(
                fbm(p * 0.55 + vec2(t, t * 0.6)),
                fbm(p * 0.55 + vec2(-t * 0.8, t * 0.4))
            );

            float field  = fbm(p * 0.95 + warp * 1.35 + vec2(t * 0.25, 0.0));
            float field2 = fbm(p * 0.45 + vec2(-t * 0.5, t * 0.7));

            float f  = smoothstep(-0.55, 0.70, field);
            float f2 = smoothstep(-0.35, 0.55, field2);

            vec3 col = mix(uColorA, uColorB, f);
            col = mix(col, uColorC, f2 * 0.45);

            // gentle top-weighted falloff, soft edge vignette
            float vy = smoothstep(1.35, -0.15, uv.y);
            float vx = smoothstep(1.25, 0.25, abs(uv.x - 0.5) * 2.0);
            float a = uIntensity * vy * mix(0.55, 1.0, vx);

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
    const uColA = gl.getUniformLocation(prog, 'uColorA');
    const uColB = gl.getUniformLocation(prog, 'uColorB');
    const uColC = gl.getUniformLocation(prog, 'uColorC');
    const uIntensity = gl.getUniformLocation(prog, 'uIntensity');

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
            a: [0.86, 0.85, 0.97],
            b: [0.94, 0.90, 0.95],
            c: [0.91, 0.93, 1.00],
            intensity: 0.22,
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

        const p = palette();
        gl.uniform1f(uTime, t);
        gl.uniform2f(uRes, canvas.width, canvas.height);
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
