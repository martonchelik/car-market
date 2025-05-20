'use client';

import { useState } from 'react';
import SavedSearchesList from './SavedSearchesList';
import FavoritesList from './FavoritesList';

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

interface ProfileTabsProps {
  savedSearches: SavedSearch[];
  favorites: FavoriteCar[];
}

export default function ProfileTabs({ savedSearches, favorites }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState('saved-searches');

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="border-b border-gray-100">
        <div className="flex">
          <button
            onClick={() => setActiveTab('saved-searches')}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'saved-searches'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray hover:text-gray-dark'
            }`}
          >
            Сохраненные поиски ({savedSearches.length})
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'favorites'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray hover:text-gray-dark'
            }`}
          >
            Избранное ({favorites.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'saved-searches' && (
          <SavedSearchesList searches={savedSearches} />
        )}

        {activeTab === 'favorites' && (
          <FavoritesList favorites={favorites} />
        )}
      </div>
    </div>
  );
}
