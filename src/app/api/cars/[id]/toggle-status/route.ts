import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { activateCar, deactivateCar } from '@/lib/userService';

interface Params {
  id: string;
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  // Проверка авторизации
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
  }

  const userId = parseInt(session.user.id);
  const carId = parseInt(params.id);

  if (isNaN(carId)) {
    return NextResponse.json({ error: 'Некорректный ID объявления' }, { status: 400 });
  }

  try {
    // Получаем желаемый статус из тела запроса
    const body = await req.json();
    const { active } = body;

    // Проверяем, что active является булевым значением
    if (typeof active !== 'boolean') {
      return NextResponse.json({ error: 'Параметр active должен быть булевым значением' }, { status: 400 });
    }

    // Сначала проверяем принадлежность объявления пользователю (или является ли пользователь администратором)
    const car = await prisma.car.findUnique({
      where: { id: carId },
      select: { owner: true }
    });

    if (!car) {
      return NextResponse.json({ error: 'Объявление не найдено' }, { status: 404 });
    }

    // Проверяем, имеет ли пользователь право изменять это объявление
    const isAdmin = session.user.acctype === 'admin';
    if (car.owner !== userId && !isAdmin) {
      return NextResponse.json({ error: 'Недостаточно прав для изменения этого объявления' }, { status: 403 });
    }

    // Активируем или деактивируем объявление
    const updatedCar = active ? await activateCar(carId) : await deactivateCar(carId);

    return NextResponse.json({
      success: true,
      car: {
        id: updatedCar.id,
        active: updatedCar.active
      }
    });
  } catch (error) {
    console.error('Ошибка при изменении статуса объявления:', error);
    return NextResponse.json(
      { error: 'Ошибка при изменении статуса объявления' },
      { status: 500 }
    );
  }
}
