import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Clock, CreditCard, BarChart3, Calendar } from 'lucide-react';

interface TimeEntry {
  id: string;
  client_name: string | null;
  activity_type: string;
  hours_spent: number;
  date: string | null;
  description: string | null;
  hourly_rate: number | null;
  amount: number | null;
  invoice_status: string | null; // Added this property to fix the TypeScript error
}

interface TimeTrackingStatsProps {
  entries: TimeEntry[];
  period?: 'week' | 'month' | 'year';
}

const TimeTrackingStats = ({ entries, period = 'month' }: TimeTrackingStatsProps) => {
  // Calculate total hours
  const totalHours = entries.reduce((sum, entry) => sum + (entry.hours_spent || 0), 0);
  
  // Calculate total billable amount
  const totalBillable = entries.reduce((sum, entry) => {
    const hours = typeof entry.hours_spent === 'number' ? entry.hours_spent : 0;
    const rate = typeof entry.hourly_rate === 'number' ? entry.hourly_rate : 0;
    return sum + (hours * rate);
  }, 0);
  
  // Group entries by client
  const clientData: Record<string, { hours: number; amount: number; color: string }> = {};
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#06b6d4', '#8b5cf6'];
  
  let colorIndex = 0;
  entries.forEach(entry => {
    if (entry.client_name) {
      if (!clientData[entry.client_name]) {
        clientData[entry.client_name] = {
          hours: 0,
          amount: 0,
          color: colors[colorIndex % colors.length],
        };
        colorIndex++;
      }
      const hours = typeof entry.hours_spent === 'number' ? entry.hours_spent : 0;
      const rate = typeof entry.hourly_rate === 'number' ? entry.hourly_rate : 0;
      
      clientData[entry.client_name].hours += hours;
      clientData[entry.client_name].amount += (hours * rate);
    }
  });
  
  const topClients = Object.entries(clientData)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  
  // Group entries by activity type
  const activityData: Record<string, { hours: number; count: number; color: string }> = {};
  
  colorIndex = 0;
  entries.forEach(entry => {
    if (entry.activity_type) {
      if (!activityData[entry.activity_type]) {
        activityData[entry.activity_type] = {
          hours: 0,
          count: 0,
          color: colors[colorIndex % colors.length],
        };
        colorIndex++;
      }
      const hours = typeof entry.hours_spent === 'number' ? entry.hours_spent : 0;
      
      activityData[entry.activity_type].hours += hours;
      activityData[entry.activity_type].count += 1;
    }
  });
  
  const activityStats = Object.entries(activityData)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.hours - a.hours);
  
  // Create time series data for hours per day/week/month
  const getTimeSeriesData = () => {
    const now = new Date();
    const timeData: Record<string, { date: string; hours: number }> = {};
    
    // Initialize the time periods
    if (period === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        timeData[dateStr] = { date: dateStr, hours: 0 };
      }
    } else if (period === 'month') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        timeData[dateStr] = { date: dateStr, hours: 0 };
      }
    } else { // year
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short' });
        timeData[dateStr] = { date: dateStr, hours: 0 };
      }
    }
    
    // Aggregate hours based on entries
    entries.forEach(entry => {
      if (entry.date) {
        const entryDate = new Date(entry.date);
        let dateStr = '';
        
        if (period === 'week') {
          dateStr = entryDate.toLocaleDateString('en-US', { weekday: 'short' });
        } else if (period === 'month') {
          dateStr = entryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else { // year
          dateStr = entryDate.toLocaleDateString('en-US', { month: 'short' });
        }
        
        if (timeData[dateStr]) {
          timeData[dateStr].hours += entry.hours_spent || 0;
        }
      }
    });
    
    return Object.values(timeData);
  };
  
  const timeSeriesData = getTimeSeriesData();
  
  // Get billing status data
  const billingStatusData = [
    { name: 'Billed', value: entries.filter(e => e.invoice_status === 'billed').length, color: '#10b981' },
    { name: 'Unbilled', value: entries.filter(e => e.invoice_status !== 'billed').length, color: '#f59e0b' },
  ];
  
  // Calculate target
  const targetHours = period === 'week' ? 40 : period === 'month' ? 160 : 2000;
  const progressPercentage = Math.min((totalHours / targetHours) * 100, 100);
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-blue-100 dark:border-blue-900/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-xl font-medium">Hours Tracked</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{totalHours.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground ml-2">hours</span>
            </div>
            <Progress className="h-2 mt-2" value={progressPercentage} />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(progressPercentage)}% of {targetHours} hour {period}ly target
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-green-100 dark:border-green-900/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              <CardTitle className="text-xl font-medium">Total Billable</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">₹{totalBillable.toLocaleString('en-IN')}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {entries.filter(e => e.invoice_status === 'billed').length} entries billed
              </span>
              <span className="text-sm font-medium text-green-600">
                {entries.length > 0 ? Math.round((entries.filter(e => e.invoice_status === 'billed').length / entries.length) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-amber-100 dark:border-amber-900/20 md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-xl font-medium">Hours by {period === 'week' ? 'Day' : period === 'month' ? 'Day' : 'Month'}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)} hours`, 'Hours']}
                  contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorHours)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <CardTitle>Activity Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            {activityStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={activityStats.slice(0, 5)} 
                  margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)} hours`, 'Hours']}
                    contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="hours">
                    {activityStats.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No activity data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <CardTitle>Revenue by Client</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            {topClients.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topClients}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="amount"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {topClients.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No client revenue data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeTrackingStats;
