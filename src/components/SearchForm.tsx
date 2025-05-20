'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Search } from 'lucide-react';

export function SearchForm() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    priceFrom: '',
    priceTo: '',
    yearFrom: '',
    yearTo: '',
    engineType: '',
    bodyType: '',
    transmission: '',
    driveType: '',
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Построение строки запроса
    const queryParams = new URLSearchParams();

    // Добавляем только заполненные фильтры в URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    // Перенаправляем на страницу с результатами
    router.push(`/cars?${queryParams.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="text-2xl font-medium font-heading mb-4">
        83547 объявлений о продаже авто в Беларуси
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full border rounded-md h-10 px-3 text-left flex items-center justify-between">
              <span>{filters.brand || 'Марка'}</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full">
              <DropdownMenuItem onClick={() => handleFilterChange('brand', 'Audi')}>Audi</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('brand', 'BMW')}>BMW</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('brand', 'Mercedes-Benz')}>Mercedes-Benz</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('brand', 'Volkswagen')}>Volkswagen</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('brand', 'Toyota')}>Toyota</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full border rounded-md h-10 px-3 text-left flex items-center justify-between">
              <span>{filters.model || 'Модель'}</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full">
              <DropdownMenuItem onClick={() => handleFilterChange('model', '')}>Все модели</DropdownMenuItem>
              {filters.brand === 'Audi' && (
                <>
                  <DropdownMenuItem onClick={() => handleFilterChange('model', 'A4')}>A4</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange('model', 'A6')}>A6</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange('model', 'Q5')}>Q5</DropdownMenuItem>
                </>
              )}
              {filters.brand === 'BMW' && (
                <>
                  <DropdownMenuItem onClick={() => handleFilterChange('model', '3 серия')}>3 серия</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange('model', '5 серия')}>5 серия</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange('model', 'X5')}>X5</DropdownMenuItem>
                </>
              )}
              {filters.brand === 'Mercedes-Benz' && (
                <>
                  <DropdownMenuItem onClick={() => handleFilterChange('model', 'C-класс')}>C-класс</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange('model', 'E-класс')}>E-класс</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange('model', 'S-класс')}>S-класс</DropdownMenuItem>
                </>
              )}
              {filters.brand === 'Volkswagen' && (
                <>
                  <DropdownMenuItem onClick={() => handleFilterChange('model', 'Golf')}>Golf</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange('model', 'Passat')}>Passat</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange('model', 'Multivan')}>Multivan</DropdownMenuItem>
                </>
              )}
              {filters.brand === 'Toyota' && (
                <>
                  <DropdownMenuItem onClick={() => handleFilterChange('model', 'Camry')}>Camry</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange('model', 'Corolla')}>Corolla</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange('model', 'C-HR')}>C-HR</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full border rounded-md h-10 px-3 text-left flex items-center justify-between">
              <span>Цена от-до</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full">
              <div className="p-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="от"
                    className="h-8"
                    value={filters.priceFrom}
                    onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
                  />
                  <Input
                    placeholder="до"
                    className="h-8"
                    value={filters.priceTo}
                    onChange={(e) => handleFilterChange('priceTo', e.target.value)}
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full border rounded-md h-10 px-3 text-left flex items-center justify-between">
              <span>Год от-до</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full">
              <div className="p-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="от"
                    className="h-8"
                    value={filters.yearFrom}
                    onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                  />
                  <Input
                    placeholder="до"
                    className="h-8"
                    value={filters.yearTo}
                    onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full border rounded-md h-10 px-3 text-left flex items-center justify-between">
              <span>{filters.engineType || 'Двигатель'}</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full">
              <DropdownMenuItem onClick={() => handleFilterChange('engineType', 'бензин')}>Бензин</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('engineType', 'дизель')}>Дизель</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('engineType', 'электро')}>Электро</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('engineType', 'гибрид')}>Гибрид</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full border rounded-md h-10 px-3 text-left flex items-center justify-between">
              <span>{filters.bodyType || 'Кузов'}</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full">
              <DropdownMenuItem onClick={() => handleFilterChange('bodyType', 'седан')}>Седан</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('bodyType', 'универсал')}>Универсал</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('bodyType', 'хэтчбек')}>Хэтчбек</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('bodyType', 'внедорожник')}>Внедорожник</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full border rounded-md h-10 px-3 text-left flex items-center justify-between">
              <span>{filters.transmission || 'КПП'}</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full">
              <DropdownMenuItem onClick={() => handleFilterChange('transmission', 'автомат')}>Автомат</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('transmission', 'механика')}>Механика</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('transmission', 'робот')}>Робот</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full border rounded-md h-10 px-3 text-left flex items-center justify-between">
              <span>{filters.driveType || 'Привод'}</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full">
              <DropdownMenuItem onClick={() => handleFilterChange('driveType', 'передний')}>Передний</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('driveType', 'задний')}>Задний</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('driveType', 'полный')}>Полный</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6">
          <Search className="h-4 w-4 mr-2" />
          Показать объявления
        </Button>
      </div>
    </form>
  );
}
