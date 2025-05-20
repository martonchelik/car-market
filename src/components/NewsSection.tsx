import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

// Sample news data
const newsItems = [
  {
    id: '1',
    title: 'Из Минска в Дагестан на Yamaha и Triumph. Рассказываем про поездку',
    category: 'авторынок',
    date: '',
    views: 9646,
    imageUrl: 'https://avcdn.av.by/journalarticlepreviewmedium/0005/1050/0513.jpg',
    slug: 'iz_minska_v_dagestan_na_yamaha_i_triumph'
  },
  {
    id: '2',
    title: 'За $6 000! Сколько за ваш Passat предлагают? Что происходит в самом сердце "Малиновки"',
    category: 'авторынок',
    date: '12 часов назад',
    views: 6344,
    imageUrl: 'https://avcdn.av.by/journalarticlepreviewmedium/0005/0842/3969.jpg',
    slug: 'skolko_za_avto_predlagaut_perekupi_na_rinke_v_malinovke'
  },
  {
    id: '3',
    title: 'Участки, на которых фиксируют отсутствие ТО. Автомобилистов предупреждают о новых точках',
    category: 'безопасность',
    date: '',
    views: 98695,
    imageUrl: 'https://avcdn.av.by/journalarticlepreviewmedium/0005/1070/0872.jpg',
    slug: 'uchastki_na_kotorih_fiksiryut_otsutstvie_to'
  },
  {
    id: '4',
    title: 'Пресс-конференция БАА пройдет 15 апреля 2025 года',
    category: 'авторынок',
    date: '',
    views: 6064,
    imageUrl: 'https://avcdn.av.by/journalarticlepreviewmedium/0005/1078/9798.jpg',
    slug: 'press-konferecia_baa_proidet_15_aprelia_2025_goda'
  },
];

export function NewsSection() {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium font-heading">Новости</h2>
        <Link
          href="/news"
          className="text-primary text-sm hover:underline"
        >
          Все новости
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {newsItems.map((news) => (
          <Card key={news.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-40">
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                className="object-cover"
              />
            </div>

            <CardContent className="p-4">
              <Link href={`/news/${news.slug}`} className="block">
                <h3 className="line-clamp-3 text-sm font-medium mb-2 hover:text-primary transition-colors">{news.title}</h3>
              </Link>

              <div className="flex items-center text-xs text-gray mt-3 space-x-1">
                <Link
                  href={`/news/${news.category}`}
                  className="hover:text-primary transition-colors"
                >
                  {news.category}
                </Link>

                {news.date && (
                  <>
                    <span>•</span>
                    <span>{news.date}</span>
                  </>
                )}

                <span className="ml-auto flex items-center">
                  <span className="mr-1">
                    <Image
                      src="https://ext.same-assets.com/837818936/1248550479.svg"
                      alt="views"
                      width={12}
                      height={12}
                    />
                  </span>
                  {news.views}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
