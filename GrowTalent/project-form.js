// Project Form Handler

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('project-form');
    const descriptionTextarea = document.getElementById('project-description');
    const charCount = document.querySelector('.char-count');
    const deadlineInput = document.getElementById('project-deadline');

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    deadlineInput.setAttribute('min', today);

    // Character counter for description
    if (descriptionTextarea && charCount) {
        descriptionTextarea.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = `${length} / 2000`;
            
            if (length > 2000) {
                charCount.style.color = '#ef4444';
                this.value = this.value.substring(0, 2000);
            } else {
                charCount.style.color = 'var(--text-secondary)';
            }
        });
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate at least one skill is selected
        const skillCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
        const skillsError = document.getElementById('skills-error');

        if (skillCheckboxes.length === 0) {
            skillsError.textContent = 'Selecteer minimaal 1 skill';
            skillsError.classList.add('show');
            
            // Scroll to error
            document.querySelector('.skills-selector').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            return;
        } else {
            skillsError.classList.remove('show');
        }

        // Collect form data
        const formData = {
            title: document.getElementById('project-title').value,
            description: document.getElementById('project-description').value,
            goal: document.getElementById('project-goal').value,
            branche: document.getElementById('project-branche').value,
            budget: document.getElementById('project-budget').value,
            deadline: document.getElementById('project-deadline').value,
            skills: Array.from(skillCheckboxes).map(cb => cb.value),
            tone: document.getElementById('project-tone').value || null,
            style: document.getElementById('project-style').value || null,
            experience: document.getElementById('project-experience').value || null,
            region: document.getElementById('project-region').value || null,
            notes: document.getElementById('project-notes').value || null
        };

        console.log('Project submitted:', formData);

        // Store in sessionStorage for the results page
        sessionStorage.setItem('projectData', JSON.stringify(formData));

        // Redirect to results page
        window.location.href = 'project-results.html';
    });

    // Real-time validation feedback
    const requiredInputs = form.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = 'var(--border-color)';
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.style.borderColor = 'var(--border-color)';
            }
        });
    });
});
