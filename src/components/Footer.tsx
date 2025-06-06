
import React from 'react';
import { cn } from '@/lib/utils';
import AnimatedLogo from './AnimatedLogo';
import { Mail, Phone, Github, Linkedin, Twitter, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({
  className
}) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn("bg-legal-light dark:bg-legal-slate/10 border-t border-legal-border", className)}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <AnimatedLogo />
            <p className="mt-4 text-legal-muted text-sm max-w-xs">
              Advanced legal assistance powered by artificial intelligence.
            </p>
            <div className="mt-6">
              <h4 className="font-semibold text-legal-slate mb-2">Mahalaxmi Agencies</h4>
              <p className="text-legal-muted text-sm">New Delhi</p>
              <div className="mt-2 space-y-1">
                <a href="mailto:Manmeetsingh20378@gmail.com" className="flex items-center text-legal-muted hover:text-legal-accent transition-colors text-sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Manmeetsingh20378@gmail.com
                </a>
                <a href="tel:+919958580043" className="flex items-center text-legal-muted hover:text-legal-accent transition-colors text-sm">
                  <Phone className="h-4 w-4 mr-2" />
                  +91 9958580043
                </a>
                <a href="https://www.linkedin.com/in/manmeet-singh-272880326" target="_blank" rel="noopener noreferrer" className="flex items-center text-legal-muted hover:text-legal-accent transition-colors text-sm">
                  <Linkedin className="h-4 w-4 mr-2" />
                  Manmeet Singh
                </a>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-legal-slate mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-legal-muted hover:text-legal-accent transition-colors text-sm">Home</Link></li>
                <li><Link to="/tools" className="text-legal-muted hover:text-legal-accent transition-colors text-sm">Tools</Link></li>
                <li><Link to="/pricing" className="text-legal-muted hover:text-legal-accent transition-colors text-sm">Pricing</Link></li>
                <li><a href="mailto:Manmeetsingh20378@gmail.com" className="text-legal-muted hover:text-legal-accent transition-colors text-sm">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-legal-slate mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link to="/privacy-policy" className="text-legal-muted hover:text-legal-accent transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-legal-muted hover:text-legal-accent transition-colors text-sm">Terms of Service</Link></li>
                <li><Link to="/chat" className="text-legal-muted hover:text-legal-accent transition-colors text-sm">Legal Chat</Link></li>
                <li><Link to="/tools" className="text-legal-muted hover:text-legal-accent transition-colors text-sm">Legal Tools</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-legal-slate mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><Link to="/blog" className="text-legal-muted hover:text-legal-accent transition-colors text-sm">Blog</Link></li>
                <li><Link to="/guides" className="text-legal-muted hover:text-legal-accent transition-colors text-sm">Legal Guides</Link></li>
                <li><Link to="/faq" className="text-legal-muted hover:text-legal-accent transition-colors text-sm">FAQ</Link></li>
                <li><Link to="/chat" className="text-legal-muted hover:text-legal-accent transition-colors text-sm">Support</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-legal-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-legal-muted text-sm">
            &copy; {currentYear} VakilGPT. All rights reserved.
          </p>
          
          <p className="mt-2 md:mt-0 text-center text-sm font-extrabold text-slate-950">
            Made with ❤️ by <a href="mailto:Manmeetsingh20378@gmail.com" className="hover:text-legal-accent transition-colors">Manmeet Singh</a> & <a href="https://bhavychhabra.art" target="_blank" rel="noopener noreferrer" className="hover:text-legal-accent transition-colors">bhavychhabra.art</a>
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://twitter.com" className="text-legal-muted hover:text-legal-accent transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/company/preciselaw" target="_blank" rel="noopener noreferrer" className="text-legal-muted hover:text-legal-accent transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://github.com" className="text-legal-muted hover:text-legal-accent transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
