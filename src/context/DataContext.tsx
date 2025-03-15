
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types
export interface Parameter {
  id: string;
  name: string;
  value: string | number;
}

export interface DataEntry {
  id: string;
  date: Date;
  parameters: Parameter[];
}

export interface User {
  isLoggedIn: boolean;
  guestEntriesCount: number;
  // We would add more user properties when implementing authentication
}

interface DataContextType {
  dataEntries: DataEntry[];
  activeSection: string;
  user: User;
  addEntry: (entry: DataEntry) => void;
  removeEntry: (id: string) => void;
  setActiveSection: (section: string) => void;
  clearAllData: () => void;
}

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [user, setUser] = useState<User>({
    isLoggedIn: false,
    guestEntriesCount: 0,
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedEntries = localStorage.getItem('dataEntries');
    if (storedEntries) {
      try {
        // Parse dates correctly from JSON
        const parsedEntries: DataEntry[] = JSON.parse(storedEntries);
        parsedEntries.forEach(entry => {
          entry.date = new Date(entry.date);
        });
        setDataEntries(parsedEntries);
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dataEntries', JSON.stringify(dataEntries));
  }, [dataEntries]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  // Check guest entry limit
  useEffect(() => {
    if (!user.isLoggedIn && dataEntries.length > 0) {
      setUser(prev => ({
        ...prev,
        guestEntriesCount: dataEntries.length
      }));
    }
  }, [dataEntries, user.isLoggedIn]);

  // Functions to modify data
  const addEntry = (entry: DataEntry) => {
    // For guest users, limit to 7 entries
    if (!user.isLoggedIn && user.guestEntriesCount >= 7) {
      // Show a message or prompt login
      console.log('Guest users are limited to 7 entries. Please log in to continue.');
      return;
    }

    setDataEntries(prev => [...prev, entry]);
  };

  const removeEntry = (id: string) => {
    setDataEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const clearAllData = () => {
    setDataEntries([]);
    if (!user.isLoggedIn) {
      setUser(prev => ({
        ...prev,
        guestEntriesCount: 0
      }));
    }
  };

  // Context value
  const value = {
    dataEntries,
    activeSection,
    user,
    addEntry,
    removeEntry,
    setActiveSection,
    clearAllData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
