import type { Metadata } from 'next';
import { Inter, Open_Sans, Montserrat } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';

const openSans = Open_Sans({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-open-sans',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'av.by — купить, продать авто в Беларуси. Автомобили с пробегом и новые.',
  description: '№1 в Беларуси. Объявления о продаже авто. Новые авто, авто в лизинг, проверка VIN, цены на авто, запчасти, новости, каталог компаний.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${openSans.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-[#f1f4f7] font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
