import type { Metadata } from "next";
import Link from "next/link";
import { LegalContact, LegalDocument, type LegalSection } from "../legal-document";

export const metadata: Metadata = {
  title: "Privacy Policy | The Arch.",
  description: "How The Arch handles Google sign-in information, program applications, payments and your privacy choices.",
  alternates: { canonical: "https://www.thearch.global/privacy" },
};

const sections: readonly LegalSection[] = [
  {
    id: "about",
    title: "Who we are",
    content: (
      <>
        <p>The Arch is a China innovation immersion program for founders, builders, investors, executives and institutions. This policy explains how The Arch team ("we", "us" and "our") handles personal information through <Link href="/">www.thearch.global</Link>, including accounts, applications, program administration and payments.</p>
        <p>For privacy questions or requests about your information, contact <LegalContact />. Our <Link href="/terms">Terms of Service</Link> explain the conditions for using the website and participating in the program.</p>
      </>
    ),
  },
  {
    id: "google-sign-in",
    title: "Information from Google sign-in",
    content: (
      <>
        <p>When you choose "Continue with Google", Google shares your basic account information with our authentication provider, Supabase, so we can create or authenticate your The Arch account. This includes your Google account identifier, email address and email verification status, and basic profile details such as your name and profile picture, when available.</p>
        <p>We use this information to identify you, display your account profile, keep your session secure, and connect you to your applications, orders and payment confirmations. Account identifiers and profile information are stored with your authentication record in Supabase.</p>
        <p>We request only basic sign-in permissions: <strong>openid, email and profile</strong>. We do not receive your Google password or request access to Gmail messages, Google Drive files, Google Calendar or Google Contacts. We do not send email on your behalf through Google.</p>
        <p>We do not sell Google user data, use it for advertising, or use it to train AI models. Our handling of Google user data follows the <a href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</a>, including applicable Limited Use requirements.</p>
      </>
    ),
  },
  {
    id: "information-collected",
    title: "Other information we collect",
    content: (
      <ul>
        <li><strong>Applications:</strong> your name, preferred contact email, alternate contact details, selected program and weeks, background and goals, and any additional information you submit. Please share only information relevant to your application; do not include passwords or payment card details.</li>
        <li><strong>Program communications:</strong> enquiries, interview arrangements, application review records and information you provide when contacting our team or arranging participation.</li>
        <li><strong>Orders and payments:</strong> your selected pass, price, currency, transaction identifiers, payment status, and refund requests and records. Stripe processes checkout details; we do not collect card numbers or security codes in our application forms.</li>
        <li><strong>Referrals:</strong> the invite or discount code you use, its connection to your application, and related payment and commission records.</li>
        <li><strong>Technical information:</strong> authentication cookies and operational or security logs. Our hosting, authentication and payment providers may process IP addresses, browser information, request timestamps and error details when delivering their services.</li>
      </ul>
    ),
  },
  {
    id: "use-of-information",
    title: "How we use information",
    content: (
      <>
        <ul>
          <li>Create and secure your account and provide access to your records.</li>
          <li>Review applications, arrange interviews and communicate decisions.</li>
          <li>Coordinate participation, accommodation, visits and other confirmed program services.</li>
          <li>Process payments, reconcile orders and review refund requests.</li>
          <li>Attribute referrals and administer partner commissions.</li>
          <li>Respond to enquiries, investigate abuse, resolve disputes and meet legal or accounting obligations.</li>
        </ul>
        <p>Where applicable law requires a legal basis, we rely on providing the services you request, our legitimate interests in operating and securing those services, compliance with legal obligations, or your consent where required. If we propose a new use of Google user data, we will explain it and seek any required consent before that use begins.</p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who receives information",
    content: (
      <>
        <p>We share information as needed for the purposes described in this policy:</p>
        <ul>
          <li><strong>Supabase</strong> provides authentication and database infrastructure for account, application, order and referral records.</li>
          <li><strong>Google</strong> provides sign-in and receives the information needed to authenticate your account. Our pages also load Google Fonts, which sends your browser&apos;s font requests to Google.</li>
          <li><strong>Stripe</strong> processes payments and refunds and receives contact and order information needed for checkout and transaction records.</li>
          <li><strong>Our team and service providers</strong> handle hosting, support and program operations. Relevant details may be shared with accommodation, transport or visit providers to arrange services you request.</li>
          <li><strong>Your referring partner:</strong> if you submit an application with an invite or discount code, the associated partner can see your submitted name and contact email, selected program, application and payment status, program price, discount, paid and refunded amounts, and submission date to manage that referral. Clear the referral code before submitting if you do not want your application attributed to that partner.</li>
          <li><strong>Legal and security recipients:</strong> we may disclose information when required by law or necessary to address fraud, security incidents or legal claims.</li>
        </ul>
        <p>We do not sell personal information. Third-party services also process information under their own policies: <a href="https://policies.google.com/privacy">Google</a>, <a href="https://supabase.com/privacy">Supabase</a> and <a href="https://stripe.com/privacy">Stripe</a>.</p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    content: (
      <>
        <p>We use authentication cookies to complete Google sign-in and keep you signed in. Blocking or clearing these cookies may prevent account features from working or require you to sign in again.</p>
        <p>If you follow a referral link, we store an <strong>arch_referral_code</strong> cookie for up to 30 days to remember the invitation. It is cleared after a successful application submission. You can remove or change the prefilled code in the application form and manage stored cookies through your browser.</p>
        <p>The website does not currently include advertising trackers or a separate analytics tracking tool. Google sign-in and Stripe checkout may use their own cookies or similar technologies under their respective policies.</p>
      </>
    ),
  },
  {
    id: "retention-security",
    title: "Storage, retention and security",
    content: (
      <>
        <p>We retain account and application information for as long as needed to provide the service, administer participation and address related enquiries. Payment, refund and referral records may need to be kept longer for accounting, legal obligations or disputes. When information is no longer needed, we delete or anonymize it; residual copies may remain in provider backups until those backups expire.</p>
        <p>We use access controls and authenticated connections to protect records and restrict access to relevant accounts and authorized team members. No online service can guarantee absolute security.</p>
        <p>The Arch operates a program in China and uses international service providers. Your information may be processed in China and other countries where our team and providers operate, which may have different privacy laws from your country. Where required, we use appropriate safeguards for these transfers and obtain any necessary consent. Contact us for information about the arrangements relevant to your data.</p>
      </>
    ),
  },
  {
    id: "your-choices",
    title: "Your choices and deletion requests",
    content: (
      <>
        <p>You can view your applications and orders in <Link href="/account">your account</Link> and edit eligible unpaid applications there. You can also ask us to access, correct or delete your personal information, close your account, or provide a copy of your records by emailing <LegalContact /> from your account email. We may need to verify your identity before acting on a request.</p>
        <p>You can remove The Arch&apos;s Google access in your <a href="https://myaccount.google.com/connections">Google Account connections</a>. Removing Google access does not automatically delete information already held by The Arch; contact us separately to request deletion. Deleting an account does not itself cancel a booking or create a refund entitlement.</p>
        <p>Depending on your location, you may also have rights to object to or restrict processing, withdraw consent, receive a portable copy of your data, or complain to your local privacy authority. We handle requests within applicable legal time limits and explain any information we need to retain. Withdrawing consent does not affect processing already lawfully performed.</p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children's privacy",
    content: (
      <p>The website and program are intended for an adult professional audience and are not directed to children. If you believe a child has provided personal information without appropriate authorization, contact <LegalContact /> so we can review and address it.</p>
    ),
  },
  {
    id: "updates-contact",
    title: "Updates and contact",
    content: (
      <>
        <p>We may update this policy as the service or our practices change. The date above identifies the latest revision. For material changes, we will provide an appropriate notice through the website or our account communications and obtain consent where required.</p>
        <p>For questions about this policy or your data, write to The Arch team at <LegalContact />.</p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return <LegalDocument title="Privacy Policy" description="How we handle your information, why we need it, and the choices you have." sections={sections} />;
}
