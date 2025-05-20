import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CarListingView } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Placeholder image path
const CAR_PLACEHOLDER_IMAGE = 'public/images/car-placeholder.svg';

// Format car listing from database to display format
export function formatCarListingForDisplay(car: CarListingView) {
  if (!car || typeof car !== 'object') {
    console.error("Invalid car data provided to formatCarListingForDisplay:", car);
    return null;
  }

  // Use the car placeholder image if none is provided
  const imageUrl = car.imageUrl || CAR_PLACEHOLDER_IMAGE;

  // Format current date for display (e.g., "2 дн. назад")
  const currentDate = new Date();
  const addedDate = car.date_added ? new Date(car.date_added) : new Date();
  const diffTime = Math.abs(currentDate.getTime() - addedDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let dateText = '';
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    dateText = `${diffHours > 0 ? diffHours : 1} ч. назад`;
  } else {
    dateText = `${diffDays} дн. назад`;
  }

  // Format engine volume to string with decimal point
  const engineVolume = car.engvol ? car.engvol.toString().replace('.', ',') : '0';

  return {
    id: car.idads ? car.idads.toString() : '0',
    title: car.carbrand && car.modelname ? `${car.carbrand} ${car.modelname}` : 'Unknown Car',
    year: car.prodyear || 2023,
    imageUrl,
    engineType: car.enginetype ? car.enginetype.toLowerCase() : 'бензин',
    engineVolume,
    transmission: car.gb ? car.gb.toLowerCase() : 'автомат',
    mileage: car.milage ? car.milage.toString() : '0',
    price: {
      byn: car.price ? car.price.toString() : '0',
      usd: car.price ? Math.round(car.price / 3.1254).toString() : '0' // Assuming an exchange rate, adjust as needed
    },
    location: 'Минск', // Default location if not available in data
    date: dateText,
    verified: !!car.new, // Using 'new' as a proxy for 'verified'
    vinChecked: Math.random() > 0.5, // Random for demo purposes
  };
}
