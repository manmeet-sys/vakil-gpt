
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ArrowRight, Clock, Zap, Gift, CalendarClock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const PricingPage = () => {
  const [annual, setAnnual] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Simulated countdown to end of free beta
  const [countdown, setCountdown] = useState({
    days: 30,
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simulate countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleSignUp = () => {
    if (!isAuthenticated) {
      toast.info("Create your free account to continue", {
        description: "Sign up to access all features during our beta period.",
        action: {
          label: "Sign Up",
          onClick: () => window.location.href = "/signup"
        }
      });
    } else {
      toast.success("You're already signed up for our free beta!", {
        description: "Enjoy all premium features at no cost during our beta period."
      });
    }
  };
  
  const plans = [
    {
      name: "Basic",
      description: "Essential legal AI tools for individuals",
      price: annual ? "₹399" : "₹49",
      period: annual ? "/year" : "/month",
      currentBadge: "FREE During Beta",
      color: "bg-gray-100 dark:bg-gray-800",
      features: [
        "Basic legal chat assistance",
        "Document analysis (3/month)",
        "Access to standard templates",
        "Email support",
        "Limited legal research"
      ],
      notIncluded: [
        "Priority responses",
        "Advanced features",
        "API access"
      ],
      cta: "Get Started Free"
    },
    {
      name: "Professional",
      description: "Advanced features for legal professionals",
      price: annual ? "₹4,999" : "₹599",
      period: annual ? "/year" : "/month",
      discount: annual ? "Save ₹1,189" : null,
      currentBadge: "FREE During Beta",
      color: "bg-gradient-to-b from-legal-accent/10 to-legal-accent/5",
      popular: true,
      features: [
        "Everything in Basic",
        "Unlimited document analysis",
        "Advanced legal research",
        "Case law citations",
        "Custom document templates",
        "Priority support",
        "Litigation prediction tools"
      ],
      notIncluded: [
        "Enterprise features",
        "Dedicated account manager"
      ],
      cta: "Get Started Free"
    },
    {
      name: "Enterprise",
      description: "Customized solutions for law firms & corporates",
      price: "Custom",
      period: "",
      currentBadge: "Contact Us",
      color: "bg-gradient-to-b from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/10",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom AI model training",
        "API access",
        "Team collaboration tools",
        "Advanced analytics",
        "SLA guarantees",
        "Custom integrations"
      ],
      cta: "Contact Sales"
    }
  ];

  return (
    <AppLayout>
      <Helmet>
        <title>Pricing | VakilGPT</title>
        <meta name="description" content="VakilGPT pricing plans - Free during beta, premium features for legal professionals" />
      </Helmet>
      
      <div className="container mx-auto py-12 px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Free during our beta period, premium features coming soon
          </p>
          
          {/* Free Beta Countdown Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 shadow-lg text-white mb-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gift className="h-5 w-5" />
                <h3 className="font-bold text-lg">Free Beta Access Period</h3>
              </div>
              
              <p className="text-white/90 mb-4">All premium features available at no cost during our beta testing phase</p>
              
              <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                <div className="bg-white/20 rounded-lg p-2 text-center">
                  <span className="font-bold text-2xl">{countdown.days}</span>
                  <span className="block text-xs">Days</span>
                </div>
                <div className="bg-white/20 rounded-lg p-2 text-center">
                  <span className="font-bold text-2xl">{countdown.hours}</span>
                  <span className="block text-xs">Hours</span>
                </div>
                <div className="bg-white/20 rounded-lg p-2 text-center">
                  <span className="font-bold text-2xl">{countdown.minutes}</span>
                  <span className="block text-xs">Minutes</span>
                </div>
                <div className="bg-white/20 rounded-lg p-2 text-center">
                  <span className="font-bold text-2xl">{countdown.seconds}</span>
                  <span className="block text-xs">Seconds</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${annual ? 'text-gray-500' : 'font-semibold text-gray-900 dark:text-white'}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                annual ? 'bg-legal-accent' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`${
                  annual ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
            <span className={`ml-3 flex items-center ${annual ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              Yearly <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200 text-xs">Save 20%</Badge>
            </span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={plan.name}
              className={`rounded-xl overflow-hidden border ${
                plan.popular 
                  ? 'border-legal-accent shadow-lg shadow-legal-accent/10' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="bg-legal-accent text-white text-center py-1.5 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className={`p-6 ${plan.color}`}>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{plan.description}</p>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400 pb-1">{plan.period}</span>
                  </div>
                  {plan.discount && (
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">{plan.discount}</span>
                  )}
                  
                  <div className="mt-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/50 flex items-center gap-1 w-fit">
                      <Gift className="h-3 w-3" />
                      {plan.currentBadge}
                    </Badge>
                  </div>
                </div>
                
                <Button 
                  className={`w-full ${
                    plan.popular
                      ? 'bg-legal-accent hover:bg-legal-accent/90 text-white'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={plan.name === 'Enterprise' ? () => window.location.href = 'mailto:Manmeetsingh20378@gmail.com' : handleSignUp}
                >
                  {plan.cta}
                </Button>
              </div>
              
              <div className="p-6 bg-white dark:bg-gray-800">
                <div className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.notIncluded && plan.notIncluded.map((feature, i) => (
                    <div key={i} className="flex text-gray-400">
                      <X className="h-5 w-5 shrink-0 mr-3" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8 text-left">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">When will the beta period end?</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We're currently in beta and all features are free. When we transition to paid plans, we'll notify all users at least 30 days in advance.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Will my data be transferred after beta?</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes, all your data and documents will remain available when we transition from beta to our official launch.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Can I cancel anytime?</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes, when paid plans are introduced, you'll be able to cancel your subscription at any time with no questions asked.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Do you offer discounts?</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We'll offer special discounts for students, non-profits, and educational institutions. Contact us for details.
              </p>
            </div>
          </div>
          
          <div className="mt-10">
            <Link to="/terms-of-service" className="text-legal-accent hover:underline inline-flex items-center">
              View our Terms of Service <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PricingPage;
