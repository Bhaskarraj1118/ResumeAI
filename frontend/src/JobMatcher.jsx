
import { useState } from 'react'
import {
  Upload, FileText, Sparkles, ArrowLeft,
  Target, CheckCircle2, AlertCircle,
  LoaderCircle, X, Briefcase
} from 'lucide-react'

function JobMatcher({ onBack }) {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = (selectedFile) => {
    setError('')
    setResult(null)

    if (!selectedFile) return

    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file only.')
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5 MB.')
      return
    }

    setFile(selectedFile)
  }

  const analyzeMatch = async () => {
    if (!file) {
      setError('Please upload your resume first.')
      return
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('job_description', jobDescription)

      const response = await fetch(
        'http://127.0.0.1:8000/api/job-match/',
        {
          method: 'POST',
          body: formData
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Job matching failed.')
      }

      setResult(data)
    } catch (err) {
      setError(err.message || 'Unable to connect to backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ats-page">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={17} /> Back to Home
      </button>

      <div className="ats-heading">
        <span>
          <Sparkles size={16} /> AI JOB MATCHER
        </span>

        <h1>Find Your <strong>Job Match</strong></h1>

        <p>
          Compare your resume with a job description and discover your compatibility.
        </p>
      </div>

      <div className="ats-container">
        <div className="ats-upload-card">
          <div className="ats-icon">
            <Target size={30} />
          </div>

          <h2>Match Your Resume</h2>

          <p>
            Upload your resume and paste the job description below.
          </p>

          <label className="ats-dropzone">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => handleFile(e.target.files?.[0])}
              hidden
            />

            <Upload size={35} />
            <strong>Click to upload your resume</strong>
            <span>PDF format only · Maximum 5 MB</span>
          </label>

          {file && (
            <div className="ats-file">
              <FileText size={21} />

              <div>
                <strong>{file.name}</strong>
                <span>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>

              <button
                onClick={() => {
                  setFile(null)
                  setResult(null)
                  setError('')
                }}
              >
                <X size={19} />
              </button>
            </div>
          )}

          <div className="form-group job-description-group">
            <label>
              <Briefcase size={17} /> Job Description
            </label>

            <textarea
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value)
                setResult(null)
              }}
              placeholder="Paste the complete job description here..."
              rows="8"
              maxLength={15000}
            />

            <span className="job-character-count">
              {jobDescription.length}/15000 characters
            </span>
          </div>

          {error && (
            <div className="ats-error">
              <AlertCircle size={17} />
              {error}
            </div>
          )}

          <button
            className="ats-analyze-btn"
            onClick={analyzeMatch}
            disabled={!file || !jobDescription.trim() || loading}
          >
            {loading ? (
              <>
                <LoaderCircle className="ats-spin" size={19} />
                Matching Resume...
              </>
            ) : (
              <>
                Check Job Match <Sparkles size={18} />
              </>
            )}
          </button>

          <div className="ats-security">
            <CheckCircle2 size={15} />
            Upload your PDF and enter a job description to compare.
          </div>
        </div>

        {result && (
          <div className="ats-results">
            <div className="ats-result-header">
              <span>ANALYSIS COMPLETE</span>
              <h2>Your Job Match Results</h2>
            </div>

            <div className="ats-score-card">
              <div className="ats-score-circle">
                <strong>{result.match_percentage}%</strong>
                <span>Job Match</span>
              </div>

              <div>
                <h3>
                  {result.match_percentage >= 80
                    ? 'Excellent Match!'
                    : result.match_percentage >= 50
                    ? 'Good Potential!'
                    : 'Needs Improvement'}
                </h3>

                <p>{result.message}</p>
              </div>
            </div>

            <div className="ats-result-grid">
              <div>
                <h3>
                  <CheckCircle2 size={18} /> Matching Skills
                </h3>

                {result.matching_skills?.length ? (
                  <div className="ats-tags">
                    {result.matching_skills.map(skill => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p>No matching skills detected.</p>
                )}
              </div>

              <div>
                <h3>
                  <AlertCircle size={18} /> Missing Skills
                </h3>

                {result.missing_skills?.length ? (
                  <div className="ats-tags missing">
                    {result.missing_skills.map(skill => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p>No missing recognized skills found.</p>
                )}
              </div>
            </div>

            <div className="ats-suggestions">
              <h3>
                <Sparkles size={18} /> Improvement Suggestions
              </h3>

              {result.suggestions?.map((suggestion, index) => (
                <p key={index}>
                  <CheckCircle2 size={16} />
                  {suggestion}
                </p>
              ))}
            </div>

            <div className="ats-suggestions">
              <h3>
                <FileText size={18} /> Resume Skills Detected
              </h3>

              {result.resume_skills?.length ? (
                <div className="ats-tags">
                  {result.resume_skills.map(skill => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              ) : (
                <p>No recognized skills detected in your resume.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobMatcher
