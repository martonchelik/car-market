// Mock database of user saved searches and favorites
// In a real application, you would use a real database

interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters: {
    make?: string;
    model?: string;
    priceFrom?: number;
    priceTo?: number;
    yearFrom?: number;
    yearTo?: number;
    engineType?: string;
    transmission?: string;
  };
  createdAt: string;
  notifyOnNew: boolean;
}

interface Favorite {
  userId: string;
  carId: string;
  addedAt: string;
}

// Sample saved searches
export const savedSearches: SavedSearch[] = [
  {
    id: '1',
    userId: '1', // Demo user
    name: 'Бюджетные авто',
    filters: {
      priceFrom: 5000,
      priceTo: 15000,
      yearFrom: 2010,
      yearTo: 2023,
    },
    createdAt: '2025-03-20T14:30:00Z',
    notifyOnNew: true,
  },
  {
    id: '2',
    userId: '1',
    name: 'Audi/BMW последние',
    filters: {
      make: 'Audi,BMW',
      yearFrom: 2020,
    },
    createdAt: '2025-03-22T10:15:00Z',
    notifyOnNew: false,
  },
  {
    id: '3',
    userId: '2', // Ivan
    name: 'Электромобили',
    filters: {
      engineType: 'Электро',
    },
    createdAt: '2025-03-15T09:45:00Z',
    notifyOnNew: true,
  },
];

// Sample favorites for users
export const favorites: Favorite[] = [
  {
    userId: '1',
    carId: '114406262', // Toyota C-HR
    addedAt: '2025-03-20T15:30:00Z',
  },
  {
    userId: '1',
    carId: '113266555', // Mercedes-Benz S-класс
    addedAt: '2025-03-21T12:40:00Z',
  },
  {
    userId: '2',
    carId: '115131033', // Volkswagen Multivan
    addedAt: '2025-03-19T09:20:00Z',
  },
];

// Helper functions to interact with the mock database

export function getSavedSearchesByUserId(userId: string): SavedSearch[] {
  // Если пользователь новый (не '1' и не '2'), дадим ему некоторые демо-поиски
  const userSearches = savedSearches.filter(search => search.userId === userId);

  if (userSearches.length === 0 && userId !== '1' && userId !== '2') {
    // Возвращаем копию некоторых демо-поисков с ID пользователя
    return [
      {
        ...savedSearches[0],
        id: 'new-1',
        userId: userId,
        createdAt: new Date().toISOString()
      },
      {
        ...savedSearches[1],
        id: 'new-2',
        userId: userId,
        createdAt: new Date().toISOString()
      }
    ];
  }

  return userSearches;
}

export function getFavoritesByUserId(userId: string): Favorite[] {
  // Если пользователь новый (не '1' и не '2'), дадим ему некоторые демо-избранные
  const userFavorites = favorites.filter(favorite => favorite.userId === userId);

  if (userFavorites.length === 0 && userId !== '1' && userId !== '2') {
    // Возвращаем копию некоторых демо-избранных с ID пользователя
    return [
      {
        userId: userId,
        carId: '114406262', // Toyota C-HR
        addedAt: new Date().toISOString()
      },
      {
        userId: userId,
        carId: '113266555', // Mercedes-Benz S-класс
        addedAt: new Date().toISOString()
      }
    ];
  }

  return userFavorites;
}

export function addSavedSearch(search: Omit<SavedSearch, 'id' | 'createdAt'>): SavedSearch {
  const newSearch: SavedSearch = {
    ...search,
    id: (savedSearches.length + 1).toString(),
    createdAt: new Date().toISOString(),
  };

  savedSearches.push(newSearch);
  return newSearch;
}

export function addFavorite(userId: string, carId: string): Favorite {
  const favorite: Favorite = {
    userId,
    carId,
    addedAt: new Date().toISOString(),
  };

  favorites.push(favorite);
  return favorite;
}

export function removeFavorite(userId: string, carId: string): boolean {
  const initialLength = favorites.length;
  const newFavorites = favorites.filter(
    favorite => !(favorite.userId === userId && favorite.carId === carId)
  );

  // Update by reference - this is just for demo purposes
  // In a real app we would use a real database
  favorites.length = 0;
  favorites.push(...newFavorites);

  return favorites.length < initialLength;
}

export function removeSavedSearch(userId: string, searchId: string): boolean {
  const initialLength = savedSearches.length;
  const newSearches = savedSearches.filter(
    search => !(search.userId === userId && search.id === searchId)
  );

  // Update by reference - this is just for demo purposes
  savedSearches.length = 0;
  savedSearches.push(...newSearches);

  return savedSearches.length < initialLength;
}
