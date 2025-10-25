/**
 * MODAL MODULE
 * Reusable modal functionality using functions
 */

/**
 * Initialize a modal with all event listeners
 * @param {string} modalId - The ID of the modal element
 * @returns {object} - Object with open and close functions
 */
function initModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Modal with id "${modalId}" not found`);
        return null;
    }

    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');
    const content = modal.querySelector('.modal-content');

    function open() {
        modal.hidden = false;
        document.body.style.overflow = 'hidden';

        if (closeBtn) {
            closeBtn.focus();
        }
    }

    function close() {
        modal.hidden = true;
        document.body.style.overflow = '';
    }

    function isOpen() {
        return !modal.hidden;
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', close);
    }

    if (overlay) {
        overlay.addEventListener('click', close);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) {
            close();
        }
    });

    if (content) {
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    return { open, close, isOpen };
}

export { initModal };