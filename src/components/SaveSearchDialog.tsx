'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookmarkPlus } from 'lucide-react';

interface SaveSearchDialogProps {
  filters: Record<string, string>;
  onSuccess?: () => void;
}

export function SaveSearchDialog({ filters, onSuccess }: SaveSearchDialogProps) {
  const { data: session, status } = useSession();
  const [searchName, setSearchName] = useState('');
  const [notifyOnNew, setNotifyOnNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Преобразуем фильтры для сохранения
  const prepareFilters = () => {
    const prepared = { ...filters };

    // Преобразуем числовые значения из строк в числа
    if (prepared.priceFrom) prepared.priceFrom = parseInt(prepared.priceFrom);
    if (prepared.priceTo) prepared.priceTo = parseInt(prepared.priceTo);
    if (prepared.yearFrom) prepared.yearFrom = parseInt(prepared.yearFrom);
    if (prepared.yearTo) prepared.yearTo = parseInt(prepared.yearTo);

    return prepared;
  };

  const handleSave = async () => {
    if (!searchName.trim()) {
      setError('Введите название для поискового запроса');
      return;
    }

    if (!session?.user) {
      setError('Необходимо авторизоваться для сохранения поиска');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch('/api/user/saved-searches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: searchName,
          filters: prepareFilters(),
          notifyOnNew,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Не удалось сохранить поиск');
      }

      // Сброс формы и закрытие диалога
      setSearchName('');
      setNotifyOnNew(false);
      setIsOpen(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка при сохранении поиска');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1"
          disabled={!session && status !== 'loading'}
        >
          <BookmarkPlus size={16} />
          <span>Сохранить поиск</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Сохранить поисковый запрос</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Название поиска
            </label>
            <Input
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Например: BMW X5 в отличном состоянии"
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="notify"
              checked={notifyOnNew}
              onChange={(e) => setNotifyOnNew(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="notify" className="text-sm">
              Уведомлять о новых объявлениях
            </label>
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          )}

          <div className="text-sm text-gray-500">
            <div className="font-medium mb-1">Параметры поиска:</div>
            <ul className="list-disc pl-5">
              {Object.entries(filters).map(([key, value]) => (
                value && (
                  <li key={key}>
                    {key === 'brand' && `Марка: ${value}`}
                    {key === 'model' && `Модель: ${value}`}
                    {key === 'priceFrom' && `Цена от: ${value} $`}
                    {key === 'priceTo' && `Цена до: ${value} $`}
                    {key === 'yearFrom' && `Год от: ${value}`}
                    {key === 'yearTo' && `Год до: ${value}`}
                    {key === 'engineType' && `Двигатель: ${value}`}
                    {key === 'transmission' && `КПП: ${value}`}
                    {key === 'driveType' && `Привод: ${value}`}
                  </li>
                )
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSaving}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
