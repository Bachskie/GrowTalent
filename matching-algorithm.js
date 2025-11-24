// Matching Algorithm - Matches professionals to project requirements

// Professional Database (in a real app, this would come from a backend)
const professionalsDatabase = [
    {
        id: 1,
        name: "Didiet Milius",
        title: "Senior Copywriter (Branding | Longform | Transport & Tech)",
        photo: "https://via.placeholder.com/100",
        rating: 4.9,
        reviewCount: 23,
        bio: "Gespecialiseerd in het vertalen van complexe B2B-diensten naar heldere verhalen die impact maken. 10+ jaar ervaring in transport en tech.",
        skills: ["copywriting", "branding", "storytelling"],
        branche: ["transport", "tech", "b2b"],
        experience: "expert",
        yearsExperience: 10,
        hourlyRate: 65,
        availability: "volgende week dinsdag",
        availabilityDays: 7,
        region: "remote",
        tone: ["formal", "technical"],
        style: ["classic", "modern"],
        verified: true,
        skillVerified: true,
        expertCertified: true,
        communityActivity: 85, // 0-100 score based on activity
        portfolioCases: 12,
        previousBranches: ["transport", "tech", "b2b", "logistics"]
    },
    {
        id: 2,
        name: "Sarah van der Berg",
        title: "UX Designer & Researcher (E-commerce | SaaS)",
        photo: "https://via.placeholder.com/100",
        rating: 5.0,
        reviewCount: 18,
        bio: "Data-gedreven UX design met focus op conversie-optimalisatie. Expert in user research en prototyping.",
        skills: ["ux", "user-research", "graphic-design"],
        branche: ["tech", "retail"],
        experience: "senior",
        yearsExperience: 7,
        hourlyRate: 85,
        availability: "deze week vrijdag",
        availabilityDays: 2,
        region: "amsterdam",
        tone: ["casual", "technical"],
        style: ["modern", "minimalist"],
        verified: true,
        skillVerified: false,
        expertCertified: true,
        communityActivity: 92,
        portfolioCases: 15,
        previousBranches: ["tech", "retail", "finance", "saas"]
    },
    {
        id: 3,
        name: "Mark Janssen",
        title: "Brand Strategist (Startup | Scale-up | Rebranding)",
        photo: "https://via.placeholder.com/100",
        rating: 4.7,
        reviewCount: 31,
        bio: "Helpt bedrijven hun merkidentiteit te definiëren en tot leven te brengen. Van strategie tot visuele uitwerking.",
        skills: ["branding", "content-strategy", "graphic-design"],
        branche: ["tech", "b2b"],
        experience: "senior",
        yearsExperience: 8,
        hourlyRate: 95,
        availability: "over 2 weken",
        availabilityDays: 14,
        region: "utrecht",
        tone: ["creative", "inspirational"],
        style: ["bold", "modern"],
        verified: true,
        skillVerified: true,
        expertCertified: false,
        communityActivity: 78,
        portfolioCases: 20,
        previousBranches: ["tech", "b2b", "startup", "retail"]
    },
    {
        id: 4,
        name: "Lisa Chen",
        title: "AI Copywriter & Content Strategist (Tech | AI | Innovation)",
        photo: "https://via.placeholder.com/100",
        rating: 4.9,
        reviewCount: 15,
        bio: "Combineer AI-tools met menselijke creativiteit voor schaalbare, hoogwaardige content. Expert in GPT-prompting en content automation.",
        skills: ["ai-copywriting", "content-strategy", "seo", "copywriting"],
        branche: ["tech"],
        experience: "senior",
        yearsExperience: 6,
        hourlyRate: 75,
        availability: "morgen",
        availabilityDays: 1,
        region: "remote",
        tone: ["technical", "creative"],
        style: ["modern", "bold"],
        verified: true,
        skillVerified: true,
        expertCertified: true,
        communityActivity: 95,
        portfolioCases: 18,
        previousBranches: ["tech", "saas", "ai", "innovation"]
    },
    {
        id: 5,
        name: "Tom de Vries",
        title: "SEO Specialist & Content Writer (B2B | SaaS)",
        photo: "https://via.placeholder.com/100",
        rating: 4.8,
        reviewCount: 27,
        bio: "Data-driven SEO strategie met focus op organische groei. Schrijf content die ranked én converteert.",
        skills: ["seo", "copywriting", "content-strategy"],
        branche: ["tech", "b2b"],
        experience: "medior",
        yearsExperience: 4,
        hourlyRate: 60,
        availability: "volgende week maandag",
        availabilityDays: 6,
        region: "remote",
        tone: ["formal", "technical"],
        style: ["minimalist"],
        verified: true,
        skillVerified: true,
        expertCertified: false,
        communityActivity: 88,
        portfolioCases: 14,
        previousBranches: ["tech", "b2b", "saas", "marketing"]
    },
    {
        id: 6,
        name: "Emma Bakker",
        title: "Freelance UX Writer & Microcopy Expert",
        photo: "https://via.placeholder.com/100",
        rating: 4.6,
        reviewCount: 12,
        bio: "Specialisatie in gebruiksvriendelijke teksten voor apps en websites. Maak complexe flows simpel en begrijpelijk.",
        skills: ["copywriting", "ux", "user-research"],
        branche: ["tech", "healthcare"],
        experience: "medior",
        yearsExperience: 3,
        hourlyRate: 55,
        availability: "deze week",
        availabilityDays: 3,
        region: "rotterdam",
        tone: ["casual", "creative"],
        style: ["modern", "playful"],
        verified: true,
        skillVerified: false,
        expertCertified: false,
        communityActivity: 72,
        portfolioCases: 9,
        previousBranches: ["tech", "healthcare", "saas"]
    },
    {
        id: 7,
        name: "Rick van Leeuwen",
        title: "Video Content Creator & Storyteller",
        photo: "https://via.placeholder.com/100",
        rating: 4.9,
        reviewCount: 19,
        bio: "Creëer video content die bindt en converteert. Van concept tot montage, alles in eigen hand.",
        skills: ["video-editing", "storytelling", "content-strategy"],
        branche: ["retail", "b2b"],
        experience: "senior",
        yearsExperience: 7,
        hourlyRate: 70,
        availability: "over 1 week",
        availabilityDays: 7,
        region: "remote",
        tone: ["creative", "inspirational"],
        style: ["bold", "playful"],
        verified: true,
        skillVerified: true,
        expertCertified: false,
        communityActivity: 81,
        portfolioCases: 16,
        previousBranches: ["retail", "b2b", "hospitality", "events"]
    },
    {
        id: 8,
        name: "Nina Patel",
        title: "Brand Designer & Visual Storyteller",
        photo: "https://via.placeholder.com/100",
        rating: 5.0,
        reviewCount: 22,
        bio: "Ontwerp visuele identiteiten die blijven hangen. Gespecialiseerd in startups en scale-ups.",
        skills: ["graphic-design", "branding", "ux"],
        branche: ["tech", "retail"],
        experience: "senior",
        yearsExperience: 8,
        hourlyRate: 80,
        availability: "over 3 dagen",
        availabilityDays: 3,
        region: "amsterdam",
        tone: ["creative", "casual"],
        style: ["modern", "bold"],
        verified: true,
        skillVerified: true,
        expertCertified: true,
        communityActivity: 90,
        portfolioCases: 25,
        previousBranches: ["tech", "retail", "startup", "fashion"]
    },
    {
        id: 9,
        name: "Jasper Hendriks",
        title: "Content Strategist & Storytelling Coach",
        photo: "https://via.placeholder.com/100",
        rating: 4.7,
        reviewCount: 16,
        bio: "Help organisaties hun verhaal te vinden en te vertellen. Van strategie tot executie.",
        skills: ["content-strategy", "storytelling", "copywriting"],
        branche: ["b2b", "education"],
        experience: "expert",
        yearsExperience: 12,
        hourlyRate: 90,
        availability: "over 10 dagen",
        availabilityDays: 10,
        region: "utrecht",
        tone: ["inspirational", "formal"],
        style: ["classic", "modern"],
        verified: true,
        skillVerified: true,
        expertCertified: true,
        communityActivity: 76,
        portfolioCases: 30,
        previousBranches: ["b2b", "education", "nonprofit", "government"]
    },
    {
        id: 10,
        name: "Sophie Vermeer",
        title: "Junior Copywriter & Social Media Expert",
        photo: "https://via.placeholder.com/100",
        rating: 4.5,
        reviewCount: 8,
        bio: "Fris talent met oog voor social media trends. Schrijf content die resoneert met Gen Z en Millennials.",
        skills: ["copywriting", "content-strategy", "seo"],
        branche: ["retail", "hospitality"],
        experience: "junior",
        yearsExperience: 1.5,
        hourlyRate: 45,
        availability: "direct beschikbaar",
        availabilityDays: 0,
        region: "remote",
        tone: ["casual", "creative"],
        style: ["playful", "modern"],
        verified: true,
        skillVerified: false,
        expertCertified: false,
        communityActivity: 94,
        portfolioCases: 5,
        previousBranches: ["retail", "hospitality", "social-media"]
    }
];

