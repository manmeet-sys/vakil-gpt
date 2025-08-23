import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, CreditCard, Coins, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'sonner';

const TOPUP_OPTIONS = [
  { credits: 1000, price: 99, popular: false },
  { credits: 5000, price: 399, popular: true },
  { credits: 10000, price: 699, popular: false },
  { credits: 25000, price: 1499, popular: false },
];

const SUBSCRIPTION_PLANS = [
  { name: 'Intro', credits: 5000, price: 50, popular: true },
  { name: 'Basic', credits: 15000, price: 299, popular: false },
  { name: 'Pro', credits: 75000, price: 1499, popular: false },
];

const TopUpPage: React.FC = () => {
  const { wallet, addCredits } = useWallet();
  const [selectedTopup, setSelectedTopup] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTopup = async (credits: number, source: string = 'topup') => {
    setLoading(true);
    try {
      const success = await addCredits(credits, source);
      if (success) {
        // Simulate payment processing
        setTimeout(() => {
          toast.success(`Successfully added ${credits.toLocaleString()} credits!`);
          setSelectedTopup(null);
          setSelectedPlan(null);
          setCustomAmount('');
        }, 1000);
      }
    } catch (error) {
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomTopup = () => {
    const credits = parseInt(customAmount);
    if (credits && credits > 0) {
      handleTopup(credits);
    } else {
      toast.error('Please enter a valid number of credits');
    }
  };

  const handleSubscription = (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    handleTopup(plan.credits, 'subscription');
  };

  const handleRazorpayPayment = (amount: number, credits: number, type: string) => {
    // Simulate Razorpay payment
    alert(`Razorpay Payment: ₹${amount} for ${credits.toLocaleString()} credits (${type})`);
    handleTopup(credits, type);
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Top-up Credits - VakilGPT</title>
        <meta name="description" content="Add credits to your VakilGPT account" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add Credits</h1>
            <p className="text-muted-foreground">
              Current Balance: <span className="font-semibold text-foreground">{wallet?.current_credits?.toLocaleString() || 0} credits</span>
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* One-time Top-ups */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  One-time Top-ups
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {TOPUP_OPTIONS.map((option) => (
                  <div
                    key={option.credits}
                    className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTopup === option.credits
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    } ${option.popular ? 'ring-2 ring-primary/20' : ''}`}
                    onClick={() => setSelectedTopup(option.credits)}
                  >
                    {option.popular && (
                      <div className="absolute -top-2 left-4">
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-foreground">
                          {option.credits.toLocaleString()} Credits
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ₹{option.price} • ₹{(option.price / option.credits * 1000).toFixed(2)}/1K credits
                        </div>
                      </div>
                      {selectedTopup === option.credits && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}

                {selectedTopup && (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => {
                      const option = TOPUP_OPTIONS.find(o => o.credits === selectedTopup);
                      if (option) {
                        handleRazorpayPayment(option.price, option.credits, 'topup');
                      }
                    }}
                    disabled={loading}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {loading ? 'Processing...' : `Pay ₹${TOPUP_OPTIONS.find(o => o.credits === selectedTopup)?.price}`}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Custom Amount */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Amount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="custom-credits">Number of Credits</Label>
                  <Input
                    id="custom-credits"
                    type="number"
                    placeholder="Enter credits amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    min="1"
                  />
                </div>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleCustomTopup}
                  disabled={!customAmount || loading}
                >
                  Add {customAmount || '0'} Credits
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Plans */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Monthly Subscription Plans
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {SUBSCRIPTION_PLANS.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPlan === plan.name
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    } ${plan.popular ? 'ring-2 ring-primary/20' : ''}`}
                    onClick={() => setSelectedPlan(plan.name)}
                  >
                    {plan.popular && (
                      <div className="absolute -top-2 left-4">
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-foreground">
                          {plan.name} Plan
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {plan.credits.toLocaleString()} credits/month
                        </div>
                        <div className="text-lg font-bold text-foreground mt-1">
                          ₹{plan.price}/month
                        </div>
                      </div>
                      {selectedPlan === plan.name && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}

                {selectedPlan && (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => {
                      const plan = SUBSCRIPTION_PLANS.find(p => p.name === selectedPlan);
                      if (plan) {
                        handleRazorpayPayment(plan.price, plan.credits, 'subscription');
                      }
                    }}
                    disabled={loading}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {loading ? 'Processing...' : `Subscribe for ₹${SUBSCRIPTION_PLANS.find(p => p.name === selectedPlan)?.price}/month`}
                  </Button>
                )}

                <div className="text-center mt-4">
                  <Link to="/pricing">
                    <Button variant="link" className="text-sm">
                      View detailed pricing comparison →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TopUpPage;