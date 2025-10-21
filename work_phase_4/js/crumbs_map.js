/**
* IMPORTS
* Keep track of external modules being used
* */

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
    const container = document.getElementById('mapContainer');

    /* Scroll to center the map image
    scrollWidth/ScrollHeight = total width/height of the image
    lientWidth/clientHeight = width/height of the visible area
    scrollHeight - clientHeight = total scrollable height, similarly for width
    Dividing by 2 centers the scroll position    
     */
    container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
    container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;


    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        sidebarToggle.classList.toggle('active');
    });
});