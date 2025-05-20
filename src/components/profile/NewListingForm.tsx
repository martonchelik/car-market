'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Plus, X, Check, ChevronDown, Search } from 'lucide-react';

// Определяем интерфейсы
interface CarListing {
  make: string;
  model: string;
  generation: string;
  bodyType: string;
  driveType: string;
  engineType: string;
  year: string;
  mileage: string;
  price: string;
  engine: string;
  transmission: string;
  color: string;
  description: string;
  images: string[];
}

// Справочные данные для выпадающих списков
const carMakes = [
  'Audi', 'BMW', 'Chevrolet', 'Citroen', 'Ford', 'Honda',
  'Hyundai', 'Kia', 'Lexus', 'Mazda', 'Mercedes-Benz', 'Mitsubishi',
  'Nissan', 'Opel', 'Peugeot', 'Renault', 'Skoda', 'Toyota',
  'Volkswagen', 'Volvo'
];

const transmissionTypes = [
  'Автоматическая', 'Механическая', 'Роботизированная', 'Вариатор'
];

const bodyTypes = [
  'Седан', 'Хэтчбек', 'Универсал', 'Внедорожник', 'Кроссовер',
  'Купе', 'Кабриолет', 'Минивэн', 'Пикап', 'Фургон', 'Лимузин'
];

const driveTypes = [
  'Передний', 'Задний', 'Полный'
];

const engineTypes = [
  'Бензин', 'Дизель', 'Газ/Бензин', 'Гибрид', 'Электро', 'Газ'
];

// Модели автомобилей для разных марок
const carModels: Record<string, string[]> = {
  'Audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron', 'TT', 'R8'],
  'BMW': ['1 серия', '2 серия', '3 серия', '4 серия', '5 серия', '6 серия', '7 серия', 'X1', 'X3', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i8'],
  'Volkswagen': ['Polo', 'Golf', 'Jetta', 'Passat', 'Arteon', 'Tiguan', 'Touareg', 'T-Roc', 'T-Cross', 'Caddy', 'Transporter', 'Multivan'],
  'Toyota': ['Corolla', 'Camry', 'RAV4', 'Land Cruiser', 'Land Cruiser Prado', 'Highlander', 'C-HR', 'Yaris', 'Prius', 'Hilux', 'Alphard'],
  'Mercedes-Benz': ['A-класс', 'B-класс', 'C-класс', 'E-класс', 'S-класс', 'GLA', 'GLC', 'GLE', 'GLS', 'CLA', 'CLS', 'AMG GT'],
  // Другие марки могут быть добавлены по аналогии
};

// Поколения для некоторых моделей
const carGenerations: Record<string, Record<string, string[]>> = {
  'Audi': {
    'A4': ['B5 (1994-2001)', 'B6 (2000-2006)', 'B7 (2004-2008)', 'B8 (2007-2015)', 'B9 (2015-настоящее время)'],
    'A6': ['C4 (1994-1997)', 'C5 (1997-2004)', 'C6 (2004-2011)', 'C7 (2011-2018)', 'C8 (2018-настоящее время)'],
  },
  'BMW': {
    '3 серия': ['E36 (1990-2000)', 'E46 (1998-2006)', 'E90/E91/E92/E93 (2005-2013)', 'F30/F31/F34 (2012-2019)', 'G20 (2018-настоящее время)'],
    '5 серия': ['E34 (1988-1996)', 'E39 (1995-2003)', 'E60/E61 (2003-2010)', 'F10/F11 (2010-2017)', 'G30 (2017-настоящее время)'],
  },
  // Другие марки и модели могут быть добавлены по аналогии
};

