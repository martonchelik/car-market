import { Metadata } from 'next';
import SignInForm from '@/components/auth/SignInForm';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Вход | av.by',
  description: 'Войдите в свой аккаунт для доступа к сохраненным поискам и избранным объявлениям.',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#f1f4f7] flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container-av">
          <Link href="/" className="flex items-center">
            <div className="w-24">
              <Image
                src="https://ext.same-assets.com/837818936/1248550479.svg"
                alt="av.by"
                width={100}
                height={20}
                priority
              />
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-medium font-heading mb-6 text-center">
              Вход в аккаунт
            </h1>

            <SignInForm />

            <div className="mt-6 text-center text-sm text-gray">
              <p className="mt-2">
                <Link href="/" className="text-primary hover:underline">
                  Вернуться на главную
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
