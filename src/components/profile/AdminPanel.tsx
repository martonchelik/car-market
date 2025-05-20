'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Search, User, CarFront, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UserWithCounts {
  id: number;
  name: string;
  email: string;
  phone: string;
  regdate: string;
  acctype: string;
  active: boolean;
  _count: {
    cars: number;
    favorites: number;
  };
}

export function AdminPanel() {
  const [searchEmail, setSearchEmail] = useState('');
  const [users, setUsers] = useState<UserWithCounts[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const searchUsers = async () => {
    if (!searchEmail.trim()) {
      toast.error('Введите email для поиска');
      return;
    }

    setIsLoading(true);
    setSearchPerformed(true);

    try {
      const response = await fetch(`/api/admin/users/search?email=${encodeURIComponent(searchEmail)}`);

      if (!response.ok) {
        throw new Error('Ошибка при поиске пользователей');
      }

      const data = await response.json();
      setUsers(data);

      if (data.length === 0) {
        toast.info('Пользователи не найдены');
      }
    } catch (error) {
      console.error('Ошибка при поиске пользователей:', error);
      toast.error('Не удалось выполнить поиск');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (userId: number, active: boolean) => {
    setActionLoading(userId);

    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при изменении статуса пользователя');
      }

      // Обновляем список пользователей
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, active } : user
        )
      );

      toast.success(active ? 'Пользователь активирован' : 'Пользователь деактивирован');
    } catch (error) {
      console.error('Ошибка при изменении статуса пользователя:', error);
      toast.error('Не удалось изменить статус пользователя');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleUserCarsStatus = async (userId: number, active: boolean) => {
    setActionLoading(userId);

    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-cars-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при изменении статуса объявлений пользователя');
      }

      toast.success(
        active
          ? 'Все объявления пользователя активированы'
          : 'Все объявления пользователя деактивированы'
      );
    } catch (error) {
      console.error('Ошибка при изменении статуса объявлений:', error);
      toast.error('Не удалось изменить статус объявлений');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <h3 className="text-lg font-medium mb-4">Поиск пользователей</h3>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              type="email"
              placeholder="Введите email пользователя"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <Button
            onClick={searchUsers}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? 'Поиск...' : 'Найти'}
          </Button>
        </div>
      </div>

      {searchPerformed && (
        <div>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map(user => (
                <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-500 mr-2" />
                        <h3 className="font-medium">{user.name}</h3>
                        {user.acctype === 'admin' && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Администратор
                          </span>
                        )}
                        {!user.active && (
                          <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                            Деактивирован
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Телефон: {user.phone} | Зарегистрирован: {new Date(user.regdate).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <CarFront className="h-4 w-4 text-gray-500 mr-1" />
                          Объявлений: {user._count.cars}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-2">
                      {/* Кнопка для управления аккаунтом */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id, !user.active)}
                        disabled={actionLoading === user.id || user.acctype === 'admin'}
                        className={user.active ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}
                      >
                        {user.active ? (
                          <>
                            <AlertTriangle size={16} className="mr-1" />
                            Деактивировать аккаунт
                          </>
                        ) : (
                          <>
                            <User size={16} className="mr-1" />
                            Активировать аккаунт
                          </>
                        )}
                      </Button>

                      {/* Кнопки для управления объявлениями */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserCarsStatus(user.id, false)}
                        disabled={actionLoading === user.id || user._count.cars === 0}
                      >
                        <CarFront size={16} className="mr-1" />
                        Отключить объявления
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserCarsStatus(user.id, true)}
                        disabled={actionLoading === user.id || user._count.cars === 0}
                      >
                        <CarFront size={16} className="mr-1" />
                        Включить объявления
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">Пользователи не найдены</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
