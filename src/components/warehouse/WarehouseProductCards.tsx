import { useState, useRef } from "react";
import { ChevronRight, ChevronLeft, ArrowLeft, Package, Layers } from "lucide-react";

interface ProductProperty {
  label: string;
  value: string;
}

interface ProductCard {
  name: string;
  price: string;
  quantity: number;
  pages: ProductProperty[][];
}

interface CategoryData {
  name: string;
  icon: React.ReactNode;
  totalProducts: number;
  totalQuantity: number;
  avgCheck: string;
  topProduct: string;
  turnover: string;
  products: ProductCard[];
}

const categories: CategoryData[] = [
  {
    name: "Электроника",
    icon: <Package className="h-4 w-4" />,
    totalProducts: 3,
    totalQuantity: 770,
    avgCheck: "12 880$",
    topProduct: "Смартфон X200",
    turnover: "18 дн.",
    products: [
      {
        name: "Смартфон X200",
        price: "24 999$",
        quantity: 155,
        pages: [
          [{ label: "Цвет", value: "Чёрный" }, { label: "Память", value: "128 ГБ" }, { label: "Гарантия", value: "12 мес" }],
          [{ label: "Бренд", value: "TechPro" }, { label: "Вес", value: "185 г" }, { label: "Страна", value: "Китай" }],
        ],
      },
      {
        name: "Роутер Wi-Fi 6",
        price: "5 499$",
        quantity: 60,
        pages: [
          [{ label: "Стандарт", value: "Wi-Fi 6" }, { label: "Порты", value: "4 LAN" }, { label: "Скорость", value: "1200 Мбит" }],
        ],
      },
      {
        name: "Наушники BT-500",
        price: "8 150$",
        quantity: 555,
        pages: [
          [{ label: "Тип", value: "Накладные" }, { label: "Батарея", value: "30 ч" }, { label: "Вес", value: "250 г" }],
          [{ label: "Бренд", value: "SoundMax" }, { label: "Bluetooth", value: "5.3" }, { label: "ANC", value: "Да" }],
        ],
      },
    ],
  },
  {
    name: "Одежда",
    icon: <Package className="h-4 w-4" />,
    totalProducts: 3,
    totalQuantity: 1985,
    avgCheck: "4 250$",
    topProduct: "Футболка базовая",
    turnover: "12 дн.",
    products: [
      {
        name: "Футболка базовая",
        price: "1 299$",
        quantity: 705,
        pages: [
          [{ label: "Размер", value: "S-XXL" }, { label: "Ткань", value: "100% хлопок" }, { label: "Цвет", value: "5 цветов" }],
        ],
      },
      {
        name: "Куртка зимняя",
        price: "8 900$",
        quantity: 380,
        pages: [
          [{ label: "Утеплитель", value: "Пух" }, { label: "Температура", value: "-25°C" }, { label: "Размер", value: "M-XL" }],
          [{ label: "Бренд", value: "StyleCo" }, { label: "Сезон", value: "Зима" }, { label: "Страна", value: "Турция" }],
        ],
      },
      {
        name: "Джинсы классика",
        price: "2 550$",
        quantity: 900,
        pages: [
          [{ label: "Размер", value: "28-36" }, { label: "Цвет", value: "Синий" }, { label: "Ткань", value: "Деним" }],
        ],
      },
    ],
  },
  {
    name: "Дом и Кухня",
    icon: <Package className="h-4 w-4" />,
    totalProducts: 3,
    totalQuantity: 427,
    avgCheck: "7 600$",
    topProduct: "Сковорода антипригар",
    turnover: "22 дн.",
    products: [
      {
        name: "Набор посуды",
        price: "6 300$",
        quantity: 132,
        pages: [
          [{ label: "Материал", value: "Нерж. сталь" }, { label: "Предметов", value: "12" }, { label: "Бренд", value: "HomePro" }],
        ],
      },
      {
        name: "Сковорода антипригар",
        price: "2 100$",
        quantity: 245,
        pages: [
          [{ label: "Диаметр", value: "28 см" }, { label: "Покрытие", value: "Титан" }, { label: "Ручка", value: "Съёмная" }],
        ],
      },
      {
        name: "Чайник электрический",
        price: "14 400$",
        quantity: 50,
        pages: [
          [{ label: "Объём", value: "1.7 л" }, { label: "Мощность", value: "2200W" }, { label: "Цвет", value: "Серебро" }],
        ],
      },
    ],
  },
  {
    name: "Автозапчасти",
    icon: <Package className="h-4 w-4" />,
    totalProducts: 3,
    totalQuantity: 1350,
    avgCheck: "3 200$",
    topProduct: "Масляный фильтр",
    turnover: "35 дн.",
    products: [
      {
        name: "Тормозные колодки",
        price: "3 800$",
        quantity: 570,
        pages: [
          [{ label: "Тип", value: "Дисковые" }, { label: "Ось", value: "Передняя" }, { label: "Бренд", value: "BrakePro" }],
        ],
      },
      {
        name: "Масляный фильтр",
        price: "890$",
        quantity: 660,
        pages: [
          [{ label: "Совместимость", value: "Универсал" }, { label: "Тип", value: "Масляный" }, { label: "Срок", value: "10000 км" }],
        ],
      },
      {
        name: "Свечи зажигания",
        price: "4 900$",
        quantity: 120,
        pages: [
          [{ label: "Тип", value: "Иридиевые" }, { label: "Комплект", value: "4 шт" }, { label: "Бренд", value: "SparkMax" }],
        ],
      },
    ],
  },
  {
    name: "Красота",
    icon: <Package className="h-4 w-4" />,
    totalProducts: 3,
    totalQuantity: 470,
    avgCheck: "2 100$",
    topProduct: "Крем для лица",
    turnover: "15 дн.",
    products: [
      {
        name: "Крем для лица",
        price: "2 300$",
        quantity: 225,
        pages: [
          [{ label: "Объём", value: "50 мл" }, { label: "SPF", value: "30" }, { label: "Тип кожи", value: "Все типы" }],
        ],
      },
      {
        name: "Маска для волос",
        price: "1 400$",
        quantity: 175,
        pages: [
          [{ label: "Объём", value: "200 мл" }, { label: "Тип", value: "Восстановление" }, { label: "Бренд", value: "GlowUp" }],
        ],
      },
      {
        name: "Шампунь органик",
        price: "2 600$",
        quantity: 70,
        pages: [
          [{ label: "Объём", value: "300 мл" }, { label: "Тип", value: "Для всех" }, { label: "Состав", value: "Натуральный" }],
        ],
      },
    ],
  },
];

