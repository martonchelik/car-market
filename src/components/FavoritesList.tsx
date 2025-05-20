'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FavoriteCar {
  id: string | number;
  car: {
    id: number;
    price: number;
    prodyear: number;
    milage: number;
    engvol: number;
    enginetype?: any;
    bodytype?: any;
    gb?: any;
    drivetype?: any;
    color?: any;
    images: Array<{ url: string }>;
    made?: any;
    model?: any;
  };
}

interface FavoritesListProps {
  initialFavorites?: FavoriteCar[];
}

export default function FavoritesList({ initialFavorites = [] }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<FavoriteCar[]>(initialFavorites);
  const [isLoading, setIsLoading] = useState(initialFavorites.length === 0);
  const [removingId, setRemovingId] = useState<string | number | null>(null);

  useEffect(() => {
    if (initialFavorites.length === 0) {
      fetchFavorites();
    }
  }, [initialFavorites]);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/favorites');
      if (!response.ok) {
        throw new Error('Не удалось загрузить избранные объявления');
      }
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Ошибка при загрузке избранных:', error);
      toast.error('Не удалось загрузить избранные объявления');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromFavorites = async (favoriteId: string | number, carId: number) => {
    setRemovingId(favoriteId);
    try {
      const response = await fetch(`/api/user/favorites?carId=${carId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Не удалось удалить из избранного');
      }

      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== favoriteId));
      toast.success('Объявление удалено из избранного');
    } catch (error) {
      console.error('Ошибка при удалении из избранного:', error);
      toast.error('Не удалось удалить объявление из избранного');
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500">Загрузка избранных объявлений...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="py-10 text-center">
        <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium mb-2">У вас пока нет избранных объявлений</h3>
        <p className="text-gray-500 mb-6">Добавляйте понравившиеся объявления в избранное, чтобы не потерять их</p>
        <Link href="/cars">
          <Button className="bg-primary hover:bg-primary/90">Перейти к объявлениям</Button>
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className="space-y-4">
      {favorites.map(favorite => (
        <div key={favorite.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Изображение автомобиля */}
            <div className="w-full md:w-1/4 relative">
              <div className="aspect-[4/3] relative">
                <Image
                  src={favorite.car.images?.[0]?.url || '/images/car-placeholder.svg'}
                  alt={`Автомобиль ${favorite.car.id}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Информация об автомобиле */}
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/cars/${favorite.car.id}`} className="font-medium text-lg hover:text-primary">
                    {favorite.car.made && favorite.car.model ?
                      `${favorite.car.made} ${favorite.car.model}` :
                      `Автомобиль ID: ${favorite.car.id}`}
                  </Link>
                  <div className="text-sm text-gray-600 mt-1">
                    {favorite.car.prodyear} г., {favorite.car.engvol} л, {favorite.car.enginetype},
                    {favorite.car.gb}, {favorite.car.milage} км
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-medium text-lg">${formatPrice(favorite.car.price)}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    ~{formatPrice(favorite.car.price * 3.12)} BYN
                  </div>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeFromFavorites(favorite.id, favorite.car.id)}
                  disabled={removingId === favorite.id}
                >
                  <Trash2 size={16} className="mr-1" />
                  {removingId === favorite.id ? 'Удаление...' : 'Удалить из избранного'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
