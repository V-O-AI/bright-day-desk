// Shared mock data for warehouse sections

export interface Product {
  id: string;
  name: string;
  category: string;
  remaining: number;
  reserved: number;
  inTransit: number;
  daysLeft: number;
  salesPerDay: number;
  salesTrend: number; // % change
  riskScore: number; // 1-100
  price: number;
  lastSaleDate: string;
  warehouse: string;
  abcGroup: "A" | "B" | "C";
  turnoverDays: number;
  daysSinceLastSale: number;
  buyoutRate: number; // %
  profitability: number; // 0-100
  stockoutRisk: number; // 0-100
}

export const products: Product[] = [
  { id: "1", name: "Смартфон X200", category: "Электроника", remaining: 40, reserved: 25, inTransit: 50, daysLeft: 11, salesPerDay: 3.8, salesTrend: 12, riskScore: 72, price: 24999, lastSaleDate: "24.02.2026", warehouse: "Москва", abcGroup: "A", turnoverDays: 12, daysSinceLastSale: 0, buyoutRate: 92, profitability: 78, stockoutRisk: 65 },
  { id: "2", name: "Куртка зимняя", category: "Одежда", remaining: 21, reserved: 18, inTransit: 80, daysLeft: 5, salesPerDay: 4.0, salesTrend: -8, riskScore: 85, price: 8900, lastSaleDate: "23.02.2026", warehouse: "Москва", abcGroup: "A", turnoverDays: 8, daysSinceLastSale: 1, buyoutRate: 78, profitability: 65, stockoutRisk: 82 },
  { id: "3", name: "Набор посуды", category: "Дом и Кухня", remaining: 13, reserved: 6, inTransit: 20, daysLeft: 5, salesPerDay: 2.6, salesTrend: -15, riskScore: 91, price: 6300, lastSaleDate: "22.02.2026", warehouse: "Казань", abcGroup: "B", turnoverDays: 7, daysSinceLastSale: 2, buyoutRate: 85, profitability: 45, stockoutRisk: 88 },
  { id: "4", name: "Масляный фильтр", category: "Автозапчасти", remaining: 41, reserved: 23, inTransit: 30, daysLeft: 14, salesPerDay: 7.6, salesTrend: 5, riskScore: 45, price: 890, lastSaleDate: "24.02.2026", warehouse: "Москва", abcGroup: "A", turnoverDays: 6, daysSinceLastSale: 0, buyoutRate: 95, profitability: 82, stockoutRisk: 35 },
  { id: "5", name: "Крем для лица", category: "Красота", remaining: 165, reserved: 90, inTransit: 56, daysLeft: 30, salesPerDay: 3.6, salesTrend: -3, riskScore: 28, price: 2300, lastSaleDate: "24.02.2026", warehouse: "СПб", abcGroup: "B", turnoverDays: 20, daysSinceLastSale: 0, buyoutRate: 88, profitability: 55, stockoutRisk: 20 },
  { id: "6", name: "Наушники BT-500", category: "Электроника", remaining: 310, reserved: 15, inTransit: 0, daysLeft: 207, salesPerDay: 1.5, salesTrend: -22, riskScore: 12, price: 8150, lastSaleDate: "20.02.2026", warehouse: "Москва", abcGroup: "C", turnoverDays: 60, daysSinceLastSale: 4, buyoutRate: 65, profitability: 30, stockoutRisk: 5 },
  { id: "7", name: "Футболка базовая", category: "Одежда", remaining: 95, reserved: 40, inTransit: 100, daysLeft: 8, salesPerDay: 11.9, salesTrend: 18, riskScore: 62, price: 1299, lastSaleDate: "24.02.2026", warehouse: "Москва", abcGroup: "A", turnoverDays: 8, daysSinceLastSale: 0, buyoutRate: 94, profitability: 72, stockoutRisk: 55 },
  { id: "8", name: "Чайник электрический", category: "Дом и Кухня", remaining: 200, reserved: 5, inTransit: 0, daysLeft: 222, salesPerDay: 0.9, salesTrend: -30, riskScore: 8, price: 14400, lastSaleDate: "15.02.2026", warehouse: "Казань", abcGroup: "C", turnoverDays: 55, daysSinceLastSale: 9, buyoutRate: 55, profitability: 20, stockoutRisk: 3 },
  { id: "9", name: "Тормозные колодки", category: "Автозапчасти", remaining: 35, reserved: 25, inTransit: 36, daysLeft: 5, salesPerDay: 6.8, salesTrend: 10, riskScore: 88, price: 3800, lastSaleDate: "24.02.2026", warehouse: "Москва", abcGroup: "A", turnoverDays: 5, daysSinceLastSale: 0, buyoutRate: 91, profitability: 70, stockoutRisk: 85 },
  { id: "10", name: "Шампунь органик", category: "Красота", remaining: 78, reserved: 26, inTransit: 27, daysLeft: 26, salesPerDay: 8.1, salesTrend: 2, riskScore: 18, price: 2600, lastSaleDate: "24.02.2026", warehouse: "СПб", abcGroup: "B", turnoverDays: 10, daysSinceLastSale: 0, buyoutRate: 82, profitability: 48, stockoutRisk: 15 },
  { id: "11", name: "Роутер Wi-Fi 6", category: "Электроника", remaining: 12, reserved: 8, inTransit: 40, daysLeft: 3, salesPerDay: 4.0, salesTrend: 25, riskScore: 95, price: 5499, lastSaleDate: "24.02.2026", warehouse: "Москва", abcGroup: "B", turnoverDays: 3, daysSinceLastSale: 0, buyoutRate: 90, profitability: 60, stockoutRisk: 92 },
  { id: "12", name: "Джинсы классика", category: "Одежда", remaining: 370, reserved: 10, inTransit: 0, daysLeft: 231, salesPerDay: 1.6, salesTrend: -18, riskScore: 5, price: 2550, lastSaleDate: "18.02.2026", warehouse: "Казань", abcGroup: "C", turnoverDays: 50, daysSinceLastSale: 6, buyoutRate: 58, profitability: 25, stockoutRisk: 2 },
  { id: "13", name: "Сковорода антипригар", category: "Дом и Кухня", remaining: 55, reserved: 20, inTransit: 30, daysLeft: 14, salesPerDay: 3.9, salesTrend: 7, riskScore: 42, price: 2100, lastSaleDate: "23.02.2026", warehouse: "СПб", abcGroup: "B", turnoverDays: 14, daysSinceLastSale: 1, buyoutRate: 87, profitability: 52, stockoutRisk: 38 },
  { id: "14", name: "Свечи зажигания", category: "Автозапчасти", remaining: 580, reserved: 8, inTransit: 0, daysLeft: 341, salesPerDay: 1.7, salesTrend: -25, riskScore: 3, price: 4900, lastSaleDate: "12.02.2026", warehouse: "Москва", abcGroup: "C", turnoverDays: 70, daysSinceLastSale: 12, buyoutRate: 45, profitability: 15, stockoutRisk: 1 },
  { id: "15", name: "Маска для волос", category: "Красота", remaining: 25, reserved: 10, inTransit: 45, daysLeft: 6, salesPerDay: 4.2, salesTrend: 14, riskScore: 78, price: 1400, lastSaleDate: "24.02.2026", warehouse: "Москва", abcGroup: "B", turnoverDays: 6, daysSinceLastSale: 0, buyoutRate: 89, profitability: 58, stockoutRisk: 72 },
  { id: "16", name: "Гантели 10кг", category: "Спорт", remaining: 200, reserved: 12, inTransit: 0, daysLeft: 50, salesPerDay: 4.0, salesTrend: -5, riskScore: 15, price: 3200, lastSaleDate: "22.02.2026", warehouse: "Казань", abcGroup: "B", turnoverDays: 25, daysSinceLastSale: 2, buyoutRate: 80, profitability: 50, stockoutRisk: 10 },
  { id: "17", name: "Коврик для йоги", category: "Спорт", remaining: 320, reserved: 18, inTransit: 0, daysLeft: 80, salesPerDay: 4.0, salesTrend: 3, riskScore: 8, price: 1800, lastSaleDate: "23.02.2026", warehouse: "СПб", abcGroup: "C", turnoverDays: 40, daysSinceLastSale: 1, buyoutRate: 75, profitability: 35, stockoutRisk: 5 },
  { id: "18", name: "Кофе Арабика", category: "Продукты", remaining: 600, reserved: 50, inTransit: 200, daysLeft: 30, salesPerDay: 20.0, salesTrend: 8, riskScore: 25, price: 1800, lastSaleDate: "24.02.2026", warehouse: "Москва", abcGroup: "A", turnoverDays: 5, daysSinceLastSale: 0, buyoutRate: 96, profitability: 85, stockoutRisk: 18 },
  { id: "19", name: "Ежедневник A5", category: "Канцелярия", remaining: 900, reserved: 30, inTransit: 0, daysLeft: 90, salesPerDay: 10.0, salesTrend: -2, riskScore: 6, price: 890, lastSaleDate: "24.02.2026", warehouse: "Казань", abcGroup: "B", turnoverDays: 15, daysSinceLastSale: 0, buyoutRate: 88, profitability: 42, stockoutRisk: 4 },
  { id: "20", name: "Майка найк", category: "Одежда", remaining: 23, reserved: 12, inTransit: 50, daysLeft: 2, salesPerDay: 10.0, salesTrend: -12, riskScore: 96, price: 3500, lastSaleDate: "24.02.2026", warehouse: "Москва", abcGroup: "A", turnoverDays: 4, daysSinceLastSale: 0, buyoutRate: 78, profitability: 68, stockoutRisk: 95 },
];

