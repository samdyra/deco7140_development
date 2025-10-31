/**
 * FORM VALIDATION MODULE
 * Reusable form validation functionality using functions
 */

/**
 * Validate a single form field
 * @param {HTMLElement} field - The input field to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateField(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (!errorElement) return true;

    let errorMessage = '';

    if (field.validity.valueMissing) {
        const label = field.labels[0];
        const labelClone = label.cloneNode(true);

        // Remove visually hidden elements and asterisks
        labelClone.querySelectorAll('.visually-hidden, .required').forEach(el => el.remove());

        const fieldLabel = labelClone.textContent.trim();
        errorMessage = `${fieldLabel} is required.`;
    } else if (field.validity.typeMismatch && field.type === 'email') {
        errorMessage = 'Please enter a valid email address.';
    } else if (field.type === 'file') {
        const file = field.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                errorMessage = 'File size must be less than 10MB.';
            }

            if (!file.type.startsWith('image/')) {
                errorMessage = 'Please upload an image file.';
            }
        }
    }

    if (errorMessage) {
        errorElement.textContent = errorMessage;
        field.setAttribute('aria-invalid', 'true');
        return false;
    } else {
        errorElement.textContent = '';
        field.removeAttribute('aria-invalid');
        return true;
    }
}

/**
 * Validate all required fields in a form
 * @param {HTMLFormElement} form - The form element to validate
 * @returns {boolean} - True if all fields are valid, false otherwise
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Clear all error messages in a form
 * @param {HTMLFormElement} form - The form element
 */
function clearErrors(form) {
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');

    const inputs = form.querySelectorAll('.form-input, .form-input-file');
    inputs.forEach(input => input.removeAttribute('aria-invalid'));
}

/**
 * Reset form and clear all errors and previews
 * @param {HTMLFormElement} form - The form element
 */
function resetForm(form) {
    form.reset();
    clearErrors(form);

    // Clear file previews
    const filePreviews = form.querySelectorAll('[id$="-preview"]');
    filePreviews.forEach(preview => preview.textContent = '');
}

/**
 * Handle file input preview
 * @param {Event} e - The change event from file input
 */
function handleFilePreview(e) {
    const input = e.target;
    const previewId = `${input.id}-preview`;
    const preview = document.getElementById(previewId);

    if (preview) {
        const file = input.files[0];
        if (file) {
            preview.textContent = `Selected: ${file.name}`;
        } else {
            preview.textContent = '';
        }
    }

    validateField(input);
}

/**
 * Set feedback message in the form
 * @param {HTMLFormElement} form - The form element
 * @param {string} message - The feedback message
 * @param {string} type - Type of feedback: 'success', 'error', 'loading', 'info'
 */
function setFeedback(form, message, type = 'info') {
    const feedback = form.querySelector('.form-feedback, #form-feedback');
    if (feedback) {
        feedback.textContent = message;
        feedback.className = `form-feedback ${type}`;
    }
}

/**
 * Clear feedback message in the form
 * @param {HTMLFormElement} form - The form element
 */
function clearFeedback(form) {
    const feedback = form.querySelector('.form-feedback, #form-feedback');
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'form-feedback';
    }
}

/**
 * Set submit button loading state
 * @param {HTMLFormElement} form - The form element
 * @param {boolean} isLoading - Whether the form is submitting
 * @param {string} loadingText - Text to show when loading
 * @param {string} defaultText - Text to show when not loading
 */
function setSubmitButtonState(form, isLoading, loadingText = 'Submitting...', defaultText = 'Submit') {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = isLoading;
        submitBtn.textContent = isLoading ? loadingText : defaultText;
    }
}

/**
 * Initialize form validation with real-time validation
 * @param {string} formId - The ID of the form element
 * @returns {object} - Object with validation functions
 */
function initFormValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with id "${formId}" not found`);
        return null;
    }

    // Real-time validation on blur and input
    form.querySelectorAll('.form-input, .form-input-file').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.getAttribute('aria-invalid') === 'true') {
                validateField(field);
            }
        });
    });

    const fileInputs = form.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', handleFilePreview);
    });

    return {
        validate: () => validateForm(form),
        clearErrors: () => clearErrors(form),
        reset: () => resetForm(form),
        setFeedback: (message, type) => setFeedback(form, message, type),
        clearFeedback: () => clearFeedback(form),
        setSubmitButtonState: (isLoading, loadingText, defaultText) =>
            setSubmitButtonState(form, isLoading, loadingText, defaultText)
    };
}

export {
    initFormValidation,
    validateField,
    validateForm,
    clearErrors,
    resetForm,
    setFeedback,
    clearFeedback,
    setSubmitButtonState
};