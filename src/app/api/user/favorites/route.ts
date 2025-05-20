import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { addToFavorites, removeFromFavorites, getUserFavorites } from '@/lib/userService';

// Получение избранных объявлений пользователя
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
  }

  try {
    const userId = parseInt(session.user.id);
    const favorites = await getUserFavorites(userId);

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Ошибка при получении избранных объявлений:', error);
    return NextResponse.json(
      { error: 'Не удалось получить избранные объявления' },
      { status: 500 }
    );
  }
}

// Добавление объявления в избранное
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
  }

  try {
    const { carId } = await req.json();

    if (!carId) {
      return NextResponse.json({ error: 'Не указан ID объявления' }, { status: 400 });
    }

    const userId = parseInt(session.user.id);
    const favorite = await addToFavorites(userId, parseInt(carId));

    return NextResponse.json({ success: true, favorite }, { status: 201 });
  } catch (error: any) {
    console.error('Ошибка при добавлении в избранное:', error);

    // Если объявление уже в избранном
    if (error.message === 'Этот автомобиль уже в избранном') {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: 'Не удалось добавить объявление в избранное' },
      { status: 500 }
    );
  }
}

// Удаление объявления из избранного
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const carId = url.searchParams.get('carId');

    if (!carId) {
      return NextResponse.json({ error: 'Не указан ID объявления' }, { status: 400 });
    }

    const userId = parseInt(session.user.id);
    await removeFromFavorites(userId, parseInt(carId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при удалении из избранного:', error);
    return NextResponse.json(
      { error: 'Не удалось удалить объявление из избранного' },
      { status: 500 }
    );
  }
}
