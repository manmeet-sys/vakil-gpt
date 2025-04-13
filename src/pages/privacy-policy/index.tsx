
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AppLayout from '@/components/AppLayout';
import BackButton from '@/components/BackButton';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
  // Ensure page scrolls to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AppLayout>
      <Helmet>
        <title>Privacy Policy | VakilGPT</title>
        <meta name="description" content="Privacy Policy for VakilGPT in compliance with Indian law" />
      </Helmet>
      <div className="container mx-auto px-4 py-6">
        <BackButton to="/" label="Back to Home" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-sm text-gray-500 mb-6">Last Updated: April 13, 2025</p>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p>
                VakilGPT ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, process, and disclose your personal and sensitive data when you access or use our platform, website, mobile application, AI tools, or any services ("Services") provided by VakilGPT.
              </p>
              <p>
                This policy is framed in accordance with the <strong>Information Technology Act, 2000</strong>, the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, and incorporates principles of the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong> to the extent applicable.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
              
              <h3 className="text-lg font-medium mt-4 mb-2">A. Personal Information</h3>
              <p>We may collect the following:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Full name, contact number, email address, postal address</li>
                <li>Login credentials (username, password)</li>
                <li>Bar registration details, legal specialization, professional title</li>
                <li>Uploaded profile image, firm/organization affiliation</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4 mb-2">B. Sensitive Personal Data or Information (SPDI)</h3>
              <p>As per Rule 3 of the IT SPDI Rules:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Financial information (bank details, payment data for subscriptions)</li>
                <li>Legal documents uploaded (case files, contracts, petitions, notices)</li>
                <li>AI queries that may contain personal/legal context</li>
                <li>Passwords (encrypted and securely stored)</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4 mb-2">C. Usage and Technical Information</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>IP address, device identifiers, browser type, OS</li>
                <li>Log data: time of access, activity logs, chat history with AI</li>
                <li>Page visits, tool usage analytics, document interaction history</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p>We use the collected data to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Authenticate user accounts and manage subscriptions</li>
                <li>Offer personalized AI-based legal assistance</li>
                <li>Facilitate document drafting, analysis, and review</li>
                <li>Provide access to research tools (case laws, statutes, articles)</li>
                <li>Generate, store, and track bills, legal time entries, and deadlines</li>
                <li>Enable e-signature services, document sharing, and collaboration</li>
                <li>Protect intellectual property and assess compliance risks</li>
                <li>Improve customer support and provide helpdesk services</li>
                <li>Analyze system usage for enhancement and security</li>
                <li>Fulfill legal obligations and enforce terms</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Legal Basis for Processing</h2>
              <p>We process your data based on:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Consent:</strong> Explicit user permission during registration or service usage</li>
                <li><strong>Contractual Necessity:</strong> To deliver requested services</li>
                <li><strong>Legitimate Interest:</strong> For platform security, analytics, and fraud prevention</li>
                <li><strong>Legal Obligation:</strong> Compliance with court orders, regulations, and laws</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
              <p>We may share your data with:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Service Providers:</strong> Hosting, payment gateways, analytics, and communication partners</li>
                <li><strong>Legal Technology Partners:</strong> Firms offering integrations (e.g., e-sign, legal research APIs)</li>
                <li><strong>Regulatory/Government Authorities:</strong> Where mandated by law</li>
                <li><strong>Business Transactions:</strong> In case of mergers, acquisitions, or restructuring</li>
                <li><strong>Your Authorized Contacts:</strong> For document collaboration or shared access features</li>
              </ul>
              <p>
                We ensure our partners adhere to confidentiality and legal standards through appropriate contracts.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Data Storage and Security</h2>
              <p>
                Your data is stored on secure, encrypted servers. We apply:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>SSL encryption for data transmission</li>
                <li>Role-based access controls and password hashing</li>
                <li>Security audits, vulnerability assessments</li>
                <li>Employee confidentiality agreements and training</li>
                <li>Backup and recovery systems</li>
              </ul>
              <p>
                We comply with <strong>IS/ISO/IEC 27001</strong> standards as per Rule 8 of the SPDI Rules.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Data Retention</h2>
              <p>
                We retain your information:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>As long as your account is active or as needed for our services</li>
                <li>For legal/statutory obligations, dispute resolution, enforcement</li>
                <li>Backups for recovery, unless deletion is explicitly requested</li>
              </ul>
              <p>
                Upon account deletion, data is erased or anonymized within a reasonable timeframe.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Your Rights (Under Indian Law)</h2>
              <p>As a user, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Access</strong> your personal information</li>
                <li><strong>Correct</strong> inaccurate or outdated data</li>
                <li><strong>Withdraw Consent</strong> at any time</li>
                <li><strong>Request Deletion</strong> of your data</li>
                <li><strong>File a Grievance</strong> with our appointed officer</li>
              </ul>
              <p>
                To exercise your rights, contact us at the details below.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Children's Privacy</h2>
              <p>
                VakilGPT is intended for users aged <strong>18 and above</strong>. We do not knowingly collect data from minors. If such data is discovered, it will be promptly deleted.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">10. Cookies and Tracking</h2>
              <p>
                Our platform uses cookies and similar tracking technologies for:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>User session management</li>
                <li>Personalization of features</li>
                <li>Traffic analysis and debugging</li>
                <li>Improving UI/UX experiences</li>
              </ul>
              <p>
                You may adjust cookie preferences through your browser settings.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">11. Updates to This Privacy Policy</h2>
              <p>
                We may periodically revise this policy. Updated versions will be posted with the revised "Last Updated" date. You are encouraged to review this page regularly.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">12. Grievance Officer</h2>
              <p>
                As per Rule 5(9) of the SPDI Rules:
              </p>
              <div className="mt-4">
                <p><strong>Name:</strong> Manmeet Singh</p>
                <p><strong>Email:</strong> manmeetsingh20378@gmail.com</p>
                <p><strong>Phone:</strong> +91 9958580043</p>
                <p><strong>Address:</strong> New Delhi, India</p>
              </div>
              <p className="mt-4">
                All grievances will be addressed within <strong>30 days</strong> of receipt.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">13. Contact Us</h2>
              <p>
                For queries or complaints:
              </p>
              <div className="mt-4">
                <p><strong>Email:</strong> manmeetsingh20378@gmail.com</p>
                <p><strong>Phone:</strong> +91 9958580043</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default PrivacyPolicyPage;
