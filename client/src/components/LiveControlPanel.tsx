import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Square, Loader2, CheckCircle2, Radio, Moon } from "lucide-react";
import type { LiveStatus } from "@shared/schema";

interface LiveControlPanelProps {
  status: LiveStatus;
  onStartLive: (username: string) => void;
  onStopLive: () => void;
  isConnecting: boolean;
}

export function LiveControlPanel({ status, onStartLive, onStopLive, isConnecting }: LiveControlPanelProps) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onStartLive(username.trim());
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "online":
        return (
          <Badge className="bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border-green-500/20" data-testid="status-online">
            <CheckCircle2 className="w-3 h-3 mr-1.5" />
            Online
          </Badge>
        );
      case "reconnecting":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20" data-testid="status-reconnecting">
            <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
            Reconnecting
          </Badge>
        );
      case "connecting":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/20" data-testid="status-connecting">
            <Radio className="w-3 h-3 mr-1.5" />
            Connecting
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20" data-testid="status-error">
            Error
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted text-muted-foreground" data-testid="status-idle">
            <Moon className="w-3 h-3 mr-1.5" />
            Idle
          </Badge>
        );
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">TikTok Live Control</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              TikTok Username
            </Label>
            <Input
              id="username"
              data-testid="input-username"
              placeholder="@username or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={status === "online" || isConnecting}
              className="h-10"
            />
          </div>

          {status === "online" ? (
            <Button
              type="button"
              onClick={onStopLive}
              variant="destructive"
              className="w-full h-12"
              data-testid="button-stop-live"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Live
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full h-12"
              disabled={!username.trim() || isConnecting}
              data-testid="button-start-live"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Live
                </>
              )}
            </Button>
          )}
        </form>

        <div className="pt-4 border-t space-y-2">
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Status Info:</p>
            <ul className="space-y-0.5 ml-4 list-disc">
              <li>Enter TikTok username to connect</li>
              <li>AI will greet viewers automatically</li>
              <li>Chat responses in Indonesian</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
