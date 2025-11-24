// Project Results Page Handler

document.addEventListener('DOMContentLoaded', function() {
    // Get project data from sessionStorage
    const projectDataString = sessionStorage.getItem('projectData');
    
    if (!projectDataString) {
        // No project data, redirect to post project page
        window.location.href = 'post-project.html';
        return;
    }

    const projectData = JSON.parse(projectDataString);
    
    // Display project summary
    displayProjectSummary(projectData);
    
    // Find matches
    const initialMatches = findMatches(projectData, 10);
    let allMatches = findMatches(projectData);
    let currentMatches = initialMatches;
    let displayedCount = initialMatches.length;
    
    // Display results
    displayResults(currentMatches);
    
    // Update results count
    updateResultsCount(currentMatches.length, allMatches.length);
    
    // Show/hide load more button
    if (allMatches.length > displayedCount) {
        document.getElementById('load-more-container').style.display = 'block';
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('sort-by');
    sortSelect.addEventListener('change', function() {
        const sortedMatches = sortMatches(currentMatches, this.value);
        displayResults(sortedMatches);
    });
    
    // Load more functionality
    const loadMoreBtn = document.getElementById('load-more-btn');
    loadMoreBtn.addEventListener('click', function() {
        const nextBatch = allMatches.slice(displayedCount, displayedCount + 10);
        currentMatches = [...currentMatches, ...nextBatch];
        displayedCount += nextBatch.length;
        
        displayResults(currentMatches);
        updateResultsCount(displayedCount, allMatches.length);
        
        if (displayedCount >= allMatches.length) {
            document.getElementById('load-more-container').style.display = 'none';
        }
        
        // Scroll to first new result
        setTimeout(() => {
            const cards = document.querySelectorAll('.profile-card');
            if (cards[displayedCount - nextBatch.length]) {
                cards[displayedCount - nextBatch.length].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }, 100);
    });
});

function displayProjectSummary(projectData) {
    const summaryContainer = document.getElementById('project-summary');
    
    const skillsList = projectData.skills.join(', ');
    const deadline = new Date(projectData.deadline).toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    summaryContainer.innerHTML = `
        <h3>${projectData.title}</h3>
        <div class="summary-grid">
            <div class="summary-item">
                <span class="summary-label">Skills:</span>
                <span class="summary-value">${skillsList}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Branche:</span>
                <span class="summary-value">${formatBranche(projectData.branche)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Budget:</span>
                <span class="summary-value">${formatBudget(projectData.budget)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Deadline:</span>
                <span class="summary-value">${deadline}</span>
            </div>
        </div>
    `;
}

function updateResultsCount(displayed, total) {
    const countElement = document.getElementById('results-count');
    countElement.innerHTML = `<strong>${displayed}</strong> van <strong>${total}</strong> professionals gevonden`;
}

function displayResults(matches) {
    const grid = document.getElementById('results-grid');
    const noResults = document.getElementById('no-results');
    
    if (matches.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    
    grid.innerHTML = matches.map(match => createProfileCard(match)).join('');
    
    // Add event listeners to buttons
    attachButtonListeners();
}

function createProfileCard(match) {
    const prof = match.professional;
    const stars = '★'.repeat(Math.floor(prof.rating)) + '☆'.repeat(5 - Math.floor(prof.rating));
    
    const badges = `
        ${prof.verified ? '<span class="badge verified" title="ID/KvK Geverifieerd">✓</span>' : ''}
        ${prof.skillVerified ? '<span class="badge skill-verified" title="Skill Verified">S</span>' : ''}
        ${prof.expertCertified ? '<span class="badge expert" title="Expert Certified">E</span>' : ''}
    `;
    
    const skillBadges = prof.skills.slice(0, 4).map(skill => 
        `<span class="skill-badge">${formatSkill(skill)}</span>`
    ).join('');
    
    const matchClass = match.score >= 70 ? 'high' : match.score >= 50 ? 'medium' : 'low';
    
    // Create match breakdown HTML
    const breakdown = createMatchBreakdown(match);
    
    // Generate match reason
    const matchReason = generateMatchReason(match);
    
    return `
        <div class="profile-card" data-professional-id="${prof.id}">
            <span class="match-score ${matchClass}" data-match-id="${prof.id}">${match.score}% match</span>
            ${breakdown}
            <div class="profile-header">
                <img src="${prof.photo}" alt="${prof.name}" class="profile-photo">
                <div class="verification-badges">
                    ${badges}
                </div>
            </div>
            <div class="profile-body">
                <h4 class="profile-name">${prof.name}</h4>
                <p class="profile-title">${prof.title}</p>
                
                <div class="match-reason">
                    <strong>Waarom deze match:</strong> ${matchReason}
                </div>
                
                <div class="profile-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-score">${prof.rating}</span>
                    <span class="review-count">(${prof.reviewCount} reviews)</span>
                </div>

                <p class="profile-bio">${prof.bio}</p>

                <div class="profile-skills">
                    ${skillBadges}
                </div>

                <div class="profile-meta">
                    <div class="meta-item">
                        <span class="meta-label">Beschikbaar:</span>
                        <span class="meta-value available">${prof.availability}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Tarief:</span>
                        <span class="meta-value">Vanaf €${prof.hourlyRate} per uur</span>
                    </div>
                </div>

                <div class="profile-actions">
                    <button class="btn btn-primary plan-meeting-btn" data-professional-id="${prof.id}">Plan kennismaking</button>
                    <button class="btn btn-secondary" data-professional-id="${prof.id}">Bekijk portfolio</button>
                </div>
                
                <div class="profile-actions-extended">
                    <button class="btn-icon shortlist-btn" data-professional-id="${prof.id}" title="Voeg toe aan shortlist">
                        <span class="icon">⭐</span>
                        <span class="label">Shortlist</span>
                    </button>
                    <button class="btn-icon chat-btn" data-professional-id="${prof.id}" title="Start chat">
                        <span class="icon">💬</span>
                        <span class="label">Chat</span>
                    </button>
                    <button class="btn-icon invite-btn" data-professional-id="${prof.id}" title="Nodig uit voor project">
                        <span class="icon">✉️</span>
                        <span class="label">Uitnodigen</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createMatchBreakdown(match) {
    const details = match.details;
    const matchedSkillsList = match.matchedSkills.map(skill => 
        `<span class="skill-badge">${formatSkill(skill)}</span>`
    ).join('');
    
    return `
        <div class="match-breakdown" data-breakdown-id="${match.professional.id}">
            <h4>Match Details</h4>
            
            <div class="breakdown-group">
                <div class="breakdown-item">
                    <span class="breakdown-label">Skills overlap (40%)</span>
                    <span class="breakdown-value">${details.skillsScore}%</span>
                </div>
                <div class="breakdown-bar">
                    <div class="breakdown-bar-fill ${getBarClass(details.skillsScore)}" style="width: ${details.skillsScore}%"></div>
                </div>
                ${matchedSkillsList ? `<div class="breakdown-matched-skills">${matchedSkillsList}</div>` : ''}
            </div>
            
            <div class="breakdown-group">
                <div class="breakdown-item">
                    <span class="breakdown-label">Stijl match (20%)</span>
                    <span class="breakdown-value">${details.styleScore}%</span>
                </div>
                <div class="breakdown-bar">
                    <div class="breakdown-bar-fill ${getBarClass(details.styleScore)}" style="width: ${details.styleScore}%"></div>
                </div>
            </div>
            
            <div class="breakdown-group">
                <div class="breakdown-item">
                    <span class="breakdown-label">Ervaring (15%)</span>
                    <span class="breakdown-value">${details.experienceScore}%</span>
                </div>
                <div class="breakdown-bar">
                    <div class="breakdown-bar-fill ${getBarClass(details.experienceScore)}" style="width: ${details.experienceScore}%"></div>
                </div>
            </div>
            
            <div class="breakdown-group">
                <div class="breakdown-item">
                    <span class="breakdown-label">Beschikbaarheid (10%)</span>
                    <span class="breakdown-value">${details.availabilityScore}%</span>
                </div>
                <div class="breakdown-bar">
                    <div class="breakdown-bar-fill ${getBarClass(details.availabilityScore)}" style="width: ${details.availabilityScore}%"></div>
                </div>
            </div>
            
            <div class="breakdown-group">
                <div class="breakdown-item">
                    <span class="breakdown-label">Reviews (10%)</span>
                    <span class="breakdown-value">${details.reviewsScore}%</span>
                </div>
                <div class="breakdown-bar">
                    <div class="breakdown-bar-fill ${getBarClass(details.reviewsScore)}" style="width: ${details.reviewsScore}%"></div>
                </div>
            </div>
            
            <div class="breakdown-group">
                <div class="breakdown-item">
                    <span class="breakdown-label">Verified status (5%)</span>
                    <span class="breakdown-value">${details.verifiedScore}%</span>
                </div>
                <div class="breakdown-bar">
                    <div class="breakdown-bar-fill ${getBarClass(details.verifiedScore)}" style="width: ${details.verifiedScore}%"></div>
                </div>
            </div>
            
            <div class="breakdown-item" style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border-color);">
                <span class="breakdown-label"><strong>Branche fit:</strong></span>
                <span class="breakdown-value">${details.brancheFitScore}%</span>
            </div>
            
            <div class="breakdown-item">
                <span class="breakdown-label"><strong>Budget match:</strong></span>
                <span class="breakdown-value">${details.priceRangeScore}%</span>
            </div>
            
            <div class="breakdown-item">
                <span class="breakdown-label"><strong>Community activity:</strong></span>
                <span class="breakdown-value">${details.communityScore}%</span>
            </div>
        </div>
    `;
}

function getBarClass(score) {
    if (score >= 70) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
}

// Generate match reason text
function generateMatchReason(match) {
    const details = match.details;
    const prof = match.professional;
    const reasons = [];
    
    // Skills
    if (details.skillsScore >= 70 && match.matchedSkills.length > 0) {
        const skillNames = match.matchedSkills.map(s => formatSkill(s)).join(', ');
        reasons.push(`${match.matchedSkills.length} matchende skills (${skillNames})`);
    }
    
    // Experience
    if (details.experienceScore >= 80) {
        reasons.push(`${prof.yearsExperience}+ jaar relevante ervaring`);
    }
    
    // Branche
    if (details.brancheFitScore === 100) {
        reasons.push('eerder in deze branche gewerkt');
    }
    
    // Reviews
    if (prof.rating >= 4.8) {
        reasons.push(`excellente reviews (${prof.rating}★)`);
    }
    
    // Availability
    if (details.availabilityScore >= 90) {
        reasons.push('direct beschikbaar');
    }
    
    // Verified
    if (prof.expertCertified) {
        reasons.push('Expert Certified');
    }
    
    if (reasons.length === 0) {
        return 'Geschikte professional voor dit project';
    }
    
    return reasons.slice(0, 3).join(', ') + '.';
}

function attachButtonListeners() {
    // Match score hover to show breakdown
    document.querySelectorAll('.match-score').forEach(badge => {
        badge.addEventListener('click', function(e) {
            e.stopPropagation();
            const matchId = this.getAttribute('data-match-id');
            const breakdown = document.querySelector(`.match-breakdown[data-breakdown-id="${matchId}"]`);
            
            // Close all other breakdowns
            document.querySelectorAll('.match-breakdown').forEach(b => {
                if (b !== breakdown) b.classList.remove('show');
            });
            
            // Toggle this breakdown
            if (breakdown) {
                breakdown.classList.toggle('show');
            }
        });
    });
    
    // Close breakdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.match-score') && !e.target.closest('.match-breakdown')) {
            document.querySelectorAll('.match-breakdown').forEach(b => {
                b.classList.remove('show');
            });
        }
    });
    
    // Plan kennismaking buttons
    document.querySelectorAll('.plan-meeting-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const profId = parseInt(this.getAttribute('data-professional-id'));
            window.flowInteractions.openMeetingScheduler(profId);
        });
    });
    
    // Bekijk portfolio buttons
    document.querySelectorAll('.profile-actions .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const profId = this.getAttribute('data-professional-id');
            const card = this.closest('.profile-card');
            const name = card.querySelector('.profile-name').textContent;
            
            // In a real app, this would navigate to portfolio page
            alert(`Portfolio bekijken van ${name}\n\nIn de volledige versie navigeer je naar hun portfolio-pagina met cases en werkvoorbeelden.`);
            console.log('View portfolio for professional ID:', profId);
        });
    });
    
    // Shortlist buttons
    document.querySelectorAll('.shortlist-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const profId = parseInt(this.getAttribute('data-professional-id'));
            if (this.classList.contains('active')) {
                window.flowInteractions.removeFromShortlist(profId);
            } else {
                window.flowInteractions.addToShortlist(profId);
            }
        });
    });
    
    // Chat buttons
    document.querySelectorAll('.chat-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const profId = parseInt(this.getAttribute('data-professional-id'));
            window.flowInteractions.openChatModal(profId);
        });
    });
    
    // Invite buttons
    document.querySelectorAll('.invite-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const profId = parseInt(this.getAttribute('data-professional-id'));
            window.flowInteractions.openInvitationModal(profId);
        });
    });
}

// Helper functions
function formatBranche(branche) {
    const brancheMap = {
        'tech': 'Tech',
        'transport': 'Transport & Logistiek',
        'b2b': 'B2B',
        'retail': 'Retail',
        'healthcare': 'Healthcare',
        'finance': 'Finance',
        'education': 'Onderwijs',
        'hospitality': 'Horeca',
        'other': 'Anders'
    };
    return brancheMap[branche] || branche;
}

function formatBudget(budget) {
    return budget.replace('-', ' - ').replace('+', '+');
}

function formatSkill(skill) {
    const skillMap = {
        'copywriting': 'Copywriting',
        'ux': 'UX Design',
        'branding': 'Branding',
        'storytelling': 'Storytelling',
        'ai-copywriting': 'AI Copywriting',
        'seo': 'SEO',
        'content-strategy': 'Content Strategy',
        'graphic-design': 'Graphic Design',
        'video-editing': 'Video Editing',
        'user-research': 'User Research'
    };
    return skillMap[skill] || skill;
}
