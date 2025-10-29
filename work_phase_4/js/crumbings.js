/**
 * IMPORTS
 * Keep track of external modules being used
 */
import { initFormValidation } from './modules/form.js';
import { initModal } from './modules/modal.js';
import { postFormData } from './modules/postFormData.js';
import { fetchGetData } from './modules/getData.js';
import { initLeaderboard } from './modules/get-leaderboard.js';

/**
 * CONSTANTS
 * Define values that don't change e.g. page titles, URLs, etc.
 */
const API_URL = 'https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/communitymembersimple/';
const API_HEADERS = {
    'student_number': 's4980498',
    'uqcloud_zone_id': 'c30ed0d4',
};

/**
 * VARIABLES
 * Define values that will change e.g. user inputs, counters, etc.
 */
let crumbingsModal;
let crumbingsForm;
let loadLeaderboard;

/**
 * FUNCTIONS
 * Group code into functions to make it reusable
 */
function getRandomAttempts() {
    return Math.floor(Math.random() * 300) + 700;
}

async function handleFormSubmit(e) {
    e.preventDefault();

    crumbingsForm.clearFeedback();

    if (!crumbingsForm.validate()) {
        crumbingsForm.setFeedback('Please correct the errors above before submitting.', 'error');

        const form = document.getElementById('crumbings-form');
        const firstInvalidField = form.querySelector('[aria-invalid="true"]');
        if (firstInvalidField) {
            firstInvalidField.focus();
        }
        return;
    }

    crumbingsForm.setSubmitButtonState(true, 'Creating...', 'Create Recipe');
    crumbingsForm.setFeedback('Creating your recipe...', 'loading');

    try {
        const form = document.getElementById('crumbings-form');
        const recipeName = form.querySelector('#recipe-name').value.trim();
        const creatorName = form.querySelector('#recipe-creator').value.trim();
        const description = form.querySelector('#recipe-description').value.trim();
        const photoFile = form.querySelector('#photo').files[0];

        const randomAttempts = getRandomAttempts();
        const combinedName = `${recipeName} - ${creatorName}`;

        // Create a temporary form with API field mappings
        const tempForm = document.createElement('form');
        const nameInput = document.createElement('input');
        nameInput.name = 'name';
        nameInput.value = combinedName;
        tempForm.appendChild(nameInput);

        const emailInput = document.createElement('input');
        emailInput.name = 'email';
        emailInput.value = `${randomAttempts.toString()}@example.com`;
        tempForm.appendChild(emailInput);

        const messageInput = document.createElement('input');
        messageInput.name = 'message';
        messageInput.value = description;
        tempForm.appendChild(messageInput);

        if (photoFile) {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.name = 'photo';
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(photoFile);
            fileInput.files = dataTransfer.files;
            tempForm.appendChild(fileInput);
        }

        const { success, data } = await postFormData(tempForm, API_URL, API_HEADERS);

        if (success) {
            crumbingsForm.setFeedback(
                'Recipe created successfully! Your crumbing is now live.',
                'success'
            );

            setTimeout(() => {
                crumbingsForm.reset();
                crumbingsForm.clearFeedback();
                crumbingsModal.close();

                const fileLabel = document.querySelector('.file-input-label .file-input-text');
                const filePreview = document.getElementById('photo-preview');
                if (fileLabel) fileLabel.textContent = 'Choose a file';
                if (filePreview) filePreview.textContent = '';

                loadLeaderboard();
            }, 2000);
        } else {
            crumbingsForm.setFeedback(
                data.message || 'Failed to create recipe. Please try again.',
                'error'
            );
        }
    } catch (error) {
        crumbingsForm.setFeedback(
            'Network error. Please check your connection and try again.',
            'error'
        );
        console.error('Recipe creation error:', error);
    } finally {
        crumbingsForm.setSubmitButtonState(false, 'Creating...', 'Create Recipe');
    }
}

/**
 * EVENT LISTENERS
 * The code that runs when a user interacts with the page
 */
document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard = initLeaderboard(API_URL, API_HEADERS, fetchGetData);
    loadLeaderboard();

    crumbingsModal = initModal('create-crumbings-modal');
    crumbingsForm = initFormValidation('crumbings-form');

    if (!crumbingsModal) {
        console.error('Failed to initialize crumbings modal');
        return;
    }

    if (!crumbingsForm) {
        console.error('Failed to initialize crumbings form validation');
        return;
    }

    const createBtn = document.querySelector('.create-section .button-primary');
    if (createBtn) {
        createBtn.addEventListener('click', (e) => {
            e.preventDefault();
            crumbingsModal.open();
        });
    }

    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            crumbingsForm.reset();
            crumbingsForm.clearFeedback();
            crumbingsModal.close();

            const fileLabel = document.querySelector('.file-input-label .file-input-text');
            const filePreview = document.getElementById('photo-preview');
            if (fileLabel) fileLabel.textContent = 'Choose a file';
            if (filePreview) filePreview.textContent = '';
        });
    }

    const form = document.getElementById('crumbings-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});