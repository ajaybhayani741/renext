import { useNavigate } from 'react-router-dom'

import '../landing.scss'
import configData from '../../../utils/config'
import pathName from '../../../routing/pathName.constant'
import illustration from '../../../assets/hostel_illustration.png'

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
)

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="M22 4L12 14.01l-3-3" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
)

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const PlusCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
)


function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">
      <div className="landing-bg-shapes" />

      <div className="landing-container">
        {/* HEADER */}
        <header className="landing-header">
          <div className="landing-brand">
            <img src={configData.logo} alt="HOST powered by RENEXT" />
          </div>
          <button className="landing-lang-btn" type="button">
            English <GlobeIcon />
          </button>
        </header>

        {/* HERO SECTION */}
        <main className="landing-hero">
          <div className="hero-content">
            <h1>
              Oversight that<br />
              <span>keeps hostels</span> safe.
            </h1>
            <p className="hero-subtitle">
              A single, living view of every hostel — authority, students,
              infrastructure, health and food — all in one place.
            </p>

            <div className="hero-features">
              <div className="feature-item">
                <div className="feat-icon"><ShieldCheckIcon /></div>
                <h3>Real-time<br/>Monitoring</h3>
                <p>Stay informed with live compliance tracking.</p>
              </div>
              <div className="feature-item">
                <div className="feat-icon"><DashboardIcon /></div>
                <h3>Welfare<br/>Dashboards</h3>
                <p>Unified insights across every module.</p>
              </div>
              <div className="feature-item">
                <div className="feat-icon"><SearchIcon /></div>
                <h3>Faster<br/>Inspections</h3>
                <p>Smarter checks,<br/>fewer blind spots.</p>
              </div>
            </div>

            <div className="hero-actions">
              <button 
                className="btn-proceed" 
                onClick={() => navigate(pathName.LOGIN)}
              >
                PROCEED TO LOGIN <ArrowRightIcon />
              </button>
              
              <div className="action-trust-badges">
                <span><CheckCircleIcon /> Secure Access</span>
                <span><CheckCircleIcon /> Role-based Login</span>
                <span><CheckCircleIcon /> Trusted by Authorities</span>
              </div>
            </div>
          </div>

          <div className="hero-illustration">
            <img className="main-illustration" src={illustration} alt="Hostel Illustration" />
            
            {/* Compliance Score Floating Card */}
            <div className="float-card c-score">
              <div className="c-title">Compliance Score</div>
              <div className="donut">92%</div>
            </div>

            {/* Health & Hygiene Floating Card */}
            <div className="float-card c-health">
              <div className="c-title">Health & Hygiene</div>
              <div className="icon"><PlusCircleIcon /></div>
              <div className="status">All Clear</div>
            </div>

            {/* Active Students Floating Card */}
            <div className="float-card c-students">
              <div className="c-title">Active Students</div>
              <div className="val"><UsersIcon /> 1,248</div>
              <div className="bars">
                <div style={{ height: '40%' }}></div>
                <div style={{ height: '60%' }}></div>
                <div style={{ height: '30%' }}></div>
                <div style={{ height: '80%' }}></div>
                <div style={{ height: '50%' }}></div>
                <div style={{ height: '100%' }}></div>
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER STATS */}
        <footer className="landing-footer">
          <div className="foot-left">
            <div className="shield-icon"><ShieldCheckIcon /></div>
            <p>Empowering authorities with transparency, accountability & trust.</p>
          </div>
          <div className="foot-stats">
            <div className="stat-item">
              <h2>2,500+</h2>
              <span>Hostels</span>
            </div>
            <div className="stat-item">
              <h2>1M+</h2>
              <span>Students</span>
            </div>
            <div className="stat-item">
              <h2>28+</h2>
              <span>States</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Landing
