import { useState, FormEvent } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GlobalBackground from '../components/GlobalBackground'
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
import './Suggestions.css'

function Suggestions() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    suggestion: '',
    csrfToken: generateCSRFToken(),
  })
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [rateLimiter] = useState(() => new RateLimiter('suggestions-form-rate-limit'))

  const suggestionCategories = [
    { value: '', label: 'Select a category' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'improvement', label: 'Improvement' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'ui', label: 'UI/UX Design' },
    { value: 'rating', label: 'Rating System' },
    { value: 'safety', label: 'Safety & Security' },
    { value: 'other', label: 'Other' },
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {}

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

    // Validate category
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    // Validate subject
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    } else if (!isValidSubject(formData.subject)) {
      newErrors.subject = 'Subject must be between 3 and 200 characters'
    }

    // Validate suggestion
    if (!formData.suggestion.trim()) {
      newErrors.suggestion = 'Suggestion is required'
    } else if (!isValidMessage(formData.suggestion)) {
      newErrors.suggestion = 'Suggestion must be between 10 and 5000 characters'
    } else if (containsSpamPatterns(formData.suggestion)) {
      newErrors.suggestion = 'Suggestion contains suspicious content. Please revise.'
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
        category: formData.category,
        subject: sanitizeInput(formData.subject),
        suggestion: sanitizeInput(formData.suggestion),
        csrfToken: formData.csrfToken,
      }

      // Simulate API call (replace with actual API endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In production, send to your backend:
      // const response = await fetch('/api/suggestions', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(sanitizedData),
      // })

      console.log('Suggestion submitted:', sanitizedData)

      setSubmitSuccess(true)
      setFormData({
        name: '',
        email: '',
        category: '',
        subject: '',
        suggestion: '',
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="suggestions-page">
      <GlobalBackground mode="dark" />
      <Header />

      <div className="content">
        <div className="page-header">
          <img src="/assets/Even-App-Logos/TransparentBG/EE-SolidWhite.png" alt="Even Dating Logo" className="logo-small" />
          <h1 className="page-title">Suggestions</h1>
          <p className="page-subtitle">Help us improve Even Dating</p>
        </div>

        {submitSuccess && (
          <div className="success-message" role="alert">
            ✓ Thank you! Your suggestion has been submitted successfully. We appreciate your feedback!
          </div>
        )}

        {errors.general && (
          <div className="error-message" role="alert">
            {errors.general}
          </div>
        )}

        <form className="suggestions-form" onSubmit={handleSubmit} noValidate>
          <FormInput
            id="suggestion-name"
            type="text"
            label="Your Name"
            value={formData.name}
            onChange={handleChange('name')}
            error={errors.name}
            required
            autoComplete="name"
            maxLength={100}
          />

          <FormInput
            id="suggestion-email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
            required
            autoComplete="email"
            maxLength={254}
          />

          <div className="form-group">
            <label htmlFor="suggestion-category" className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              id="suggestion-category"
              className={`form-select ${errors.category ? 'error' : ''}`}
              value={formData.category}
              onChange={handleChange('category')}
              required
            >
              {suggestionCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="form-error" role="alert">
                {errors.category}
              </span>
            )}
          </div>

          <FormInput
            id="suggestion-subject"
            type="text"
            label="Subject"
            value={formData.subject}
            onChange={handleChange('subject')}
            error={errors.subject}
            required
            maxLength={200}
          />

          <FormTextarea
            id="suggestion-text"
            label="Your Suggestion"
            value={formData.suggestion}
            onChange={handleChange('suggestion')}
            error={errors.suggestion}
            required
            maxLength={5000}
            rows={10}
            placeholder="Please describe your suggestion in detail. What would you like to see improved or added to Even Dating?"
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
              {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default Suggestions

