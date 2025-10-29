// --- Game Page ---
let dealerSum = 0;
let playerSum = 0;

let dealerAceCount = 0;
let playerAceCount = 0; 

let hidden;
let deck;

let canHit = true; // Allows player to draw while playerSum <= 21

let currentUser = null; // Declare currentUser globally and set to null by default
let users = [];

window.onload = function() {
    loadGameData(); // Load user data first
    buildDeck(); // Build deck
    shuffleDeck(); // Shuffle deck
    startGame(); // Game starts
}

// Build deck using nested for loop
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
}

// Suffle deck by getting a random card and swapping its place in the array of cards
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

// Reload the game if user presses 'play again' button
function playAgain() {
    const playAgainBtn = document.getElementById("play-again-btn");
    playAgainBtn.style.display = "inline-block";
    playAgainBtn.onclick = function() {
    location.reload();
}
}

// Start game 
function startGame() {
    hidden = deck.pop(); // Draw one card for dealer
    dealerSum += getValue(hidden); // Add the card value to dealer's sum value
    dealerAceCount += checkAce(hidden); // If the card is an Ace, increment dealer's number of Aces
    while (dealerSum < 17) { // Keep drawing cards for dealer while its sum is < 17, and stop when sum become => 17
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "/img/cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerSum); // Show dealer sum of points

    for (let i = 0; i < 2; i++) { // Draw first two cards for player
        let cardImg = document.createElement("img"); 
        let card = deck.pop(); // Draw card from the deck
        cardImg.src = "/img/cards/" + card + ".png";
        playerSum += getValue(card); // Player's sum of points
        playerAceCount += checkAce(card); // Check for Ace and increasing count of Aces if true
        document.getElementById("player-cards").append(cardImg);
    }

    console.log(playerSum); // Show player's sum of points
    document.getElementById("hit").addEventListener("click", hit); // If player press 'Hit' button
    document.getElementById("stay").addEventListener("click", stay); // If player press 'Stay' button
}

// Check whether the player is allowed to draw card (not allowed if player's sum > 21)
function hit() {
    if (!canHit) { // Return if player's sum > 21
        return;
    }
    // Draw one card for player
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "/img/cards/" + card + ".png";
    playerSum += getValue(card);
    playerAceCount += checkAce(card);
    document.getElementById("player-cards").append(cardImg);

    if (reduceAce(playerSum, playerAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
    }
}

// Load user data from storage
function loadGameData() {
    users = JSON.parse(localStorage.getItem('users')) || []; // Get array of users from storage and copy to 'users'
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) { // Find current logged in user in storage
        const loggedInUser = JSON.parse(currentUserString);
        const userIndex = users.findIndex(user => user.username === loggedInUser.username);
        if (userIndex !== -1) {
            currentUser = users[userIndex];
            currentUser.wins = currentUser.wins || 0; // Get current user's wins data from storage
            currentUser.losses = currentUser.losses || 0; // Get current user's losses data from storage
        }
    }
    // currentUser remains null, allowing guest play.
}

// Player chooses to 'Stay' on current hand, and do not draw more cards
function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount); // If dealer has Ace, decrease Ace point from 11 to 1 until dealerSum > 21 
    playerSum = reduceAce(playerSum, playerAceCount); // If player has Ace, decrease Ace point from 11 to 1 until playerSum > 21 

    canHit = false; // Player not allowed to draw any more cards
    document.getElementById("hidden").src = "/img/cards/" + hidden + ".png";

    let message = "";
    let win = false;
    let loss = false;

    // Handle win/lose conditions
    if (playerSum > 21) { // Lose, if player sum > 21
        message = "You Lose!";
        loss = true;
    }
    else if (dealerSum > 21) { // Win, if playerSum < 21 && dealerSum > 21
        message = "You win!";
        win = true;
    }
    else if (playerSum == dealerSum) { // 'Tie!' is also counted as Lose
        message = "Tie!";
        loss = true;
    }
    else if (playerSum > dealerSum) { // Win, if playerSum > dealerSum && both their sums < 21
        message = "You Win!";
        win = true;
    }
    else if (playerSum < dealerSum) { // Lose, if playerSum < dealerSum && both their sums < 21
        message = "You Lose!";
        loss = true;
    }

    // Check if a user is logged in before saving score
    if (currentUser) {
        const userIndex = users.findIndex(user => user.username === currentUser.username);
        if (userIndex !== -1) {
            if (win) { // Increase number of wins by one
                users[userIndex].wins = (users[userIndex].wins || 0) + 1;
            } else if (loss) { // Increase number of losses by one
                users[userIndex].losses = (users[userIndex].losses || 0) + 1;
            }
            // Save data in local storage
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
    }
    // Get dealerSum and playerSum values and the result message (win/tie/lose)
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("player-sum").innerText = playerSum;
    document.getElementById("results").innerText = message;
    
    if (message === "You Win!") {
        document.getElementById("results").style.color = "green";
    } else if (message === "You Lose!") {
        document.getElementById("results").style.color = "red";
    } else if (message === "Tie!") { // Tie is now red (formerly was orange)
        document.getElementById("results").style.color = "red";
    }

    // Continue playing another hand
    playAgain();
}

// Calculate value of card
function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { // If card is not a number (means it is either A J Q K)
        if (value == "A") { // Return 11 points for Ace
            return 11;
        }
        return 10; // Return 10 points for J Q K
    }
    return parseInt(value); // Convert to integer
}

// Check if card is an Ace
function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

// Check if player has Ace && playerSum > 21, 
// then decrease playerAceCount by 1 and playerSum by 10 (Ace point will be 1 instead of 11 in player's advantage)
function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}


