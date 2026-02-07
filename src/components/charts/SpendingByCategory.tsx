interface CategoryItem {
  name: string;
  percent: number;
  color: string;
}

const categories: CategoryItem[] = [
  { name: "Marketing", percent: 46, color: "hsl(0, 84%, 60%)" },
  { name: "Operations", percent: 18, color: "hsl(258, 90%, 66%)" },
  { name: "Payroll", percent: 9, color: "hsl(45, 90%, 55%)" },
  { name: "Software", percent: 11, color: "hsl(142, 76%, 50%)" },
  { name: "Technology", percent: 7, color: "hsl(217, 91%, 60%)" },
  { name: "Office Expenses", percent: 5, color: "hsl(330, 80%, 65%)" },
  { name: "Other", percent: 4, color: "hsl(200, 15%, 60%)" },
];

export function SpendingByCategory() {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border h-full flex flex-col">
      <div className="mb-1">
        <h3 className="font-semibold text-foreground">Spending by Category</h3>
        <p className="text-xs text-muted-foreground">Monthly expense distribution</p>
      </div>

      <div className="flex flex-col gap-2.5 mt-4 flex-1 justify-center">
        {categories.map((cat) => (
          <div key={cat.name} className="flex items-center gap-3">
            <span
              className="inline-block px-2.5 py-1 rounded-md text-xs font-medium text-white min-w-[90px] text-center"
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </span>
            <span className="text-sm text-muted-foreground ml-auto">{cat.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
