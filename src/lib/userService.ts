import { hash, compare } from 'bcrypt';
import prisma from './prisma';

const SALT_ROUNDS = 10;

// Типы данных
interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  password: string;
  acctype?: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

// Создание нового пользователя
export async function createUser(userData: CreateUserData) {
  console.log('Начало создания пользователя:', userData.email);
  try {
    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      console.log('Пользователь с таким email уже существует:', userData.email);
      throw new Error('Пользователь с таким email уже существует');
    }

    // Пробуем создать пользователя с хешированным паролем
    try {
      console.log('Хеширование пароля для пользователя:', userData.email);
      // Хешируем пароль
      const hashedPassword = await hash(userData.password, SALT_ROUNDS);
      console.log('Длина хешированного пароля:', hashedPassword.length);

      console.log('Создание записи пользователя в базе данных:', userData.email);
      // Создаем пользователя с хешированным паролем
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: hashedPassword,
          acctype: userData.acctype || 'user',
          foreignkey: '1',
          regdate: new Date(),
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=2ab4ac&color=fff`,
          active: true
        }
      });

      console.log('Пользователь успешно создан с хешированным паролем:', userData.email);
      // Удаляем пароль из возвращаемых данных
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (hashError: any) {
      // Если ошибка связана с полем пароля или его длиной
      console.error('Ошибка при создании с хешированным паролем:', hashError);

      if (
        hashError.code === 'P2000' ||
        (hashError.meta && hashError.meta.field_name === 'password') ||
        (typeof hashError.message === 'string' && hashError.message.includes('password'))
      ) {
        console.log('Пробуем создать пользователя с нехешированным паролем');
        // Пробуем создать пользователя с нехешированным паролем как запасной вариант
        const user = await prisma.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            password: userData.password, // Используем пароль как есть
            acctype: userData.acctype || 'user',
            foreignkey: '1',
            regdate: new Date(),
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=2ab4ac&color=fff`,
            active: true
          }
        });

        console.warn('Пользователь создан с нехешированным паролем:', userData.email);
        // Удаляем пароль из возвращаемых данных
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      } else {
        // Если ошибка не связана с паролем, пробрасываем ее дальше
        throw hashError;
      }
    }
  } catch (error: any) {
    console.error('Полная ошибка в функции createUser:', error);

    // Детальное логирование ошибки для отладки
    if (error.code) {
      console.error('Код ошибки Prisma:', error.code);
    }
    if (error.meta) {
      console.error('Метаданные ошибки Prisma:', error.meta);
    }
    if (error.message) {
      console.error('Сообщение ошибки:', error.message);
    }

    // Проверяем ошибки уникальности Prisma
    if (error.code === 'P2002') {
      if (error.meta?.target?.includes('email')) {
        throw new Error('Пользователь с таким email уже существует');
      }
    }

    // Ошибки подключения к базе данных
    if (error.code === 'P1001' || error.code === 'P1000' || error.code === 'P1003') {
      throw new Error('Ошибка подключения к базе данных. Пожалуйста, попробуйте позже.');
    }

    // Пробрасываем исходную ошибку или общее сообщение об ошибке
    throw new Error('Ошибка при регистрации пользователя: ' + error.message);
  }
}

// Авторизация пользователя
export async function loginUser(loginData: LoginUserData) {
  try {
    // Ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: { email: loginData.email }
    });

    if (!user) {
      throw new Error('Неверный email или пароль');
    }

    // Проверяем, активен ли аккаунт
    if (!user.active) {
      throw new Error('Аккаунт заблокирован');
    }

    console.log('Проверка пароля для пользователя:', loginData.email);
    // Проверяем пароль
    const passwordValid = await compare(loginData.password, user.password);
    if (!passwordValid) {
      console.log('Неверный пароль для пользователя:', loginData.email);
      throw new Error('Неверный email или пароль');
    }

    // Удаляем пароль из возвращаемых данных
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error: any) {
    console.error('Ошибка при входе пользователя:', error);
    throw error;
  }
}

// Получение пользователя по ID
export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          cars: true,
          favorites: true,
          savedSearches: true,
        }
      }
    }
  });

  if (!user) {
    return null;
  }

  // Удаляем пароль из возвращаемых данных
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Получение автомобилей пользователя
export async function getUserCars(userId: number) {
  return prisma.car.findMany({
    where: { owner: userId },
    orderBy: { date_added: 'desc' },
    include: {
      images: {
        where: { main: true },
        take: 1
      }
    }
  });
}

// Получение избранных объявлений пользователя
export async function getUserFavorites(userId: number) {
  return prisma.favorite.findMany({
    where: { user_id: userId },
    include: {
      car: {
        include: {
          images: {
            where: { main: true },
            take: 1
          }
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });
}

// Получение сохраненных поисков пользователя
export async function getUserSavedSearches(userId: number) {
  return prisma.savedSearch.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' }
  });
}

// Добавление автомобиля в избранное
export async function addToFavorites(userId: number, carId: number) {
  try {
    const favorite = await prisma.favorite.create({
      data: {
        user_id: userId,
        car_id: carId
      }
    });
    return favorite;
  } catch (error: any) {
    // Возможно, этот автомобиль уже добавлен в избранное
    if (error.code === 'P2002') {
      throw new Error('Этот автомобиль уже в избранном');
    }
    throw error;
  }
}

// Удаление автомобиля из избранного
export async function removeFromFavorites(userId: number, carId: number) {
  return prisma.favorite.deleteMany({
    where: {
      user_id: userId,
      car_id: carId
    }
  });
}

// Сохранение поиска
export async function saveSearch(userId: number, name: string, filters: Record<string, any>, queryString: string) {
  return prisma.savedSearch.create({
    data: {
      user_id: userId,
      name,
      filters: JSON.stringify(filters),
      query_string: queryString
    }
  });
}

// Удаление сохраненного поиска
export async function deleteSavedSearch(id: number, userId: number) {
  return prisma.savedSearch.deleteMany({
    where: {
      id,
      user_id: userId
    }
  });
}

// АДМИНИСТРАТИВНЫЕ ФУНКЦИИ

// Поиск пользователей по email (для админа)
export async function searchUsersByEmail(email: string) {
  return prisma.user.findMany({
    where: {
      email: {
        contains: email
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      regdate: true,
      acctype: true,
      active: true,
      _count: {
        select: {
          cars: true,
          favorites: true
        }
      }
    }
  });
}

// Деактивация аккаунта пользователя (для админа)
export async function deactivateUser(userId: number) {
  return prisma.user.update({
    where: { id: userId },
    data: { active: false }
  });
}

// Активация аккаунта пользователя (для админа)
export async function activateUser(userId: number) {
  return prisma.user.update({
    where: { id: userId },
    data: { active: true }
  });
}

// Деактивация всех объявлений пользователя (для админа)
export async function deactivateUserCars(userId: number) {
  return prisma.car.updateMany({
    where: { owner: userId },
    data: { active: false }
  });
}

// Активация всех объявлений пользователя (для админа)
export async function activateUserCars(userId: number) {
  return prisma.car.updateMany({
    where: { owner: userId },
    data: { active: true }
  });
}

// Деактивация конкретного объявления (для админа)
export async function deactivateCar(carId: number) {
  return prisma.car.update({
    where: { id: carId },
    data: { active: false }
  });
}

// Активация конкретного объявления (для админа)
export async function activateCar(carId: number) {
  return prisma.car.update({
    where: { id: carId },
    data: { active: true }
  });
}
