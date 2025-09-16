// Main Event RSVP Website JavaScript
// Professional Corporate Theme with 8-bit pixel art elements

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
    eventDate: '2025-09-19T18:00:00-05:00',
    timeZone: 'America/Bogota',
        animationDuration: 300,
        countdownInterval: 1000,
        scrollOffset: 80,
    formEndpoint: '/success.html'
    };

    // State Management
    const state = {
        isLoading: true,
        formData: {}
    };
    // Track timers
    state.countdownTimerId = null;

    // DOM Elements
    const elements = {
        loadingScreen: null,
        navbar: null,
        countdownElements: {},
        rsvpForm: null
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
    
    // Add fade-in classes to elements with fade1, fade2, fade3 with JS delay
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            document.querySelectorAll('.fade1').forEach(function(el) {
                el.classList.add('fade-in-1');
            });
        },1000);
        setTimeout(function() {
            document.querySelectorAll('.fade2').forEach(function(el) {
                el.classList.add('fade-in-2');
            });
        }, 2000);
        setTimeout(function() {
            document.querySelectorAll('.fade3').forEach(function(el) {
                el.classList.add('fade-in-3');
            });
        }, 3000);
    });
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
        // Initialize components
        initializeNavigation();
        initializeCountdown();
        initializeRSVPForm();
        // All animation-related JS except fade-in logic has been removed

        // Fade-in sequence for hero elements
        setTimeout(() => {
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) heroTitle.classList.add('fade-in-1');
        }, 400);
        setTimeout(() => {
            const heroDetails = document.querySelector('.hero-details');
            if (heroDetails) heroDetails.classList.add('fade-in-2');
            const countdown = document.querySelector('.countdown-container');
            if (countdown) countdown.classList.add('fade-in-2');
        }, 1200);
        setTimeout(() => {
            const rsvpForm = document.querySelector('.rsvp-form');
            if (rsvpForm) rsvpForm.classList.add('fade-in-3');
        }, 2000);

        // Hide loading screen after everything is ready
        setTimeout(hideLoadingScreen, 2200);
        
        console.log('✅ Website initialization complete!');
    }

    function cacheElements() {
        elements.loadingScreen = document.querySelector('.loading-screen');
        elements.navbar = document.querySelector('.navbar');
        elements.rsvpForm = document.querySelector('#rsvp-form');
        
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
        
        // Navigation events
        document.addEventListener('click', handleNavClick);
        
        // Form events
        if (elements.rsvpForm) {
            console.log('✅ RSVP Form found, attaching event listeners');
            elements.rsvpForm.addEventListener('submit', handleFormSubmit);
            elements.rsvpForm.addEventListener('input', function(event) {
                if (event.target.name !== 'phone') {
                    handleFormInput(event);
                }
            });
            elements.rsvpForm.addEventListener('change', function(event) {
                if (event.target.name !== 'phone') {
                    handleFormInput(event);
                }
            });
            // Validate all fields on blur for best UX except phone
            elements.rsvpForm.querySelectorAll('input, textarea, select').forEach(function(input) {
                if (input.name !== 'phone') {
                    input.addEventListener('blur', function(e) {
                        validateField(e.target);
                    });
                }
            });
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
        // store interval id so it can be cleared when event starts
        state.countdownTimerId = setInterval(updateCountdown, CONFIG.countdownInterval);
    }

    // Called when the event start time has passed
    function displayEventStarted() {
        // Stop the countdown timer if running
        if (state.countdownTimerId) {
            clearInterval(state.countdownTimerId);
            state.countdownTimerId = null;
        }

        // Set all countdown numbers to zero
        Object.keys(elements.countdownElements).forEach(unit => {
            const el = elements.countdownElements[unit];
            if (el) el.textContent = '0';
        });

        // Optionally show a friendly message in the countdown container
        const container = document.querySelector('.countdown-container');
        if (container && !container.querySelector('.event-started-message')) {
            const msg = document.createElement('div');
            msg.className = 'event-started-message';
            msg.textContent = 'El evento ha comenzado';
            msg.style.color = 'var(--color-1)';
            msg.style.fontWeight = '700';
            msg.style.marginTop = '1rem';
            container.appendChild(msg);
        }
    }

    // Expose a safe global fallback for environments where scoping differs
    try {
        if (typeof window !== 'undefined') {
            window.displayEventStarted = displayEventStarted;
        }
    } catch (e) {
        // ignore
    }

    function updateCountdown() {
        const eventDate = new Date(CONFIG.eventDate);
        const now = new Date();
        const timeDifference = eventDate.getTime() - now.getTime();
        
        if (timeDifference <= 0) {
            // Call local or global fallback to avoid ReferenceError in some environments
            if (typeof displayEventStarted === 'function') {
                displayEventStarted();
            } else if (typeof window !== 'undefined' && typeof window.displayEventStarted === 'function') {
                window.displayEventStarted();
            } else {
                // Fallback: clear countdown and show message
                if (state.countdownTimerId) {
                    clearInterval(state.countdownTimerId);
                    state.countdownTimerId = null;
                }
                Object.keys(elements.countdownElements).forEach(unit => {
                    const el = elements.countdownElements[unit];
                    if (el) el.textContent = '0';
                });
            }
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
                element.textContent = timeUnits[unit];
            }
        });
    }
    function initializeRSVPForm() {
        if (!elements.rsvpForm) return;
        
        // Load saved form data
        loadSavedFormData();
        
        // Initialize form validation
        initializeFormValidation();
        
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
        
        // Real-time validation for non-email fields except phone
        if (type !== 'email' && name !== 'phone') {
            validateField(event.target);
        }
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

        // No phone validation, phone is optional and never shows error messages

        // Name validation (required, min length 2, only letters and spaces)
        if (fieldName === 'name' && value) {
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'El nombre debe tener al menos 2 caracteres.';
            } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'El nombre solo puede contener letras y espacios.';
            }
        }

        // Display validation result
        displayFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    function displayFieldValidation(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        // Remove all previous error messages for this field
        formGroup.querySelectorAll('.field-error-message').forEach(function(el) {
            el.remove();
        });

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
        // Submit to Netlify (for notifications)
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        })
        .then(() => {
            // Also send RSVP data to Netlify function for Notion
            const jsonData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                plus_one: formData.get('plus_one'),
                message: formData.get('message'),
                timestamp: formData.get('timestamp')
            };
            fetch('/.netlify/functions/rsvp-to-notion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData)
            })
            .then(() => {
                // Clear saved form data
                clearSavedFormData();
                console.log('✅ Notion integration successful');

                // Redirect to success page
                window.location.href = CONFIG.formEndpoint;
            })
            .catch(error => {
                console.error('Notion integration error:', error);
                // Still redirect, but optionally show a warning
                window.location.href = CONFIG.formEndpoint;
            });
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


    // All animation-related JS except fade-in logic has been removed

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

    // Fix mobile video resize issue due to browser header minimization
    function setHeroVideoHeight() {
        var video = document.querySelector('.hero-video');
        if (video && window.innerWidth <= 768) {
            video.style.height = window.innerHeight + 'px';
        } else if (video) {
            video.style.height = '';
        }
    }
    window.addEventListener('resize', setHeroVideoHeight);
    window.addEventListener('orientationchange', setHeroVideoHeight);
    document.addEventListener('DOMContentLoaded', setHeroVideoHeight);
    setHeroVideoHeight();

    // Initialize the application
    init();

    // Expose public API for debugging
    window.RSVPWebsite = {
        state,
        validateForm,
        version: '1.0.0'
    };

})();
