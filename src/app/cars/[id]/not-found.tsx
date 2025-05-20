import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function CarNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center bg-[#f1f4f7] py-12">
        <div className="container-av">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <AlertTriangle className="h-16 w-16 text-amber-500" />
            </div>

            <h1 className="text-2xl font-medium font-heading mb-4">
              Объявление не найдено
            </h1>

            <p className="text-gray mb-6">
              Объявление могло быть удалено владельцем или модератором.
              Также возможно, что автомобиль уже продан.
            </p>

            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button asChild>
                <Link href="/">Вернуться на главную</Link>
              </Button>

              <Button variant="outline" asChild>
                <Link href="/cars">Смотреть все объявления</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
