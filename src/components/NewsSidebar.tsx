import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Shield, Wrench, Zap, Info } from 'lucide-react';

// Sample news data
const newsItems = [
  {
    id: '1',
    title: 'Более свежий авто и деньги в плюсе! Простой лайфхак для 398 тысяч авто',
    category: 'Новости компаний',
    date: '12 часов назад',
    imageUrl: 'https://avcdn.av.by/journalarticlepreviewmedium/0005/1062/8754.jpg',
    slug: 'rn_boleye_svezhiy_avto_i_dengi_v_plyuse'
  },
  {
    id: '2',
    title: 'Снизились ставки: от 3 000 BYN и 4,99% в BYN на любые авто',
    category: 'Новости компаний',
    date: '12 часов назад',
    imageUrl: 'https://avcdn.av.by/journalarticlepreviewmedium/0005/1077/7388.jpg',
    slug: 'rn_snizhennyye_stavki_i_bolshiye_skidki'
  },
  {
    id: '3',
    title: 'Столько, сколько нужно. Lada предложила скидки до 10 млн рублей',
    category: 'Новости компаний',
    date: '12 часов назад',
    imageUrl: 'https://avcdn.av.by/journalarticlepreviewmedium/0005/1070/4320.jpg',
    slug: 'rn_snizheniye_tsen_na_avto_v_nalichii'
  },
];

// Tools data
const sidebarTools = [
  {
    id: 'vin',
    title: 'Проверка VIN',
    icon: <FileText className="h-5 w-5" />,
    href: '/vin'
  },
  {
    id: 'garage',
    title: 'Мой гараж',
    icon: <Shield className="h-5 w-5" />,
    href: '/pages/garage'
  },
  {
    id: 'appraisal',
    title: 'Оценка авто',
    icon: <Info className="h-5 w-5" />,
    href: '/ocenka-avto'
  },
  {
    id: 'companies',
    title: 'Каталог компаний',
    icon: <Wrench className="h-5 w-5" />,
    href: '/company'
  },
  {
    id: 'electro',
    title: 'Электрокары',
    icon: <Zap className="h-5 w-5" />,
    href: '/cars/electrocars'
  },
];

export function NewsSidebar() {
  return (
    <div className="space-y-6">
      {/* Tools sidebar */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-medium font-heading mb-4">Сервисы</h2>

          <div className="space-y-2">
            {sidebarTools.map(tool => (
              <Link
                key={tool.id}
                href={tool.href}
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="mr-3 text-gray">{tool.icon}</div>
                <span>{tool.title}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* News sidebar */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-medium font-heading mb-4">Новости</h2>

          <div className="space-y-4">
            {newsItems.map(news => (
              <div key={news.id} className="flex gap-3">
                <div className="flex-shrink-0 w-20 h-16 relative rounded overflow-hidden">
                  <Image
                    src={news.imageUrl}
                    alt={news.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Link
                    href={`/news/${news.slug}`}
                    className="line-clamp-2 text-sm font-medium hover:text-primary transition-colors"
                  >
                    {news.title}
                  </Link>
                  <div className="flex items-center text-xs text-gray mt-1 space-x-1">
                    <Link
                      href={`/news/${news.category.toLowerCase().replace(' ', '-')}`}
                      className="hover:text-primary transition-colors"
                    >
                      {news.category}
                    </Link>
                    <span>•</span>
                    <span>{news.date}</span>
                  </div>
                </div>
              </div>
            ))}

            <Link
              href="/news"
              className="block text-primary text-sm font-medium hover:underline"
            >
              Все новости
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
