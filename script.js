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

// ---- Console greeting ----
console.log('%c anuj.sh ', 'background:#8b8fff;color:#08090a;padding:2px 6px;border-radius:3px;font-weight:600');
console.log('%cLooking under the hood? Say hi — me@anujsh.com', 'color:#8a8f98');
