import React from 'react';
import Link from 'next/link';

// Sample car makes data
const carMakes = [
  { name: 'Alfa Romeo', count: 236, slug: 'alfa-romeo' },
  { name: 'Audi', count: 4288, slug: 'audi' },
  { name: 'BMW', count: 6226, slug: 'bmw' },
  { name: 'BYD', count: 142, slug: 'byd' },
  { name: 'Chevrolet', count: 2122, slug: 'chevrolet' },
  { name: 'Chrysler', count: 446, slug: 'chrysler' },
  { name: 'Citroen', count: 3673, slug: 'citroen' },
  { name: 'Dodge', count: 391, slug: 'dodge' },
  { name: 'Fiat', count: 838, slug: 'fiat' },
  { name: 'Ford', count: 5031, slug: 'ford' },
  { name: 'Geely', count: 1142, slug: 'geely' },
  { name: 'Honda', count: 1368, slug: 'honda' },
  { name: 'Hyundai', count: 2389, slug: 'hyundai' },
  { name: 'Kia', count: 2225, slug: 'kia' },
  { name: 'Lada (ВАЗ)', count: 1426, slug: 'lada-vaz' },
  { name: 'Land Rover', count: 606, slug: 'land-rover' },
  { name: 'Lexus', count: 533, slug: 'lexus' },
  { name: 'Mazda', count: 1869, slug: 'mazda' },
  { name: 'Mercedes-Benz', count: 3991, slug: 'mercedes-benz' },
  { name: 'Mitsubishi', count: 1260, slug: 'mitsubishi' },
  { name: 'Nissan', count: 2929, slug: 'nissan' },
  { name: 'Opel', count: 5641, slug: 'opel' },
  { name: 'Peugeot', count: 6390, slug: 'peugeot' },
  { name: 'Renault', count: 5883, slug: 'renault' },
  { name: 'Skoda', count: 1591, slug: 'skoda' },
  { name: 'Subaru', count: 388, slug: 'subaru' },
  { name: 'Tesla', count: 584, slug: 'tesla' },
  { name: 'Toyota', count: 2643, slug: 'toyota' },
  { name: 'Volkswagen', count: 8683, slug: 'volkswagen' },
  { name: 'Volvo', count: 2077, slug: 'volvo' },
];

export function CarMakesList() {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
      <h2 className="sr-only">Поиск по производителям</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-2">
        {carMakes.map((make) => (
          <Link
            key={make.slug}
            href={`/cars/${make.slug}`}
            className="flex justify-between items-center py-1 hover:text-primary transition-colors"
          >
            <span className="text-sm">{make.name}</span>
            <span className="text-xs text-gray">{make.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
