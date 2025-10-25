/**
* TIMELINE MODULE
* Functions to display loading, error, and empty states
*/

/**
 * Show loading state in timeline
 * @param {HTMLElement} container - The timeline container
 */
function showTimelineLoading(container) {
    container.innerHTML = `
        <div class="timeline-state timeline-loading">
            <div class="loading-spinner" role="status" aria-label="Loading posts"></div>
            <p class="loading-text">Loading crumbs...</p>
        </div>
    `;
}

/**
 * Show error state in timeline
 * @param {HTMLElement} container - The timeline container
 * @param {Function} retryCallback - Function to call when retry button is clicked
 */
function showTimelineError(container, retryCallback) {
    container.innerHTML = `
        <div class="timeline-state timeline-error">
            <div class="error-icon" aria-hidden="true">⚠️</div>
            <h3 class="error-title">Unable to Load Posts</h3>
            <p class="error-message">
                We couldn't load the timeline posts. This might be due to a network issue or server problem.
            </p>
            <button class="retry-button" id="retry-timeline">
                Try Again
            </button>
        </div>
    `;

    const retryBtn = container.querySelector('#retry-timeline');
    if (retryBtn && retryCallback) {
        retryBtn.addEventListener('click', retryCallback);
    }
}

/**
 * Show empty state in timeline
 * @param {HTMLElement} container - The timeline container
 */
function showTimelineEmpty(container) {
    container.innerHTML = `
        <div class="timeline-state timeline-empty">
            <div class="empty-icon" aria-hidden="true">🍽️</div>
            <h3 class="empty-title">No Crumbs Yet</h3>
            <p class="empty-message">
                Be the first to share your culinary creation!
            </p>
        </div>
    `;
}

/**
 * Create a post element
 * @param {Object} member - The post data
 * @param {Function} getTimeAgo - Function to format time
 * @returns {HTMLElement} - The post article element
 */
function createPostElement(member, getTimeAgo) {
    const post = document.createElement('article');
    post.className = 'post';

    const avatar = document.createElement('img');
    avatar.className = 'post-avatar';
    avatar.src = member.photo;
    avatar.alt = `${member.name}'s avatar`;
    avatar.onerror = function () {
        this.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = 'post-avatar';
        fallback.textContent = '👨‍🍳';
        this.parentNode.insertBefore(fallback, this);
    };

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

    return post;
}

/**
 * Initialize and load timeline
 * @param {string} apiUrl - API endpoint URL
 * @param {Object} apiHeaders - API headers
 * @param {Function} fetchGetData - Function to fetch data
 * @param {Function} getTimeAgo - Function to format time
 * @returns {Function} - Function to reload timeline
 */
function initTimeline(apiUrl, apiHeaders, fetchGetData, getTimeAgo) {
    const container = document.querySelector('.timeline');

    function loadTimeline() {
        showTimelineLoading(container);

        fetchGetData(apiUrl, apiHeaders)
            .then(data => {
                if (!data) {
                    showTimelineError(container, loadTimeline);
                    return;
                }

                if (data.length === 0) {
                    showTimelineEmpty(container);
                    return;
                }

                container.innerHTML = '';

                data.forEach(member => {
                    const post = createPostElement(member, getTimeAgo);
                    container.appendChild(post);
                });
            })
            .catch(error => {
                console.error('Error loading timeline:', error);
                showTimelineError(container, loadTimeline);
            });
    }

    return loadTimeline;
}

export {
    initTimeline,
    showTimelineLoading,
    showTimelineError,
    showTimelineEmpty,
    createPostElement
};