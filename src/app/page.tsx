import { Header } from '@/components/Header';
import { SearchForm } from '@/components/SearchForm';
import { CarMakesList } from '@/components/CarMakesList';
import { CarListingCard } from '@/components/CarListingCard';
import { FeaturedCars } from '@/components/FeaturedCars';
import { NewsSection } from '@/components/NewsSection';
import { NewsSidebar } from '@/components/NewsSidebar';
import { Footer } from '@/components/Footer';
import { carListings } from '@/data/carListings';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pb-12">
        <div className="container-av py-6">
          <SearchForm />

          <CarMakesList />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
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
