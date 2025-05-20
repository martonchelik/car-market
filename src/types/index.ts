// Интерфейс для объявления об автомобиле
export interface CarListing {
  idads?: number;
  model: string; // ID модели
  prodyear: number;
  engvol: number;
  price: number;
  milage: number;
  active: boolean;
  new: boolean;
  owner: number;
  engtype: number; // ID типа двигателя
  body: number; // ID типа кузова
  gearbox: number; // ID типа трансмиссии
  transmission: number; // ID типа привода
  color: number; // ID цвета
  made: number; // ID марки автомобиля
}

// Интерфейс для отображения данных автомобиля с названиями связанных полей
export interface CarListingView {
  idads: number;
  modelname: string;
  carbrand: string;
  prodyear: number;
  engvol: number;
  price: number;
  milage: number;
  active: boolean;
  new: boolean;
  owner: number;
  enginetype: string;
  bodytype: string;
  gb: string; // Тип коробки передач
  drivetype: string; // Тип привода
  color: string;
  date_added?: Date;
  imageUrl?: string;
}

// Интерфейс для пользователя
export interface User {
  idu?: number;
  name: string;
  email: string;
  phone: number;
  regdate: Date;
  acctype: string;
  password: string;
  foreignkey: string;
}

// Интерфейсы для справочников
export interface CarBrand {
  idcb: number;
  carbrand: string;
}

export interface Model {
  idmodels: number;
  modelbrand: number;
  modelname: string;
}

export interface BodyType {
  idbt: number;
  bodytype: string;
}

export interface EngineType {
  idet: number;
  enginetype: string;
}

export interface GearBox {
  idgb: number;
  gb: string;
}

export interface Transmission {
  idtm: number;
  drivetype: string;
}

export interface Color {
  idc: number;
  color: string;
}

// Тип для использования в формах фильтрации
export interface SearchFilters {
  brand?: number;
  model?: number;
  priceFrom?: number;
  priceTo?: number;
  yearFrom?: number;
  yearTo?: number;
  engineType?: number;
  bodyType?: number;
  gearbox?: number; // Коробка передач
  driveType?: number; // Тип привода
}
