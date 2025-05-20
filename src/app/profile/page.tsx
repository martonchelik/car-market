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

// Add custom session type that includes id
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Cast user to SessionUser type with ID
  const user = session.user as SessionUser;

  const savedSearches = getSavedSearchesByUserId(user.id);
  const favorites = getFavoritesByUserId(user.id);

  // Get full car listings for favorites
  const favoriteCars = favorites.map(favorite => {
    const car = carListings.find(car => car.id === favorite.carId);
    if (!car) return null;
    return {
      ...car,
      addedAt: favorite.addedAt,
    };
  }).filter(Boolean);

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
                  <h1 className="text-2xl font-medium font-heading">{user.name}</h1>
                  <p className="text-gray text-sm">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Profile tabs */}
            <ProfileTabs
              savedSearches={savedSearches}
              favorites={favoriteCars}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
