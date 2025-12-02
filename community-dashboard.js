// Community Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'community-login.html';
        return;
    }

    // Get user email and set avatar
    const userEmail = localStorage.getItem('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userEmail && userAvatar) {
        const initials = userEmail.substring(0, 2).toUpperCase();
        userAvatar.textContent = initials;
    }

    // User menu functionality
    if (userAvatar) {
        userAvatar.addEventListener('click', function() {
            const shouldLogout = confirm('Wil je uitloggen?');
            if (shouldLogout) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                window.location.href = 'community-login.html';
            }
        });
    }

    // Add hover effects and interactions
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderColor = '#3b82f6';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderColor = '#e5e7eb';
        });
    });

    // Simulate real-time updates
    updateActivityFeed();
    setInterval(updateActivityFeed, 60000); // Update every minute

    function updateActivityFeed() {
        const now = new Date();
        const activityTimes = document.querySelectorAll('.activity-time');
        
        // This is a simulation - in production, you'd fetch real data from an API
        console.log('Activity feed updated at', now.toLocaleTimeString());
    }

    // Handle button clicks
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                const action = this.textContent.trim();
                console.log(`Action: ${action}`);
                
                // Show a temporary notification
                showNotification(`${action} - Deze functie wordt binnenkort beschikbaar!`);
            }
        });
    });

    // Notification system
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Sidebar tabs functionality
    const sidebarTabs = document.querySelectorAll('.sidebar-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    sidebarTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all tabs and contents
            sidebarTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});
