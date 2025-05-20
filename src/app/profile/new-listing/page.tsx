import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import NewListingForm from '@/components/profile/NewListingForm';

export const metadata: Metadata = {
  title: 'Подать объявление | av.by',
  description: 'Создание нового объявления о продаже автомобиля на av.by',
};

export default async function NewListingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-[#f1f4f7] py-8">
        <div className="container-av">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100">
              <h1 className="text-2xl font-medium font-heading">Подать объявление</h1>
              <p className="text-gray-500 mt-1">
                Заполните форму ниже для создания нового объявления
              </p>
            </div>

            <div className="p-6">
              <NewListingForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
