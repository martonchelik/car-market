'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Bell, BellOff, Search, Trash2, PlusCircle } from 'lucide-react';
import Link from 'next/link';

interface SavedSearch {
  id: string;
  name: string;
  filters: Record<string, unknown>;
  createdAt: string;
  notifyOnNew: boolean;
}

interface SavedSearchesListProps {
  searches: SavedSearch[];
}

export default function SavedSearchesList({ searches }: SavedSearchesListProps) {
  const [savedSearches, setSavedSearches] = useState(searches);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatFilters = (filters: Record<string, unknown>) => {
    const parts = [];

    if (filters.make) {
      parts.push(String(filters.make));
    }

    if (filters.priceFrom || filters.priceTo) {
      const priceRange = [];
      if (filters.priceFrom) priceRange.push(`от ${filters.priceFrom}$`);
      if (filters.priceTo) priceRange.push(`до ${filters.priceTo}$`);
      parts.push(priceRange.join(' '));
    }

    if (filters.yearFrom || filters.yearTo) {
      const yearRange = [];
      if (filters.yearFrom) yearRange.push(`от ${filters.yearFrom} г.`);
      if (filters.yearTo) yearRange.push(`до ${filters.yearTo} г.`);
      parts.push(yearRange.join(' '));
    }

    if (filters.engineType) {
      parts.push(String(filters.engineType));
    }

    return parts.join(', ');
  };

  const toggleNotifications = (id: string) => {
    setSavedSearches(prev =>
      prev.map(search =>
        search.id === id
          ? { ...search, notifyOnNew: !search.notifyOnNew }
          : search
      )
    );
  };

  const deleteSearch = async (id: string) => {
    // In a real app, you would call an API to delete the search
    setSavedSearches(prev => prev.filter(search => search.id !== id));
  };

  const handleSearchClick = (filters: Record<string, unknown>) => {
    // In a real app, this would navigate to the search results page with the filters applied
    console.log('Search with filters:', filters);
  };

  const createQueryString = (filters: Record<string, unknown>) => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params.append(key, String(value));
      }
    }

    return params.toString();
  };

  return (
    <div>
      {savedSearches.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray mb-4">
            У вас пока нет сохраненных поисков
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <PlusCircle className="h-4 w-4 mr-2" />
            Создать поиск
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">Ваши сохраненные поиски</h3>
            <Button className="bg-primary hover:bg-primary/90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Создать поиск
            </Button>
          </div>

          <div className="space-y-4">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{search.name}</h4>
                    <p className="text-sm text-gray">
                      Создан {formatDate(search.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center mt-2 md:mt-0 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleNotifications(search.id)}
                      className={search.notifyOnNew ? 'text-primary' : 'text-gray'}
                    >
                      {search.notifyOnNew ? (
                        <Bell className="h-4 w-4 mr-1" />
                      ) : (
                        <BellOff className="h-4 w-4 mr-1" />
                      )}
                      {search.notifyOnNew ? 'Уведомления вкл.' : 'Уведомления выкл.'}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSearch(search.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-gray-100 mb-3">
                  <div className="text-sm">
                    {formatFilters(search.filters)}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    href={`/cars?${createQueryString(search.filters)}`}
                    className="bg-primary text-white hover:bg-primary/90 rounded-md px-4 py-2 text-sm flex items-center transition-colors"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Показать результаты
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
