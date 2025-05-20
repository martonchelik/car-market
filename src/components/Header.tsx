'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Search, User, Heart, Bell, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-av">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link flex items-center">
                Транспорт <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem>
                  <Link href="#" className="w-full">Легковые авто</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="#" className="w-full">Автосалоны</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="#" className="w-full">Электромобили</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="#" className="w-full">Грузовые авто</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="#" className="w-full">Мотоциклы</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link flex items-center">
                Запчасти и шины <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem>
                  <Link href="#" className="w-full">Запчасти и расходники</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="#" className="w-full">Аксессуары и тюнинг</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="#" className="w-full">Шины и диски</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="#" className="nav-link">Проверка VIN</Link>
            <Link href="#" className="nav-link">Новости</Link>
            <Link href="#" className="nav-link">Информация</Link>
            <Link href="#" className="nav-link">Компании</Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Authenticated UI */}
            {session?.user ? (
              <>
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/profile?tab=favorites">
                    <Button variant="ghost" size="icon" className="text-gray h-9 w-9">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="text-gray h-9 w-9">
                    <Bell className="h-5 w-5" />
                  </Button>
                </div>

                <Link href="/profile/new-listing">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Подать объявление
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <Image
                        src={session.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || 'User')}&background=2ab4ac&color=fff`}
                        alt={session.user.name || 'User'}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span className="hidden md:inline text-sm">{session.user.name?.split(' ')[0]}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <Link href="/profile" className="w-full">Мой профиль</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/profile?tab=favorites" className="w-full">Избранное</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/profile?tab=saved-searches" className="w-full">Сохраненные поиски</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                      <div className="flex items-center text-red-600 w-full">
                        <LogOut className="h-4 w-4 mr-2" />
                        Выйти
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Non-authenticated UI
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="hidden md:flex">
                  <Link href="/auth/signin">
                    <Button variant="outline" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Войти</span>
                    </Button>
                  </Link>
                </div>

                <Link href={session ? '/profile/new-listing' : '/auth/signin'}>
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Подать объявление
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
