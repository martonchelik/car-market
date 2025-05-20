import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { PlusCircle } from 'lucide-react';
import { getAllCars } from '@/lib/carService';
import { CarListingView } from '@/types';

// Placeholder image path
const CAR_PLACEHOLDER_IMAGE = 'public/images/car-placeholder.svg';

// Car placeholder component as a simple SVG
const CarPlaceholder = () => (
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
);

// Fallback data for featured cars
const fallbackFeaturedCars = [
  {
    id: '1',
    title: 'BYD e2',
    imageUrl: CAR_PLACEHOLDER_IMAGE,
    priceByn: '46571p.',
    priceUsd: '14900$',
    rating: '5',
    count: 3,
  },
  {
    id: '2',
    title: 'Geely GalaxyE5',
    imageUrl: CAR_PLACEHOLDER_IMAGE,
    priceByn: '55792p.',
    priceUsd: '17850$',
    rating: '5',
    count: 7,
  },
  {
    id: '3',
    title: 'Shenlan S7',
    imageUrl: CAR_PLACEHOLDER_IMAGE,
    priceByn: '66263p.',
    priceUsd: '21200$',
    rating: '5',
    count: 9,
  },
];

interface FeaturedCarData {
  id: string;
  title: string;
  imageUrl: string;
  priceByn: string;
  priceUsd: string;
  rating: string;
  count: number;
}

// Helper function to format car data for featured display
function formatCarForFeatured(car: CarListingView): FeaturedCarData {
  return {
    id: car.idads?.toString() || '0',
    title: car.carbrand && car.modelname ? `${car.carbrand} ${car.modelname}` : 'Unknown Car',
    imageUrl: car.imageUrl || CAR_PLACEHOLDER_IMAGE,
    priceByn: `${car.price || 0}p.`,
    priceUsd: `${Math.round((car.price || 0) / 3.1254)}$`,
    rating: '5',
    count: Math.floor(Math.random() * 10) + 1 // Random count for demo
  };
}

export async function FeaturedCars() {
  let featuredCars = fallbackFeaturedCars;

  try {
    // Try to fetch latest cars from the database
    const allCars = await getAllCars();

    if (allCars && Array.isArray(allCars) && allCars.length > 0) {
      // Select newest cars (based on ID or other criteria)
      // For demo purposes, we'll take the first 3 cars
      const featuredCarsData = allCars
        .filter(car => car && typeof car === 'object' && car.new) // Filter for new cars if available
        .slice(0, 3);

      // If there are not enough new cars, add some from the regular listings
      if (featuredCarsData.length < 3) {
        const additionalCars = allCars
          .filter(car => car && typeof car === 'object' && !featuredCarsData.some(fc => fc.idads === car.idads))
          .slice(0, 3 - featuredCarsData.length);

        featuredCarsData.push(...additionalCars);
      }

      // Format cars for display
      if (featuredCarsData.length > 0) {
        featuredCars = featuredCarsData.map(formatCarForFeatured);
      }
    } else {
      console.log("No car data received from database, using fallback data");
    }
  } catch (error) {
    // If database connection fails, use fallback data
    console.error("Error fetching featured cars from database:", error);
  }

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
            <Link href={`/cars/${car.id}`}>
              <div className="relative h-40">
                {(!car.imageUrl || car.imageUrl === CAR_PLACEHOLDER_IMAGE) ? (
                  <CarPlaceholder />
                ) : (
                  <Image
                    src={car.imageUrl}
                    alt={car.title}
                    fill
                    className="object-cover"
                  />
                )}
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
