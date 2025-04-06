
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Briefcase } from 'lucide-react';
import StartupToolkitTool from '@/components/StartupToolkitTool';
import BackButton from '@/components/BackButton';

const StartupToolkitPage = () => {
  return (
    <LegalToolLayout
      title="Indian Startup Legal Toolkit"
      description="Comprehensive legal resources for startups operating in India, including entity formation, compliance, funding, and IP protection."
      icon={<Briefcase className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      <StartupToolkitTool />
    </LegalToolLayout>
  );
};

export default StartupToolkitPage;
