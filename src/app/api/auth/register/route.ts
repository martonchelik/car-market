import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/userService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Валидация данных
    if (!body.name || !body.email || !body.phone || !body.password) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Некорректный формат email' },
        { status: 400 }
      );
    }

    // Проверка сложности пароля
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен содержать не менее 6 символов' },
        { status: 400 }
      );
    }

    // Создание пользователя
    const user = await createUser({
      name: body.name,
      email: body.email,
      phone: body.phone,
      password: body.password
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);

    if (error.message === 'Пользователь с таким email уже существует') {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Ошибка при регистрации пользователя' },
      { status: 500 }
    );
  }
}
