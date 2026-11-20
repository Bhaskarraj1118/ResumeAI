
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Sparkles,
  FileText,
  ScanSearch,
  Target,
  Menu,
  X,
  CheckCircle2,
  Zap,
  ShieldCheck,
  LayoutTemplate
} from 'lucide-react'

import ResumeBuilder from './ResumeBuilder'
import ATSChecker from './ATSChecker'
import JobMatcher from './JobMatcher'
import './App.css'

function App() {
  const [backend, setBackend] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/')
      .then(response => response.json())
      .then(() => setBackend(true))
      .catch(() => setBackend(false))
  }, [])

  const openPage = (page) => {
    setCurrentPage(page)
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }

  if (currentPage === 'builder') {
    return <ResumeBuilder onBack={() => openPage('home')} />
  }

  if (currentPage === 'ats') {
    return <ATSChecker onBack={() => openPage('home')} />
  }

  if (currentPage === 'matcher') {
    return <JobMatcher onBack={() => openPage('home')} />
  }

  const features = [
    {
      icon: FileText,
      title: 'AI Resume Builder',
      description: 'Create a professional resume with a clean design and live preview.',
      link: 'Build Resume',
      page: 'builder'
    },
    {
      icon: ScanSearch,
      title: 'ATS Score Checker',
      description: 'Check how well your resume performs with Applicant Tracking Systems.',
      link: 'Check ATS Score',
      page: 'ats'
    },
    {
      icon: Target,
      title: 'Job Description Matcher',
      description: 'Compare your resume with a job description and find missing keywords.',
      link: 'Match Job',
      page: 'matcher'
    }
  ]

  return (
    <div className="app">
      <nav className="navbar">
        <a href="#home" className="logo">
          <div className="logo-icon"><Sparkles size={22} /></div>
          <span>Resume<span className="logo-highlight">AI</span></span>
        </a>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <button className="nav-login" onClick={() => openPage('builder')}>Log in</button>
          <button className="nav-cta" onClick={() => openPage('builder')}>
            Get Started <ArrowRight size={16} />
          </button>
        </div>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={15} /> YOUR AI CAREER ASSISTANT
            </div>

            <h1>
              Build a Resume<br />
              That Gets You <span>Hired.</span>
            </h1>

            <p>
              Create professional resumes, check your ATS score,
              and match your skills with your dream job — all in one place.
            </p>

            <div className="hero-actions">
              <button className="primary-btn" onClick={() => openPage('builder')}>
                Build My Resume <ArrowRight size={18} />
              </button>
              <a href="#features" className="secondary-btn">Explore Features</a>
            </div>

            <div className="hero-trust">
              <span><CheckCircle2 size={16} /> Easy to use</span>
              <span><CheckCircle2 size={16} /> Professional templates</span>
              <span><CheckCircle2 size={16} /> Free to start</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="resume-demo">
              <div className="demo-top">
                <div className="demo-dots"><i /><i /><i /></div>
                <span>Resume Preview</span>
                <FileText size={17} />
              </div>

              <div className="demo-content">
                <div className="demo-profile">
                  <div className="demo-avatar">JD</div>
                  <div>
                    <h3>John Doe</h3>
                    <p>Software Developer</p>
                  </div>
                </div>

                <div className="demo-line long" />
                <div className="demo-line medium" />
                <h4>PROFESSIONAL SUMMARY</h4>
                <div className="demo-line long" />
                <div className="demo-line long" />
                <div className="demo-line short" />
                <h4>SKILLS</h4>
                <div className="demo-tags">
                  <span>React</span><span>Python</span><span>JavaScript</span>
                </div>
                <h4>EXPERIENCE</h4>
                <div className="demo-line long" />
                <div className="demo-line medium" />
                <div className="demo-line long" />
              </div>
            </div>

            <div className="score-card">
              <div className="score-icon"><Zap size={20} /></div>
              <div>
                <strong>85%</strong>
                <span>Resume Score</span>
              </div>
              <CheckCircle2 className="score-check" size={22} />
            </div>

            <div className="floating-card">
              <ShieldCheck size={20} />
              <span>ATS Friendly</span>
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <span>WHAT WE OFFER</span>
            <h2>Everything You Need to <strong>Stand Out</strong></h2>
            <p>Powerful tools to help you create a resume that makes an impact.</p>
          </div>

          <div className="features-grid">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <div className="feature-card" key={feature.title}>
                  <div className="feature-icon"><Icon size={25} /></div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <button
                    className="feature-link"
                    onClick={() => openPage(feature.page)}
                  >
                    {feature.link} <ArrowRight size={16} />
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="section-heading">
            <span>SIMPLE PROCESS</span>
            <h2>Get Started in <strong>3 Easy Steps</strong></h2>
            <p>Your next opportunity is closer than you think.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <LayoutTemplate size={27} />
              <h3>Enter Your Details</h3>
              <p>Add your education, skills, experience and projects.</p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <Sparkles size={27} />
              <h3>Build Your Resume</h3>
              <p>Create a professional resume with a live preview.</p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <FileText size={27} />
              <h3>Download & Apply</h3>
              <p>Prepare your resume and get ready for your next opportunity.</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div>
            <span>READY TO GET HIRED?</span>
            <h2>Your Career Journey Starts Here.</h2>
            <p>Create your professional resume today.</p>
          </div>
          <button className="primary-btn" onClick={() => openPage('builder')}>
            Get Started <ArrowRight size={18} />
          </button>
        </section>
      </main>

      <footer className="footer">
        <a href="#home" className="logo">
          <div className="logo-icon"><Sparkles size={20} /></div>
          <span>Resume<span className="logo-highlight">AI</span></span>
        </a>

        <p>Build your future, one resume at a time.</p>

        <div className="footer-status">
          <span className={`status-dot ${backend ? 'online' : ''}`} />
          Backend {backend ? 'Connected' : 'Disconnected'}
        </div>

        <div className="footer-bottom">
          © 2026 ResumeAI. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App
