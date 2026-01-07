import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader2, Download, Eye, Plus, X } from 'lucide-react';
import axios from 'axios';
import { RESUME_API_END_POINT } from '@/utils/constant';

const ResumeBuilder = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [errors, setErrors] = useState({});
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [formData, setFormData] = useState({
        personalInfo: {
            fullName: user?.fullname || '',
            email: user?.email || '',
            phone: user?.phoneNumber || '',
            address: '',
            linkedin: '',
            github: '',
            website: ''
        },
        summary: '',
        experience: [{ company: '', position: '', startDate: '', endDate: '', description: '', current: false }],
        education: [{ institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }],
        skills: [],
        projects: [{ name: '', description: '', technologies: '', link: '' }],
        certifications: [{ name: '', issuer: '', date: '', link: '' }]
    });

    const templates = [
        { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
        { id: 'classic', name: 'Classic', description: 'Traditional professional layout' },
        { id: 'creative', name: 'Creative', description: 'Bold and eye-catching design' },
        { id: 'professional', name: 'Professional', description: 'Business-focused elegant style' },
        { id: 'minimalist', name: 'Minimalist', description: 'Simple and clean layout' },
        { id: 'executive', name: 'Executive', description: 'Executive-level sophisticated design' }
    ];

    useEffect(() => {
        if (!user) {
            toast.error('Please login to use Resume Builder');
            navigate('/login');
        }
    }, [user, navigate]);

    // Validation functions
    const validateTextOnly = (value, fieldName) => {
        if (!value.trim()) return null;
        // Check if value contains only numbers
        if (/^\d+$/.test(value.trim())) {
            return `${fieldName} cannot contain only numbers`;
        }
        // Check if value starts with numbers
        if (/^\d/.test(value.trim())) {
            return `${fieldName} cannot start with numbers`;
        }
        return null;
    };

    const validateCompanyName = (value) => {
        return validateTextOnly(value, 'Company name');
    };

    const validateInstitutionName = (value) => {
        return validateTextOnly(value, 'Institution name');
    };

    const handleInputChange = (section, field, value, index = null) => {
        const errorKey = index !== null ? `${section}_${index}_${field}` : `${section}_${field}`;
        
        // Update form data first
        if (index !== null) {
            setFormData(prev => ({
                ...prev,
                [section]: prev[section].map((item, i) => 
                    i === index ? { ...item, [field]: value } : item
                )
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        }

        // Validate after updating
        let error = null;
        if (field === 'company' && value) {
            error = validateCompanyName(value);
        } else if (field === 'institution' && value) {
            error = validateInstitutionName(value);
        }

        // Update errors
        setErrors(prev => {
            const newErrors = { ...prev };
            if (error) {
                newErrors[errorKey] = error;
            } else {
                delete newErrors[errorKey];
            }
            return newErrors;
        });
    };

    const addItem = (section) => {
        const defaultItems = {
            experience: { company: '', position: '', startDate: '', endDate: '', description: '', current: false },
            education: { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' },
            projects: { name: '', description: '', technologies: '', link: '' },
            certifications: { name: '', issuer: '', date: '', link: '' }
        };
        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], defaultItems[section]]
        }));
    };

    const removeItem = (section, index) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const handleSkillsChange = (e) => {
        const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
        setFormData(prev => ({ ...prev, skills }));
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should be less than 2MB');
                return;
            }
            setProfilePicture(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeProfilePicture = () => {
        setProfilePicture(null);
        setProfilePicturePreview(null);
    };

    const generateResume = async () => {
        if (!formData.personalInfo.fullName || !formData.personalInfo.email) {
            toast.error('Please fill in at least your name and email');
            return;
        }

        setLoading(true);
        try {
            // Convert profile picture to base64 if exists
            let profilePictureBase64 = null;
            if (profilePicture) {
                profilePictureBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(profilePicture);
                });
            }

            const response = await axios.post(
                `${RESUME_API_END_POINT}/generate`,
                { ...formData, template: selectedTemplate, profilePicture: profilePictureBase64 },
                { 
                    responseType: 'blob',
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Check if response is successful (status 200-299) and has blob data
            if (response.status >= 200 && response.status < 300 && response.data instanceof Blob) {
                const url = window.URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${formData.personalInfo.fullName}_Resume.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                toast.success('Resume generated successfully!');
            } else {
                throw new Error('Failed to generate resume');
            }
        } catch (error) {
            // Only show error if it's not a network/CORS error that might still have succeeded
            // Check if error is due to CORS but download might have worked
            if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
                // Check if blob was actually received despite the error
                if (error.response?.data instanceof Blob) {
                    try {
                        const url = window.URL.createObjectURL(error.response.data);
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `${formData.personalInfo.fullName}_Resume.pdf`);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        window.URL.revokeObjectURL(url);
                        toast.success('Resume generated successfully!');
                    } catch {
                        toast.error('Network error. Please check your connection and try again.');
                    }
                } else {
                    toast.error('Network error. Please check your connection and try again.');
                }
            } else if (error.response?.data instanceof Blob) {
                // Handle error response that might be JSON when responseType is blob
                try {
                    const text = await error.response.data.text();
                    const errorData = JSON.parse(text);
                    toast.error(errorData.message || 'Failed to generate resume');
                } catch (parseError) {
                    toast.error('Failed to generate resume. Please ensure you are logged in.');
                }
            } else if (error.response?.status === 401) {
                toast.error('Please log in to generate resume');
            } else {
                toast.error(error.response?.data?.message || 'Failed to generate resume');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Resume Builder</h1>
                    <p className="text-gray-600 mb-6">Create a professional resume in minutes</p>

                    {/* Template Selection */}
                    <div className="mb-8">
                        <Label className="text-lg font-semibold mb-4 block">Choose Template</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {templates.map(template => (
                                <div
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedTemplate === template.id
                                            ? 'border-[#6A38C2] bg-purple-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <h3 className="font-semibold text-gray-800">{template.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                        
                        {/* Profile Picture Upload */}
                        <div className="mb-6">
                            <Label className="mb-2 block">Profile Picture</Label>
                            <div className="flex items-center gap-4">
                                {profilePicturePreview ? (
                                    <div className="relative">
                                        <img 
                                            src={profilePicturePreview} 
                                            alt="Profile preview" 
                                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeProfilePicture}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                                        <span className="text-gray-400 text-xs text-center px-2">No Image</span>
                                    </div>
                                )}
                                <div>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Max size: 2MB (JPG, PNG, etc.)</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="mb-2 block">Full Name *</Label>
                                <Input
                                    value={formData.personalInfo.fullName}
                                    onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Email *</Label>
                                <Input
                                    type="email"
                                    value={formData.personalInfo.email}
                                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Phone</Label>
                                <Input
                                    value={formData.personalInfo.phone}
                                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Address</Label>
                                <Input
                                    value={formData.personalInfo.address}
                                    onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                                    placeholder="City, State, Country"
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">LinkedIn</Label>
                                <Input
                                    value={formData.personalInfo.linkedin}
                                    onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)}
                                    placeholder="linkedin.com/in/yourprofile"
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">GitHub</Label>
                                <Input
                                    value={formData.personalInfo.github}
                                    onChange={(e) => handleInputChange('personalInfo', 'github', e.target.value)}
                                    placeholder="github.com/yourusername"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Summary */}
                    <div className="mb-8">
                        <Label className="text-lg font-semibold mb-2 block">Professional Summary</Label>
                        <Textarea
                            value={formData.summary}
                            onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                            placeholder="Write a brief summary of your professional background..."
                            rows={4}
                            className="w-full"
                        />
                    </div>

                    {/* Experience */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Work Experience</h2>
                            <Button onClick={() => addItem('experience')} variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" /> Add Experience
                            </Button>
                        </div>
                        {formData.experience.map((exp, index) => (
                            <div key={index} className="border rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold">Experience {index + 1}</h3>
                                    {formData.experience.length > 1 && (
                                        <Button onClick={() => removeItem('experience', index)} variant="ghost" size="sm">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="mb-2 block">Company <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={exp.company}
                                            onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)}
                                            placeholder="Company Name"
                                            className={errors[`experience_${index}_company`] ? 'border-red-500' : ''}
                                        />
                                        {errors[`experience_${index}_company`] && (
                                            <p className="text-red-500 text-sm mt-1">{errors[`experience_${index}_company`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="mb-2 block">Position <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={exp.position}
                                            onChange={(e) => handleInputChange('experience', 'position', e.target.value, index)}
                                            placeholder="Job Title"
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block">Start Date <span className="text-red-500">*</span></Label>
                                        <Input
                                            type="date"
                                            value={exp.startDate}
                                            onChange={(e) => handleInputChange('experience', 'startDate', e.target.value, index)}
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block">End Date</Label>
                                        <Input
                                            type="date"
                                            value={exp.endDate}
                                            onChange={(e) => handleInputChange('experience', 'endDate', e.target.value, index)}
                                            disabled={exp.current}
                                        />
                                        <div className="mt-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={exp.current}
                                                    onChange={(e) => handleInputChange('experience', 'current', e.target.checked, index)}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">Current Position</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label className="mb-2 block">Description</Label>
                                        <Textarea
                                            value={exp.description}
                                            onChange={(e) => handleInputChange('experience', 'description', e.target.value, index)}
                                            placeholder="Describe your responsibilities and achievements..."
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Education */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Education</h2>
                            <Button onClick={() => addItem('education')} variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" /> Add Education
                            </Button>
                        </div>
                        {formData.education.map((edu, index) => (
                            <div key={index} className="border rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold">Education {index + 1}</h3>
                                    {formData.education.length > 1 && (
                                        <Button onClick={() => removeItem('education', index)} variant="ghost" size="sm">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="mb-2 block">Institution <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={edu.institution}
                                            onChange={(e) => handleInputChange('education', 'institution', e.target.value, index)}
                                            placeholder="University Name"
                                            className={errors[`education_${index}_institution`] ? 'border-red-500' : ''}
                                        />
                                        {errors[`education_${index}_institution`] && (
                                            <p className="text-red-500 text-sm mt-1">{errors[`education_${index}_institution`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="mb-2 block">Degree <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={edu.degree}
                                            onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
                                            placeholder="Bachelor's, Master's, etc."
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block">Field of Study</Label>
                                        <Input
                                            value={edu.field}
                                            onChange={(e) => handleInputChange('education', 'field', e.target.value, index)}
                                            placeholder="Computer Science, Business, etc."
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block">GPA</Label>
                                        <Input
                                            value={edu.gpa}
                                            onChange={(e) => handleInputChange('education', 'gpa', e.target.value, index)}
                                            placeholder="3.8/4.0"
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block">Start Date <span className="text-red-500">*</span></Label>
                                        <Input
                                            type="date"
                                            value={edu.startDate}
                                            onChange={(e) => handleInputChange('education', 'startDate', e.target.value, index)}
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block">End Date</Label>
                                        <Input
                                            type="date"
                                            value={edu.endDate}
                                            onChange={(e) => handleInputChange('education', 'endDate', e.target.value, index)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Skills */}
                    <div className="mb-8">
                        <Label className="text-lg font-semibold mb-3 block">Skills (comma-separated)</Label>
                        <Input
                            placeholder="JavaScript, React, Node.js, Python, etc."
                            onChange={handleSkillsChange}
                            className="w-full"
                        />
                    </div>

                    {/* Projects */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Projects</h2>
                            <Button onClick={() => addItem('projects')} variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" /> Add Project
                            </Button>
                        </div>
                        {formData.projects.map((project, index) => (
                            <div key={index} className="border rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold">Project {index + 1}</h3>
                                    {formData.projects.length > 1 && (
                                        <Button onClick={() => removeItem('projects', index)} variant="ghost" size="sm">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="mb-2 block">Project Name</Label>
                                        <Input
                                            value={project.name}
                                            onChange={(e) => handleInputChange('projects', 'name', e.target.value, index)}
                                            placeholder="Project Name"
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block">Technologies</Label>
                                        <Input
                                            value={project.technologies}
                                            onChange={(e) => handleInputChange('projects', 'technologies', e.target.value, index)}
                                            placeholder="React, Node.js, MongoDB"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label className="mb-2 block">Description</Label>
                                        <Textarea
                                            value={project.description}
                                            onChange={(e) => handleInputChange('projects', 'description', e.target.value, index)}
                                            placeholder="Describe your project..."
                                            rows={2}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label className="mb-2 block">Link (optional)</Label>
                                        <Input
                                            value={project.link}
                                            onChange={(e) => handleInputChange('projects', 'link', e.target.value, index)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Certifications */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Certifications</h2>
                            <Button onClick={() => addItem('certifications')} variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" /> Add Certification
                            </Button>
                        </div>
                        {formData.certifications.map((cert, index) => (
                            <div key={index} className="border rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold">Certification {index + 1}</h3>
                                    {formData.certifications.length > 1 && (
                                        <Button onClick={() => removeItem('certifications', index)} variant="ghost" size="sm">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="mb-2 block">Certification Name</Label>
                                        <Input
                                            value={cert.name}
                                            onChange={(e) => handleInputChange('certifications', 'name', e.target.value, index)}
                                            placeholder="AWS Certified Developer"
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block">Issuer</Label>
                                        <Input
                                            value={cert.issuer}
                                            onChange={(e) => handleInputChange('certifications', 'issuer', e.target.value, index)}
                                            placeholder="Amazon Web Services"
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block">Date</Label>
                                        <Input
                                            type="date"
                                            value={cert.date}
                                            onChange={(e) => handleInputChange('certifications', 'date', e.target.value, index)}
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block">Link (optional)</Label>
                                        <Input
                                            value={cert.link}
                                            onChange={(e) => handleInputChange('certifications', 'link', e.target.value, index)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Generate Button */}
                    <div className="flex justify-center gap-4 mt-8">
                        <Button
                            onClick={generateResume}
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="h-5 w-5 mr-2" />
                                    Generate & Download Resume
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ResumeBuilder;

