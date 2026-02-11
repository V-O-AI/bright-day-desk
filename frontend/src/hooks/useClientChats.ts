import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ClientChat {
  id: string;
  client_name: string;
  client_type: string;
  last_message: string | null;
  is_online: boolean;
  unread_count: number;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useLatestClientChats(limit = 3) {
  return useQuery({
    queryKey: ["client-chats-latest", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_chats")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as ClientChat[];
    },
  });
}
