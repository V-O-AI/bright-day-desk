import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Paperclip, Check, LogIn, KeyRound, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type Step = "auth" | "connect" | "loading" | "chat";

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingModal({ open, onOpenChange }: OnboardingModalProps) {
  const [step, setStep] = useState<Step>("auth");
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [apiKey, setApiKey] = useState("");
  const [progress, setProgress] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check if already authenticated
  useEffect(() => {
    if (open) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          setStep("connect");
        } else {
          setStep("auth");
        }
      });
    }
  }, [open]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  const handleAuth = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      if (authMode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      setStep("connect");
    } catch (e: any) {
      setAuthError(e.message || "Ошибка авторизации");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleStartLoading = () => {
    if (!apiKey.trim()) return;
    setStep("loading");
    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (progressRef.current) clearInterval(progressRef.current);
          setTimeout(() => setStep("chat"), 400);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after close animation
    setTimeout(() => {
      setStep("auth");
      setEmail("");
      setPassword("");
      setApiKey("");
      setProgress(0);
      setChatInput("");
      setAuthError("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className={cn(
            "h-2 w-2 rounded-full transition-colors",
            step === "auth" ? "bg-primary" : "bg-primary/30"
          )} />
          <div className={cn(
            "h-2 w-2 rounded-full transition-colors",
            step === "connect" || step === "loading" || step === "chat" ? "bg-primary" : "bg-primary/30"
          )} />
        </div>

        {/* STEP 1: Auth */}
        {step === "auth" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">
                {authMode === "register" ? "Регистрация" : "Вход"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-2">
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {authError && (
                <p className="text-xs text-destructive text-center">{authError}</p>
              )}
              <Button onClick={handleAuth} disabled={authLoading || !email || !password} className="w-full gap-2">
                <LogIn className="h-4 w-4" />
                {authMode === "register" ? "Зарегистрироваться" : "Войти"}
              </Button>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground text-center transition-colors"
                onClick={() => setAuthMode(authMode === "register" ? "login" : "register")}
              >
                {authMode === "register" ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
              </button>
            </div>
          </>
        )}

        {/* STEP 2: Connect data */}
        {step === "connect" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Подключите данные</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-2">
              {/* API key input */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  Введите API-ключ
                </label>
                <Input
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">или</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Attach table */}
              <button
                type="button"
                onClick={() => {
                  setApiKey("table-import");
                  handleStartLoading();
                }}
                className="flex items-center gap-3 rounded-xl border border-dashed border-border p-4 hover:border-primary/40 hover:bg-muted/50 transition-all group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Paperclip className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">Привязать таблицу с данными склада</span>
              </button>

              {apiKey.trim() && apiKey !== "table-import" && (
                <Button onClick={handleStartLoading} className="w-full gap-2">
                  <Check className="h-4 w-4" />
                  Подключить
                </Button>
              )}
            </div>
          </>
        )}

        {/* Loading */}
        {step === "loading" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <p className="text-sm font-medium">Загрузка данных...</p>
            <Progress value={progress} className="w-full h-2" />
            <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
          </div>
        )}

        {/* Chat */}
        {step === "chat" && (
          <div className="flex flex-col gap-3">
            <DialogHeader>
              <DialogTitle className="text-center text-base">Чат с сотрудниками</DialogTitle>
            </DialogHeader>

            {/* Chat area */}
            <div className="min-h-[180px] flex flex-col gap-3 overflow-y-auto">
              {/* AI header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-muted-foreground text-sm">👤</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">Менеджер Улетс</h4>
                  <p className="text-xs text-muted-foreground">Команда агента готова</p>
                </div>
              </div>

              {/* AI message */}
              <div className="flex gap-3">
                <div className="relative w-8 h-8 flex-shrink-0">
                  <div className="absolute left-0 top-0 w-5 h-5 rounded-md bg-muted border-2 border-background" style={{ zIndex: 2 }} />
                  <div className="absolute left-2 top-1 w-5 h-5 rounded-md bg-muted border-2 border-background" style={{ zIndex: 1 }} />
                </div>
                <div className="rounded-xl bg-muted/50 px-4 py-2.5 text-sm max-w-[85%]">
                  <p className="text-muted-foreground leading-relaxed">
                    Обнаружили 9 товаров которые 12 дней не продавались, давайте их обсудим
                  </p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="relative mt-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Напишите сообщение..."
                className="w-full bg-muted rounded-xl px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
              {chatInput.trim() && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