// Matching Algorithm
function calculateMatchScore(professional, projectData) {
    let matchDetails = {
        skillsScore: 0,
        styleScore: 0,
        experienceScore: 0,
        availabilityScore: 0,
        reviewsScore: 0,
        verifiedScore: 0,
        brancheFitScore: 0,
        priceRangeScore: 0,
        communityScore: 0
    };

    // 1. SKILL OVERLAP (Weight: 40%)
    const matchedSkills = professional.skills.filter(skill => 
        projectData.skills.includes(skill)
    );
    const skillOverlapRatio = matchedSkills.length / projectData.skills.length;
    matchDetails.skillsScore = Math.round(skillOverlapRatio * 100);

    // 2. STYLE MATCH (Weight: 20%)
    // Analyzing: tone, style preferences, bio keywords, and branche alignment
    let styleScore = 0;
    let styleChecks = 0;

    // 2a. Tone-of-voice match
    if (projectData.tone && professional.tone.includes(projectData.tone)) {
        styleScore += 35;
    } else if (projectData.tone) {
        styleScore += 10; // Partial credit for having tone preferences
    } else {
        styleScore += 20; // Neutral if no preference
    }
    styleChecks++;

    // 2b. Design/approach style match
    if (projectData.style && professional.style.includes(projectData.style)) {
        styleScore += 35;
    } else if (projectData.style) {
        styleScore += 10;
    } else {
        styleScore += 20;
    }
    styleChecks++;

    // 2c. Bio keyword analysis (simple keyword matching)
    const bioKeywords = extractKeywords(professional.bio);
    const projectKeywords = extractKeywords(projectData.description + ' ' + projectData.goal);
    const bioMatchCount = bioKeywords.filter(keyword => 
        projectKeywords.includes(keyword)
    ).length;
    const bioMatchScore = Math.min(30, bioMatchCount * 5); // Max 30 points
    styleScore += bioMatchScore;
    styleChecks++;

    matchDetails.styleScore = Math.round(Math.min(100, styleScore / styleChecks * 100 / 100 * 100));

    // 3. EXPERIENCE LEVEL (Weight: 15%)
    // Based on: years, portfolio cases, badges, reviews
    let experienceScore = 0;

    // 3a. Years of experience
    const yearsScore = Math.min(35, (professional.yearsExperience / 12) * 35);
    experienceScore += yearsScore;

    // 3b. Portfolio size
    const portfolioScore = Math.min(25, (professional.portfolioCases / 30) * 25);
    experienceScore += portfolioScore;

    // 3c. Badges (verified status)
    let badgeScore = 0;
    if (professional.verified) badgeScore += 10;
    if (professional.skillVerified) badgeScore += 10;
    if (professional.expertCertified) badgeScore += 20;
    experienceScore += badgeScore;

    // 3d. Review quality (rating × review count weight)
    const reviewQualityScore = Math.min(10, (professional.rating / 5) * (Math.min(professional.reviewCount, 30) / 30) * 10);
    experienceScore += reviewQualityScore;

    // 3e. Match with requested experience level
    if (projectData.experience) {
        if (professional.experience === projectData.experience) {
            experienceScore += 20;
        } else if (isExperienceLevelAcceptable(professional.experience, projectData.experience)) {
            experienceScore += 10;
        }
    } else {
        experienceScore += 10; // Neutral bonus
    }

    matchDetails.experienceScore = Math.round(Math.min(100, experienceScore));

    // 4. AVAILABILITY (Weight: 10%)
    const deadlineDays = calculateDaysUntilDeadline(projectData.deadline);
    let availabilityScore = 0;
    
    if (professional.availabilityDays <= deadlineDays) {
        // Earlier availability is better
        if (professional.availabilityDays === 0) {
            availabilityScore = 100;
        } else if (professional.availabilityDays <= 3) {
            availabilityScore = 90;
        } else if (professional.availabilityDays <= 7) {
            availabilityScore = 80;
        } else if (professional.availabilityDays <= 14) {
            availabilityScore = 70;
        } else {
            availabilityScore = Math.max(50, 100 - (professional.availabilityDays / deadlineDays) * 50);
        }
    } else {
        // Not available in time
        availabilityScore = 20;
    }
    
    matchDetails.availabilityScore = Math.round(availabilityScore);

    // 5. REVIEWS (Weight: 10%)
    // Rating quality × review quantity
    const ratingScore = (professional.rating / 5) * 60; // Max 60 points for perfect rating
    const reviewCountScore = Math.min(40, (professional.reviewCount / 50) * 40); // Max 40 points
    matchDetails.reviewsScore = Math.round(ratingScore + reviewCountScore);

    // 6. VERIFIED STATUS (Weight: 5%)
    let verifiedScore = 0;
    if (professional.verified) verifiedScore += 40;
    if (professional.skillVerified) verifiedScore += 30;
    if (professional.expertCertified) verifiedScore += 30;
    matchDetails.verifiedScore = Math.round(verifiedScore);

    // ADDITIONAL FACTORS (not in main formula but used for ranking)
    
    // 7. BRANCHE FIT
    // Check if professional has worked in this branche before
    const brancheFit = professional.previousBranches.includes(projectData.branche);
    matchDetails.brancheFitScore = brancheFit ? 100 : 
        (professional.branche.includes(projectData.branche) ? 70 : 30);

    // 8. PRICE RANGE
    const budgetRange = parseBudgetRange(projectData.budget);
    if (budgetRange) {
        const hourlyInRange = professional.hourlyRate >= budgetRange.min && 
                             professional.hourlyRate <= budgetRange.max;
        if (hourlyInRange) {
            matchDetails.priceRangeScore = 100;
        } else if (professional.hourlyRate < budgetRange.min) {
            matchDetails.priceRangeScore = 90; // Cheaper is still acceptable
        } else {
            // Calculate how much over budget
            const overBudget = ((professional.hourlyRate - budgetRange.max) / budgetRange.max) * 100;
            matchDetails.priceRangeScore = Math.max(0, 100 - overBudget);
        }
    } else {
        matchDetails.priceRangeScore = 50;
    }

    // 9. COMMUNITY ACTIVITY
    // Active users get better visibility (0-100 scale)
    matchDetails.communityScore = professional.communityActivity;

    // FINAL SCORE CALCULATION
    // Score = (skills × 40%) + (style × 20%) + (experience × 15%) + 
    //         (availability × 10%) + (reviews × 10%) + (verified × 5%)
    const finalScore = Math.round(
        (matchDetails.skillsScore * 0.40) +
        (matchDetails.styleScore * 0.20) +
        (matchDetails.experienceScore * 0.15) +
        (matchDetails.availabilityScore * 0.10) +
        (matchDetails.reviewsScore * 0.10) +
        (matchDetails.verifiedScore * 0.05)
    );

    // Apply community activity boost (max +5 points)
    const communityBoost = Math.round((professional.communityActivity / 100) * 5);
    const boostedScore = Math.min(100, finalScore + communityBoost);

    // Apply branche fit boost (max +3 points if exact match)
    const brancheBoost = matchDetails.brancheFitScore === 100 ? 3 : 0;
    const totalScore = Math.min(100, boostedScore + brancheBoost);

    return {
        score: totalScore,
        details: matchDetails,
        professional: professional,
        matchedSkills: matchedSkills
    };
}

