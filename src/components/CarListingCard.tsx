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
  return (
    <div className="car-card mb-4">
      <div className="flex flex-col md:flex-row">
        {/* Car Image */}
        <Link href={`/cars/${id}`} className="relative w-full md:w-64 h-48 overflow-hidden block">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
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
