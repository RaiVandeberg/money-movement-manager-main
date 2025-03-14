
import React from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { useCategories } from '@/context/CategoryContext';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';

interface RecentTransactionsProps {
  limit?: number;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ limit }) => {
  const { transactions } = useTransactions();
  const { getCategoryById } = useCategories();

  // Ordenar transações por data (mais recentes primeiro) e aplicar limite se especificado
  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  if (sortedTransactions.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">Nenhuma transação ainda</div>;
  }

  return (
    <div className="space-y-4">
      {sortedTransactions.map((transaction) => {
        const category = getCategoryById(transaction.categoryId);
        return (
          <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center">
              <div className={`p-2 rounded-full mr-3 ${transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'}`}>
                {transaction.type === 'INCOME' ? (
                  <ArrowUp className="h-5 w-5 text-income" />
                ) : (
                  <ArrowDown className="h-5 w-5 text-expense" />
                )}
              </div>
              <div>
                <h4 className="font-medium">{transaction.description}</h4>
                <p className="text-sm text-muted-foreground">
                  {category?.name} • {format(new Date(transaction.date), 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
            <div className={`font-medium ${transaction.type === 'INCOME' ? 'text-income' : 'text-expense'}`}>
              {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(transaction.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentTransactions;
