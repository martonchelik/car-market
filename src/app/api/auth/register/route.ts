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
    try {
      // Создание пользователя
      const user = await createUser({
        name: body.name,
        email: body.email,
        phone: body.phone,
        password: body.password
      });

      console.log('Пользователь успешно зарегистрирован:', user.email);
      return NextResponse.json({ success: true, user }, { status: 201 });
    } catch (createError: any) {
      console.error('Ошибка при вызове createUser:', createError.message);

      // Если ошибка уже содержит конкретное сообщение, используем его
      if (createError.message && createError.message.includes('уже существует')) {
        return NextResponse.json(
          { error: createError.message },
          { status: 409 }
        );
      }

      if (createError.message && createError.message.includes('базе данных')) {
        return NextResponse.json(
          { error: createError.message },
          { status: 503 }
        );
      }

      // Детализируем ошибку регистрации для отладки
      return NextResponse.json(
        { error: `Ошибка при регистрации: ${createError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Общая ошибка при регистрации:', error);

    // Логирование деталей ошибки
    if (error.code) {
      console.error('Код ошибки:', error.code);
    }
    if (error.meta) {
      console.error('Метаданные ошибки:', error.meta);
    }

    // Возвращаем пользователю информативное сообщение
    return NextResponse.json(
      { error: `Произошла ошибка при регистрации: ${error.message}` },
      { status: 500 }
    );
  }
}
