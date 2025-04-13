
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Shield, Scale, FileText, Clock } from 'lucide-react';

const TermsOfServicePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AppLayout>
      <Helmet>
        <title>Terms of Service | VakilGPT</title>
        <meta name="description" content="VakilGPT Terms of Service - Learn about our usage terms, licensing, and legal information" />
      </Helmet>

      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-legal-accent transition-colors">Home</Link>
          <ArrowRight className="h-3 w-3" />
          <span>Terms of Service</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Terms of Service</h1>
        <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
          Last updated: April 13, 2025
        </p>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="mb-3 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full w-10 h-10 flex items-center justify-center">
              <FileText className="text-blue-600 dark:text-blue-400 h-5 w-5" />
            </div>
            <h3 className="font-semibold mb-2">Legal Agreement</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              These terms constitute a legal agreement between you and VakilGPT
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="mb-3 bg-purple-50 dark:bg-purple-900/20 p-2 rounded-full w-10 h-10 flex items-center justify-center">
              <Shield className="text-purple-600 dark:text-purple-400 h-5 w-5" />
            </div>
            <h3 className="font-semibold mb-2">Protection</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Our terms protect both you and us as you use our services
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="mb-3 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-full w-10 h-10 flex items-center justify-center">
              <Clock className="text-amber-600 dark:text-amber-400 h-5 w-5" />
            </div>
            <h3 className="font-semibold mb-2">Updates</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We may update these terms from time to time to reflect changes
            </p>
          </div>
        </div>

        <div className="prose prose-blue max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-li:text-gray-600 dark:prose-li:text-gray-300">
          <section className="mb-8">
            <h2 id="introduction" className="scroll-mt-20">1. Introduction</h2>
            <p>
              Welcome to VakilGPT ("we," "our," or "us"). By accessing or using our website, services, applications, or content (collectively, the "Services"), you agree to be bound by these Terms of Service (the "Terms").
            </p>
            <p>
              VakilGPT provides an AI-powered legal assistant platform focused on Indian law. Our current offerings are available free of charge during our beta period, but we plan to introduce paid subscription options in the future.
            </p>
          </section>

          <section className="mb-8">
            <h2 id="usage" className="scroll-mt-20">2. Service Usage</h2>
            <p>
              <strong>2.1 Account Creation.</strong> To access certain features of our Services, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <p>
              <strong>2.2 Acceptable Use.</strong> You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree not to use our Services:
            </p>
            <ul>
              <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
              <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Services</li>
              <li>To impersonate or attempt to impersonate VakilGPT, a VakilGPT employee, another user, or any other person or entity</li>
              <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services, or which may harm VakilGPT or users of the Services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 id="pricing" className="scroll-mt-20">3. Pricing and Payments</h2>
            <p>
              <strong>3.1 Free Beta Period.</strong> VakilGPT's Services are currently available free of charge during our beta testing period. During this period, we may limit certain features or impose usage restrictions.
            </p>
            <p>
              <strong>3.2 Future Paid Services.</strong> We plan to introduce paid subscription options in the future. When we do, we will provide clear information about pricing, billing cycles, and the features included in each subscription tier.
            </p>
            <p>
              <strong>3.3 Changes to Pricing.</strong> We reserve the right to change our pricing structure at any time. Any changes to pricing will be communicated to you in advance.
            </p>
          </section>

          <section className="mb-8">
            <h2 id="intellectual-property" className="scroll-mt-20">4. Intellectual Property</h2>
            <p>
              <strong>4.1 Our Property.</strong> The Services and their entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof), are owned by VakilGPT, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            <p>
              <strong>4.2 Your Content.</strong> When you provide content through our Services, you grant us a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, modify, publicly perform, publicly display, reproduce, and distribute your content in connection with providing and improving our Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 id="disclaimers" className="scroll-mt-20">5. Disclaimers</h2>
            <p>
              <strong>5.1 Legal Advice Disclaimer.</strong> VakilGPT is an AI assistant and does not provide legal advice. The information provided through our Services is for informational purposes only and should not be considered legal advice. Always consult with a qualified legal professional for advice concerning your specific situation.
            </p>
            <p>
              <strong>5.2 Service Availability.</strong> We strive to provide uninterrupted access to our Services, but we do not guarantee that our Services will be available at all times. We reserve the right to suspend, discontinue, or change any aspect of our Services at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 id="limitation-liability" className="scroll-mt-20">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, VakilGPT shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses, resulting from:
            </p>
            <ul>
              <li>Your use or inability to use our Services;</li>
              <li>Any action taken in connection with an investigation by VakilGPT or law enforcement authorities;</li>
              <li>Any action taken in connection with copyright or other intellectual property owners;</li>
              <li>Any errors or omissions in the Services' operation; or</li>
              <li>Any damage to your computer, mobile device, or any other equipment, even if foreseeable.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 id="termination" className="scroll-mt-20">7. Termination</h2>
            <p>
              We may terminate or suspend your account and access to our Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
            </p>
            <p>
              Upon termination, your right to use the Services will immediately cease. If you wish to terminate your account, you may simply discontinue using the Services or contact us to request account deletion.
            </p>
          </section>

          <section className="mb-8">
            <h2 id="changes" className="scroll-mt-20">8. Changes to Terms</h2>
            <p>
              We may revise these Terms at any time by updating this page. It is your responsibility to check this page periodically for changes. Your continued use of the Services following the posting of revised Terms means that you accept and agree to the changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 id="contact" className="scroll-mt-20">9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              <a href="mailto:Manmeetsingh20378@gmail.com" className="text-legal-accent hover:underline">Manmeetsingh20378@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default TermsOfServicePage;
