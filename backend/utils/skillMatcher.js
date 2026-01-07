/**
 * Skill-Based Job Matching Algorithm
 * 
 * This function calculates the match percentage between a candidate's skills
 * and a job's requirements using a weighted scoring system.
 * 
 * @param {Array<string>} candidateSkills - Array of candidate skills
 * @param {Array<string>} jobRequirements - Array of job requirements/skills
 * @returns {number} Match percentage (0-100)
 */

export const calculateSkillMatch = (candidateSkills, jobRequirements) => {
    // Handle edge cases
    if (!candidateSkills || candidateSkills.length === 0) {
        return 0;
    }
    
    if (!jobRequirements || jobRequirements.length === 0) {
        return 0;
    }

    // Normalize skills: convert to lowercase, trim whitespace, remove duplicates
    const normalizeSkills = (skills) => {
        return [...new Set(
            skills
                .map(skill => skill.trim().toLowerCase())
                .filter(skill => skill.length > 0)
        )];
    };

    const normalizedCandidateSkills = normalizeSkills(candidateSkills);
    const normalizedJobRequirements = normalizeSkills(jobRequirements);

    if (normalizedJobRequirements.length === 0) {
        return 0;
    }

    // Calculate exact matches
    const exactMatches = normalizedCandidateSkills.filter(skill =>
        normalizedJobRequirements.includes(skill)
    ).length;

    // Calculate partial matches (fuzzy matching for similar skills)
    // This checks if a skill contains or is contained in a requirement
    const partialMatches = normalizedCandidateSkills.filter(candidateSkill => {
        // Skip if already an exact match
        if (normalizedJobRequirements.includes(candidateSkill)) {
            return false;
        }
        
        // Check for partial matches (e.g., "javascript" matches "js" or "JavaScript Developer")
        return normalizedJobRequirements.some(requirement => {
            const candidateLower = candidateSkill.toLowerCase();
            const requirementLower = requirement.toLowerCase();
            
            // Check if one contains the other (with minimum length to avoid false positives)
            return (candidateLower.length >= 3 && requirementLower.includes(candidateLower)) ||
                   (requirementLower.length >= 3 && candidateLower.includes(requirementLower));
        });
    }).length;

    // Weighted scoring system:
    // - Exact matches: 100% weight
    // - Partial matches: 50% weight
    const exactMatchScore = exactMatches * 1.0;
    const partialMatchScore = partialMatches * 0.5;
    const totalScore = exactMatchScore + partialMatchScore;

    // Calculate percentage: (matched skills / total required skills) * 100
    // Cap at 100%
    const matchPercentage = Math.min(
        Math.round((totalScore / normalizedJobRequirements.length) * 100),
        100
    );

    return matchPercentage;
};

/**
 * Get matched skills (for display purposes)
 * 
 * @param {Array<string>} candidateSkills - Array of candidate skills
 * @param {Array<string>} jobRequirements - Array of job requirements/skills
 * @returns {Object} Object containing matched and missing skills
 */
export const getMatchedSkills = (candidateSkills, jobRequirements) => {
    if (!candidateSkills || candidateSkills.length === 0) {
        return { matched: [], missing: jobRequirements || [] };
    }
    
    if (!jobRequirements || jobRequirements.length === 0) {
        return { matched: [], missing: [] };
    }

    const normalizeSkills = (skills) => {
        return [...new Set(
            skills
                .map(skill => skill.trim().toLowerCase())
                .filter(skill => skill.length > 0)
        )];
    };

    const normalizedCandidateSkills = normalizeSkills(candidateSkills);
    const normalizedJobRequirements = normalizeSkills(jobRequirements);

    const matched = [];
    const missing = [];

    normalizedJobRequirements.forEach(requirement => {
        const isExactMatch = normalizedCandidateSkills.includes(requirement);
        const isPartialMatch = normalizedCandidateSkills.some(skill => {
            const skillLower = skill.toLowerCase();
            const reqLower = requirement.toLowerCase();
            return (skillLower.length >= 3 && reqLower.includes(skillLower)) ||
                   (reqLower.length >= 3 && skillLower.includes(reqLower));
        });

        if (isExactMatch || isPartialMatch) {
            matched.push(requirement);
        } else {
            missing.push(requirement);
        }
    });

    return { matched, missing };
};







