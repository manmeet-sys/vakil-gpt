import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatInterface from '@/components/ChatInterface';
import FeatureCard from '@/components/FeatureCard';
import ExploreToolsSection from '@/components/ExploreToolsSection';
import ReviewSection from '@/components/ReviewSection';
import { Gavel, Scale, FileText, Shield, BookOpen, CheckCircle, ArrowRight, Search, Settings, User, Users, Sparkle, Compass, Sparkles, RotateCw, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';

const features = [
  {
    icon: FileText,
    title: 'Legal Document Analysis',
    description: 'Upload contracts, agreements, and legal documents for AI-powered insights. Our system identifies key clauses, potential risks, and provides plain-language explanations.'
  }, {
    icon: Gavel,
    title: 'Case Law Research',
    description: 'Search across jurisdictions with intelligent filtering by court, date, topic, and relevance. Find precedents that strengthen your arguments and support your legal position.'
  }, {
    icon: Shield,
    title: 'Compliance Assistance',
    description: 'Stay current with regulatory changes across industries. Receive personalized alerts, compliance checklists, and actionable recommendations to avoid legal pitfalls.'
  }, {
    icon: Scale,
    title: 'Legal Risk Assessment',
    description: 'Our AI analyzes your business operations to identify potential legal exposures. Receive a comprehensive risk report with mitigation strategies and prioritized action items.'
  }, {
    icon: BookOpen,
    title: 'Legal Education',
    description: 'Access a growing library of plain-language explanations of legal concepts, procedures, and terminology. Perfect for non-lawyers and legal professionals alike.'
  }, {
    icon: CheckCircle,
    title: 'Due Diligence Support',
    description: 'Streamline due diligence with automated document review, entity extraction, and customizable report generation. Reduce review time by up to 80% while increasing accuracy.'
  }
];

const benefits = [
  {
    title: 'Save Time',
    description: 'Reduce legal research time by up to 70% with instant access to relevant information, automated document analysis, and AI-powered summaries.',
    percentage: 70,
    icon: ArrowRight
  }, {
    title: 'Reduce Costs',
    description: 'Lower legal consultation costs by addressing preliminary questions through AI. Our clients report average savings of 40% on outside counsel expenses.',
    percentage: 40,
    icon: Scale
  }, {
    title: 'Increase Accuracy',
    description: 'Enhance accuracy with AI analysis trained on millions of legal documents and cases. Reduce human error and achieve consistent, data-driven results.',
    percentage: 90,
    icon: CheckCircle
  }, {
    title: 'Stay Informed',
    description: 'Keep up with changing laws and regulations through real-time updates and alerts. Never miss an important regulatory change that affects your business.',
    percentage: 95,
    icon: Shield
  }
];

const howItWorks = [
  {
    title: 'Ask Questions',
    description: 'Simply type your legal question or upload a document. Our AI understands complex legal queries and provides relevant responses.',
    icon: Search
  }, {
    title: 'Review Analysis',
    description: 'Receive detailed analysis with references to relevant statutes, case law, and legal principles. All information is cited for verification.',
    icon: FileText
  }, {
    title: 'Customize Experience',
    description: 'Add your own documents to the knowledge base to make responses more relevant to your specific needs and jurisdiction.',
    icon: Settings
  }
];

const legalAiSolutions = [
  {
    title: "Document Analysis",
    description: "Upload contracts, agreements & legal documents for instant AI-powered insights, key clauses, risk assessment & plain-language explanations.",
    icon: FileText,
    stepNumber: "01",
    color: "from-blue-600 to-indigo-700"
  },
  {
    title: "Ask Questions",
    description: "Ask any legal question and receive precise answers with references to relevant Indian statutes, case law, and legal principles.",
    icon: MessageSquare,
    stepNumber: "02",
    color: "from-purple-600 to-pink-500"
  },
  {
    title: "Case Law Research",
    description: "Search across jurisdictions with intelligent filtering by court, date & topic to find precedents that strengthen your arguments.",
    icon: Gavel,
    stepNumber: "03",
    color: "from-amber-500 to-orange-600"
  },
  {
    title: "Customize Experience",
    description: "Add your own documents to the knowledge base to make responses more relevant to your specific legal needs and jurisdiction.",
    icon: Settings,
    stepNumber: "04",
    color: "from-emerald-500 to-teal-600"
  },
  {
    title: "Compliance Assistance",
    description: "Stay current with regulatory changes across industries with personalized alerts, compliance checklists, and actionable recommendations.",
    icon: Shield,
    stepNumber: "05",
    color: "from-rose-500 to-red-600"
  },
  {
    title: "Due Diligence Support",
    description: "Streamline due diligence with automated document review, entity extraction, and customizable report generation for Indian legal context.",
    icon: CheckCircle,
    stepNumber: "06",
    color: "from-sky-500 to-blue-600"
  }
];

const Index = () => {
  useEffect(() => {
    const inViewObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          inViewObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    const elements = document.querySelectorAll('.fade-up-element');
    elements.forEach(el => {
      el.classList.add('opacity-0', 'translate-y-10');
      el.classList.remove('animate-fade-up');
      inViewObserver.observe(el);
    });
    return () => {
      elements.forEach(el => inViewObserver.unobserve(el));
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden hero-pattern">
        <div className="absolute inset-0 z-0 hero-pattern opacity-50" />
        <div className="container mx-auto grid gap-12 md:grid-cols-2 items-center z-10">
          <div className="max-w-xl space-y-6 fade-up-element">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-legal-accent/10 text-legal-accent text-sm font-medium mb-2">
              AI-Powered Legal Assistance for India
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-legal-slate dark:text-legal-light leading-tight text-balance">
              Transform Your Legal <span className="text-legal-accent">Research & Analysis</span>
            </h1>
            <p className="text-lg text-legal-muted dark:text-gray-300 max-w-lg">
              VakilGPT helps Indian legal professionals work smarter with advanced document analysis, case research, and regulatory compliance tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/chat">
                <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white text-base px-6 py-6 w-full sm:w-auto group">
                  Try VakilGPT Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/user-profile">
                <Button variant="outline" className="border-legal-border hover:bg-legal-light dark:hover:bg-legal-slate/20 text-legal-slate dark:text-white/90 text-base px-6 py-6 w-full sm:w-auto">
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Button>
              </Link>
            </div>
            <div className="pt-4 flex items-center space-x-4 text-sm text-legal-muted dark:text-gray-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(n => <div key={n} className="w-8 h-8 rounded-full border-2 border-white dark:border-legal-slate/20 bg-legal-light dark:bg-legal-slate/40 overflow-hidden">
                    <div className={`w-full h-full bg-legal-accent/[0.${n * 2}]`}></div>
                  </div>)}
              </div>
              <span>Trusted by <strong className="text-legal-slate dark:text-white/90">5,000+</strong> Indian legal professionals</span>
            </div>
          </div>
          
          <div className="fade-up-element delay-200 order-first md:order-last">
            <div className="relative">
              <div className="absolute inset-0 -right-6 -bottom-6 rounded-xl bg-legal-accent/10 transform rotate-3" />
              <div className="glass-container shadow-elegant rounded-xl overflow-hidden transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <img src="https://images.unsplash.com/photo-1589578527966-fdac0f44566c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2852&q=80" alt="Legal professional with AI assistant" className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          
        </div>
      </section>
      
      {/* Demo Section */}
      <section id="demo" className="py-20 px-4 bg-white dark:bg-legal-slate/5 transition-colors">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 fade-up-element">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-legal-accent/10 text-legal-accent text-sm font-medium mb-4">
              VakilGPT Demo
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-legal-slate dark:text-white mb-4">
              Experience Indian Legal AI in Action
            </h2>
            <p className="text-legal-muted dark:text-gray-300 text-lg">
              Ask any question about Indian law, regulations, or legal procedures below and see how our AI provides relevant information.
            </p>
          </div>
          
          <div className="fade-up-element">
            <div className="bg-white dark:bg-legal-slate/20 rounded-xl shadow-elegant overflow-hidden border border-legal-border dark:border-legal-slate/20">
              <div className="p-4 bg-legal-accent/5 border-b border-legal-border dark:border-legal-slate/20 flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm font-medium text-legal-slate dark:text-white/90 ml-2">VakilGPT Chat Interface</span>
              </div>
              <ChatInterface />
            </div>
          </div>
          
          <div className="mt-12 text-center fade-up-element">
            <p className="text-legal-muted dark:text-gray-300 mb-6">
              Ready to experience the full capabilities of VakilGPT for Indian legal research?
            </p>
            <Link to="/chat">
              <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white px-8 py-6 text-base group">
                Start Using VakilGPT
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Combined How It Works & Features Section */}
      <section id="features" className="py-24 px-4 bg-gradient-to-br from-legal-light via-white to-legal-light dark:from-legal-slate/20 dark:via-legal-slate/5 dark:to-legal-slate/20 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-36 -right-36 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl"></div>
            <div className="absolute -bottom-36 -left-36 w-96 h-96 rounded-full bg-purple-400/10 blur-3xl"></div>
          </div>

          <div className="text-center max-w-3xl mx-auto mb-16 fade-up-element">
            <motion.div 
              className="inline-flex items-center px-3 py-1 rounded-full bg-legal-accent/10 text-legal-accent text-sm font-medium mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              <span>AI-Powered Legal Assistant</span>
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-legal-slate dark:text-white mb-4 font-playfair"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              How <span className="text-legal-accent">VakilGPT</span> Transforms Your Legal Practice
            </motion.h2>
            
            <motion.p 
              className="text-legal-muted dark:text-gray-300 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Six powerful solutions designed specifically for Indian legal professionals to streamline workflows and enhance decision-making
            </motion.p>
          </div>
          
          <motion.div 
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {legalAiSolutions.map((solution, index) => (
              <motion.div 
                key={solution.title} 
                className="fade-up-element"
                variants={itemVariants}
              >
                <Card className="h-full border-legal-border/40 dark:border-legal-slate/20 bg-white/80 dark:bg-legal-slate/10 backdrop-blur-sm hover:shadow-elegant transition-all duration-300 overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${solution.color}`}></div>
                  <CardHeader className="relative pb-2">
                    <div className="absolute top-4 right-4 text-4xl font-bold text-gray-100 dark:text-gray-800 opacity-50 font-playfair">
                      {solution.stepNumber}
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${solution.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <solution.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-legal-slate dark:text-white">
                      {solution.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-legal-muted dark:text-gray-300">
                      {solution.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" className="text-legal-accent hover:text-legal-accent/90 hover:bg-legal-accent/10 p-0 h-8 group">
                      Learn More
                      <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link to="/chat">
              <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white px-8 py-6 text-base shadow-md hover:shadow-lg transition-all group">
                <RotateCw className="mr-2 h-4 w-4 animate-spin-slow" />
                Experience AI in Action
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-gradient-to-br from-legal-light via-white to-legal-light dark:from-legal-slate/20 dark:via-legal-slate/5 dark:to-legal-slate/20 transition-colors">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up-element">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-legal-accent/10 text-legal-accent text-sm font-medium mb-4">
              <Users className="h-4 w-4 mr-2" />
              <span>The VakilGPT Advantage</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-legal-slate dark:text-white mb-4 font-playfair">
              Transform Your <span className="text-legal-accent">Indian Legal Practice</span>
            </h2>
            <p className="text-legal-muted dark:text-gray-300 text-lg">
              Discover how VakilGPT can revolutionize your legal workflow with these powerful advantages
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div key={benefit.title} 
                className="fade-up-element" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="relative overflow-hidden h-full transition-all duration-300 hover:shadow-elevated border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
                  <CardHeader className="pb-2">
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-legal-accent/5"></div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-legal-accent to-purple-600 flex items-center justify-center mb-4">
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-legal-slate dark:text-white">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-legal-muted dark:text-gray-300 mb-4">{benefit.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-legal-slate dark:text-white">Efficiency</span>
                        <span className="text-legal-accent font-bold">{benefit.percentage}%</span>
                      </div>
                      <Progress value={benefit.percentage} className="h-2 bg-legal-border dark:bg-legal-slate/20" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          <div className="text-center fade-up-element mt-8">
            <Link to="/tools">
              <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white group">
                Explore All Benefits
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Review Section */}
      <ReviewSection />
      
      {/* Testimonials Section */}
      <section className="py-20 px-4 legal-gradient text-white">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 fade-up-element">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Indian Legal Professionals
            </h2>
            <p className="text-white/80 text-lg">
              See what India's top legal experts say about our platform.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[{
              quote: "VakilGPT has revolutionized how our firm handles Indian case law research. What used to take hours now takes minutes, allowing us to focus on client consultations and court appearances.",
              author: "Rajesh Sharma",
              role: "Senior Advocate, Delhi High Court",
              rating: 5
            }, {
              quote: "The document analysis capabilities are exceptional for Indian contracts. I've never seen AI so accurately parse complex legal language and extract key provisions while considering Indian contract law nuances.",
              author: "Priya Patel",
              role: "Corporate Counsel, Tech Mahindra",
              rating: 5
            }, {
              quote: "As a solo practitioner in Mumbai, VakilGPT gives me access to research capabilities that were previously only available to large firms. The Supreme Court citation feature is particularly valuable.",
              author: "Vikram Malhotra",
              role: "Independent Advocate, Mumbai",
              rating: 4
            }].map((testimonial, index) => <div key={testimonial.author} className="testimonial-card fade-up-element" style={{
              animationDelay: `${index * 100}ms`
            }}>
              <div className="flex mb-2">
                {Array.from({
                  length: 5
                }).map((_, i) => <svg key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-300' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>)}
              </div>
              <div className="text-xl font-serif mb-6">"{testimonial.quote}"</div>
              <div className="mt-4">
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-white/70 text-sm">{testimonial.role}</div>
              </div>
            </div>)}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-white dark:bg-legal-slate/5 transition-colors">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center fade-up-element bg-legal-accent/5 dark:bg-legal-accent/10 rounded-xl p-10 border border-legal-border dark:border-legal-slate/20 shadow-elegant">
            <h2 className="text-3xl md:text-4xl font-bold text-legal-slate mb-6">
              Ready to Transform Your Indian Legal Practice?
            </h2>
            <p className="text-legal-muted text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of Indian legal professionals who are using VakilGPT to work smarter, faster, and more effectively with Indian law.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chat">
                <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white px-8 py-6 text-base group">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/tools">
                <Button variant="outline" className="border-legal-border hover:bg-white text-legal-slate px-8 py-6 text-base">
                  Explore All Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>;
};

export default Index;