export const warehouses = [
  { id: "msk", name: "Москва", deliveryDays: 3, stock: 740, salesPerDay: 72, inTransit: 230, forecast: -220, fillPercent: 39.1 },
  { id: "kzn", name: "Казань", deliveryDays: 21, stock: 1280, salesPerDay: 30, inTransit: 150, forecast: 750, fillPercent: 46.4 },
  { id: "spb", name: "Санкт-Петербург", deliveryDays: 7, stock: 790, salesPerDay: 31, inTransit: 90, forecast: -125, fillPercent: 33.4 },
];

export const inTransitOrders = [
  { id: "1", product: "Смартфон X200", quantity: 50, orderedDate: "18.02.2026", arrivalDate: "28.02.2026", warehouse: "Москва" },
  { id: "2", product: "Куртка зимняя", quantity: 80, orderedDate: "15.02.2026", arrivalDate: "05.03.2026", warehouse: "Москва" },
  { id: "3", product: "Набор посуды", quantity: 20, orderedDate: "20.02.2026", arrivalDate: "10.03.2026", warehouse: "Казань" },
  { id: "4", product: "Тормозные колодки", quantity: 36, orderedDate: "19.02.2026", arrivalDate: "01.03.2026", warehouse: "Москва" },
  { id: "5", product: "Маска для волос", quantity: 45, orderedDate: "17.02.2026", arrivalDate: "27.02.2026", warehouse: "Москва" },
  { id: "6", product: "Масляный фильтр", quantity: 30, orderedDate: "21.02.2026", arrivalDate: "03.03.2026", warehouse: "Москва" },
  { id: "7", product: "Футболка базовая", quantity: 100, orderedDate: "16.02.2026", arrivalDate: "26.02.2026", warehouse: "Москва" },
  { id: "8", product: "Роутер Wi-Fi 6", quantity: 40, orderedDate: "22.02.2026", arrivalDate: "04.03.2026", warehouse: "Москва" },
  { id: "9", product: "Майка найк", quantity: 50, orderedDate: "20.02.2026", arrivalDate: "25.02.2026", warehouse: "Москва" },
  { id: "10", product: "Кофе Арабика", quantity: 200, orderedDate: "14.02.2026", arrivalDate: "24.02.2026", warehouse: "Москва" },
];

