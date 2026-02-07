import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      console.error("Error fetching profile:", error);
      return;
    }

    setProfile(data as UserProfile);
    setIsLoading(false);
  };

  const saveProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    const { error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", profile.id);

    if (error) {
      console.error("Error saving profile:", error);
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
