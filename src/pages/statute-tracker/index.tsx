
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Scale, Bell, Eye, EyeOff, Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StatuteTrackerPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('tracking');
  
  // Mocked statutes for demonstration
  const [trackedStatutes, setTrackedStatutes] = useState([
    {
      id: 1,
      name: "California Consumer Privacy Act (CCPA)",
      jurisdiction: "California",
      lastUpdated: "2023-11-15",
      recentChanges: 2,
      notifications: true
    },
    {
      id: 2,
      name: "General Data Protection Regulation (GDPR)",
      jurisdiction: "European Union",
      lastUpdated: "2023-09-30",
      recentChanges: 0,
      notifications: true
    },
    {
      id: 3,
      name: "Health Insurance Portability and Accountability Act (HIPAA)",
      jurisdiction: "United States",
      lastUpdated: "2023-08-22",
      recentChanges: 1,
      notifications: false
    }
  ]);
  
  // Mocked statute updates
  const statuteUpdates = [
    {
      id: 101,
      statuteName: "California Consumer Privacy Act (CCPA)",
      updateDate: "2023-11-15",
      description: "Updated enforcement provisions with increased penalties for violations",
      type: "Amendment"
    },
    {
      id: 102,
      statuteName: "California Consumer Privacy Act (CCPA)",
      updateDate: "2023-10-28",
      description: "Expanded definition of 'personal information' to include biometric data",
      type: "Amendment"
    },
    {
      id: 103,
      statuteName: "Health Insurance Portability and Accountability Act (HIPAA)",
      updateDate: "2023-08-22",
      description: "New guidance on telehealth privacy requirements",
      type: "Guidance"
    }
  ];
  
  // Mocked recommendations
  const recommendations = [
    {
      id: 201,
      name: "Americans with Disabilities Act (ADA)",
      jurisdiction: "United States",
      relevance: "High",
      reason: "Based on your tracked healthcare regulations"
    },
    {
      id: 202,
      name: "EU Digital Services Act",
      jurisdiction: "European Union",
      relevance: "Medium",
      reason: "Related to your GDPR tracking interest"
    },
    {
      id: 203,
      name: "California Privacy Rights Act (CPRA)",
      jurisdiction: "California",
      relevance: "High",
      reason: "Extends and amends the CCPA you're tracking"
    }
  ];
  
  const toggleNotifications = (id: number) => {
    setTrackedStatutes(trackedStatutes.map(statute => 
      statute.id === id ? { ...statute, notifications: !statute.notifications } : statute
    ));
    
    const statute = trackedStatutes.find(s => s.id === id);
    if (statute) {
      toast({
        title: statute.notifications ? "Notifications Disabled" : "Notifications Enabled",
        description: `You will ${statute.notifications ? 'no longer' : 'now'} receive updates for ${statute.name}`,
      });
    }
  };
  
  const addToTracking = (recommendation: typeof recommendations[0]) => {
    if (!trackedStatutes.some(s => s.name === recommendation.name)) {
      setTrackedStatutes([...trackedStatutes, {
        id: Date.now(),
        name: recommendation.name,
        jurisdiction: recommendation.jurisdiction,
        lastUpdated: new Date().toISOString().split('T')[0],
        recentChanges: 0,
        notifications: true
      }]);
      
      toast({
        title: "Statute Added",
        description: `${recommendation.name} has been added to your tracking list`,
      });
    }
  };
  
  const filteredStatutes = searchTerm 
    ? trackedStatutes.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : trackedStatutes;
  
  return (
    <LegalToolLayout
      title="Statute & Regulation Tracker"
      description="Stay up-to-date with changes in laws and regulations across jurisdictions. Set up alerts for amendments to statutes relevant to your practice."
      icon={<Scale className="w-6 h-6 text-white" />}
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="relative">
            <Input
              placeholder="Search statutes by name or jurisdiction..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-3 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracking">Tracked Statutes</TabsTrigger>
            <TabsTrigger value="updates">Recent Updates</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracking">
            <div className="space-y-4 mt-4">
              {filteredStatutes.length > 0 ? (
                filteredStatutes.map(statute => (
                  <Card key={statute.id} className="bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{statute.name}</h3>
                          <p className="text-sm text-legal-muted dark:text-gray-400">
                            Jurisdiction: {statute.jurisdiction}
                          </p>
                          <div className="flex items-center mt-2 text-sm text-legal-muted dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            Last updated: {statute.lastUpdated}
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                          {statute.recentChanges > 0 && (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50">
                              {statute.recentChanges} recent {statute.recentChanges === 1 ? 'change' : 'changes'}
                            </Badge>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id={`notifications-${statute.id}`}
                              checked={statute.notifications}
                              onCheckedChange={() => toggleNotifications(statute.id)}
                            />
                            <label
                              htmlFor={`notifications-${statute.id}`}
                              className="text-sm cursor-pointer flex items-center"
                            >
                              {statute.notifications ? (
                                <>
                                  <Bell className="h-4 w-4 mr-1 text-legal-accent" />
                                  <span>Notifications on</span>
                                </>
                              ) : (
                                <>
                                  <BellOff className="h-4 w-4 mr-1" />
                                  <span>Notifications off</span>
                                </>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
                  <CardContent className="p-6 text-center">
                    <p className="text-legal-muted dark:text-gray-400">
                      {searchTerm ? 'No statutes match your search criteria' : 'No statutes tracked yet'}
                    </p>
                    {!searchTerm && (
                      <Button 
                        onClick={() => setActiveTab('recommendations')}
                        variant="outline" 
                        className="mt-4"
                      >
                        Browse Recommendations
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="updates">
            <div className="space-y-4 mt-4">
              {statuteUpdates.length > 0 ? (
                statuteUpdates.map(update => (
                  <Card key={update.id} className="bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{update.statuteName}</h3>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50">
                            {update.type}
                          </Badge>
                        </div>
                        <p className="text-sm">{update.description}</p>
                        <div className="flex items-center text-sm text-legal-muted dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          Update date: {update.updateDate}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
                  <CardContent className="p-6 text-center">
                    <p className="text-legal-muted dark:text-gray-400">No recent updates found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <div className="space-y-4 mt-4">
              {recommendations.map(recommendation => (
                <Card key={recommendation.id} className="bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-semibold">{recommendation.name}</h3>
                          <Badge className="ml-2" variant={recommendation.relevance === 'High' ? 'default' : 'secondary'}>
                            {recommendation.relevance} relevance
                          </Badge>
                        </div>
                        <p className="text-sm text-legal-muted dark:text-gray-400">
                          Jurisdiction: {recommendation.jurisdiction}
                        </p>
                        <p className="text-sm mt-1">
                          <span className="text-legal-muted dark:text-gray-400">Why: </span>
                          {recommendation.reason}
                        </p>
                      </div>
                      
                      <Button 
                        onClick={() => addToTracking(recommendation)}
                        className="shrink-0"
                      >
                        Add to Tracking
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

const BellOff = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5"></path>
    <path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7"></path>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
    <path d="m2 2 20 20"></path>
  </svg>
);

export default StatuteTrackerPage;
