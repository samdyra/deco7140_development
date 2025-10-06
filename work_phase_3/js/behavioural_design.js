import { postFormData } from './modules/postFormData.js';
import { closeSidebar, openSidebar } from "./modules/gallery_sidebar.js";


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

document.addEventListener("DOMContentLoaded", () => {
    const galleryItems = document.querySelectorAll('.gallery-item img');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            openSidebar(item);
        });
    });

    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    sidebarOverlay.addEventListener('click', closeSidebar);

    // Add close button listener
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', closeSidebar);
});