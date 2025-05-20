import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { searchUsersByEmail } from '@/lib/userService';

export async function GET(req: NextRequest) {
  // Проверка авторизации
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
  }

  // Проверка прав администратора
  if (session.user.acctype !== 'admin') {
    return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
  }

  // Получение параметра email из запроса
  const searchParams = req.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Необходимо указать email' }, { status: 400 });
  }

  try {
    const users = await searchUsersByEmail(email);
    return NextResponse.json(users);
  } catch (error) {
    console.error('Ошибка при поиске пользователей:', error);
    return NextResponse.json(
      { error: 'Ошибка при поиске пользователей' },
      { status: 500 }
    );
  }
}
