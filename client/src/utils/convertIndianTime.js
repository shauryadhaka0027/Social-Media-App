function timeAgo(utcTimeStr) {
    const utcDate = new Date(utcTimeStr); // Parse UTC time string
    const now = new Date(); // Get current time in UTC

    // Calculate the difference in milliseconds
    const differenceInMs = now - utcDate;

    // Convert to different time units
    const seconds = Math.floor(differenceInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Determine the "time ago" format
    if (seconds < 60) {
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    } else if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
}

export default timeAgo;
