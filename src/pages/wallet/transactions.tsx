import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Clock, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWallet } from '@/hooks/useWallet';
import { formatDistanceToNow } from 'date-fns';

const TransactionHistory: React.FC = () => {
  const { transactions, loading } = useWallet();
  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'deductions') return transaction.credits_used > 0;
    if (filter === 'additions') return transaction.credits_used < 0;
    return transaction.action_type === filter;
  });

  const getActionLabel = (actionType: string) => {
    const labels: Record<string, string> = {
      chat_free: 'Free Chat',
      doc_analysis: 'Document Analysis',
      case_law: 'Case Law Research',
      drafting: 'Document Drafting',
      research: 'Legal Research',
      bulk_export: 'Bulk Export',
      topup: 'Credit Top-up',
      subscription: 'Subscription'
    };
    return labels[actionType] || actionType;
  };

  const getActionIcon = (actionType: string, creditsUsed: number) => {
    if (creditsUsed < 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    }
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getActionColor = (creditsUsed: number) => {
    if (creditsUsed < 0) return 'text-green-600';
    if (creditsUsed === 0) return 'text-blue-600';
    return 'text-red-600';
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Transaction History - VakilGPT</title>
        <meta name="description" content="View your complete credit transaction history on VakilGPT" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Transaction History</h1>
              <p className="text-muted-foreground">View all your credit transactions</p>
            </div>
          </div>
          
          <Link to="/wallet/topup">
            <Button>
              Add Credits
            </Button>
          </Link>
        </div>

        {/* Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter transactions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="deductions">Credit Deductions</SelectItem>
                  <SelectItem value="additions">Credit Additions</SelectItem>
                  <SelectItem value="topup">Top-ups</SelectItem>
                  <SelectItem value="subscription">Subscriptions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Transactions ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full" />
                      <div className="space-y-2">
                        <div className="w-32 h-4 bg-muted rounded" />
                        <div className="w-24 h-3 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="w-20 h-4 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
                <p className="text-muted-foreground mb-4">
                  {filter === 'all' 
                    ? "You haven't made any transactions yet."
                    : `No ${filter} transactions found.`
                  }
                </p>
                <Link to="/chat">
                  <Button>Start Using VakilGPT</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getActionIcon(transaction.action_type, transaction.credits_used)}
                      <div>
                        <div className="font-medium text-foreground">
                          {getActionLabel(transaction.action_type)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-medium ${getActionColor(transaction.credits_used)}`}>
                        {transaction.credits_used < 0 ? '+' : '-'}
                        {Math.abs(transaction.credits_used).toLocaleString()} credits
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Balance: {transaction.balance_after.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TransactionHistory;