
import React, { useState } from 'react';
import { BaseCalculator } from '@/components/practice-area-tools/base';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  value: number;
  ownership: 'joint' | 'husband' | 'wife' | 'disputed';
  division: number; // percentage to Party 1 (0-100)
}

interface Liability {
  id: string;
  name: string;
  amount: number;
  responsibility: 'joint' | 'husband' | 'wife' | 'disputed';
  division: number; // percentage to Party 1 (0-100)
}

const PropertyDivisionAssistant = () => {
  const [marriageDuration, setMarriageDuration] = useState<number>(0);
  const [personalLaw, setPersonalLaw] = useState<string>('hindu');
  const [assets, setAssets] = useState<Asset[]>([
    { id: '1', name: '', value: 0, ownership: 'joint', division: 50 }
  ]);
  const [liabilities, setLiabilities] = useState<Liability[]>([
    { id: '1', name: '', amount: 0, responsibility: 'joint', division: 50 }
  ]);
  
  const [party1Contribution, setParty1Contribution] = useState<number>(50);
  const [calculationResults, setCalculationResults] = useState<any>(null);
  
  // Add new asset
  const addAsset = () => {
    setAssets([
      ...assets,
      { 
        id: Date.now().toString(), 
        name: '', 
        value: 0, 
        ownership: 'joint',
        division: 50 
      }
    ]);
  };
  
  // Remove asset
  const removeAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };
  
  // Add new liability
  const addLiability = () => {
    setLiabilities([
      ...liabilities,
      { 
        id: Date.now().toString(), 
        name: '', 
        amount: 0, 
        responsibility: 'joint',
        division: 50 
      }
    ]);
  };
  
  // Remove liability
  const removeLiability = (id: string) => {
    setLiabilities(liabilities.filter(liability => liability.id !== id));
  };
  
  // Update asset
  const updateAsset = (id: string, field: keyof Asset, value: any) => {
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, [field]: value } : asset
    ));
  };
  
  // Update liability
  const updateLiability = (id: string, field: keyof Liability, value: any) => {
    setLiabilities(liabilities.map(liability => 
      liability.id === id ? { ...liability, [field]: value } : liability
    ));
  };
  
  const calculateDivision = () => {
    // Total assets value
    const totalAssetsValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    
    // Total liabilities
    const totalLiabilitiesAmount = liabilities.reduce((sum, liability) => sum + liability.amount, 0);
    
    // Net worth
    const netWorth = totalAssetsValue - totalLiabilitiesAmount;
    
    // Calculate division based on inputs
    const party1Assets = assets.reduce((sum, asset) => {
      return sum + (asset.value * asset.division / 100);
    }, 0);
    
    const party2Assets = totalAssetsValue - party1Assets;
    
    const party1Liabilities = liabilities.reduce((sum, liability) => {
      return sum + (liability.amount * liability.division / 100);
    }, 0);
    
    const party2Liabilities = totalLiabilitiesAmount - party1Liabilities;
    
    // Net division
    const party1Net = party1Assets - party1Liabilities;
    const party2Net = party2Assets - party2Liabilities;
    
    // Percentage distribution
    const party1Percentage = netWorth !== 0 ? (party1Net / netWorth) * 100 : 50;
    const party2Percentage = netWorth !== 0 ? (party2Net / netWorth) * 100 : 50;
    
    // Legal analysis based on personal law
    let legalAnalysis = '';
    switch (personalLaw) {
      case 'hindu':
        legalAnalysis = `Under the Hindu Marriage Act, there is no specific provision for division of matrimonial property. Courts generally rely on principles of equity and contribution. The Supreme Court in several judgments including Rajnesh v. Neha (2021) has considered factors like direct and indirect contributions to acquire assets.`;
        break;
      case 'muslim':
        legalAnalysis = `Under Muslim Personal Law, each spouse generally retains ownership of their separate property. The concept of matrimonial property is not explicitly recognized, though courts may consider maintenance (Mehr) separately.`;
        break;
      case 'christian':
        legalAnalysis = `Under the Indian Divorce Act applicable to Christians, courts consider fair and equitable division based on specific circumstances of the case, including duration of marriage and contributions.`;
        break;
      case 'civil':
        legalAnalysis = `Under the Special Marriage Act, property division follows similar principles as under personal laws, with courts having discretion to make fair and equitable orders.`;
        break;
    }
    
    // Duration factor
    let durationAnalysis = '';
    if (marriageDuration < 5) {
      durationAnalysis = `In short-duration marriages (less than 5 years), courts often focus on restoring pre-marital financial positions rather than substantial sharing of assets.`;
    } else if (marriageDuration >= 5 && marriageDuration < 15) {
      durationAnalysis = `For medium-duration marriages (5-15 years), courts generally consider contributions during marriage and may recognize indirect contributions to family welfare.`;
    } else {
      durationAnalysis = `For long-duration marriages (over 15 years), courts typically recognize substantial sharing of matrimonial assets, with greater emphasis on non-financial contributions.`;
    }
    
    setCalculationResults({
      totalAssetsValue,
      totalLiabilitiesAmount,
      netWorth,
      party1Assets,
      party2Assets,
      party1Liabilities,
      party2Liabilities,
      party1Net,
      party2Net,
      party1Percentage,
      party2Percentage,
      legalAnalysis,
      durationAnalysis
    });
  };
  
  const renderResults = () => {
    if (!calculationResults) return null;
    
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Total Assets</p>
              <p className="font-medium">₹{calculationResults.totalAssetsValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Liabilities</p>
              <p className="font-medium">₹{calculationResults.totalLiabilitiesAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Worth</p>
              <p className="font-medium">₹{calculationResults.netWorth.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-3">
            <h4 className="font-medium mb-2">Party 1 Share</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Assets:</span>
                <span className="font-medium">₹{calculationResults.party1Assets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Liabilities:</span>
                <span className="font-medium">₹{calculationResults.party1Liabilities.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm">Net Value:</span>
                <span className="font-bold">₹{calculationResults.party1Net.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Percentage:</span>
                <span className="font-bold">{calculationResults.party1Percentage.toFixed(2)}%</span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-3">
            <h4 className="font-medium mb-2">Party 2 Share</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Assets:</span>
                <span className="font-medium">₹{calculationResults.party2Assets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Liabilities:</span>
                <span className="font-medium">₹{calculationResults.party2Liabilities.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm">Net Value:</span>
                <span className="font-bold">₹{calculationResults.party2Net.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Percentage:</span>
                <span className="font-bold">{calculationResults.party2Percentage.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-muted/30 p-3 rounded-lg">
          <h4 className="font-medium mb-2">Legal Analysis</h4>
          <p className="text-sm">{calculationResults.legalAnalysis}</p>
          <p className="text-sm mt-2">{calculationResults.durationAnalysis}</p>
        </div>
      </div>
    );
  };
  
  return (
    <BaseCalculator
      title="Matrimonial Property Division Assistant"
      description="Calculate equitable division of matrimonial assets and liabilities"
      icon={<Scale className="h-5 w-5 text-blue-600" />}
      onCalculate={calculateDivision}
      results={renderResults()}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="marriage-duration">Marriage Duration (Years)</Label>
            <Input 
              id="marriage-duration"
              type="number" 
              value={marriageDuration.toString()} 
              onChange={(e) => setMarriageDuration(Number(e.target.value))}
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="personal-law">Applicable Personal Law</Label>
            <Select 
              value={personalLaw} 
              onValueChange={setPersonalLaw}
            >
              <SelectTrigger className="w-full" id="personal-law">
                <SelectValue placeholder="Select Personal Law" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hindu">Hindu Marriage Act</SelectItem>
                <SelectItem value="muslim">Muslim Personal Law</SelectItem>
                <SelectItem value="christian">Indian Divorce Act (Christians)</SelectItem>
                <SelectItem value="civil">Special Marriage Act (Civil)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="party1-contribution">Party 1 Overall Contribution (%)</Label>
          <Input 
            id="party1-contribution"
            type="number" 
            value={party1Contribution.toString()} 
            onChange={(e) => setParty1Contribution(Number(e.target.value))}
            min="0"
            max="100"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Consider both financial and non-financial contributions (homemaking, childcare)
          </p>
        </div>
        
        <Separator className="my-4" />
        
        {/* Assets Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Assets</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addAsset}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Asset
            </Button>
          </div>
          
          <div className="space-y-4">
            {assets.map((asset, index) => (
              <div key={asset.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-3">
                  <Label htmlFor={`asset-name-${asset.id}`} className="text-xs">Asset Name</Label>
                  <Input 
                    id={`asset-name-${asset.id}`}
                    value={asset.name} 
                    onChange={(e) => updateAsset(asset.id, 'name', e.target.value)}
                    placeholder="Property/Investments"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`asset-value-${asset.id}`} className="text-xs">Value (₹)</Label>
                  <Input 
                    id={`asset-value-${asset.id}`}
                    type="number"
                    value={asset.value} 
                    onChange={(e) => updateAsset(asset.id, 'value', Number(e.target.value))}
                    min="0"
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`asset-ownership-${asset.id}`} className="text-xs">Ownership</Label>
                  <Select 
                    value={asset.ownership} 
                    onValueChange={(value) => updateAsset(asset.id, 'ownership', value)}
                  >
                    <SelectTrigger id={`asset-ownership-${asset.id}`}>
                      <SelectValue placeholder="Ownership" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="joint">Joint</SelectItem>
                      <SelectItem value="husband">Party 1 Only</SelectItem>
                      <SelectItem value="wife">Party 2 Only</SelectItem>
                      <SelectItem value="disputed">Disputed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`asset-division-${asset.id}`} className="text-xs">Party 1 Share (%)</Label>
                  <Input 
                    id={`asset-division-${asset.id}`}
                    type="number"
                    value={asset.division} 
                    onChange={(e) => updateAsset(asset.id, 'division', Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="col-span-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeAsset(asset.id)}
                    disabled={assets.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Liabilities Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Liabilities</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addLiability}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Liability
            </Button>
          </div>
          
          <div className="space-y-4">
            {liabilities.map((liability) => (
              <div key={liability.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-3">
                  <Label htmlFor={`liability-name-${liability.id}`} className="text-xs">Liability Name</Label>
                  <Input 
                    id={`liability-name-${liability.id}`}
                    value={liability.name} 
                    onChange={(e) => updateLiability(liability.id, 'name', e.target.value)}
                    placeholder="Loan/Debt"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`liability-amount-${liability.id}`} className="text-xs">Amount (₹)</Label>
                  <Input 
                    id={`liability-amount-${liability.id}`}
                    type="number"
                    value={liability.amount} 
                    onChange={(e) => updateLiability(liability.id, 'amount', Number(e.target.value))}
                    min="0"
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`liability-responsibility-${liability.id}`} className="text-xs">Responsibility</Label>
                  <Select 
                    value={liability.responsibility} 
                    onValueChange={(value) => updateLiability(liability.id, 'responsibility', value)}
                  >
                    <SelectTrigger id={`liability-responsibility-${liability.id}`}>
                      <SelectValue placeholder="Responsibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="joint">Joint</SelectItem>
                      <SelectItem value="husband">Party 1 Only</SelectItem>
                      <SelectItem value="wife">Party 2 Only</SelectItem>
                      <SelectItem value="disputed">Disputed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`liability-division-${liability.id}`} className="text-xs">Party 1 Share (%)</Label>
                  <Input 
                    id={`liability-division-${liability.id}`}
                    type="number"
                    value={liability.division} 
                    onChange={(e) => updateLiability(liability.id, 'division', Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="col-span-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeLiability(liability.id)}
                    disabled={liabilities.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseCalculator>
  );
};

export default PropertyDivisionAssistant;
