import { useState, useRef } from "react";
import { ChevronRight, ChevronLeft, Filter } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ProductProperty {
  label: string;
  value: string;
}

interface ProductCard {
  name: string;
  price: string;
  quantity: number;
  pages: ProductProperty[][]; // each page is a list of properties
}

const mockProducts: ProductCard[] = [
  {
    name: "Электроника A",
    price: "12 499.99$",
    quantity: 540,
    pages: [
      [{ label: "Цвет", value: "Чёрный" }, { label: "Вес", value: "1.2 кг" }, { label: "Гарантия", value: "12 мес" }],
      [{ label: "Бренд", value: "TechPro" }, { label: "Модель", value: "X-200" }, { label: "Страна", value: "Китай" }],
      [{ label: "Размер", value: "15x10x5 см" }, { label: "Материал", value: "Пластик" }, { label: "Сертификат", value: "ISO 9001" }],
    ],
  },
  {
    name: "Одежда B",
    price: "3 299.00$",
    quantity: 1200,
    pages: [
      [{ label: "Размер", value: "M-XL" }, { label: "Ткань", value: "Хлопок" }, { label: "Цвет", value: "Синий" }],
      [{ label: "Бренд", value: "StyleCo" }, { label: "Сезон", value: "Лето" }, { label: "Страна", value: "Турция" }],
    ],
  },
  {
    name: "Продукты C",
    price: "899.50$",
    quantity: 3200,
    pages: [
      [{ label: "Срок", value: "6 мес" }, { label: "Вес", value: "500 г" }, { label: "Тип", value: "Сухой" }],
      [{ label: "Бренд", value: "FoodMax" }, { label: "Калории", value: "350 ккал" }, { label: "Состав", value: "Натуральный" }],
      [{ label: "Упаковка", value: "Картон" }, { label: "Сертификат", value: "ГОСТ" }, { label: "Хранение", value: "+5°C" }],
    ],
  },
  {
    name: "Мебель D",
    price: "45 000.00$",
    quantity: 85,
    pages: [
      [{ label: "Материал", value: "Дерево" }, { label: "Цвет", value: "Орех" }, { label: "Вес", value: "25 кг" }],
      [{ label: "Размер", value: "120x60x75" }, { label: "Стиль", value: "Модерн" }, { label: "Гарантия", value: "24 мес" }],
    ],
  },
  {
    name: "Косметика E",
    price: "1 599.99$",
    quantity: 870,
    pages: [
      [{ label: "Объём", value: "100 мл" }, { label: "Тип", value: "Крем" }, { label: "SPF", value: "30" }],
      [{ label: "Бренд", value: "GlowUp" }, { label: "Срок", value: "18 мес" }, { label: "Страна", value: "Корея" }],
    ],
  },
  {
    name: "Инструменты F",
    price: "7 800.00$",
    quantity: 320,
    pages: [
      [{ label: "Тип", value: "Дрель" }, { label: "Мощность", value: "750W" }, { label: "Вес", value: "2.1 кг" }],
      [{ label: "Бренд", value: "PowerTool" }, { label: "Гарантия", value: "36 мес" }, { label: "Комплект", value: "12 бит" }],
    ],
  },
  {
    name: "Игрушки G",
    price: "2 150.00$",
    quantity: 1500,
    pages: [
      [{ label: "Возраст", value: "3+" }, { label: "Материал", value: "ABS" }, { label: "Тип", value: "Конструктор" }],
      [{ label: "Бренд", value: "KidFun" }, { label: "Деталей", value: "250 шт" }, { label: "Страна", value: "Дания" }],
      [{ label: "Размер", value: "30x20x10" }, { label: "Вес", value: "0.8 кг" }, { label: "Сертификат", value: "CE" }],
    ],
  },
  {
    name: "Бытовая техника H",
    price: "18 900.00$",
    quantity: 210,
    pages: [
      [{ label: "Тип", value: "Чайник" }, { label: "Объём", value: "1.7 л" }, { label: "Мощность", value: "2200W" }],
      [{ label: "Бренд", value: "HomePro" }, { label: "Цвет", value: "Серебро" }, { label: "Гарантия", value: "24 мес" }],
    ],
  },
];

const filterOptions = ["Все", "Электроника", "Одежда", "Продукты", "Мебель", "Косметика", "Инструменты"];

function ProductCardItem({ product }: { product: ProductCard }) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = product.pages.length;

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

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

        {/* Property page */}
        <div className="space-y-1.5 min-h-[60px]">
          {product.pages[currentPage].map((prop, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{prop.label}</span>
              <span className="text-foreground font-medium">{prop.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination: dots + arrow */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === currentPage ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        {totalPages > 1 && (
          <button
            onClick={nextPage}
            className="p-0.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function WarehouseProductCards() {
  const [activeFilter, setActiveFilter] = useState("Все");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 h-full flex flex-col">
      {/* Filter row */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground text-sm">Товары на складе</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              {activeFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {filterOptions.map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => setActiveFilter(opt)}
                className={activeFilter === opt ? "bg-muted" : ""}
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Scrollable cards with navigation arrows */}
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
          {mockProducts.map((product, idx) => (
            <ProductCardItem key={idx} product={product} />
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
