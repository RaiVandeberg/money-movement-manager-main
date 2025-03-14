
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, TransactionType } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load transactions from local storage
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      // Mock data for initial demo
      const mockTransactions: Transaction[] = [
        {
          id: uuidv4(),
          date: new Date().toISOString(),
          type: 'INCOME',
          amount: 2500.00,
          categoryId: '1',
          description: 'Salary',
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          date: new Date().toISOString(),
          type: 'EXPENSE',
          amount: 500.00,
          categoryId: '2',
          description: 'Rent',
          createdAt: new Date().toISOString(),
        },
      ];
      setTransactions(mockTransactions);
      localStorage.setItem('transactions', JSON.stringify(mockTransactions));
    }
    setIsLoading(false);
  }, []);

  const saveTransactions = (updatedTransactions: Transaction[]) => {
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    toast({
      title: 'Transaction added',
      description: 'Your transaction has been added successfully.',
    });
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    const updatedTransactions = transactions.map((t) =>
      t.id === id ? { ...t, ...transaction } : t
    );
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    toast({
      title: 'Transaction updated',
      description: 'Your transaction has been updated successfully.',
    });
  };

  const deleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    toast({
      title: 'Transaction deleted',
      description: 'Your transaction has been deleted successfully.',
    });
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
