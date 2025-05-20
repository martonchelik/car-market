'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface FavoriteCar {
  id: string;
  title: string;
  year: number;
  imageUrl: string;
  engineType: string;
  engineVolume: string;
  transmission: string;
  mileage: string;
  price: {
    byn: string;
    usd: string;
  };
  location: string;
  addedAt: string;
}

interface FavoritesListProps {
  favorites: FavoriteCar[];
}

export default function FavoritesList({ favorites }: FavoritesListProps) {
  const [favoritesCars, setFavoritesCars] = useState(favorites);

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { locale: ru, addSuffix: true });
    } catch (error) {
      return 'недавно';
    }
  };

  const removeFavorite = async (id: string) => {
    // In a real app, you would call an API to remove the favorite
    setFavoritesCars(prev => prev.filter(car => car.id !== id));
  };

  return (
    <div>
      {favoritesCars.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray mb-4">
            У вас пока нет избранных объявлений
          </div>
          <Link
            href="/cars"
            className="bg-primary text-white hover:bg-primary/90 rounded-md px-4 py-2 text-sm inline-flex items-center transition-colors"
          >
            <Heart className="h-4 w-4 mr-2" />
            Найти автомобили
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Избранные объявления</h3>
          </div>

          <div className="space-y-4">
            {favoritesCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Car Image */}
                  <Link
                    href={`/cars/${car.id}`}
                    className="relative w-full md:w-48 h-40 md:h-auto"
                  >
                    <Image
                      src={car.imageUrl}
                      alt={car.title}
                      fill
                      className="object-cover"
                    />
                  </Link>

                  {/* Car Details */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link
                          href={`/cars/${car.id}`}
                          className="card-title hover:text-primary transition-colors"
                        >
                          {car.title}
                        </Link>
                        <p className="text-sm text-gray">
                          Добавлено в избранное {formatTimeAgo(car.addedAt)}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold">{car.price.byn} р.</div>
                        <div className="text-sm text-gray">≈ {car.price.usd}$</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-sm">
                      <span>{car.year} г.</span>
                      <span>{car.engineVolume} {car.engineType}</span>
                      <span>{car.transmission}</span>
                      <span>{car.mileage} км</span>
                      <span>{car.location}</span>
                    </div>

                    <div className="mt-auto flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite(car.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Удалить из избранного
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
