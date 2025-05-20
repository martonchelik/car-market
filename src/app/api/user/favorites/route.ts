import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { addToFavorites, removeFromFavorites, getUserFavorites } from '@/lib/userService';

// Получение списка избранных
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Проверяем авторизацию
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    // В реальном приложении используем Prisma для получения избранных
    // const favorites = await getUserFavorites(userId);

    // Моковые данные для демонстрации
    const favorites = [
      {
        id: "114406262",
        title: "Audi A8",
        year: 2019,
        imageUrl: "/images/car-placeholder.svg",
        engineType: "бензин",
        engineVolume: "2,0",
        transmission: "автомат",
        mileage: "44000",
        price: {
          byn: "75014.24",
          usd: "24000",
        },
        location: "Минск",
        addedAt: new Date("2023-06-20").toISOString()
      },
      {
        id: "115220001",
        title: "Audi Q5 II (FY)",
        year: 2018,
        imageUrl: "/images/car-placeholder.svg",
        engineType: "дизель",
        engineVolume: "2,0",
        transmission: "автомат",
        mileage: "110000",
        price: {
          byn: "93762.30",
          usd: "30000",
        },
        location: "Гомель",
        addedAt: new Date("2023-06-25").toISOString()
      }
    ];

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Ошибка при получении избранных объявлений:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// Добавление в избранное
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Проверяем авторизацию
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { carId } = body;

    if (!carId) {
      return NextResponse.json(
        { error: 'Не указан ID автомобиля' },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id);

    // В реальном приложении используем Prisma для добавления в избранное
    // const favorite = await addToFavorites(userId, parseInt(carId));

    // Моковый ответ для демонстрации
    const favorite = {
      id: Math.floor(Math.random() * 1000),
      user_id: userId,
      car_id: parseInt(carId),
      created_at: new Date().toISOString()
    };

    return NextResponse.json(
      { success: true, message: 'Автомобиль добавлен в избранное', favorite },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при добавлении в избранное:', error);

    // Ошибка уникального ключа (автомобиль уже в избранном)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Этот автомобиль уже в избранном' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// Удаление из избранного
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Проверяем авторизацию
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    // Получаем ID автомобиля из строки запроса
    const url = new URL(req.url);
    const carId = url.searchParams.get('carId');

    if (!carId) {
      return NextResponse.json(
        { error: 'Не указан ID автомобиля' },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id);

    // В реальном приложении используем Prisma для удаления из избранного
    // const result = await removeFromFavorites(userId, parseInt(carId));

    return NextResponse.json(
      { success: true, message: 'Автомобиль удален из избранного' }
    );
  } catch (error) {
    console.error('Ошибка при удалении из избранного:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
