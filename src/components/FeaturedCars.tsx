import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { PlusCircle } from 'lucide-react';

// Sample featured car data
const featuredCars = [
  {
    id: '1',
    title: 'BYD e2',
    imageUrl: 'https://ext.same-assets.com/1085385641/1908987966.jpeg',
    priceByn: '46571p.',
    priceUsd: '14900$',
    rating: '5',
    count: 3,
  },
  {
    id: '2',
    title: 'Geely GalaxyE5',
    imageUrl: 'https://ext.same-assets.com/1085385641/726326587.jpeg',
    priceByn: '55792p.',
    priceUsd: '17850$',
    rating: '5',
    count: 7,
  },
  {
    id: '3',
    title: 'Shenlan S7',
    imageUrl: 'https://ext.same-assets.com/1085385641/2840276738.jpeg',
    priceByn: '66263p.',
    priceUsd: '21200$',
    rating: '5',
    count: 9,
  },
];

export function FeaturedCars() {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium font-heading">Новинки</h2>
        <Link
          href="/salon"
          className="text-primary text-sm hover:underline"
        >
          Все новинки
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featuredCars.map((car) => (
          <Card key={car.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <Link href={`/salon/${car.title.toLowerCase().replace(' ', '_')}`}>
              <div className="relative h-40">
                <Image
                  src={car.imageUrl}
                  alt={car.title}
                  fill
                  className="object-cover"
                />
              </div>

              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-2">{car.title}</h3>

                <div className="flex justify-between mb-3">
                  <div>
                    <div className="font-bold">{car.priceByn}</div>
                    <div className="text-sm text-gray">{car.priceUsd}</div>
                  </div>

                  <div className="text-sm text-gray flex items-center">
                    <span className="mr-1">{car.rating}</span>
                    <span className="text-yellow-400">★</span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-primary">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  <span>{car.count}</span>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
