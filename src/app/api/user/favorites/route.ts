import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import {
  getFavoritesByUserId,
  addFavorite,
  removeFavorite
} from '@/lib/mockDb';
import { carListings } from '@/data/carListings';

// Add custom session type that includes id
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    );
  }

  // Cast session.user to our custom type that includes id
  const userId = (session.user as SessionUser).id;
  const userFavorites = getFavoritesByUserId(userId);

  // Get full car listings for favorites
  const favoriteCars = userFavorites.map(favorite => {
    const car = carListings.find(car => car.id === favorite.carId);
    if (!car) return null;
    return {
      ...car,
      addedAt: favorite.addedAt,
    };
  }).filter(Boolean);

  return NextResponse.json({
    favorites: favoriteCars
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    );
  }

  try {
    const { carId } = await req.json();

    if (!carId) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing car ID' }),
        { status: 400 }
      );
    }

    // Check if car exists
    const car = carListings.find(car => car.id === carId);
    if (!car) {
      return new NextResponse(
        JSON.stringify({ error: 'Car not found' }),
        { status: 404 }
      );
    }

    const userId = (session.user as SessionUser).id;
    const favorite = addFavorite(userId, carId);

    return NextResponse.json({
      success: true,
      favorite
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid request data' }),
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    );
  }

  try {
    const { carId } = await req.json();

    if (!carId) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing car ID' }),
        { status: 400 }
      );
    }

    const userId = (session.user as SessionUser).id;
    const result = removeFavorite(userId, carId);

    return NextResponse.json({
      success: result
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid request data' }),
      { status: 400 }
    );
  }
}
