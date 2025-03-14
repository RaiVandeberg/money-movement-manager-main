
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useTransactions } from '@/context/TransactionContext';
import { useCategories } from '@/context/CategoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction, TransactionType } from '@/types';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, transactionId }) => {
  const { transactions, addTransaction, updateTransaction } = useTransactions();
  const { categories } = useCategories();
  const [date, setDate] = useState<Date>(new Date());
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transactionId) {
      const transaction = transactions.find((t) => t.id === transactionId);
      if (transaction) {
        setDate(new Date(transaction.date));
        setType(transaction.type);
        setAmount(transaction.amount.toString());
        setCategoryId(transaction.categoryId);
        setDescription(transaction.description);
      }
    } else {
      // Set default values for new transaction
      setDate(new Date());
      setType('EXPENSE');
      setAmount('');
      setCategoryId(categories.length > 0 ? categories[0].id : '');
      setDescription('');
    }
  }, [transactionId, transactions, categories]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const transactionData = {
      date: date.toISOString(),
      type,
      amount: Number(amount),
      categoryId,
      description,
    };

    if (transactionId) {
      updateTransaction(transactionId, transactionData);
    } else {
      addTransaction(transactionData);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{transactionId ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
          <DialogDescription>
            {transactionId ? 'Update your transaction details.' : 'Enter the details for your new transaction.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>Transaction Type</Label>
              <RadioGroup
                value={type}
                onValueChange={(value) => setType(value as TransactionType)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="INCOME" id="income" />
                  <Label htmlFor="income" className="cursor-pointer">Income</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="EXPENSE" id="expense" />
                  <Label htmlFor="expense" className="cursor-pointer">Expense</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {transactionId ? 'Update' : 'Add'} Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
