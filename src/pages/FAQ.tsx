import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GlobalBackground from '../components/GlobalBackground'
import './PageStyles.css'

interface FAQItem {
  question: string
  answer: string
}

function FAQ() {
  const navigate = useNavigate()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: 'How do I edit my profile?',
      answer:
        'Go to your Profile tab, then tap "Edit Profile" to update your photos, bio, and other information.',
    },
    {
      question: 'How do I change my preferences?',
      answer:
        'From your Profile, tap "Preferences" to adjust your matching criteria like age range and distance.',
    },
    {
      question: 'How does the review system work?',
      answer:
        'After exchanging messages with a match, you can leave a review rating them from 1-10. Reviews are private between you and your match, but your overall score appears on your profile. You get 3 reviews per week, with thoughtful rating ranges to ensure fair feedback.',
    },
    {
      question: 'How do I report someone?',
      answer:
        'Open their profile and tap the report button, or go to Settings > Safety to report a concern. Our team reviews all reports and takes appropriate action.',
    },
    {
      question: 'How do I block someone?',
      answer:
        'Open the user\'s profile and tap the block button. Blocked users cannot see your profile or contact you. You can manage blocked users in Settings > Blocked Users.',
    },
    {
      question: 'How do I delete my account?',
      answer:
        'Go to Settings > Delete Account. You can choose to keep your purchases or permanently delete everything. For detailed instructions, visit our Delete Account page.',
    },
    {
      question: 'What is the emergency review?',
      answer:
        'The emergency review is a one-time lifetime review you can use to report serious abuse or safety concerns outside of your normal weekly reviews. It\'s preserved permanently and helps protect the community.',
    },
    {
      question: 'How does the search feature work?',
      answer:
        'Premium users can search for people by first name within 25 miles. This helps you reconnect with someone special or find that person you\'ve been hoping to meet.',
    },
    {
      question: 'Why do I need to verify my school email?',
      answer:
        'School email verification helps ensure our community is made up of real college students. It also unlocks bonus features and helps build trust within the platform.',
    },
    {
      question: 'How are ratings calculated fairly?',
      answer:
        'Our intelligent system maintains balanced averages by automatically adjusting ratings to prevent bias. This ensures everyone gets a fair chance regardless of who rates them.',
    },
    {
      question: 'Can I see who liked me?',
      answer:
        'You\'ll know when you have a match! Both users need to like each other to create a match. We don\'t reveal who liked you before you\'ve matched to encourage genuine connections.',
    },
    {
      question: 'What happens if I unmatch someone?',
      answer:
        'When you unmatch, the conversation is deleted and you won\'t see each other in discovery anymore. Any reviews you\'ve exchanged remain on your profiles.',
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="page-container">
      <GlobalBackground mode="teal" />
      <Header />

      <div className="page-content">
        <div className="page-header">
          <img
            src="/assets/Even-App-Logos/TransparentBG/EE-SolidWhite.png"
            alt="Even Dating Logo"
            className="logo-small"
          />
          <h1 className="page-title">FAQ</h1>
          <p className="page-subtitle">Frequently asked questions</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>
                <span className={`faq-icon ${openIndex === index ? 'open' : ''}`}>+</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="content-card" style={{ textAlign: 'center' }}>
          <h2 className="card-title">Still have questions?</h2>
          <p className="card-text" style={{ marginBottom: '1.5rem' }}>
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="primary-button" onClick={() => navigate('/support')}>
              Contact Support
            </button>
            <button className="secondary-button" onClick={() => navigate('/suggestions')}>
              Send Feedback
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default FAQ
