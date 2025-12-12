import Modal from '../Modal'

interface CommunityGuidelinesProps {
  isOpen: boolean
  onClose: () => void
}

export default function CommunityGuidelines({ isOpen, onClose }: CommunityGuidelinesProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Community Guidelines">
      <div>
        <p>
          <strong>Last Updated: December 2025</strong>
        </p>

        <p>
          These Community Guidelines exist to keep Even a safe, respectful, and authentic space for
          everyone. All users must follow these rules. Violations may result in warnings, restrictions,
          or permanent removal from the platform.
        </p>

        <h3>1. Be Respectful</h3>
        <p>Treat others with kindness and basic respect. You may not:</p>
        <ul>
          <li>Insult, demean, or harass others</li>
          <li>Engage in discriminatory or hateful behavior</li>
          <li>Use slurs, threats, or hostile language</li>
          <li>Intentionally provoke, manipulate, or antagonize users</li>
        </ul>

        <h3>2. Authenticity & Honesty</h3>
        <p>Users must be real people presenting themselves honestly. You may not:</p>
        <ul>
          <li>Impersonate anyone</li>
          <li>Use fake photos, stolen media, or AI-generated likenesses of real people</li>
          <li>Misrepresent your age, identity, relationship status, or intentions</li>
          <li>Create multiple or deceptive accounts</li>
        </ul>

        <h3>3. Safe Communication</h3>
        <p>Keep conversations appropriate and consensual. You may not:</p>
        <ul>
          <li>Send unsolicited sexual messages or explicit images</li>
          <li>Pressure or coerce others into sharing personal content</li>
          <li>Engage in harassment, stalking, or intimidation</li>
          <li>Attempt to move users to unsafe platforms for harmful purposes</li>
        </ul>

        <h3>4. Appropriate Content</h3>
        <p>Profiles and messages must remain safe for the community. You may not:</p>
        <ul>
          <li>Upload explicit or pornographic images</li>
          <li>Share violent, graphic, or disturbing content</li>
          <li>Promote self-harm, substance abuse, or dangerous activities</li>
          <li>Post private information of yourself or others</li>
        </ul>

        <h3>5. No Illegal or Harmful Activity</h3>
        <p>You may not use Even for:</p>
        <ul>
          <li>Fraud, scams, or financial exploitation</li>
          <li>Selling products, services, or companionship</li>
          <li>Doxxing, hacking, or distributing malware</li>
          <li>Any activity prohibited by law in your region</li>
        </ul>

        <h3>6. In-Person Safety</h3>
        <p>If you choose to meet someone:</p>
        <ul>
          <li>Meet in public places</li>
          <li>Tell a friend where you're going</li>
          <li>Trust your instincts and leave if something feels off</li>
        </ul>
        <p>
          Even cannot verify the criminal history or intentions of users—exercise caution.
        </p>

        <h3>7. Respect Boundaries & Consent</h3>
        <p>All interactions must be voluntary and mutual. You may not:</p>
        <ul>
          <li>Continue messaging someone who asks you to stop</li>
          <li>Pressure others for dates, photos, or meetings</li>
          <li>Attempt to bypass blocks or restrictions</li>
        </ul>

        <h3>8. Underage Safety</h3>
        <p>Even is strictly for adults 18+. You may not:</p>
        <ul>
          <li>Create an account if under 18</li>
          <li>Post photos of minors alone</li>
          <li>Attempt to contact, solicit, or involve minors in any way</li>
        </ul>

        <h3>9. Reporting Problems</h3>
        <p>You should report:</p>
        <ul>
          <li>Fake or suspicious accounts</li>
          <li>Harassment, threats, or abusive behavior</li>
          <li>Underage users</li>
          <li>Safety risks, scams, or violations of these Guidelines</li>
        </ul>
        <p>
          Our team reviews reports and takes appropriate action.
        </p>

        <h3>10. Enforcement Actions</h3>
        <p>Even may:</p>
        <ul>
          <li>Issue warnings or temporary restrictions</li>
          <li>Remove content or photos</li>
          <li>Limit your visibility in discovery</li>
          <li>Suspend or permanently ban your account</li>
        </ul>
        <p>
          Repeated or severe violations result in immediate removal.
        </p>

        <h3>11. Appeals</h3>
        <p>
          If you believe an enforcement action was a mistake, you may request a review. Decisions
          made for user safety may not be reversible.
        </p>

        <h3>12. Evolving Guidelines</h3>
        <p>
          We may update these rules as the community grows. Staying on the platform means you
          agree to follow the most current version of these Guidelines.
        </p>

        <p>
          <strong>Help keep Even safe. Treat others with respect. Report misconduct when you see it.</strong>
        </p>

        <h3>13. Contact</h3>
        <p>
          If you have questions about these Community Guidelines, please contact us at:{' '}
          <a href="mailto:support@evendating.us">support@evendating.us</a>
        </p>
      </div>
    </Modal>
  )
}

