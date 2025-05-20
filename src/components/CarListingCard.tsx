import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Clock, CheckCircle, Info } from 'lucide-react';

interface CarListingCardProps {
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
  date: string;
  verified?: boolean;
  vinChecked?: boolean;
}

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

export function CarListingCard({
  id,
  title,
  year,
  imageUrl,
  engineType,
  engineVolume,
  transmission,
  mileage,
  price,
  location,
  date,
  verified = false,
  vinChecked = false,
}: CarListingCardProps) {
  // Check if the imageUrl is empty, null, or references the placeholder
  const isPlaceholder = !imageUrl || imageUrl === 'public/images/car-placeholder.svg';

  return (
    <div className="car-card mb-4">
      <div className="flex flex-col md:flex-row">
        {/* Car Image */}
        <Link href={`/cars/${id}`} className="relative w-full md:w-64 h-48 overflow-hidden block">
          {isPlaceholder ? (
            <CarPlaceholder />
          ) : (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          )}
          {verified && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              Проверено
            </div>
          )}
        </Link>

        {/* Car Details */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <Link href={`/cars/${id}`}>
              <h3 className="card-title hover:text-primary transition-colors">{title}</h3>
            </Link>
            <div className="text-right">
              <div className="text-xl font-bold">{price.byn} р.</div>
              <div className="text-sm text-gray">≈ {price.usd}$</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-sm">
            <span>{year} г.</span>
            <span>{engineVolume} {engineType}</span>
            <span>{transmission}</span>
            <span>{mileage} км</span>
          </div>

          <div className="mt-auto flex justify-between items-center text-xs text-gray">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {date}
            </div>

            <div className="flex space-x-2">
              {location}
              {vinChecked && (
                <span className="flex items-center text-primary">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  VIN
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
