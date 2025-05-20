'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchForm } from '@/components/SearchForm';
import { CarListingCard } from '@/components/CarListingCard';
import { SaveSearchDialog } from '@/components/SaveSearchDialog';
import { CarListingView } from '@/types';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CarsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [carListings, setCarListings] = useState<CarListingView[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarListingView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Справочники для отображения имен вместо ID
  const [carBrands, setCarBrands] = useState<{[key: string]: string}>({});
  const [engineTypes, setEngineTypes] = useState<{[key: string]: string}>({});
  const [bodyTypes, setBodyTypes] = useState<{[key: string]: string}>({});
  const [gearBoxes, setGearBoxes] = useState<{[key: string]: string}>({});
  const [driveTypes, setDriveTypes] = useState<{[key: string]: string}>({});

  const [appliedFilters, setAppliedFilters] = useState<{[key: string]: string}>({});

  // Загрузка справочных данных для отображения имен
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const response = await fetch('/api/reference/all');
        if (!response.ok) throw new Error('Failed to fetch reference data');

        const data = await response.json();

        // Преобразуем списки в справочники для быстрого доступа по ID
        const brandsMap: {[key: string]: string} = {};
        data.brands.forEach((brand: any) => {
          brandsMap[brand.idcb] = brand.carbrand;
        });
        setCarBrands(brandsMap);

        const engineTypesMap: {[key: string]: string} = {};
        data.engineTypes.forEach((et: any) => {
          engineTypesMap[et.idet] = et.enginetype;
        });
        setEngineTypes(engineTypesMap);

        const bodyTypesMap: {[key: string]: string} = {};
        data.bodyTypes.forEach((bt: any) => {
          bodyTypesMap[bt.idbt] = bt.bodytype;
        });
        setBodyTypes(bodyTypesMap);

        const gearBoxesMap: {[key: string]: string} = {};
        data.gearBoxes.forEach((gb: any) => {
          gearBoxesMap[gb.idgb] = gb.gb;
        });
        setGearBoxes(gearBoxesMap);

        const driveTypesMap: {[key: string]: string} = {};
        data.driveTypes.forEach((dt: any) => {
          driveTypesMap[dt.idtm] = dt.drivetype;
        });
        setDriveTypes(driveTypesMap);
      } catch (error) {
        console.error('Error fetching reference data:', error);
      }
    };

    fetchReferenceData();
  }, []);

  // Загружаем автомобили при первом рендере или при изменении параметров URL
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError(null);

      try {
        // Конструируем URL с параметрами фильтрации
        let url = '/api/cars';
        if (searchParams.toString()) {
          url += `?${searchParams.toString()}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch cars');

        const data = await response.json();
        setCarListings(data);
        setFilteredCars(data);

        // Получаем применённые фильтры из URL
        const filters: {[key: string]: string} = {};
        searchParams.forEach((value, key) => {
          filters[key] = value;
        });
        setAppliedFilters(filters);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [searchParams]);

  // Функция для удаления отдельного фильтра
  const removeFilter = (key: string) => {
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
  const getFilterLabel = (key: string) => {
    const labels: {[key: string]: string} = {
      brand: 'Марка',
      model: 'Модель',
      priceFrom: 'Цена от',
      priceTo: 'Цена до',
      yearFrom: 'Год от',
      yearTo: 'Год до',
      engineType: 'Двигатель',
      bodyType: 'Кузов',
      gearbox: 'КПП',
      driveType: 'Привод'
    };
    return labels[key] || key;
  };

  // Форматирование значения фильтра для отображения
  const formatFilterValue = (key: string, value: string) => {
    // Проверяем, нужно ли преобразовать ID в имя
    if (key === 'brand' && carBrands[value]) {
      return carBrands[value];
    } else if (key === 'engineType' && engineTypes[value]) {
      return engineTypes[value];
    } else if (key === 'bodyType' && bodyTypes[value]) {
      return bodyTypes[value];
    } else if (key === 'gearbox' && gearBoxes[value]) {
      return gearBoxes[value];
    } else if (key === 'driveType' && driveTypes[value]) {
      return driveTypes[value];
    } else if (key.includes('price')) {
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

  // Если данные загружаются, показываем заглушку
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-[#f1f4f7] py-6">
          <div className="container-av">
            <div className="mb-4 text-sm">
              <Link href="/" className="text-gray hover:text-primary">Главная</Link>
              <span className="mx-2 text-gray">/</span>
              <span className="text-gray-dark">Автомобили</span>
            </div>

            <SearchForm />

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/4 h-40 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Если есть ошибка, показываем сообщение
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-[#f1f4f7] py-6">
          <div className="container-av">
            <div className="mb-4 text-sm">
              <Link href="/" className="text-gray hover:text-primary">Главная</Link>
              <span className="mx-2 text-gray">/</span>
              <span className="text-gray-dark">Автомобили</span>
            </div>

            <SearchForm />

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-xl font-medium mb-2 text-red-500">{error}</h2>
              <button
                onClick={resetAllFilters}
                className="text-primary hover:underline mt-4 inline-block"
              >
                Сбросить все фильтры и попробовать снова
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                  key={car.idads}
                  id={car.idads.toString()}
                  title={`${car.carbrand} ${car.modelname}`}
                  year={car.prodyear}
                  imageUrl={car.imageUrl || 'https://ext.same-assets.com/1085385641/1248550479.jpg'}
                  engineType={car.enginetype}
                  engineVolume={car.engvol.toString()}
                  transmission={car.gb}
                  mileage={car.milage.toString()}
                  price={{
                    byn: (car.price * 3.12).toFixed(2),
                    usd: car.price.toString(),
                  }}
                  location={'Минск'} // Заглушка, если в базе нет этого поля
                  date={car.date_added ? new Date(car.date_added).toLocaleDateString() : '3 дн. назад'}
                  verified={car.active}
                  vinChecked={false} // Заглушка, если в базе нет этого поля
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
