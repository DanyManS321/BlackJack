// --- Login Page (form validation) ---
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const loginUsernameInput = document.getElementById('login-username-input');
    const loginPasswordInput = document.getElementById('login-password-input');
    const errorMsg = document.querySelector('.error-msg');

    // When Login button pressed
    if (loginButton) { 
        loginButton.addEventListener('click', (e) => {
            e.preventDefault(); // prevent page refresh

            const username = loginUsernameInput.value;
            const password = loginPasswordInput.value;

            // Retrieve the array of registered users from local storage
            const storedUsersString = localStorage.getItem('users');

            if (storedUsersString) {
                const storedUsers = JSON.parse(storedUsersString);
                
                // Find a user with matching username and password
                const foundUser = storedUsers.find(user => 
                    user.username === username && user.password === password
                );

                if (foundUser) { // If mathced, store current user info and show confirmation message
                    localStorage.setItem('currentUser', JSON.stringify(foundUser)); 
                    errorMsg.style.color = 'green';
                    errorMsg.textContent = 'Login successful';
                } else { // If not matched, throw an error message
                    errorMsg.style.color = 'red';
                    errorMsg.textContent = 'Invalid username or password.';
                }
            } else { // If no user found, throw an error message
                errorMsg.style.color = 'red';
                errorMsg.textContent = 'No registered users found. Please register first.';
            }

            errorMsg.style.display = 'block';
        });
    }
});

