import { CarListingView } from "@/types";

// Placeholder image path
const CAR_PLACEHOLDER_IMAGE = 'public/images/car-placeholder.svg';

// Sample car listings in a format similar to what would come from the database
const mockCarListings: CarListingView[] = [
  {
    idads: 1,
    modelname: 'A8',
    carbrand: 'Audi',
    prodyear: 2019,
    engvol: 2.0,
    price: 75014,
    milage: 44000,
    active: true,
    new: true,
    owner: 1,
    enginetype: 'Gasoline',
    bodytype: 'Sedan',
    gb: 'Auto',
    drivetype: 'AWD',
    color: 'black',
    imageUrl: null, // Will use placeholder
  },
  {
    idads: 2,
    modelname: 'S-класс W222, C217, A217',
    carbrand: 'Mercedes',
    prodyear: 2015,
    engvol: 3.0,
    price: 104708,
    milage: 217703,
    active: true,
    new: false,
    owner: 1,
    enginetype: 'Diesel',
    bodytype: 'Sedan',
    gb: 'Auto',
    drivetype: 'AWD',
    color: 'black',
    imageUrl: null, // Will use placeholder
  },
  {
    idads: 3,
    modelname: 'Multivan T7, 7',
    carbrand: 'Volkswagen',
    prodyear: 2021,
    engvol: 1.5,
    price: 150029,
    milage: 17200,
    active: true,
    new: true,
    owner: 1,
    enginetype: 'Hybrid',
    bodytype: 'Van',
    gb: 'Auto',
    drivetype: 'FWD',
    color: 'black',
    imageUrl: null, // Will use placeholder
  },
  {
    idads: 4,
    modelname: 'Q5 II (FY)',
    carbrand: 'Audi',
    prodyear: 2018,
    engvol: 2.0,
    price: 93762,
    milage: 110000,
    active: true,
    new: true,
    owner: 1,
    enginetype: 'Diesel',
    bodytype: 'SUV',
    gb: 'Auto',
    drivetype: 'AWD',
    color: 'black',
    imageUrl: null, // Will use placeholder
  },
  {
    idads: 5,
    modelname: '3 серия VI (F30/F31/F34)',
    carbrand: 'BMW',
    prodyear: 2016,
    engvol: 2.0,
    price: 78135,
    milage: 93000,
    active: true,
    new: false,
    owner: 1,
    enginetype: 'Gasoline',
    bodytype: 'Sedan',
    gb: 'Mechanic',
    drivetype: 'RWD',
    color: 'black',
    imageUrl: null, // Will use placeholder
  },
  {
    idads: 6,
    modelname: 'Golf VII',
    carbrand: 'Volkswagen',
    prodyear: 2019,
    engvol: 1.6,
    price: 59489,
    milage: 65000,
    active: true,
    new: false,
    owner: 1,
    enginetype: 'Gasoline',
    bodytype: 'Hatchback',
    gb: 'Mechanic',
    drivetype: 'FWD',
    color: 'black',
    imageUrl: null, // Will use placeholder
  },
  {
    idads: 7,
    modelname: 'A4 B9',
    carbrand: 'Audi',
    prodyear: 2020,
    engvol: 2.0,
    price: 87575,
    milage: 48000,
    active: true,
    new: true,
    owner: 1,
    enginetype: 'Diesel',
    bodytype: 'Sedan',
    gb: 'Auto',
    drivetype: 'FWD',
    color: 'black',
    imageUrl: null, // Will use placeholder
  },
];

// Mock functions to mirror the real service
export async function getAllCars(): Promise<CarListingView[]> {
  return mockCarListings;
}

export async function getCarById(id: number): Promise<CarListingView | null> {
  const car = mockCarListings.find(c => c.idads === id);
  return car || null;
}

export async function getFilteredCars(filters: any): Promise<CarListingView[]> {
  // Simple filtering based on available filters
  return mockCarListings.filter(car => {
    let match = true;

    if (filters.brand && car.carbrand !== filters.brand) match = false;
    if (filters.priceFrom && car.price < filters.priceFrom) match = false;
    if (filters.priceTo && car.price > filters.priceTo) match = false;
    if (filters.yearFrom && car.prodyear < filters.yearFrom) match = false;
    if (filters.yearTo && car.prodyear > filters.yearTo) match = false;

    return match;
  });
}
