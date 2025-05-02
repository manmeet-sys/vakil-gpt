
import React, { useState } from 'react';
import { BaseAnalyzer, AnalysisResult } from '@/components/practice-area-tools/base';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Scale } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const ChildCustodyAnalyzer = () => {
  const [childAge, setChildAge] = useState<number>(5);
  const [custodyType, setCustodyType] = useState('sole');
  const [parentingPattern, setParentingPattern] = useState('');
  const [childPreference, setChildPreference] = useState('');
  const [schoolLocation, setSchoolLocation] = useState('');
  const [parentingFactors, setParentingFactors] = useState({
    financialStability: false,
    emotionalBonding: false,
    parentalConflict: false,
    homeEnvironment: false,
    extendedFamily: false,
    healthConcerns: false
  });
  
  const [stabilityRating, setStabilityRating] = useState<number>(50);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  
  const handleParentingFactorChange = (factor: string, checked: boolean) => {
    setParentingFactors(prev => ({
      ...prev,
      [factor]: checked
    }));
  };
  
  const handleAnalyze = () => {
    // Generate analysis based on inputs
    const results: AnalysisResult[] = [];
    
    // Child's age analysis
    if (childAge < 5) {
      results.push({
        title: "Tender Years Consideration",
        description: "Courts often consider the 'tender years doctrine' for very young children, which may favor the mother unless specific circumstances suggest otherwise.",
        severity: 'info'
      });
    } else if (childAge >= 12) {
      results.push({
        title: "Child's Preference Significant",
        description: `At age ${childAge}, the court will give considerable weight to the child's preference, though it's not the sole determining factor.`,
        severity: 'info'
      });
    }
    
    // Custody type analysis
    if (custodyType === 'sole') {
      results.push({
        title: "Sole Custody Considerations",
        description: "Courts require substantial evidence to grant sole custody, as shared parenting is generally preferred unless it would be detrimental to the child's welfare.",
        severity: 'medium'
      });
    } else if (custodyType === 'joint') {
      results.push({
        title: "Joint Custody Factors",
        description: "Joint custody requires demonstrated ability of parents to cooperate and make decisions together. Courts will assess communication patterns and willingness to co-parent.",
        severity: 'info'
      });
    }
    
    // Stability rating
    if (stabilityRating < 30) {
      results.push({
        title: "Stability Concerns",
        description: "Low stability rating raises concerns. Courts strongly favor environments that provide consistency in residence, education, and daily routine.",
        severity: 'high'
      });
    } else if (stabilityRating > 70) {
      results.push({
        title: "Strong Stability Indicators",
        description: "High stability indicators are favorable. Courts typically prefer to maintain established patterns that are working well for the child.",
        severity: 'low'
      });
    }
    
    // Child preference
    if (childPreference && childAge >= 12) {
      results.push({
        title: "Child's Preference Noted",
        description: `The child's preference for ${childPreference} will be considered along with other welfare factors, particularly given the child's age.`,
        severity: 'info'
      });
    }
    
    // School continuity
    if (schoolLocation) {
      results.push({
        title: "Educational Continuity",
        description: "Courts favor arrangements that minimize disruption to the child's education. Proximity to current school is a positive factor.",
        severity: 'low'
      });
    }
    
    // Parenting factors
    if (parentingFactors.parentalConflict) {
      results.push({
        title: "High Conflict Concern",
        description: "High conflict between parents is a significant negative factor. Courts may favor the parent who demonstrates better willingness to facilitate relationship with the other parent.",
        severity: 'high'
      });
    }
    
    if (parentingFactors.financialStability) {
      results.push({
        title: "Financial Stability",
        description: "While financial capacity is considered, it's not determinative if basic needs can be met. Courts may order maintenance to address disparities.",
        severity: 'low'
      });
    }
    
    if (parentingFactors.emotionalBonding) {
      results.push({
        title: "Emotional Bond Strength",
        description: "Strong emotional bonding is a critical factor. Courts assess quality of time and emotional security provided by each parent.",
        severity: 'info'
      });
    }
    
    if (parentingFactors.homeEnvironment) {
      results.push({
        title: "Home Environment Assessment",
        description: "Appropriate housing and living conditions are important factors. Courts assess if the environment is conducive to healthy development.",
        severity: 'info'
      });
    }
    
    // Add a summary based on all factors
    results.push({
      title: "Welfare Principle Application",
      description: "Indian courts apply the paramount consideration of child welfare, as established in Gaurav Nagpal v. Sumedha Nagpal. This holistic assessment outweighs any single factor.",
      severity: 'info'
    });
    
    setAnalysisResults(results);
  };
  
  return (
    <BaseAnalyzer
      title="Child Custody Analysis Tool"
      description="Analyze custody cases based on welfare principle and relevant factors under Indian law"
      icon={<Scale className="h-5 w-5 text-blue-600" />}
      onAnalyze={handleAnalyze}
      analysisResults={analysisResults}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="child-age">Child's Age</Label>
          <Input 
            id="child-age"
            type="number" 
            value={childAge.toString()} 
            onChange={(e) => setChildAge(Number(e.target.value))}
            min="0"
            max="18"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="custody-type">Custody Type Being Sought</Label>
          <Select 
            value={custodyType} 
            onValueChange={setCustodyType}
          >
            <SelectTrigger className="w-full" id="custody-type">
              <SelectValue placeholder="Select Custody Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sole">Sole Custody</SelectItem>
              <SelectItem value="joint">Joint Custody</SelectItem>
              <SelectItem value="visitation">Visitation Rights</SelectItem>
              <SelectItem value="split">Split Custody (Multiple Children)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stability">Stability of Current Living Arrangement</Label>
          <div className="pt-2 pb-6">
            <Slider
              value={[stabilityRating]}
              max={100}
              step={1}
              onValueChange={(val) => setStabilityRating(val[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs mt-1 text-muted-foreground">
              <span>Unstable</span>
              <span>{stabilityRating}%</span>
              <span>Very Stable</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Relevant Factors</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="financial-stability"
                checked={parentingFactors.financialStability}
                onCheckedChange={(checked) => 
                  handleParentingFactorChange('financialStability', checked === true)}
              />
              <Label htmlFor="financial-stability">Financial Stability Concerns</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="emotional-bonding"
                checked={parentingFactors.emotionalBonding}
                onCheckedChange={(checked) => 
                  handleParentingFactorChange('emotionalBonding', checked === true)}
              />
              <Label htmlFor="emotional-bonding">Strong Emotional Bonding</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="parental-conflict"
                checked={parentingFactors.parentalConflict}
                onCheckedChange={(checked) => 
                  handleParentingFactorChange('parentalConflict', checked === true)}
              />
              <Label htmlFor="parental-conflict">High Parental Conflict</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="home-environment"
                checked={parentingFactors.homeEnvironment}
                onCheckedChange={(checked) => 
                  handleParentingFactorChange('homeEnvironment', checked === true)}
              />
              <Label htmlFor="home-environment">Suitable Home Environment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="extended-family"
                checked={parentingFactors.extendedFamily}
                onCheckedChange={(checked) => 
                  handleParentingFactorChange('extendedFamily', checked === true)}
              />
              <Label htmlFor="extended-family">Extended Family Support</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="health-concerns"
                checked={parentingFactors.healthConcerns}
                onCheckedChange={(checked) => 
                  handleParentingFactorChange('healthConcerns', checked === true)}
              />
              <Label htmlFor="health-concerns">Health/Special Needs Concerns</Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="child-preference">Child's Preference (if applicable)</Label>
          <Input 
            id="child-preference"
            placeholder="Enter child's stated preference"
            value={childPreference}
            onChange={(e) => setChildPreference(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="school-location">School Location & Continuity</Label>
          <Input 
            id="school-location"
            placeholder="Describe current school situation"
            value={schoolLocation}
            onChange={(e) => setSchoolLocation(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="parenting-pattern">Current Parenting Pattern</Label>
          <Textarea 
            id="parenting-pattern"
            placeholder="Describe current custody arrangement and parenting time"
            value={parentingPattern}
            onChange={(e) => setParentingPattern(e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </BaseAnalyzer>
  );
};

export default ChildCustodyAnalyzer;
