const clients = [
  { name: "ООО «Альфа Трейд»", orders: 48, revenue: "₽2.4M", ltv: "₽4.8M", status: "VIP" },
  { name: "ИП Сергеев А.В.", orders: 36, revenue: "₽1.8M", ltv: "₽3.2M", status: "VIP" },
  { name: "ООО «БестПак»", orders: 29, revenue: "₽1.2M", ltv: "₽2.1M", status: "Постоянный" },
  { name: "ТД «Восток»", orders: 24, revenue: "₽980K", ltv: "₽1.7M", status: "Постоянный" },
  { name: "ООО «Логистик+»", orders: 21, revenue: "₽870K", ltv: "₽1.4M", status: "Постоянный" },
  { name: "ИП Козлова М.Н.", orders: 18, revenue: "₽640K", ltv: "₽1.1M", status: "Новый" },
  { name: "ООО «ПромСнаб»", orders: 15, revenue: "₽520K", ltv: "₽890K", status: "Новый" },
];

const statusColor: Record<string, string> = {
  VIP: "bg-amber-100 text-amber-700",
  "Постоянный": "bg-blue-50 text-blue-600",
  "Новый": "bg-emerald-50 text-emerald-600",
};

export function TopClientsTable() {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <h3 className="font-semibold text-foreground mb-1">Топ клиенты</h3>
      <p className="text-[10px] text-muted-foreground mb-4">
        По объёму заказов за период
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground text-xs border-b border-border">
              <th className="pb-3 font-medium">Клиент</th>
              <th className="pb-3 font-medium text-center">Заказы</th>
              <th className="pb-3 font-medium text-right">Выручка</th>
              <th className="pb-3 font-medium text-right">LTV</th>
              <th className="pb-3 font-medium text-center">Статус</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr
                key={c.name}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 font-medium text-foreground">{c.name}</td>
                <td className="py-3 text-center text-muted-foreground">{c.orders}</td>
                <td className="py-3 text-right text-foreground font-medium">{c.revenue}</td>
                <td className="py-3 text-right text-muted-foreground">{c.ltv}</td>
                <td className="py-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusColor[c.status]}`}
                  >
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
