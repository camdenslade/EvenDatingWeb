import { useState, FormEvent } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GlobalBackground from '../components/GlobalBackground'
import PrivacyPolicy from '../components/legal/PrivacyPolicy'
import CommunityGuidelines from '../components/legal/CommunityGuidelines'
import TermsOfService from '../components/legal/TermsOfService'
import CookiePolicy from '../components/legal/CookiePolicy'
import { FormInput, FormTextarea } from '../components/FormInput'
import { RateLimiter } from '../utils/rateLimiter'
import {
  sanitizeInput,
  isValidEmail,
  isValidName,
  isValidMessage,
  isValidSubject,
  containsSpamPatterns,
  generateCSRFToken,
} from '../utils/validation'
import { getApiBaseUrl, joinApiUrl } from '../utils/apiUrl'
import './Support.css'

function Support() {
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [openModal, setOpenModal] = useState<'privacy' | 'terms' | 'cookies' | 'guidelines' | null>(null)
  const [ticketFormData, setTicketFormData] = useState({
    name: '',
    email: '',
    category: '',
    priority: 'medium',
    subject: '',
    description: '',
    csrfToken: generateCSRFToken(),
  })
  const [ticketErrors, setTicketErrors] = useState<Partial<Record<string, string>>>({})
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false)
  const [ticketSuccess, setTicketSuccess] = useState(false)
  const [ticketRateLimiter] = useState(() => new RateLimiter('support-ticket-rate-limit'))

  const faqItems = [
    {
      question: 'How do I create an account?',
      answer: 'Click the "Create Account" button on the home page and follow the registration process. You\'ll need to provide basic information and verify your email address.'
    },
    {
      question: 'How does the matching system work?',
      answer: 'Our algorithm considers your preferences, location, and compatibility factors to suggest potential matches. You can also use the search feature to find people nearby.'
    },
    {
      question: 'Is my data safe and private?',
      answer: 'Yes, we take privacy seriously. Your data is encrypted and we never share your information with third parties. You can review our Privacy Policy for more details.'
    },
    {
      question: 'What is the Odd subscription?',
      answer: 'Odd is our premium subscription that gives you more control, visibility, and freedom. It includes advanced filters, unlimited likes, and priority support.'
    },
    {
      question: 'How do I report inappropriate behavior?',
      answer: 'You can report users directly from their profile or from within a conversation. Our safety team reviews all reports promptly and takes appropriate action.'
    },
    {
      question: 'Can I pause my account?',
      answer: 'Yes, you can pause your account from the Settings page. This will temporarily hide your profile while keeping all your data and matches intact.'
    }
  ]

  const ticketCategories = [
    { value: '', label: 'Select a category' },
    { value: 'account', label: 'Account Issues' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Subscription' },
    { value: 'safety', label: 'Safety & Reporting' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'other', label: 'Other' },
  ]

  const validateTicketForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!ticketFormData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (!isValidName(ticketFormData.name)) {
      newErrors.name = 'Please enter a valid name'
    }

    if (!ticketFormData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(ticketFormData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!ticketFormData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!ticketFormData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    } else if (!isValidSubject(ticketFormData.subject)) {
      newErrors.subject = 'Subject must be between 3 and 200 characters'
    }

    if (!ticketFormData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (!isValidMessage(ticketFormData.description)) {
      newErrors.description = 'Description must be between 10 and 5000 characters'
    } else if (containsSpamPatterns(ticketFormData.description)) {
      newErrors.description = 'Description contains suspicious content. Please revise.'
    }

    setTicketErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleTicketSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!ticketRateLimiter.canMakeRequest()) {
      const timeRemaining = ticketRateLimiter.getTimeRemaining()
      const minutes = Math.floor(timeRemaining / 60)
      const seconds = timeRemaining % 60
      setTicketErrors({
        general: `Too many requests. Please wait ${minutes}:${seconds.toString().padStart(2, '0')} before submitting again.`,
      })
      return
    }

    if (!validateTicketForm()) {
      return
    }

    setIsSubmittingTicket(true)
    setTicketErrors({})

    try {
      const sanitizedData = {
        name: sanitizeInput(ticketFormData.name),
        email: sanitizeInput(ticketFormData.email),
        category: ticketFormData.category,
        priority: ticketFormData.priority,
        subject: sanitizeInput(ticketFormData.subject),
        description: sanitizeInput(ticketFormData.description),
      }

      const apiBaseUrl = getApiBaseUrl()
      // Backend exposes POST /support for ticket creation (no /ticket suffix)
      const url = joinApiUrl(apiBaseUrl, '/support')
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to submit ticket' }))
        
        if (response.status === 429) {
          setTicketErrors({
            general: 'Too many requests. Please wait before submitting another ticket.',
          })
        } else if (response.status === 400) {
          // Validation errors from backend
          const backendErrors = errorData.message || errorData.errors || {}
          setTicketErrors({
            ...(typeof backendErrors === 'string' ? { general: backendErrors } : backendErrors),
          })
        } else {
          setTicketErrors({
            general: errorData.message || 'An error occurred. Please try again later.',
          })
        }
        return
      }

      // Success
      ticketRateLimiter.recordRequest()
      setTicketSuccess(true)
      setTicketFormData({
        name: '',
        email: '',
        category: '',
        priority: 'medium',
        subject: '',
        description: '',
        csrfToken: generateCSRFToken(),
      })

      setTimeout(() => {
        setTicketSuccess(false)
        setShowTicketForm(false)
      }, 5000)
    } catch (error) {
      setTicketErrors({
        general: error instanceof Error ? error.message : 'An error occurred. Please try again later.',
      })
    } finally {
      setIsSubmittingTicket(false)
    }
  }

  const handleTicketChange = (field: keyof typeof ticketFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setTicketFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
    if (ticketErrors[field]) {
      setTicketErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="support-page">
      <GlobalBackground mode="dark" />
      <Header />

      <div className="content">

        <div className="support-sections">
          <section className="ticket-section">
            <h2 className="section-title">Submit a Support Ticket</h2>
            {!showTicketForm ? (
              <div className="ticket-prompt">
                <p className="ticket-prompt-text">
                  Can't find what you're looking for? Submit a support ticket and we'll help you out.
                </p>
                <button
                  className="ticket-button"
                  onClick={() => setShowTicketForm(true)}
                >
                  Create Support Ticket
                </button>
                <p className="email-info">
                  Or email us directly at:{' '}
                  <a href="mailto:support@evendating.com" className="email-link">
                    support@evendating.com
                  </a>
                </p>
              </div>
            ) : (
              <div className="ticket-form-container">
                {ticketSuccess && (
                  <div className="success-message" role="alert">
                    ✓ Your support ticket has been submitted successfully! Ticket ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </div>
                )}
                {ticketErrors.general && (
                  <div className="error-message" role="alert">
                    {ticketErrors.general}
                  </div>
                )}
                <form className="ticket-form" onSubmit={handleTicketSubmit} noValidate>
                  <FormInput
                    id="ticket-name"
                    type="text"
                    label="Your Name"
                    value={ticketFormData.name}
                    onChange={handleTicketChange('name')}
                    error={ticketErrors.name}
                    required
                    autoComplete="name"
                    maxLength={100}
                  />

                  <FormInput
                    id="ticket-email"
                    type="email"
                    label="Email Address"
                    value={ticketFormData.email}
                    onChange={handleTicketChange('email')}
                    error={ticketErrors.email}
                    required
                    autoComplete="email"
                    maxLength={254}
                  />

                  <div className="form-group">
                    <label htmlFor="ticket-category" className="form-label">
                      Category <span className="required">*</span>
                    </label>
                    <select
                      id="ticket-category"
                      className={`form-select ${ticketErrors.category ? 'error' : ''}`}
                      value={ticketFormData.category}
                      onChange={handleTicketChange('category')}
                      required
                    >
                      {ticketCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    {ticketErrors.category && (
                      <span className="form-error" role="alert">
                        {ticketErrors.category}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="ticket-priority" className="form-label">
                      Priority
                    </label>
                    <select
                      id="ticket-priority"
                      className="form-select"
                      value={ticketFormData.priority}
                      onChange={handleTicketChange('priority')}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <FormInput
                    id="ticket-subject"
                    type="text"
                    label="Subject"
                    value={ticketFormData.subject}
                    onChange={handleTicketChange('subject')}
                    error={ticketErrors.subject}
                    required
                    maxLength={200}
                  />

                  <FormTextarea
                    id="ticket-description"
                    label="Description"
                    value={ticketFormData.description}
                    onChange={handleTicketChange('description')}
                    error={ticketErrors.description}
                    required
                    maxLength={5000}
                    rows={8}
                    placeholder="Please provide as much detail as possible about your issue..."
                  />

                  <input type="hidden" name="csrfToken" value={ticketFormData.csrfToken} />

                  <div className="form-footer">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => {
                        setShowTicketForm(false)
                        setTicketErrors({})
                        setTicketSuccess(false)
                      }}
                    >
                      Cancel
                    </button>
                    <div className="form-footer-right">
                      <p className="rate-limit-info">
                        {ticketRateLimiter.getRemainingRequests()} tickets remaining
                      </p>
                      <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmittingTicket}
                      >
                        {isSubmittingTicket ? 'Submitting...' : 'Submit Ticket'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </section>

          <section className="faq-section">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqItems.map((item, index) => (
                <div key={index} className="faq-item">
                  <h3 className="faq-question">{item.question}</h3>
                  <p className="faq-answer">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="resources-section">
            <h2 className="section-title">Resources</h2>
            <div className="resources-list">
              <button className="resource-link" onClick={() => setOpenModal('guidelines')}>
                <span>Community Guidelines</span>
              </button>
              <button className="resource-link" onClick={() => setOpenModal('privacy')}>
                <span>Privacy Policy</span>
              </button>
              <button className="resource-link" onClick={() => setOpenModal('terms')}>
                <span>Terms of Service</span>
              </button>
              <button className="resource-link" onClick={() => setOpenModal('cookies')}>
                <span>Cookie Policy</span>
              </button>
            </div>
          </section>
        </div>
      </div>
      <Footer />

      <PrivacyPolicy isOpen={openModal === 'privacy'} onClose={() => setOpenModal(null)} />
      <CommunityGuidelines isOpen={openModal === 'guidelines'} onClose={() => setOpenModal(null)} />
      <TermsOfService isOpen={openModal === 'terms'} onClose={() => setOpenModal(null)} />
      <CookiePolicy isOpen={openModal === 'cookies'} onClose={() => setOpenModal(null)} />
    </div>
  )
}

export default Support

