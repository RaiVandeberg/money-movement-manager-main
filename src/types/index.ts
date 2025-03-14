
export type User = {
  id: string;
  name: string;
  email: string;
};

export type Category = {
  id: string;
  name: string;
  createdAt: string;
};

export type TransactionType = 'INCOME' | 'EXPENSE';

export type Transaction = {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  createdAt: string;
};
