'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Очищаем ошибку при редактировании поля
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Проверяем заполнение полей
    if (!formData.name.trim()) newErrors.name = 'Введите имя';
    if (!formData.email.trim()) newErrors.email = 'Введите email';
    if (!formData.phone.trim()) newErrors.phone = 'Введите телефон';
    if (!formData.password) newErrors.password = 'Введите пароль';

    // Проверяем email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    // Проверяем сложность пароля
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать не менее 6 символов';
    }

    // Проверяем совпадение паролей
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log('Отправка данных для регистрации:', {
        ...formData,
        password: '***',
        confirmPassword: '***'
      });

      // Отправляем запрос на регистрацию
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });

      const data = await response.json();
      console.log('Ответ от сервера:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        console.error('Ошибка ответа сервера:', data);

        // Обрабатываем конкретные ошибки
        if (response.status === 409) {
          throw new Error('Пользователь с таким email уже существует');
        } else if (response.status === 400) {
          throw new Error(data.error || 'Некорректные данные для регистрации');
        } else if (response.status === 503) {
          throw new Error('Сервис временно недоступен. Пожалуйста, попробуйте позже');
        } else {
          throw new Error(data.error || 'Ошибка при регистрации');
        }
      }

      // Успешная регистрация
      toast.success('Регистрация успешна! Выполняется вход...');
      console.log('Регистрация успешна, выполняем автоматический вход');

      // Автоматический вход после регистрации
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      console.log('Результат входа:', { error: signInResult?.error });

      if (signInResult?.error) {
        console.error('Ошибка при автоматическом входе:', signInResult.error);
        toast.error('Не удалось выполнить вход. Пожалуйста, войдите вручную.');
        router.push('/auth/signin');
      } else {
        // Перенаправление на главную страницу
        console.log('Автоматический вход успешен, перенаправление на главную страницу');
        router.push('/');
      }
    } catch (error: any) {
      console.error('Ошибка при регистрации:', error);
      toast.error(error.message || 'Ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Регистрация</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Имя
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите ваше имя"
            className={errors.name ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@mail.com"
            className={errors.email ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Телефон
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+7 (XXX) XXX-XX-XX"
            className={errors.phone ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Пароль
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Минимум 6 символов"
            className={errors.password ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Подтверждение пароля
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Повторите пароль"
            className={errors.confirmPassword ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm">
        Уже есть аккаунт?{' '}
        <Link href="/auth/signin" className="text-primary hover:underline">
          Войти
        </Link>
      </p>
    </div>
  );
}
