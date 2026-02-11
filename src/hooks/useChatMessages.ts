import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ChatMessage {
  id: string;
  content: string;
  sender_type: "user" | "ai";
  created_at: string;
}

const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_MS = 1000;

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const lastSentRef = useRef<number>(0);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to fetch messages");
      } else {
        setMessages((data as ChatMessage[]) || []);
      }
      setLoading(false);
    };

    fetchMessages();
  }, []);

  // Subscribe to realtime changes
  useEffect(() => {
    const channel = supabase
      .channel("chat_messages_realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Rate limiting
    const now = Date.now();
    if (now - lastSentRef.current < RATE_LIMIT_MS) {
      toast.error("Подождите перед отправкой следующего сообщения");
      return;
    }

    // Length validation
    if (content.length > MAX_MESSAGE_LENGTH) {
      toast.error(`Сообщение не должно превышать ${MAX_MESSAGE_LENGTH} символов`);
      return;
    }

    lastSentRef.current = now;

    const { error } = await supabase
      .from("chat_messages")
      .insert({ content: content.trim(), sender_type: "user" });

    if (error) {
      console.error("Failed to send message");
    }
  }, []);

  return { messages, loading, sendMessage };
}
