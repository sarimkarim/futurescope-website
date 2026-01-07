import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// pdf-parse v1.1.1 exports a function directly
const pdfParse = require('pdf-parse');

/**
 * Common technical skills database for skill extraction
 * This helps identify skills mentioned in CV text
 */
const COMMON_SKILLS = [
    // Programming Languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'r', 'matlab',
    // Web Technologies
    'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'asp.net', 'laravel', 'symfony',
    // Databases
    'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sql server', 'sqlite', 'cassandra', 'elasticsearch',
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'ci/cd', 'terraform', 'ansible', 'linux', 'unix',
    // Mobile
    'react native', 'flutter', 'ios', 'android', 'xamarin',
    // Data Science & AI
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn', 'data analysis', 'data science',
    // Other
    'agile', 'scrum', 'rest api', 'graphql', 'microservices', 'blockchain', 'solidity', 'web3', 'ethereum'
];

/**
 * Extract skills from CV text
 * Uses keyword matching against common skills database
 * 
 * @param {string} cvText - Text extracted from CV
 * @returns {Array<string>} Array of extracted skills
 */
export const extractSkillsFromCV = (cvText) => {
    if (!cvText || typeof cvText !== 'string') {
        return [];
    }

    const normalizedText = cvText.toLowerCase();
    const extractedSkills = [];

    // Check for each skill in the text
    COMMON_SKILLS.forEach(skill => {
        // Use word boundary matching to avoid false positives
        const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(normalizedText)) {
            extractedSkills.push(skill);
        }
    });

    // Also look for skills section patterns
    // Common patterns: "Skills:", "Technical Skills:", "Proficient in:", etc.
    const skillsSectionPatterns = [
        /skills?[:\s]+([^:]+?)(?:\n\n|\n[A-Z]|$)/i,
        /technical\s+skills?[:\s]+([^:]+?)(?:\n\n|\n[A-Z]|$)/i,
        /proficient\s+in[:\s]+([^:]+?)(?:\n\n|\n[A-Z]|$)/i,
        /expertise[:\s]+([^:]+?)(?:\n\n|\n[A-Z]|$)/i,
    ];

    skillsSectionPatterns.forEach(pattern => {
        const match = normalizedText.match(pattern);
        if (match && match[1]) {
            // Extract comma or pipe-separated skills
            const skillsInSection = match[1]
                .split(/[,|•\n]/)
                .map(s => s.trim())
                .filter(s => s.length > 0 && s.length < 50); // Reasonable skill name length
            
            skillsInSection.forEach(skill => {
                // Check if it's a known skill or add it if it looks like a skill
                const normalizedSkill = skill.toLowerCase();
                if (COMMON_SKILLS.some(knownSkill => normalizedSkill.includes(knownSkill) || knownSkill.includes(normalizedSkill))) {
                    if (!extractedSkills.includes(normalizedSkill)) {
                        extractedSkills.push(normalizedSkill);
                    }
                } else if (skill.length >= 2 && skill.length <= 30 && /^[a-z\s]+$/i.test(skill)) {
                    // Add if it looks like a skill (alphanumeric, reasonable length)
                    if (!extractedSkills.includes(normalizedSkill)) {
                        extractedSkills.push(normalizedSkill);
                    }
                }
            });
        }
    });

    // Remove duplicates and return
    return [...new Set(extractedSkills.map(skill => skill.trim()))];
};

/**
 * Fetch PDF from URL and extract text
 * 
 * @param {string} pdfUrl - URL of the PDF file
 * @returns {Promise<string>} Extracted text from PDF
 */
export const extractTextFromPDF = async (pdfUrl) => {
    try {
        if (!pdfUrl) {
            return '';
        }

        // Fetch PDF from URL
        const response = await fetch(pdfUrl);
        if (!response.ok) {
            console.error(`Failed to fetch PDF from ${pdfUrl}: ${response.statusText}`);
            return '';
        }

        const arrayBuffer = await response.arrayBuffer();
        const pdfBuffer = Buffer.from(arrayBuffer);
        
        // Parse PDF and extract text
        const data = await pdfParse(pdfBuffer);
        return data.text;
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        return '';
    }
};

/**
 * Get all skills from user profile and CV
 * Combines profile skills with skills extracted from CV
 * 
 * @param {Object} user - User object with profile and resume
 * @returns {Promise<Array<string>>} Combined array of skills
 */
export const getAllUserSkills = async (user) => {
    const profileSkills = user.profile?.skills || [];
    
    // If no CV is uploaded, return only profile skills
    if (!user.profile?.resume) {
        return profileSkills;
    }

    try {
        // Extract text from CV
        const cvText = await extractTextFromPDF(user.profile.resume);
        
        // Extract skills from CV text
        const cvSkills = extractSkillsFromCV(cvText);
        
        // Combine profile skills and CV skills, remove duplicates
        const allSkills = [...new Set([...profileSkills.map(s => s.toLowerCase().trim()), ...cvSkills])];
        
        return allSkills;
    } catch (error) {
        console.error('Error extracting skills from CV:', error);
        // Return only profile skills if CV extraction fails
        return profileSkills;
    }
};

