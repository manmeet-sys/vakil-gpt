
import React, { useState } from 'react';
import { MobileOptimizedCard } from '@/components/ui/mobile-optimized-card';
import { MobileButton } from '@/components/ui/mobile-button';
import { MobileInput, MobileTextarea } from '@/components/ui/mobile-input';
import { RichText } from '@/components/ui/rich-text';
import { Gavel, Loader2, Scale, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { getOpenAIResponse } from './OpenAIIntegration';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';

interface SentencingPredictorProps {
  // Define any props here
}

const SentencingPredictorTool: React.FC<SentencingPredictorProps> = () => {
  const [chargeDetails, setChargeDetails] = useState('');
  const [mitigatingFactors, setMitigatingFactors] = useState('');
  const [aggravatingFactors, setAggravatingFactors] = useState('');
  const [pastRecords, setPastRecords] = useState('');
  const [sentencingPrediction, setSentencingPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);

  const handlePredictSentencing = async () => {
    if (!chargeDetails.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide charge details to proceed with the prediction.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSentencingPrediction('');
    setConfidence(null);

    try {
      const prompt = `As an expert in Indian criminal law, analyze and predict the sentencing for the following case:

**Charge Details:** ${chargeDetails}
**Mitigating Factors:** ${mitigatingFactors || 'None specified'}
**Aggravating Factors:** ${aggravatingFactors || 'None specified'}
**Past Criminal Records:** ${pastRecords || 'None specified'}

Please provide:
1. **Predicted Sentence Range** with minimum and maximum penalties under Indian law
2. **Key Legal Provisions** applicable under IPC/CrPC/Special Acts
3. **Judicial Precedents** that may influence sentencing
4. **Risk Assessment** (High/Medium/Low) for different sentence outcomes
5. **Mitigating Strategies** for defense consideration
6. **Confidence Level** (percentage) of the prediction based on available information

Format the response in clear sections with proper legal citations where applicable.`;

      const response = await getOpenAIResponse(prompt);
      setSentencingPrediction(response);
      
      // Extract confidence level from response (simplified)
      const confidenceMatch = response.match(/confidence[:\s]*(\d+)%/i);
      if (confidenceMatch) {
        setConfidence(parseInt(confidenceMatch[1]));
      } else {
        setConfidence(75); // Default confidence
      }

      toast({
        title: "Prediction Complete",
        description: "Sentencing prediction has been generated successfully.",
      });
    } catch (error) {
      console.error("Error predicting sentencing:", error);
      toast({
        title: "Prediction Failed",
        description: "Failed to generate sentencing prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setChargeDetails('');
    setMitigatingFactors('');
    setAggravatingFactors('');
    setPastRecords('');
    setSentencingPrediction('');
    setConfidence(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className={cn(typography.heading.h1, "text-2xl md:text-3xl")}>
          Criminal Sentencing Predictor
        </h1>
        <p className={cn(typography.body.medium, "max-w-2xl mx-auto")}>
          AI-powered tool to predict potential sentencing outcomes for criminal cases under Indian law
        </p>
      </div>

      {/* Input Form */}
      <MobileOptimizedCard
        title="Case Information"
        description="Provide detailed information about the criminal case for accurate prediction"
        icon={<Scale className="h-5 w-5 text-blue-600" />}
      >
        <div className="space-y-6">
          <MobileTextarea
            label="Charge Details *"
            placeholder="Enter the criminal charges, sections of law involved, and case details..."
            value={chargeDetails}
            onChange={(e) => setChargeDetails(e.target.value)}
            description="Include IPC sections, specific charges, and case circumstances"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MobileTextarea
              label="Mitigating Factors"
              placeholder="First-time offender, cooperation with investigation, family circumstances..."
              value={mitigatingFactors}
              onChange={(e) => setMitigatingFactors(e.target.value)}
              description="Factors that may reduce the sentence"
            />
            
            <MobileTextarea
              label="Aggravating Factors"
              placeholder="Repeat offender, severity of crime, impact on victim..."
              value={aggravatingFactors}
              onChange={(e) => setAggravatingFactors(e.target.value)}
              description="Factors that may increase the sentence"
            />
          </div>
          
          <MobileTextarea
            label="Past Criminal Records"
            placeholder="Previous convictions, pending cases, criminal history..."
            value={pastRecords}
            onChange={(e) => setPastRecords(e.target.value)}
            description="Any prior criminal history or pending cases"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <MobileButton 
              onClick={handlePredictSentencing} 
              disabled={isLoading || !chargeDetails.trim()}
              className="flex-1"
              mobileSize="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Case...
                </>
              ) : (
                <>
                  <Gavel className="mr-2 h-5 w-5" />
                  Predict Sentencing
                </>
              )}
            </MobileButton>
            
            {(chargeDetails || mitigatingFactors || aggravatingFactors || pastRecords) && (
              <MobileButton 
                variant="outline" 
                onClick={clearForm}
                mobileSize="lg"
              >
                Clear Form
              </MobileButton>
            )}
          </div>
        </div>
      </MobileOptimizedCard>

      {/* Results */}
      <AnimatePresence>
        {sentencingPrediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MobileOptimizedCard
              title="Sentencing Prediction Results"
              description="AI-generated prediction based on Indian criminal law and case precedents"
              icon={<CheckCircle className="h-5 w-5 text-green-600" />}
            >
              <div className="space-y-4">
                {/* Confidence Indicator */}
                {confidence && (
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-blue-600" />
                      <span className={cn(typography.ui.label, "text-blue-800 dark:text-blue-200")}>
                        Prediction Confidence
                      </span>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                      {confidence}%
                    </Badge>
                  </div>
                )}

                {/* Prediction Content */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 md:p-6">
                  <RichText 
                    content={sentencingPrediction}
                    variant="expanded"
                    className="text-sm md:text-base"
                  />
                </div>

                {/* Disclaimer */}
                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800 dark:text-orange-200">
                    <strong>Legal Disclaimer:</strong> This prediction is generated by AI and should not be considered as professional legal advice. 
                    Actual sentencing may vary based on judicial discretion, additional evidence, and other factors. 
                    Consult with a qualified criminal lawyer for case-specific guidance.
                  </AlertDescription>
                </Alert>
              </div>
            </MobileOptimizedCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SentencingPredictorTool;
