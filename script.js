// Background Grid
const bgGrid = document.getElementById('bgGrid');

function handleScroll() {
    if (window.scrollY > 50) {
        bgGrid.classList.add('visible');
    } else {
        bgGrid.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleScroll);

// Navigation scroll effect
const nav = document.getElementById('nav');

function handleNavScroll() {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavScroll);

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a, .mobile-menu button').forEach(el => {
    el.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        navToggle.classList.remove('active');
    });
});

// Terminal typing effect
const terminalText = document.getElementById('terminalText');
const phrases = [
    'booting taste_engine...',
    'loading web obsession...',
    'ready to ship fast',
    'const craft = interface + intent'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        terminalText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        terminalText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

typeEffect();

// Scroll animations - Fade in sections/cards
const sectionElements = document.querySelectorAll('section');
const fadeElements = new Set([...sectionElements, ...document.querySelectorAll('.fade-in')]);

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

sectionElements.forEach(el => el.classList.add('fade-in'));
fadeElements.forEach(el => observer.observe(el));

// Resume download buttons
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

// ==================== EASTER EGGS ====================

// Easter Egg 1: Command Palette (Ctrl+K or Cmd+K)
const commandPalette = document.getElementById('commandPalette');
const paletteOverlay = document.getElementById('paletteOverlay');
const paletteInput = document.getElementById('paletteInput');
const paletteResults = document.getElementById('paletteResults');
const commandItems = document.querySelectorAll('.command-item');

let selectedIndex = 0;

function openPalette() {
    commandPalette.classList.add('open');
    paletteInput.focus();
    selectedIndex = 0;
    updateSelectedItem();
}

function closePalette() {
    commandPalette.classList.remove('open');
    paletteInput.value = '';
}

document.addEventListener('keydown', (e) => {
    // Command palette shortcut
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (commandPalette.classList.contains('open')) {
            closePalette();
        } else {
            openPalette();
        }
    }

    // Close palette with Escape
    if (e.key === 'Escape' && commandPalette.classList.contains('open')) {
        closePalette();
    }

    // Navigate palette with arrow keys
    if (commandPalette.classList.contains('open')) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % commandItems.length;
            updateSelectedItem();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + commandItems.length) % commandItems.length;
            updateSelectedItem();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            executeCommand(commandItems[selectedIndex].dataset.command);
        }
    }
});

paletteOverlay.addEventListener('click', closePalette);

function updateSelectedItem() {
    commandItems.forEach((item, index) => {
        item.classList.toggle('selected', index === selectedIndex);
    });
}

function executeCommand(command) {
    const urls = {
        email: 'mailto:me@anujsh.com',
        github: 'https://github.com/ptmaroct',
        linkedin: 'https://www.linkedin.com/in/ptmaroct/',
        twitter: 'https://x.com/waahbete',
        resume: 'Resume-AnujSharma.pdf',
        secret: null
    };

    if (command === 'secret') {
        closePalette();
        openSecretMode();
        return;
    }

    if (command === 'resume') {
        downloadResume();
    } else if (urls[command]) {
        window.open(urls[command], '_blank');
    }

    closePalette();
}

commandItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        executeCommand(item.dataset.command);
    });

    item.addEventListener('mouseenter', () => {
        selectedIndex = index;
        updateSelectedItem();
    });
});

// Easter Egg 2: Konami Code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            openSecretMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Easter Egg 3: Secret Mode
const secretMode = document.getElementById('secretMode');
const closeSecretBtn = document.getElementById('closeSecret');
const footerHint = document.getElementById('footerHint');

function openSecretMode() {
    secretMode.classList.add('open');
    footerHint.style.opacity = '0';
}

closeSecretBtn.addEventListener('click', () => {
    secretMode.classList.remove('open');
});

// Easter Egg 4: Console joke
const secrets = [
    'Anuj\'s code: no bugs, only features 🫡',
    'console.log("Ship it!")',
    'Warning: This portfolio may cause extreme competence',
    '404: Excuses not found',
    'Building something awesome...',
    'Anuj.exe has stopped working — Just kidding, never!'
];

console.log('%c👋 Hey there!', 'font-size: 24px; color: #22d3ee;');
console.log(secrets[Math.floor(Math.random() * secrets.length)]);

// Add hover effect hint for the discerning developer
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        console.log('%c✨ Nice hover!', 'color: #22d3ee;');
    });
});

// Easter Egg 5: Double-click on logo for matrix effect (subtle)
let logoClickCount = 0;
const navLogo = document.querySelector('.nav-logo');

navLogo.addEventListener('click', () => {
    logoClickCount++;
    if (logoClickCount === 7) {
        // Subtle matrix rain on hero section
        const hero = document.querySelector('.hero');
        hero.style.filter = 'hue-rotate(90deg)';
        setTimeout(() => {
            hero.style.filter = '';
        }, 500);
        logoClickCount = 0;
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
