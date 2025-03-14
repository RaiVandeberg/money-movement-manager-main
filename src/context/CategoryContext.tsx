
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

interface CategoryContextType {
  categories: Category[];
  isLoading: boolean;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => boolean;
  getCategoryById: (id: string) => Category | undefined;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load categories from local storage
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Mock data for initial demo
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Salary',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Rent',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Groceries',
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Entertainment',
          createdAt: new Date().toISOString(),
        },
      ];
      setCategories(mockCategories);
      localStorage.setItem('categories', JSON.stringify(mockCategories));
    }
    setIsLoading(false);
  }, []);

  const saveCategories = (updatedCategories: Category[]) => {
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: uuidv4(),
      name,
      createdAt: new Date().toISOString(),
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    toast({
      title: 'Category added',
      description: 'Your category has been added successfully.',
    });
  };

  const deleteCategory = (id: string): boolean => {
    // Check if category is in use in transactions
    const categoriesInUse = JSON.parse(localStorage.getItem('transactions') || '[]')
      .map((t: any) => t.categoryId);
    
    if (categoriesInUse.includes(id)) {
      toast({
        title: 'Cannot delete category',
        description: 'This category is being used by transactions.',
        variant: 'destructive',
      });
      return false;
    }

    const updatedCategories = categories.filter((c) => c.id !== id);
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    toast({
      title: 'Category deleted',
      description: 'Your category has been deleted successfully.',
    });
    return true;
  };

  const getCategoryById = (id: string) => {
    return categories.find((c) => c.id === id);
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        isLoading,
        addCategory,
        deleteCategory,
        getCategoryById,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
