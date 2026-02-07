const regions = [
  { name: "Москва", clients: 412, pct: 33 },
  { name: "Санкт-Петербург", clients: 198, pct: 16 },
  { name: "Новосибирск", clients: 124, pct: 10 },
  { name: "Екатеринбург", clients: 98, pct: 8 },
  { name: "Казань", clients: 87, pct: 7 },
  { name: "Другие", clients: 328, pct: 26 },
];

export function ClientGeographyChart() {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border h-full">
      <h3 className="font-semibold text-foreground mb-1">География клиентов</h3>
      <p className="text-[10px] text-muted-foreground mb-4">
        Распределение по регионам
      </p>

      <div className="space-y-3">
        {regions.map((r) => (
          <div key={r.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-foreground">{r.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{r.clients}</span>
                <span className="text-xs font-medium text-foreground w-8 text-right">
                  {r.pct}%
                </span>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${r.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
