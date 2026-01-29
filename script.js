// ========================================
// GESTION DU MENU BURGER (MOBILE)
// ========================================

const burgerMenu = document.getElementById('burgerMenu');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Ouvrir/fermer le menu mobile au clic sur le burger
burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fermer le menu mobile quand on clique sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ========================================
// NAVBAR : FOND FLOU AU SCROLL
// ========================================

const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    // Ajoute la classe "scrolled" si on a scrollé de plus de 50px
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ========================================
// ANIMATIONS AU SCROLL (IntersectionObserver)
// ========================================

// Sélectionne tous les éléments avec la classe "fade-in"
const fadeElements = document.querySelectorAll('.fade-in');

// Options pour l'IntersectionObserver
const observerOptions = {
    threshold: 0.1, // Déclenche quand 10% de l'élément est visible
    rootMargin: '0px 0px -50px 0px' // Décale légèrement la zone de détection
};

// Callback qui s'exécute quand un élément entre dans le viewport
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Ajoute la classe "visible" pour lancer l'animation CSS
            entry.target.classList.add('visible');
            // Arrête d'observer cet élément une fois animé
            observer.unobserve(entry.target);
        }
    });
};

// Crée l'observer et observe tous les éléments "fade-in"
const observer = new IntersectionObserver(observerCallback, observerOptions);

fadeElements.forEach(element => {
    observer.observe(element);
});

// ========================================
// SCROLL FLUIDE VERS LES SECTIONS
// ========================================

// Note : Le scroll fluide est déjà activé via CSS (scroll-behavior: smooth)
// Mais on peut aussi le gérer en JS si besoin de plus de contrôle

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Si le lien pointe vers une ancre valide
        if (targetId !== '#' && document.querySelector(targetId)) {
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            // Scroll vers l'élément avec un offset pour compenser la navbar fixe
            const offsetTop = targetElement.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// VALIDATION & ENVOI DU FORMULAIRE DE CONTACT
// ========================================

const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    
    // Récupération des valeurs du formulaire
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validation simple
    if (name === '' || email === '' || message === '') {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    
    // Validation basique de l'email (format simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Veuillez entrer une adresse email valide.');
        return;
    }
    
    // Simulation d'envoi (pas de backend réel)
    console.log('Formulaire soumis avec succès :');
    console.log('Nom :', name);
    console.log('Email :', email);
    console.log('Message :', message);
    
    // Affichage du message de succès
    successMessage.classList.add('show');
    
    // Réinitialiser le formulaire
    contactForm.reset();
    
    // Masquer le message de succès après 5 secondes
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
});

// ========================================
// AMÉLIORATION DE L'ACCESSIBILITÉ
// ========================================

// Détection de navigation au clavier (Tab) pour améliorer l'accessibilité
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ========================================
// CONSOLE LOG POUR CONFIRMATION DU CHARGEMENT
// ========================================

console.log('Portfolio de Réda Diouri - Script chargé avec succès ! 🚀');
console.log('Développé avec ❤️ en HTML/CSS/JS pur');
