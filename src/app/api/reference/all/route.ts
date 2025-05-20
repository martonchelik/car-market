import { NextResponse } from 'next/server';
import {
  getAllCarBrands,
  getAllEngineTypes,
  getAllBodyTypes,
  getAllGearBoxes,
  getAllDriveTypes,
  getAllColors
} from '@/lib/carService';

export async function GET() {
  try {
    // Получаем все справочные данные параллельно
    const [brands, engineTypes, bodyTypes, gearBoxes, driveTypes, colors] = await Promise.all([
      getAllCarBrands(),
      getAllEngineTypes(),
      getAllBodyTypes(),
      getAllGearBoxes(),
      getAllDriveTypes(),
      getAllColors()
    ]);

    // Возвращаем все справочники одним объектом
    return NextResponse.json({
      brands,
      engineTypes,
      bodyTypes,
      gearBoxes,
      driveTypes,
      colors
    });
  } catch (error: any) {
    console.error('Error fetching reference data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reference data', details: error.message },
      { status: 500 }
    );
  }
}
