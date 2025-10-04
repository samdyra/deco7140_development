/**
* IMPORTS
* Keep track of external modules being used
* */

import { closeSidebar, openSidebar } from "./modules/gallery_sidebar.js";

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