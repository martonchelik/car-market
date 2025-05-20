import { NextResponse } from 'next/server';
import {
  getAllCars,
  getFilteredCars,
  createCar
} from '@/lib/carService';
import { SearchFilters, CarListing } from '@/types';

// Получить список всех автомобилей или отфильтрованных
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Проверяем, есть ли параметры фильтрации
    if (searchParams.size > 0) {
      // Извлекаем параметры фильтрации из URL
      const filters: SearchFilters = {
        brand: searchParams.get('brand') ? Number(searchParams.get('brand')) : undefined,
        model: searchParams.get('model') ? Number(searchParams.get('model')) : undefined,
        priceFrom: searchParams.get('priceFrom') ? Number(searchParams.get('priceFrom')) : undefined,
        priceTo: searchParams.get('priceTo') ? Number(searchParams.get('priceTo')) : undefined,
        yearFrom: searchParams.get('yearFrom') ? Number(searchParams.get('yearFrom')) : undefined,
        yearTo: searchParams.get('yearTo') ? Number(searchParams.get('yearTo')) : undefined,
        engineType: searchParams.get('engineType') ? Number(searchParams.get('engineType')) : undefined,
        bodyType: searchParams.get('bodyType') ? Number(searchParams.get('bodyType')) : undefined,
        transmission: searchParams.get('transmission') ? Number(searchParams.get('transmission')) : undefined,
        driveType: searchParams.get('driveType') ? Number(searchParams.get('driveType')) : undefined,
      };

      const cars = await getFilteredCars(filters);
      return NextResponse.json(cars);
    }

    // Если нет параметров фильтрации, возвращаем все автомобили
    const cars = await getAllCars();
    return NextResponse.json(cars);
  } catch (error: any) {
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cars', details: error.message },
      { status: 500 }
    );
  }
}

// Создать новое объявление
export async function POST(request: Request) {
  try {
    // Пример простой авторизации (в реальности должна быть проверка сессии)
    // Используйте NextAuth или другой метод аутентификации для продакшена

    const carData: CarListing = await request.json();

    // Проверка обязательных полей
    const requiredFields = [
      'model', 'prodyear', 'engvol', 'price', 'milage',
      'owner', 'engtype', 'body', 'gearbox', 'transmission', 'color', 'made'
    ];

    for (const field of requiredFields) {
      if (!(field in carData)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Устанавливаем значения по умолчанию
    if (carData.active === undefined) carData.active = true;
    if (carData.new === undefined) carData.new = false;

    // Создаем объявление
    const insertId = await createCar(carData);

    return NextResponse.json({
      success: true,
      message: 'Car listing created successfully',
      id: insertId
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating car listing:', error);
    return NextResponse.json(
      { error: 'Failed to create car listing', details: error.message },
      { status: 500 }
    );
  }
}
