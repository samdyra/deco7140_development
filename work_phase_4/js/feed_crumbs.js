/**
* IMPORTS
* Keep track of external modules being used
* */
import { fetchGetData } from './modules/getData.js';
import { postFormData } from './modules/postFormData.js';
import { getTimeAgo } from './modules/getTimeAgo.js';

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
    const container = document.querySelector('.timeline');

    fetchGetData('https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/', {
        'student_number': 's4980498',
        'uqcloud_zone_id': 'c30ed0d4',
    }).then(data => {
        if (!data) {
            container.innerHTML = '<p class="text-danger">Unable to timeline posts.</p>';
            return;
        }

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
