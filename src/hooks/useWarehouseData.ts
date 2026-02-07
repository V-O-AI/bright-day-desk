import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WarehouseCategory {
  id: string;
  name: string;
  percentage: number;
  color: string;
}

export interface WarehouseProduct {
  id: string;
  category_id: string;
  name: string;
  percentage: number;
  color: string;
}

export function useWarehouseCategories() {
  return useQuery({
    queryKey: ["warehouse-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_categories")
        .select("*")
        .order("percentage", { ascending: false });
      if (error) throw error;
      return data as WarehouseCategory[];
    },
  });
}

export function useWarehouseProducts(categoryId: string | null) {
  return useQuery({
    queryKey: ["warehouse-products", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const { data, error } = await supabase
        .from("warehouse_products")
        .select("*")
        .eq("category_id", categoryId)
        .order("percentage", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data as WarehouseProduct[];
    },
    enabled: !!categoryId,
  });
}
