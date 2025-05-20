'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Search } from 'lucide-react';
import { CarBrand, Model, BodyType, EngineType, GearBox, Transmission } from '@/types';

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
    gearbox: '',
    driveType: '',
  });

  // Состояния для справочных данных
  const [brands, setBrands] = useState<CarBrand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [engineTypes, setEngineTypes] = useState<EngineType[]>([]);
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([]);
  const [gearBoxes, setGearBoxes] = useState<GearBox[]>([]);
  const [driveTypes, setDriveTypes] = useState<Transmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка справочных данных при первом рендере
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const response = await fetch('/api/reference/all');
        if (!response.ok) throw new Error('Failed to fetch reference data');

        const data = await response.json();
        setBrands(data.brands);
        setEngineTypes(data.engineTypes);
        setBodyTypes(data.bodyTypes);
        setGearBoxes(data.gearBoxes);
        setDriveTypes(data.driveTypes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reference data:', error);
        setLoading(false);
      }
    };

    fetchReferenceData();
  }, []);

  // Загрузка моделей при выборе бренда
  useEffect(() => {
    if (filters.brand) {
      const fetchModels = async () => {
        try {
          const response = await fetch(`/api/reference/models?brandId=${filters.brand}`);
          if (!response.ok) throw new Error('Failed to fetch models');

          const data = await response.json();
          setModels(data);
        } catch (error) {
          console.error('Error fetching models:', error);
        }
      };

      fetchModels();
    } else {
      setModels([]);
    }
  }, [filters.brand]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    // Если меняется бренд, сбрасываем модель
    if (key === 'brand') {
      setFilters((prev) => ({ ...prev, model: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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

  // Если данные еще загружаются, показываем заглушку
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="flex justify-end">
          <div className="h-10 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="text-2xl font-medium font-heading mb-4">
        83547 объявлений о продаже авто в Беларуси
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full border rounded-md h-10 px-3 text-left flex items-center justify-between">
              <span>
                {filters.brand
                  ? brands.find(b => b.idcb.toString() === filters.brand)?.carbrand || 'Марка'
                  : 'Марка'
                }
              </span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full max-h-[300px] overflow-y-auto bg-white">
              {brands.map((brand) => (
                <DropdownMenuItem
                  key={brand.idcb}
                  onClick={() => handleFilterChange('brand', brand.idcb.toString())}
                  className="hover:bg-gray-100"
                >
                  {brand.carbrand}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="w-full border rounded-md h-10 px-3 text-left flex items-center justify-between"
              disabled={!filters.brand}
            >
              <span>
                {filters.model
                  ? models.find(m => m.idmodels.toString() === filters.model)?.modelname || 'Модель'
                  : 'Модель'
                }
              </span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full max-h-[300px] overflow-y-auto bg-white">
              <DropdownMenuItem onClick={() => handleFilterChange('model', '')} className="hover:bg-gray-100">
                Все модели
              </DropdownMenuItem>
              {models.map((model) => (
                <DropdownMenuItem
                  key={model.idmodels}
                  onClick={() => handleFilterChange('model', model.idmodels.toString())}
                  className="hover:bg-gray-100"
                >
                  {model.modelname}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full border rounded-md h-10 px-3 text-left flex items-center justify-between">
              <span>Цена от-до</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full bg-white">
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
            <DropdownMenuContent align="start" className="w-full bg-white">
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
              <span>
                {filters.engineType
                  ? engineTypes.find(et => et.idet.toString() === filters.engineType)?.enginetype || 'Двигатель'
                  : 'Двигатель'
                }
              </span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full bg-white">
              {engineTypes.map((et) => (
                <DropdownMenuItem
                  key={et.idet}
                  onClick={() => handleFilterChange('engineType', et.idet.toString())}
                  className="hover:bg-gray-100"
                >
                  {et.enginetype}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full border rounded-md h-10 px-3 text-left flex items-center justify-between">
              <span>
                {filters.bodyType
                  ? bodyTypes.find(bt => bt.idbt.toString() === filters.bodyType)?.bodytype || 'Кузов'
                  : 'Кузов'
                }
              </span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full bg-white">
              {bodyTypes.map((bt) => (
                <DropdownMenuItem
                  key={bt.idbt}
                  onClick={() => handleFilterChange('bodyType', bt.idbt.toString())}
                  className="hover:bg-gray-100"
                >
                  {bt.bodytype}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full border rounded-md h-10 px-3 text-left flex items-center justify-between">
              <span>
                {filters.gearbox
                  ? gearBoxes.find(gb => gb.idgb.toString() === filters.gearbox)?.gb || 'КПП'
                  : 'КПП'
                }
              </span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full bg-white">
              {gearBoxes.map((gb) => (
                <DropdownMenuItem
                  key={gb.idgb}
                  onClick={() => handleFilterChange('gearbox', gb.idgb.toString())}
                  className="hover:bg-gray-100"
                >
                  {gb.gb}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full border rounded-md h-10 px-3 text-left flex items-center justify-between">
              <span>
                {filters.driveType
                  ? driveTypes.find(dt => dt.idtm.toString() === filters.driveType)?.drivetype || 'Привод'
                  : 'Привод'
                }
              </span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full bg-white">
              {driveTypes.map((dt) => (
                <DropdownMenuItem
                  key={dt.idtm}
                  onClick={() => handleFilterChange('driveType', dt.idtm.toString())}
                  className="hover:bg-gray-100"
                >
                  {dt.drivetype}
                </DropdownMenuItem>
              ))}
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
