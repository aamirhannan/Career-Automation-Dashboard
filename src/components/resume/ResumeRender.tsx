
import React, { useEffect, useRef } from 'react';

// Types based on the provided JSON structure
export interface ResumeData {
    header: {
        fullName: string;
        contact: {
            email?: string;
            phone?: string;
            location?: string;
            links?: Record<string, string>;
        };
    };
    professionalSummary?: string;
    experience?: {
        role: string;
        company: string;
        duration: { start: string; end: string };
        location?: string;
        employmentType?: string;
        responsibilitiesAndAchievements?: string[];
        technologies?: string[];
    }[];
    technicalSkills?: Record<string, string[] | string>;
    education?: {
        degree: string;
        institution: string;
        duration: { start: string; end: string };
    };
    projects?: {
        title: string;
        links?: { live?: string; code?: string };
        description?: string[];
        technologyStack?: string[];
    }[];
}

interface ResumeRenderProps {
    data: ResumeData;
}

export default function ResumeRender({ data }: ResumeRenderProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Layout Normalizer logic ported from EJS script
    useEffect(() => {
        const normalizeLayout = () => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const TARGET_HEIGHT = 1030; // approx A4 height in pixels for print preview context
            const MIN_FONT_SIZE = 9;

            // Reset styles to default before calculation
            container.style.setProperty('--base-font-size', '11pt');
            container.style.setProperty('--line-height', '1.3');
            container.style.setProperty('--margin-bottom', '6pt');

            let currentFontSize = 11;

            // We need to check scrollHeight. 
            // Note: In strict React env, layout thrashing might happen, but for a preview it's acceptable.
            while (container.scrollHeight > TARGET_HEIGHT && currentFontSize > MIN_FONT_SIZE) {
                currentFontSize -= 0.2;
                container.style.setProperty('--base-font-size', `${currentFontSize}pt`);

                if (currentFontSize < 10) {
                    container.style.setProperty('--line-height', '1.2');
                    container.style.setProperty('--margin-bottom', '4pt');
                }
            }
            container.setAttribute('data-normalized', 'true');
        };

        // Run normalization
        normalizeLayout();

        // Optional: Re-run on window resize if needed, though mostly relevant for print logic
        // window.addEventListener('resize', normalizeLayout);
        // return () => window.removeEventListener('resize', normalizeLayout);
    }, [data]);

    if (!data) return <div className="p-4 text-center text-gray-500">No resume data provided</div>;

    const { header, professionalSummary, experience, technicalSkills, education, projects } = data;

    // Helper to format category names (camelCase to Title Case)
    const formatCategory = (str: string) => {
        return str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
    };

    return (
        <div className="resume-wrapper bg-white text-black">
            <style jsx global>{`
                /* Scoped styles for resume content to match EJS template */
                :root {
                    --base-font-size: 11pt;
                    --line-height: 1.3;
                    --margin-bottom: 6pt;
                }

                /* We use a class wrapper to emulate 'body' in the EJS context 
                   so it doesn't affect the entire React app */
                .resume-content {
                    font-family: 'Cambria', 'Georgia', 'Times New Roman', serif;
                    font-size: var(--base-font-size);
                    line-height: var(--line-height);
                    color: #000;
                    margin: 0;
                    padding: 0.5in; /* Margin from @page moved to padding here */
                    -webkit-font-smoothing: antialiased;
                    width: 100%;
                    max-width: 21cm; /* A4 Width */
                    min-height: 29.7cm; /* A4 Height */
                    box-sizing: border-box;
                    background: white;
                }

                .resume-content a {
                    color: #000;
                    text-decoration: none;
                }

                .resume-content .header {
                    text-align: center;
                    margin-bottom: 12pt;
                }

                .resume-content .name {
                    font-size: 24pt;
                    font-weight: normal;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-family: 'Times New Roman', serif;
                }

                .resume-content .contact-info {
                    font-size: 10pt;
                    margin-top: 4pt;
                }

                .resume-content .contact-separator {
                    margin: 0 4px;
                    font-size: 8pt;
                    vertical-align: middle;
                }

                .resume-content .section {
                    margin-bottom: 10pt;
                }

                .resume-content .section-header {
                    font-family: 'Times New Roman', serif;
                    font-size: 12pt;
                    font-weight: bold;
                    text-transform: uppercase;
                    border-bottom: 1px solid #000;
                    margin-bottom: 6pt;
                    padding-bottom: 2pt;
                }

                .resume-content .entry {
                    margin-bottom: 6pt;
                }

                .resume-content .entry-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                }

                .resume-content .entry-title {
                    font-weight: bold;
                    font-size: 11pt;
                }

                .resume-content .entry-date {
                    font-style: italic;
                    font-size: 10pt;
                    text-align: right;
                }

                .resume-content .entry-subtitle {
                    display: flex;
                    justify-content: space-between;
                    font-style: italic;
                    font-size: 10pt;
                    margin-bottom: 2pt;
                }

                .resume-content ul {
                    margin: 2pt 0 0 18pt;
                    padding: 0;
                    list-style-type: disc;
                }

                .resume-content li {
                    margin-bottom: 2pt;
                    text-align: justify;
                }

                .resume-content .skills-list {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }

                .resume-content .skill-category {
                    margin-bottom: 2pt;
                }

                .resume-content .skill-label {
                    font-weight: bold;
                }

                @media print {
                   .resume-content {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        padding: 0; /* Let page margins handle it */
                        margin: 0.5in;
                    }
                }
            `}</style>

            <div id="resume-container" className="resume-content" ref={containerRef}>
                {/* Header */}
                <div className="header">
                    <div className="name">
                        {header.fullName}
                    </div>
                    <div className="contact-info">
                        {header.contact.phone && (
                            <>
                                <span>{header.contact.phone}</span>
                                <span className="contact-separator">♦</span>
                            </>
                        )}
                        {header.contact.location && (
                            <>
                                <span>{header.contact.location}</span>
                                <span className="contact-separator">♦</span>
                            </>
                        )}
                        {header.contact.email && (
                            <>
                                <a
                                    style={{ fontWeight: 'normal', fontSize: '9pt', color: '#0000EE' }}
                                    target="_blank"
                                    href={`mailto:${header.contact.email}`}
                                    rel="noreferrer"
                                >
                                    {header.contact.email}
                                </a>
                            </>
                        )}
                        {header.contact.links && Object.entries(header.contact.links).map(([key, value]) => (
                            <React.Fragment key={key}>
                                <span className="contact-separator">♦</span>
                                <a
                                    style={{ fontWeight: 'normal', fontSize: '9pt', color: '#0000EE' }}
                                    target="_blank"
                                    href={value}
                                    rel="noreferrer"
                                >
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </a>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Professional Summary */}
                {professionalSummary && (
                    <div className="section">
                        <div className="section-header">Professional Summary</div>
                        <div style={{ textAlign: 'justify' }}>
                            {professionalSummary}
                        </div>
                    </div>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <div className="section">
                        <div className="section-header">Experience</div>
                        {experience.map((job, index) => (
                            <div className="entry" key={index}>
                                <div className="entry-header">
                                    <span className="entry-title">
                                        {job.role}
                                    </span>
                                    <span className="entry-date">
                                        {job.duration.start} – {job.duration.end}
                                    </span>
                                </div>
                                <div className="entry-subtitle">
                                    <span>
                                        {job.company}
                                    </span>
                                    <span>
                                        {job.location && <>{job.location}</>}
                                        {job.location && job.employmentType && <>, </>}
                                        {job.employmentType && <em>{job.employmentType.toLowerCase()}</em>}
                                    </span>
                                </div>
                                {job.responsibilitiesAndAchievements && (
                                    <ul>
                                        {job.responsibilitiesAndAchievements.map((bullet, i) => (
                                            <li key={i} dangerouslySetInnerHTML={{ __html: bullet }}></li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Technical Skills */}
                {technicalSkills && Object.keys(technicalSkills).length > 0 && (
                    <div className="section">
                        <div className="section-header">Technical Skills</div>
                        <ul className="skills-list">
                            {Object.entries(technicalSkills).map(([category, skills]) => (
                                <li className="skill-category" key={category}>
                                    <span className="skill-label">
                                        {formatCategory(category)}:
                                    </span>
                                    <span>{' '}
                                        {Array.isArray(skills) ? skills.join(', ') : skills}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Education */}
                {education && (
                    <div className="section">
                        <div className="section-header">Education</div>
                        <div className="entry">
                            <div className="entry-header">
                                <span className="entry-title">{education.degree}</span>
                                <span className="entry-date">
                                    {education.duration.start} – {education.duration.end}
                                </span>
                            </div>
                            <div className="entry-subtitle">
                                <span>{education.institution}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <div className="section">
                        <div className="section-header">Projects</div>
                        {projects.map((project, index) => (
                            <div className="entry" key={index}>
                                <div className="entry-header">
                                    <span className="entry-title">
                                        {project.title}
                                        {project.links && project.links.live && (
                                            <>
                                                {' '}
                                                <a
                                                    target="_blank"
                                                    href={project.links.live}
                                                    style={{ fontWeight: 'normal', fontSize: '9pt', color: '#0000EE' }}
                                                    rel="noreferrer"
                                                >
                                                    [View]
                                                </a>
                                            </>
                                        )}
                                    </span>
                                    <span>{/* Optional Project Date */}</span>
                                </div>
                                {project.description && (
                                    <ul>
                                        {project.description.map((bullet, i) => (
                                            <li key={i} dangerouslySetInnerHTML={{ __html: bullet }}></li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
