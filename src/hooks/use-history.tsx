
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type HistoryAction = 'create' | 'update' | 'delete' | 'restore';

export interface HistoryEntry {
  id: string;
  action: HistoryAction;
  entityType: string;
  entityId: string;
  entityName: string;
  timestamp: Date;
  user: string;
  details?: string;
}

// Store history entries in localStorage for persistence across refreshes
const HISTORY_KEY = 'app_history';

const getStoredHistory = (): HistoryEntry[] => {
  try {
    const historyData = localStorage.getItem(HISTORY_KEY);
    if (historyData) {
      const parsedHistory = JSON.parse(historyData);
      // Convert string dates back to Date objects
      return parsedHistory.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
    }
  } catch (error) {
    console.error('Error parsing history data:', error);
  }
  return [];
};

const saveHistoryToStorage = (history: HistoryEntry[]) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving history data:', error);
  }
};

// Initial history data to populate the system
const defaultHistoryEntries: HistoryEntry[] = [
  {
    id: '1',
    action: 'create',
    entityType: 'inventory',
    entityId: 'RM-001',
    entityName: 'Non-woven PP Fabric (White)',
    timestamp: new Date(2023, 9, 15, 9, 30),
    user: 'Admin User',
    details: 'Added initial stock of 250 kg'
  },
  {
    id: '2',
    action: 'update',
    entityType: 'inventory',
    entityId: 'RM-002',
    entityName: 'Non-woven PP Fabric (Green)',
    timestamp: new Date(2023, 9, 16, 11, 45),
    user: 'John Smith',
    details: 'Updated stock from 100 to 50 kg'
  },
  {
    id: '3',
    action: 'create',
    entityType: 'purchase',
    entityId: 'PO-2023-001',
    entityName: 'Purchase Order - Supplier XYZ',
    timestamp: new Date(2023, 9, 17, 14, 20),
    user: 'Admin User',
    details: 'Created purchase order for ₹15,000'
  },
  {
    id: '4',
    action: 'delete',
    entityType: 'expense',
    entityId: 'EXP-2023-005',
    entityName: 'Office Supplies',
    timestamp: new Date(2023, 9, 18, 16, 10),
    user: 'Sarah Jones',
    details: 'Removed duplicate expense entry'
  },
  {
    id: '5',
    action: 'create',
    entityType: 'ledger',
    entityId: 'LED-2023-042',
    entityName: 'Payment Receipt - Customer ABC',
    timestamp: new Date(2023, 9, 19, 10, 25),
    user: 'John Smith',
    details: 'Recorded payment of ₹25,000'
  }
];

export const useHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const storedHistory = getStoredHistory();
    // If there's no stored history, use the default entries
    return storedHistory.length > 0 ? storedHistory : defaultHistoryEntries;
  });

  const addHistoryEntry = useCallback((
    action: HistoryAction,
    entityType: string,
    entityId: string,
    entityName: string,
    details?: string
  ) => {
    if (!user) return;

    const newEntry: HistoryEntry = {
      id: `history-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      action,
      entityType,
      entityId,
      entityName,
      timestamp: new Date(),
      user: user.name,
      details
    };

    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    saveHistoryToStorage(updatedHistory);
    
    return newEntry;
  }, [history, user]);

  const getHistoryByEntityType = useCallback((entityType: string) => {
    return history.filter(entry => entry.entityType === entityType);
  }, [history]);

  const getHistoryByEntityId = useCallback((entityId: string) => {
    return history.filter(entry => entry.entityId === entityId);
  }, [history]);

  return {
    history,
    addHistoryEntry,
    getHistoryByEntityType,
    getHistoryByEntityId
  };
};
