
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarClock, FileText, IndianRupee, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const user = {
    name: "Advocate Sharma",
    email: "advocate.sharma@example.com",
    role: "Senior Advocate",
    barNumber: "KAR/123/2015",
    enrollmentDate: "15/05/2015",
    jurisdiction: "Karnataka High Court"
  };

  const recentCases = [
    { id: 1, title: "State of Karnataka vs. Reddy", type: "Criminal", court: "Karnataka High Court", date: "28/03/2025", status: "Active" },
    { id: 2, title: "Mehta Industries vs. GST Authority", type: "Tax", court: "CESTAT Bangalore", date: "15/04/2025", status: "Pending" },
    { id: 3, title: "Sharma vs. Patel Property Dispute", type: "Civil", court: "Bangalore Civil Court", date: "10/05/2025", status: "Scheduled" }
  ];

  const legalTools = [
    { id: 1, name: "Court Filing Automation", icon: <FileText className="h-5 w-5" />, path: "/court-filing", description: "Automate court filing process for Indian courts" },
    { id: 2, name: "Deadline Management", icon: <CalendarClock className="h-5 w-5" />, path: "/deadline-management", description: "Smart calendar and deadline tracking for Indian legal proceedings" },
    { id: 3, name: "Billing & Time Tracking", icon: <IndianRupee className="h-5 w-5" />, path: "/billing-tracking", description: "Track billable hours and manage invoices" }
  ];

  return (
    <AppLayout>
      <Helmet>
        <title>Advocate Profile | VakilGPT</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/3">
            <Card className="border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="bg-legal-accent/10 text-legal-accent text-2xl">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl font-semibold text-center">{user.name}</CardTitle>
                <div className="text-center mt-2">
                  <Badge variant="outline" className="font-normal text-legal-muted dark:text-gray-400">
                    {user.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-legal-muted dark:text-gray-400">Email</h3>
                    <p className="text-legal-slate dark:text-white">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-legal-muted dark:text-gray-400">Bar Enrollment</h3>
                    <p className="text-legal-slate dark:text-white">{user.barNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-legal-muted dark:text-gray-400">Enrollment Date</h3>
                    <p className="text-legal-slate dark:text-white">{user.enrollmentDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-legal-muted dark:text-gray-400">Primary Jurisdiction</h3>
                    <p className="text-legal-slate dark:text-white">{user.jurisdiction}</p>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Legal Tools Section */}
            <Card className="mt-6 border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Legal Practice Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {legalTools.map((tool) => (
                    <Button 
                      key={tool.id} 
                      variant="outline" 
                      className="w-full justify-start text-left mb-2 border-legal-border dark:border-legal-slate/30"
                      onClick={() => navigate(tool.path)}
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-legal-accent/10 text-legal-accent mr-3">
                          {tool.icon}
                        </div>
                        <div>
                          <div className="font-medium text-legal-slate dark:text-white">{tool.name}</div>
                          <div className="text-xs text-legal-muted dark:text-gray-400 mt-1">{tool.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="cases">Cases</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard">
                <Card className="border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Upcoming Hearings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentCases.map((caseItem) => (
                        <div key={caseItem.id} className="border-b border-legal-border dark:border-legal-slate/20 pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-legal-slate dark:text-white">{caseItem.title}</h3>
                              <p className="text-sm text-legal-muted dark:text-gray-400 mt-1">
                                {caseItem.court} • {caseItem.type}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-sm font-medium text-legal-slate dark:text-white">{caseItem.date}</span>
                              <Badge 
                                variant={caseItem.status === "Active" ? "default" : 
                                        caseItem.status === "Pending" ? "outline" : "secondary"}
                                className="mt-1"
                              >
                                {caseItem.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                  <Card className="border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Pending Filings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-legal-slate dark:text-white">5</div>
                      <p className="text-sm text-legal-muted dark:text-gray-400 mt-1">Documents awaiting submission</p>
                      <Button 
                        className="w-full mt-4" 
                        variant="outline"
                        onClick={() => navigate('/court-filing')}
                      >
                        View Filings
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Upcoming Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-legal-slate dark:text-white">8</div>
                      <p className="text-sm text-legal-muted dark:text-gray-400 mt-1">Tasks due this week</p>
                      <Button 
                        className="w-full mt-4" 
                        variant="outline"
                        onClick={() => navigate('/deadline-management')}
                      >
                        Manage Deadlines
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="cases">
                <Card className="border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Your Active Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-legal-muted dark:text-gray-400 mb-4">
                      Manage your ongoing cases and legal matters
                    </p>
                    <div className="border rounded-md border-legal-border dark:border-legal-slate/20">
                      {/* Case list content would go here */}
                      <div className="p-8 text-center text-legal-muted dark:text-gray-400">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="font-medium text-lg text-legal-slate dark:text-white mb-2">
                          Case management coming soon
                        </h3>
                        <p className="max-w-md mx-auto">
                          We're developing a comprehensive case management system to help you track 
                          all your legal matters in one place.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card className="border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-legal-muted dark:text-gray-400 mb-4">
                      Track your recent actions and updates
                    </p>
                    <div className="border rounded-md border-legal-border dark:border-legal-slate/20">
                      {/* Activity log content would go here */}
                      <div className="p-8 text-center text-legal-muted dark:text-gray-400">
                        <CalendarClock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="font-medium text-lg text-legal-slate dark:text-white mb-2">
                          Activity tracking coming soon
                        </h3>
                        <p className="max-w-md mx-auto">
                          We're working on an activity log to help you keep track of all your interactions 
                          and changes across the platform.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UserProfilePage;