export default function NewListingForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  // Добавляем состояния для выпадающих списков
  const [showMakeOptions, setShowMakeOptions] = useState(false);
  const [showModelOptions, setShowModelOptions] = useState(false);
  const [showTransmissionOptions, setShowTransmissionOptions] = useState(false);
  const [showBodyTypeOptions, setShowBodyTypeOptions] = useState(false);
  const [showDriveTypeOptions, setShowDriveTypeOptions] = useState(false);
  const [showEngineTypeOptions, setShowEngineTypeOptions] = useState(false);
  const [showGenerationOptions, setShowGenerationOptions] = useState(false);

  // Фильтрация опций
  const [filteredMakes, setFilteredMakes] = useState(carMakes);
  const [filteredModels, setFilteredModels] = useState<string[]>([]);
  const [filteredGenerations, setFilteredGenerations] = useState<string[]>([]);

  // Ссылки на элементы dropdown для закрытия при клике вне
  const makeDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const transmissionDropdownRef = useRef<HTMLDivElement>(null);
  const bodyTypeDropdownRef = useRef<HTMLDivElement>(null);
  const driveTypeDropdownRef = useRef<HTMLDivElement>(null);
  const engineTypeDropdownRef = useRef<HTMLDivElement>(null);
  const generationDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<CarListing>({
    make: '',
    model: '',
    generation: '',
    bodyType: '',
    driveType: '',
    engineType: '',
    year: '',
    mileage: '',
    price: '',
    engine: '',
    transmission: '',
    color: '',
    description: '',
    images: [],
  });

  // Обработчик кликов вне элементов dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (makeDropdownRef.current && !makeDropdownRef.current.contains(event.target as Node)) {
        setShowMakeOptions(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setShowModelOptions(false);
      }
      if (transmissionDropdownRef.current && !transmissionDropdownRef.current.contains(event.target as Node)) {
        setShowTransmissionOptions(false);
      }
      if (bodyTypeDropdownRef.current && !bodyTypeDropdownRef.current.contains(event.target as Node)) {
        setShowBodyTypeOptions(false);
      }
      if (driveTypeDropdownRef.current && !driveTypeDropdownRef.current.contains(event.target as Node)) {
        setShowDriveTypeOptions(false);
      }
      if (engineTypeDropdownRef.current && !engineTypeDropdownRef.current.contains(event.target as Node)) {
        setShowEngineTypeOptions(false);
      }
      if (generationDropdownRef.current && !generationDropdownRef.current.contains(event.target as Node)) {
        setShowGenerationOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Обновляем доступные модели при изменении марки
  useEffect(() => {
    if (formData.make && carModels[formData.make]) {
      setFilteredModels(carModels[formData.make]);
    } else {
      setFilteredModels([]);
    }
  }, [formData.make]);

  // Обновляем доступные поколения при изменении марки и модели
  useEffect(() => {
    if (formData.make && formData.model) {
      const generations = carGenerations[formData.make]?.[formData.model] || [];
      setFilteredGenerations(generations);
    } else {
      setFilteredGenerations([]);
    }
  }, [formData.make, formData.model]);

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Обновляем фильтрованные списки в зависимости от ввода
    if (name === 'make') {
      setFilteredMakes(
        carMakes.filter(make =>
          make.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  // Обработчики выбора значений из выпадающих списков
  const handleSelectMake = (make: string) => {
    setFormData(prev => ({ ...prev, make, model: '', generation: '' }));
    setShowMakeOptions(false);
  };

  const handleSelectModel = (model: string) => {
    setFormData(prev => ({ ...prev, model, generation: '' }));
    setShowModelOptions(false);
  };

  const handleSelectTransmission = (transmission: string) => {
    setFormData(prev => ({ ...prev, transmission }));
    setShowTransmissionOptions(false);
  };

  const handleSelectBodyType = (bodyType: string) => {
    setFormData(prev => ({ ...prev, bodyType }));
    setShowBodyTypeOptions(false);
  };

  const handleSelectDriveType = (driveType: string) => {
    setFormData(prev => ({ ...prev, driveType }));
    setShowDriveTypeOptions(false);
  };

  const handleSelectEngineType = (engineType: string) => {
    setFormData(prev => ({ ...prev, engineType }));
    setShowEngineTypeOptions(false);
  };

  const handleSelectGeneration = (generation: string) => {
    setFormData(prev => ({ ...prev, generation }));
    setShowGenerationOptions(false);
  };

  // Обработчик добавления изображения (имитация)
  const handleAddImage = () => {
    // В реальном приложении здесь была бы загрузка изображения
    // Для демонстрации добавляем случайные изображения автомобилей
    const demoImages = [
      'https://static.am.by/photos/vw/polo/polo-2020-450.jpg',
      'https://static.am.by/photos/audi/a4/a4-2020-450.jpg',
      'https://static.am.by/photos/bmw/3/3-2021-450.jpg',
      'https://static.am.by/photos/toyota/camry/camry-2021-450.jpg',
      'https://static.am.by/photos/mercedes/e/e-2020-450.jpg',
    ];

    const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
    if (!images.includes(randomImage)) {
      setImages(prev => [...prev, randomImage]);
      setFormData(prev => ({ ...prev, images: [...prev.images, randomImage] }));
    }
  };

  // Обработчик удаления изображения
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Имитация отправки данных на сервер
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Успешно
      setSuccess(true);
      setIsSubmitting(false);

      // Перенаправление на страницу профиля через 2 секунды
      setTimeout(() => {
        router.push('/profile');
        router.refresh();
      }, 2000);
    } catch (err) {
      setError('Произошла ошибка при создании объявления');
      setIsSubmitting(false);
    }
  };

  // Компонент отображения формы
  return (
    <div>
      {success ? (
        <div className="bg-green-50 p-6 rounded-md text-center">
          <div className="text-green-600 text-xl font-medium mb-2">Объявление успешно создано!</div>
          <p className="text-green-600">Сейчас вы будете перенаправлены в личный кабинет.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 p-4 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Марка автомобиля - с автозаполнением */}
            <div className="relative" ref={makeDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Марка автомобиля*
              </label>
              <div className="relative">
                <Input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  onClick={() => setShowMakeOptions(true)}
                  placeholder="Например: Audi, BMW, Volkswagen"
                  className="pr-10"
                  required
                />
                <ChevronDown
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                  onClick={() => setShowMakeOptions(!showMakeOptions)}
                />
              </div>

              {showMakeOptions && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredMakes.length > 0 ? (
                    filteredMakes.map((make) => (
                      <div
                        key={make}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleSelectMake(make)}
                      >
                        {make === formData.make && <Check className="h-4 w-4 mr-2 text-green-500" />}
                        {make}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-400">Нет совпадений</div>
                  )}
                </div>
              )}
            </div>

            {/* Модель - с автозаполнением */}
            <div className="relative" ref={modelDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Модель*
              </label>
              <div className="relative">
                <Input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  onClick={() => formData.make && setShowModelOptions(true)}
                  placeholder="Сначала выберите марку"
                  className="pr-10"
                  disabled={!formData.make}
                  required
                />
                <ChevronDown
                  className={`absolute right-3 top-2.5 h-5 w-5 ${!formData.make ? 'text-gray-300' : 'text-gray-400 cursor-pointer'}`}
                  onClick={() => formData.make && setShowModelOptions(!showModelOptions)}
                />
              </div>

              {showModelOptions && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredModels.length > 0 ? (
                    filteredModels.map((model) => (
                      <div
                        key={model}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleSelectModel(model)}
                      >
                        {model === formData.model && <Check className="h-4 w-4 mr-2 text-green-500" />}
                        {model}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-400">Нет моделей для выбранной марки</div>
                  )}
                </div>
              )}
            </div>

            {/* Поколение - с автозаполнением */}
            <div className="relative" ref={generationDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Поколение
              </label>
              <div className="relative">
                <Input
                  type="text"
                  name="generation"
                  value={formData.generation}
                  onChange={handleChange}
                  onClick={() => formData.model && setShowGenerationOptions(true)}
                  placeholder={!formData.make ? "Сначала выберите марку" : !formData.model ? "Сначала выберите модель" : "Выберите поколение"}
                  className="pr-10"
                  disabled={!formData.model}
                />
                <ChevronDown
                  className={`absolute right-3 top-2.5 h-5 w-5 ${!formData.model ? 'text-gray-300' : 'text-gray-400 cursor-pointer'}`}
                  onClick={() => formData.model && setShowGenerationOptions(!showGenerationOptions)}
                />
              </div>

              {showGenerationOptions && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredGenerations.length > 0 ? (
                    filteredGenerations.map((generation) => (
                      <div
                        key={generation}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleSelectGeneration(generation)}
                      >
                        {generation === formData.generation && <Check className="h-4 w-4 mr-2 text-green-500" />}
                        {generation}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-400">Нет данных о поколениях</div>
                  )}
                </div>
              )}
            </div>

            {/* Тип кузова - с автозаполнением */}
            <div className="relative" ref={bodyTypeDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип кузова*
              </label>
              <div className="relative">
                <Input
                  type="text"
                  name="bodyType"
                  value={formData.bodyType}
                  onChange={handleChange}
                  onClick={() => setShowBodyTypeOptions(true)}
                  placeholder="Например: Седан, Хэтчбек"
                  className="pr-10"
                  required
                />
                <ChevronDown
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                  onClick={() => setShowBodyTypeOptions(!showBodyTypeOptions)}
                />
              </div>

              {showBodyTypeOptions && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                  {bodyTypes.map((type) => (
                    <div
                      key={type}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleSelectBodyType(type)}
                    >
                      {type === formData.bodyType && <Check className="h-4 w-4 mr-2 text-green-500" />}
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Тип привода - с автозаполнением */}
            <div className="relative" ref={driveTypeDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип привода*
              </label>
              <div className="relative">
                <Input
                  type="text"
                  name="driveType"
                  value={formData.driveType}
                  onChange={handleChange}
                  onClick={() => setShowDriveTypeOptions(true)}
                  placeholder="Например: Передний, Задний"
                  className="pr-10"
                  required
                />
                <ChevronDown
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                  onClick={() => setShowDriveTypeOptions(!showDriveTypeOptions)}
                />
              </div>

              {showDriveTypeOptions && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                  {driveTypes.map((type) => (
                    <div
                      key={type}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleSelectDriveType(type)}
                    >
                      {type === formData.driveType && <Check className="h-4 w-4 mr-2 text-green-500" />}
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Тип двигателя - с автозаполнением */}
            <div className="relative" ref={engineTypeDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип двигателя*
              </label>
              <div className="relative">
                <Input
                  type="text"
                  name="engineType"
                  value={formData.engineType}
                  onChange={handleChange}
                  onClick={() => setShowEngineTypeOptions(true)}
                  placeholder="Например: Бензин, Дизель"
                  className="pr-10"
                  required
                />
                <ChevronDown
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                  onClick={() => setShowEngineTypeOptions(!showEngineTypeOptions)}
                />
              </div>

              {showEngineTypeOptions && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                  {engineTypes.map((type) => (
                    <div
                      key={type}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleSelectEngineType(type)}
                    >
                      {type === formData.engineType && <Check className="h-4 w-4 mr-2 text-green-500" />}
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Год выпуска */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Год выпуска*
              </label>
              <Input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="Например: 2018"
                required
              />
            </div>

            {/* Пробег */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пробег (км)*
              </label>
              <Input
                type="text"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                placeholder="Например: 75000"
                required
              />
            </div>

            {/* Цена */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цена (BYN)*
              </label>
              <Input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Например: 25000"
                required
              />
            </div>

            {/* Объем двигателя */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Объем двигателя
              </label>
              <Input
                type="text"
                name="engine"
                value={formData.engine}
                onChange={handleChange}
                placeholder="Например: 2.0 л"
              />
            </div>

            {/* Коробка передач - с автозаполнением */}
            <div className="relative" ref={transmissionDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Коробка передач*
              </label>
              <div className="relative">
                <Input
                  type="text"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  onClick={() => setShowTransmissionOptions(true)}
                  placeholder="Например: Автомат, Механика"
                  className="pr-10"
                  required
                />
                <ChevronDown
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                  onClick={() => setShowTransmissionOptions(!showTransmissionOptions)}
                />
              </div>

              {showTransmissionOptions && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                  {transmissionTypes.map((type) => (
                    <div
                      key={type}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleSelectTransmission(type)}
                    >
                      {type === formData.transmission && <Check className="h-4 w-4 mr-2 text-green-500" />}
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Цвет */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цвет
              </label>
              <Input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Например: Черный, Серебристый"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Опишите состояние автомобиля, дополнительное оборудование и другие важные детали"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фотографии
            </label>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative rounded-md overflow-hidden h-24 bg-gray-100">
                  <Image
                    src={image}
                    alt={`Фото ${index + 1}`}
                    width={150}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {images.length < 10 && (
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-md hover:border-primary transition-colors"
                >
                  <Plus className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Добавить фото</span>
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500">
              Можно загрузить до 10 фотографий в формате JPG, PNG. Максимальный размер — 10 МБ.
            </p>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Создание объявления...' : 'Опубликовать объявление'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
