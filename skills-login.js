// Skills Login JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Directe toegang voor ease of use
            // Sla gebruikersgegevens op (gebruik demo email als veld leeg is)
            localStorage.setItem('userEmail', email || 'demo@growtlent.nl');
            localStorage.setItem('isLoggedIn', 'true');

            // Redirect naar skills dashboard
            window.location.href = 'skills-dashboard.html';
        });
    }

    // Social login handlers
    const socialButtons = document.querySelectorAll('.social-button');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'LinkedIn';
            
            // Directe toegang via social login
            localStorage.setItem('userEmail', `demo@${provider.toLowerCase()}.com`);
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'skills-dashboard.html';
        });
    });
});
