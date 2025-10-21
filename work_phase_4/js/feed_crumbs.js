/**
* IMPORTS
* Keep track of external modules being used
* */
import { fetchGetData } from './modules/getData.js';

/**
* CONSTANTS
* Define values that don't change e.g. page titles, URLs, etc.
* */

/**
* VARIABLES
* Define values that will change e.g. user inputs, counters, etc.
* */

/**
* FUNCTIONS
* Group code into functions to make it reusable
* */

/**
* EVENT LISTENERS
* The code that runs when a user interacts with the page
* */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('timelineContainer');

    fetchGetData('https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/', {
        'student_number': 's4980498',
        'uqcloud_zone_id': 'c30ed0d4',
    }).then(data => {
        if (!data) {
            container.innerHTML = '<p class="text-danger">Unable to timeline posts.</p>';
            return;
        }

        data.forEach(member => {
            const card = document.createElement('div');
            card.className = '';
            card.innerHTML = ``;
            container.appendChild(card);
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feed-form');
    const feedback = document.getElementById('form-feedback');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        feedback.textContent = 'Submitting...';
        const { success, data } = await postFormData(form, 'https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/', {
            'student_number': 's4980498',
            'uqcloud_zone_id': 'c30ed0d4',
        });

        if (success) {
            feedback.textContent = data.message;
            form.reset();
        } else {
            feedback.textContent = data.message || 'Something went wrong.';
        }
    });
});
