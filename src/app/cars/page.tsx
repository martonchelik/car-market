'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchForm } from '@/components/SearchForm';
import { CarListingCard } from '@/components/CarListingCard';
import { SaveSearchDialog } from '@/components/SaveSearchDialog';
import { carListings } from '@/data/carListings';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CarsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filteredCars, setFilteredCars] = useState(carListings);
  const [appliedFilters, setAppliedFilters] = useState({});

  useEffect(() => {
    // Получаем все фильтры из URL
    const filters = {
      brand: searchParams.get('brand') || '',
      model: searchParams.get('model') || '',
      priceFrom: searchParams.get('priceFrom') || '',
      priceTo: searchParams.get('priceTo') || '',
      yearFrom: searchParams.get('yearFrom') || '',
      yearTo: searchParams.get('yearTo') || '',
      engineType: searchParams.get('engineType') || '',
      bodyType: searchParams.get('bodyType') || '',
      transmission: searchParams.get('transmission') || '',
      driveType: searchParams.get('driveType') || '',
    };

    // Сохраняем примененные фильтры для отображения
    setAppliedFilters(filters);

    // Фильтруем автомобили
    let results = [...carListings];

    // Фильтр по марке (содержится в title)
    if (filters.brand) {
      results = results.filter(car =>
        car.title.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    // Фильтр по модели (содержится в title)
    if (filters.model) {
      results = results.filter(car =>
        car.title.toLowerCase().includes(filters.model.toLowerCase())
      );
    }

    // Фильтр по цене
    if (filters.priceFrom) {
      results = results.filter(car =>
        Number(car.price.usd) >= Number(filters.priceFrom)
      );
    }
    if (filters.priceTo) {
      results = results.filter(car =>
        Number(car.price.usd) <= Number(filters.priceTo)
      );
    }

    // Фильтр по году
    if (filters.yearFrom) {
      results = results.filter(car =>
        car.year >= Number(filters.yearFrom)
      );
    }
    if (filters.yearTo) {
      results = results.filter(car =>
        car.year <= Number(filters.yearTo)
      );
    }

    // Фильтр по типу двигателя
    if (filters.engineType) {
      results = results.filter(car =>
        car.engineType.toLowerCase() === filters.engineType.toLowerCase()
      );
    }

    // Фильтр по КПП
    if (filters.transmission) {
      results = results.filter(car =>
        car.transmission.toLowerCase() === filters.transmission.toLowerCase()
      );
    }

    setFilteredCars(results);
  }, [searchParams]);

  // Формируем строку с примененными фильтрами для отображения
  const getAppliedFiltersText = () => {
    const filterItems = [];

    if (appliedFilters.brand) filterItems.push(`Марка: ${appliedFilters.brand}`);
    if (appliedFilters.model) filterItems.push(`Модель: ${appliedFilters.model}`);
    if (appliedFilters.priceFrom) filterItems.push(`Цена от: ${appliedFilters.priceFrom} $`);
    if (appliedFilters.priceTo) filterItems.push(`Цена до: ${appliedFilters.priceTo} $`);
    if (appliedFilters.yearFrom) filterItems.push(`Год от: ${appliedFilters.yearFrom}`);
    if (appliedFilters.yearTo) filterItems.push(`Год до: ${appliedFilters.yearTo}`);
    if (appliedFilters.engineType) filterItems.push(`Двигатель: ${appliedFilters.engineType}`);
    if (appliedFilters.transmission) filterItems.push(`КПП: ${appliedFilters.transmission}`);
    if (appliedFilters.driveType) filterItems.push(`Привод: ${appliedFilters.driveType}`);

    return filterItems.length > 0
      ? `Найдено ${filteredCars.length} объявлений по параметрам: ${filterItems.join(', ')}`
      : 'Все автомобили';
  };

  // Функция для удаления отдельного фильтра
  const removeFilter = (key) => {
    // Создаем новый объект URLSearchParams из текущего URL
    const params = new URLSearchParams(searchParams.toString());

    // Удаляем выбранный фильтр
    params.delete(key);

    // Если после удаления не осталось фильтров, перенаправляем на /cars без параметров
    if ([...params.entries()].length === 0) {
      router.push('/cars');
    } else {
      // Иначе обновляем URL с оставшимися фильтрами
      router.push(`/cars?${params.toString()}`);
    }
  };

  // Функция для сброса всех фильтров
  const resetAllFilters = () => {
    router.push('/cars');
  };

  // Получаем имя фильтра для отображения
  const getFilterLabel = (key) => {
    const labels = {
      brand: 'Марка',
      model: 'Модель',
      priceFrom: 'Цена от',
      priceTo: 'Цена до',
      yearFrom: 'Год от',
      yearTo: 'Год до',
      engineType: 'Двигатель',
      bodyType: 'Кузов',
      transmission: 'КПП',
      driveType: 'Привод'
    };
    return labels[key] || key;
  };

  // Форматирование значения фильтра для отображения
  const formatFilterValue = (key, value) => {
    if (key.includes('price')) {
      return `${value} $`;
    }
    return value;
  };

  // Обработчик успешного сохранения поиска
  const handleSearchSaved = () => {
    toast.success('Поисковый запрос сохранен!');
  };

  // Проверка наличия примененных фильтров
  const hasAppliedFilters = Object.values(appliedFilters).some(value => value);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-[#f1f4f7] py-6">
        <div className="container-av">
          {/* Хлебные крошки */}
          <div className="mb-4 text-sm">
            <Link href="/" className="text-gray hover:text-primary">Главная</Link>
            <span className="mx-2 text-gray">/</span>
            <span className="text-gray-dark">Автомобили</span>
          </div>

          {/* Форма поиска */}
          <SearchForm />

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-medium font-heading">
                {hasAppliedFilters
                  ? `Найдено ${filteredCars.length} объявлений`
                  : 'Все автомобили'}
              </h1>

              {/* Кнопка сохранить поиск, только если есть фильтры */}
              {hasAppliedFilters && (
                <SaveSearchDialog
                  filters={appliedFilters}
                  onSuccess={handleSearchSaved}
                />
              )}
            </div>

            {/* Блок примененных фильтров */}
            {hasAppliedFilters && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {Object.entries(appliedFilters).map(([key, value]) => (
                    value && (
                      <div
                        key={key}
                        className="bg-gray-100 rounded-full px-3 py-1.5 text-sm flex items-center gap-1 hover:bg-gray-200"
                        onClick={() => removeFilter(key)}
                        role="button"
                        tabIndex={0}
                      >
                        <span>{getFilterLabel(key)}: {formatFilterValue(key, value)}</span>
                        <X size={14} className="text-gray-500" />
                      </div>
                    )
                  ))}
                  {hasAppliedFilters && (
                    <button
                      onClick={resetAllFilters}
                      className="text-sm text-primary hover:underline flex items-center"
                    >
                      Сбросить все фильтры
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {filteredCars.length > 0 ? (
            <div className="space-y-4">
              {filteredCars.map((car) => (
                <CarListingCard
                  key={car.id}
                  id={car.id}
                  title={car.title}
                  year={car.year}
                  imageUrl={car.imageUrl}
                  engineType={car.engineType}
                  engineVolume={car.engineVolume}
                  transmission={car.transmission}
                  mileage={car.mileage}
                  price={car.price}
                  location={car.location}
                  date={car.date}
                  verified={car.verified}
                  vinChecked={car.vinChecked}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-xl font-medium mb-2">Объявления не найдены</h2>
              <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
              <button
                onClick={resetAllFilters}
                className="text-primary hover:underline mt-4 inline-block"
              >
                Сбросить все фильтры
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
