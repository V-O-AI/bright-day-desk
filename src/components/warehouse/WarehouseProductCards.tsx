import { useState, useRef } from "react";
import { ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";

interface ProductProperty {
  label: string;
  value: string;
}

interface ProductItem {
  name: string;
  price: string;
  quantity: number;
  properties: ProductProperty[];
}

interface CategoryCard {
  name: string;
  totalProducts: number;
  totalQuantity: number;
  topParams: ProductProperty[];
  products: ProductItem[];
}

const mockCategories: CategoryCard[] = [
  {
    name: "Электроника",
    totalProducts: 12,
    totalQuantity: 540,
    topParams: [
      { label: "Популярный", value: "Смартфон" },
      { label: "Ср. цена", value: "12 500$" },
      { label: "Оборот", value: "Высокий" },
    ],
    products: [
      { name: "Смартфон X-200", price: "12 499$", quantity: 120, properties: [{ label: "Цвет", value: "Чёрный" }, { label: "Вес", value: "180 г" }, { label: "Гарантия", value: "12 мес" }, { label: "Память", value: "128 ГБ" }, { label: "Экран", value: "6.1\"" }, { label: "Батарея", value: "4500 мАч" }, { label: "Камера", value: "48 МП" }, { label: "ОС", value: "Android 14" }] },
      { name: "Наушники Pro", price: "3 200$", quantity: 85, properties: [{ label: "Тип", value: "Беспроводные" }, { label: "Бренд", value: "TechPro" }, { label: "Батарея", value: "30ч" }, { label: "Шумоподавление", value: "Да" }, { label: "Вес", value: "250 г" }, { label: "Bluetooth", value: "5.3" }] },
      { name: "Планшет Z-10", price: "22 000$", quantity: 45, properties: [{ label: "Экран", value: "10.5\"" }, { label: "Память", value: "128 ГБ" }, { label: "Цвет", value: "Серый" }, { label: "ОЗУ", value: "8 ГБ" }, { label: "Вес", value: "480 г" }, { label: "Камера", value: "12 МП" }] },
      { name: "Зарядка Fast", price: "1 500$", quantity: 200, properties: [{ label: "Мощность", value: "65W" }, { label: "Тип", value: "USB-C" }, { label: "Бренд", value: "ChargePro" }, { label: "Длина кабеля", value: "1 м" }, { label: "Цвет", value: "Белый" }] },
      { name: "Кабель USB-C", price: "350$", quantity: 90, properties: [{ label: "Длина", value: "1.5 м" }, { label: "Материал", value: "Нейлон" }, { label: "Скорость", value: "10 Гбит" }, { label: "Цвет", value: "Чёрный" }, { label: "Совместимость", value: "Универсал" }] },
      { name: "Powerbank 20000", price: "2 800$", quantity: 65, properties: [{ label: "Ёмкость", value: "20000 мАч" }, { label: "Выход", value: "USB-C/A" }, { label: "Вес", value: "350 г" }, { label: "Быстрая зарядка", value: "Да" }, { label: "Бренд", value: "EnergyMax" }] },
      { name: "Колонка BT Mini", price: "1 800$", quantity: 110, properties: [{ label: "Мощность", value: "10W" }, { label: "Защита", value: "IPX7" }, { label: "Батарея", value: "12ч" }, { label: "Вес", value: "320 г" }, { label: "Bluetooth", value: "5.0" }] },
    ],
  },
  {
    name: "Одежда",
    totalProducts: 18,
    totalQuantity: 1200,
    topParams: [
      { label: "Популярный", value: "Футболка" },
      { label: "Ср. цена", value: "3 300$" },
      { label: "Сезон", value: "Лето" },
    ],
    products: [
      { name: "Футболка Classic", price: "1 200$", quantity: 350, properties: [{ label: "Размер", value: "M-XL" }, { label: "Ткань", value: "Хлопок" }, { label: "Цвет", value: "Белый" }, { label: "Страна", value: "Турция" }, { label: "Плотность", value: "180 г/м²" }, { label: "Сезон", value: "Лето" }] },
      { name: "Джинсы Slim", price: "4 500$", quantity: 180, properties: [{ label: "Размер", value: "30-36" }, { label: "Ткань", value: "Деним" }, { label: "Цвет", value: "Синий" }, { label: "Стрейч", value: "2%" }, { label: "Плотность", value: "340 г/м²" }] },
      { name: "Куртка Зимняя", price: "8 900$", quantity: 95, properties: [{ label: "Размер", value: "S-XXL" }, { label: "Утеплитель", value: "Пух" }, { label: "Бренд", value: "StyleCo" }, { label: "Водостойкость", value: "5000 мм" }, { label: "Температура", value: "-25°C" }] },
      { name: "Худи Oversize", price: "3 200$", quantity: 200, properties: [{ label: "Размер", value: "S-XXL" }, { label: "Ткань", value: "Флис" }, { label: "Цвет", value: "Серый" }, { label: "Капюшон", value: "Да" }, { label: "Плотность", value: "320 г/м²" }] },
      { name: "Шорты Sport", price: "1 800$", quantity: 160, properties: [{ label: "Размер", value: "S-XL" }, { label: "Ткань", value: "Полиэстер" }, { label: "Карманы", value: "2 шт" }, { label: "Сезон", value: "Лето" }] },
      { name: "Рубашка Office", price: "2 900$", quantity: 130, properties: [{ label: "Размер", value: "M-XXL" }, { label: "Ткань", value: "Хлопок" }, { label: "Цвет", value: "Голубой" }, { label: "Стиль", value: "Классика" }, { label: "Манжеты", value: "На пуговицах" }] },
    ],
  },
  {
    name: "Продукты",
    totalProducts: 25,
    totalQuantity: 3200,
    topParams: [
      { label: "Популярный", value: "Крупа" },
      { label: "Ср. цена", value: "900$" },
      { label: "Срок", value: "6 мес" },
    ],
    products: [
      { name: "Рис Басмати", price: "450$", quantity: 800, properties: [{ label: "Вес", value: "1 кг" }, { label: "Срок", value: "12 мес" }, { label: "Тип", value: "Длиннозёрный" }, { label: "Страна", value: "Индия" }, { label: "Калории", value: "350 ккал" }] },
      { name: "Масло оливковое", price: "1 200$", quantity: 320, properties: [{ label: "Объём", value: "500 мл" }, { label: "Тип", value: "Extra Virgin" }, { label: "Страна", value: "Италия" }, { label: "Кислотность", value: "0.3%" }] },
      { name: "Мука пшеничная", price: "280$", quantity: 600, properties: [{ label: "Вес", value: "2 кг" }, { label: "Сорт", value: "Высший" }, { label: "Срок", value: "9 мес" }, { label: "Белок", value: "10.3 г" }] },
      { name: "Чай зелёный", price: "650$", quantity: 450, properties: [{ label: "Вес", value: "100 г" }, { label: "Тип", value: "Листовой" }, { label: "Страна", value: "Китай" }, { label: "Урожай", value: "2025" }] },
      { name: "Мёд цветочный", price: "890$", quantity: 220, properties: [{ label: "Объём", value: "500 мл" }, { label: "Тип", value: "Натуральный" }, { label: "Регион", value: "Алтай" }, { label: "Срок", value: "24 мес" }] },
      { name: "Кофе арабика", price: "1 400$", quantity: 280, properties: [{ label: "Вес", value: "250 г" }, { label: "Обжарка", value: "Средняя" }, { label: "Страна", value: "Колумбия" }, { label: "Помол", value: "Зерно" }] },
    ],
  },
  {
    name: "Мебель",
    totalProducts: 8,
    totalQuantity: 85,
    topParams: [
      { label: "Популярный", value: "Стол" },
      { label: "Ср. цена", value: "45 000$" },
      { label: "Стиль", value: "Модерн" },
    ],
    products: [
      { name: "Стол офисный", price: "25 000$", quantity: 30, properties: [{ label: "Материал", value: "Дерево" }, { label: "Размер", value: "120x60" }, { label: "Цвет", value: "Орех" }, { label: "Нагрузка", value: "80 кг" }, { label: "Сборка", value: "Требуется" }] },
      { name: "Кресло Premium", price: "18 000$", quantity: 25, properties: [{ label: "Материал", value: "Кожа" }, { label: "Нагрузка", value: "120 кг" }, { label: "Цвет", value: "Чёрный" }, { label: "Колёса", value: "5 шт" }, { label: "Подлокотники", value: "Да" }] },
      { name: "Шкаф книжный", price: "35 000$", quantity: 15, properties: [{ label: "Полок", value: "5 шт" }, { label: "Высота", value: "180 см" }, { label: "Стиль", value: "Классика" }, { label: "Материал", value: "ЛДСП" }] },
      { name: "Тумба прикроватная", price: "8 500$", quantity: 15, properties: [{ label: "Ящиков", value: "2 шт" }, { label: "Материал", value: "МДФ" }, { label: "Цвет", value: "Белый" }, { label: "Размер", value: "45x40" }] },
      { name: "Диван угловой", price: "75 000$", quantity: 8, properties: [{ label: "Материал", value: "Велюр" }, { label: "Спальное место", value: "200x140" }, { label: "Механизм", value: "Дельфин" }, { label: "Ящик", value: "Да" }, { label: "Цвет", value: "Бежевый" }] },
    ],
  },
  {
    name: "Косметика",
    totalProducts: 15,
    totalQuantity: 870,
    topParams: [
      { label: "Популярный", value: "Крем" },
      { label: "Ср. цена", value: "1 600$" },
      { label: "Тип", value: "Уход" },
    ],
    products: [
      { name: "Крем увлажняющий", price: "1 800$", quantity: 220, properties: [{ label: "Объём", value: "50 мл" }, { label: "SPF", value: "30" }, { label: "Тип кожи", value: "Все" }, { label: "Бренд", value: "DermaCare" }, { label: "Состав", value: "Гиалурон" }, { label: "Срок", value: "18 мес" }] },
      { name: "Сыворотка Витамин С", price: "2 400$", quantity: 150, properties: [{ label: "Объём", value: "30 мл" }, { label: "Концентрация", value: "15%" }, { label: "Бренд", value: "GlowUp" }, { label: "Эффект", value: "Сияние" }, { label: "Применение", value: "Утро" }] },
      { name: "Маска для лица", price: "950$", quantity: 300, properties: [{ label: "Тип", value: "Тканевая" }, { label: "Эффект", value: "Питание" }, { label: "Страна", value: "Корея" }, { label: "Время", value: "15 мин" }] },
      { name: "Шампунь безсульфатный", price: "1 200$", quantity: 180, properties: [{ label: "Объём", value: "400 мл" }, { label: "Тип волос", value: "Все" }, { label: "Бренд", value: "NaturHair" }, { label: "Эффект", value: "Объём" }] },
      { name: "Гель для душа", price: "680$", quantity: 250, properties: [{ label: "Объём", value: "500 мл" }, { label: "Аромат", value: "Цитрус" }, { label: "pH", value: "5.5" }, { label: "Бренд", value: "FreshSkin" }] },
    ],
  },
  {
    name: "Инструменты",
    totalProducts: 10,
    totalQuantity: 320,
    topParams: [
      { label: "Популярный", value: "Дрель" },
      { label: "Ср. цена", value: "7 800$" },
      { label: "Бренд", value: "PowerTool" },
    ],
    products: [
      { name: "Дрель ударная", price: "5 500$", quantity: 80, properties: [{ label: "Мощность", value: "750W" }, { label: "Вес", value: "2.1 кг" }, { label: "Обороты", value: "3000" }, { label: "Патрон", value: "13 мм" }, { label: "Реверс", value: "Да" }] },
      { name: "Шуруповёрт Li-Ion", price: "4 200$", quantity: 110, properties: [{ label: "Мощность", value: "18V" }, { label: "Момент", value: "45 Нм" }, { label: "Батарея", value: "2 Ач" }, { label: "Вес", value: "1.4 кг" }, { label: "Скорости", value: "2" }] },
      { name: "Набор бит 32шт", price: "1 200$", quantity: 130, properties: [{ label: "Тип", value: "PH/PZ/TX" }, { label: "Материал", value: "Cr-V" }, { label: "Кейс", value: "Да" }, { label: "Магнит", value: "Да" }] },
      { name: "Болгарка 125мм", price: "3 800$", quantity: 55, properties: [{ label: "Мощность", value: "1100W" }, { label: "Диск", value: "125 мм" }, { label: "Обороты", value: "11000" }, { label: "Вес", value: "2.3 кг" }] },
      { name: "Лазерный уровень", price: "6 500$", quantity: 35, properties: [{ label: "Точность", value: "0.2 мм/м" }, { label: "Дальность", value: "30 м" }, { label: "Линии", value: "2" }, { label: "Батарея", value: "AA x3" }] },
    ],
  },
  {
    name: "Игрушки",
    totalProducts: 14,
    totalQuantity: 1500,
    topParams: [
      { label: "Популярный", value: "Конструктор" },
      { label: "Ср. цена", value: "2 150$" },
      { label: "Возраст", value: "3+" },
    ],
    products: [
      { name: "Конструктор 250 дет.", price: "2 800$", quantity: 400, properties: [{ label: "Возраст", value: "3+" }, { label: "Материал", value: "ABS" }, { label: "Бренд", value: "KidFun" }, { label: "Тема", value: "Город" }, { label: "Фигурок", value: "4 шт" }] },
      { name: "Машинка р/у", price: "1 500$", quantity: 250, properties: [{ label: "Масштаб", value: "1:18" }, { label: "Батарея", value: "Li-Po" }, { label: "Скорость", value: "15 км/ч" }, { label: "Пульт", value: "2.4 ГГц" }] },
      { name: "Кукла Принцесса", price: "1 200$", quantity: 350, properties: [{ label: "Высота", value: "30 см" }, { label: "Материал", value: "Винил" }, { label: "Возраст", value: "5+" }, { label: "Аксессуары", value: "3 шт" }] },
      { name: "Пазл 1000 шт.", price: "900$", quantity: 500, properties: [{ label: "Размер", value: "50x70 см" }, { label: "Тема", value: "Природа" }, { label: "Возраст", value: "8+" }, { label: "Материал", value: "Картон" }] },
      { name: "Мягкая игрушка Мишка", price: "750$", quantity: 320, properties: [{ label: "Высота", value: "40 см" }, { label: "Материал", value: "Плюш" }, { label: "Наполнитель", value: "Синтепон" }, { label: "Возраст", value: "0+" }] },
      { name: "Настольная игра", price: "1 600$", quantity: 180, properties: [{ label: "Игроков", value: "2-6" }, { label: "Время", value: "30-60 мин" }, { label: "Возраст", value: "6+" }, { label: "Тема", value: "Стратегия" }] },
    ],
  },
  {
    name: "Бытовая техника",
    totalProducts: 9,
    totalQuantity: 210,
    topParams: [
      { label: "Популярный", value: "Чайник" },
      { label: "Ср. цена", value: "18 900$" },
      { label: "Гарантия", value: "24 мес" },
    ],
    products: [
      { name: "Чайник электрический", price: "3 500$", quantity: 70, properties: [{ label: "Объём", value: "1.7 л" }, { label: "Мощность", value: "2200W" }, { label: "Цвет", value: "Серебро" }, { label: "Материал", value: "Сталь" }, { label: "Автоотключение", value: "Да" }] },
      { name: "Блендер Pro", price: "5 800$", quantity: 45, properties: [{ label: "Мощность", value: "1200W" }, { label: "Объём", value: "1.5 л" }, { label: "Скорости", value: "5" }, { label: "Ножи", value: "6 лезвий" }, { label: "Материал", value: "Стекло" }] },
      { name: "Утюг Steam", price: "4 200$", quantity: 55, properties: [{ label: "Мощность", value: "2400W" }, { label: "Пар", value: "45 г/мин" }, { label: "Подошва", value: "Керамика" }, { label: "Шнур", value: "2.5 м" }] },
      { name: "Мультиварка", price: "7 900$", quantity: 40, properties: [{ label: "Объём", value: "5 л" }, { label: "Программ", value: "12" }, { label: "Бренд", value: "HomePro" }, { label: "Таймер", value: "24ч" }, { label: "Покрытие", value: "Антипригар" }] },
      { name: "Пылесос робот", price: "15 000$", quantity: 25, properties: [{ label: "Мощность", value: "2500 Па" }, { label: "Батарея", value: "5200 мАч" }, { label: "Время работы", value: "180 мин" }, { label: "Навигация", value: "LiDAR" }, { label: "Влажная уборка", value: "Да" }] },
    ],
  },
  {
    name: "Автозапчасти",
    totalProducts: 11,
    totalQuantity: 450,
    topParams: [
      { label: "Популярный", value: "Фильтр" },
      { label: "Ср. цена", value: "3 200$" },
      { label: "Тип", value: "Расходники" },
    ],
    products: [
      { name: "Масляный фильтр", price: "450$", quantity: 200, properties: [{ label: "Совместимость", value: "VAG" }, { label: "Тип", value: "Сменный" }, { label: "Бренд", value: "FilterPro" }, { label: "Срок", value: "15000 км" }] },
      { name: "Тормозные колодки", price: "2 800$", quantity: 90, properties: [{ label: "Ось", value: "Передняя" }, { label: "Материал", value: "Керамика" }, { label: "Бренд", value: "BrakeTech" }, { label: "Ресурс", value: "40000 км" }] },
      { name: "Свечи зажигания", price: "1 200$", quantity: 160, properties: [{ label: "Тип", value: "Иридиевые" }, { label: "Комплект", value: "4 шт" }, { label: "Зазор", value: "0.8 мм" }, { label: "Бренд", value: "SparkMax" }] },
    ],
  },
  {
    name: "Спорттовары",
    totalProducts: 13,
    totalQuantity: 680,
    topParams: [
      { label: "Популярный", value: "Гантели" },
      { label: "Ср. цена", value: "5 400$" },
      { label: "Тип", value: "Фитнес" },
    ],
    products: [
      { name: "Гантели 10 кг", price: "3 500$", quantity: 120, properties: [{ label: "Вес", value: "10 кг" }, { label: "Материал", value: "Чугун" }, { label: "Покрытие", value: "Неопрен" }, { label: "Пара", value: "2 шт" }] },
      { name: "Коврик для йоги", price: "1 200$", quantity: 200, properties: [{ label: "Размер", value: "183x61" }, { label: "Толщина", value: "6 мм" }, { label: "Материал", value: "TPE" }, { label: "Цвет", value: "Фиолетовый" }] },
      { name: "Скакалка скоростная", price: "800$", quantity: 180, properties: [{ label: "Длина", value: "3 м" }, { label: "Материал", value: "Сталь/ПВХ" }, { label: "Подшипник", value: "Да" }] },
      { name: "Фитнес-браслет", price: "4 500$", quantity: 95, properties: [{ label: "Экран", value: "AMOLED" }, { label: "Батарея", value: "14 дней" }, { label: "Водозащита", value: "5 ATM" }, { label: "Датчики", value: "SpO2/HR" }, { label: "GPS", value: "Да" }] },
      { name: "Эспандер набор", price: "1 800$", quantity: 85, properties: [{ label: "Нагрузка", value: "5-30 кг" }, { label: "Штук", value: "5" }, { label: "Материал", value: "Латекс" }] },
    ],
  },
];

const VISIBLE_PROPS = 3;

function CategoryCardItem({ category, onClick }: { category: CategoryCard; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="w-[180px] min-w-[180px] flex-shrink-0 bg-card border border-border rounded-2xl p-3 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer group"
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-sm font-bold text-foreground leading-tight">{category.name}</h4>
        </div>
        <div className="flex justify-between text-xs mb-3">
          <span className="text-muted-foreground">Товаров</span>
          <span className="text-foreground font-medium">{category.totalProducts}</span>
        </div>
        <div className="flex justify-between text-xs mb-3">
          <span className="text-muted-foreground">Общее кол-во</span>
          <span className="text-foreground font-medium">{category.totalQuantity} шт</span>
        </div>
        <div className="space-y-1.5">
          {category.topParams.map((p, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{p.label}</span>
              <span className="text-foreground font-medium">{p.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCardItem({ product }: { product: ProductItem }) {
  const [propPage, setPropPage] = useState(0);
  const totalPages = Math.ceil(product.properties.length / VISIBLE_PROPS);
  const visibleProps = product.properties.slice(propPage * VISIBLE_PROPS, (propPage + 1) * VISIBLE_PROPS);

  return (
    <div className="w-[180px] min-w-[180px] flex-shrink-0 bg-card border border-border rounded-2xl p-3 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5">
      <div>
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-sm font-bold text-foreground leading-tight">{product.name}</h4>
          <span className="text-[10px] text-muted-foreground font-medium ml-1 whitespace-nowrap">
            {product.quantity} шт
          </span>
        </div>
        <p className="text-sm font-semibold text-foreground mb-3">{product.price}</p>
        <div className="space-y-1.5 min-h-[60px]">
          {visibleProps.map((prop, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{prop.label}</span>
              <span className="text-foreground font-medium">{prop.value}</span>
            </div>
          ))}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
          <button
            onClick={(e) => { e.stopPropagation(); setPropPage(p => Math.max(0, p - 1)); }}
            disabled={propPage === 0}
            className="p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-[10px] text-muted-foreground">{propPage + 1}/{totalPages}</span>
          <button
            onClick={(e) => { e.stopPropagation(); setPropPage(p => Math.min(totalPages - 1, p + 1)); }}
            disabled={propPage === totalPages - 1}
            className="p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export function WarehouseProductCards() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryCard | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 220, behavior: "smooth" });
  };

  const scrollLeftFn = () => {
    scrollRef.current?.scrollBy({ left: -220, behavior: "smooth" });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <h3 className="font-semibold text-foreground text-sm">
            {selectedCategory ? selectedCategory.name : "Товары на складе"}
          </h3>
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        <button
          onClick={scrollLeftFn}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 backdrop-blur-sm border border-border rounded-full p-1 shadow-md text-muted-foreground hover:text-foreground transition-colors"
          style={{ marginLeft: "-6px" }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin"
          style={{ scrollbarWidth: "thin" }}
        >
          {selectedCategory
            ? selectedCategory.products.map((product, idx) => (
                <ProductCardItem key={idx} product={product} />
              ))
            : mockCategories.map((cat, idx) => (
                <CategoryCardItem key={idx} category={cat} onClick={() => setSelectedCategory(cat)} />
              ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 backdrop-blur-sm border border-border rounded-full p-1 shadow-md text-muted-foreground hover:text-foreground transition-colors"
          style={{ marginRight: "-6px" }}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
