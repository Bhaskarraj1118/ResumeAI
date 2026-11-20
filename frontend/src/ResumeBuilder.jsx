
import { useState } from 'react'
import {
  ArrowLeft,
  User,
  GraduationCap,
  Briefcase,
  Code2,
  FolderGit2,
  Plus,
  Trash2,
  Download,
  Mail,
  Phone,
  MapPin,
  Globe,
  Eye
} from 'lucide-react'

const initialForm = {
  name: '',
  title: 'Aspiring Software Developer',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  portfolio: '',
  summary: '',
  skills: '',
  education: [{ degree: '', institution: '', year: '', grade: '' }],
  experience: [{ role: '', company: '', duration: '', description: '' }],
  projects: [{ name: '', technologies: '', description: '', link: '' }]
}

function ResumeBuilder({ onBack }) {
  const [form, setForm] = useState(initialForm)

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const updateItem = (section, index, field, value) => {
    setForm(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const addItem = (section, item) => {
    setForm(prev => ({
      ...prev,
      [section]: [...prev[section], item]
    }))
  }

  const removeItem = (section, index) => {
    setForm(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }))
  }

  const downloadPDF = () => {
    window.print()
  }

  return (
    <div className="builder-container">

      <div className="builder-heading">
        <button
          type="button"
          className="builder-back-btn"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div>
          <h1>Resume Builder</h1>
          <p>Create your professional resume with a live preview.</p>
        </div>
      </div>

      <div className="builder-layout">

        {/* FORM */}

        <div className="builder-form">

          <section className="builder-section">
            <div className="builder-section-heading">
              <User size={20} />
              <h2>Personal Information</h2>
            </div>

            <div className="builder-fields">

              <div className="builder-field">
                <label>Full Name</label>
                <input
                  value={form.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="builder-field">
                <label>Professional Title</label>
                <input
                  value={form.title}
                  onChange={e => updateField('title', e.target.value)}
                  placeholder="Aspiring Software Developer"
                />
              </div>

              <div className="builder-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div className="builder-field">
                <label>Phone Number</label>
                <input
                  value={form.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="builder-field">
                <label>Location</label>
                <input
                  value={form.location}
                  onChange={e => updateField('location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>

              <div className="builder-field">
                <label>LinkedIn URL</label>
                <input
                  value={form.linkedin}
                  onChange={e => updateField('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/username"
                />
              </div>

              <div className="builder-field">
                <label>GitHub URL</label>
                <input
                  value={form.github}
                  onChange={e => updateField('github', e.target.value)}
                  placeholder="github.com/username"
                />
              </div>

              <div className="builder-field">
                <label>Portfolio URL</label>
                <input
                  value={form.portfolio}
                  onChange={e => updateField('portfolio', e.target.value)}
                  placeholder="yourportfolio.com"
                />
              </div>

              <div className="builder-field builder-full">
                <label>Professional Summary</label>
                <textarea
                  value={form.summary}
                  onChange={e => updateField('summary', e.target.value)}
                  placeholder="Write a short professional summary..."
                  rows="3"
                />
              </div>

            </div>
          </section>

          {/* EDUCATION */}

          <section className="builder-section">
            <div className="builder-section-heading">
              <GraduationCap size={20} />
              <h2>Education</h2>
            </div>

            {form.education.map((item, index) => (
              <div className="builder-repeat-card" key={index}>

                <button
                  type="button"
                  className="builder-delete-btn"
                  onClick={() => removeItem('education', index)}
                >
                  <Trash2 size={17} />
                </button>

                <div className="builder-fields">

                  <div className="builder-field">
                    <label>Degree</label>
                    <input
                      value={item.degree}
                      onChange={e => updateItem('education', index, 'degree', e.target.value)}
                      placeholder="B.Tech Computer Science"
                    />
                  </div>

                  <div className="builder-field">
                    <label>Institution</label>
                    <input
                      value={item.institution}
                      onChange={e => updateItem('education', index, 'institution', e.target.value)}
                      placeholder="University / College"
                    />
                  </div>

                  <div className="builder-field">
                    <label>Year</label>
                    <input
                      value={item.year}
                      onChange={e => updateItem('education', index, 'year', e.target.value)}
                      placeholder="2023 - 2027"
                    />
                  </div>

                  <div className="builder-field">
                    <label>Grade / CGPA</label>
                    <input
                      value={item.grade}
                      onChange={e => updateItem('education', index, 'grade', e.target.value)}
                      placeholder="7.5 CGPA"
                    />
                  </div>

                </div>
              </div>
            ))}

            <button
              type="button"
              className="builder-add-btn"
              onClick={() => addItem('education', {
                degree: '',
                institution: '',
                year: '',
                grade: ''
              })}
            >
              <Plus size={17} /> Add Education
            </button>
          </section>

          {/* EXPERIENCE */}

          <section className="builder-section">
            <div className="builder-section-heading">
              <Briefcase size={20} />
              <h2>Work Experience</h2>
            </div>

            {form.experience.map((item, index) => (
              <div className="builder-repeat-card" key={index}>

                <button
                  type="button"
                  className="builder-delete-btn"
                  onClick={() => removeItem('experience', index)}
                >
                  <Trash2 size={17} />
                </button>

                <div className="builder-fields">

                  <div className="builder-field">
                    <label>Job Title</label>
                    <input
                      value={item.role}
                      onChange={e => updateItem('experience', index, 'role', e.target.value)}
                      placeholder="Frontend Developer"
                    />
                  </div>

                  <div className="builder-field">
                    <label>Company</label>
                    <input
                      value={item.company}
                      onChange={e => updateItem('experience', index, 'company', e.target.value)}
                      placeholder="Company Name"
                    />
                  </div>

                  <div className="builder-field builder-full">
                    <label>Duration</label>
                    <input
                      value={item.duration}
                      onChange={e => updateItem('experience', index, 'duration', e.target.value)}
                      placeholder="June 2025 - August 2025"
                    />
                  </div>

                  <div className="builder-field builder-full">
                    <label>Description</label>
                    <textarea
                      value={item.description}
                      onChange={e => updateItem('experience', index, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                      rows="3"
                    />
                  </div>

                </div>
              </div>
            ))}

            <button
              type="button"
              className="builder-add-btn"
              onClick={() => addItem('experience', {
                role: '',
                company: '',
                duration: '',
                description: ''
              })}
            >
              <Plus size={17} /> Add Experience
            </button>
          </section>

          {/* SKILLS */}

          <section className="builder-section">
            <div className="builder-section-heading">
              <Code2 size={20} />
              <h2>Technical Skills</h2>
            </div>

            <div className="builder-fields">
              <div className="builder-field builder-full">
                <label>Skills</label>
                <textarea
                  value={form.skills}
                  onChange={e => updateField('skills', e.target.value)}
                  placeholder="React, JavaScript, Python, HTML, CSS..."
                  rows="3"
                />
              </div>
            </div>
          </section>

          {/* PROJECTS */}

          <section className="builder-section">
            <div className="builder-section-heading">
              <FolderGit2 size={20} />
              <h2>Projects</h2>
            </div>

            {form.projects.map((item, index) => (
              <div className="builder-repeat-card" key={index}>

                <button
                  type="button"
                  className="builder-delete-btn"
                  onClick={() => removeItem('projects', index)}
                >
                  <Trash2 size={17} />
                </button>

                <div className="builder-fields">

                  <div className="builder-field">
                    <label>Project Name</label>
                    <input
                      value={item.name}
                      onChange={e => updateItem('projects', index, 'name', e.target.value)}
                      placeholder="Project Name"
                    />
                  </div>

                  <div className="builder-field">
                    <label>Technologies</label>
                    <input
                      value={item.technologies}
                      onChange={e => updateItem('projects', index, 'technologies', e.target.value)}
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>

                  <div className="builder-field builder-full">
                    <label>Project Link</label>
                    <input
                      value={item.link}
                      onChange={e => updateItem('projects', index, 'link', e.target.value)}
                      placeholder="https://github.com/username/project"
                    />
                  </div>

                  <div className="builder-field builder-full">
                    <label>Description</label>
                    <textarea
                      value={item.description}
                      onChange={e => updateItem('projects', index, 'description', e.target.value)}
                      placeholder="Describe your project..."
                      rows="3"
                    />
                  </div>

                </div>
              </div>
            ))}

            <button
              type="button"
              className="builder-add-btn"
              onClick={() => addItem('projects', {
                name: '',
                technologies: '',
                description: '',
                link: ''
              })}
            >
              <Plus size={17} /> Add Project
            </button>
          </section>

          <button
            type="button"
            className="builder-download-btn"
            onClick={downloadPDF}
          >
            <Download size={19} /> Download Resume PDF
          </button>

        </div>

        {/* LIVE PREVIEW */}

        <div className="builder-preview-container">

          <div className="builder-preview-heading">
            <Eye size={20} />
            <h2>Live Resume Preview</h2>
          </div>

          <div className="builder-paper-wrap">
            <div className="builder-preview" id="resume-preview">

              <div className="resume-header">
                <h1>{form.name || 'Your Name'}</h1>
                <h3>{form.title || 'Professional Title'}</h3>

                <div className="resume-contact">
                  {form.email && <span><Mail size={12} /> {form.email}</span>}
                  {form.phone && <span><Phone size={12} /> {form.phone}</span>}
                  {form.location && <span><MapPin size={12} /> {form.location}</span>}
                  {form.linkedin && <span><Globe size={12} /> {form.linkedin}</span>}
                  {form.github && <span><Globe size={12} /> {form.github}</span>}
                  {form.portfolio && <span><Globe size={12} /> {form.portfolio}</span>}
                </div>
              </div>

              {form.summary && (
                <div className="resume-block">
                  <h2>Professional Summary</h2>
                  <p>{form.summary}</p>
                </div>
              )}

              <div className="resume-block">
                <h2>Education</h2>
                {form.education.map((item, index) => (
                  <div className="resume-item" key={index}>
                    <div>
                      {item.degree && <strong>{item.degree}</strong>}
                      {item.institution && <p>{item.institution}</p>}
                    </div>
                    <div className="resume-item-right">
                      <span>{item.year}</span>
                      <span>{item.grade}</span>
                    </div>
                  </div>
                ))}
              </div>

              {form.skills && (
                <div className="resume-block">
                  <h2>Technical Skills</h2>
                  <p>{form.skills}</p>
                </div>
              )}

              {form.experience.some(item => item.role || item.company || item.description) && (
                <div className="resume-block">
                  <h2>Work Experience</h2>
                  {form.experience.map((item, index) => (
                    <div className="resume-item resume-item-column" key={index}>
                      <div className="resume-item-heading">
                        <strong>{item.role}</strong>
                        <span>{item.duration}</span>
                      </div>
                      <p>{item.company}</p>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {form.projects.some(item => item.name || item.description) && (
                <div className="resume-block">
                  <h2>Projects</h2>
                  {form.projects.map((item, index) => (
                    <div className="resume-item resume-item-column" key={index}>
                      <strong>{item.name}</strong>
                      {item.technologies && <p><b>Technologies:</b> {item.technologies}</p>}
                      <p>{item.description}</p>
                      {item.link && <p>{item.link}</p>}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      <style>{`
        .builder-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 11px 20px;
          margin-bottom: 22px;
          border: 1px solid rgba(168,85,247,.35);
          border-radius: 14px;
          background: linear-gradient(135deg,rgba(139,92,246,.16),rgba(59,130,246,.08));
          color: #d8b4fe;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all .3s ease;
        }

        .builder-back-btn:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg,#7c3aed,#6d28d9);
          color: white;
          box-shadow: 0 8px 25px rgba(124,58,237,.3);
        }

        .builder-paper-wrap {
          width: 100%;
          max-width: 100%;
          overflow-x: auto;
          padding: 8px;
          background: rgba(255,255,255,.025);
          border-radius: 12px;
        }

        .builder-preview {
          width: 100%;
          max-width: 794px;
          min-height: 1123px;
          margin: 0 auto;
          padding: 38px 42px;
          box-sizing: border-box;
          background: #fff !important;
          color: #273244 !important;
          border-radius: 3px;
          box-shadow: 0 8px 30px rgba(0,0,0,.2);
          font-family: Arial, sans-serif;
          overflow-wrap: anywhere;
        }

        .builder-preview * {
          box-sizing: border-box;
        }

        .builder-preview .resume-header {
          text-align: center;
          padding-bottom: 18px;
          border-bottom: 2px solid #7c3aed;
          margin-bottom: 20px;
        }

        .builder-preview .resume-header h1 {
          font-size: 27px;
          font-weight: 800;
          color: #172033 !important;
          margin: 0 0 6px;
          text-transform: uppercase;
        }

        .builder-preview .resume-header h3 {
          font-size: 14px;
          font-weight: 600;
          color: #6d28d9 !important;
          margin: 0 0 12px;
        }

        .builder-preview .resume-contact {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 7px 12px;
          font-size: 10px;
        }

        .builder-preview .resume-contact span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #475569 !important;
        }

        .builder-preview .resume-contact svg {
          color: #7c3aed !important;
          flex-shrink: 0;
        }

        .builder-preview .resume-block {
          margin-top: 19px;
          break-inside: avoid;
        }

        .builder-preview .resume-block h2 {
          font-size: 12px;
          font-weight: 800;
          color: #6d28d9 !important;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid #ddd6fe;
          padding-bottom: 5px;
          margin: 0 0 9px;
        }

        .builder-preview .resume-block p {
          color: #475569 !important;
          font-size: 11px;
          line-height: 1.55;
          margin: 3px 0;
          white-space: pre-wrap;
        }

        .builder-preview .resume-item {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 11px;
          font-size: 11px;
          break-inside: avoid;
        }

        .builder-preview .resume-item strong {
          color: #172033 !important;
          font-size: 11px;
        }

        .builder-preview .resume-item-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          color: #64748b !important;
          font-size: 10px;
          flex-shrink: 0;
        }

        .builder-preview .resume-item-column {
          display: block;
        }

        .builder-preview .resume-item-heading {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .builder-preview .resume-item-heading span {
          color: #64748b !important;
          font-size: 10px;
        }

        @media (max-width: 768px) {
          .builder-preview {
            padding: 25px 20px;
            min-height: 900px;
          }

          .builder-preview .resume-header h1 {
            font-size: 23px;
          }
        }

        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }

          body * {
            visibility: hidden !important;
          }

          #resume-preview,
          #resume-preview * {
            visibility: visible !important;
          }

          #resume-preview {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            min-height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }

          .builder-preview .resume-block,
          .builder-preview .resume-item {
            break-inside: avoid;
          }
        }
      `}</style>

    </div>
  )
}

export default ResumeBuilder
