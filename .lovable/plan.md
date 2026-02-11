
## Цель
Создать **empty state** (состояние "нет данных") для компонентов `CashFlowChart` и `WarehousePieChart`, чтобы вы могли:
1. Скопировать этот код
2. Позже на бэкенде добавить логику переключения между "есть данные" / "нет данных"

---

## Где взять код после изменений

| Способ | Описание |
|--------|----------|
| **Code Editor** | Переключитесь в левом верхнем углу интерфейса на "Code" — увидите все файлы и сможете скопировать код |
| **GitHub** | Settings → Connectors → GitHub — синхронизация всего кода в ваш репозиторий |
| **Diff в чате** | После каждого моего изменения в блоке `<last-diff>` показаны точные изменения |

---

## Структура изменений

### 1. Обновить `CashFlowChart.tsx`
Добавить проп `isEmpty?: boolean` и показывать:
- **Если данные есть**: текущий график
- **Если данных нет**: минималистичный placeholder с иконкой и текстом "Нет данных для отображения"

### 2. Обновить `WarehousePieChart.tsx`
Аналогично добавить проп `isEmpty?: boolean`:
- **Если данные есть**: текущая круговая диаграмма
- **Если данных нет**: серый пустой круг с текстом "Нет данных"

### 3. Обновить `Index.tsx`
Добавить демо-переключатель (toggle), чтобы вы могли увидеть оба состояния и скопировать нужный код.

---

## Визуальный стиль empty state
- Минималистичный, в соответствии с общим стилем приложения
- Серый/muted цвет для пустого состояния
- Иконка (например, `BarChart3` или `PieChart`) в центре
- Текст "Нет данных для отображения"
- Анимация fade-in при появлении

---

## Технические детали

**CashFlowChart.tsx**:
```text
interface CashFlowChartProps {
  isEmpty?: boolean;
}

export function CashFlowChart({ isEmpty = false }: CashFlowChartProps) {
  if (isEmpty) {
    return (
      <div className="...empty-state-styles...">
        <BarChart3 icon />
        <span>Нет данных для отображения</span>
      </div>
    );
  }
  // существующий график
}
```

**WarehousePieChart.tsx**:
```text
interface WarehousePieChartProps {
  isEmpty?: boolean;
}

export function WarehousePieChart({ isEmpty = false }: WarehousePieChartProps) {
  if (isEmpty) {
    return (
      <div className="...empty-state-styles...">
        <PieChart icon />
        <span>Нет данных</span>
      </div>
    );
  }
  // существующая диаграмма
}
```

**Index.tsx** (демо):
```text
const [showEmptyState, setShowEmptyState] = useState(false);

// Toggle для демонстрации
<Switch checked={showEmptyState} onCheckedChange={setShowEmptyState} />

// Использование
<CashFlowChart isEmpty={showEmptyState} />
<WarehousePieChart isEmpty={showEmptyState} />
```

---

## После реализации

Вы сможете:
1. Открыть **Code Editor** в Lovable
2. Найти файлы `CashFlowChart.tsx` и `WarehousePieChart.tsx`
3. Скопировать весь код или только часть с empty state
4. Убрать демо-toggle из `Index.tsx`, когда добавите реальную логику с бэкенда
