'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Search, Trash2, ExternalLink, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SavedSearch {
  id: number;
  name: string;
  query_string: string;
  filters: string;
  created_at: string;
}

interface SavedSearchesListProps {
  initialSearches?: SavedSearch[];
}

export default function SavedSearchesList({ initialSearches = [] }: SavedSearchesListProps) {
  const [searches, setSearches] = useState<SavedSearch[]>(initialSearches);
  const [isLoading, setIsLoading] = useState(initialSearches.length === 0);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    if (initialSearches.length === 0) {
      fetchSavedSearches();
    }
  }, [initialSearches]);

  const fetchSavedSearches = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/saved-searches');
      if (!response.ok) {
        throw new Error('Не удалось загрузить сохраненные поиски');
      }
      const data = await response.json();
      setSearches(data);
    } catch (error) {
      console.error('Ошибка при загрузке сохраненных поисков:', error);
      toast.error('Не удалось загрузить сохраненные поиски');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSearch = async (searchId: number) => {
    setRemovingId(searchId);
    try {
      const response = await fetch(`/api/user/saved-searches?id=${searchId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Не удалось удалить сохраненный поиск');
      }

      setSearches(prevSearches => prevSearches.filter(search => search.id !== searchId));
      toast.success('Поиск удален');
    } catch (error) {
      console.error('Ошибка при удалении поиска:', error);
      toast.error('Не удалось удалить сохраненный поиск');
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500">Загрузка сохраненных поисков...</p>
      </div>
    );
  }

  if (searches.length === 0) {
    return (
      <div className="py-10 text-center">
        <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium mb-2">У вас пока нет сохраненных поисков</h3>
        <p className="text-gray-500 mb-6">Сохраняйте результаты поиска, чтобы быстро возвращаться к ним</p>
        <Link href="/cars">
          <Button className="bg-primary hover:bg-primary/90">Начать поиск</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searches.map(search => {
        // Попытка парсинга фильтров JSON
        let filters = {};
        try {
          filters = JSON.parse(search.filters);
        } catch (e) {
          console.error('Ошибка при парсинге фильтров:', e);
        }

        return (
          <div key={search.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center">
                  <Search className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="font-medium">{search.name}</h3>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  <p>Сохранен: {new Date(search.created_at).toLocaleDateString()}</p>

                  {/* Отображение основных параметров поиска если они есть */}
                  {Object.keys(filters).length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {Object.entries(filters).map(([key, value]) => (
                        value && <span key={key} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href={search.query_string}>
                    <ExternalLink size={16} className="mr-1" /> Перейти
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => deleteSearch(search.id)}
                  disabled={removingId === search.id}
                >
                  <Trash2 size={16} className="mr-1" />
                  {removingId === search.id ? 'Удаление...' : 'Удалить'}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
