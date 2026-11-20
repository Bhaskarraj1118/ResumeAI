
import { useState } from 'react'
import {
  Upload,
  FileText,
  ScanSearch,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowLeft,
  LoaderCircle,
  TrendingUp,
  BookOpen,
  Hash,
  Target,
  Award,
  Briefcase,
  Search,
  Check,
  AlertTriangle
} from 'lucide-react'
import './App.css'

const API_URL = 'http://127.0.0.1:8000/api'

function ATSChecker({ onBack }) {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [jobResult, setJobResult] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) return

    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file only.')
      setFile(null)
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5 MB.')
      setFile(null)
      return
    }

    setFile(selectedFile)
    setError('')
    setResult(null)
    setJobResult(null)
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload your resume first.')
      return
    }

    if (!jobDescription.trim()) {
      setError('Please paste a Job Description to continue.')
      return
    }

    if (jobDescription.trim().length < 30) {
      setError('Please enter a more detailed Job Description.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    setJobResult(null)

    try {
      const atsFormData = new FormData()
      atsFormData.append('resume', file)

      const atsResponse = await fetch(`${API_URL}/ats-check/`, {
        method: 'POST',
        body: atsFormData
      })

      const atsData = await atsResponse.json()

      if (!atsResponse.ok) {
        throw new Error(atsData.error || atsData.message || 'ATS analysis failed.')
      }

      setResult(atsData)

      const matchFormData = new FormData()
      matchFormData.append('resume', file)
      matchFormData.append('job_description', jobDescription.trim())

      const matchResponse = await fetch(`${API_URL}/job-match/`, {
        method: 'POST',
        body: matchFormData
      })

      const matchData = await matchResponse.json()

      if (!matchResponse.ok) {
        throw new Error(matchData.error || matchData.message || 'Job matching failed.')
      }

      setJobResult(matchData)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setResult(null)
    setJobResult(null)
    setError('')
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const getBreakdownItems = () => {
    if (!result?.score_breakdown) return []

    const breakdown = result.score_breakdown

    if (Array.isArray(breakdown)) {
      return breakdown.map((item, index) => ({
        name: item.name || item.category || item.label || `Category ${index + 1}`,
        score: Number(item.score ?? 0),
        max: Number(item.max_score ?? item.max ?? 0)
      }))
    }

    return Object.entries(breakdown).map(([name, value]) => {
      if (typeof value === 'object' && value !== null) {
        return {
          name,
          score: Number(value.score ?? 0),
          max: Number(value.max_score ?? value.max ?? 0)
        }
      }

      return {
        name,
        score: Number(value ?? 0),
        max: 0
      }
    })
  }

  const detectedSections = result?.detected_sections || []
  const sections = ['Experience', 'Education', 'Projects', 'Skills']

  const matchingSkills = jobResult?.matching_skills || []
  const missingSkills = jobResult?.missing_skills || []

  return (
    <div className="ats-page">
      <div className="ats-container">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={17} />
          Back to Home
        </button>

        <div className="ats-heading">
          <div className="ats-heading-icon">
            <ScanSearch size={25} />
          </div>

          <span className="ats-eyebrow">AI RESUME ANALYZER</span>

          <h1>
            Check Your <span>ATS Score</span>
          </h1>

          <p>
            Upload your resume and discover how well it performs against
            Applicant Tracking Systems and your target job.
          </p>
        </div>

        <div className="ats-upload-card">
          <div className="ats-card-heading">
            <div>
              <h2>Upload Your Resume</h2>
              <p>Upload your resume in PDF format to analyze it.</p>
            </div>
            <FileText size={25} />
          </div>

          <label className="ats-dropzone">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              hidden
            />

            <div className="ats-upload-icon">
              <Upload size={25} />
            </div>

            <strong>Click to upload your resume</strong>
            <span>PDF format only · Maximum 5 MB</span>
          </label>

          {file && (
            <div className="ats-file-preview">
              <div className="ats-file-info">
                <FileText size={22} />
                <div>
                  <strong>{file.name}</strong>
                  <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              </div>

              <button
                type="button"
                className="ats-remove-file"
                onClick={handleRemoveFile}
                aria-label="Remove resume"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="ats-jd-card">
          <div className="ats-card-heading">
            <div>
              <h2>
                <Briefcase size={21} />
                Job Description
              </h2>
              <p>
                Paste the job description to check how well your resume
                matches the role.
              </p>
            </div>
            <Target size={25} />
          </div>

          <textarea
            className="ats-jd-textarea"
            value={jobDescription}
            onChange={(event) => {
              setJobDescription(event.target.value)
              setError('')
              setJobResult(null)
            }}
            placeholder="Paste the complete job description here...

Example:
We are looking for a React Developer with knowledge of JavaScript, HTML, CSS, React, REST APIs, Git and problem-solving skills..."
            rows={8}
          />

          <div className="ats-jd-footer">
            <span>{jobDescription.trim().length} characters</span>
            <span>Minimum 30 characters</span>
          </div>
        </div>

        {error && (
          <div className="ats-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <button
          className="ats-analyze-btn"
          onClick={handleAnalyze}
          disabled={loading || !file || !jobDescription.trim()}
        >
          {loading ? (
            <>
              <LoaderCircle size={19} className="ats-spin" />
              Analyzing Your Resume...
            </>
          ) : (
            <>
              <Sparkles size={19} />
              Analyze My Resume
            </>
          )}
        </button>

        <p className="ats-upload-note">
          Your resume is analyzed for ATS compatibility and job-specific
          keyword matching.
        </p>

        {result && (
          <div className="ats-results">
            <div className="ats-result-header">
              <div className="ats-success-label">
                <CheckCircle2 size={17} />
                ANALYSIS COMPLETE
              </div>

              <h2>Your Resume Analysis</h2>
              <p>Detailed analysis of your resume structure and content.</p>
            </div>

            <div className="ats-score-card">
              <div
                className="ats-score-circle"
                style={{ '--score-color': getScoreColor(result.score ?? result.ats_score ?? 0) }}
              >
                <strong>{result.score ?? result.ats_score ?? 0}%</strong>
                <span>ATS Score</span>
              </div>

              <h3>{result.rating || 'Resume Analysis Complete'}</h3>
              <p>{result.message || 'Resume analyzed successfully.'}</p>
            </div>

            <div className="ats-result-grid">
              <div className="ats-stat-grid">
                <div className="ats-stat-card">
                  <Hash size={21} />
                  <strong>{result.word_count ?? 0}</strong>
                  <span>Total Words</span>
                </div>

                <div className="ats-stat-card">
                  <TrendingUp size={21} />
                  <strong>{result.detected_skills?.length ?? 0}</strong>
                  <span>Skills Detected</span>
                </div>

                <div className="ats-stat-card">
                  <BookOpen size={21} />
                  <strong>{detectedSections.length}/4</strong>
                  <span>Sections Found</span>
                </div>
              </div>
            </div>

            {getBreakdownItems().length > 0 && (
              <div className="ats-breakdown">
                <div className="ats-section-heading">
                  <h3>
                    <Target size={20} />
                    ATS Score Breakdown
                  </h3>
                  <span>Category-wise performance</span>
                </div>

                {getBreakdownItems().map((item, index) => {
                  const percentage = item.max > 0
                    ? Math.min((item.score / item.max) * 100, 100)
                    : 0

                  return (
                    <div className="ats-breakdown-item" key={`${item.name}-${index}`}>
                      <div className="ats-breakdown-top">
                        <div className="ats-breakdown-name">
                          <CheckCircle2 size={17} />
                          <strong>{item.name}</strong>
                        </div>
                        <span>
                          {item.score}/{item.max || item.score}
                        </span>
                      </div>

                      <div className="ats-progress-track">
                        <div
                          className="ats-progress-fill"
                          style={{
                            width: `${percentage}%`,
                            background: getScoreColor(percentage)
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="ats-sections-card">
              <h3>
                <BookOpen size={20} />
                Resume Sections Detected
              </h3>

              <div className="ats-section-tags">
                {sections.map((section) => {
                  const found = detectedSections.some(
                    (item) => item.toLowerCase() === section.toLowerCase()
                  )

                  return (
                    <span
                      key={section}
                      className={found ? 'found' : 'not-found'}
                    >
                      {found ? <Check size={15} /> : <AlertTriangle size={15} />}
                      {section}
                    </span>
                  )
                })}
              </div>
            </div>

            <div className="ats-result-card">
              <h3>
                <CheckCircle2 size={19} />
                Detected Skills
              </h3>

              <div className="ats-tags">
                {result.detected_skills?.length > 0 ? (
                  result.detected_skills.map((skill, index) => (
                    <span className="ats-tag-success" key={`${skill}-${index}`}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p>No skills detected.</p>
                )}
              </div>
            </div>

            <div className="ats-result-card">
              <h3>
                <AlertCircle size={19} />
                General Missing Keywords
              </h3>

              <div className="ats-tags">
                {result.missing_keywords?.length > 0 ? (
                  result.missing_keywords.map((keyword, index) => (
                    <span className="ats-tag-warning" key={`${keyword}-${index}`}>
                      {keyword}
                    </span>
                  ))
                ) : (
                  <p>No general missing keywords detected.</p>
                )}
              </div>

              <small>
                These are general library keywords, not job-specific requirements.
              </small>
            </div>

            {jobResult && (
              <div className="ats-job-results">
                <div className="ats-job-heading">
                  <span className="ats-success-label">
                    <Sparkles size={17} />
                    JOB DESCRIPTION ANALYSIS
                  </span>
                  <h2>Your Job Match Results</h2>
                  <p>
                    Resume keywords compared with your target job description.
                  </p>
                </div>

                <div className="ats-job-score">
                  <div>
                    <span>Job Match Score</span>
                    <strong>
                      {jobResult.match_percentage ?? 0}%
                    </strong>
                  </div>

                  <div className="ats-progress-track">
                    <div
                      className="ats-progress-fill"
                      style={{
                        width: `${Math.min(Number(jobResult.match_percentage) || 0, 100)}%`,
                        background: getScoreColor(Number(jobResult.match_percentage) || 0)
                      }}
                    />
                  </div>
                </div>

                <div className="ats-job-stat-grid">
                  <div>
                    <CheckCircle2 size={20} />
                    <strong>{matchingSkills.length}</strong>
                    <span>Matching Skills</span>
                  </div>

                  <div>
                    <AlertTriangle size={20} />
                    <strong>{missingSkills.length}</strong>
                    <span>Missing Skills</span>
                  </div>
                </div>

                <div className="ats-result-card">
                  <h3>
                    <CheckCircle2 size={19} />
                    Matching Job Skills
                  </h3>

                  <div className="ats-tags">
                    {matchingSkills.length > 0 ? (
                      matchingSkills.map((skill, index) => (
                        <span className="ats-tag-success" key={`${skill}-${index}`}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p>No matching skills found.</p>
                    )}
                  </div>
                </div>

                <div className="ats-result-card">
                  <h3>
                    <AlertTriangle size={19} />
                    Missing Job Skills
                  </h3>

                  <div className="ats-tags">
                    {missingSkills.length > 0 ? (
                      missingSkills.map((skill, index) => (
                        <span className="ats-tag-warning" key={`${skill}-${index}`}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p>Great! No missing skills detected.</p>
                    )}
                  </div>

                  <small>
                    Add a missing skill only if you genuinely have that skill
                    or relevant experience.
                  </small>
                </div>

                {jobResult.suggestions?.length > 0 && (
                  <div className="ats-suggestions">
                    <h3>
                      <Sparkles size={19} />
                      Job Match Suggestions
                    </h3>

                    {jobResult.suggestions.map((suggestion, index) => (
                      <div className="ats-suggestion-item" key={index}>
                        <CheckCircle2 size={17} />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {result.suggestions?.length > 0 && (
              <div className="ats-suggestions">
                <h3>
                  <Sparkles size={19} />
                  Improvement Suggestions
                </h3>

                {result.suggestions.map((suggestion, index) => (
                  <div className="ats-suggestion-item" key={index}>
                    <CheckCircle2 size={17} />
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="ats-disclaimer">
              <AlertCircle size={17} />
              <span>
                This is an estimated ATS compatibility score based on
                ResumeAI's analysis rules. Job match results are based on
                detected skills and keywords. Actual ATS results may vary
                between employers.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ATSChecker
