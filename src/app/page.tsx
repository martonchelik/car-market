import { Header } from '@/components/Header';
import { SearchForm } from '@/components/SearchForm';
import { CarMakesList } from '@/components/CarMakesList';
import { CarListingCard } from '@/components/CarListingCard';
import { FeaturedCars } from '@/components/FeaturedCars';
import { NewsSection } from '@/components/NewsSection';
import { NewsSidebar } from '@/components/NewsSidebar';
import { Footer } from '@/components/Footer';
import { getAllCars } from '@/lib/carService';
import { formatCarListingForDisplay } from '@/lib/utils';
// Import hardcoded data as fallback
import { carListings as fallbackCarListings } from '@/data/carListings';

export default async function Home() {
  // Default to fallback data
  let carListings = fallbackCarListings;

  try {
    // Try to fetch car listings from the database
    const carListingsData = await getAllCars();

    // Only process if we have valid data
    if (carListingsData && Array.isArray(carListingsData) && carListingsData.length > 0) {
      // Format data for display and filter out any null results
      const formattedListings = carListingsData
        .map(car => formatCarListingForDisplay(car))
        .filter(car => car !== null);

      // Only replace fallback if we have valid formatted data
      if (formattedListings && formattedListings.length > 0) {
        carListings = formattedListings;
      } else {
        console.log("Failed to format car listings, using fallback data");
      }
    } else {
      console.log("No car listings found in database, using fallback data");
    }
  } catch (error) {
    // If database connection fails, use fallback data
    console.error("Error fetching car listings from database:", error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pb-12">
        <div className="container-av py-6">
          <SearchForm />

          <CarMakesList />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* FeaturedCars is now an async component */}
              {/* @ts-expect-error Async Server Component */}
              <FeaturedCars />

              <div className="mb-8" id="catalog">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium font-heading">Актуальные предложения</h2>
                </div>

                <div className="space-y-4">
                  {carListings.map((car) => (
                    <CarListingCard
                      key={car.id}
                      id={car.id}
                      title={car.title}
                      year={car.year}
                      imageUrl={car.imageUrl}
                      engineType={car.engineType}
                      engineVolume={car.engineVolume}
                      transmission={car.transmission}
                      mileage={car.mileage}
                      price={car.price}
                      location={car.location}
                      date={car.date}
                      verified={car.verified}
                      vinChecked={car.vinChecked}
                    />
                  ))}
                </div>
              </div>

              <NewsSection />
            </div>

            <div className="lg:col-span-1">
              <NewsSidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
