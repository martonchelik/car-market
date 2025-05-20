import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Регистрация | av.by',
  description: 'Создайте учетную запись на av.by для доступа ко всем функциям сайта',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-[#f1f4f7] py-8">
        <div className="container-av mx-auto flex justify-center">
          <RegisterForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
