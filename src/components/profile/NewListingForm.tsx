'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { CarBrand, Model, BodyType, EngineType, GearBox, Transmission, Color } from '@/types';

export function NewListingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);

  // Состояния для справочников
  const [brands, setBrands] = useState<CarBrand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [engineTypes, setEngineTypes] = useState<EngineType[]>([]);
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([]);
  const [gearBoxes, setGearBoxes] = useState<GearBox[]>([]);
  const [driveTypes, setDriveTypes] = useState<Transmission[]>([]);
  const [colors, setColors] = useState<Color[]>([]);

  // Состояние формы
  const [formData, setFormData] = useState({
    made: '',
    model: '',
    prodyear: new Date().getFullYear().toString(),
    engvol: '1.0',
    price: '0',
    milage: '0',
    engtype: '',
    body: '',
    gearbox: '',
    transmission: '',
    color: '',
    imageUrl: '',
  });

  // Загрузка справочных данных при первом рендере
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const response = await fetch('/api/reference/all');
        if (!response.ok) throw new Error('Failed to fetch reference data');

        const data = await response.json();
        setBrands(data.brands);
        setEngineTypes(data.engineTypes);
        setBodyTypes(data.bodyTypes);
        setGearBoxes(data.gearBoxes);
        setDriveTypes(data.driveTypes);
        setColors(data.colors);

        // Устанавливаем начальные значения для селектов (первый элемент из списка)
        if (data.brands.length > 0) setFormData(prev => ({ ...prev, made: data.brands[0].idcb.toString() }));
        if (data.engineTypes.length > 0) setFormData(prev => ({ ...prev, engtype: data.engineTypes[0].idet.toString() }));
        if (data.bodyTypes.length > 0) setFormData(prev => ({ ...prev, body: data.bodyTypes[0].idbt.toString() }));
        if (data.gearBoxes.length > 0) setFormData(prev => ({ ...prev, gearbox: data.gearBoxes[0].idgb.toString() }));
        if (data.driveTypes.length > 0) setFormData(prev => ({ ...prev, transmission: data.driveTypes[0].idtm.toString() }));
        if (data.colors.length > 0) setFormData(prev => ({ ...prev, color: data.colors[0].idc.toString() }));

        setFormLoading(false);
      } catch (error) {
        console.error('Error fetching reference data:', error);
        toast.error('Не удалось загрузить справочные данные');
        setFormLoading(false);
      }
    };

    fetchReferenceData();
  }, []);

  // Загрузка моделей при выборе бренда
  useEffect(() => {
    if (formData.made) {
      const fetchModels = async () => {
        try {
          const response = await fetch(`/api/reference/models?brandId=${formData.made}`);
          if (!response.ok) throw new Error('Failed to fetch models');

          const data = await response.json();
          setModels(data);

          // Если есть хотя бы одна модель, выбираем первую
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, model: data[0].idmodels.toString() }));
          }
        } catch (error) {
          console.error('Error fetching models:', error);
          toast.error('Не удалось загрузить модели автомобилей');
        }
      };

      fetchModels();
    } else {
      setModels([]);
    }
  }, [formData.made]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация формы
    if (
      !formData.model ||
      !formData.made ||
      !formData.engtype ||
      !formData.body ||
      !formData.gearbox ||
      !formData.transmission ||
      !formData.color
    ) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // Валидация числовых полей
    const price = Number(formData.price);
    const prodyear = Number(formData.prodyear);
    const milage = Number(formData.milage);
    const engvol = Number(formData.engvol.replace(',', '.'));

    if (isNaN(price) || price <= 0) {
      toast.error('Укажите корректную цену');
      return;
    }

    if (isNaN(prodyear) || prodyear < 1900 || prodyear > new Date().getFullYear()) {
      toast.error('Укажите корректный год выпуска');
      return;
    }

    if (isNaN(milage) || milage < 0) {
      toast.error('Укажите корректный пробег');
      return;
    }

    if (isNaN(engvol) || engvol <= 0) {
      toast.error('Укажите корректный объем двигателя');
      return;
    }

    setLoading(true);

    try {
      // Формируем данные для отправки
      const carData = {
        model: formData.model,
        prodyear: prodyear,
        engvol: engvol,
        price: price,
        milage: milage,
        active: true,
        new: false,
        owner: 1, // В реальном приложении здесь должен быть ID текущего пользователя
        engtype: Number(formData.engtype),
        body: Number(formData.body),
        gearbox: Number(formData.gearbox),
        transmission: Number(formData.transmission),
        color: Number(formData.color),
        made: Number(formData.made)
      };

      // Отправляем запрос
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при создании объявления');
      }

      const result = await response.json();

      toast.success('Объявление успешно создано!');

      // Перенаправляем на страницу объявлений
      router.push('/cars');
    } catch (error: any) {
      console.error('Error creating listing:', error);
      toast.error(error.message || 'Не удалось создать объявление');
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
        <div className="h-10 bg-gray-200 rounded w-1/3 mt-4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-medium mb-6">Создать новое объявление</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Марка автомобиля */}
          <div>
            <label htmlFor="made" className="block text-sm font-medium text-gray-700 mb-1">
              Марка *
            </label>
            <select
              id="made"
              name="made"
              value={formData.made}
              onChange={handleInputChange}
              className="w-full border rounded-md h-10 px-3"
              required
            >
              <option value="">Выберите марку</option>
              {brands.map(brand => (
                <option key={brand.idcb} value={brand.idcb}>
                  {brand.carbrand}
                </option>
              ))}
            </select>
          </div>

          {/* Модель автомобиля */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
              Модель *
            </label>
            <select
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              className="w-full border rounded-md h-10 px-3"
              required
              disabled={models.length === 0}
            >
              <option value="">Выберите модель</option>
              {models.map(model => (
                <option key={model.idmodels} value={model.idmodels}>
                  {model.modelname}
                </option>
              ))}
            </select>
          </div>

          {/* Год выпуска */}
          <div>
            <label htmlFor="prodyear" className="block text-sm font-medium text-gray-700 mb-1">
              Год выпуска *
            </label>
            <Input
              id="prodyear"
              name="prodyear"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.prodyear}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Цена */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Цена (USD) *
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Пробег */}
          <div>
            <label htmlFor="milage" className="block text-sm font-medium text-gray-700 mb-1">
              Пробег (км) *
            </label>
            <Input
              id="milage"
              name="milage"
              type="number"
              min="0"
              value={formData.milage}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Объем двигателя */}
          <div>
            <label htmlFor="engvol" className="block text-sm font-medium text-gray-700 mb-1">
              Объем двигателя (л) *
            </label>
            <Input
              id="engvol"
              name="engvol"
              type="text"
              value={formData.engvol}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Тип двигателя */}
          <div>
            <label htmlFor="engtype" className="block text-sm font-medium text-gray-700 mb-1">
              Тип двигателя *
            </label>
            <select
              id="engtype"
              name="engtype"
              value={formData.engtype}
              onChange={handleInputChange}
              className="w-full border rounded-md h-10 px-3"
              required
            >
              <option value="">Выберите тип двигателя</option>
              {engineTypes.map(et => (
                <option key={et.idet} value={et.idet}>
                  {et.enginetype}
                </option>
              ))}
            </select>
          </div>

          {/* Тип кузова */}
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
              Тип кузова *
            </label>
            <select
              id="body"
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              className="w-full border rounded-md h-10 px-3"
              required
            >
              <option value="">Выберите тип кузова</option>
              {bodyTypes.map(bt => (
                <option key={bt.idbt} value={bt.idbt}>
                  {bt.bodytype}
                </option>
              ))}
            </select>
          </div>

          {/* Коробка передач */}
          <div>
            <label htmlFor="gearbox" className="block text-sm font-medium text-gray-700 mb-1">
              Коробка передач *
            </label>
            <select
              id="gearbox"
              name="gearbox"
              value={formData.gearbox}
              onChange={handleInputChange}
              className="w-full border rounded-md h-10 px-3"
              required
            >
              <option value="">Выберите КПП</option>
              {gearBoxes.map(gb => (
                <option key={gb.idgb} value={gb.idgb}>
                  {gb.gb}
                </option>
              ))}
            </select>
          </div>

          {/* Тип привода */}
          <div>
            <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-1">
              Привод *
            </label>
            <select
              id="transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleInputChange}
              className="w-full border rounded-md h-10 px-3"
              required
            >
              <option value="">Выберите тип привода</option>
              {driveTypes.map(dt => (
                <option key={dt.idtm} value={dt.idtm}>
                  {dt.drivetype}
                </option>
              ))}
            </select>
          </div>

          {/* Цвет */}
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Цвет *
            </label>
            <select
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="w-full border rounded-md h-10 px-3"
              required
            >
              <option value="">Выберите цвет</option>
              {colors.map(c => (
                <option key={c.idc} value={c.idc}>
                  {c.color}
                </option>
              ))}
            </select>
          </div>

          {/* URL изображения */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              URL изображения
            </label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="text"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/car-image.jpg"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="mr-2"
            onClick={() => router.push('/cars')}
            disabled={loading}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            className="bg-primary text-white"
            disabled={loading}
          >
            {loading ? 'Создание объявления...' : 'Создать объявление'}
          </Button>
        </div>
      </form>
    </div>
  );
}
