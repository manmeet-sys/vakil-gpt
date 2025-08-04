
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield, FileCheck, Calculator, Briefcase, TrendingUp, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

// Import compliance tool components
import GdprComplianceComponent from '@/components/compliance/GdprComplianceComponent';
import AmlComplianceComponent from '@/components/compliance/AmlComplianceComponent';
import TaxComplianceComponent from '@/components/compliance/TaxComplianceComponent';
import StartupToolkitComponent from '@/components/compliance/StartupToolkitComponent';
import DueDiligenceComponent from '@/components/compliance/DueDiligenceComponent';
import IpProtectionComponent from '@/components/compliance/IpProtectionComponent';

const ComplianceAssistancePage = () => {
  const [activeTab, setActiveTab] = useState('gdpr');

  const complianceTools = [
    {
      id: 'gdpr',
      title: 'GDPR & DPDP Compliance',
      description: 'Data protection compliance for Indian and European regulations',
      icon: <Shield className="w-5 h-5" />,
      component: GdprComplianceComponent,
      badge: 'Critical'
    },
    {
      id: 'aml',
      title: 'AML & KYC Compliance',
      description: 'Anti-money laundering and Know Your Customer compliance checks',
      icon: <FileCheck className="w-5 h-5" />,
      component: AmlComplianceComponent,
      badge: 'High Risk'
    },
    {
      id: 'tax',
      title: 'Tax Compliance',
      description: 'Indian tax law compliance including GST, Income Tax, and TDS',
      icon: <Calculator className="w-5 h-5" />,
      component: TaxComplianceComponent,
      badge: 'Regulatory'
    },
    {
      id: 'startup',
      title: 'Startup Toolkit',
      description: 'Legal compliance for startups and new businesses in India',
      icon: <Briefcase className="w-5 h-5" />,
      component: StartupToolkitComponent,
      badge: 'Business'
    },
    {
      id: 'due-diligence',
      title: 'M&A Due Diligence',
      description: 'Due diligence analysis for mergers and acquisitions',
      icon: <TrendingUp className="w-5 h-5" />,
      component: DueDiligenceComponent,
      badge: 'Corporate'
    },
    {
      id: 'ip-protection',
      title: 'IP Protection',
      description: 'Intellectual property protection and analysis',
      icon: <Building className="w-5 h-5" />,
      component: IpProtectionComponent,
      badge: 'Assets'
    }
  ];

  const activeTool = complianceTools.find(tool => tool.id === activeTab);
  const ActiveComponent = activeTool?.component;


  return (
    <LegalToolLayout
      title="Compliance Assistance Hub"
      description="Comprehensive AI-powered compliance tools for Indian regulations including GDPR, AML, Tax, and more."
      icon={<Shield className="w-6 h-6 text-blue-600" />}
    >
      <div className="space-y-6">
        {/* Tool Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {complianceTools.map((tool) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  activeTab === tool.id 
                    ? 'ring-2 ring-primary border-primary/50 bg-primary/5' 
                    : 'hover:border-primary/30'
                }`}
                onClick={() => setActiveTab(tool.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${
                        activeTab === tool.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {tool.icon}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">{tool.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            tool.badge === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                            tool.badge === 'High Risk' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                            tool.badge === 'Regulatory' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                            tool.badge === 'Business' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            tool.badge === 'Corporate' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                          }`}>
                            {tool.badge}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{tool.description}</p>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Active Tool Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {ActiveComponent && <ActiveComponent />}
          </motion.div>
        </AnimatePresence>
      </div>
    </LegalToolLayout>
  );
};

export default ComplianceAssistancePage;
