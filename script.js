// Navigation mobile
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a');

// Dark Mode Toggle
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

// Vérifier la préférence enregistrée ou celle du système
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    html.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Changer l'icône
    if (newTheme === 'dark') {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        themeToggle.setAttribute('aria-label', 'Basculer en mode clair');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        themeToggle.setAttribute('aria-label', 'Basculer en mode sombre');
    }
});

burger.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('active');
    burger.classList.toggle('active');
    burger.setAttribute('aria-expanded', isActive);
});

// Fermer le menu mobile lors du clic sur un lien
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        burger.classList.remove('active');
    });
});

// Navigation fluide
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 70; // Hauteur de la navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer tous les éléments avec animation
document.querySelectorAll('.skill-card, .project-card, .stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Changement de style de la navbar au scroll (optimisé)
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        navbar.classList.add('navbar--scrolled');
    } else {
        navbar.classList.remove('navbar--scrolled');
    }
}, { passive: true });

// Gestion du formulaire de contact
const contactForm = document.querySelector('.contact-form');

// Le formulaire de contact est géré par FormSubmit (envoi email direct)
// Plus besoin de JavaScript pour l'envoi

// Animation de typing pour le titre
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            heroTitle.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // Démarrer l'animation après un court délai
    setTimeout(typeWriter, 500);
}

// Effet parallax sur le hero (requestAnimationFrame)
let parallaxTicking = false;
window.addEventListener('scroll', () => {
    if (parallaxTicking) return;
    parallaxTicking = true;

    requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');

        if (heroContent && heroImage) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
        }

        parallaxTicking = false;
    });
}, { passive: true });

// Compteur animé pour les statistiques
const stats = document.querySelectorAll('.stat h3');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const text = target.textContent;
            const number = parseInt(text);
            
            if (!isNaN(number)) {
                let current = 0;
                const increment = number / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        target.textContent = text;
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(current) + (text.includes('+') ? '+' : '');
                    }
                }, 30);
            }
            
            statsObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

stats.forEach(stat => statsObserver.observe(stat));

// Cursor personnalisé (effet moderne)
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Ajouter le style du cursor
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .custom-cursor {
        width: 20px;
        height: 20px;
        border: 2px solid #6366f1;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        display: none;
    }
    
    @media (min-width: 768px) {
        .custom-cursor {
            display: block;
        }
    }
`;
document.head.appendChild(cursorStyle);

// Effet hover sur les liens et boutons
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.background = 'rgba(99, 102, 241, 0.2)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.background = 'transparent';
    });
});

// Galerie Lightbox
const galleryModal = document.getElementById('gallery-modal');
const galleryImage = document.getElementById('gallery-image');
const galleryCounter = document.getElementById('gallery-counter');
const galleryClose = document.querySelector('.gallery-close');
const galleryPrev = document.querySelector('.gallery-prev');
const galleryNext = document.querySelector('.gallery-next');

const galleries = {
    mla: ['img/image.png', 'img/image1.png']
};

let currentGallery = null;
let currentImageIndex = 0;

document.querySelectorAll('.gallery-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentGallery = btn.dataset.gallery;
        currentImageIndex = 0;
        showImage();
        galleryModal.classList.add('active');
    });
});

function showImage() {
    if (currentGallery && galleries[currentGallery]) {
        const images = galleries[currentGallery];
        galleryImage.src = images[currentImageIndex];
        galleryCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
    }
}

galleryClose.addEventListener('click', () => {
    galleryModal.classList.remove('active');
});

galleryPrev.addEventListener('click', () => {
    if (currentGallery && galleries[currentGallery]) {
        const images = galleries[currentGallery];
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        showImage();
    }
});

galleryNext.addEventListener('click', () => {
    if (currentGallery && galleries[currentGallery]) {
        const images = galleries[currentGallery];
        currentImageIndex = (currentImageIndex + 1) % images.length;
        showImage();
    }
});

galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
        galleryModal.classList.remove('active');
    }
});

// Clavier
document.addEventListener('keydown', (e) => {
    if (galleryModal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') galleryPrev.click();
        if (e.key === 'ArrowRight') galleryNext.click();
        if (e.key === 'Escape') galleryClose.click();
    }
});

// Service Worker (cache des ressources statiques)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {
            // Service Worker non disponible
        });
    });
}

console.log('Portfolio chargé avec succès ! 🚀');
