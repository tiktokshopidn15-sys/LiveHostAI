import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Code, Sparkles } from "lucide-react";
import type { Config } from "@shared/schema";

const PLANS = [
  {
    name: "Daily",
    duration: "daily",
    tokens: 200000,
    price: 200000,
    features: [
      "200K AI tokens",
      "24 hours access",
      "Indonesian voice",
      "Basic support",
    ],
    recommended: false,
  },
  {
    name: "Weekly",
    duration: "weekly",
    tokens: 1000000,
    price: 1000000,
    features: [
      "1M AI tokens",
      "7 days access",
      "Indonesian voice",
      "Priority support",
      "Save 29%",
    ],
    recommended: true,
  },
  {
    name: "Monthly",
    duration: "monthly",
    tokens: 4000000,
    price: 4000000,
    features: [
      "4M AI tokens",
      "30 days access",
      "Indonesian voice",
      "Priority support",
      "Save 33%",
    ],
    recommended: false,
  },
] as const;

interface SubscriptionPanelProps {
  config: Config;
}

export function SubscriptionPanel({ config }: SubscriptionPanelProps) {
  const tokensRemaining = config.tokenLimit - config.tokensUsed;
  const percentUsed = Math.round((config.tokensUsed / config.tokenLimit) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Host Rental Plans</h3>
        <p className="text-sm text-muted-foreground">
          Choose a plan to activate AI host services with token-based usage.
        </p>
      </div>

      {config.developerMode && (
        <Alert className="border-primary/20 bg-primary/5" data-testid="developer-mode-alert">
          <Code className="w-4 h-4 text-primary" />
          <AlertDescription className="text-sm">
            <span className="font-medium">Developer Mode Active</span> - Unlimited tokens for testing
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Token Usage</span>
          <span className="text-sm text-muted-foreground" data-testid="text-tokens-remaining">
            {tokensRemaining.toLocaleString()} / {config.tokenLimit.toLocaleString()} remaining
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <Card
            key={plan.duration}
            className={plan.recommended ? "border-primary shadow-sm" : ""}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                {plan.recommended && (
                  <Badge className="bg-primary text-primary-foreground">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold">
                  Rp {(plan.price / 1000).toFixed(0)}k
                </div>
                <div className="text-sm text-muted-foreground">
                  {plan.tokens.toLocaleString()} tokens
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.recommended ? "default" : "outline"}
                data-testid={`button-subscribe-${plan.duration}`}
              >
                Subscribe
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          <strong>Note:</strong> In developer mode, tokens are not consumed. For production deployment,
          switch to a paid plan.
        </p>
      </div>
    </div>
  );
}
