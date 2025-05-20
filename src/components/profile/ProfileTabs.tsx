'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Car, Search, Heart, User } from 'lucide-react';
import SavedSearchesList from './SavedSearchesList';
import FavoritesList from './FavoritesList';
import { UserCarsList } from './UserCarsList';
import { AdminPanel } from './AdminPanel';
import { useSession } from 'next-auth/react';

// Define proper types for the saved searches and favorites
interface SavedSearch {
  id: string;
  name: string;
  filters: Record<string, unknown>;
  createdAt: string;
  notifyOnNew: boolean;
}

interface FavoriteCar {
  id: string;
  title: string;
  year: number;
  imageUrl: string;
  engineType: string;
  engineVolume: string;
  transmission: string;
  mileage: string;
  price: {
    byn: string;
    usd: string;
  };
  location: string;
  addedAt: string;
}

interface Car {
  id: number;
  modelname?: string;
  carbrand?: string;
  prodyear: number;
  engvol: number;
  price: number;
  milage: number;
  active: boolean;
  new: boolean;
  enginetype?: string;
  bodytype?: string;
  gb?: string;
  drivetype?: string;
  color?: string;
  date_added?: string;
  images?: any[];
}

interface ProfileTabsProps {
  savedSearches: SavedSearch[];
  favorites: FavoriteCar[];
  userCars?: Car[];
}

export default function ProfileTabs({ savedSearches, favorites, userCars = [] }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState('my-cars');
  const { data: session } = useSession();

  // Проверка, является ли пользователь администратором
  const isAdmin = session?.user?.acctype === 'admin';

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="border-b border-gray-100">
        <div className="flex flex-wrap">
          <button
            onClick={() => setActiveTab('my-cars')}
            className={`flex items-center px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'my-cars'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray hover:text-gray-dark'
            }`}
          >
            <Car size={16} className="mr-2" />
            Мои объявления ({userCars?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('saved-searches')}
            className={`flex items-center px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'saved-searches'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray hover:text-gray-dark'
            }`}
          >
            <Search size={16} className="mr-2" />
            Сохраненные поиски ({savedSearches.length})
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'favorites'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray hover:text-gray-dark'
            }`}
          >
            <Heart size={16} className="mr-2" />
            Избранное ({favorites.length})
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'admin'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray hover:text-gray-dark'
              }`}
            >
              <User size={16} className="mr-2" />
              Управление пользователями
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'my-cars' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Мои объявления</h2>
              <Link href="/profile/new-listing" className="flex items-center text-sm text-primary hover:underline">
                <Plus size={16} className="mr-1" />
                Разместить объявление
              </Link>
            </div>
            <UserCarsList cars={userCars || []} />
          </>
        )}

        {activeTab === 'saved-searches' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Сохраненные поиски</h2>
              <Link href="/cars" className="flex items-center text-sm text-primary hover:underline">
                <Plus size={16} className="mr-1" />
                Новый поиск
              </Link>
            </div>
            <SavedSearchesList searches={savedSearches} />
          </>
        )}

        {activeTab === 'favorites' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Избранные объявления</h2>
            </div>
            <FavoritesList favorites={favorites} />
          </>
        )}

        {activeTab === 'admin' && isAdmin && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-medium">Управление пользователями</h2>
            </div>
            <AdminPanel />
          </>
        )}
      </div>
    </div>
  );
}
