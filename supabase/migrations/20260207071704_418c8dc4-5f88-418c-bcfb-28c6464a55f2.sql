
-- Create updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table for financial metric cards
CREATE TABLE public.financial_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_key TEXT NOT NULL,
  label TEXT NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  change_percent NUMERIC,
  change_text TEXT,
  period TEXT NOT NULL DEFAULT 'month',
  trend_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.financial_metrics ENABLE ROW LEVEL SECURITY;

-- Public read access (aggregate business metrics)
CREATE POLICY "Financial metrics are viewable by everyone"
ON public.financial_metrics
FOR SELECT
USING (true);

-- Only service role can manage
CREATE POLICY "Service role can manage financial metrics"
ON public.financial_metrics
FOR ALL
USING (auth.role() = 'service_role');

-- Insert seed data
INSERT INTO public.financial_metrics (metric_key, label, value, change_percent, change_text, period, trend_data) VALUES
('total_revenue', 'Total Revenue', 2150.50, 5.2, NULL, 'day', '[10, 12, 11, 15, 14, 18, 20]'),
('subscriptions', 'Subscriptions', 12, 3.1, NULL, 'day', '[2, 3, 2, 4, 3, 5, 4]'),
('sales', 'Sales', 87, -2.5, NULL, 'day', '[15, 12, 14, 10, 11, 9, 8]'),
('active_now', 'Active Now', 573, NULL, '+201 since last hour', 'day', '[50, 55, 60, 58, 62, 65, 70]'),
('total_revenue', 'Total Revenue', 15420.30, 12.8, NULL, 'week', '[1200, 1400, 1300, 1600, 1500, 1800, 2000]'),
('subscriptions', 'Subscriptions', 89, 25.4, NULL, 'week', '[10, 12, 11, 15, 14, 18, 20]'),
('sales', 'Sales', 1542, 8.3, NULL, 'week', '[180, 200, 190, 220, 210, 250, 240]'),
('active_now', 'Active Now', 573, NULL, '+201 since last hour', 'week', '[400, 450, 420, 480, 460, 500, 520]'),
('total_revenue', 'Total Revenue', 45231.89, 20.1, NULL, 'month', '[3000, 3200, 3100, 3500, 3400, 3800, 4000]'),
('subscriptions', 'Subscriptions', 2350, 180.1, NULL, 'month', '[150, 180, 200, 250, 300, 350, 400]'),
('sales', 'Sales', 12234, -19, NULL, 'month', '[1800, 1700, 1600, 1500, 1400, 1350, 1300]'),
('active_now', 'Active Now', 573, NULL, '+201 since last hour', 'month', '[400, 450, 420, 480, 460, 500, 520]');

-- Create update trigger
CREATE TRIGGER update_financial_metrics_updated_at
BEFORE UPDATE ON public.financial_metrics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
