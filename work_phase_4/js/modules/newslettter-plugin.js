/**
 * IMPORTS
 * Keep track of external modules being used
 */
import { initFormValidation } from './form.js';

/**
 * CONSTANTS
 * Define values that don't change e.g. page titles, URLs, etc.
 */

/**
 * VARIABLES
 * Define values that will change e.g. user inputs, counters, etc.
 */
let newsletterForm;

/**
 * FUNCTIONS
 * Group code into functions to make it reusable
 */

function toggleOtherCommunityField() {
    const communitySelect = document.getElementById('community-interest');
    const otherGroup = document.getElementById('other-community-group');
    const otherInput = document.getElementById('other-community');

    if (communitySelect.value === 'other') {
        otherGroup.hidden = false;
        otherInput.required = true;
        otherInput.setAttribute('aria-required', 'true');

        otherInput.classList.add('form-input');

        setTimeout(() => otherInput.focus(), 100);
    } else {
        otherGroup.hidden = true;
        otherInput.required = false;
        otherInput.setAttribute('aria-required', 'false');
        otherInput.value = '';

        const errorElement = document.getElementById('other-community-error');
        if (errorElement) {
            errorElement.textContent = '';
            otherInput.removeAttribute('aria-invalid');
        }
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();

    newsletterForm.clearFeedback();

    if (!newsletterForm.validate()) {
        newsletterForm.setFeedback('Please correct the errors above before submitting.', 'error');

        const form = document.getElementById('newsletter-form');
        const firstInvalidField = form.querySelector('[aria-invalid="true"]');
        if (firstInvalidField) {
            firstInvalidField.focus();
        }
        return;
    }

    newsletterForm.setSubmitButtonState(true, 'Subscribing...', 'Subscribe to Newsletter');
    newsletterForm.setFeedback('Processing your subscription...', 'loading');

    const form = document.getElementById('newsletter-form');
    const communityInterest = form.querySelector('#community-interest').value;
    const otherCommunity = form.querySelector('#other-community').value.trim();

    const formData = {
        name: form.querySelector('#subscriber-name').value.trim(),
        preferredName: form.querySelector('#preferred-name').value.trim(),
        email: form.querySelector('#subscriber-email').value.trim(),
        communityInterest: communityInterest === 'other' ? otherCommunity : communityInterest
    };

    try {
        await simulateSubscription(formData);

        const displayName = formData.preferredName || formData.name;
        newsletterForm.setFeedback(
            `Thank you for subscribing, ${displayName}! Check your email to confirm your subscription.`,
            'success'
        );

        setTimeout(() => {
            newsletterForm.reset();
            newsletterForm.clearFeedback();
            const otherGroup = document.getElementById('other-community-group');
            if (otherGroup) {
                otherGroup.hidden = true;
                document.getElementById('other-community').required = false;
            }
        }, 5000);

    } catch (error) {
        newsletterForm.setFeedback(
            'Sorry, there was an error processing your subscription. Please try again later.',
            'error'
        );
        console.error('Subscription error:', error);
    } finally {
        newsletterForm.setSubmitButtonState(false, 'Subscribing...', 'Subscribe to Newsletter');
    }
}

function setupCommunityInterestValidation() {
    const form = document.getElementById('newsletter-form');
    const communitySelect = form.querySelector('#community-interest');

    communitySelect.addEventListener('change', function () {
        const errorElement = document.getElementById('community-interest-error');
        if (this.value === '') {
            errorElement.textContent = 'Please select a community interest.';
            this.setAttribute('aria-invalid', 'true');
        } else {
            errorElement.textContent = '';
            this.removeAttribute('aria-invalid');
        }

        toggleOtherCommunityField();
    });
}

function simulateSubscription(data) {
    return new Promise((resolve, _reject) => {
        setTimeout(() => {
            console.log('Newsletter subscription data:', data);
            resolve({ success: true });
        }, 1500);
    });
}

/**
 * EVENT LISTENERS
 * The code that runs when a user interacts with the page
 */
document.addEventListener('DOMContentLoaded', () => {
    newsletterForm = initFormValidation('newsletter-form');

    if (!newsletterForm) {
        console.error('Failed to initialize newsletter form validation');
        return;
    }

    setupCommunityInterestValidation();

    const form = document.getElementById('newsletter-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});