
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Sparkles, CheckCircle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ExploreToolsSection = () => {
  // Animation variants
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

  // Categories to showcase
  const featuredCategories = [
    {
      title: "Advocate Tools",
      description: "Case management, deadlines & billing",
      icon: <CheckCircle className="h-5 w-5 text-white" />,
      color: "from-blue-600 to-blue-800",
      textColor: "text-blue-50",
      path: "/tools#advocate-tools"
    },
    {
      title: "AI Assistant",
      description: "24/7 legal Q&A and document analysis",
      icon: <Sparkles className="h-5 w-5 text-white" />,
      color: "from-purple-600 to-indigo-700",
      textColor: "text-purple-50",
      path: "/tools#ai-assistance"
    },
    {
      title: "Legal Research",
      description: "Case law, statutes & knowledge base",
      icon: <Compass className="h-5 w-5 text-white" />,
      color: "from-amber-500 to-orange-700",
      textColor: "text-amber-50",
      path: "/tools#legal-research"
    },
    {
      title: "Compliance",
      description: "DPDP, AML & contract management",
      icon: <Shield className="h-5 w-5 text-white" />,
      color: "from-emerald-600 to-green-700",
      textColor: "text-emerald-50",
      path: "/tools#document-automation"
    }
  ];

  return (
    <section className="py-16 px-4 relative overflow-hidden bg-white dark:bg-legal-slate/5 rounded-2xl shadow-elegant border border-gray-100 dark:border-gray-800">
      {/* Background decorative elements with enhanced glass effect */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-legal-accent blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-purple-600 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-legal-accent/10 text-legal-accent mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Compass className="h-4 w-4" />
            <span className="text-sm font-medium">Discover Your Legal Arsenal</span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-legal-slate dark:text-white mb-4 tracking-tight font-playfair"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Explore <span className="text-legal-accent">Legal & Financial</span> Tools
          </motion.h2>
          
          <motion.p 
            className="text-legal-muted dark:text-gray-300 max-w-2xl text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            AI-powered solutions tailored for Indian legal professionals
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featuredCategories.map((category, index) => (
            <motion.div key={category.title} variants={itemVariants}>
              <Link to={category.path} className="block h-full">
                <Card className={cn(
                  "h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group",
                  "bg-gradient-to-br", category.color
                )}>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4">
                      {category.icon}
                    </div>
                    <div className={cn("font-bold text-xl mb-2", category.textColor)}>
                      {category.title}
                    </div>
                    <p className={cn("text-sm opacity-90 mb-4", category.textColor)}>
                      {category.description}
                    </p>
                    <div className="mt-auto">
                      <span className={cn("inline-flex items-center text-sm font-medium", category.textColor)}>
                        Explore Tools
                        <ArrowRight className="ml-1 h-3.5 w-3.5 transform transition-transform group-hover:translate-x-1 duration-200" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/tools">
            <Button variant="outline" size="lg" className="rounded-full border-legal-accent/30 text-legal-accent hover:bg-legal-accent/10 hover:text-legal-accent group">
              <Sparkles className="mr-2 h-4 w-4" />
              View All 30+ Legal Tools
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ExploreToolsSection;
