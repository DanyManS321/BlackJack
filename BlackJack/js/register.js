// --- Register Page (form validation) ---
document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.getElementById('register-button');
    const usernameInput = document.getElementById('username-input');
    const emailInput = document.getElementById('email-input');
    const phoneInput = document.getElementById('phone-input');
    const postcodeInput = document.getElementById('postcode-input');
    const passwordInput = document.getElementById('password-input');
    const repeatPasswordInput = document.getElementById('repeat-password-input');
    const errorMsg = document.querySelector('.error-msg');

    registerButton.addEventListener('click', (e) => {
        e.preventDefault();

        const username = usernameInput.value;
        const email = emailInput.value;
        const phone = phoneInput.value;
        const postcode = postcodeInput.value;
        const password = passwordInput.value;
        const repeatPassword = repeatPasswordInput.value;

        let isValid = true;
        let errorMessage = '';

        // Username Validation
        const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
        if (!usernameRegex.test(username)) {
            errorMessage = 'Username must start with a letter, be 3-16 characters long, and contain only letters, numbers, and underscores.';
            isValid = false;
        }

        // Check for duplicate username
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const isUsernameTaken = users.some(user => user.username === username);
        if (isValid && isUsernameTaken) {
            errorMessage = 'This username is already taken. Please choose another one.';
            isValid = false;
        }

        // Email Validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (isValid && email && !emailRegex.test(email)) {
            errorMessage = 'Please enter a valid email address.';
            isValid = false;
        }

        // Phone Validation
        // Accepts various formats including optional country code and separators like hyphens, spaces, or parentheses.
        const phoneRegex = /^(\+?[0-9\s-()]{8,20})?$/;
        if (isValid && phone && !phoneRegex.test(phone)) {
            errorMessage = 'Please enter a valid phone number (optional).';
            isValid = false;
        }

        // Password Validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (isValid && !passwordRegex.test(password)) {
            errorMessage = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.';
            isValid = false;
        }

        // Repeat Password Validation
        if (isValid && password !== repeatPassword) {
            errorMessage = 'Password does not match.';
            isValid = false;
        }
        
        // Display or hide the error message based on the validation result
        if (isValid) { // If passes all the validations successfully, go for saving the user
            const newUser = {
                username: username,
                email: email,
                phone: phone,
                postcode: postcode,
                password: password
            };

            users.push(newUser); // Add new user to array of users in local storage
            localStorage.setItem('users', JSON.stringify(users));

            errorMsg.style.color = 'green';
            errorMsg.style.display = 'block';
            errorMsg.textContent = 'Register successful!';
        } else { // Throw corresponding error message if isValid is false
            errorMsg.textContent = errorMessage;
            errorMsg.style.color = 'red';
            errorMsg.style.display = 'block';
        }
    });
});
