import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Volume2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const VOICE_OPTIONS = [
  { id: "nova", name: "Nova", description: "Balanced, clear" },
  { id: "alloy", name: "Alloy", description: "Warm, friendly" },
  { id: "echo", name: "Echo", description: "Authoritative" },
  { id: "coral", name: "Coral", description: "Energetic" },
  { id: "verse", name: "Verse", description: "Professional" },
  { id: "flow", name: "Flow", description: "Smooth, calm" },
] as const;

interface VoiceSettingsProps {
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  onTestVoice: () => void;
  isTestingVoice: boolean;
}

export function VoiceSettings({
  selectedVoice,
  onVoiceChange,
  onTestVoice,
  isTestingVoice,
}: VoiceSettingsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Voice Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Select Voice</Label>
          <div className="space-y-2">
            {VOICE_OPTIONS.map((voice) => (
              <button
                key={voice.id}
                onClick={() => onVoiceChange(voice.id)}
                className={cn(
                  "w-full p-3 rounded-md border text-left transition-all hover-elevate",
                  selectedVoice === voice.id
                    ? "border-primary bg-primary/5"
                    : "border-border"
                )}
                data-testid={`voice-option-${voice.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{voice.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {voice.description}
                    </div>
                  </div>
                  {selectedVoice === voice.id && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={onTestVoice}
          variant="outline"
          className="w-full h-10"
          disabled={isTestingVoice}
          data-testid="button-test-voice"
        >
          {isTestingVoice ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Playing...
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 mr-2" />
              Test Voice
            </>
          )}
        </Button>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Voice samples are in Indonesian with natural pronunciation and
            emotion.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
