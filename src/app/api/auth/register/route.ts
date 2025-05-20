import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/userService';

export async function POST(req: NextRequest) {
  try {
    console.log('Получен запрос на регистрацию');
    const body = await req.json();
    console.log('Данные регистрации:', { ...body, password: '***' });

    // Валидация данных
    if (!body.name || !body.email || !body.phone || !body.password) {
      console.log('Не все обязательные поля заполнены');
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      console.log('Некорректный формат email:', body.email);
      return NextResponse.json(
        { error: 'Некорректный формат email' },
        { status: 400 }
      );
    }

    // Проверка сложности пароля
    if (body.password.length < 6) {
      console.log('Пароль слишком короткий');
      return NextResponse.json(
        { error: 'Пароль должен содержать не менее 6 символов' },
        { status: 400 }
      );
    }

    console.log('Начинаем создание пользователя');
    // Создание пользователя
    const user = await createUser({
      name: body.name,
      email: body.email,
      phone: body.phone,
      password: body.password
    });

    console.log('Пользователь успешно зарегистрирован:', user.email);
    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error: any) {
    console.error('Ошибка при регистрации:', error);

    // Логирование деталей ошибки
    if (error.code) {
      console.error('Код ошибки:', error.code);
    }
    if (error.meta) {
      console.error('Метаданные ошибки:', error.meta);
    }

    // Обработка известных ошибок
    if (error.message === 'Пользователь с таким email уже существует') {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    // Ошибки подключения к базе данных
    if (error.code === 'P1001' || error.code === 'P1000') {
      console.error('Проблема с подключением к базе данных');
      return NextResponse.json(
        { error: 'Сервис временно недоступен. Пожалуйста, попробуйте позже.' },
        { status: 503 }
      );
    }

    // Ошибки валидации данных Prisma
    if (error.code === 'P2000' || error.code === 'P2001' || error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Некорректные данные для регистрации' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Ошибка при регистрации пользователя' },
      { status: 500 }
    );
  }
}
