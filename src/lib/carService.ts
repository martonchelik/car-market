import { executeQuery } from './db';
import { CarListing, CarListingView, SearchFilters } from '@/types';
import * as mockDb from './mockDb';

// Flag to track if we should use mock data
let useMockData = false;

// Получить все автомобили с подробной информацией
export async function getAllCars(): Promise<CarListingView[]> {
  if (useMockData) {
    return mockDb.getAllCars();
  }

  try {
    const query = `
      SELECT a.idads, m.modelname, cb.carbrand, a.prodyear, a.engvol, a.price, a.milage,
             a.active, a.new, a.owner, et.enginetype, bt.bodytype,
             gb.gb, tm.drivetype, c.color
      FROM ads a
      JOIN models m ON a.model = m.idmodels
      JOIN carbrands cb ON m.modelbrand = cb.idcb
      JOIN enginetypes et ON a.engtype = et.idet
      JOIN bodytypes bt ON a.body = bt.idbt
      JOIN gearboxes gb ON a.gearbox = gb.idgb
      JOIN transmissions tm ON a.transmission = tm.idtm
      JOIN colors c ON a.color = c.idc
      WHERE a.active = 1
      ORDER BY a.idads DESC
    `;

    const result = await executeQuery(query) as CarListingView[];
    return result;
  } catch (error) {
    console.error("Database connection failed:", error);
    // Switch to mock data for this session
    useMockData = true;
    return mockDb.getAllCars();
  }
}

// Получить автомобиль по ID
export async function getCarById(id: number): Promise<CarListingView | null> {
  if (useMockData) {
    return mockDb.getCarById(id);
  }

  try {
    const query = `
      SELECT a.idads, m.modelname, cb.carbrand, a.prodyear, a.engvol, a.price, a.milage,
             a.active, a.new, a.owner, et.enginetype, bt.bodytype,
             gb.gb, tm.drivetype, c.color
      FROM ads a
      JOIN models m ON a.model = m.idmodels
      JOIN carbrands cb ON m.modelbrand = cb.idcb
      JOIN enginetypes et ON a.engtype = et.idet
      JOIN bodytypes bt ON a.body = bt.idbt
      JOIN gearboxes gb ON a.gearbox = gb.idgb
      JOIN transmissions tm ON a.transmission = tm.idtm
      JOIN colors c ON a.color = c.idc
      WHERE a.idads = ? AND a.active = 1
    `;

    const cars = await executeQuery(query, [id]) as CarListingView[];
    return cars.length > 0 ? cars[0] : null;
  } catch (error) {
    console.error("Database connection failed:", error);
    // Switch to mock data for this session
    useMockData = true;
    return mockDb.getCarById(id);
  }
}

// Получить автомобили по фильтрам
export async function getFilteredCars(filters: SearchFilters): Promise<CarListingView[]> {
  if (useMockData) {
    return mockDb.getFilteredCars(filters);
  }

  try {
    let queryParts = [
      `SELECT a.idads, m.modelname, cb.carbrand, a.prodyear, a.engvol, a.price, a.milage,
              a.active, a.new, a.owner, et.enginetype, bt.bodytype,
              gb.gb, tm.drivetype, c.color
       FROM ads a
       JOIN models m ON a.model = m.idmodels
       JOIN carbrands cb ON m.modelbrand = cb.idcb
       JOIN enginetypes et ON a.engtype = et.idet
       JOIN bodytypes bt ON a.body = bt.idbt
       JOIN gearboxes gb ON a.gearbox = gb.idgb
       JOIN transmissions tm ON a.transmission = tm.idtm
       JOIN colors c ON a.color = c.idc
       WHERE a.active = 1`
    ];

    const values: any[] = [];

    // Добавляем условия фильтрации
    if (filters.brand) {
      queryParts.push(`AND cb.idcb = ?`);
      values.push(filters.brand);
    }

    if (filters.model) {
      queryParts.push(`AND m.idmodels = ?`);
      values.push(filters.model);
    }

    if (filters.priceFrom) {
      queryParts.push(`AND a.price >= ?`);
      values.push(filters.priceFrom);
    }

    if (filters.priceTo) {
      queryParts.push(`AND a.price <= ?`);
      values.push(filters.priceTo);
    }

    if (filters.yearFrom) {
      queryParts.push(`AND a.prodyear >= ?`);
      values.push(filters.yearFrom);
    }

    if (filters.yearTo) {
      queryParts.push(`AND a.prodyear <= ?`);
      values.push(filters.yearTo);
    }

    if (filters.engineType) {
      queryParts.push(`AND a.engtype = ?`);
      values.push(filters.engineType);
    }

    if (filters.bodyType) {
      queryParts.push(`AND a.body = ?`);
      values.push(filters.bodyType);
    }

    if (filters.transmission) {
      queryParts.push(`AND a.gearbox = ?`);
      values.push(filters.transmission);
    }

    if (filters.driveType) {
      queryParts.push(`AND a.transmission = ?`);
      values.push(filters.driveType);
    }

    // Добавляем сортировку
    queryParts.push(`ORDER BY a.idads DESC`);

    // Собираем запрос
    const query = queryParts.join(' ');

    return executeQuery(query, values) as Promise<CarListingView[]>;
  } catch (error) {
    console.error("Database connection failed:", error);
    // Switch to mock data for this session
    useMockData = true;
    return mockDb.getFilteredCars(filters);
  }
}

// The rest of the functions remain the same
// Создать новое объявление
export async function createCar(car: CarListing): Promise<number> {
  const query = `
    INSERT INTO ads (model, prodyear, engvol, price, milage, active, new, owner, engtype, body, gearbox, transmission, color, made)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const result = await executeQuery(query, [
    car.model,
    car.prodyear,
    car.engvol,
    car.price,
    car.milage,
    car.active ? 1 : 0,
    car.new ? 1 : 0,
    car.owner,
    car.engtype,
    car.body,
    car.gearbox,
    car.transmission,
    car.color,
    car.made
  ]) as any;

  return result.insertId;
}

// Удалить объявление
export async function deleteCar(id: number): Promise<boolean> {
  const query = `UPDATE ads SET active = 0 WHERE idads = ?`;

  const result = await executeQuery(query, [id]) as any;
  return result.affectedRows > 0;
}

// Получить все автомобильные марки
export async function getAllCarBrands() {
  const query = `SELECT * FROM carbrands ORDER BY carbrand`;
  return executeQuery(query);
}

// Получить модели для указанной марки
export async function getModelsByBrand(brandId: number) {
  const query = `SELECT * FROM models WHERE modelbrand = ? ORDER BY modelname`;
  return executeQuery(query, [brandId]);
}

// Получить все типы двигателей
export async function getAllEngineTypes() {
  const query = `SELECT * FROM enginetypes ORDER BY enginetype`;
  return executeQuery(query);
}

// Получить все типы кузовов
export async function getAllBodyTypes() {
  const query = `SELECT * FROM bodytypes ORDER BY bodytype`;
  return executeQuery(query);
}

// Получить все типы трансмиссий
export async function getAllGearBoxes() {
  const query = `SELECT * FROM gearboxes ORDER BY gb`;
  return executeQuery(query);
}

// Получить все типы приводов
export async function getAllDriveTypes() {
  const query = `SELECT * FROM transmissions ORDER BY drivetype`;
  return executeQuery(query);
}

// Получить все цвета
export async function getAllColors() {
  const query = `SELECT * FROM colors ORDER BY color`;
  return executeQuery(query);
}
