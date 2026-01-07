import puppeteer from 'puppeteer';

// Resume template generators
const generateModernTemplate = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.2; 
                color: #333;
                background: #fff;
            }
            .container { 
                max-width: 210mm; 
                width: 210mm;
                height: 297mm;
                margin: 0 auto; 
                padding: 10mm 12mm; 
                background: white;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .header { 
                background: linear-gradient(135deg, #6A38C2 0%, #9333EA 100%);
                color: white; 
                padding: 10px; 
                border-radius: 4px;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .profile-picture {
                width: 65px;
                height: 65px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid rgba(255,255,255,0.3);
                flex-shrink: 0;
            }
            .header-content {
                flex: 1;
            }
            .header h1 { 
                font-size: 20px; 
                margin-bottom: 3px;
                font-weight: 700;
            }
            .header .contact { 
                font-size: 9px; 
                margin-top: 3px;
                opacity: 0.95;
            }
            .header .contact span { 
                margin-right: 10px; 
            }
            .section { 
                margin-bottom: 7px; 
            }
            .section-title { 
                font-size: 12px; 
                color: #6A38C2; 
                border-bottom: 1.5px solid #6A38C2; 
                padding-bottom: 3px; 
                margin-bottom: 5px;
                font-weight: 600;
            }
            .summary { 
                font-size: 10px; 
                line-height: 1.4; 
                color: #555;
                text-align: justify;
            }
            .item { 
                margin-bottom: 5px; 
                padding-left: 0;
            }
            .item-header { 
                display: flex; 
                justify-content: space-between; 
                align-items: baseline;
                margin-bottom: 3px;
            }
            .item-title { 
                font-size: 11px; 
                font-weight: 600; 
                color: #333;
            }
            .item-subtitle { 
                font-size: 10px; 
                color: #6A38C2; 
                font-weight: 500;
            }
            .item-date { 
                font-size: 9px; 
                color: #666; 
                font-style: italic;
            }
            .item-description { 
                font-size: 9px; 
                color: #555; 
                line-height: 1.3;
                margin-top: 3px;
            }
            .skills-list { 
                display: flex; 
                flex-wrap: wrap; 
                gap: 4px;
            }
            .skill-tag { 
                background: #f0f0f0; 
                padding: 3px 8px; 
                border-radius: 8px; 
                font-size: 9px;
                color: #333;
                border: 1px solid #ddd;
            }
            .link { 
                color: #6A38C2; 
                text-decoration: none; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                ${data.profilePicture ? `<img src="${data.profilePicture}" class="profile-picture" alt="Profile" />` : ''}
                <div class="header-content">
                    <h1>${data.personalInfo.fullName || 'Your Name'}</h1>
                    <div class="contact">
                        ${data.personalInfo.email ? `<span>✉ ${data.personalInfo.email}</span>` : ''}
                        ${data.personalInfo.phone ? `<span>📞 ${data.personalInfo.phone}</span>` : ''}
                        ${data.personalInfo.address ? `<span>📍 ${data.personalInfo.address}</span>` : ''}
                        ${data.personalInfo.linkedin ? `<span>🔗 <a href="${data.personalInfo.linkedin}" class="link" style="color: white;">LinkedIn</a></span>` : ''}
                        ${data.personalInfo.github ? `<span>💻 <a href="${data.personalInfo.github}" class="link" style="color: white;">GitHub</a></span>` : ''}
                    </div>
                </div>
            </div>

            ${data.summary ? `
            <div class="section">
                <div class="section-title">Professional Summary</div>
                <div class="summary">${data.summary}</div>
            </div>
            ` : ''}

            ${data.experience && data.experience.length > 0 && data.experience[0].company ? `
            <div class="section">
                <div class="section-title">Work Experience</div>
                ${data.experience.map(exp => `
                    <div class="item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${exp.position || 'Position'}</div>
                                <div class="item-subtitle">${exp.company || 'Company'}</div>
                            </div>
                            <div class="item-date">${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}</div>
                        </div>
                        ${exp.description ? `<div class="item-description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${data.education && data.education.length > 0 && data.education[0].institution ? `
            <div class="section">
                <div class="section-title">Education</div>
                ${data.education.map(edu => `
                    <div class="item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${edu.degree || 'Degree'} ${edu.field ? `in ${edu.field}` : ''}</div>
                                <div class="item-subtitle">${edu.institution || 'Institution'}</div>
                            </div>
                            <div class="item-date">${edu.startDate || ''} - ${edu.endDate || ''} ${edu.gpa ? `| GPA: ${edu.gpa}` : ''}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${data.skills && data.skills.length > 0 ? `
            <div class="section">
                <div class="section-title">Skills</div>
                <div class="skills-list">
                    ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            ` : ''}

            ${data.projects && data.projects.length > 0 && data.projects[0].name ? `
            <div class="section">
                <div class="section-title">Projects</div>
                ${data.projects.map(project => `
                    <div class="item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${project.name || 'Project Name'}</div>
                                ${project.technologies ? `<div style="font-size: 10px; color: #666; margin-top: 3px;">${project.technologies}</div>` : ''}
                            </div>
                            ${project.link ? `<div><a href="${project.link}" class="link">View Project</a></div>` : ''}
                        </div>
                        ${project.description ? `<div class="item-description">${project.description.replace(/\n/g, '<br>')}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${data.certifications && data.certifications.length > 0 && data.certifications[0].name ? `
            <div class="section">
                <div class="section-title">Certifications</div>
                ${data.certifications.map(cert => `
                    <div class="item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${cert.name || 'Certification'}</div>
                                <div class="item-subtitle">${cert.issuer || 'Issuer'}</div>
                            </div>
                            <div class="item-date">${cert.date || ''}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    </body>
    </html>
    `;
};

const generateClassicTemplate = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Times New Roman', serif; 
                line-height: 1.2; 
                color: #000;
                background: #fff;
            }
            .container { 
                max-width: 210mm; 
                width: 210mm;
                height: 297mm;
                margin: 0 auto; 
                padding: 10mm 12mm;
                background: white;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .header { 
                text-align: center; 
                border-bottom: 2px double #000; 
                padding-bottom: 8px; 
                margin-bottom: 8px;
            }
            .profile-picture {
                width: 70px;
                height: 70px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid #000;
                margin: 0 auto 8px;
                display: block;
            }
            .header h1 { 
                font-size: 20px; 
                margin-bottom: 4px;
                font-weight: bold;
                letter-spacing: 0.5px;
            }
            .header .contact { 
                font-size: 9px; 
                margin-top: 3px;
            }
            .header .contact span { 
                margin: 0 8px; 
            }
            .section { 
                margin-bottom: 7px; 
            }
            .section-title { 
                font-size: 12px; 
                font-weight: bold; 
                text-transform: uppercase; 
                letter-spacing: 0.5px;
                margin-bottom: 5px;
                border-bottom: 1px solid #000;
                padding-bottom: 3px;
            }
            .summary { 
                font-size: 10px; 
                line-height: 1.4; 
                text-align: justify;
            }
            .item { 
                margin-bottom: 5px; 
            }
            .item-header { 
                margin-bottom: 3px;
            }
            .item-title { 
                font-size: 11px; 
                font-weight: bold; 
            }
            .item-subtitle { 
                font-size: 10px; 
                font-style: italic;
            }
            .item-date { 
                font-size: 9px; 
                float: right;
            }
            .item-description { 
                font-size: 9px; 
                line-height: 1.3;
                margin-top: 3px;
                text-align: justify;
            }
            .skills-list { 
                font-size: 9px;
                line-height: 1.6;
            }
            .skill-tag { 
                display: inline-block;
                margin-right: 8px;
            }
            .clear { clear: both; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                ${data.profilePicture ? `<img src="${data.profilePicture}" class="profile-picture" alt="Profile" />` : ''}
                <h1>${data.personalInfo.fullName || 'Your Name'}</h1>
                <div class="contact">
                    ${data.personalInfo.email ? `<span>${data.personalInfo.email}</span>` : ''}
                    ${data.personalInfo.phone ? `<span>${data.personalInfo.phone}</span>` : ''}
                    ${data.personalInfo.address ? `<span>${data.personalInfo.address}</span>` : ''}
                </div>
            </div>

            ${data.summary ? `
            <div class="section">
                <div class="section-title">Professional Summary</div>
                <div class="summary">${data.summary}</div>
            </div>
            ` : ''}

            ${data.experience && data.experience.length > 0 && data.experience[0].company ? `
            <div class="section">
                <div class="section-title">Work Experience</div>
                ${data.experience.map(exp => `
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">${exp.position || 'Position'}</span>
                            <span class="item-date">${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}</span>
                            <div class="clear"></div>
                        </div>
                        <div class="item-subtitle">${exp.company || 'Company'}</div>
                        ${exp.description ? `<div class="item-description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${data.education && data.education.length > 0 && data.education[0].institution ? `
            <div class="section">
                <div class="section-title">Education</div>
                ${data.education.map(edu => `
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">${edu.degree || 'Degree'} ${edu.field ? `in ${edu.field}` : ''}</span>
                            <span class="item-date">${edu.startDate || ''} - ${edu.endDate || ''}</span>
                            <div class="clear"></div>
                        </div>
                        <div class="item-subtitle">${edu.institution || 'Institution'} ${edu.gpa ? `| GPA: ${edu.gpa}` : ''}</div>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${data.skills && data.skills.length > 0 ? `
            <div class="section">
                <div class="section-title">Skills</div>
                <div class="skills-list">
                    ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            ` : ''}
        </div>
    </body>
    </html>
    `;
};

const generateCreativeTemplate = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Arial', sans-serif; 
                line-height: 1.2; 
                color: #2c3e50;
                background: #fff;
            }
            .container { 
                max-width: 210mm; 
                width: 210mm;
                height: 297mm;
                margin: 0 auto; 
                padding: 10mm 12mm;
                background: linear-gradient(to bottom, #f8f9fa 0%, #fff 100%);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .header { 
                background: #2c3e50; 
                color: white; 
                padding: 10px;
                border-radius: 4px;
                margin-bottom: 8px;
                position: relative;
                overflow: hidden;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                width: 80px;
                height: 80px;
                background: rgba(255,255,255,0.1);
                border-radius: 50%;
                transform: translate(30%, -30%);
            }
            .profile-picture {
                width: 65px;
                height: 65px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid rgba(255,255,255,0.3);
                flex-shrink: 0;
                position: relative;
                z-index: 1;
            }
            .header-content {
                flex: 1;
                position: relative;
                z-index: 1;
            }
            .header h1 { 
                font-size: 20px; 
                margin-bottom: 4px;
                font-weight: 800;
                position: relative;
                z-index: 1;
            }
            .header .contact { 
                font-size: 9px; 
                margin-top: 3px;
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                position: relative;
                z-index: 1;
            }
            .section { 
                margin-bottom: 7px;
                background: white;
                padding: 8px;
                border-radius: 3px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            .section-title { 
                font-size: 12px; 
                color: #e74c3c; 
                border-left: 2px solid #e74c3c;
                padding-left: 8px; 
                margin-bottom: 5px;
                font-weight: 700;
            }
            .summary { 
                font-size: 10px; 
                line-height: 1.4; 
                color: #34495e;
            }
            .item { 
                margin-bottom: 5px;
                padding-bottom: 5px;
                border-bottom: 1px dashed #ddd;
            }
            .item:last-child { border-bottom: none; }
            .item-header { 
                display: flex; 
                justify-content: space-between; 
                align-items: center;
                margin-bottom: 3px;
            }
            .item-title { 
                font-size: 11px; 
                font-weight: 700; 
                color: #2c3e50;
            }
            .item-subtitle { 
                font-size: 10px; 
                color: #e74c3c; 
                font-weight: 600;
                margin-top: 3px;
            }
            .item-date { 
                font-size: 9px; 
                color: #7f8c8d;
                background: #ecf0f1;
                padding: 3px 8px;
                border-radius: 8px;
            }
            .item-description { 
                font-size: 9px; 
                color: #555; 
                line-height: 1.3;
                margin-top: 3px;
            }
            .skills-list { 
                display: flex; 
                flex-wrap: wrap; 
                gap: 4px;
            }
            .skill-tag { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 3px 8px; 
                border-radius: 10px; 
                font-size: 9px;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                ${data.profilePicture ? `<img src="${data.profilePicture}" class="profile-picture" alt="Profile" />` : ''}
                <div class="header-content">
                    <h1>${data.personalInfo.fullName || 'Your Name'}</h1>
                    <div class="contact">
                        ${data.personalInfo.email ? `<span>📧 ${data.personalInfo.email}</span>` : ''}
                        ${data.personalInfo.phone ? `<span>📱 ${data.personalInfo.phone}</span>` : ''}
                        ${data.personalInfo.linkedin ? `<span>🔗 LinkedIn</span>` : ''}
                        ${data.personalInfo.github ? `<span>💻 GitHub</span>` : ''}
                    </div>
                </div>
            </div>

            ${data.summary ? `
            <div class="section">
                <div class="section-title">About Me</div>
                <div class="summary">${data.summary}</div>
            </div>
            ` : ''}

            ${data.experience && data.experience.length > 0 && data.experience[0].company ? `
            <div class="section">
                <div class="section-title">💼 Experience</div>
                ${data.experience.map(exp => `
                    <div class="item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${exp.position || 'Position'}</div>
                                <div class="item-subtitle">${exp.company || 'Company'}</div>
                            </div>
                            <div class="item-date">${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}</div>
                        </div>
                        ${exp.description ? `<div class="item-description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${data.education && data.education.length > 0 && data.education[0].institution ? `
            <div class="section">
                <div class="section-title">🎓 Education</div>
                ${data.education.map(edu => `
                    <div class="item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${edu.degree || 'Degree'} ${edu.field ? `- ${edu.field}` : ''}</div>
                                <div class="item-subtitle">${edu.institution || 'Institution'}</div>
                            </div>
                            <div class="item-date">${edu.startDate || ''} - ${edu.endDate || ''}</div>
                        </div>
                        ${edu.gpa ? `<div style="margin-top: 8px; font-size: 14px; color: #555;">GPA: ${edu.gpa}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${data.skills && data.skills.length > 0 ? `
            <div class="section">
                <div class="section-title">🚀 Skills</div>
                <div class="skills-list">
                    ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            ` : ''}

            ${data.projects && data.projects.length > 0 && data.projects[0].name ? `
            <div class="section">
                <div class="section-title">✨ Projects</div>
                ${data.projects.map(project => `
                    <div class="item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${project.name || 'Project Name'}</div>
                                ${project.technologies ? `<div style="font-size: 14px; color: #7f8c8d; margin-top: 5px;">${project.technologies}</div>` : ''}
                            </div>
                        </div>
                        ${project.description ? `<div class="item-description">${project.description.replace(/\n/g, '<br>')}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    </body>
    </html>
    `;
};

const generateProfessionalTemplate = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Calibri', 'Arial', sans-serif; 
                line-height: 1.2; 
                color: #2c3e50;
                background: #fff;
            }
            .container { 
                max-width: 210mm; 
                width: 210mm;
                height: 297mm;
                margin: 0 auto; 
                padding: 10mm 12mm;
                background: white;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .header { 
                border-bottom: 2px solid #3498db;
                padding-bottom: 8px;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .profile-picture {
                width: 65px;
                height: 65px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid #3498db;
                flex-shrink: 0;
            }
            .header-content {
                flex: 1;
            }
            .header h1 { 
                font-size: 20px; 
                color: #2c3e50;
                margin-bottom: 4px;
                font-weight: 600;
                letter-spacing: -0.5px;
            }
            .header .contact { 
                font-size: 9px; 
                color: #555;
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            .header .contact span { 
                border-right: 1px solid #ddd;
                padding-right: 10px;
            }
            .header .contact span:last-child { border-right: none; }
            .section { 
                margin-bottom: 7px; 
            }
            .section-title { 
                font-size: 12px; 
                color: #3498db; 
                border-bottom: 1.5px solid #3498db;
                padding-bottom: 3px; 
                margin-bottom: 5px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }
            .summary { 
                font-size: 10px; 
                line-height: 1.4; 
                color: #444;
                text-align: justify;
            }
            .item { 
                margin-bottom: 5px; 
                padding-left: 0;
            }
            .item-header { 
                display: flex; 
                justify-content: space-between; 
                align-items: baseline;
                margin-bottom: 3px;
            }
            .item-title { 
                font-size: 11px; 
                font-weight: 600; 
                color: #2c3e50;
            }
            .item-subtitle { 
                font-size: 10px; 
                color: #7f8c8d; 
                font-weight: 500;
            }
            .item-date { 
                font-size: 9px; 
                color: #95a5a6; 
                font-style: italic;
            }
            .item-description { 
                font-size: 9px; 
                color: #555; 
                line-height: 1.3;
                margin-top: 3px;
            }
            .skills-list { 
                display: flex; 
                flex-wrap: wrap; 
                gap: 4px;
            }
            .skill-tag { 
                background: #ecf0f1; 
                border: 1px solid #bdc3c7;
                padding: 3px 8px; 
                border-radius: 3px; 
                font-size: 9px;
                color: #2c3e50;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                ${data.profilePicture ? `<img src="${data.profilePicture}" class="profile-picture" alt="Profile" />` : ''}
                <div class="header-content">
                    <h1>${data.personalInfo.fullName || 'Your Name'}</h1>
                    <div class="contact">
                        ${data.personalInfo.email ? `<span>${data.personalInfo.email}</span>` : ''}
                        ${data.personalInfo.phone ? `<span>${data.personalInfo.phone}</span>` : ''}
                        ${data.personalInfo.address ? `<span>${data.personalInfo.address}</span>` : ''}
                        ${data.personalInfo.linkedin ? `<span>LinkedIn</span>` : ''}
                    </div>
                </div>
            </div>

            ${data.summary ? `
            <div class="section">
                <div class="section-title">Professional Summary</div>
                <div class="summary">${data.summary}</div>
            </div>
            ` : ''}

            ${data.experience && data.experience.length > 0 && data.experience[0].company ? `
            <div class="section">
                <div class="section-title">Professional Experience</div>
                ${data.experience.map(exp => `
                    <div class="item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${exp.position || 'Position'}</div>
                                <div class="item-subtitle">${exp.company || 'Company'}</div>
                            </div>
                            <div class="item-date">${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}</div>
                        </div>
                        ${exp.description ? `<div class="item-description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${data.education && data.education.length > 0 && data.education[0].institution ? `
            <div class="section">
                <div class="section-title">Education</div>
                ${data.education.map(edu => `
                    <div class="item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${edu.degree || 'Degree'} ${edu.field ? `in ${edu.field}` : ''}</div>
                                <div class="item-subtitle">${edu.institution || 'Institution'}</div>
                            </div>
                            <div class="item-date">${edu.startDate || ''} - ${edu.endDate || ''}</div>
                        </div>
                        ${edu.gpa ? `<div style="margin-top: 4px; font-size: 13px; color: #555;">GPA: ${edu.gpa}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${data.skills && data.skills.length > 0 ? `
            <div class="section">
                <div class="section-title">Core Competencies</div>
                <div class="skills-list">
                    ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            ` : ''}

            ${data.projects && data.projects.length > 0 && data.projects[0].name ? `
            <div class="section">
                <div class="section-title">Key Projects</div>
                ${data.projects.map(project => `
                    <div class="item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${project.name || 'Project Name'}</div>
                                ${project.technologies ? `<div class="item-subtitle">${project.technologies}</div>` : ''}
                            </div>
                        </div>
                        ${project.description ? `<div class="item-description">${project.description.replace(/\n/g, '<br>')}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    </body>
    </html>
    `;
};

const generateMinimalistTemplate = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Helvetica Neue', 'Arial', sans-serif; 
                line-height: 1.7; 
                color: #1a1a1a;
                background: #fff;
            }
            .container { 
                max-width: 210mm; 
                width: 210mm;
                height: 297mm;
                margin: 0 auto; 
                padding: 10mm 12mm;
                background: white;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .header { 
                text-align: center;
                margin-bottom: 8px;
                padding-bottom: 8px;
                border-bottom: 1px solid #e0e0e0;
            }
            .profile-picture {
                width: 70px;
                height: 70px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid #e0e0e0;
                margin: 0 auto 8px;
                display: block;
            }
            .header h1 { 
                font-size: 20px; 
                margin-bottom: 4px;
                font-weight: 300;
                letter-spacing: 0.5px;
                color: #1a1a1a;
            }
            .header .contact { 
                font-size: 9px; 
                color: #666;
                letter-spacing: 0.3px;
            }
            .header .contact span { 
                margin: 0 8px; 
            }
            .section { 
                margin-bottom: 7px; 
            }
            .section-title { 
                font-size: 12px; 
                color: #1a1a1a;
                letter-spacing: 1px;
                text-transform: uppercase;
                margin-bottom: 5px;
                font-weight: 500;
            }
            .summary { 
                font-size: 10px; 
                line-height: 1.4; 
                color: #444;
            }
            .item { 
                margin-bottom: 5px; 
            }
            .item-header { 
                margin-bottom: 3px;
            }
            .item-title { 
                font-size: 11px; 
                font-weight: 500; 
                color: #1a1a1a;
                margin-bottom: 3px;
            }
            .item-subtitle { 
                font-size: 10px; 
                color: #888; 
            }
            .item-date { 
                font-size: 9px; 
                color: #999;
                float: right;
            }
            .item-description { 
                font-size: 9px; 
                color: #555; 
                line-height: 1.3;
                margin-top: 3px;
            }
            .skills-list { 
                font-size: 9px;
                line-height: 1.6;
                color: #555;
            }
            .skill-tag { 
                display: inline-block;
                margin-right: 8px;
            }
            .clear { clear: both; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                ${data.profilePicture ? `<img src="${data.profilePicture}" class="profile-picture" alt="Profile" />` : ''}
                <h1>${data.personalInfo.fullName || 'Your Name'}</h1>
                <div class="contact">
                    ${data.personalInfo.email ? `<span>${data.personalInfo.email}</span>` : ''}
                    ${data.personalInfo.phone ? `<span>${data.personalInfo.phone}</span>` : ''}
                </div>
            </div>

            ${data.summary ? `
            <div class="section">
                <div class="section-title">About</div>
                <div class="summary">${data.summary}</div>
            </div>
            ` : ''}

            ${data.experience && data.experience.length > 0 && data.experience[0].company ? `
            <div class="section">
                <div class="section-title">Experience</div>
                ${data.experience.map(exp => `
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">${exp.position || 'Position'}</span>
                            <span class="item-date">${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}</span>
                            <div class="clear"></div>
                        </div>
                        <div class="item-subtitle">${exp.company || 'Company'}</div>
                        ${exp.description ? `<div class="item-description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${data.education && data.education.length > 0 && data.education[0].institution ? `
            <div class="section">
                <div class="section-title">Education</div>
                ${data.education.map(edu => `
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">${edu.degree || 'Degree'}</span>
                            <span class="item-date">${edu.startDate || ''} - ${edu.endDate || ''}</span>
                            <div class="clear"></div>
                        </div>
                        <div class="item-subtitle">${edu.institution || 'Institution'}</div>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${data.skills && data.skills.length > 0 ? `
            <div class="section">
                <div class="section-title">Skills</div>
                <div class="skills-list">
                    ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            ` : ''}
        </div>
    </body>
    </html>
    `;
};

const generateExecutiveTemplate = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Georgia', 'Times New Roman', serif; 
                line-height: 1.2; 
                color: #1a1a1a;
                background: #fff;
            }
            .container { 
                max-width: 210mm; 
                width: 210mm;
                height: 297mm;
                margin: 0 auto; 
                padding: 10mm 12mm;
                background: white;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .header { 
                background: #1a1a1a;
                color: #f5f5f5;
                padding: 10px;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .profile-picture {
                width: 65px;
                height: 65px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid rgba(245,245,245,0.3);
                flex-shrink: 0;
            }
            .header-content {
                flex: 1;
            }
            .header h1 { 
                font-size: 20px; 
                margin-bottom: 4px;
                font-weight: 400;
                letter-spacing: 0.5px;
            }
            .header .contact { 
                font-size: 9px; 
                color: #d0d0d0;
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            .header .contact span { 
                border-right: 1px solid #555;
                padding-right: 10px;
            }
            .header .contact span:last-child { border-right: none; }
            .section { 
                margin-bottom: 7px; 
            }
            .section-title { 
                font-size: 12px; 
                color: #1a1a1a;
                border-bottom: 2px double #1a1a1a;
                padding-bottom: 3px; 
                margin-bottom: 5px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .summary { 
                font-size: 10px; 
                line-height: 1.4; 
                color: #333;
                text-align: justify;
            }
            .item { 
                margin-bottom: 5px; 
            }
            .item-header { 
                display: flex; 
                justify-content: space-between; 
                align-items: baseline;
                margin-bottom: 3px;
            }
            .item-title { 
                font-size: 11px; 
                font-weight: 600; 
                color: #1a1a1a;
            }
            .item-subtitle { 
                font-size: 10px; 
                color: #666; 
                font-style: italic;
                margin-top: 3px;
            }
            .item-date { 
                font-size: 9px; 
                color: #888; 
                font-weight: 500;
            }
            .item-description { 
                font-size: 9px; 
                color: #444; 
                line-height: 1.3;
                margin-top: 3px;
                text-align: justify;
            }
            .skills-list { 
                display: flex; 
                flex-wrap: wrap; 
                gap: 4px;
            }
            .skill-tag { 
                background: #f5f5f5;
                border: 1px solid #ddd;
                padding: 3px 8px; 
                font-size: 9px;
                color: #333;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                ${data.profilePicture ? `<img src="${data.profilePicture}" class="profile-picture" alt="Profile" />` : ''}
                <div class="header-content">
                    <h1>${data.personalInfo.fullName || 'Your Name'}</h1>
                    <div class="contact">
                        ${data.personalInfo.email ? `<span>${data.personalInfo.email}</span>` : ''}
                        ${data.personalInfo.phone ? `<span>${data.personalInfo.phone}</span>` : ''}
                        ${data.personalInfo.address ? `<span>${data.personalInfo.address}</span>` : ''}
                        ${data.personalInfo.linkedin ? `<span>LinkedIn Profile</span>` : ''}
                    </div>
                </div>
            </div>

            ${data.summary ? `
            <div class="section">
                <div class="section-title">Executive Summary</div>
                <div class="summary">${data.summary}</div>
            </div>
            ` : ''}

            ${data.experience && data.experience.length > 0 && data.experience[0].company ? `
            <div class="section">
                <div class="section-title">Executive Experience</div>
                ${data.experience.map(exp => `
                    <div class="item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${exp.position || 'Position'}</div>
                                <div class="item-subtitle">${exp.company || 'Company'}</div>
                            </div>
                            <div class="item-date">${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}</div>
                        </div>
                        ${exp.description ? `<div class="item-description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${data.education && data.education.length > 0 && data.education[0].institution ? `
            <div class="section">
                <div class="section-title">Academic Credentials</div>
                ${data.education.map(edu => `
                    <div class="item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${edu.degree || 'Degree'} ${edu.field ? `in ${edu.field}` : ''}</div>
                                <div class="item-subtitle">${edu.institution || 'Institution'}</div>
                            </div>
                            <div class="item-date">${edu.startDate || ''} - ${edu.endDate || ''}</div>
                        </div>
                        ${edu.gpa ? `<div style="margin-top: 5px; font-size: 13px; color: #555;">GPA: ${edu.gpa}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${data.skills && data.skills.length > 0 ? `
            <div class="section">
                <div class="section-title">Core Expertise</div>
                <div class="skills-list">
                    ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            ` : ''}

            ${data.certifications && data.certifications.length > 0 && data.certifications[0].name ? `
            <div class="section">
                <div class="section-title">Professional Certifications</div>
                ${data.certifications.map(cert => `
                    <div class="item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${cert.name || 'Certification'}</div>
                                <div class="item-subtitle">${cert.issuer || 'Issuer'}</div>
                            </div>
                            <div class="item-date">${cert.date || ''}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    </body>
    </html>
    `;
};

export const generateResume = async (req, res) => {
    try {
        const { template, ...resumeData } = req.body;

        // Select template
        let htmlContent;
        switch (template) {
            case 'classic':
                htmlContent = generateClassicTemplate(resumeData);
                break;
            case 'creative':
                htmlContent = generateCreativeTemplate(resumeData);
                break;
            case 'professional':
                htmlContent = generateProfessionalTemplate(resumeData);
                break;
            case 'minimalist':
                htmlContent = generateMinimalistTemplate(resumeData);
                break;
            case 'executive':
                htmlContent = generateExecutiveTemplate(resumeData);
                break;
            case 'modern':
            default:
                htmlContent = generateModernTemplate(resumeData);
                break;
        }

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Set content and generate PDF
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm'
            }
        });

        await browser.close();

        // Set CORS headers explicitly (middleware might not apply to binary responses)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.setHeader('Access-Control-Allow-Origin', frontendUrl);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="resume.pdf"`);
        
        // Send PDF as response (pdf is already a Buffer from Puppeteer)
        res.status(200).send(pdf);
    } catch (error) {
        console.error('Error generating resume:', error);
        return res.status(500).json({
            message: 'Failed to generate resume',
            success: false
        });
    }
};

