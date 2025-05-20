import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Проверяем авторизацию
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const carId = parseInt(params.id);
    if (isNaN(carId)) {
      return NextResponse.json(
        { error: 'Некорректный ID объявления' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { active } = body;

    if (typeof active !== 'boolean') {
      return NextResponse.json(
        { error: 'Параметр active должен быть типа boolean' },
        { status: 400 }
      );
    }

    // Получаем данные объявления
    const car = await prisma.car.findUnique({
      where: { id: carId }
    });

    if (!car) {
      return NextResponse.json(
        { error: 'Объявление не найдено' },
        { status: 404 }
      );
    }

    // Проверяем, является ли пользователь владельцем объявления или администратором
    const userId = parseInt(session.user.id);
    const isAdmin = session.user.acctype === 'admin';

    if (car.owner !== userId && !isAdmin) {
      return NextResponse.json(
        { error: 'Недостаточно прав для изменения этого объявления' },
        { status: 403 }
      );
    }

    // Обновляем статус объявления
    const updatedCar = await prisma.car.update({
      where: { id: carId },
      data: { active }
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error('Ошибка при изменении статуса объявления:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
