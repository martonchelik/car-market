"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { useState } from 'react'

export default function TestComponentsPage() {
  const [dialogOpen, setDialogOpen] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(true)

  return (
    <div
      className="container mx-auto p-8"
      style={{
        background:
          'repeating-linear-gradient(45deg, #f06, #f06 10px, #0cf 10px, #0cf 20px)',
      }}
    >
      <h1 className="text-2xl font-bold mb-8 bg-white px-4 py-2 rounded">
        Тестирование компонентов (на фоне с паттерном)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Тест выпадающего меню</h2>
          <div className="flex flex-col gap-4">
            <DropdownMenu open={true}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Открыто выпадающее меню</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Профиль</DropdownMenuItem>
                <DropdownMenuItem>Настройки</DropdownMenuItem>
                <DropdownMenuItem>Выйти</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-green-100 to-teal-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Тест HoverCard</h2>
          <div className="flex flex-col gap-4">
            <HoverCard open={true}>
              <HoverCardTrigger asChild>
                <Button variant="outline">Открыта HoverCard</Button>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Заголовок карточки</h4>
                  <p className="text-sm">
                    Это содержимое всплывающей карточки, которое должно иметь непрозрачный фон.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Тест Dialog</h2>
          <div className="flex flex-col gap-4">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Открыт диалог</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Заголовок диалога</DialogTitle>
                  <DialogDescription>
                    Это диалоговое окно, которое должно иметь непрозрачный фон.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p>Содержимое диалога показывается здесь.</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Тест Input</h2>
          <div className="flex flex-col gap-4">
            <Input placeholder="Введите текст здесь" />
            <Input type="password" placeholder="Введите пароль" />
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Исправленные компоненты</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Компонент dropdown-menu - исправлен (непрозрачный bg-white фон)</li>
          <li>Компонент hover-card - исправлен (непрозрачный bg-white фон)</li>
          <li>Компонент dialog - исправлен (непрозрачный bg-white фон)</li>
          <li>Компонент input - исправлен (непрозрачный bg-white фон)</li>
        </ul>
        <p className="mt-4">
          Все компоненты теперь должны иметь непрозрачный белый фон, вместо прозрачного.
        </p>
      </div>
    </div>
  )
}
