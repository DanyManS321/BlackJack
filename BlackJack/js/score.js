// --- Score Page (table) ---
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is on the Score page and if the table has not already been created
    const wrapper = document.querySelector('.wrapper');
    if (window.location.pathname.endsWith('score.html') && wrapper) {
        // Clear any existing content to prevent duplicates on refresh
        wrapper.innerHTML = '';
        createScoresTable();
    }
});

// Create table of scores
function createScoresTable() {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const table = document.createElement('table');
    table.id = 'scores-table';
    
    // Create the table header
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    const headers = ['Username', 'Wins', 'Losses', 'Win Rate'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    // Create the table body
    const tbody = table.createTBody();
    
    // Traverse the users array and create a table row for each user
    users.forEach(user => {
        const wins = user.wins || 0;
        const losses = user.losses || 0;
        const winRate = calculateWinRate(wins, losses);

        const row = tbody.insertRow();
        row.insertCell().textContent = user.username;
        row.insertCell().textContent = wins;
        row.insertCell().textContent = losses;
        row.insertCell().textContent = `${winRate}%`;
    });

    // Append the created table to the wrapper div
    const wrapper = document.querySelector('.wrapper');
    if (wrapper) {
        wrapper.appendChild(table);
    } else {
        console.error('Wrapper div not found');
    }
}

// Calculate win rate 
function calculateWinRate(wins, losses) {
    const totalGames = wins + losses;
    if (totalGames === 0) {
        return 0; // No games played
    }
    const winRate = (wins / totalGames) * 100; // Win percentage
    return Math.trunc(winRate); // Truncate win rate
}
