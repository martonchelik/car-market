import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { carListings } from '@/data/carListings';
import { Clock, CheckCircle, Award, ShieldCheck, Calendar, MapPin, Heart, Share2, Phone } from 'lucide-react';

interface CarDetailsPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CarDetailsPageProps): Promise<Metadata> {
  const car = carListings.find(car => car.id === params.id);

  if (!car) {
    return {
      title: 'Объявление не найдено | av.by',
      description: 'Автомобиль не найден или объявление удалено',
    };
  }

  return {
    title: `${car.title} ${car.year} г. ${car.price.byn} р. | av.by`,
    description: `${car.title}, ${car.year} г., ${car.engineVolume} ${car.engineType}, ${car.transmission}, ${car.mileage} км. Купить автомобиль в Беларуси.`,
  };
}

export default function CarDetailsPage({ params }: CarDetailsPageProps) {
  const car = carListings.find(car => car.id === params.id);

  if (!car) {
    notFound();
  }

  // Используем только одно изображение, чтобы избежать проблем с недоступными изображениями
  const mainImage = car.imageUrl;

  // Генерируем фейковые характеристики автомобиля
  const carSpecs = {
    body: ['Седан', 'Внедорожник 5 дв.', 'Хэтчбек 5 дв.'][Math.floor(Math.random() * 3)],
    color: ['Белый', 'Черный', 'Серебристый', 'Синий', 'Красный'][Math.floor(Math.random() * 5)],
    seats: ['5', '7'][Math.floor(Math.random() * 2)],
    drive: ['Передний', 'Задний', 'Полный'][Math.floor(Math.random() * 3)],
    condition: ['Отличное', 'Хорошее', 'Не требует вложений'][Math.floor(Math.random() * 3)],
  };

  // Генерируем случайный номер телефона
  const phoneNumber = `+375 (29) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}-${Math.floor(10 + Math.random() * 90)}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-[#f1f4f7] py-6">
        <div className="container-av">
          {/* Хлебные крошки */}
          <div className="mb-4 text-sm">
            <Link href="/" className="text-gray hover:text-primary">Главная</Link>
            <span className="mx-2 text-gray">/</span>
            <Link href="/cars" className="text-gray hover:text-primary">Автомобили</Link>
            <span className="mx-2 text-gray">/</span>
            <span className="text-gray-dark">{car.title}</span>
          </div>

          {/* Заголовок объявления */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h1 className="text-2xl font-medium font-heading mb-2">{car.title}</h1>
                <div className="flex items-center text-sm text-gray">
                  <span>ID: {car.id}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {car.date}
                  </span>
                  {car.vinChecked && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="flex items-center text-primary">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        VIN проверен
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 md:mt-0 text-right">
                <div className="text-2xl font-bold mb-1">{car.price.byn} р.</div>
                <div className="text-sm text-gray">≈ {car.price.usd}$</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Главное изображение */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="relative h-[400px] mb-4">
                  <Image
                    src={mainImage}
                    alt={car.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Характеристики */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-medium font-heading mb-4">Характеристики</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray">Год выпуска</span>
                    <span className="font-medium">{car.year}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray">Пробег</span>
                    <span className="font-medium">{car.mileage} км</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray">Тип двигателя</span>
                    <span className="font-medium">{car.engineType}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray">Объем двигателя</span>
                    <span className="font-medium">{car.engineVolume} л</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray">Коробка передач</span>
                    <span className="font-medium">{car.transmission}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray">Привод</span>
                    <span className="font-medium">{carSpecs.drive}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray">Тип кузова</span>
                    <span className="font-medium">{carSpecs.body}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray">Цвет</span>
                    <span className="font-medium">{carSpecs.color}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray">Количество мест</span>
                    <span className="font-medium">{carSpecs.seats}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray">Состояние</span>
                    <span className="font-medium">{carSpecs.condition}</span>
                  </div>
                </div>
              </div>

              {/* Описание */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-medium font-heading mb-4">Описание</h2>

                <div className="prose max-w-none">
                  <p>
                    Продается {car.title} {car.year} года выпуска в отличном состоянии.
                    Двигатель {car.engineVolume} л, {car.engineType}, {car.transmission} коробка передач.
                    Пробег {car.mileage} км. Привод {carSpecs.drive.toLowerCase()}.
                  </p>
                  <p>
                    Автомобиль в {carSpecs.condition.toLowerCase()} состоянии, без ДТП, один владелец.
                    Полный комплект ключей, сервисная книжка, все ТО пройдены по регламенту у официального дилера.
                  </p>
                  <p>
                    Комплектация включает: климат-контроль, подогрев сидений, мультимедийную систему с навигацией,
                    камеру заднего вида, парктроники, кожаный салон, литые диски.
                  </p>
                  <p>
                    Автомобиль находится в {car.location}е. Возможен торг при осмотре.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              {/* Контакты продавца */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-medium mb-4">Продавец</h3>

                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                    {car.verified ? (
                      <Award className="h-6 w-6 text-primary" />
                    ) : (
                      <span className="text-lg font-bold">A</span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{car.verified ? 'Автосалон "АвтоЭксперт"' : 'Алексей'}</div>
                    <div className="text-sm text-gray">На av.by с 2020 года</div>
                  </div>
                </div>

                <Button className="w-full mb-3 bg-primary hover:bg-primary/90">
                  <Phone className="h-4 w-4 mr-2" />
                  {phoneNumber}
                </Button>

                <div className="flex space-x-2 mb-4">
                  <Button variant="outline" className="flex-1">
                    <Heart className="h-4 w-4 mr-2" />
                    В избранное
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Поделиться
                  </Button>
                </div>

                <div className="text-sm text-gray">
                  <div className="flex items-start mb-2">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{car.location}, ул. Автомобильная, 25</span>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Просмотр по предварительной договоренности</span>
                  </div>
                </div>
              </div>

              {/* Советы безопасности */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start mb-3">
                  <ShieldCheck className="h-5 w-5 mr-2 text-primary mt-0.5" />
                  <h3 className="font-medium">Советы по безопасности</h3>
                </div>

                <ul className="text-sm text-gray space-y-2">
                  <li>• Встречайтесь с продавцом в публичных местах</li>
                  <li>• Проверяйте автомобиль перед покупкой</li>
                  <li>• Не соглашайтесь на предоплату</li>
                  <li>• Проверьте документы на автомобиль</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
