'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface CarImage {
  id: number;
  car_id: number;
  url: string;
  main: boolean;
}

interface Car {
  idads: number;
  modelname?: string;
  carbrand?: string;
  prodyear: number;
  engvol: number;
  price: number;
  milage: number;
  active: boolean;
  new: boolean;
  enginetype?: string;
  bodytype?: string;
  gb?: string;
  drivetype?: string;
  color?: string;
  date_added?: string;
  images?: CarImage[];
}

interface UserCarsListProps {
  cars: Car[];
}


export function UserCarsList({ cars }: UserCarsListProps) {
  const [userCars, setUserCars] = useState<Car[]>(cars);
  const [isLoading, setIsLoading] = useState<number | null>(null);

  const toggleCarStatus = async (carId: number, active: boolean) => {
    setIsLoading(carId);

    try {
      const response = await fetch(`/api/cars/${carId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
      });

      if (!response.ok) {
        throw new Error('Не удалось изменить статус объявления');
      }

      // Обновляем состояние списка объявлений
      setUserCars(prevCars =>
        prevCars.map(car =>
          car.idads === carId ? { ...car, active } : car
        )
      );

      toast.success(active ? 'Объявление активировано' : 'Объявление деактивировано');
    } catch (error) {
      console.error('Ошибка при изменении статуса объявления:', error);
      toast.error('Не удалось изменить статус объявления');
    } finally {
      setIsLoading(null);
    }
  };

  const deleteCar = async (carId: number) => {
    if (!confirm('Вы уверены, что хотите удалить это объявление?')) {
      return;
    }

    setIsLoading(carId);

    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Не удалось удалить объявление');
      }

      // Удаляем объявление из списка
      setUserCars(prevCars => prevCars.filter(car => car.idads !== carId));

      toast.success('Объявление удалено');
    } catch (error) {
      console.error('Ошибка при удалении объявления:', error);
      toast.error('Не удалось удалить объявление');
    } finally {
      setIsLoading(null);
    }
  };
  if (userCars.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">У вас пока нет объявлений</p>
        <Link href="/profile/new-listing">
          <Button className="bg-primary hover:bg-primary/90">Разместить объявление</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userCars.map(car => (
        <div key={car.idads} className={`bg-white rounded-lg border ${!car.active ? 'border-gray-200 bg-gray-50' : 'border-gray-200'} overflow-hidden`}>
          <div className="flex flex-col md:flex-row">
            {/* Изображение автомобиля */}
            <div className="w-full md:w-1/4 relative">
              <div className="aspect-[4/3] relative">
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg
                      width="120"
                      height="80"
                      viewBox="0 0 120 80"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-400"
                  >
                    <path
                        d="M105 50h10v10h-10zM5 50h10v10H5z"
                        fill="currentColor"
                    />
                    <path
                        d="M100 30H20l-15 20h110L100 30z"
                        fill="currentColor"
                    />
                    <path
                        d="M100 60H20v-10h80v10zM35 40H25l5-10h10l-5 10zM95 40H85l-5-10h10l5 10z"
                        fill="currentColor"
                    />
                    <path
                        d="M75 55H45v-5h30v5z"
                        fill="white"
                    />
                  </svg>
                </div>
              </div>

              {!car.active && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-medium px-2 py-1 rounded">Деактивировано</span>
                  </div>
              )}
            </div>

            {/* Информация об автомобиле */}
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">
                    {car.carbrand} {car.modelname}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    {car.prodyear} г., {car.engvol} л, {car.enginetype}, {car.gb}, {car.milage} км
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-medium text-lg">${car.price}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    ~{(car.price * 3.12).toFixed(2)} BYN
                  </div>
                </div>
              </div>

              {/* Дата публикации */}
              <div className="text-sm text-gray-500 mt-2">
                Опубликовано: {new Date(car.date_added || '').toLocaleDateString()}
              </div>

              {/* Кнопки действий */}
              <div className="flex justify-end mt-4 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCarStatus(car.idads, !car.active)}
                  disabled={isLoading === car.idads}
                >
                  {car.active ? (
                    <><EyeOff size={16} className="mr-1" /> Деактивировать</>
                  ) : (
                    <><Eye size={16} className="mr-1" /> Активировать</>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href={`/profile/edit-listing/${car.idads}`}>
                    <Pencil size={16} className="mr-1" /> Редактировать
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => deleteCar(car.idads)}
                  disabled={isLoading === car.idads}
                >
                  <Trash2 size={16} className="mr-1" /> Удалить
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
