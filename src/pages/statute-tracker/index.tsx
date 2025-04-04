
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
  
  // Mocked Indian statutes for demonstration
  const [trackedStatutes, setTrackedStatutes] = useState([
    {
      id: 1,
      name: "Information Technology Act, 2000",
      jurisdiction: "India",
      lastUpdated: "2023-12-10",
      recentChanges: 2,
      notifications: true
    },
    {
      id: 2,
      name: "The Constitution of India",
      jurisdiction: "India",
      lastUpdated: "2023-11-15",
      recentChanges: 1,
      notifications: true
    },
    {
      id: 3,
      name: "Bharatiya Nyaya Sanhita, 2023",
      jurisdiction: "India",
      lastUpdated: "2024-01-01",
      recentChanges: 5,
      notifications: true
    },
    {
      id: 4,
      name: "Bharatiya Nagarik Suraksha Sanhita, 2023",
      jurisdiction: "India",
      lastUpdated: "2024-01-01",
      recentChanges: 4, 
      notifications: true
    },
    {
      id: 5,
      name: "Bharatiya Sakshya Adhiniyam, 2023",
      jurisdiction: "India",
      lastUpdated: "2024-01-01",
      recentChanges: 3,
      notifications: false
    }
  ]);
  
  // Mocked statute updates (India-specific)
  const statuteUpdates = [
    {
      id: 101,
      statuteName: "Information Technology Act, 2000",
      updateDate: "2023-12-10",
      description: "New rules regarding data localization and digital privacy",
      type: "Amendment"
    },
    {
      id: 102,
      statuteName: "Information Technology Act, 2000",
      updateDate: "2023-11-22",
      description: "Updated requirements for intermediary liability protections",
      type: "Rules"
    },
    {
      id: 103,
      statuteName: "The Constitution of India",
      updateDate: "2023-11-15",
      description: "103rd Constitutional Amendment related to EWS reservations interpretation",
      type: "Interpretation"
    },
    {
      id: 104,
      statuteName: "Bharatiya Nyaya Sanhita, 2023",
      updateDate: "2024-01-01",
      description: "Implementation of BNS to replace Indian Penal Code, 1860",
      type: "Major Revision"
    },
    {
      id: 105,
      statuteName: "Bharatiya Nyaya Sanhita, 2023",
      updateDate: "2024-01-15",
      description: "Updated sections on cybercrime and digital fraud",
      type: "Amendment"
    },
    {
      id: 106,
      statuteName: "Bharatiya Nyaya Sanhita, 2023",
      updateDate: "2024-02-10",
      description: "Clarification on applicability of Section 103 (mob lynching)",
      type: "Judgment"
    },
    {
      id: 107,
      statuteName: "Bharatiya Nagarik Suraksha Sanhita, 2023",
      updateDate: "2024-01-01",
      description: "Implementation of BNSS to replace Code of Criminal Procedure, 1973",
      type: "Major Revision"
    },
    {
      id: 108,
      statuteName: "Bharatiya Nagarik Suraksha Sanhita, 2023",
      updateDate: "2024-01-20",
      description: "Guidelines issued for recording of electronic evidence",
      type: "Rules"
    },
    {
      id: 109,
      statuteName: "Bharatiya Sakshya Adhiniyam, 2023",
      updateDate: "2024-01-01",
      description: "Implementation of BSA to replace Indian Evidence Act, 1872",
      type: "Major Revision"
    }
  ];
  
  // Mocked recommendations (India-specific)
  const recommendations = [
    {
      id: 201,
      name: "The Companies Act, 2013",
      jurisdiction: "India",
      relevance: "High",
      reason: "Related to corporate law practice in India"
    },
    {
      id: 202,
      name: "The Right to Information Act, 2005",
      jurisdiction: "India",
      relevance: "Medium",
      reason: "Important for transparency and administrative law"
    },
    {
      id: 203,
      name: "Bharatiya Nyaya Sanhita, 2023",
      jurisdiction: "India",
      relevance: "High",
      reason: "New criminal code replacing IPC with significant changes"
    },
    {
      id: 204,
      name: "Bharatiya Nagarik Suraksha Sanhita, 2023",
      jurisdiction: "India",
      relevance: "High",
      reason: "New criminal procedure code replacing CrPC"
    },
    {
      id: 205,
      name: "Bharatiya Sakshya Adhiniyam, 2023",
      jurisdiction: "India",
      relevance: "High", 
      reason: "New evidence law replacing Indian Evidence Act"
    },
    {
      id: 206,
      name: "The Digital Personal Data Protection Act, 2023",
      jurisdiction: "India",
      relevance: "High",
      reason: "Recent legislation affecting tech and privacy law"
    },
    {
      id: 207,
      name: "The Arbitration and Conciliation Act, 1996",
      jurisdiction: "India",
      relevance: "Medium",
      reason: "Important for dispute resolution practice"
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
      title="Indian Statute & Regulation Tracker"
      description="Stay up-to-date with changes in Indian laws and regulations including the new BNS, BNSS and BSA criminal laws. Set up alerts for amendments, Supreme Court interpretations, and regulatory changes relevant to your practice."
      icon={<Scale className="w-6 h-6 text-white" />}
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="relative">
            <Input
              placeholder="Search Indian statutes by name..."
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
                          <Badge variant="outline" className={`${
                            update.type === 'Major Revision' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            update.type === 'Amendment' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            update.type === 'Judgment' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          } border-${update.type === 'Major Revision' ? 'red' : update.type === 'Amendment' ? 'blue' : update.type === 'Judgment' ? 'purple' : 'green'}-200 hover:bg-${update.type === 'Major Revision' ? 'red' : update.type === 'Amendment' ? 'blue' : update.type === 'Judgment' ? 'purple' : 'green'}-100`}>
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
