import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { getSavedSearchesByUserId, getFavoritesByUserId } from '@/lib/mockDb';
import { carListings } from '@/data/carListings';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import ProfileTabs from '@/components/profile/ProfileTabs';

export const metadata: Metadata = {
  title: 'Мой профиль | av.by',
  description: 'Управление личным кабинетом, сохраненными поисками и избранными объявлениями на av.by',
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

  const savedSearches = getSavedSearchesByUserId(user.id);
  const favorites = getFavoritesByUserId(user.id);

  // Get full car listings for favorites
  const favoriteCars = favorites
    .map(favorite => {
      const car = carListings.find(car => car.id === favorite.carId);
      if (!car) return null;
      return {
        ...car,
        addedAt: favorite.addedAt,
      };
    })
    .filter(Boolean as any);

  // Для демонстрации добавляем моковые объявления пользователя
  const userCars = [
    {
      id: 1,
      carbrand: "Audi",
      modelname: "A8",
      prodyear: 2019,
      engvol: 2.0,
      price: 24000,
      milage: 44000,
      active: true,
      new: false,
      enginetype: "Бензин",
      bodytype: "Седан",
      gb: "Автомат",
      drivetype: "Полный",
      color: "Черный",
      date_added: new Date("2023-01-15").toISOString(),
      images: [{ url: "/images/car-placeholder.svg", main: true }]
    },
    {
      id: 2,
      carbrand: "BMW",
      modelname: "X5",
      prodyear: 2020,
      engvol: 3.0,
      price: 45000,
      milage: 35000,
      active: true,
      new: false,
      enginetype: "Дизель",
      bodytype: "Внедорожник",
      gb: "Автомат",
      drivetype: "Полный",
      color: "Белый",
      date_added: new Date("2023-03-10").toISOString(),
      images: [{ url: "/images/car-placeholder.svg", main: true }]
    }
  ];

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
              favorites={favoriteCars}
              userCars={userCars}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
