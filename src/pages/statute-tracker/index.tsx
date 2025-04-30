
import React, { useState, useEffect } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Scale, Bell, Eye, EyeOff, Clock, Calendar, RefreshCw, Info, FileText, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import BackButton from '@/components/BackButton';

const StatuteTrackerPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('tracking');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Mocked Indian statutes for demonstration
  const [trackedStatutes, setTrackedStatutes] = useState([
    {
      id: 1,
      name: "Information Technology Act, 2000",
      jurisdiction: "India",
      lastUpdated: "2024-04-30",
      recentChanges: 2,
      notifications: true,
      details: {
        gazetteRef: "Part II, Section 3(i) of the Gazette of India",
        enforcementDate: "October 17, 2000",
        keyAuthority: "Ministry of Electronics & Information Technology",
        officialLink: "https://www.meity.gov.in/content/information-technology-act-2000",
        relatedRules: ["Information Technology Rules, 2021", "Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021"]
      }
    },
    {
      id: 2,
      name: "The Constitution of India",
      jurisdiction: "India",
      lastUpdated: "2024-03-15",
      recentChanges: 1,
      notifications: true,
      details: {
        gazetteRef: "Constituent Assembly Debates",
        enforcementDate: "January 26, 1950",
        keyAuthority: "Parliament of India",
        officialLink: "https://legislative.gov.in/constitution-of-india/",
        relatedRules: ["Part III - Fundamental Rights", "Part IV - Directive Principles", "Part IVA - Fundamental Duties"]
      }
    },
    {
      id: 3,
      name: "Bharatiya Nyaya Sanhita, 2023",
      jurisdiction: "India",
      lastUpdated: "2024-04-25",
      recentChanges: 5,
      notifications: true,
      details: {
        gazetteRef: "CG-DL-E-25122023-255156",
        enforcementDate: "July 1, 2024",
        keyAuthority: "Ministry of Home Affairs",
        officialLink: "https://mha.gov.in/en/acts-rules-regulations",
        relatedRules: ["BNS Rules, 2024", "Guidelines for Implementation of BNS, 2024"]
      }
    },
    {
      id: 4,
      name: "Bharatiya Nagarik Suraksha Sanhita, 2023",
      jurisdiction: "India",
      lastUpdated: "2024-04-25",
      recentChanges: 4, 
      notifications: true,
      details: {
        gazetteRef: "CG-DL-E-25122023-255157",
        enforcementDate: "July 1, 2024",
        keyAuthority: "Ministry of Home Affairs",
        officialLink: "https://mha.gov.in/en/acts-rules-regulations",
        relatedRules: ["BNSS Implementation Rules, 2024", "Electronic Evidence Guidelines under BNSS, 2024"]
      }
    },
    {
      id: 5,
      name: "Bharatiya Sakshya Adhiniyam, 2023",
      jurisdiction: "India",
      lastUpdated: "2024-04-25",
      recentChanges: 3,
      notifications: false,
      details: {
        gazetteRef: "CG-DL-E-25122023-255158",
        enforcementDate: "July 1, 2024",
        keyAuthority: "Ministry of Law and Justice",
        officialLink: "https://legislative.gov.in/acts-rules-and-bills/",
        relatedRules: ["BSA Implementation Rules, 2024", "Digital Evidence Standards under BSA, 2024"]
      }
    },
    {
      id: 6,
      name: "The Digital Personal Data Protection Act, 2023",
      jurisdiction: "India",
      lastUpdated: "2024-04-28",
      recentChanges: 2,
      notifications: true,
      details: {
        gazetteRef: "CG-DL-E-11082023-244611",
        enforcementDate: "Expected July 2024",
        keyAuthority: "Ministry of Electronics & Information Technology",
        officialLink: "https://www.meity.gov.in/data-protection-framework",
        relatedRules: ["DPDP Rules (Draft), 2024", "Data Protection Authority Guidelines (Draft)"]
      }
    },
    {
      id: 7,
      name: "Competition Act, 2002 (as amended)",
      jurisdiction: "India",
      lastUpdated: "2024-04-15",
      recentChanges: 1,
      notifications: true,
      details: {
        gazetteRef: "Part II, Section 3(i) of the Gazette of India",
        enforcementDate: "March 31, 2003 (with subsequent amendments)",
        keyAuthority: "Competition Commission of India",
        officialLink: "https://www.cci.gov.in/legal-framework/competition-act",
        relatedRules: ["Competition Commission of India Rules, 2022", "Merger Control Regulations, 2023"]
      }
    }
  ]);
  
  // Mocked statute updates (India-specific)
  const [statuteUpdates, setStatuteUpdates] = useState([
    {
      id: 101,
      statuteName: "Information Technology Act, 2000",
      updateDate: "2024-04-30",
      description: "New rules regarding data localization and digital privacy under Section 87",
      type: "Amendment",
      link: "https://www.meity.gov.in/notification/2024/04/30/data-localization"
    },
    {
      id: 102,
      statuteName: "Information Technology Act, 2000",
      updateDate: "2024-03-22",
      description: "Updated requirements for intermediary liability protections under Section 79",
      type: "Rules",
      link: "https://www.meity.gov.in/notification/2024/03/22/intermediary-guidelines"
    },
    {
      id: 103,
      statuteName: "The Constitution of India",
      updateDate: "2024-03-15",
      description: "Supreme Court interpretation of 103rd Constitutional Amendment related to EWS reservations",
      type: "Interpretation",
      link: "https://main.sci.gov.in/judgments/2024-03-15"
    },
    {
      id: 104,
      statuteName: "Bharatiya Nyaya Sanhita, 2023",
      updateDate: "2024-04-25",
      description: "Release of implementation guidelines for transition from IPC to BNS",
      type: "Implementation Guidelines",
      link: "https://mha.gov.in/BNS-implementation-guidelines-2024"
    },
    {
      id: 105,
      statuteName: "Bharatiya Nyaya Sanhita, 2023",
      updateDate: "2024-04-10",
      description: "Updated sections on cybercrime and digital fraud (Sections 318-324)",
      type: "Amendment",
      link: "https://mha.gov.in/BNS-cybercrime-sections-2024"
    },
    {
      id: 106,
      statuteName: "Bharatiya Nyaya Sanhita, 2023",
      updateDate: "2024-03-18",
      description: "Supreme Court clarification on applicability of Section 103 (mob lynching)",
      type: "Judgment",
      link: "https://main.sci.gov.in/judgments/2024-03-18"
    },
    {
      id: 107,
      statuteName: "Bharatiya Nagarik Suraksha Sanhita, 2023",
      updateDate: "2024-04-25",
      description: "Implementation timeline and transition guidelines from CrPC to BNSS",
      type: "Implementation Guidelines",
      link: "https://mha.gov.in/BNSS-implementation-guidelines-2024"
    },
    {
      id: 108,
      statuteName: "Bharatiya Nagarik Suraksha Sanhita, 2023",
      updateDate: "2024-04-05",
      description: "Guidelines issued for recording of electronic evidence under Section 78",
      type: "Rules",
      link: "https://mha.gov.in/BNSS-electronic-evidence-guidelines-2024"
    },
    {
      id: 109,
      statuteName: "Bharatiya Sakshya Adhiniyam, 2023",
      updateDate: "2024-04-25",
      description: "Implementation timeline and transition guidelines from Indian Evidence Act to BSA",
      type: "Implementation Guidelines",
      link: "https://lawmin.gov.in/BSA-implementation-guidelines-2024"
    },
    {
      id: 110,
      statuteName: "Digital Personal Data Protection Act, 2023",
      updateDate: "2024-04-28",
      description: "Draft rules for Data Protection Authority formation and processes",
      type: "Draft Rules",
      link: "https://www.meity.gov.in/dpdpa-draft-rules-2024"
    },
    {
      id: 111,
      statuteName: "Competition Act, 2002",
      updateDate: "2024-04-15",
      description: "New merger control thresholds for digital businesses",
      type: "Regulation",
      link: "https://www.cci.gov.in/regulations/2024/04/merger-thresholds"
    }
  ]);
  
  // Mocked recommendations (India-specific)
  const recommendations = [
    {
      id: 201,
      name: "The Companies Act, 2013",
      jurisdiction: "India",
      relevance: "High",
      reason: "Recent amendments on corporate law compliance and governance",
      details: {
        gazetteRef: "Part II, Section 3(i) of the Gazette of India",
        enforcementDate: "April 1, 2014 (with subsequent amendments)",
        keyAuthority: "Ministry of Corporate Affairs",
        officialLink: "https://www.mca.gov.in/content/mca/global/en/acts-rules/companies-act.html"
      }
    },
    {
      id: 202,
      name: "The Right to Information Act, 2005",
      jurisdiction: "India",
      relevance: "Medium",
      reason: "Important for transparency and administrative law practice",
      details: {
        gazetteRef: "Part II, Section 3(i) of the Gazette of India",
        enforcementDate: "October 12, 2005",
        keyAuthority: "Ministry of Personnel, Public Grievances & Pensions",
        officialLink: "https://rti.gov.in/"
      }
    },
    {
      id: 203,
      name: "Banking Regulation Act, 1949 (as amended)",
      jurisdiction: "India",
      relevance: "High",
      reason: "Recent amendments on digital banking and fintech regulations",
      details: {
        gazetteRef: "Part II, Section 3(i) of the Gazette of India",
        enforcementDate: "March 16, 1949 (with subsequent amendments)",
        keyAuthority: "Reserve Bank of India",
        officialLink: "https://www.rbi.org.in/Scripts/Bs_rbiActAndRegulations.aspx"
      }
    },
    {
      id: 204,
      name: "Real Estate (Regulation and Development) Act, 2016",
      jurisdiction: "India",
      relevance: "Medium",
      reason: "Essential for real estate practice and consumer protection",
      details: {
        gazetteRef: "Part II, Section 3(i) of the Gazette of India",
        enforcementDate: "May 1, 2016",
        keyAuthority: "Ministry of Housing and Urban Affairs",
        officialLink: "https://mohua.gov.in/cms/real-estate-regulation-and-development-act-2016.php"
      }
    },
    {
      id: 205,
      name: "Arbitration and Conciliation Act, 1996 (as amended)",
      jurisdiction: "India",
      relevance: "High", 
      reason: "Recent amendments on international arbitration and enforcement",
      details: {
        gazetteRef: "Part II, Section 3(i) of the Gazette of India",
        enforcementDate: "August 16, 1996 (with subsequent amendments)",
        keyAuthority: "Ministry of Law and Justice",
        officialLink: "https://legislative.gov.in/acts-rules-and-bills/"
      }
    },
    {
      id: 206,
      name: "Insolvency and Bankruptcy Code, 2016",
      jurisdiction: "India",
      relevance: "High",
      reason: "Recent amendments on cross-border insolvency and pre-packaged resolution",
      details: {
        gazetteRef: "Part II, Section 3(i) of the Gazette of India",
        enforcementDate: "May 28, 2016",
        keyAuthority: "Insolvency and Bankruptcy Board of India",
        officialLink: "https://ibbi.gov.in/legal-framework/act"
      }
    },
    {
      id: 207,
      name: "Consumer Protection Act, 2019",
      jurisdiction: "India",
      relevance: "Medium",
      reason: "Important for e-commerce and consumer dispute resolution practice",
      details: {
        gazetteRef: "Part II, Section 3(i) of the Gazette of India",
        enforcementDate: "July 20, 2020",
        keyAuthority: "Ministry of Consumer Affairs",
        officialLink: "https://consumeraffairs.nic.in/consumer-protection"
      }
    }
  ];
  
  // Effect to simulate refreshing statutes data daily
  useEffect(() => {
    const now = new Date();
    setLastUpdated(now.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }));
    
    // Simulate daily refresh at midnight
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeToMidnight = midnight.getTime() - now.getTime();
    
    const timer = setTimeout(() => {
      refreshStatutes();
    }, timeToMidnight);
    
    return () => clearTimeout(timer);
  }, []);
  
  const refreshStatutes = async () => {
    setIsRefreshing(true);
    
    try {
      // In a real implementation, this would be an API call to fetch the latest statute data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate updated data
      const updatedDate = new Date().toISOString().split('T')[0];
      
      // Update the last updated timestamp for some statutes
      setTrackedStatutes(prev => 
        prev.map((statute, idx) => 
          idx % 3 === 0 ? { ...statute, lastUpdated: updatedDate, recentChanges: statute.recentChanges + 1 } : statute
        )
      );
      
      // Add a new update
      const newUpdate = {
        id: Math.max(...statuteUpdates.map(s => s.id)) + 1,
        statuteName: trackedStatutes[Math.floor(Math.random() * trackedStatutes.length)].name,
        updateDate: updatedDate,
        description: "New update from daily refresh",
        type: ["Amendment", "Rules", "Judgment", "Interpretation"][Math.floor(Math.random() * 4)],
        link: "https://example.com/new-update"
      };
      
      setStatuteUpdates(prev => [newUpdate, ...prev]);
      
      const now = new Date();
      setLastUpdated(now.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));
      
      toast({
        title: "Statutes Updated",
        description: `Successfully refreshed statute data at ${now.toLocaleTimeString('en-IN')}`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not refresh statute data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
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
      const newStatute = {
        id: Date.now(),
        name: recommendation.name,
        jurisdiction: recommendation.jurisdiction,
        lastUpdated: new Date().toISOString().split('T')[0],
        recentChanges: 0,
        notifications: true,
        details: recommendation.details
      };
      
      setTrackedStatutes([...trackedStatutes, newStatute]);
      
      toast({
        title: "Statute Added",
        description: `${recommendation.name} has been added to your tracking list`,
      });
    } else {
      toast({
        title: "Already Tracking",
        description: `${recommendation.name} is already in your tracking list`,
        variant: "destructive"
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
        <BackButton to="/tools" label="Back to Tools" />
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-5 rounded-xl mb-6 border border-blue-100 dark:border-blue-900/30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold mb-1 text-slate-800 dark:text-slate-100">Indian Statute Tracker</h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Monitor legal updates from the Gazette of India, Supreme Court judgments, ministry notifications and more
              </p>
              {lastUpdated && (
                <div className="flex items-center mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="h-3 w-3 mr-1" />
                  Last refreshed: {lastUpdated}
                </div>
              )}
            </div>
            
            <Button 
              onClick={refreshStatutes} 
              disabled={isRefreshing}
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Input
              placeholder="Search Indian statutes by name or jurisdiction..."
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
                  <Card key={statute.id} className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="border-b border-gray-100 dark:border-zinc-800 p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{statute.name}</h3>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Info className="h-4 w-4 text-blue-500" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <div className="space-y-2 text-sm">
                                    <h4 className="font-medium">Statute Details</h4>
                                    <div className="grid grid-cols-3 gap-1">
                                      <p className="text-gray-500 dark:text-gray-400 col-span-1">Gazette Ref:</p>
                                      <p className="col-span-2">{statute.details?.gazetteRef || 'Not available'}</p>
                                      
                                      <p className="text-gray-500 dark:text-gray-400 col-span-1">Enforced:</p>
                                      <p className="col-span-2">{statute.details?.enforcementDate || 'Not available'}</p>
                                      
                                      <p className="text-gray-500 dark:text-gray-400 col-span-1">Authority:</p>
                                      <p className="col-span-2">{statute.details?.keyAuthority || 'Not available'}</p>
                                      
                                      <p className="text-gray-500 dark:text-gray-400 col-span-1">Official:</p>
                                      <p className="col-span-2">
                                        {statute.details?.officialLink ? (
                                          <a href={statute.details.officialLink} target="_blank" rel="noopener noreferrer" 
                                             className="text-blue-600 dark:text-blue-400 hover:underline">
                                            View Source
                                          </a>
                                        ) : 'Not available'}
                                      </p>
                                    </div>
                                    
                                    {statute.details?.relatedRules && statute.details.relatedRules.length > 0 && (
                                      <div className="mt-2">
                                        <p className="font-medium text-xs mb-1">Related Rules & Regulations</p>
                                        <ul className="list-disc pl-4 space-y-0.5">
                                          {statute.details.relatedRules.map((rule, index) => (
                                            <li key={index} className="text-xs">{rule}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Jurisdiction: {statute.jurisdiction}
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="h-4 w-4 mr-1" />
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
                                    <Bell className="h-4 w-4 mr-1 text-blue-500" />
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
                      </div>
                      
                      {statute.recentChanges > 0 && (
                        <div className="p-4 bg-gray-50 dark:bg-zinc-800/50">
                          <div className="flex items-center gap-2 text-sm mb-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">Recent Changes</span>
                          </div>
                          <div className="space-y-2">
                            {statuteUpdates
                              .filter(update => update.statuteName === statute.name)
                              .slice(0, 2)
                              .map(update => (
                                <div key={update.id} className="text-sm border-l-2 border-blue-200 dark:border-blue-800 pl-3">
                                  <div className="flex justify-between">
                                    <p className="font-medium">{update.description}</p>
                                    <Badge className={`${
                                      update.type === 'Major Revision' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                      update.type === 'Amendment' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                      update.type === 'Judgment' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    } hover:bg-opacity-90`}>
                                      {update.type}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">{update.updateDate}</span>
                                    <a 
                                      href={update.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                      View Details
                                    </a>
                                  </div>
                                </div>
                              ))}
                              
                            {statuteUpdates.filter(update => update.statuteName === statute.name).length > 2 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs w-full mt-1"
                                onClick={() => {
                                  setActiveTab('updates');
                                  setSearchTerm(statute.name);
                                }}
                              >
                                View all changes
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
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
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-medium">Recent Legislative Updates</h2>
              <Badge variant="outline" className="bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-800/50">
                {statuteUpdates.length} updates tracked
              </Badge>
            </div>
            
            <div className="space-y-4">
              {statuteUpdates
                .filter(update => 
                  searchTerm ? 
                  update.statuteName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  update.description.toLowerCase().includes(searchTerm.toLowerCase()) :
                  true
                )
                .map(update => (
                  <Card key={update.id} className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{update.statuteName}</h3>
                          <Badge variant="outline" className={`${
                            update.type === 'Major Revision' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            update.type === 'Amendment' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            update.type === 'Judgment' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          } border-${update.type === 'Major Revision' ? 'red' : update.type === 'Amendment' ? 'blue' : update.type === 'Judgment' ? 'purple' : 'green'}-200 dark:border-opacity-50 hover:bg-opacity-90`}>
                            {update.type}
                          </Badge>
                        </div>
                        <p className="text-sm">{update.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-1" />
                            {update.updateDate}
                          </div>
                          <a 
                            href={update.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <BookOpen className="h-4 w-4" />
                            View Source
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
              {statuteUpdates.filter(update => 
                searchTerm ? 
                update.statuteName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                update.description.toLowerCase().includes(searchTerm.toLowerCase()) :
                true
              ).length === 0 && (
                <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">No updates found for your search criteria</p>
                    {searchTerm && (
                      <Button 
                        onClick={() => setSearchTerm('')}
                        variant="outline" 
                        className="mt-4"
                      >
                        Clear Search
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <div className="space-y-4 mt-4">
              {recommendations.map(recommendation => (
                <Card key={recommendation.id} className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{recommendation.name}</h3>
                          <Badge className={recommendation.relevance === 'High' ? 'bg-blue-500' : 'bg-slate-500'}>
                            {recommendation.relevance} relevance
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Jurisdiction: {recommendation.jurisdiction}
                        </p>
                        <p className="text-sm mt-1">
                          <span className="text-gray-600 dark:text-gray-400">Why: </span>
                          {recommendation.reason}
                        </p>
                        
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="mt-2 flex items-center gap-1 px-0">
                              <Info className="h-4 w-4 text-blue-500" />
                              <span className="text-blue-600 dark:text-blue-400 text-sm">View Details</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2 text-sm">
                              <h4 className="font-medium">Statute Details</h4>
                              <div className="grid grid-cols-3 gap-1">
                                <p className="text-gray-500 dark:text-gray-400 col-span-1">Gazette Ref:</p>
                                <p className="col-span-2">{recommendation.details?.gazetteRef || 'Not available'}</p>
                                
                                <p className="text-gray-500 dark:text-gray-400 col-span-1">Enforced:</p>
                                <p className="col-span-2">{recommendation.details?.enforcementDate || 'Not available'}</p>
                                
                                <p className="text-gray-500 dark:text-gray-400 col-span-1">Authority:</p>
                                <p className="col-span-2">{recommendation.details?.keyAuthority || 'Not available'}</p>
                                
                                <p className="text-gray-500 dark:text-gray-400 col-span-1">Official:</p>
                                <p className="col-span-2">
                                  {recommendation.details?.officialLink ? (
                                    <a href={recommendation.details.officialLink} target="_blank" rel="noopener noreferrer" 
                                        className="text-blue-600 dark:text-blue-400 hover:underline">
                                      View Source
                                    </a>
                                  ) : 'Not available'}
                                </p>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <Button 
                        onClick={() => addToTracking(recommendation)}
                        className={`shrink-0 ${
                          trackedStatutes.some(s => s.name === recommendation.name) ? 
                          'bg-green-500 hover:bg-green-600 cursor-default' : 
                          ''
                        }`}
                        disabled={trackedStatutes.some(s => s.name === recommendation.name)}
                      >
                        {trackedStatutes.some(s => s.name === recommendation.name) ? (
                          <>Already Tracking</>
                        ) : (
                          <>Add to Tracking</>
                        )}
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
