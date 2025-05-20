import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUserSavedSearches, saveSearch, deleteSavedSearch } from '@/lib/userService';

// Получение сохраненных поисков пользователя
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
  }

  try {
    const userId = parseInt(session.user.id);
    const savedSearches = await getUserSavedSearches(userId);

    return NextResponse.json(savedSearches);
  } catch (error) {
    console.error('Ошибка при получении сохраненных поисков:', error);
    return NextResponse.json(
      { error: 'Не удалось получить сохраненные поиски' },
      { status: 500 }
    );
  }
}

// Сохранение нового поиска
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
  }

  try {
    const { name, filters, queryString } = await req.json();

    if (!name || !queryString) {
      return NextResponse.json({ error: 'Не указаны необходимые параметры' }, { status: 400 });
    }

    const userId = parseInt(session.user.id);
    const savedSearch = await saveSearch(userId, name, filters || {}, queryString);

    return NextResponse.json({ success: true, savedSearch }, { status: 201 });
  } catch (error) {
    console.error('Ошибка при сохранении поиска:', error);
    return NextResponse.json(
      { error: 'Не удалось сохранить поиск' },
      { status: 500 }
    );
  }
}

// Удаление сохраненного поиска
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const searchId = url.searchParams.get('id');

    if (!searchId) {
      return NextResponse.json({ error: 'Не указан ID сохраненного поиска' }, { status: 400 });
    }

    const userId = parseInt(session.user.id);
    await deleteSavedSearch(parseInt(searchId), userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при удалении сохраненного поиска:', error);
    return NextResponse.json(
      { error: 'Не удалось удалить сохраненный поиск' },
      { status: 500 }
    );
  }
}
