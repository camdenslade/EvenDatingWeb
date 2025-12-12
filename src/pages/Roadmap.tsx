import { useNavigate } from 'react-router-dom'
import './Roadmap.css'

function Roadmap() {
  const navigate = useNavigate()

  const roadmapItems = [
    {
      quarter: 'Q1 2024',
      status: 'completed',
      features: [
        'User authentication and profile creation',
        'Basic matching algorithm',
        'Messaging system',
        'Search functionality'
      ]
    },
    {
      quarter: 'Q2 2024',
      status: 'in-progress',
      features: [
        'Advanced filtering options',
        'Video call integration',
        'Safety features and reporting',
        'Premium subscription (Odd)'
      ]
    },
    {
      quarter: 'Q3 2024',
      status: 'planned',
      features: [
        'AI-powered match suggestions',
        'Event-based matching',
        'Group dating features',
        'Enhanced privacy controls'
      ]
    },
    {
      quarter: 'Q4 2024',
      status: 'planned',
      features: [
        'International expansion',
        'Mobile app optimization',
        'Social media integration',
        'Community features'
      ]
    }
  ]

  return (
    <div className="roadmap-page">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <nav className="page-nav">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <div className="nav-links">
          <button className="nav-link" onClick={() => navigate('/')}>
            Home
          </button>
          <button className="nav-link" onClick={() => navigate('/contact')}>
            Contact
          </button>
          <button className="nav-link" onClick={() => navigate('/support')}>
            Support
          </button>
        </div>
      </nav>

      <div className="content">
        <div className="page-header">
          <div className="logo-small">王</div>
          <h1 className="page-title">Roadmap</h1>
          <p className="page-subtitle">Our journey to build the best dating experience</p>
        </div>

        <div className="roadmap-container">
          {roadmapItems.map((item, index) => (
            <div key={index} className={`roadmap-item ${item.status}`}>
              <div className="roadmap-header">
                <h2 className="roadmap-quarter">{item.quarter}</h2>
                <span className={`status-badge ${item.status}`}>
                  {item.status === 'completed' ? '✓ Completed' : 
                   item.status === 'in-progress' ? '⟳ In Progress' : 
                   '○ Planned'}
                </span>
              </div>
              <ul className="features-list">
                {item.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="feature-item">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Roadmap

