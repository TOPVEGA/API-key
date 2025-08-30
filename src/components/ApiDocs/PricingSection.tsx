"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Info, Check, Star, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";


async function fetchUsdtRate(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=inr"
    );
    const data = await res.json();
    return data.tether.inr; // INR per USDT
  } catch (err) {
    console.error("Failed to fetch USDT rate", err);
    return null;
  }
}


const PRICING_RULES = [
  { maxMonthly: 15_000, rate: 0.0013 },
  { maxMonthly: 30_000, rate: 0.0011 },
  { maxMonthly: 50_000, rate: 0.0010 },
  { maxMonthly: 90_000, rate: 0.0009 },
  { maxMonthly: 150_000, rate: 0.0008 },
  { maxMonthly: 1_000_000, rate: 0.0007 },
  { maxMonthly: 10_000_000, rate: 0.0006 },
  { maxMonthly: 30_000_000, rate: 0.0005 },
] as const;


const MIN_MONTHLY_PRICE = 49;

type PricingTier = {
  name: string;
  daily: number;
  monthly: number;
  monthlyPrice?: number;
  perRequest?: number;
  features?: string[];
  popular?: boolean;
};

function generateFixedTiers(rules: typeof PRICING_RULES): PricingTier[] {
  const desiredDailySteps = [
    1000, 3000, 5000, 10000, 15000, 25000,
    50000, 100000, 200000, 500000, 1_000_000
  ];

  const tiers: PricingTier[] = [];

  for (let i = 0; i < desiredDailySteps.length; i++) {
    const daily = desiredDailySteps[i];
    const monthly = daily * 30;
    const monthlyPrice = calcDynamicMonthlyPrice(monthly);

    tiers.push({
      name: [
        "Starter", "Basic", "Growth", "Pro", "Advanced",
        "Scale", "Business", "Enterprise", "Ultimate", "Elite", "Titan"
      ][i] || `Tier ${i + 1}`,
      daily,
      monthly,
      monthlyPrice,
      perRequest: monthlyPrice / monthly,
      features: [
        `${(monthly / 1000).toLocaleString()}k requests/month`,
        "Core features included", "Support All Platform's"
      ],
      popular: i === 2, // mark "Growth" as popular
    });
  }

  // Custom plan for anything above
  tiers.push({
    name: "Custom",
    daily: 2_000_000 / 30,
    monthly: 2_000_000,
  });

  return tiers;
}


const FIXED_TIERS: PricingTier[] = generateFixedTiers(PRICING_RULES);

function calcDynamicMonthlyPrice(monthlyRequests: number): number {
  for (const rule of PRICING_RULES) {
    if (monthlyRequests <= rule.maxMonthly) {
      return Math.max(
        MIN_MONTHLY_PRICE,
        Math.round(monthlyRequests * rule.rate)
      );
    }
  }
  return 0;
}

function calcAnnual(monthlyPrice: number): number {
  return monthlyPrice * 12 * 0.85;
}

function findRecommendedFixedTier(
  monthlyRequests: number
): PricingTier | null {
  return FIXED_TIERS.find((tier) => monthlyRequests <= tier.monthly) || null;
}

function inrToUsdt(priceInInr: number, inrPerUsdt: number | null): string {
  if (!inrPerUsdt) return "—";
  return (priceInInr / inrPerUsdt).toFixed(2);
}


