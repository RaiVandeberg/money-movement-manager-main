
import React, { useState } from 'react';
import { useCategories } from '@/context/CategoryContext';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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

const Categories: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      setError('O nome da categoria não pode estar vazio');
      return;
    }

    // Verificar se já existe uma categoria com o mesmo nome
    if (categories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      setError('Já existe uma categoria com este nome');
      return;
    }

    addCategory(newCategoryName.trim());
    setNewCategoryName('');
    setIsDialogOpen(false);
    setError('');
  };

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      const success = deleteCategory(categoryToDelete);
      if (success) {
        setCategoryToDelete(null);
      }
    }
    setDeleteDialogOpen(false);
  };

  // Filtrar categorias com base no termo de pesquisa
  const filteredCategories = categories.filter(
    category => category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
          <p className="text-muted-foreground">Gerencie suas categorias de transações</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Categoria
        </Button>
      </div>

      <div className="w-full">
        <Input
          placeholder="Pesquisar categorias..."
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
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nome</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Criado em</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-muted-foreground">
                    Nenhuma categoria encontrada.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{category.name}</td>
                    <td className="p-4 align-middle">{format(new Date(category.createdAt), 'dd/MM/yyyy')}</td>
                    <td className="p-4 align-middle text-right">
                      <Button size="icon" variant="ghost" className="text-expense" onClick={() => handleDeleteClick(category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diálogo para Adicionar Categoria */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Categoria</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Categoria</Label>
              <Input
                id="name"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                  setError('');
                }}
                placeholder="Digite o nome da categoria"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setNewCategoryName('');
                setError('');
              }}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleAddCategory}>
              Adicionar Categoria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a categoria.
              Se a categoria estiver em uso, não será excluída.
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

export default Categories;
