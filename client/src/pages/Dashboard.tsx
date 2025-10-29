import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveControlPanel } from "@/components/LiveControlPanel";
import { ChatLog } from "@/components/ChatLog";
import { VoiceSettings } from "@/components/VoiceSettings";
import { ProductShowcase } from "@/components/ProductShowcase";
import { SubscriptionPanel } from "@/components/SubscriptionPanel";
import type { ChatLog as ChatLogType, LiveStatus, Product, Config } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [status, setStatus] = useState<LiveStatus>("idle");
  const [isConnecting, setIsConnecting] = useState(false);
  const [chatLogs, setChatLogs] = useState<ChatLogType[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("nova");
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<Set<number>>(new Set());
  const [config, setConfig] = useState<Config>({
    developerMode: true,
    tokenLimit: 1000000,
    tokensUsed: 0,
    voice: "nova",
  });

  const { toast } = useToast();
  const eventSourceRef = useRef<EventSource | null>(null);
  const currentUsernameRef = useRef<string>("");

  // Play startup greeting on mount
  useEffect(() => {
    playStartupGreeting();
  }, []);

  const playStartupGreeting = async () => {
    try {
      const response = await fetch("/api/startup");
      if (!response.ok) throw new Error("Failed to load startup greeting");
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      await audio.play();
      
      addChatLog({
        type: "system",
        message: "Selamat datang kembali di live. Sistem host AI sudah aktif.",
      });
    } catch (error) {
      console.error("Startup greeting error:", error);
    }
  };

  const addChatLog = (log: Omit<ChatLogType, "id" | "timestamp">) => {
    setChatLogs((prev) => [
      ...prev,
      {
        ...log,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const playAudio = async (text: string, voice: string = selectedVoice) => {
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice }),
      });

      if (!response.ok) throw new Error("TTS failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error("Audio playback error:", error);
    }
  };

  const handleStartLive = async (username: string) => {
    setIsConnecting(true);
    currentUsernameRef.current = username;

    try {
      const response = await fetch("/api/live/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to start live");
      }

      setStatus("online");
      
      // Connect to SSE stream
      const eventSource = new EventSource("/api/live/stream");
      eventSourceRef.current = eventSource;

      eventSource.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "say") {
            addChatLog({ type: "ai", message: data.text });
            playAudio(data.text);
          } else if (data.type === "log") {
            if (data.text === "connected") {
              setStatus("online");
            } else if (data.text.includes("reconnect")) {
              setStatus("reconnecting");
            }
          } else if (data.type === "chat") {
            addChatLog({
              type: "user",
              username: data.username,
              message: data.message,
            });
          }
        } catch (error) {
          console.error("SSE parse error:", error);
        }
      });

      eventSource.onerror = () => {
        setStatus("error");
        toast({
          title: "Connection Error",
          description: "Lost connection to live stream",
          variant: "destructive",
        });
      };

      toast({
        title: "Live Connected",
        description: `Successfully connected to @${username}'s live stream`,
      });
    } catch (error) {
      console.error("Start live error:", error);
      setStatus("error");
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleStopLive = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setStatus("idle");
    addChatLog({ type: "system", message: "Live connection stopped" });
    toast({
      title: "Disconnected",
      description: "Live stream connection closed",
    });
  };

  const handleTestVoice = async () => {
    setIsTestingVoice(true);
    try {
      await playAudio(
        "Halo, ini adalah contoh suara AI host berbahasa Indonesia.",
        selectedVoice
      );
    } finally {
      setIsTestingVoice(false);
    }
  };

  const handleUpdateProduct = async (id: number, url: string) => {
    setLoadingProducts((prev) => new Set(prev).add(id));
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, url }),
      });

      if (!response.ok) throw new Error("Failed to add product");

      const product = await response.json();
      setProducts((prev) => {
        const filtered = prev.filter((p) => p.id !== id);
        return [...filtered, product].sort((a, b) => a.id - b.id);
      });

      toast({
        title: "Product Added",
        description: `Product ${id} has been added to the showcase`,
      });
    } catch (error) {
      console.error("Product update error:", error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setLoadingProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">TikTok Live AI Host</h1>
              <p className="text-xs text-muted-foreground">Indonesian Voice Assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Left Panel - Live Control */}
          <div className="lg:col-span-3">
            <LiveControlPanel
              status={status}
              onStartLive={handleStartLive}
              onStopLive={handleStopLive}
              isConnecting={isConnecting}
            />
          </div>

          {/* Center Panel - Chat Log */}
          <div className="lg:col-span-6 min-h-[500px]">
            <ChatLog logs={chatLogs} />
          </div>

          {/* Right Panel - Voice Settings */}
          <div className="lg:col-span-3">
            <VoiceSettings
              selectedVoice={selectedVoice}
              onVoiceChange={setSelectedVoice}
              onTestVoice={handleTestVoice}
              isTestingVoice={isTestingVoice}
            />
          </div>
        </div>

        {/* Bottom Tabs - Products & Subscription */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="products" data-testid="tab-products">
              Product Showcase
            </TabsTrigger>
            <TabsTrigger value="subscription" data-testid="tab-subscription">
              Subscription Plans
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="mt-6">
            <ProductShowcase
              products={products}
              onUpdateProduct={handleUpdateProduct}
              loadingProducts={loadingProducts}
            />
          </TabsContent>
          
          <TabsContent value="subscription" className="mt-6">
            <SubscriptionPanel config={config} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
