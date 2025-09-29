import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatInterface from '@/components/ChatInterface';
import FeatureCard from '@/components/FeatureCard';

import ReviewSection from '@/components/ReviewSection';
import { Gavel, Scale, FileText, Shield, BookOpen, CheckCircle, ArrowRight, Search, Settings, User, Users, Sparkle, Compass, Sparkles, RotateCw, MessageSquare, Coins } from 'lucide-react';
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
    description: "Upload contracts & agreements for AI-powered insights",
    icon: FileText,
    stepNumber: "01",
    color: "from-blue-600 to-indigo-700"
  },
  {
    title: "Ask Questions",
    description: "Get precise answers with references to Indian statutes",
    icon: MessageSquare,
    stepNumber: "02",
    color: "from-purple-600 to-pink-500"
  },
  {
    title: "Case Law Research",
    description: "Find precedents that strengthen your arguments",
    icon: Gavel,
    stepNumber: "03",
    color: "from-amber-500 to-orange-600"
  },
  {
    title: "Customize Experience",
    description: "Add your documents to the knowledge base",
    icon: Settings,
    stepNumber: "04",
    color: "from-emerald-500 to-teal-600"
  },
  {
    title: "Compliance Assistance",
    description: "Stay current with regulatory changes across industries",
    icon: Shield,
    stepNumber: "05",
    color: "from-rose-500 to-red-600"
  },
  {
    title: "Due Diligence Support",
    description: "Streamline due diligence with automated document review",
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-legal-slate dark:text-legal-light leading-tight text-balance font-playfair">
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
              <Link to="/pricing">
                <Button variant="outline" className="border-legal-border hover:bg-legal-light dark:hover:bg-legal-slate/20 text-legal-slate dark:text-white/90 text-base px-6 py-6 w-full sm:w-auto">
                  <Coins className="mr-2 h-4 w-4" />
                  View Pricing
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
              <Sparkles className="h-4 w-4 mr-2" />
              <span>VakilGPT Demo</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-legal-slate dark:text-white mb-4 font-playfair">
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
          
          {/* Tools Preview Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Explore Legal Tools
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                AI-powered solutions tailored for Indian legal professionals
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Advocate Tools", desc: "Case management & billing", icon: CheckCircle },
                { title: "AI Assistant", desc: "24/7 legal Q&A", icon: Sparkles },
                { title: "Legal Research", desc: "Case law & statutes", icon: Compass },
                { title: "Compliance", desc: "DPDP & AML tools", icon: Shield }
              ].map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <item.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/tools">
                <Button size="lg">
                  View All Tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
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
      
      {/* ENHANCED: How It Works & Features Section with reduced text and more visual appeal */}
      <section id="features" className="py-24 px-4 bg-gradient-to-br from-legal-light via-white to-legal-light dark:from-legal-slate/20 dark:via-legal-slate/5 dark:to-legal-slate/20 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl animate-pulse"></div>
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
              How <span className="text-legal-accent">VakilGPT</span> Transforms Your Practice
            </motion.h2>
          </div>
          
          <motion.div 
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {legalAiSolutions.map((solution, index) => (
              <motion.div 
                key={solution.title} 
                className="fade-up-element"
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.2 } 
                }}
              >
                <Card className="h-full border-legal-border/40 dark:border-legal-slate/20 bg-white/90 dark:bg-legal-slate/10 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
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
      
      {/* Benefits Section - Keeping it more concise */}
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
        </div>
      </section>
      
      {/* Creative Reviews Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-pink-950/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-purple-300/20 to-transparent dark:from-purple-500/10 blur-3xl rounded-full transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-gradient-to-tr from-indigo-300/20 to-transparent dark:from-indigo-500/10 blur-3xl rounded-full transform -translate-x-1/4 translate-y-1/4"></div>
        
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 fade-up-element">
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-legal-accent/10 text-legal-accent mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">Client Experiences</span>
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-legal-slate dark:text-white mb-4 tracking-tight font-playfair"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              How VakilGPT <span className="text-legal-accent">Transforms Legal Practices</span>
            </motion.h2>
          </div>
          
          <ReviewSection />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-white dark:bg-legal-slate/5 transition-colors">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center fade-up-element bg-gradient-to-br from-legal-accent/5 to-purple-500/5 dark:from-legal-accent/10 dark:to-purple-500/10 rounded-xl p-10 border border-legal-border dark:border-legal-slate/20 shadow-elegant">
            <h2 className="text-3xl md:text-4xl font-bold text-legal-slate mb-6 font-playfair">
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
