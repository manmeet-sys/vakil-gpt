
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';

export interface ToolResult {
  id: string;
  toolName: string;
  toolType: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentData {
  id: string;
  title: string;
  content: string;
  documentType: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToolUsage {
  toolName: string;
  toolType: string;
  usedAt: string;
  count: number;
}

interface UserDataContextType {
  toolResults: ToolResult[];
  documents: DocumentData[];
  toolUsageHistory: ToolUsage[];
  saveToolResult: (toolName: string, toolType: string, data: any) => Promise<string>;
  saveDocument: (title: string, content: string, documentType: string) => Promise<string>;
  trackToolUsage: (toolName: string, toolType: string) => void;
  getToolHistory: (toolType: string) => ToolResult[];
  exportData: (data: any, fileName: string, type: 'json' | 'csv' | 'txt' | 'pdf') => void;
  clearToolResults: () => void;
  clearDocuments: () => void;
}

const UserDataContext = createContext<UserDataContextType | null>(null);

export const UserDataProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [toolResults, setToolResults] = useState<ToolResult[]>([]);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [toolUsageHistory, setToolUsageHistory] = useState<ToolUsage[]>([]);

  // Initialize data from localStorage on mount
  useEffect(() => {
    try {
      const storedResults = localStorage.getItem('toolResults');
      const storedDocuments = localStorage.getItem('userDocuments');
      const storedUsageHistory = localStorage.getItem('toolUsageHistory');

      if (storedResults) {
        setToolResults(JSON.parse(storedResults));
      }
      
      if (storedDocuments) {
        setDocuments(JSON.parse(storedDocuments));
      }
      
      if (storedUsageHistory) {
        setToolUsageHistory(JSON.parse(storedUsageHistory));
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
      toast.error('Failed to load your saved data');
    }
  }, []);

  // Save tool result
  const saveToolResult = useCallback(async (toolName: string, toolType: string, data: any): Promise<string> => {
    try {
      const newToolResult: ToolResult = {
        id: crypto.randomUUID(),
        toolName,
        toolType,
        data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setToolResults(prev => {
        const updated = [newToolResult, ...prev];
        // Store in localStorage (limit to 50 items to prevent storage issues)
        localStorage.setItem('toolResults', JSON.stringify(updated.slice(0, 50)));
        return updated;
      });

      toast.success('Result saved successfully');
      return newToolResult.id;
    } catch (error) {
      console.error('Error saving tool result:', error);
      toast.error('Failed to save result');
      throw error;
    }
  }, []);

  // Save document
  const saveDocument = useCallback(async (title: string, content: string, documentType: string): Promise<string> => {
    try {
      const newDocument: DocumentData = {
        id: crypto.randomUUID(),
        title,
        content,
        documentType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setDocuments(prev => {
        const updated = [newDocument, ...prev];
        localStorage.setItem('userDocuments', JSON.stringify(updated.slice(0, 30)));
        return updated;
      });

      toast.success('Document saved successfully');
      return newDocument.id;
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document');
      throw error;
    }
  }, []);

  // Track tool usage
  const trackToolUsage = useCallback((toolName: string, toolType: string) => {
    try {
      const now = new Date().toISOString();
      
      setToolUsageHistory(prev => {
        // Check if tool already exists in history
        const existingIndex = prev.findIndex(item => item.toolName === toolName && item.toolType === toolType);
        
        let updated: ToolUsage[];
        
        if (existingIndex >= 0) {
          // Update existing entry
          updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            usedAt: now,
            count: updated[existingIndex].count + 1
          };
        } else {
          // Add new entry
          updated = [...prev, { toolName, toolType, usedAt: now, count: 1 }];
        }
        
        // Sort by most recent
        updated.sort((a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime());
        
        // Store in localStorage
        localStorage.setItem('toolUsageHistory', JSON.stringify(updated.slice(0, 100)));
        
        return updated;
      });
    } catch (error) {
      console.error('Error tracking tool usage:', error);
    }
  }, []);

  // Get tool history by type
  const getToolHistory = useCallback((toolType: string): ToolResult[] => {
    return toolResults.filter(result => result.toolType === toolType);
  }, [toolResults]);

  // Export data function
  const exportData = useCallback((data: any, fileName: string, type: 'json' | 'csv' | 'txt' | 'pdf') => {
    try {
      let content = '';
      let mimeType = '';
      
      switch (type) {
        case 'json':
          content = JSON.stringify(data, null, 2);
          mimeType = 'application/json';
          fileName = `${fileName}.json`;
          break;
        
        case 'csv':
          if (Array.isArray(data) && data.length > 0) {
            const headers = Object.keys(data[0]).join(',');
            const rows = data.map(item => Object.values(item).join(','));
            content = [headers, ...rows].join('\n');
          } else {
            content = 'No data to export';
          }
          mimeType = 'text/csv';
          fileName = `${fileName}.csv`;
          break;
        
        case 'txt':
          content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
          mimeType = 'text/plain';
          fileName = `${fileName}.txt`;
          break;
        
        case 'pdf':
          // For PDF, we would typically use a library like jsPDF
          // This is a simplified version that just exports the text
          content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
          mimeType = 'text/plain';
          fileName = `${fileName}.txt`;
          toast.info('PDF export is not supported yet. Exporting as TXT instead.');
          break;
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Exported ${fileName} successfully`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  }, []);

  // Clear functions
  const clearToolResults = useCallback(() => {
    setToolResults([]);
    localStorage.removeItem('toolResults');
    toast.success('Tool results cleared');
  }, []);

  const clearDocuments = useCallback(() => {
    setDocuments([]);
    localStorage.removeItem('userDocuments');
    toast.success('Documents cleared');
  }, []);

  return (
    <UserDataContext.Provider value={{
      toolResults,
      documents,
      toolUsageHistory,
      saveToolResult,
      saveDocument,
      trackToolUsage,
      getToolHistory,
      exportData,
      clearToolResults,
      clearDocuments
    }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
