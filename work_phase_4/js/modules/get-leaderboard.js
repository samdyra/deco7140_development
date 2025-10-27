/**
* LEADERBOARD MODULE
* Functions to display loading, error, and empty states for leaderboards
*/

/**
 * Show loading state in leaderboard
 * @param {HTMLElement} container - The leaderboard container
 */
function showLeaderboardLoading(container) {
    const leaderboardCard = container.querySelector('.leaderboard-card:first-child');
    if (!leaderboardCard) return;

    leaderboardCard.innerHTML = `
        <header class="leaderboard-header">
            <div class="leaderboard-icon" aria-hidden="true">🍽️</div>
            <h3 class="leaderboard-title">Top Crumbings</h3>
            <p>Most attempted recipes this month</p>
        </header>
        <div class="leaderboard-state leaderboard-loading">
            <div class="loading-spinner" role="status" aria-label="Loading leaderboard"></div>
            <p class="loading-text">Loading top recipes...</p>
        </div>
    `;
}

/**
 * Show error state in leaderboard
 * @param {HTMLElement} container - The leaderboard container
 * @param {Function} retryCallback - Function to call when retry button is clicked
 */
function showLeaderboardError(container, retryCallback) {
    const leaderboardCard = container.querySelector('.leaderboard-card:first-child');
    if (!leaderboardCard) return;

    leaderboardCard.innerHTML = `
        <header class="leaderboard-header">
            <div class="leaderboard-icon" aria-hidden="true">🍽️</div>
            <h3 class="leaderboard-title">Top Crumbings</h3>
            <p>Most attempted recipes this month</p>
        </header>
        <div class="leaderboard-state leaderboard-error">
            <div class="error-icon" aria-hidden="true">⚠️</div>
            <h4 class="error-title">Unable to Load Leaderboard</h4>
            <p class="error-message">
                We couldn't load the top recipes. Please try again.
            </p>
            <button class="button button-primary" id="retry-leaderboard">
                Try Again
            </button>
        </div>
    `;

    const retryBtn = leaderboardCard.querySelector('#retry-leaderboard');
    if (retryBtn && retryCallback) {
        retryBtn.addEventListener('click', retryCallback);
    }
}

/**
 * Show empty state in leaderboard
 * @param {HTMLElement} container - The leaderboard container
 */
function showLeaderboardEmpty(container) {
    const leaderboardCard = container.querySelector('.leaderboard-card:first-child');
    if (!leaderboardCard) return;

    leaderboardCard.innerHTML = `
        <header class="leaderboard-header">
            <div class="leaderboard-icon" aria-hidden="true">🍽️</div>
            <h3 class="leaderboard-title">Top Crumbings</h3>
            <p>Most attempted recipes this month</p>
        </header>
        <div class="leaderboard-state leaderboard-empty">
            <div class="empty-icon" aria-hidden="true">📊</div>
            <h4 class="empty-title">No Recipes Yet</h4>
            <p class="empty-message">
                Be the first to submit a recipe!
            </p>
        </div>
    `;
}

/**
 * Parse name field to extract recipe name and creator
 * @param {string} nameField - The name field (e.g., "Nasi Goreng - Sam")
 * @returns {Object} - Object with recipeName and creatorName
 */
function parseNameField(nameField) {
    const parts = nameField.split(' - ');
    if (parts.length >= 2) {
        return {
            recipeName: parts[0].trim(),
            creatorName: parts.slice(1).join(' - ').trim()
        };
    }
    return {
        recipeName: nameField,
        creatorName: '-'
    };
}

/**
 * Extract attempts number from email field
 * @param {string} email - The email field (e.g., "234@gmail.com")
 * @returns {number} - The attempts number
 */
function extractAttempts(email) {
    if (!email) return 0;
    const match = email.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
}

/**
 * Filter out test data entries
 * @param {Array} data - Array of recipe data
 * @returns {Array} - Filtered array without test data
 */
function filterTestData(data) {
    return data.filter(recipe => {
        const nameLower = recipe.name.toLowerCase();
        return !nameLower.includes('sam') && !nameLower.includes('admin');
    });
}

/**
 * Show recipe detail modal
 * @param {Object} recipe - The recipe data
 */
