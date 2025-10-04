/**
 * Gallery Sidebar Module
 * Handles opening and closing of the image gallery sidebar
 */

/**
 * Opens the sidebar with the clicked image and its annotation
 * @param {HTMLImageElement} imgElement - The image element that was clicked
 */
export function openSidebar(imgElement) {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const sidebarImage = document.getElementById('sidebarImage');
    const sidebarAnnotation = document.getElementById('sidebarAnnotation');

    if (!sidebar || !overlay || !sidebarImage || !sidebarAnnotation) {
        console.error('Sidebar elements not found');
        return;
    }

    sidebarImage.src = imgElement.src;
    sidebarImage.alt = imgElement.alt;
    sidebarAnnotation.textContent = imgElement.alt;

    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Closes the sidebar and removes overlay
 */
export function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (!sidebar || !overlay) {
        console.error('Sidebar elements not found');
        return;
    }

    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}