/**
 * IMPORTS
 * Keep track of external modules being used
 */
import { initFormValidation } from './form.js';
import { postFormData } from './postFormData.js';

/**
 * CONSTANTS
 * Define values that don't change e.g. page titles, URLs, etc.
 */
const API_URL = 'https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericuserprofile/';
const API_HEADERS = {
    'student_number': 's4980498',
    'uqcloud_zone_id': 'c30ed0d4',
};

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

    try {
        const form = document.getElementById('newsletter-form');

        const fullName = form.querySelector('#subscriber-name').value.trim();
        const email = form.querySelector('#subscriber-email').value.trim();
        const preferredName = form.querySelector('#preferred-name').value.trim();
        const communityInterest = form.querySelector('#community-interest').value;
        const otherCommunity = form.querySelector('#other-community').value.trim();

        // Create a temporary form with API field mappings
        const tempForm = document.createElement('form');

        const userNameInput = document.createElement('input');
        userNameInput.name = 'user_name';
        userNameInput.value = fullName;
        tempForm.appendChild(userNameInput);

        const emailInput = document.createElement('input');
        emailInput.name = 'email';
        emailInput.value = email;
        tempForm.appendChild(emailInput);

        const customField1Input = document.createElement('input');
        customField1Input.name = 'custom_field_1';
        customField1Input.value = preferredName;
        tempForm.appendChild(customField1Input);

        const customField2Input = document.createElement('input');
        customField2Input.name = 'custom_field_2';
        customField2Input.value = communityInterest === 'other' ? otherCommunity : communityInterest;
        tempForm.appendChild(customField2Input);

        const { success, data } = await postFormData(tempForm, API_URL, API_HEADERS);


        if (success) {
            const displayName = preferredName || fullName;

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

        } else {
            newsletterForm.setFeedback(
                data.message || 'Sorry, there was an error processing your subscription. Please try again later.',
                'error'
            );
        }
    } catch (error) {
        newsletterForm.setFeedback(
            'Network error. Please check your connection and try again.',
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