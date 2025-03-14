
import React, { useState } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { useCategories } from '@/context/CategoryContext';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUp, ArrowDown, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import TransactionForm from '@/components/transactions/TransactionForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

const Transactions: React.FC = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const { getCategoryById } = useCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const handleEditClick = (id: string) => {
    setEditingTransaction(id);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
    }
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  // Filtrar transações com base no termo de pesquisa
  const filteredTransactions = transactions.filter(
    transaction =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryById(transaction.categoryId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transações</h2>
          <p className="text-muted-foreground">Gerencie suas transações financeiras</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Transação
        </Button>
      </div>

      <div className="w-full">
        <Input
          placeholder="Pesquisar transações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Data</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tipo</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Valor</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categoria</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Descrição</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => {
                  const category = getCategoryById(transaction.categoryId);
                  return (
                    <tr key={transaction.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">{format(new Date(transaction.date), 'dd/MM/yyyy')}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center">
                          {transaction.type === 'INCOME' ? (
                            <ArrowUp className="h-4 w-4 mr-2 text-income" />
                          ) : (
                            <ArrowDown className="h-4 w-4 mr-2 text-expense" />
                          )}
                          {transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}
                        </div>
                      </td>
                      <td className={`p-4 align-middle font-medium ${transaction.type === 'INCOME' ? 'text-income' : 'text-expense'}`}>
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="p-4 align-middle">{category?.name}</td>
                      <td className="p-4 align-middle">{transaction.description}</td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end space-x-2">
                          <Button size="icon" variant="ghost" onClick={() => handleEditClick(transaction.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-expense" onClick={() => handleDeleteClick(transaction.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <TransactionForm
          isOpen={isFormOpen}
          onClose={closeForm}
          transactionId={editingTransaction}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a transação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Transactions;