export const orderHistory = [
  { id: "1", date: "10.02.2026", product: "Смартфон X200", quantity: 100, warehouse: "Москва", arrivedDate: "20.02.2026" },
  { id: "2", date: "05.02.2026", product: "Кофе Арабика", quantity: 500, warehouse: "Москва", arrivedDate: "12.02.2026" },
  { id: "3", date: "01.02.2026", product: "Футболка базовая", quantity: 200, warehouse: "Москва", arrivedDate: "08.02.2026" },
  { id: "4", date: "28.01.2026", product: "Крем для лица", quantity: 150, warehouse: "СПб", arrivedDate: "05.02.2026" },
  { id: "5", date: "25.01.2026", product: "Масляный фильтр", quantity: 300, warehouse: "Москва", arrivedDate: "01.02.2026" },
  { id: "6", date: "20.01.2026", product: "Куртка зимняя", quantity: 100, warehouse: "Москва", arrivedDate: "28.01.2026" },
  { id: "7", date: "15.01.2026", product: "Набор посуды", quantity: 50, warehouse: "Казань", arrivedDate: "25.01.2026" },
  { id: "8", date: "10.01.2026", product: "Гантели 10кг", quantity: 80, warehouse: "Казань", arrivedDate: "22.01.2026" },
];

export const salesVsStockMonthly = [
  { month: "Янв", sales: 210000, stock: 1800000 },
  { month: "Фев", sales: 280000, stock: 2100000 },
  { month: "Мар", sales: 270000, stock: 1900000 },
  { month: "Апр", sales: 320000, stock: 2800000 },
  { month: "Май", sales: 380000, stock: 3200000 },
  { month: "Июн", sales: 350000, stock: 3800000 },
  { month: "Июл", sales: 520000, stock: 5200000 },
  { month: "Авг", sales: 480000, stock: 5800000 },
  { month: "Сен", sales: 420000, stock: 5500000 },
  { month: "Окт", sales: 450000, stock: 5900000 },
  { month: "Ноя", sales: 380000, stock: 4800000 },
  { month: "Дек", sales: 300000, stock: 3500000 },
];

export const deadStockItems = [
  { name: "Свечи зажигания", quantity: 580, salesPerDay: 0.2, daysNoSale: 12 },
  { name: "Джинсы классика", quantity: 370, salesPerDay: 0.5, daysNoSale: 6 },
  { name: "Чайник электрич.", quantity: 200, salesPerDay: 0.3, daysNoSale: 9 },
  { name: "Наушники BT-500", quantity: 310, salesPerDay: 0.8, daysNoSale: 4 },
  { name: "Коврик для йоги", quantity: 320, salesPerDay: 1.2, daysNoSale: 1 },
  { name: "Ежедневник A5", quantity: 900, salesPerDay: 2.5, daysNoSale: 0 },
];