function ProductCardItem({ product }: { product: ProductCard }) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = product.pages.length;

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);

  return (
    <div className="min-w-[185px] max-w-[185px] flex-shrink-0 bg-card border border-border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 group">
      <div>
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-sm font-bold text-foreground leading-tight">{product.name}</h4>
          <span className="text-[10px] text-muted-foreground font-medium ml-1 whitespace-nowrap">
            {product.quantity} шт
          </span>
        </div>
        <p className="text-sm font-semibold text-foreground mb-3">{product.price}</p>
        <div className="space-y-1.5 min-h-[60px]">
          {product.pages[currentPage].map((prop, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{prop.label}</span>
              <span className="text-foreground font-medium">{prop.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentPage ? "bg-primary" : "bg-muted-foreground/30"}`}
            />
          ))}
        </div>
        {totalPages > 1 && (
          <button onClick={nextPage} className="p-0.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function CategoryCard({ category, onClick }: { category: CategoryData; onClick: () => void }) {
  return (
    <div
      className="min-w-[185px] max-w-[185px] flex-shrink-0 bg-card border border-border rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5"
      onClick={onClick}
    >
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Layers className="h-3.5 w-3.5" />
          </div>
          <h4 className="text-sm font-bold text-foreground leading-tight">{category.name}</h4>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Видов товаров</span>
            <span className="text-foreground font-medium">{category.totalProducts}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Общее кол-во</span>
            <span className="text-foreground font-medium">{category.totalQuantity} шт</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Средний чек</span>
            <span className="text-foreground font-medium">{category.avgCheck}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Топ товар</span>
            <span className="text-foreground font-medium truncate max-w-[80px]">{category.topProduct}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Оборот</span>
            <span className="text-foreground font-medium">{category.turnover}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end mt-4 text-muted-foreground">
        <ChevronRight className="h-4 w-4" />
      </div>
    </div>
  );
}

export function WarehouseProductCards() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });

  return (
    <div className="bg-card border border-border rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
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

      <div className="relative flex-1 min-h-0">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 backdrop-blur-sm border border-border rounded-full p-1 shadow-md text-muted-foreground hover:text-foreground transition-colors opacity-0 hover:opacity-100 focus:opacity-100"
          style={{ marginLeft: "-6px" }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin" style={{ scrollbarWidth: "thin" }}>
          {selectedCategory
            ? selectedCategory.products.map((product, idx) => (
                <ProductCardItem key={idx} product={product} />
              ))
            : categories.map((cat, idx) => (
                <CategoryCard key={idx} category={cat} onClick={() => setSelectedCategory(cat)} />
              ))
          }
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
