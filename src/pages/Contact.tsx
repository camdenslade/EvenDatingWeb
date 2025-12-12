import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
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
import './Contact.css'

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
  general?: string
}

function Contact() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    csrfToken: generateCSRFToken(),
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [rateLimiter] = useState(() => new RateLimiter('contact-form-rate-limit'))

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (!isValidName(formData.name)) {
      newErrors.name = 'Please enter a valid name (2-100 characters, letters only)'
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Validate subject
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    } else if (!isValidSubject(formData.subject)) {
      newErrors.subject = 'Subject must be between 3 and 200 characters'
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (!isValidMessage(formData.message)) {
      newErrors.message = 'Message must be between 10 and 5000 characters'
    } else if (containsSpamPatterns(formData.message)) {
      newErrors.message = 'Message contains suspicious content. Please revise.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Check rate limiting
    if (!rateLimiter.canMakeRequest()) {
      const timeRemaining = rateLimiter.getTimeRemaining()
      const minutes = Math.floor(timeRemaining / 60)
      const seconds = timeRemaining % 60
      setErrors({
        general: `Too many requests. Please wait ${minutes}:${seconds.toString().padStart(2, '0')} before submitting again.`,
      })
      return
    }

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Sanitize all inputs
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        subject: sanitizeInput(formData.subject),
        message: sanitizeInput(formData.message),
        csrfToken: formData.csrfToken,
      }

      // Simulate API call (replace with actual API endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In production, send to your backend:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(sanitizedData),
      // })

      console.log('Form submitted:', sanitizedData)

      setSubmitSuccess(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        csrfToken: generateCSRFToken(),
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (error) {
      setErrors({
        general: 'An error occurred. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  return (
    <div className="contact-page">
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
          <button className="nav-link" onClick={() => navigate('/roadmap')}>
            Roadmap
          </button>
          <button className="nav-link" onClick={() => navigate('/support')}>
            Support
          </button>
        </div>
      </nav>

      <div className="content">
        <div className="page-header">
          <div className="logo-small">王</div>
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">We'd love to hear from you</p>
        </div>

        {submitSuccess && (
          <div className="success-message" role="alert">
            ✓ Thank you! Your message has been sent. We'll get back to you soon.
          </div>
        )}

        {errors.general && (
          <div className="error-message" role="alert">
            {errors.general}
          </div>
        )}

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <FormInput
            id="name"
            type="text"
            label="Name"
            value={formData.name}
            onChange={handleChange('name')}
            error={errors.name}
            required
            autoComplete="name"
            maxLength={100}
          />

          <FormInput
            id="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
            required
            autoComplete="email"
            maxLength={254}
          />

          <FormInput
            id="subject"
            type="text"
            label="Subject"
            value={formData.subject}
            onChange={handleChange('subject')}
            error={errors.subject}
            required
            maxLength={200}
          />

          <FormTextarea
            id="message"
            label="Message"
            value={formData.message}
            onChange={handleChange('message')}
            error={errors.message}
            required
            maxLength={5000}
            rows={6}
          />

          <input type="hidden" name="csrfToken" value={formData.csrfToken} />

          <div className="form-footer">
            <p className="rate-limit-info">
              {rateLimiter.getRemainingRequests()} submissions remaining
            </p>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Contact

