import { NextResponse } from 'next/server';
import { getCarById, deleteCar } from '@/lib/carService';

interface Params {
  params: {
    id: string;
  };
}

// Получить автомобиль по ID
export async function GET(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const car = await getCarById(id);

    if (!car) {
      return NextResponse.json(
        { error: 'Car listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(car);
  } catch (error: any) {
    console.error(`Error fetching car with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch car listing', details: error.message },
      { status: 500 }
    );
  }
}

// Удалить автомобиль (soft delete - меняем active на 0)
export async function DELETE(request: Request, { params }: Params) {
  try {
    // В реальном приложении здесь должна быть проверка авторизации
    // например, через NextAuth.js или другой метод аутентификации
    const id = parseInt(params.id);
    console.log(id)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const success = await deleteCar(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Car listing not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Car listing deleted successfully'
    });
  } catch (error: any) {
    console.error(`Error deleting car with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete car listing', details: error.message },
      { status: 500 }
    );
  }
}
