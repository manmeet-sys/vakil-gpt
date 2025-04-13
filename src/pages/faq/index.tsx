
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/AppLayout';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  FileText, 
  Shield, 
  CreditCard, 
  Lock, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

const FaqPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItem, setExpandedItem] = useState(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Toggle FAQ item
  const toggleItem = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };
  
  // FAQ data organized by category
  const faqData = {
    general: [
      {
        id: 'general-1',
        question: 'What is VakilGPT?',
        answer: 'VakilGPT is an AI-powered legal assistant focused on Indian law. It helps users with legal research, document analysis, and generating various legal documents. Our platform combines advanced AI technology with comprehensive legal knowledge to provide accurate and timely assistance to legal professionals and individuals seeking legal information.'
      },
      {
        id: 'general-2',
        question: 'How accurate is the legal information provided by VakilGPT?',
        answer: 'VakilGPT is trained on a vast corpus of Indian legal texts, including statutes, case law, and legal commentaries. While we strive for high accuracy, the information provided should be considered as a starting point for research and not as definitive legal advice. We recommend verifying critical information with primary legal sources or consulting with a qualified legal professional for complex matters.'
      },
      {
        id: 'general-3',
        question: 'Can VakilGPT replace my lawyer?',
        answer: 'No, VakilGPT is designed to be a legal research and assistance tool, not a substitute for a qualified lawyer. Our AI can help with research, document drafting, and providing information about legal concepts, but it cannot give personalized legal advice or represent you in legal proceedings. For specific legal advice tailored to your situation, please consult with a licensed attorney.'
      },
      {
        id: 'general-4',
        question: 'Is VakilGPT available 24/7?',
        answer: 'Yes, VakilGPT is available 24 hours a day, 7 days a week. You can access our AI assistant anytime you need legal information or assistance with document drafting and analysis.'
      },
      {
        id: 'general-5',
        question: 'What languages does VakilGPT support?',
        answer: 'Currently, VakilGPT primarily operates in English. We are working on adding support for major Indian languages including Hindi, Bengali, Tamil, and more in future updates.'
      }
    ],
    features: [
      {
        id: 'features-1',
        question: 'What features are available in VakilGPT?',
        answer: 'VakilGPT offers a variety of features including legal research assistance, document analysis, contract drafting, legal brief generation, case law research, compliance guidance, litigation prediction, and more. You can explore all our tools in the Tools section of the platform.'
      },
      {
        id: 'features-2',
        question: 'How do I analyze legal documents with VakilGPT?',
        answer: 'You can upload legal documents in our Document Analyzer tool. The AI will analyze the document, provide a summary, highlight key clauses, identify potential issues, and suggest improvements. The tool supports various document formats including PDF, DOCX, and TXT.'
      },
      {
        id: 'features-3',
        question: 'Can VakilGPT help with legal research?',
        answer: 'Yes, VakilGPT can assist with legal research by finding relevant statutes, case law, and legal principles based on your query. You can use the Case Law Research tool or simply ask questions in the Legal Chat interface to get started with your research.'
      },
      {
        id: 'features-4',
        question: 'Does VakilGPT offer document templates?',
        answer: 'Yes, VakilGPT provides numerous legal document templates, including contracts, agreements, notices, and court pleadings. These templates can be customized to your specific needs using our Contract Drafting and Legal Brief Generation tools.'
      },
      {
        id: 'features-5',
        question: 'How can I track legal deadlines with VakilGPT?',
        answer: 'Our Deadline Management tool allows you to set and track important legal deadlines, including filing dates, hearing schedules, and statutory timelines. You can receive notifications and reminders to ensure you never miss a critical deadline.'
      }
    ],
    privacy: [
      {
        id: 'privacy-1',
        question: 'How secure is my data on VakilGPT?',
        answer: 'We take data security very seriously. All communications with VakilGPT are encrypted using industry-standard protocols. We employ robust security measures including data encryption, secure authentication, and regular security audits to protect your information.'
      },
      {
        id: 'privacy-2',
        question: 'What happens to the documents I upload?',
        answer: 'Documents you upload are processed for analysis and stored securely in your account. We do not share your documents with third parties. You retain full control of your data and can delete uploaded documents at any time from your account settings.'
      },
      {
        id: 'privacy-3',
        question: 'Does VakilGPT store my legal questions and conversations?',
        answer: 'Yes, your conversations with VakilGPT are stored in your account so you can refer back to them later. This helps provide continuity and context for future interactions. You can delete your conversation history at any time from your account settings.'
      },
      {
        id: 'privacy-4',
        question: 'Is attorney-client privilege applicable when using VakilGPT?',
        answer: 'No, conversations with VakilGPT are not protected by attorney-client privilege as VakilGPT is not a licensed attorney. If you need privileged communication, please consult with a licensed legal professional directly.'
      },
      {
        id: 'privacy-5',
        question: 'How can I delete my account and data?',
        answer: 'You can request account deletion from your account settings. Upon deletion, we will remove your personal information and uploaded documents from our active systems. Please note that certain information may be retained as required by law or for legitimate business purposes.'
      }
    ],
    billing: [
      {
        id: 'billing-1',
        question: 'Is VakilGPT free to use?',
        answer: 'VakilGPT is currently free to use during our beta testing period. All features are available at no cost to help us gather feedback and improve our service. We plan to introduce paid subscription plans in the future, but will provide advance notice to all users before making this transition.'
      },
      {
        id: 'billing-2',
        question: 'What pricing plans will be available in the future?',
        answer: 'We plan to offer several subscription tiers to cater to different user needs. These will likely include a Basic plan for individuals, a Professional plan for legal practitioners, and an Enterprise plan for law firms and organizations. Each tier will offer different feature sets and usage limits.'
      },
      {
        id: 'billing-3',
        question: 'Will there be any special discounts for students or non-profits?',
        answer: 'Yes, we plan to offer special pricing for law students, academic institutions, and non-profit organizations. These details will be announced when we launch our subscription plans.'
      },
      {
        id: 'billing-4',
        question: 'Can I cancel my subscription at any time?',
        answer: 'Yes, when paid subscriptions are introduced, you will be able to cancel at any time with no questions asked. Any unused portion of your subscription period will remain active until the end of the billing cycle.'
      },
      {
        id: 'billing-5',
        question: 'What payment methods will be accepted?',
        answer: 'We plan to accept all major credit cards, debit cards, UPI payments, and potentially other payment methods common in India. Detailed payment information will be provided when we launch our subscription plans.'
      }
    ],
    technical: [
      {
        id: 'technical-1',
        question: 'What browsers are supported?',
        answer: 'VakilGPT works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated to the latest version for optimal performance.'
      },
      {
        id: 'technical-2',
        question: 'Is there a mobile app for VakilGPT?',
        answer: 'We currently offer a responsive web application that works well on mobile devices. A dedicated mobile app for iOS and Android is in development and will be released in the future.'
      },
      {
        id: 'technical-3',
        question: 'What file formats are supported for document uploads?',
        answer: "VakilGPT supports PDF, DOCX, DOC, TXT, and RTF file formats for document analysis. We're working on adding support for additional formats in future updates."
      },
      {
        id: 'technical-4',
        question: 'How can I report technical issues or bugs?',
        answer: 'You can report technical issues by clicking on the "Help" icon in the bottom right corner of any page, or by emailing our support team at support@vakilgpt.com. Please include details about the issue, your browser version, and any error messages you received.'
      },
      {
        id: 'technical-5',
        question: 'Is VakilGPT accessible for users with disabilities?',
        answer: 'Yes, we are committed to making VakilGPT accessible to all users. We implement WCAG guidelines and continue to improve accessibility features. If you encounter any accessibility issues, please contact our support team.'
      }
    ]
  };
  
  // Flatten all FAQs for search functionality
  const allFaqs = Object.values(faqData).flat();
  
  // Filter FAQs based on search query
  const filteredFaqs = searchQuery
    ? allFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  // Category icons mapping
  const categoryIcons = {
    general: HelpCircle,
    features: MessageSquare,
    privacy: Shield,
    billing: CreditCard,
    technical: Lock
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Frequently Asked Questions | VakilGPT</title>
        <meta name="description" content="Find answers to common questions about VakilGPT's features, privacy, billing, and more" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Get answers to the most common questions about VakilGPT
          </p>
          
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for answers..."
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Search Results */}
        {searchQuery ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Search Results ({filteredFaqs.length})
              </h2>
              
              {filteredFaqs.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
                  <h3 className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    No matching questions found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try a different search term or browse our FAQ categories below
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map(faq => (
                    <div
                      key={faq.id}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div
                        className={`flex justify-between items-center p-4 cursor-pointer ${
                          expandedItem === faq.id ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                        }`}
                        onClick={() => toggleItem(faq.id)}
                      >
                        <h3 className="font-medium text-gray-900 dark:text-white pr-4">
                          {faq.question}
                        </h3>
                        {expandedItem === faq.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      
                      <AnimatePresence>
                        {expandedItem === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-4 pb-4"
                          >
                            <p className="text-gray-600 dark:text-gray-300">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {filteredFaqs.length > 0 && (
              <div className="text-center mb-12">
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  View All FAQs
                </Button>
              </div>
            )}
          </>
        ) : (
          <Tabs defaultValue="general" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="general" className="flex flex-col items-center gap-1 py-3">
                <HelpCircle className="h-5 w-5" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="flex flex-col items-center gap-1 py-3">
                <MessageSquare className="h-5 w-5" />
                <span>Features</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex flex-col items-center gap-1 py-3">
                <Shield className="h-5 w-5" />
                <span>Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex flex-col items-center gap-1 py-3">
                <CreditCard className="h-5 w-5" />
                <span>Billing</span>
              </TabsTrigger>
              <TabsTrigger value="technical" className="flex flex-col items-center gap-1 py-3">
                <Lock className="h-5 w-5" />
                <span>Technical</span>
              </TabsTrigger>
            </TabsList>
            
            {Object.keys(faqData).map(category => (
              <TabsContent key={category} value={category} className="space-y-4 mt-0">
                {faqData[category].map(faq => (
                  <div
                    key={faq.id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div
                      className={`flex justify-between items-center p-4 cursor-pointer ${
                        expandedItem === faq.id ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                      }`}
                      onClick={() => toggleItem(faq.id)}
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white pr-4">
                        {faq.question}
                      </h3>
                      {expandedItem === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {expandedItem === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-4"
                        >
                          <p className="text-gray-600 dark:text-gray-300">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
        
        {/* Contact Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Still Have Questions?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you couldn't find the answer you're looking for, feel free to contact our support team
              or try our AI-powered chat assistant for instant help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-legal-accent hover:bg-legal-accent/90">
                <Link to="/chat">
                  Chat with AI Assistant <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a href="mailto:Manmeetsingh20378@gmail.com">
                  Contact Support Team
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default FaqPage;
