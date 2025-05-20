import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

// Footer link sections
const footerSections = [
  {
    title: 'Транспорт',
    links: [
      { name: 'Легковые авто', href: '/cars' },
      { name: 'Электромобили', href: '/cars/electrocars' },
      { name: 'Грузовые авто', href: '/truck' },
      { name: 'Мотоциклы', href: '/moto' },
      { name: 'Сельхозтехника', href: '/agro' },
      { name: 'Спецтехника', href: '/spec' },
    ],
  },
  {
    title: 'Запчасти и шины',
    links: [
      { name: 'Запчасти', href: '/parts' },
      { name: 'Аксессуары', href: '/parts/accessories' },
      { name: 'Шины и диски', href: '/koleso' },
      { name: 'Мотозапчасти', href: '/parts/moto' },
      { name: 'Спецзапчасти', href: '/parts/spec' },
    ],
  },
  {
    title: 'Сервисы',
    links: [
      { name: 'Проверка VIN', href: '/vin' },
      { name: 'Гараж', href: '/pages/garage' },
      { name: 'Автосалоны', href: '/salon' },
      { name: 'Лизинг', href: '/finance' },
      { name: 'Оценка авто', href: '/ocenka-avto' },
      { name: 'Калькулятор платежей', href: '/customs-calculator' },
    ],
  },
  {
    title: 'Информация',
    links: [
      { name: 'О проекте', href: '/about' },
      { name: 'Новости', href: '/news' },
      { name: 'Статьи', href: '/articles' },
      { name: 'Компании', href: '/company' },
      { name: 'Реклама', href: '/ads' },
      { name: 'Контакты', href: '/contacts' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-white py-8 border-t border-gray-200">
      <div className="container-av">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-medium mb-4 font-heading">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-t border-gray-100">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="block mb-4">
              <Image
                src="https://ext.same-assets.com/837818936/1248550479.svg"
                alt="av.by"
                width={100}
                height={20}
              />
            </Link>

            <div className="text-sm text-gray">
              © 2001–2025 av.by — продажа авто в Беларуси.
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
            <div className="flex items-center text-sm text-gray">
              <Phone className="h-4 w-4 mr-2" />
              <span>+375 29 637-77-77</span>
            </div>

            <div className="flex items-center text-sm text-gray">
              <Mail className="h-4 w-4 mr-2" />
              <Link href="mailto:info@av.by" className="hover:text-primary transition-colors">
                info@av.by
              </Link>
            </div>

            <div className="flex space-x-4">
              <Link href="#" className="text-gray hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