// Helper function to extract keywords from text
function extractKeywords(text) {
    if (!text) return [];
    
    const commonWords = new Set([
        'de', 'het', 'een', 'en', 'van', 'in', 'op', 'voor', 'met', 'die', 'dat',
        'aan', 'te', 'is', 'zijn', 'als', 'naar', 'om', 'wordt', 'door', 'bij',
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'been', 'be'
    ]);
    
    const words = text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.has(word));
    
    return [...new Set(words)]; // Unique words only
}

// Helper function to check if experience level is acceptable
function isExperienceLevelAcceptable(professionalLevel, requestedLevel) {
    const levels = { junior: 1, medior: 2, senior: 3, expert: 4 };
    const profLevel = levels[professionalLevel] || 0;
    const reqLevel = levels[requestedLevel] || 0;
    
    // Accept if professional is one level higher
    return profLevel === reqLevel + 1;
}

function parseBudgetRange(budgetString) {
    if (!budgetString) return null;
    
    const ranges = {
        '500-1000': { min: 25, max: 50 },      // Assuming ~20-40 hours
        '1000-2500': { min: 40, max: 75 },     // Assuming ~25-50 hours
        '2500-5000': { min: 50, max: 100 },    // Assuming ~25-100 hours
        '5000-10000': { min: 60, max: 120 },   // Assuming ~40-150 hours
        '10000+': { min: 70, max: 200 }        // Higher budgets = higher rates acceptable
    };
    
    return ranges[budgetString] || null;
}

function calculateDaysUntilDeadline(deadlineString) {
    const deadline = new Date(deadlineString);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
}

function findMatches(projectData, limit = null) {
    // Calculate match scores for all professionals
    const matches = professionalsDatabase.map(professional => 
        calculateMatchScore(professional, projectData)
    );

    // Sort by score (highest first)
    matches.sort((a, b) => b.score - a.score);

    // Filter out very low matches (below 30%)
    const filteredMatches = matches.filter(match => match.score >= 30);

    // Return limited or all results
    return limit ? filteredMatches.slice(0, limit) : filteredMatches;
}

function sortMatches(matches, sortBy) {
    const sorted = [...matches];
    
    switch(sortBy) {
        case 'match':
            // Already sorted by match score
            break;
        case 'rating':
            sorted.sort((a, b) => b.professional.rating - a.professional.rating);
            break;
        case 'price-low':
            sorted.sort((a, b) => a.professional.hourlyRate - b.professional.hourlyRate);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.professional.hourlyRate - a.professional.hourlyRate);
            break;
        case 'availability':
            sorted.sort((a, b) => a.professional.availabilityDays - b.professional.availabilityDays);
            break;
    }
    
    return sorted;
}

// Export functions for use in project-results.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { findMatches, sortMatches };
}
