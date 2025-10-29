import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bot, Info } from "lucide-react";
import type { ChatLog as ChatLogType } from "@shared/schema";

interface ChatLogProps {
  logs: ChatLogType[];
}

export function ChatLog({ logs }: ChatLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getIcon = (type: ChatLogType["type"]) => {
    switch (type) {
      case "ai":
        return <Bot className="w-4 h-4 text-primary" />;
      case "user":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: ChatLogType["type"]) => {
    switch (type) {
      case "ai":
        return "AI Host";
      case "user":
        return "User";
      default:
        return "System";
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Live Chat & AI Responses</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-0">
        <ScrollArea className="h-full px-4 pb-4" ref={scrollRef}>
          <div className="space-y-3" data-testid="chat-log-container">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6">
                <MessageSquare className="w-12 h-12 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No messages yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Connect to a live stream to see chat messages
                </p>
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-card rounded-md border p-3 space-y-2 hover-elevate"
                  data-testid={`chat-message-${log.id}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {getIcon(log.type)}
                      <span className="font-medium text-sm truncate">
                        {log.username || getTypeLabel(log.type)}
                      </span>
                      {log.type === "ai" && (
                        <Badge variant="secondary" className="text-xs">
                          AI
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed break-words">
                    {log.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
