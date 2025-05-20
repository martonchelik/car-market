import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { getUserById, getUserCars, getUserFavorites, getUserSavedSearches } from '@/lib/userService';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import ProfileTabs from '@/components/profile/ProfileTabs';

export const metadata: Metadata = {
  title: 'Мой профиль | car-market',
  description: 'Управление личным кабинетом, сохраненными поисками и избранными объявлениями',
};

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  acctype?: string;
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const user = session.user as SessionUser;
  const userId = parseInt(user.id);

  // Получаем данные из базы данных
  const userData = await getUserById(userId);
  const userCars = await getUserCars(userId);
  const favorites = await getUserFavorites(userId);
  const savedSearches = await getUserSavedSearches(userId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-[#f1f4f7] py-8">
        <div className="container-av">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=2ab4ac&color=fff`}
                    alt={user.name || 'User'}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-medium font-heading">{user.name}</h1>
                    {user.acctype === 'admin' && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Администратор
                      </span>
                    )}
                  </div>
                  <p className="text-gray text-sm">{user.email}</p>
                </div>
              </div>
            </div>

            <ProfileTabs
              savedSearches={savedSearches}
              favorites={favorites}
              userCars={userCars}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
