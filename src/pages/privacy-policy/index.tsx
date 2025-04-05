
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
            <p className="text-sm text-gray-500 mb-6">Last Updated: {new Date().toLocaleDateString('en-IN')}</p>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Introduction</h2>
              <p>
                VakilGPT ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy. This Privacy Policy describes how we collect, use, store, process, and share your information when you use our services, website, and applications.
              </p>
              <p>
                This policy is in compliance with the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 of India.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
              <p>We collect the following types of information:</p>
              <h3 className="text-lg font-medium mt-4 mb-2">Personal Information</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Name and contact information, including email address, phone number, and postal address.</li>
                <li>Account credentials, such as usernames and passwords.</li>
                <li>Professional information, such as job title, legal specialization, and bar enrollment details.</li>
                <li>Payment information, if applicable.</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4 mb-2">Sensitive Personal Data or Information (SPDI)</h3>
              <p>As defined under Rule 3 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, we may collect:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Financial information, such as bank account details for payment processing.</li>
                <li>Legal documents and case information that you upload or input into our system.</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4 mb-2">Usage Information</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Information about your interactions with our services.</li>
                <li>Device information, including IP address, browser type, and operating system.</li>
                <li>Log data, such as access times and pages viewed.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
              <p>We use your information for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To provide and maintain our services.</li>
                <li>To process and complete transactions.</li>
                <li>To improve, personalize, and enhance our services.</li>
                <li>To communicate with you about updates, security alerts, and support.</li>
                <li>To analyze usage patterns and optimize our platform.</li>
                <li>To detect, prevent, and address technical issues and security threats.</li>
                <li>To comply with legal obligations.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Legal Basis for Processing</h2>
              <p>We process your information on the following legal bases:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Consent:</strong> We process your information based on your explicit consent, which you can withdraw at any time.</li>
                <li><strong>Contractual Necessity:</strong> Processing is necessary for the performance of our contract with you.</li>
                <li><strong>Legitimate Interests:</strong> We process your information for our legitimate business interests, such as fraud prevention and network security.</li>
                <li><strong>Legal Compliance:</strong> We process your information to comply with applicable laws and regulations.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Data Security</h2>
              <p>
                We implement reasonable security practices and procedures as mandated by the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, to protect your personal information from unauthorized access, use, modification, or disclosure.
              </p>
              <p>
                Our security measures include encryption, access controls, regular security assessments, and employee training. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When determining the appropriate retention period, we consider:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>The amount, nature, and sensitivity of the personal information.</li>
                <li>The potential risk of harm from unauthorized use or disclosure.</li>
                <li>The purposes for which we process the information.</li>
                <li>Whether we can achieve those purposes through other means.</li>
                <li>Applicable legal, regulatory, tax, accounting, or other requirements.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Sharing Your Information</h2>
              <p>We may share your information with:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf, such as payment processing, data analysis, and customer service.</li>
                <li><strong>Business Partners:</strong> Companies with whom we partner to offer certain features or services.</li>
                <li><strong>Legal Authorities:</strong> When required by law, court order, or governmental regulation.</li>
                <li><strong>Corporate Transactions:</strong> In connection with a merger, acquisition, or sale of assets.</li>
              </ul>
              <p>
                We ensure that third parties who have access to your information comply with privacy and confidentiality standards comparable to this Privacy Policy and Indian data protection laws.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
              <p>Under applicable Indian laws, you have the following rights:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Right to Access:</strong> You can request access to your personal information we hold.</li>
                <li><strong>Right to Correction:</strong> You can request correction of inaccurate personal information.</li>
                <li><strong>Right to Withdraw Consent:</strong> You can withdraw consent for processing your personal information.</li>
                <li><strong>Right to Grievance Redressal:</strong> You can file a complaint with our Grievance Officer.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we learn that we have collected personal information from a child under 18, we will take steps to delete that information as quickly as possible.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Grievance Officer</h2>
              <p>
                In accordance with the Information Technology Act, 2000, and the rules made thereunder, the contact details of the Grievance Officer are provided below:
              </p>
              <div className="mt-4">
                <p><strong>Name:</strong> Manmeet Singh</p>
                <p><strong>Email:</strong> Manmeetsingh20378@gmail.com</p>
                <p><strong>Phone:</strong> +91 9958580043</p>
                <p><strong>Address:</strong> New Delhi, India</p>
              </div>
              <p className="mt-4">
                The Grievance Officer shall redress your grievances expeditiously but within one month from the date of receipt of grievance.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4">
                <p><strong>Email:</strong> Manmeetsingh20378@gmail.com</p>
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
