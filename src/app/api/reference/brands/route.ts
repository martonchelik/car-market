import { NextResponse } from 'next/server';
import { getAllCarBrands } from '@/lib/carService';

export async function GET() {
  try {
    const brands = await getAllCarBrands();
    return NextResponse.json(brands);
  } catch (error: any) {
    console.error('Error fetching car brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car brands', details: error.message },
      { status: 500 }
    );
  }
}
