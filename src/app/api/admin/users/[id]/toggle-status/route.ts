import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { activateUser, deactivateUser } from '@/lib/userService';

interface Params {
  id: string;
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  // Проверка авторизации
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
  }

  // Проверка прав администратора
  if (session.user.acctype !== 'admin') {
    return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
  }

  // Получение ID пользователя из параметров маршрута
  const userId = parseInt(params.id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Некорректный ID пользователя' }, { status: 400 });
  }

  try {
    // Получаем желаемый статус из тела запроса
    const body = await req.json();
    const { active } = body;

    // Проверяем, что active является булевым значением
    if (typeof active !== 'boolean') {
      return NextResponse.json({ error: 'Параметр active должен быть булевым значением' }, { status: 400 });
    }

    // Активируем или деактивируем пользователя
    const user = active ? await activateUser(userId) : await deactivateUser(userId);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        active: user.active
      }
    });
  } catch (error) {
    console.error('Ошибка при изменении статуса пользователя:', error);
    return NextResponse.json(
      { error: 'Ошибка при изменении статуса пользователя' },
      { status: 500 }
    );
  }
}
