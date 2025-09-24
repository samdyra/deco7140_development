import { postFormData } from './modules/postFormData.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('community-form');
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

async function getCommunity() {
    const response = await fetch('https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/', {
        method: 'GET',
        headers: {
            'student_number': 's4980498',
            'uqcloud_zone_id': 'c30ed0d4',
        },
    });

    const data = await response.json();

    return { success: response.ok, data };
}

document.addEventListener('DOMContentLoaded', async () => {
    const { success, data } = await getCommunity();
    if (success) {
        console.log('Community members:', data);
    } else {
        console.error('Failed to fetch community members:', data);
    }
});
