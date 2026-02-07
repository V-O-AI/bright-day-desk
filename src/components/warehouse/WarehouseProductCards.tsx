import { MoreHorizontal } from "lucide-react";

interface ProductCard {
  name: string;
  price: string;
  quantity: number;
  properties: string[];
}

const mockProducts: ProductCard[] = [
  {
    name: "Товар",
    price: "9 999.99$",
    quantity: 1000,
    properties: ["Свойство", "Свойство", "Свойство"],
  },
  {
    name: "Товар",
    price: "9 999.99$",
    quantity: 1000,
    properties: ["Свойство", "Свойство", "Свойство"],
  },
  {
    name: "Товар",
    price: "9 999.99$",
    quantity: 1000,
    properties: ["Свойство", "Свойство", "Свойство"],
  },
];

export function WarehouseProductCards() {
  return (
    <div className="flex gap-4 overflow-x-auto">
      {mockProducts.map((product, idx) => (
        <div
          key={idx}
          className="min-w-[180px] flex-1 bg-card border border-border rounded-2xl p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-lg font-bold text-foreground">{product.name}</h4>
              <span className="text-xs text-muted-foreground font-medium">
                {product.quantity}
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground mb-4">{product.price}</p>
            <div className="space-y-1.5">
              {product.properties.map((prop, i) => (
                <p key={i} className="text-xs text-muted-foreground">
                  {prop}
                </p>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      ))}
    </div>
  );
}
