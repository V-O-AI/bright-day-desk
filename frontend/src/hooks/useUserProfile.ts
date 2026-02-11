import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone: string;
  email: string;
  city: string;
  avatar_url: string | null;
  created_at: string;
}

const profileSchema = z.object({
  first_name: z.string().max(50, "Имя не должно превышать 50 символов").optional(),
  last_name: z.string().max(50, "Фамилия не должна превышать 50 символов").optional(),
  email: z.string().email("Неверный формат email").max(255, "Email слишком длинный").optional().or(z.literal("")),
  phone: z.string().max(20, "Номер телефона слишком длинный").regex(/^$|^\+?[0-9\s\-()]+$/, "Неверный формат телефона").optional().or(z.literal("")),
  date_of_birth: z.string().max(10, "Неверный формат даты").regex(/^$|^\d{2}\/\d{2}\/\d{4}$/, "Формат даты: ДД/ММ/ГГГГ").optional().or(z.literal("")),
  city: z.string().max(100, "Название города слишком длинное").optional(),
  avatar_url: z.string().url().nullable().optional(),
});

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch profile");
      return;
    }

    setProfile(data as UserProfile);
    setIsLoading(false);
  };

  const saveProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    const result = profileSchema.safeParse(updates);
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || "Неверные данные";
      toast.error(firstError);
      return false;
    }

    const { error } = await supabase
      .from("user_profiles")
      .update(result.data)
      .eq("id", profile.id);

    if (error) {
      console.error("Failed to save profile");
      toast.error("Ошибка при сохранении данных");
      return false;
    }

    setProfile({ ...profile, ...updates });
    toast.success("Данные успешно сохранены");
    return true;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, isLoading, saveProfile, refetch: fetchProfile };
};
