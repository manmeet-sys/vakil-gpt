import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export interface PracticeAreaToolContextType {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  saveToHistory: (toolType: string, data: any) => void;
  getHistory: (toolType: string) => any[];
  clearHistory: (toolType?: string) => void;
  saveToFavorites: (toolType: string, data: any) => void;
  getFavorites: (toolType: string) => any[];
  removeFavorite: (toolType: string, id: string) => void;
}

const PracticeAreaToolContext = createContext<PracticeAreaToolContextType | null>(null);

export const PracticeAreaToolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Save tool data to local storage history
  const saveToHistory = (toolType: string, data: any) => {
    try {
      // Create a unique key for each tool type
      const historyKey = `vakil_tool_history_${toolType}`;
      
      // Get existing history or initialize empty array
      let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      
      // Add new entry with timestamp to beginning of array
      history.unshift({
        ...data,
        timestamp: new Date().toISOString(),
        id: crypto.randomUUID()
      });
      
      // Keep only the last 20 items
      history = history.slice(0, 20);
      
      // Save back to local storage
      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };
  
  // Get history for a specific tool type
  const getHistory = (toolType: string) => {
    try {
      const historyKey = `vakil_tool_history_${toolType}`;
      return JSON.parse(localStorage.getItem(historyKey) || '[]');
    } catch (error) {
      console.error('Error retrieving history:', error);
      return [];
    }
  };
  
  // Clear all history or for a specific tool type
  const clearHistory = (toolType?: string) => {
    try {
      if (toolType) {
        const historyKey = `vakil_tool_history_${toolType}`;
        localStorage.removeItem(historyKey);
      } else {
        // Clear all tool history by finding all keys that match the pattern
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('vakil_tool_history_')) {
            localStorage.removeItem(key);
          }
        });
      }
      toast.success(toolType ? `History cleared for ${toolType}` : 'All history cleared');
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('Failed to clear history');
    }
  };
  
  // Save tool data to favorites
  const saveToFavorites = (toolType: string, data: any) => {
    try {
      const favoritesKey = `vakil_tool_favorites_${toolType}`;
      let favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
      
      // Check if already exists by id
      const exists = favorites.some((item: any) => item.id === data.id);
      
      if (!exists) {
        // Add to favorites with timestamp
        favorites.push({
          ...data,
          savedAt: new Date().toISOString(),
          id: data.id || crypto.randomUUID()
        });
        
        // Save back to local storage
        localStorage.setItem(favoritesKey, JSON.stringify(favorites));
        toast.success('Added to favorites');
      } else {
        toast.info('Already in favorites');
      }
    } catch (error) {
      console.error('Error saving to favorites:', error);
      toast.error('Failed to save to favorites');
    }
  };
  
  // Get favorites for a specific tool type
  const getFavorites = (toolType: string) => {
    try {
      const favoritesKey = `vakil_tool_favorites_${toolType}`;
      return JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    } catch (error) {
      console.error('Error retrieving favorites:', error);
      return [];
    }
  };
  
  // Remove a favorite by id
  const removeFavorite = (toolType: string, id: string) => {
    try {
      const favoritesKey = `vakil_tool_favorites_${toolType}`;
      let favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
      
      favorites = favorites.filter((item: any) => item.id !== id);
      
      localStorage.setItem(favoritesKey, JSON.stringify(favorites));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };
  
  return (
    <PracticeAreaToolContext.Provider value={{
      isLoading,
      setIsLoading,
      saveToHistory,
      getHistory,
      clearHistory,
      saveToFavorites,
      getFavorites,
      removeFavorite
    }}>
      {children}
    </PracticeAreaToolContext.Provider>
  );
};

export const usePracticeAreaTool = () => {
  const context = useContext(PracticeAreaToolContext);
  
  if (!context) {
    throw new Error('usePracticeAreaTool must be used within a PracticeAreaToolProvider');
  }
  
  return context;
};
