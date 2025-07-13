// Main Event RSVP Website JavaScript
// Professional Corporate Theme with 8-bit pixel art elements

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        eventDate: '2025-07-18T18:00:00',
        timeZone: 'America/Bogota',
        animationDuration: 300,
        countdownInterval: 1000,
        scrollOffset: 80,
        formEndpoint: '/thank-you.html'
    };

    // State Management
    const state = {
        isLoading: true,
        formData: {},
        rsvpStats: {
            attending: 0,
            notAttending: 0,
            pending: 0
        }
    };

    // DOM Elements
    const elements = {
        loadingScreen: null,
        navbar: null,
        countdownElements: {},
        rsvpForm: null,
        rsvpStatsContainer: null
    };

    // Initialize Application
    function init() {
        console.log('🎉 Parrillazo Guapulense RSVP Website Initializing...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            initializeApp();
        }
    }

    function initializeApp() {
        // Cache DOM elements
        cacheElements();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize components
        initializeLoadingScreen();
        initializeNavigation();
        initializeCountdown();
        initializeRSVPForm();
        initializeAnimations();
        initializePixelEffects();
        
        // Hide loading screen after everything is ready
        setTimeout(hideLoadingScreen, 2000);
        
        console.log('✅ Website initialization complete!');
    }

    function cacheElements() {
        elements.loadingScreen = document.querySelector('.loading-screen');
        elements.navbar = document.querySelector('.navbar');
        elements.rsvpForm = document.querySelector('#rsvp-form');
        elements.rsvpStatsContainer = document.querySelector('.rsvp-stats');
        
        // Countdown elements
        elements.countdownElements = {
            days: document.querySelector('#countdown-days'),
            hours: document.querySelector('#countdown-hours'),
            minutes: document.querySelector('#countdown-minutes'),
            seconds: document.querySelector('#countdown-seconds')
        };
    }

    function setupEventListeners() {
        // Window events
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        
        // Navigation events
        document.addEventListener('click', handleNavClick);
        
        // Form events
        if (elements.rsvpForm) {
            console.log('✅ RSVP Form found, attaching event listeners');
            elements.rsvpForm.addEventListener('submit', handleFormSubmit);
            elements.rsvpForm.addEventListener('input', handleFormInput);
        } else {
            console.error('❌ RSVP Form not found!');
        }

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
    }

    // Loading Screen Management
    function initializeLoadingScreen() {
        if (!elements.loadingScreen) return;
        
        const progressBar = elements.loadingScreen.querySelector('.loading-progress');
        let progress = 0;
        
        const progressInterval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 100) {
                progress = 100;
                clearInterval(progressInterval);
            }
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        }, 200);
    }

    function hideLoadingScreen() {
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.add('hidden');
            state.isLoading = false;
            
            // Enable smooth scrolling after loading
            document.documentElement.style.scrollBehavior = 'smooth';
            
            // Start entrance animations
            animateOnLoad();
        }
    }

    // Navigation Management
    function initializeNavigation() {
        if (!elements.navbar) return;
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    }

    function handleScroll() {
        // Update navbar appearance
        if (elements.navbar) {
            if (window.scrollY > 50) {
                elements.navbar.classList.add('scrolled');
            } else {
                elements.navbar.classList.remove('scrolled');
            }
        }
        
        // Update active navigation link
        updateActiveNavLink();
        
        // Trigger scroll animations
        handleScrollAnimations();
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - CONFIG.scrollOffset;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    function handleNavClick(event) {
        const link = event.target.closest('.nav-link');
        if (!link) return;
        
        event.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - CONFIG.scrollOffset;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // Countdown Timer
    function initializeCountdown() {
        if (!Object.values(elements.countdownElements).every(el => el)) {
            console.warn('Countdown elements not found');
            return;
        }
        
        updateCountdown();
        setInterval(updateCountdown, CONFIG.countdownInterval);
    }

    function updateCountdown() {
        const eventDate = new Date(CONFIG.eventDate);
        const now = new Date();
        const timeDifference = eventDate.getTime() - now.getTime();
        
        if (timeDifference <= 0) {
            displayEventStarted();
            return;
        }
        
        const timeUnits = calculateTimeUnits(timeDifference);
        updateCountdownDisplay(timeUnits);
    }

    function calculateTimeUnits(timeDifference) {
        return {
            days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((timeDifference % (1000 * 60)) / 1000)
        };
    }

    function updateCountdownDisplay(timeUnits) {
        Object.keys(timeUnits).forEach(unit => {
            const element = elements.countdownElements[unit];
            if (element) {
                const newValue = String(timeUnits[unit]).padStart(2, '0');
                if (element.textContent !== newValue) {
                    element.textContent = newValue;
                    animateCountdownChange(element);
                }
            }
        });
    }

    function animateCountdownChange(element) {
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }

    function displayEventStarted() {
        const countdownContainer = document.querySelector('.countdown-container');
        if (countdownContainer) {
            countdownContainer.innerHTML = `
                <h3>🎉 ¡El evento ha comenzado!</h3>
                <p>¡Esperamos que estés disfrutando del Parrillazo Guapulense!</p>
            `;
        }
    }

    // RSVP Form Management
    function initializeRSVPForm() {
        if (!elements.rsvpForm) return;
        
        // Load saved form data
        loadSavedFormData();
        
        // Initialize form validation
        initializeFormValidation();
        
        // Load RSVP statistics
        loadRSVPStats();
    }

    function handleFormInput(event) {
        const { name, value, type, checked } = event.target;
        
        // Update form data state
        if (type === 'checkbox') {
            state.formData[name] = checked;
        } else {
            state.formData[name] = value;
        }
        
        // Auto-save form data
        saveFormData();
        
        // Real-time validation
        validateField(event.target);
    }

    function handleFormSubmit(event) {
        console.log('🔄 Form submit intercepted by JavaScript');
        event.preventDefault();
        
        if (!validateForm()) {
            showFormError('Por favor corrige los errores antes de enviar.');
            return;
        }
        
        submitForm();
    }

    function validateForm() {
        const requiredFields = elements.rsvpForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const fieldType = field.type;
        
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es requerido.';
        }
        
        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor ingresa un email válido.';
            }
        }
        
        // Phone validation
        if (fieldName === 'phone' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
            if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
                isValid = false;
                errorMessage = 'Por favor ingresa un número de teléfono válido.';
            }
        }
        
        // Display validation result
        displayFieldValidation(field, isValid, errorMessage);
        
        return isValid;
    }

    function displayFieldValidation(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        // Remove existing error elements
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Remove any custom error styling from the field itself
        field.classList.remove('field-valid');
        // Only show error message below the field
        if (!isValid) {
            // Add error message
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error-message';
            errorElement.textContent = errorMessage;
            errorElement.style.color = '#dc3545';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            formGroup.appendChild(errorElement);
        } else if (field.value.trim()) {
            field.classList.add('field-valid');
        }
    }

    function submitForm() {
        const submitButton = elements.rsvpForm.querySelector('button[type="submit"]');
        if (!submitButton) return;
        
        // Show loading state
        setButtonLoading(submitButton, true);
        // Prepare form data
        const formData = new FormData(elements.rsvpForm);
        // Add additional data
        formData.append('timestamp', new Date().toISOString());
        formData.append('event', 'Parrillazo Guapulense');
        // Submit to Netlify
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        })
        .then(() => {
            // Clear saved form data
            clearSavedFormData();
            // Redirect to success page
            window.location.href = '/success.html';
        })
        .catch(error => {
            console.error('Form submission error:', error);
            showFormError('Hubo un error al enviar el formulario. Por favor intenta nuevamente.');
            setButtonLoading(submitButton, false);
        });
    }

    function setButtonLoading(button, isLoading) {
        const textElement = button.querySelector('.btn-text');
        const loadingElement = button.querySelector('.btn-loading');
        
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    function showFormError(message) {
        // Remove existing error
        const existingError = document.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error element
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-bottom: 1rem;
            text-align: center;
        `;
        errorElement.textContent = message;
        
        // Insert at top of form
        elements.rsvpForm.insertBefore(errorElement, elements.rsvpForm.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 5000);
    }

    function saveFormData() {
        try {
            localStorage.setItem('rsvp_form_data', JSON.stringify(state.formData));
        } catch (error) {
            console.warn('Could not save form data:', error);
        }
    }

    function loadSavedFormData() {
        try {
            const savedData = localStorage.getItem('rsvp_form_data');
            if (savedData) {
                state.formData = JSON.parse(savedData);
                
                // Populate form fields
                Object.keys(state.formData).forEach(name => {
                    const field = elements.rsvpForm.querySelector(`[name="${name}"]`);
                    if (field) {
                        if (field.type === 'checkbox') {
                            field.checked = state.formData[name];
                        } else {
                            field.value = state.formData[name];
                        }
                    }
                });
            }
        } catch (error) {
            console.warn('Could not load saved form data:', error);
        }
    }

    function clearSavedFormData() {
        try {
            localStorage.removeItem('rsvp_form_data');
            state.formData = {};
        } catch (error) {
            console.warn('Could not clear saved form data:', error);
        }
    }

    function initializeFormValidation() {
        // Add CSS for validation states
        const style = document.createElement('style');
        style.textContent = `
            .field-valid {
                border-color: #28a745 !important;
                box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1) !important;
            }
            .field-error {
                border-color: #dc3545 !important;
                box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // RSVP Statistics
    function loadRSVPStats() {
        // In a real implementation, this would fetch from an API
        // For now, we'll simulate with random data
        state.rsvpStats = {
            attending: Math.floor(Math.random() * 50) + 25,
            notAttending: Math.floor(Math.random() * 10) + 5,
            pending: Math.floor(Math.random() * 15) + 10
        };
        
        updateRSVPStatsDisplay();
    }

    function updateRSVPStatsDisplay() {
        if (!elements.rsvpStatsContainer) return;
        
        const total = state.rsvpStats.attending + state.rsvpStats.notAttending + state.rsvpStats.pending;
        
        elements.rsvpStatsContainer.innerHTML = `
            <h4>📊 Estado de Confirmaciones</h4>
            <div class="stat-item">
                <span class="stat-label">Confirmados</span>
                <span class="stat-value">${state.rsvpStats.attending}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">No asisten</span>
                <span class="stat-value">${state.rsvpStats.notAttending}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Pendientes</span>
                <span class="stat-value">${state.rsvpStats.pending}</span>
            </div>
            <div class="stat-item" style="border-top: 1px solid var(--color-border); padding-top: 0.5rem; margin-top: 0.5rem;">
                <span class="stat-label"><strong>Total</strong></span>
                <span class="stat-value"><strong>${total}</strong></span>
            </div>
        `;
    }

    // Animation Management
    function initializeAnimations() {
        // Intersection Observer for scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        
        // Observe animatable elements
        document.querySelectorAll('.detail-card, .highlight-item, .section-header').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    function animateOnLoad() {
        // Animate hero elements
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-details, .hero-cta');
        heroElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.2}s`;
        });
    }

    function handleScrollAnimations() {
        // Add scroll-based animations here if needed
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        
        // Parallax effect for hero background
        const heroBackground = document.querySelector('.pixel-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    }

    // Pixel Art Effects
    function initializePixelEffects() {
        createFloatingPixels();
        animatePixelElements();
    }

    function createFloatingPixels() {
        const pixelContainer = document.querySelector('.pixel-background');
        if (!pixelContainer) return;
        
        // Add additional floating pixel elements
        for (let i = 0; i < 20; i++) {
            const pixel = document.createElement('div');
            pixel.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 1px;
                animation: pixelFloat ${10 + Math.random() * 20}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 10}s;
            `;
            pixelContainer.appendChild(pixel);
        }
    }

    function animatePixelElements() {
        // Animate pixel art elements in the about section
        const pixelElements = document.querySelectorAll('.pixel-robot, .pixel-cat, .pixel-grill');
        
        pixelElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'scale(1.1)';
                element.style.transition = 'transform 0.3s ease';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'scale(1)';
            });
        });
    }

    // Utility Functions
    function handleResize() {
        // Handle responsive adjustments
        updateCountdownLayout();
    }

    function updateCountdownLayout() {
        const countdown = document.querySelector('.countdown');
        if (!countdown) return;
        
        if (window.innerWidth < 480) {
            countdown.style.flexWrap = 'wrap';
        } else {
            countdown.style.flexWrap = 'nowrap';
        }
    }

    function handleKeyDown(event) {
        // Keyboard accessibility
        if (event.key === 'Escape') {
            // Close any open modals or menus
            const activeModals = document.querySelectorAll('.modal.active');
            activeModals.forEach(modal => modal.classList.remove('active'));
        }
    }

    // Error Handling
    window.addEventListener('error', function(event) {
        console.error('JavaScript error:', event.error);
        
        // In production, you might want to send this to an error tracking service
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': event.error.toString(),
                'fatal': false
            });
        }
    });

    // Performance Monitoring
    window.addEventListener('load', function() {
        // Log performance metrics
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log(`🚀 Page loaded in ${loadTime}ms`);
        }
    });

    // Initialize the application
    init();

    // Expose public API for debugging
    window.RSVPWebsite = {
        state,
        updateRSVPStats: updateRSVPStatsDisplay,
        validateForm,
        version: '1.0.0'
    };

})();
