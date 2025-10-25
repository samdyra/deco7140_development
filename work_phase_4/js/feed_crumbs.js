/**
* IMPORTS
* Keep track of external modules being used
* */
import { fetchGetData } from './modules/getData.js';
import { postFormData } from './modules/postFormData.js';
import { getTimeAgo } from './modules/getTimeAgo.js';
import { initModal } from './modules/modal.js';
import { initFormValidation } from './modules/form.js';

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

/**
* FUNCTIONS
* Group code into functions to make it reusable
* */
function loadTimeline() {
    const container = document.querySelector('.timeline');

    fetchGetData(API_URL, API_HEADERS).then(data => {
        if (!data) {
            container.innerHTML = '<p class="text-danger">Unable to load timeline posts.</p>';
            return;
        }

        container.innerHTML = '';

        data.forEach(member => {
            const post = document.createElement('article');
            post.className = 'post';

            const avatar = document.createElement('img');
            avatar.className = 'post-avatar';
            avatar.src = member.photo;
            avatar.alt = `${member.name}'s avatar`;

            const content = document.createElement('div');
            content.className = 'post-content';

            const header = document.createElement('div');
            header.className = 'post-header';

            const name = document.createElement('p');
            name.className = 'post-name';
            name.textContent = member.name;

            const username = document.createElement('p');
            username.className = 'post-username';
            username.textContent = `@${member.email.split('@')[0]}`;

            const time = document.createElement('p');
            time.className = 'post-time';
            time.textContent = `· ${getTimeAgo(member.created_at)}`;

            header.appendChild(name);
            header.appendChild(username);
            header.appendChild(time);

            const message = document.createElement('p');
            message.textContent = member.message;

            content.appendChild(header);
            content.appendChild(message);

            post.appendChild(avatar);
            post.appendChild(content);

            container.appendChild(post);
        });
    });
}

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