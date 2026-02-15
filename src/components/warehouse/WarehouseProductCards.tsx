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
      { name: "Смартфон X-200", price: "12 499$", quantity: 120, properties: [{ label: "Цвет", value: "Чёрный" }, { label: "Вес", value: "180 г" }, { label: "Гарантия", value: "12 мес" }] },
      { name: "Наушники Pro", price: "3 200$", quantity: 85, properties: [{ label: "Тип", value: "Беспроводные" }, { label: "Бренд", value: "TechPro" }, { label: "Батарея", value: "30ч" }] },
      { name: "Планшет Z-10", price: "22 000$", quantity: 45, properties: [{ label: "Экран", value: "10.5\"" }, { label: "Память", value: "128 ГБ" }, { label: "Цвет", value: "Серый" }] },
      { name: "Зарядка Fast", price: "1 500$", quantity: 200, properties: [{ label: "Мощность", value: "65W" }, { label: "Тип", value: "USB-C" }, { label: "Бренд", value: "ChargePro" }] },
      { name: "Кабель USB-C", price: "350$", quantity: 90, properties: [{ label: "Длина", value: "1.5 м" }, { label: "Материал", value: "Нейлон" }, { label: "Скорость", value: "10 Гбит" }] },
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
      { name: "Футболка Classic", price: "1 200$", quantity: 350, properties: [{ label: "Размер", value: "M-XL" }, { label: "Ткань", value: "Хлопок" }, { label: "Цвет", value: "Белый" }] },
      { name: "Джинсы Slim", price: "4 500$", quantity: 180, properties: [{ label: "Размер", value: "30-36" }, { label: "Ткань", value: "Деним" }, { label: "Цвет", value: "Синий" }] },
      { name: "Куртка Зимняя", price: "8 900$", quantity: 95, properties: [{ label: "Размер", value: "S-XXL" }, { label: "Утеплитель", value: "Пух" }, { label: "Бренд", value: "StyleCo" }] },
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
      { name: "Рис Басмати", price: "450$", quantity: 800, properties: [{ label: "Вес", value: "1 кг" }, { label: "Срок", value: "12 мес" }, { label: "Тип", value: "Длиннозёрный" }] },
      { name: "Масло оливковое", price: "1 200$", quantity: 320, properties: [{ label: "Объём", value: "500 мл" }, { label: "Тип", value: "Extra Virgin" }, { label: "Страна", value: "Италия" }] },
      { name: "Мука пшеничная", price: "280$", quantity: 600, properties: [{ label: "Вес", value: "2 кг" }, { label: "Сорт", value: "Высший" }, { label: "Срок", value: "9 мес" }] },
      { name: "Чай зелёный", price: "650$", quantity: 450, properties: [{ label: "Вес", value: "100 г" }, { label: "Тип", value: "Листовой" }, { label: "Страна", value: "Китай" }] },
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
      { name: "Стол офисный", price: "25 000$", quantity: 30, properties: [{ label: "Материал", value: "Дерево" }, { label: "Размер", value: "120x60" }, { label: "Цвет", value: "Орех" }] },
      { name: "Кресло Premium", price: "18 000$", quantity: 25, properties: [{ label: "Материал", value: "Кожа" }, { label: "Нагрузка", value: "120 кг" }, { label: "Цвет", value: "Чёрный" }] },
      { name: "Шкаф книжный", price: "35 000$", quantity: 15, properties: [{ label: "Полок", value: "5 шт" }, { label: "Высота", value: "180 см" }, { label: "Стиль", value: "Классика" }] },
      { name: "Тумба прикроватная", price: "8 500$", quantity: 15, properties: [{ label: "Ящиков", value: "2 шт" }, { label: "Материал", value: "МДФ" }, { label: "Цвет", value: "Белый" }] },
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
      { name: "Крем увлажняющий", price: "1 800$", quantity: 220, properties: [{ label: "Объём", value: "50 мл" }, { label: "SPF", value: "30" }, { label: "Тип кожи", value: "Все" }] },
      { name: "Сыворотка Витамин С", price: "2 400$", quantity: 150, properties: [{ label: "Объём", value: "30 мл" }, { label: "Концентрация", value: "15%" }, { label: "Бренд", value: "GlowUp" }] },
      { name: "Маска для лица", price: "950$", quantity: 300, properties: [{ label: "Тип", value: "Тканевая" }, { label: "Эффект", value: "Питание" }, { label: "Страна", value: "Корея" }] },
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
      { name: "Дрель ударная", price: "5 500$", quantity: 80, properties: [{ label: "Мощность", value: "750W" }, { label: "Вес", value: "2.1 кг" }, { label: "Обороты", value: "3000" }] },
      { name: "Шуруповёрт Li-Ion", price: "4 200$", quantity: 110, properties: [{ label: "Мощность", value: "18V" }, { label: "Момент", value: "45 Нм" }, { label: "Батарея", value: "2 Ач" }] },
      { name: "Набор бит 32шт", price: "1 200$", quantity: 130, properties: [{ label: "Тип", value: "PH/PZ/TX" }, { label: "Материал", value: "Cr-V" }, { label: "Кейс", value: "Да" }] },
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
      { name: "Конструктор 250 дет.", price: "2 800$", quantity: 400, properties: [{ label: "Возраст", value: "3+" }, { label: "Материал", value: "ABS" }, { label: "Бренд", value: "KidFun" }] },
      { name: "Машинка р/у", price: "1 500$", quantity: 250, properties: [{ label: "Масштаб", value: "1:18" }, { label: "Батарея", value: "Li-Po" }, { label: "Скорость", value: "15 км/ч" }] },
      { name: "Кукла Принцесса", price: "1 200$", quantity: 350, properties: [{ label: "Высота", value: "30 см" }, { label: "Материал", value: "Винил" }, { label: "Возраст", value: "5+" }] },
      { name: "Пазл 1000 шт.", price: "900$", quantity: 500, properties: [{ label: "Размер", value: "50x70 см" }, { label: "Тема", value: "Природа" }, { label: "Возраст", value: "8+" }] },
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
      { name: "Чайник электрический", price: "3 500$", quantity: 70, properties: [{ label: "Объём", value: "1.7 л" }, { label: "Мощность", value: "2200W" }, { label: "Цвет", value: "Серебро" }] },
      { name: "Блендер Pro", price: "5 800$", quantity: 45, properties: [{ label: "Мощность", value: "1200W" }, { label: "Объём", value: "1.5 л" }, { label: "Скорости", value: "5" }] },
      { name: "Утюг Steam", price: "4 200$", quantity: 55, properties: [{ label: "Мощность", value: "2400W" }, { label: "Пар", value: "45 г/мин" }, { label: "Подошва", value: "Керамика" }] },
      { name: "Мультиварка", price: "7 900$", quantity: 40, properties: [{ label: "Объём", value: "5 л" }, { label: "Программ", value: "12" }, { label: "Бренд", value: "HomePro" }] },
    ],
  },
];

function CategoryCardItem({ category, onClick }: { category: CategoryCard; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="min-w-[185px] max-w-[185px] flex-shrink-0 bg-card border border-border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer group"
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
  return (
    <div className="min-w-[185px] max-w-[185px] flex-shrink-0 bg-card border border-border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5">
      <div>
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-sm font-bold text-foreground leading-tight">{product.name}</h4>
          <span className="text-[10px] text-muted-foreground font-medium ml-1 whitespace-nowrap">
            {product.quantity} шт
          </span>
        </div>
        <p className="text-sm font-semibold text-foreground mb-3">{product.price}</p>
        <div className="space-y-1.5">
          {product.properties.map((prop, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{prop.label}</span>
              <span className="text-foreground font-medium">{prop.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WarehouseProductCards() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryCard | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 h-full flex flex-col">
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
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 backdrop-blur-sm border border-border rounded-full p-1 shadow-md text-muted-foreground hover:text-foreground transition-colors opacity-0 hover:opacity-100 focus:opacity-100"
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
