// Tab functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sectionTitle = document.getElementById('section-title');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update section title
            const tabName = this.textContent;
            sectionTitle.textContent = tabName;
            
            // Here you would typically filter/load different professionals
            console.log('Loading:', tabName);
        });
    });

    // Filter functionality
    const filterReset = document.querySelector('.filter-reset');
    const filterSelects = document.querySelectorAll('.filter-group select');

    filterReset.addEventListener('click', function() {
        filterSelects.forEach(select => {
            select.selectedIndex = 0;
        });
        console.log('Filters reset');
    });

    // Add filter change listeners
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            console.log(`Filter changed: ${this.id} = ${this.value}`);
            // Here you would typically filter the professionals
            applyFilters();
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value;
        console.log('Searching for:', searchTerm);
        // Here you would typically perform the search
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });

    // Skill tag clicks
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const skill = this.textContent;
            searchInput.value = skill;
            searchButton.click();
        });
    });

    // Profile action buttons
    const planButtons = document.querySelectorAll('.btn-primary');
    const portfolioButtons = document.querySelectorAll('.btn-secondary');

    planButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.textContent === 'Plan kennismaking') {
                const profileCard = this.closest('.profile-card');
                const name = profileCard.querySelector('.profile-name').textContent;
                alert(`Kennismaking plannen met ${name}`);
                // Here you would typically open a booking modal
            }
        });
    });

    portfolioButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.textContent === 'Bekijk portfolio') {
                const profileCard = this.closest('.profile-card');
                const name = profileCard.querySelector('.profile-name').textContent;
                alert(`Portfolio bekijken van ${name}`);
                // Here you would typically navigate to portfolio page
            }
        });
    });
});

// Function to apply filters (placeholder for future implementation)
function applyFilters() {
    const filters = {
        skills: document.getElementById('filter-skills').value,
        specialisme: document.getElementById('filter-specialisme').value,
        branche: document.getElementById('filter-branche').value,
        style: document.getElementById('filter-style').value,
        experience: document.getElementById('filter-experience').value,
        availability: document.getElementById('filter-availability').value,
        budget: document.getElementById('filter-budget').value,
        region: document.getElementById('filter-region').value
    };

    console.log('Active filters:', filters);
    
    // Here you would filter the professionals based on the active filters
    // For now, we'll just log the filters
}

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe profile cards
document.querySelectorAll('.profile-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});
