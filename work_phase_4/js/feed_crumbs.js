/**
* IMPORTS
* Keep track of external modules being used
* */
import { fetchGetData } from './modules/getData.js';
import { postFormData } from './modules/postFormData.js';
import { getTimeAgo } from './modules/getTimeAgo.js';
import { initModal } from './modules/modal.js';
import { initFormValidation } from './modules/form.js';
import { initTimeline } from './modules/get-timeline.js';

/**
* CONSTANTS
* Define values that don't change e.g. page titles, URLs, etc.
* */
const API_URL = 'https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/';
const API_HEADERS = {
    'student_number': 's4980498',
    'uqcloud_zone_id': 'c30ed0d4',
};

/**
* VARIABLES
* Define values that will change e.g. user inputs, counters, etc.
* */
let crumbModal;
let crumbForm;
let loadTimeline;

/**
* FUNCTIONS
* Group code into functions to make it reusable
* */
async function handleFormSubmit(e) {
    e.preventDefault();

    if (!crumbForm.validate()) {
        crumbForm.setFeedback('Please fix the errors above.', 'error');
        return;
    }

    crumbForm.setFeedback('Submitting your crumb...', 'loading');
    crumbForm.setSubmitButtonState(true, 'Posting...', 'Post Crumb');

    try {
        const form = document.getElementById('feed-form');
        const { success, data } = await postFormData(form, API_URL, API_HEADERS);

        if (success) {
            crumbForm.setFeedback('Crumb posted successfully!', 'success');

            setTimeout(() => {
                crumbForm.reset();
                crumbForm.clearFeedback();
                crumbModal.close();
                loadTimeline();
            }, 1500);
        } else {
            crumbForm.setFeedback(
                data.message || 'Failed to post crumb. Please try again.',
                'error'
            );
        }
    } catch (error) {
        crumbForm.setFeedback(
            'Network error. Please check your connection and try again.',
            'error'
        );
    } finally {
        crumbForm.setSubmitButtonState(false, 'Posting...', 'Post Crumb');
    }
}

/**
* EVENT LISTENERS
* The code that runs when a user interacts with the page
* */
document.addEventListener('DOMContentLoaded', () => {
    loadTimeline = initTimeline(API_URL, API_HEADERS, fetchGetData, getTimeAgo);
    loadTimeline();

    crumbModal = initModal('create-crumbs-modal');
    crumbForm = initFormValidation('feed-form');

    const openModalBtn = document.querySelector('.button-secondary');
    if (openModalBtn) {
        openModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            crumbModal.open();
        });
    }

    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            crumbForm.reset();
            crumbForm.clearFeedback();
            crumbModal.close();
        });
    }

    const form = document.getElementById('feed-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});