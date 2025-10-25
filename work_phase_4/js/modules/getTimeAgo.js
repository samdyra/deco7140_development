function getTimeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) {
        return `${diffSeconds}s`;
    } else if (diffMinutes < 60) {
        return `${diffMinutes}m`;
    } else if (diffHours < 24) {
        return `${diffHours}h`;
    } else if (diffDays < 7) {
        return `${diffDays}d`;
    } else if (diffWeeks < 4) {
        return `${diffWeeks}w`;
    } else if (diffMonths < 12) {
        return `${diffMonths}mo`;
    } else {
        return `${diffYears}y`;
    }
}


export { getTimeAgo };