
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BookOpen, FileText, Gavel, Globe, Landmark, LayoutDashboard, SlidersHorizontal, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface KnowledgeStatsProps {
  isCustomizing?: boolean;
}

const KnowledgeStats: React.FC<KnowledgeStatsProps> = ({ isCustomizing = false }) => {
  // Load user preferences from localStorage or use defaults
  const [preferences, setPreferences] = useState(() => {
    const savedPreferences = localStorage.getItem('knowledge-dashboard-prefs');
    return savedPreferences ? JSON.parse(savedPreferences) : {
      showSummaryCards: true,
      showDistributionChart: true,
      showGrowthChart: true,
      showCourtChart: true,
      showJurisdictionChart: true
    };
  });
  
  // Save preferences whenever they change
  useEffect(() => {
    localStorage.setItem('knowledge-dashboard-prefs', JSON.stringify(preferences));
  }, [preferences]);

  // Dummy data - in a real application, this would come from your database
  const knowledgeItems = JSON.parse(localStorage.getItem('precedentAI-knowledge') || '[]');
  
  // Count items by type
  const typeCounts = knowledgeItems.reduce((acc: Record<string, number>, item: any) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});
  
  const typeData = [
    { name: 'Documents', value: typeCounts['document'] || 0, color: '#3b82f6' },
    { name: 'URLs', value: typeCounts['url'] || 0, color: '#10b981' },
    { name: 'Text', value: typeCounts['text'] || 0, color: '#8b5cf6' },
    { name: 'Precedents', value: typeCounts['precedent'] || 0, color: '#f59e0b' },
    { name: 'Legislation', value: typeCounts['legislation'] || 0, color: '#ef4444' },
  ];
  
  // Group by month added
  const monthlyData = knowledgeItems.reduce((acc: Record<string, number>, item: any) => {
    const date = new Date(item.dateAdded);
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[monthYear] = (acc[monthYear] || 0) + 1;
    return acc;
  }, {});
  
  const timelineData = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    count,
  }));
  
  // For legislation by jurisdiction
  const jurisdictionData = knowledgeItems
    .filter((item: any) => item.type === 'legislation' && item.jurisdiction)
    .reduce((acc: Record<string, number>, item: any) => {
      const jurisdiction = 
        item.jurisdiction === 'central' ? 'Central' : 
        item.jurisdiction === 'state' ? 'State' : 'Local';
      acc[jurisdiction] = (acc[jurisdiction] || 0) + 1;
      return acc;
    }, {});
    
  const jurisdictionChartData = Object.entries(jurisdictionData).map(([name, value]) => ({ name, value }));
  
  // For precedents by court
  const courtData = knowledgeItems
    .filter((item: any) => item.type === 'precedent' && item.court)
    .reduce((acc: Record<string, number>, item: any) => {
      const court = 
        item.court === 'supreme-court' ? 'Supreme Court' : 
        item.court === 'high-court' ? 'High Court' : 
        item.court === 'district-court' ? 'District Court' : 
        item.court === 'tribunals' ? 'Tribunals' : 'Other';
      acc[court] = (acc[court] || 0) + 1;
      return acc;
    }, {});
    
  const courtChartData = Object.entries(courtData).map(([name, value]) => ({ name, value }));
  
  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
  
  // Helper to toggle preference settings
  const togglePreference = (key: string) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  return (
    <div className="space-y-6">
      {/* Dashboard customization panel */}
      {isCustomizing && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold flex items-center">
              <SlidersHorizontal className="h-4 w-4 mr-2 text-blue-600" />
              Dashboard Customization
            </h3>
            <Badge variant="outline" className="text-xs">
              <LayoutDashboard className="h-3 w-3 mr-1" />
              Layout Editor
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="summary-cards" 
                checked={preferences.showSummaryCards}
                onCheckedChange={() => togglePreference('showSummaryCards')}
              />
              <Label htmlFor="summary-cards">Summary Cards</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="distribution-chart" 
                checked={preferences.showDistributionChart}
                onCheckedChange={() => togglePreference('showDistributionChart')}
              />
              <Label htmlFor="distribution-chart">Distribution Chart</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="growth-chart" 
                checked={preferences.showGrowthChart}
                onCheckedChange={() => togglePreference('showGrowthChart')}
              />
              <Label htmlFor="growth-chart">Growth Chart</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="court-chart" 
                checked={preferences.showCourtChart}
                onCheckedChange={() => togglePreference('showCourtChart')}
              />
              <Label htmlFor="court-chart">Court Analysis</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="jurisdiction-chart" 
                checked={preferences.showJurisdictionChart}
                onCheckedChange={() => togglePreference('showJurisdictionChart')}
              />
              <Label htmlFor="jurisdiction-chart">Jurisdiction Analysis</Label>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Summary Cards */}
      {preferences.showSummaryCards && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border border-blue-100 dark:border-blue-900/20 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{typeCounts['document'] || 0}</div>
            </CardContent>
          </Card>
          
          <Card className="border border-green-100 dark:border-green-900/20 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Globe className="h-4 w-4 mr-2 text-green-600" />
                URLs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{typeCounts['url'] || 0}</div>
            </CardContent>
          </Card>
          
          <Card className="border border-purple-100 dark:border-purple-900/20 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
                Text Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{typeCounts['text'] || 0}</div>
            </CardContent>
          </Card>
          
          <Card className="border border-amber-100 dark:border-amber-900/20 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Gavel className="h-4 w-4 mr-2 text-amber-600" />
                Precedents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{typeCounts['precedent'] || 0}</div>
            </CardContent>
          </Card>
          
          <Card className="border border-red-100 dark:border-red-900/20 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Landmark className="h-4 w-4 mr-2 text-red-600" />
                Legislation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{typeCounts['legislation'] || 0}</div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Detailed Charts */}
      {knowledgeItems.length > 0 ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="precedents">Precedents Analysis</TabsTrigger>
            <TabsTrigger value="legislation">Legislation Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {preferences.showDistributionChart && (
                <Card className="col-span-1 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="text-base">Knowledge Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={typeData.filter(item => item.value > 0)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                        >
                          {typeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [value, 'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
              
              {preferences.showGrowthChart && (
                <Card className="col-span-1 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="text-base">Knowledge Growth</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={timelineData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis allowDecimals={false} />
                        <Tooltip formatter={(value: number) => [value, 'Items']} />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#3b82f6"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="precedents" className="pt-4">
            <div className="grid grid-cols-1 gap-6">
              {preferences.showCourtChart && (
                <Card className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="text-base">Precedents by Court</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={courtChartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip formatter={(value: number) => [value, 'Cases']} />
                        <Bar dataKey="value">
                          {courtChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="legislation" className="pt-4">
            <div className="grid grid-cols-1 gap-6">
              {preferences.showJurisdictionChart && (
                <Card className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="text-base">Legislation by Jurisdiction</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={jurisdictionChartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip formatter={(value: number) => [value, 'Acts/Rules']} />
                        <Bar dataKey="value">
                          {jurisdictionChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Add knowledge items to see statistics and analytics.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KnowledgeStats;
