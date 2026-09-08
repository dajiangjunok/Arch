import type { Metadata } from "next";
import Link from "next/link";
import { LegalContact, LegalDocument, type LegalSection } from "../legal-document";

export const metadata: Metadata = {
  title: "Terms of Service | The Arch.",
  description: "Terms for The Arch website, Google sign-in, program applications, payments, cancellations and participation.",
  alternates: { canonical: "https://www.thearch.global/terms" },
};

const sections: readonly LegalSection[] = [
  {
    id: "about-these-terms",
    title: "About these terms",
    content: (
      <>
        <p>These Terms of Service apply to your use of <Link href="/">www.thearch.global</Link>, your The Arch account, and the application and payment services offered through the website. "The Arch", "we", "us" and "our" refer to The Arch team providing these services. Contact us at <LegalContact />.</p>
        <p>By creating an account or submitting an application, you agree to these terms. Please read them before continuing. Our <Link href="/privacy">Privacy Policy</Link> describes how we handle your personal information.</p>
        <p>Your confirmed offer or a separate written participation agreement may set out additional terms for a particular program. If those terms conflict with these general terms, the specific agreed terms govern that booking, subject to applicable law.</p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Accounts and Google sign-in",
    content: (
      <>
        <p>Google sign-in is used to create and access your account. The first time you continue with Google, an account is created automatically. Basic identity information connects you to your applications, orders and payment confirmations, as explained in our Privacy Policy.</p>
        <p>Use an account you are authorized to use, provide accurate information, and protect access to your Google account and devices. Notify us if you believe your The Arch account has been used without authorization. You must have the legal capacity and, if acting for an organization, the authority to enter into the relevant agreement.</p>
        <p>You can browse public program information without signing in. Account access is required to submit applications and view private records.</p>
      </>
    ),
  },
  {
    id: "applications",
    title: "Applications and admission",
    content: (
      <>
        <p>The Arch is an application-based China innovation immersion program. We review submissions individually and may request an interview or additional information. Submitting an application, creating an account or entering an invitation code does not guarantee admission, a Fellowship place or a reserved seat.</p>
        <p>If accepted, you will receive an offer and payment instructions, including any deadline to confirm your place. For paid places, your seat is confirmed only after full payment is received and your booking is confirmed. Fellowship places follow the conditions communicated with the offer.</p>
        <p>Keep your contact details accurate and review your account and program communications for updates. You are responsible for the accuracy of information you submit.</p>
      </>
    ),
  },
  {
    id: "fees-payments",
    title: "Fees and payments",
    content: (
      <>
        <p>The applicable fee, currency, selected weeks, inclusions and payment deadline are those provided in your offer and checkout. Contact us to resolve any discrepancy before paying. Inclusions vary by pass; refer to your confirmed offer for the services included in your booking.</p>
        <p>Payments made through the website are processed by Stripe. You authorize the displayed transaction when you complete checkout. Your bank or payment provider may apply its own conversion or transaction fees.</p>
        <p>Orders and payment status are available in your account. A failed or incomplete payment does not secure a place. If you believe a charge is incorrect or duplicated, contact us with the order details so we can investigate.</p>
      </>
    ),
  },
  {
    id: "cancellations-refunds",
    title: "Cancellations, refunds and transfers",
    content: (
      <>
        <p>As set out in our <Link href="/faq">FAQ</Link>, payments are generally <strong>non-refundable</strong> if you decide not to attend or cannot attend, except where applicable law requires a refund or we agree otherwise in writing. You may request to transfer your place to another person, subject to The Arch&apos;s approval.</p>
        <p>If a refund request option is available for your order, you may submit a request in <Link href="/account">your account</Link> or contact <LegalContact />. Requests are reviewed against your booking terms and applicable rights; submitting a request does not itself mean a refund has been approved. Approved refunds are processed through the payment provider, and the time to reach your account depends on that provider and your bank.</p>
        <p>If we cancel a confirmed program or make a material change to your booking, we will contact you about available alternatives and any refund due under your agreed booking terms or applicable law. Nothing in these terms excludes mandatory consumer rights.</p>
      </>
    ),
  },
  {
    id: "program-participation",
    title: "Program arrangements and conduct",
    content: (
      <>
        <p>Published schedules, company visits, speakers, venues and activities may change because of availability, travel conditions or operational needs. Your confirmed program information sets out the arrangements for your participation; we will communicate material changes.</p>
        <p>You are responsible for valid travel documents, any required entry permission, and travel or insurance arrangements not expressly included in your offer. Participation does not guarantee visa approval, investment, business agreements or any particular commercial outcome.</p>
        <p>During the program, follow applicable laws, reasonable safety instructions and host policies. Respect other participants and obtain permission before recording, photographing or sharing confidential information from visits or private sessions.</p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use and your content",
    content: (
      <>
        <p>Do not impersonate others, submit fraudulent applications, abuse referral codes, interfere with the website, attempt to access another person&apos;s records, or use the service for unlawful purposes.</p>
        <p>You retain ownership of the material you submit. You allow us to store, review and use it as needed to process your application, provide the service and communicate with you, consistent with our Privacy Policy. Submit only material you have the right to share.</p>
        <p>The Arch&apos;s website content, branding and program materials belong to us or their respective owners. You may use public information for personal reference; reproducing or commercially exploiting protected materials requires the relevant owner&apos;s permission or another lawful basis.</p>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "Third-party services and availability",
    content: (
      <>
        <p>We use Google for sign-in, Supabase for authentication and data infrastructure, and Stripe for checkout and refunds. Your use of those services may also be subject to their terms and privacy policies.</p>
        <p>We work to keep the website available and its information accurate, but interruptions, maintenance and errors can occur. Contact us if a technical issue prevents you from accessing a record or completing a time-sensitive action.</p>
        <p>Links to other websites and references to companies do not guarantee their services or imply endorsement. Nothing in these terms limits responsibility or rights that cannot lawfully be limited, including applicable consumer rights.</p>
      </>
    ),
  },
  {
    id: "account-closure",
    title: "Suspension and account closure",
    content: (
      <>
        <p>We may restrict access where reasonably necessary to address fraud, security risks, unlawful conduct or a material breach of these terms. Where appropriate, we will explain the restriction and how to contact us about it.</p>
        <p>You may stop using the website or request account closure by contacting <LegalContact />. Account closure does not automatically cancel an existing booking, erase records we must retain, or change payment or refund obligations. Personal information is handled as described in our Privacy Policy.</p>
      </>
    ),
  },
  {
    id: "changes-contact",
    title: "Changes and resolving questions",
    content: (
      <>
        <p>We may revise these terms as the service changes. The latest revision date appears above. We will give appropriate notice of material changes and seek agreement where required. Changes do not retroactively alter an already confirmed booking without agreement or a legal basis.</p>
        <p>If you have a question or dispute about the service, your application or a payment, contact The Arch team at <LegalContact /> with the relevant details so we can work to resolve it. These terms do not remove any right you have to seek remedies under applicable law.</p>
      </>
    ),
  },
];

export default function TermsPage() {
  return <LegalDocument title="Terms of Service" description="The terms for your account, application and participation in The Arch." sections={sections} />;
}
