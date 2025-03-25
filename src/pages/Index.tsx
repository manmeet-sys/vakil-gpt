
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatInterface from '@/components/ChatInterface';
import FeatureCard from '@/components/FeatureCard';
import { Gavel, Scale, FileText, Shield, BookOpen, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: FileText,
    title: 'Legal Document Analysis',
    description: 'Upload and analyze contracts, agreements, and legal documents with AI-powered insights.'
  },
  {
    icon: Gavel,
    title: 'Case Law Research',
    description: 'Access comprehensive case law research across jurisdictions with intelligent search capabilities.'
  },
  {
    icon: Shield,
    title: 'Compliance Assistance',
    description: 'Stay compliant with evolving regulations through personalized guidance and alerts.'
  },
  {
    icon: Scale,
    title: 'Legal Risk Assessment',
    description: 'Identify potential legal risks in your business operations with predictive analysis.'
  },
  {
    icon: BookOpen,
    title: 'Legal Education',
    description: 'Learn about legal concepts and procedures with easy-to-understand explanations.'
  },
  {
    icon: CheckCircle,
    title: 'Due Diligence Support',
    description: 'Streamline due diligence processes with automated document review and flagging.'
  }
];

const benefits = [
  {
    title: 'Save Time',
    description: 'Reduce research time by up to 70% with instant access to relevant legal information.'
  },
  {
    title: 'Reduce Costs',
    description: 'Lower legal consultation costs by addressing preliminary questions through AI.'
  },
  {
    title: 'Increase Accuracy',
    description: 'Enhance accuracy with AI analysis trained on millions of legal documents and cases.'
  },
  {
    title: 'Stay Informed',
    description: 'Keep up with changing laws and regulations through real-time updates and alerts.'
  }
];

const Index = () => {
  useEffect(() => {
    const inViewObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          inViewObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

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

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden hero-pattern">
        <div className="absolute inset-0 z-0 hero-pattern opacity-50" />
        <div className="container mx-auto grid gap-12 md:grid-cols-2 items-center z-10">
          <div className="max-w-xl space-y-6 fade-up-element">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-legal-accent/10 text-legal-accent text-sm font-medium mb-2">
              Intelligent Legal Assistance
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-legal-slate leading-tight text-balance">
              AI-Powered Legal <span className="text-legal-accent">Intelligence</span> at Your Fingertips
            </h1>
            <p className="text-lg text-legal-muted max-w-lg">
              Transform your legal research and document analysis with advanced AI. Get instant answers, insights, and guidance on legal matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white text-base px-6 py-6">
                Start Free Trial
              </Button>
              <Button variant="outline" className="border-legal-border hover:bg-legal-light text-legal-slate text-base px-6 py-6">
                Watch Demo
              </Button>
            </div>
            <div className="pt-4 flex items-center space-x-4 text-sm text-legal-muted">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="w-8 h-8 rounded-full border-2 border-white bg-legal-light overflow-hidden">
                    <div className={`w-full h-full bg-legal-accent/[0.${n*2}]`}></div>
                  </div>
                ))}
              </div>
              <span>Join over <strong className="text-legal-slate">10,000+</strong> legal professionals</span>
            </div>
          </div>
          
          <div className="fade-up-element delay-200 order-first md:order-last">
            <div className="relative">
              <div className="absolute inset-0 -right-6 -bottom-6 rounded-xl bg-legal-accent/10 transform rotate-3" />
              <div className="glass-container shadow-elegant rounded-xl overflow-hidden transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1589578527966-fdac0f44566c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2852&q=80"
                  alt="Legal professional with AI assistant"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#features" className="flex flex-col items-center text-legal-muted hover:text-legal-accent transition-colors">
            <span className="text-sm font-medium mb-2">Discover More</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-legal-slate/5">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up-element">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-legal-accent/10 text-legal-accent text-sm font-medium mb-4">
              Powerful Capabilities
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-legal-slate mb-4">
              Comprehensive Legal AI Features
            </h2>
            <p className="text-legal-muted text-lg">
              Discover how LegalGPT can transform your legal workflows with state-of-the-art artificial intelligence.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={feature.title} className="fade-up-element" style={{ animationDelay: `${index * 100}ms` }}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-legal-light dark:bg-legal-slate/10">
        <div className="container mx-auto">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="fade-up-element">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-legal-accent/10 text-legal-accent text-sm font-medium mb-4">
                Why Choose LegalGPT
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-legal-slate mb-6">
                Transform Your Legal Practice
              </h2>
              <p className="text-legal-muted text-lg mb-8">
                Our AI-powered platform helps legal professionals work more efficiently, reduce costs, and deliver better results for their clients.
              </p>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={benefit.title} className="flex fade-up-element" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex-shrink-0 mr-4 mt-1">
                      <div className="w-6 h-6 rounded-full bg-legal-accent/20 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-legal-accent" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-legal-slate mb-1">{benefit.title}</h3>
                      <p className="text-legal-muted">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="fade-up-element">
              <div className="relative">
                <div className="absolute inset-0 -left-6 -bottom-6 rounded-xl bg-legal-accent/10 transform -rotate-3" />
                <div className="glass-container shadow-elegant rounded-xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2371&q=80"
                    alt="Legal professional with AI benefits"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Demo Section */}
      <section id="demo" className="py-20 px-4 bg-white dark:bg-legal-slate/5">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 fade-up-element">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-legal-accent/10 text-legal-accent text-sm font-medium mb-4">
              Try It Now
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-legal-slate mb-4">
              Experience LegalGPT in Action
            </h2>
            <p className="text-legal-muted text-lg">
              Ask a legal question and see how our AI can provide insightful, relevant information to assist you.
            </p>
          </div>
          
          <div className="fade-up-element">
            <ChatInterface />
          </div>
          
          <div className="mt-12 text-center fade-up-element">
            <p className="text-legal-muted mb-6">
              Ready to experience the full capabilities of LegalGPT?
            </p>
            <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white px-8 py-6 text-base">
              Start Your Free Trial
            </Button>
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
            {[
              {
                quote: "LegalGPT has revolutionized how our firm handles research. What used to take hours now takes minutes.",
                author: "Sarah Johnson",
                role: "Senior Partner, Johnson & Associates"
              },
              {
                quote: "The document analysis capabilities are exceptional. I've never seen AI so accurately parse legal language.",
                author: "Michael Chen",
                role: "Corporate Counsel, Tech Innovations Inc."
              },
              {
                quote: "As a solo practitioner, LegalGPT gives me the research capabilities of a large firm. It's a game changer.",
                author: "Rebecca Martinez",
                role: "Independent Attorney"
              }
            ].map((testimonial, index) => (
              <div 
                key={testimonial.author} 
                className="bg-white/10 backdrop-blur-xs p-8 rounded-lg fade-up-element"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-xl font-serif mb-6">"{testimonial.quote}"</div>
                <div className="mt-4">
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-white/70 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-legal-light dark:bg-legal-slate/10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center fade-up-element">
            <h2 className="text-3xl md:text-4xl font-bold text-legal-slate mb-6">
              Ready to Transform Your Legal Practice?
            </h2>
            <p className="text-legal-muted text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of legal professionals who are using LegalGPT to work smarter, faster, and more effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white px-8 py-6 text-base">
                Start Free Trial
              </Button>
              <Button variant="outline" className="border-legal-border hover:bg-white text-legal-slate px-8 py-6 text-base">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Index;
