document.addEventListener('DOMContentLoaded', function() {
    // Initialize form functionality
    initializeForm();
    initializeColorScheme();
    initializeProgressTracker();
    initializeAutoSave();
    initializeSummaryGenerator();
});

function initializeForm() {
    const form = document.getElementById('configForm');
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', updateProgress);
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            showValidationErrors();
        } else {
            showLoadingState();
        }
    });
}

function initializeColorScheme() {
    const colorSchemeRadios = document.querySelectorAll('input[name="color_scheme"]');
    const customColorsDiv = document.getElementById('custom-colors');
    
    colorSchemeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'custom') {
                customColorsDiv.style.display = 'block';
            } else {
                customColorsDiv.style.display = 'none';
            }
        });
    });
    
    // Color picker sync
    const colorInputs = [
        { picker: 'primary_color', text: 'primary_color_hex' },
        { picker: 'secondary_color', text: 'secondary_color_hex' },
        { picker: 'text_color', text: 'text_color_hex' }
    ];
    
    colorInputs.forEach(pair => {
        const picker = document.getElementById(pair.picker);
        const text = document.querySelector(`input[name="${pair.text}"]`);
        
        if (picker && text) {
            picker.addEventListener('input', () => {
                text.value = picker.value;
            });
            
            text.addEventListener('input', () => {
                if (isValidHex(text.value)) {
                    picker.value = text.value;
                }
            });
        }
    });
}