export default function PricingSection() {
  const [dailyRequests, setDailyRequests] = useState<number>(1000);
  const [usdtRate, setUsdtRate] = useState<number | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );

  const monthlyRequests = dailyRequests * 30;
  const dynamicMonthlyPrice = calcDynamicMonthlyPrice(monthlyRequests);
  const dynamicAnnualPrice = calcAnnual(dynamicMonthlyPrice);
  const recommendedTier = findRecommendedFixedTier(monthlyRequests);

  // fetch USDT rate once
  useEffect(() => {
    fetchUsdtRate().then(setUsdtRate);
  }, []);

  const handleRedirect = () => {
    window.open("https://t.me/AshokShau", "_blank");
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Flexible Pricing Plans</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose a plan that fits your needs. Scale seamlessly as your usage
          grows. All plans include our core features.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center justify-center p-1 bg-muted rounded-lg mt-6">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === "monthly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingPeriod("annual")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === "annual"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annual Billing
            <Badge
              variant="secondary"
              className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            >
              Save 15%
            </Badge>
          </button>
        </div>
      </div>

      {/* Request Volume Input */}
      <div className="max-w-2xl mx-auto mb-12 bg-muted/40 rounded-xl p-6">
        <Label className="text-lg font-medium mb-4 block">
          Estimate Your Costs
        </Label>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label
                htmlFor="daily"
                className="text-sm text-muted-foreground mb-2 block"
              >
                Daily Requests
              </Label>
              <Input
                id="daily"
                type="number"
                min={0}
                step={500}
                value={dailyRequests}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || 0;
                  setDailyRequests(Math.max(0, value));
                }}
                onBlur={(e) => {
                  const value = parseInt(e.target.value, 10) || 0;
                  setDailyRequests(Math.max(500, Math.round(value / 500) * 500));
                }}
                className="w-full"
              />
            </div>
            <div>
              <Label
                htmlFor="monthly"
                className="text-sm text-muted-foreground mb-2 block"
              >
                Monthly Requests
              </Label>
              <Input
                id="monthly"
                type="number"
                min={0}
                step={15000}
                value={monthlyRequests}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || 0;
                  setDailyRequests(Math.max(0, Math.floor(value / 30)));
                }}
                onBlur={(e) => {
                  const value = parseInt(e.target.value, 10) || 0;
                  const daily = Math.max(500, Math.round((value / 30) / 500) * 500);
                  setDailyRequests(daily);
                }}
                className="w-full"
              />
            </div>
          </div>

          <div className="pt-2">
            <Slider
              value={[dailyRequests]}
              min={500}
              max={50000}
              step={500}
              onValueChange={([value]) =>
                setDailyRequests(Math.max(500, value))
              }
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>500/day</span>
              <span>50,000/day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="fixed" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="fixed">Fixed Plans</TabsTrigger>
          <TabsTrigger value="custom">Custom Plan</TabsTrigger>
        </TabsList>

        {/* Fixed Plans */}
        <TabsContent value="fixed" className="mt-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {FIXED_TIERS.map((tier) => {
              const price =
                billingPeriod === "annual" && tier.monthlyPrice
                  ? calcAnnual(tier.monthlyPrice)
                  : tier.monthlyPrice;

              const isPopular = tier.popular;

              return (
                <Card
                  key={tier.name}
                  className={`relative flex flex-col h-full transition-all hover:shadow-md ${
                    isPopular
                      ? "border-primary shadow-lg ring-1 ring-primary"
                      : "border-border"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1 flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-xl">
                      {tier.name}
                      {isPopular && (
                        <Zap className="h-5 w-5 text-yellow-500" />
                      )}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 pb-4">
                    {tier.monthlyPrice !== undefined ? (
                      <>
                        <p className="text-3xl font-bold">
                          ₹
                          {billingPeriod === "annual"
                            ? Math.round(price || 0)
                            : price}
                          <span className="text-base font-normal text-muted-foreground">
                            /{billingPeriod === "annual" ? "year" : "mo"}
                          </span>
                        </p>

                        {billingPeriod === "annual" &&
                          tier.monthlyPrice > 0 && (
                            <p className="text-sm text-muted-foreground mt-1">
                              ₹{tier.monthlyPrice}/mo billed annually
                            </p>
                          )}

                        <p className="text-sm text-muted-foreground mt-2">
                          ≈ ${inrToUsdt(tier.monthlyPrice || 0, usdtRate)} USDT
                        </p>

                        <p className="text-sm mt-4 font-medium">
                          {tier.daily.toLocaleString()} daily requests
                        </p>

                        {tier.perRequest !== undefined &&
                          tier.monthlyPrice > 0 && (
                            <p className="text-xs text-muted-foreground mt-2">
                              ≈ ₹{tier.perRequest.toFixed(4)} per request
                            </p>
                          )}

                        {tier.features && (
                          <ul className="mt-4 space-y-2">
                            {tier.features.map((feature, i) => (
                              <li
                                key={i}
                                className="flex items-start text-sm"
                              >
                                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium mt-2">
                          Contact us for pricing
                        </p>
                        {tier.features && (
                          <ul className="mt-4 space-y-2">
                            {tier.features.map((feature, i) => (
                              <li
                                key={i}
                                className="flex items-start text-sm"
                              >
                                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={isPopular ? "default" : "outline"}
                      size="lg"
                      onClick={handleRedirect}
                    >
                      {tier.monthlyPrice === 0
                        ? "Get Started Free"
                        : tier.monthlyPrice
                        ? "Choose Plan"
                        : "Contact Sales"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Custom Plan */}
        <TabsContent value="custom" className="mt-4">
          <Card className="border-2 border-primary shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl">Custom Plan</CardTitle>
              <p className="text-muted-foreground">
                Tailored pricing for your specific needs
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm font-medium">Your current usage estimate:</p>
                <p className="text-xl font-bold mt-1">
                  {dailyRequests.toLocaleString()} daily /{" "}
                  {monthlyRequests.toLocaleString()} monthly requests
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Estimated cost
                </p>
                <p className="text-3xl font-bold mt-1">
                  ₹
                  {billingPeriod === "annual"
                    ? Math.round(dynamicAnnualPrice)
                    : dynamicMonthlyPrice}
                  <span className="text-base font-normal text-muted-foreground">
                    /{billingPeriod === "annual" ? "year" : "mo"}
                  </span>
                </p>

                {billingPeriod === "annual" && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    You save 15% with annual billing
                  </p>
                )}

                <p className="text-sm text-muted-foreground mt-2">
                  ≈ $
                  {inrToUsdt(
                    billingPeriod === "annual"
                      ? dynamicAnnualPrice
                      : dynamicMonthlyPrice,
                    usdtRate
                  )}{" "}
                  USDT
                </p>

                {dynamicMonthlyPrice > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    ≈ ₹{(dynamicMonthlyPrice / monthlyRequests).toFixed(4)} per
                    request
                  </p>
                )}
              </div>

              {recommendedTier && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Recommended Plan</h4>
                      <p className="text-sm mt-1">
                        Based on your usage, the{" "}
                        <strong>{recommendedTier.name}</strong> plan may be a
                        better fit with predictable pricing.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Button className="w-full" size="lg" onClick={handleRedirect}>
                {dynamicMonthlyPrice > 0
                  ? "Get Custom Plan"
                  : "Contact Sales"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