function showRecipeDetail(recipe) {
    const { recipeName, creatorName } = parseNameField(recipe.name);
    const attempts = extractAttempts(recipe.email);

    const existingModal = document.getElementById('recipe-detail-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'recipe-detail-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content recipe-detail-content">
            <div class="modal-header">
                <h2>Recipe Details</h2>
                <button class="modal-close" aria-label="Close modal">×</button>
            </div>
            
            <div class="recipe-detail-body">
                <div class="recipe-detail-image">
                    <img src="${recipe.photo}" alt="${recipeName}" />
                </div>
                
                <div class="recipe-detail-info">
                    <h3 class="recipe-detail-title">${recipeName}</h3>
                    <p class="recipe-detail-creator">by ${creatorName}</p>
                    
                    <div class="recipe-detail-stats">
                        <div class="recipe-stat">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span><strong>${attempts}</strong> attempts</span>
                        </div>
                    </div>
                    
                    <div class="recipe-detail-description">
                        <h4>Recipe Story</h4>
                        <p>${recipe.message || 'No description available.'}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    const closeModal = () => {
        modal.remove();
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    });

    document.body.style.overflow = 'hidden';
}

/**
 * Create a ranking item element
 * @param {Object} recipe - The recipe data
 * @param {number} position - The position in the ranking (1, 2, 3, etc.)
 * @returns {HTMLElement} - The ranking list item element
 */
function createRankingItem(recipe, position) {
    const li = document.createElement('li');
    li.className = position <= 3 ? `ranking-item ranking-item-${position}` : 'ranking-item';
    li.style.cursor = 'pointer';
    li.setAttribute('tabindex', '0');
    li.setAttribute('role', 'button');
    li.setAttribute('aria-label', `View details for ${parseNameField(recipe.name).recipeName}`);

    const positionSpan = document.createElement('span');
    positionSpan.className = 'ranking-position';
    positionSpan.setAttribute('aria-label', `Position ${position}`);
    positionSpan.textContent = position;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'ranking-info';

    const { recipeName, creatorName } = parseNameField(recipe.name);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'ranking-name';
    nameSpan.textContent = recipeName;

    const creatorSpan = document.createElement('span');
    creatorSpan.className = 'ranking-creator';
    creatorSpan.textContent = `${creatorName}`;

    infoDiv.appendChild(nameSpan);
    infoDiv.appendChild(creatorSpan);

    const statsDiv = document.createElement('div');
    statsDiv.className = 'ranking-stats';

    const attempts = extractAttempts(recipe.email);

    const numberSpan = document.createElement('span');
    numberSpan.className = 'ranking-number';
    numberSpan.textContent = attempts;

    const labelSpan = document.createElement('span');
    labelSpan.className = 'ranking-label';
    labelSpan.textContent = 'attempts';

    statsDiv.appendChild(numberSpan);
    statsDiv.appendChild(labelSpan);

    li.appendChild(positionSpan);
    li.appendChild(infoDiv);
    li.appendChild(statsDiv);

    li.addEventListener('click', () => {
        showRecipeDetail(recipe);
    });

    li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showRecipeDetail(recipe);
        }
    });

    return li;
}

/**
 * Initialize and load leaderboard
 * @param {string} apiUrl - API endpoint URL
 * @param {Object} apiHeaders - API headers
 * @param {Function} fetchGetData - Function to fetch data
 * @returns {Function} - Function to reload leaderboard
 */
function initLeaderboard(apiUrl, apiHeaders, fetchGetData) {
    const container = document.querySelector('.leaderboards-grid');

    function loadLeaderboard() {
        showLeaderboardLoading(container);

        fetchGetData(apiUrl, apiHeaders)
            .then(data => {
                if (!data) {
                    showLeaderboardError(container, loadLeaderboard);
                    return;
                }

                const filteredData = filterTestData(data);

                if (filteredData.length === 0) {
                    showLeaderboardEmpty(container);
                    return;
                }

                const sortedData = [...filteredData].sort((a, b) => {
                    const attemptsA = extractAttempts(a.email);
                    const attemptsB = extractAttempts(b.email);
                    return attemptsB - attemptsA;
                });

                const top10Data = sortedData.slice(0, 10);

                const leaderboardCard = container.querySelector('.leaderboard-card:first-child');
                if (!leaderboardCard) return;

                leaderboardCard.innerHTML = `
                    <header class="leaderboard-header">
                        <div class="leaderboard-icon" aria-hidden="true">🍽️</div>
                        <h3 class="leaderboard-title">Top Crumbings</h3>
                        <p>Most attempted recipes this month</p>
                    </header>
                    <ol id="leaderboard-list"></ol>
                `;

                const list = leaderboardCard.querySelector('#leaderboard-list');

                top10Data.forEach((recipe, index) => {
                    const rankingItem = createRankingItem(recipe, index + 1);
                    list.appendChild(rankingItem);
                });
            })
            .catch(error => {
                console.error('Error loading leaderboard:', error);
                showLeaderboardError(container, loadLeaderboard);
            });
    }

    return loadLeaderboard;
}

export {
    initLeaderboard,
    showLeaderboardLoading,
    showLeaderboardError,
    showLeaderboardEmpty,
    createRankingItem
};