function initializeProgressTracker() {
    // Create progress indicator
    const progressHTML = `
        <div class="progress-indicator">
            <div class="progress-bar" id="progressBar"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', progressHTML);
    
    updateProgress();
}

function updateProgress() {
    const form = document.getElementById('configForm');
    const requiredFields = form.querySelectorAll('[required]');
    const filledFields = Array.from(requiredFields).filter(field => {
        if (field.type === 'checkbox') {
            return field.checked;
        }
        return field.value.trim() !== '';
    });
    
    const progress = (filledFields.length / requiredFields.length) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

function initializeAutoSave() {
    let saveTimeout;
    const form = document.getElementById('configForm');
    
    form.addEventListener('input', function() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveToLocalStorage();
        }, 2000);
    });
    
    // Load saved data on page load
    loadFromLocalStorage();
}

function saveToLocalStorage() {
    const formData = new FormData(document.getElementById('configForm'));
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem('eventConfigDraft', JSON.stringify(data));
    showAutoSaveIndicator();
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('eventConfigDraft');
    if (!saved) return;
    
    try {
        const data = JSON.parse(saved);
        const form = document.getElementById('configForm');
        
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = field.value === data[key];
                } else {
                    field.value = data[key];
                }
            }
        });
        
        // Trigger change events to update UI
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.dispatchEvent(new Event('change'));
        });
        
        updateProgress();
    } catch (e) {
        console.error('Error loading saved data:', e);
    }
}

function showAutoSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.textContent = '✓ Draft saved automatically';
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 1001;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(indicator);
    
    setTimeout(() => indicator.style.opacity = '1', 100);
    setTimeout(() => {
        indicator.style.opacity = '0';
        setTimeout(() => document.body.removeChild(indicator), 300);
    }, 2000);
}

function initializeSummaryGenerator() {
    // Auto-generate event summary
    const summaryField = document.getElementById('event_summary');
    const watchFields = ['event_name', 'event_date', 'event_time', 'host_names'];
    
    watchFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('input', generateSummary);
        }
    });
}

function generateSummary() {
    const eventName = document.getElementById('event_name').value;
    const eventDate = document.getElementById('event_date').value;
    const eventTime = document.getElementById('event_time').value;
    const hostNames = document.getElementById('host_names').value;
    const summaryField = document.getElementById('event_summary');
    
    if (eventName && eventDate && eventTime && hostNames) {
        const formattedDate = formatDate(eventDate);
        summaryField.value = `${eventName} on ${formattedDate} at ${eventTime} hosted by ${hostNames} - CONFIRM ALL DETAILS CORRECT`;
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function validateField(event) {
    const field = event.target;
    const isValid = field.checkValidity();
    
    field.classList.toggle('invalid', !isValid);
    field.classList.toggle('valid', isValid);
    
    // Remove any existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message if invalid
    if (!isValid && field.validationMessage) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = field.validationMessage;
        errorDiv.style.cssText = 'color: #dc3545; font-size: 0.9rem; margin-top: 5px;';
        field.parentNode.appendChild(errorDiv);
    }
}

function validateForm() {
    const form = document.getElementById('configForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.checkValidity()) {
            isValid = false;
            field.focus();
            validateField({ target: field });
        }
    });
    
    return isValid;
}

function showValidationErrors() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error';
    errorDiv.innerHTML = `
        <h3>⚠️ Please fix the following errors:</h3>
        <p>Some required fields are missing or invalid. Please scroll up and complete all required fields marked with *</p>
    `;
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
        border: 1px solid #f5c6cb;
    `;
    
    const formActions = document.querySelector('.form-actions');
    formActions.insertBefore(errorDiv, formActions.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

function showLoadingState() {
    const submitBtn = document.querySelector('.btn-primary');
    submitBtn.innerHTML = '⏳ Generating Configuration...';
    submitBtn.disabled = true;
    
    // Add loading overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        font-size: 1.2rem;
        color: #667eea;
    `;
    overlay.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 20px;">⚙️</div>
            <div>Processing your configuration...</div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function previewSummary() {
    const formData = new FormData(document.getElementById('configForm'));
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Generate preview content
    const previewContent = generatePreviewHTML(data);
    
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="background: white; max-width: 800px; max-height: 90vh; overflow-y: auto; border-radius: 10px; padding: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #667eea;">📋 Configuration Preview</h2>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            ${previewContent}
            <div style="text-align: center; margin-top: 30px;">
                <button onclick="this.closest('.modal').remove()" class="btn-secondary">Close Preview</button>
            </div>
        </div>
    `;
    
    modal.className = 'modal';
    document.body.appendChild(modal);
}

function generatePreviewHTML(data) {
    return `
        <div style="line-height: 1.6;">
            <h3 style="color: #667eea; margin-bottom: 15px;">🎉 Event Details</h3>
            <p><strong>Event:</strong> ${data.event_name || 'Not specified'}</p>
            <p><strong>Type:</strong> ${data.event_type || 'Not specified'}</p>
            <p><strong>Date:</strong> ${data.event_date ? formatDate(data.event_date) : 'Not specified'}</p>
            <p><strong>Time:</strong> ${data.event_time || 'Not specified'}</p>
            <p><strong>Location:</strong> ${data.event_location || 'Not specified'}</p>
            <p><strong>Hosts:</strong> ${data.host_names || 'Not specified'}</p>
            
            <h3 style="color: #667eea; margin-top: 25px; margin-bottom: 15px;">🎨 Design & Features</h3>
            <p><strong>Tone:</strong> ${data.invitation_tone || 'Not specified'}</p>
            <p><strong>Color Scheme:</strong> ${data.color_scheme || 'Not specified'}</p>
            <p><strong>Countdown Timer:</strong> ${data.countdown_timer === 'yes' ? 'Yes' : 'No'}</p>
            <p><strong>Photo Gallery:</strong> ${data.photo_gallery === 'yes' ? 'Yes' : 'No'}</p>
            <p><strong>Social Sharing:</strong> ${data.social_sharing === 'yes' ? 'Yes' : 'No'}</p>
            
            <h3 style="color: #667eea; margin-top: 25px; margin-bottom: 15px;">⚙️ Technical Setup</h3>
            <p><strong>GitHub Username:</strong> ${data.github_username || 'Not specified'}</p>
            <p><strong>Repository:</strong> ${data.repository_name || 'Auto-generated'}</p>
            <p><strong>Notification Email:</strong> ${data.notification_email || 'Not specified'}</p>
            <p><strong>SEO Title:</strong> ${data.seo_title || 'Not specified'}</p>
            
            <h3 style="color: #667eea; margin-top: 25px; margin-bottom: 15px;">📝 Form Features</h3>
            <p><strong>Dietary Restrictions:</strong> ${data.dietary_restrictions === 'yes' ? 'Yes' : 'No'}</p>
            <p><strong>Plus-One Guests:</strong> ${data.plus_one === 'yes' ? 'Yes' : 'No'}</p>
            <p><strong>Phone Required:</strong> ${data.phone_required === 'yes' ? 'Yes' : 'No'}</p>
            <p><strong>Expected Attendees:</strong> ${data.expected_attendees || 'Not specified'}</p>
        </div>
    `;
}

function isValidHex(hex) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

// Export configuration for testing
window.eventConfigUtils = {
    generateSummary,
    validateForm,
    previewSummary,
    saveToLocalStorage,
    loadFromLocalStorage
};
