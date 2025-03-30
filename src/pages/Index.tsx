import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatInterface from '@/components/ChatInterface';
import FeatureCard from '@/components/FeatureCard';
import AllTools from '@/components/AllTools';
import { Gavel, Scale, FileText, Shield, BookOpen, CheckCircle, ArrowRight, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const features = [{
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
}];

const benefits = [{
  title: 'Save Time',
  description: 'Reduce legal research time by up to 70% with instant access to relevant information, automated document analysis, and AI-powered summaries.',
  percentage: 70
}, {
  title: 'Reduce Costs',
  description: 'Lower legal consultation costs by addressing preliminary questions through AI. Our clients report average savings of 40% on outside counsel expenses.',
  percentage: 40
}, {
  title: 'Increase Accuracy',
  description: 'Enhance accuracy with AI analysis trained on millions of legal documents and cases. Reduce human error and achieve consistent, data-driven results.',
  percentage: 90
}, {
  title: 'Stay Informed',
  description: 'Keep up with changing laws and regulations through real-time updates and alerts. Never miss an important regulatory change that affects your business.',
  percentage: 95
}];

const howItWorks = [{
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
}];

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

  return <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden hero-pattern">
        <div className="absolute inset-0 z-0 hero-pattern opacity-50" />
        <div className="container mx-auto grid gap-12 md:grid-cols-2 items-center z-10">
          <div className="max-w-xl space-y-6 fade-up-element">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-legal-accent/10 text-legal-accent text-sm font-medium mb-2">
              AI-Powered Legal Assistance
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-legal-slate dark:text-white leading-tight text-balance">
              Transform Your Legal <span className="text-legal-accent">Research & Analysis</span>
            </h1>
            <p className="text-lg text-legal-muted dark:text-gray-300 max-w-lg">
              PrecedentAI helps legal professionals work smarter with advanced document analysis, case research, and regulatory compliance tools powered by cutting-edge artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/chat">
                <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white text-base px-6 py-6 w-full sm:w-auto group">
                  Try PrecedentAI Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/tools">
                <Button variant="outline" className="border-legal-border hover:bg-legal-light dark:hover:bg-legal-slate/20 text-legal-slate dark:text-white/90 text-base px-6 py-6 w-full sm:w-auto">
                  Explore All Tools
                </Button>
              </Link>
            </div>
            <div className="pt-4 flex items-center space-x-4 text-sm text-legal-muted dark:text-gray-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(n => <div key={n} className="w-8 h-8 rounded-full border-2 border-white dark:border-legal-slate/20 bg-legal-light dark:bg-legal-slate/40 overflow-hidden">
                    <div className={`w-full h-full bg-legal-accent/[0.${n * 2}]`}></div>
                  </div>)}
              </div>
              <span>Trusted by <strong className="text-legal-slate dark:text-white/90">10,000+</strong> legal professionals worldwide</span>
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
      
      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white dark:bg-legal-slate/5 transition-colors">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 fade-up-element">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-legal-accent/10 text-legal-accent text-sm font-medium mb-4">
              Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-legal-slate mb-4">
              How PrecedentAI Works
            </h2>
            <p className="text-legal-muted text-lg">
              Our platform is designed to be intuitive and powerful, delivering valuable legal insights in seconds.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {howItWorks.map((step, index) => <Card key={step.title} className="fade-up-element border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10 shadow-elegant hover:shadow-elevated transition-all duration-300" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-legal-accent/10 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-legal-accent" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-legal-slate">{`${index + 1}. ${step.title}`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-legal-muted">{step.description}</p>
                </CardContent>
              </Card>)}
          </div>
          
          <div className="text-center fade-up-element">
            <Link to="/chat">
              <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white px-6 py-3">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-legal-light dark:bg-legal-slate/10 transition-colors">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up-element">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-legal-accent/10 text-legal-accent text-sm font-medium mb-4">
              Powerful Capabilities
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-legal-slate mb-4">
              Comprehensive Legal AI Services
            </h2>
            <p className="text-legal-muted text-lg">
              PrecedentAI offers a suite of AI-powered tools designed specifically for legal professionals to streamline workflows and enhance decision-making.
            </p>
            <div className="mt-6">
              <Link to="/tools">
                <Button className="bg-legal-accent/10 hover:bg-legal-accent/20 text-legal-accent px-6 py-2">
                  View All Tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {features.map((feature, index) => <div key={feature.title} className="fade-up-element" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
              </div>)}
          </div>
          
          <div className="mt-16 fade-up-element">
            <h3 className="text-2xl font-bold text-legal-slate dark:text-white mb-6 text-center">
              Explore All Legal & Financial Tools
            </h3>
            <AllTools />
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-white dark:bg-legal-slate/5 transition-colors">
        <div className="container mx-auto">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="fade-up-element">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-legal-accent/10 text-legal-accent text-sm font-medium mb-4">
                Why Choose PrecedentAI
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-legal-slate mb-6">
                Transform Your Legal Practice
              </h2>
              <p className="text-legal-muted text-lg mb-8">
                Our AI-powered platform helps legal professionals work more efficiently, reduce costs, and deliver better results for their clients.
              </p>
              
              <div className="space-y-8">
                {benefits.map((benefit, index) => <div key={benefit.title} className="fade-up-element" style={{
                animationDelay: `${index * 100}ms`
              }}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-legal-slate">{benefit.title}</h3>
                      <span className="text-legal-accent font-bold">{benefit.percentage}%</span>
                    </div>
                    <Progress value={benefit.percentage} className="h-2 mb-2" />
                    <p className="text-legal-muted">{benefit.description}</p>
                  </div>)}
              </div>
              
              <div className="mt-10">
                <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white group">
                  Explore Benefits
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
            
            <div className="fade-up-element">
              <div className="relative">
                <div className="absolute inset-0 -left-6 -bottom-6 rounded-xl bg-legal-accent/10 transform -rotate-3" />
                <div className="glass-container shadow-elegant rounded-xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2371&q=80" alt="Legal professional with AI benefits" className="w-full h-auto object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Demo Section */}
      <section id="demo" className="py-20 px-4 bg-legal-light dark:bg-legal-slate/10 transition-colors">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 fade-up-element">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-legal-accent/10 text-legal-accent text-sm font-medium mb-4">
              Interactive Demo
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-legal-slate dark:text-white mb-4">
              Experience PrecedentAI in Action
            </h2>
            <p className="text-legal-muted dark:text-gray-300 text-lg">
              Ask a legal question below and see how our AI can provide insightful, relevant information to assist your legal work.
            </p>
          </div>
          
          <div className="fade-up-element">
            <div className="bg-white dark:bg-legal-slate/20 rounded-xl shadow-elegant overflow-hidden border border-legal-border dark:border-legal-slate/20">
              <div className="p-4 bg-legal-accent/5 border-b border-legal-border dark:border-legal-slate/20 flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm font-medium text-legal-slate dark:text-white/90 ml-2">PrecedentAI Chat Interface</span>
              </div>
              <ChatInterface />
            </div>
          </div>
          
          <div className="mt-12 text-center fade-up-element">
            <p className="text-legal-muted dark:text-gray-300 mb-6">
              Ready to experience the full capabilities of PrecedentAI?
            </p>
            <Link to="/chat">
              <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white px-8 py-6 text-base group">
                Start Using PrecedentAI
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-4 legal-gradient text-white">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 fade-up-element">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Legal Professionals
            </h2>
            <p className="text-white/80 text-lg">
              See what legal experts are saying about our platform.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[{
            quote: "PrecedentAI has revolutionized how our firm handles research. What used to take hours now takes minutes, allowing us to focus on higher-value work for our clients.",
            author: "Sarah Johnson",
            role: "Senior Partner, Johnson & Associates",
            rating: 5
          }, {
            quote: "The document analysis capabilities are exceptional. I've never seen AI so accurately parse complex legal language and extract key provisions from contracts.",
            author: "Michael Chen",
            role: "Corporate Counsel, Tech Innovations Inc.",
            rating: 5
          }, {
            quote: "As a solo practitioner, PrecedentAI gives me the research capabilities of a large firm. The custom knowledge base feature is particularly valuable for my specialized practice.",
            author: "Rebecca Martinez",
            role: "Independent Attorney",
            rating: 4
          }].map((testimonial, index) => <div key={testimonial.author} className="bg-white/10 backdrop-blur-xs p-8 rounded-lg fade-up-element" style={{
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
              Ready to Transform Your Legal Practice?
            </h2>
            <p className="text-legal-muted text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of legal professionals who are using PrecedentAI to work smarter, faster, and more effectively.
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
