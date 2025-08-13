import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import AppLayout from "@/components/AppLayout";

/**
 * VakilGPT /pricing page
 * - Mobile-first, responsive
 * - Hybrid credits model
 * - Credit usage calculator suggests best plan
 * - Clear mapping of feature → credits
 * - Razorpay CTA placeholders
 */

const CREDITS_COST = {
  chat: 10,
  docAnalysis: 200,
  caseLaw: 150,
  drafting: 300,
  research: 300,
  bulkExport: 500,
};

const PLANS = [
  {
    id: "free",
    name: "Free",
    priceINR: 0,
    tagline: "Try core tools each month",
    credits: 200,
    badge: "Free forever",
    cta: "Get Started",
    highlight: false,
    features: [
      "200 credits/month",
      "AI chat access",
      "1 document analysis",
      "Basic templates",
    ],
    limits: ["Fair use; no bulk exports"],
  },
  {
    id: "intro",
    name: "Intro Pack",
    priceINR: 50,
    tagline: "Best starter for new users",
    credits: 5000,
    badge: "New user offer",
    cta: "Buy Intro Pack",
    highlight: true,
    features: [
      "5,000 credits/month",
      "Full access to tools",
      "Priority over Free",
      "Eligible for referral bonuses",
    ],
    limits: ["Abuse safeguards apply"],
  },
  {
    id: "basic",
    name: "Basic",
    priceINR: 299,
    tagline: "For regular individual use",
    credits: 15000,
    badge: "Good value",
    cta: "Choose Basic",
    highlight: false,
    features: [
      "15,000 credits/month",
      "Priority speed",
      "Standard support",
      "Access to all tools",
    ],
    limits: ["Bulk exports allowed within credits"],
  },
  {
    id: "pro",
    name: "Pro",
    priceINR: 1499,
    tagline: "For heavy professional use",
    credits: 75000,
    badge: "Most popular",
    cta: "Choose Pro",
    highlight: true,
    features: [
      "75,000 credits/month",
      "Highest priority speed",
      "Advanced research flow",
      "Email + chat support",
    ],
    limits: ["Team handoff coming soon"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceINR: null,
    tagline: "Teams, firms & corporates",
    credits: null,
    badge: "Custom",
    cta: "Request Custom Quote",
    highlight: false,
    features: [
      "Custom credits & pricing",
      "Team accounts & roles",
      "SSO, usage analytics",
      "Priority onboarding",
    ],
    limits: ["SLA, DPA on request"],
  },
] as const;

function Check() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.28a.75.75 0 0 0-1.06-1.06l-4.72 4.72-1.88-1.88a.75.75 0 1 0-1.06 1.06l2.41 2.41c.293.293.767.293 1.06 0l5.25-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Crown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path d="M2 7.5 6.5 12l3-4 3 4L17.5 8 22 12.5V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7.5Z" />
    </svg>
  );
}

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
    <Crown /> {children}
  </span>
);

function PricingContent() {
  const [inputs, setInputs] = useState({
    chats: 50,
    docs: 2,
    cases: 2,
    drafts: 1,
    research: 1,
    exports: 0,
  });

  const monthlyCreditsNeed = useMemo(() => {
    const {
      chats,
      docs,
      cases,
      drafts,
      research: res,
      exports,
    } = inputs;
    return (
      chats * CREDITS_COST.chat +
      docs * CREDITS_COST.docAnalysis +
      cases * CREDITS_COST.caseLaw +
      drafts * CREDITS_COST.drafting +
      res * CREDITS_COST.research +
      exports * CREDITS_COST.bulkExport
    );
  }, [inputs]);

  const bestPlan = useMemo(() => {
    const eligible = PLANS.filter((p) => p.credits && p.priceINR !== null);
    let choice = eligible[0];
    eligible.forEach((p) => {
      if (p.credits! >= monthlyCreditsNeed && p.priceINR! <= (choice.priceINR || 0)) {
        choice = p as any;
      }
    });
    // if none covers need, recommend Pro
    if (choice && choice.credits! < monthlyCreditsNeed) {
      const pro = PLANS.find((p) => p.id === "pro")!;
      return pro;
    }
    return choice;
  }, [monthlyCreditsNeed]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      {/* Header */}
      <section className="mb-8 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
          VakilGPT <span className="text-[10px]">BETA</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Hybrid credit model: pay only for what you use. Start free, upgrade when you need more power.
        </p>
      </section>

      {/* Credit Costs legend */}
      <section className="mb-10 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-3">
        <h3 className="col-span-full text-sm font-semibold text-card-foreground">
          Credit Costs (per action)
        </h3>
        {Object.entries(CREDITS_COST).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-sm">
            <span className="capitalize text-muted-foreground">{k.replace(/[A-Z]/g, (m) => ` ${m.toLowerCase()}`)}</span>
            <span className="font-medium text-foreground">{v} credits</span>
          </div>
        ))}
      </section>

      {/* Calculator */}
      <section className="mb-12 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-card-foreground">Estimate your monthly usage</h3>
          <Pill>Suggested: {bestPlan?.name}</Pill>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Adjust the sliders to see which plan fits you. Credits needed: {" "}
          <span className="font-semibold text-foreground">{monthlyCreditsNeed.toLocaleString()}</span>
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {([
            ["chats", "AI chat messages", 0, 1000],
            ["docs", "Document analysis (files)", 0, 50],
            ["cases", "Case law searches", 0, 50],
            ["drafts", "Contract drafts", 0, 50],
            ["research", "Advanced research runs", 0, 50],
            ["exports", "Bulk exports", 0, 20],
          ] as const).map(([key, label, min, max]) => (
            <label key={key} className="block rounded-xl bg-muted p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-foreground">{inputs[key as keyof typeof inputs]}</span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                value={inputs[key as keyof typeof inputs]}
                className="mt-2 w-full accent-primary"
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                }
              />
            </label>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-3xl border border-border p-5 ${
                p.highlight ? "ring-2 ring-primary" : ""
              } bg-card`}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-card-foreground">{p.name}</h3>
                <Pill>{p.badge}</Pill>
              </div>
              <p className="text-sm text-muted-foreground">{p.tagline}</p>

              <div className="mt-4">
                {p.priceINR === null ? (
                  <p className="text-2xl font-bold text-card-foreground">Contact Sales</p>
                ) : (
                  <p className="text-3xl font-bold text-card-foreground">₹{p.priceINR.toLocaleString()}<span className="text-base font-medium text-muted-foreground"> /month</span></p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">
                  {p.credits ? (
                    <>
                      Includes <span className="font-medium text-foreground">{p.credits.toLocaleString()}</span> credits / month
                    </>
                  ) : (
                    <>Custom credits negotiated</>
                  )}
                </p>
              </div>

              <button
                className={`mt-4 inline-flex w-full items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  p.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                // Replace with real handlers / Razorpay open checkout
                onClick={() => alert(`${p.cta} → Razorpay checkout (to wire)`)}
              >
                {p.cta}
              </button>

              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-muted-foreground">
                    <Check /> <span>{f}</span>
                  </li>
                ))}
              </ul>

              {p.limits?.length ? (
                <div className="mt-4 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
                  {p.limits.map((l) => (
                    <div key={l}>• {l}</div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12 grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2">
        <h3 className="col-span-full text-lg font-semibold text-card-foreground">Frequently Asked Questions</h3>
        <details className="rounded-xl bg-muted p-4">
          <summary className="cursor-pointer text-sm font-medium text-foreground">What do credits mean in VakilGPT?</summary>
          <p className="mt-2 text-sm text-muted-foreground">Credits represent usage. Each feature consumes credits (see the legend above). Your monthly plan refills credits automatically.</p>
        </details>
        <details className="rounded-xl bg-muted p-4">
          <summary className="cursor-pointer text-sm font-medium text-foreground">What happens if I run out of credits?</summary>
          <p className="mt-2 text-sm text-muted-foreground">You can buy a top-up (Razorpay) or upgrade your plan. Unused top-up credits roll over for 30 days.</p>
        </details>
        <details className="rounded-xl bg-muted p-4">
          <summary className="cursor-pointer text-sm font-medium text-foreground">Is the ₹50 Intro Pack recurring?</summary>
          <p className="mt-2 text-sm text-muted-foreground">No. It's a one-time monthly offer for new users to experience the platform with 5,000 credits.</p>
        </details>
        <details className="rounded-xl bg-muted p-4">
          <summary className="cursor-pointer text-sm font-medium text-foreground">Do you offer refunds?</summary>
          <p className="mt-2 text-sm text-muted-foreground">Due to metered usage, refunds aren't offered, but contact support for billing issues—we're happy to help.</p>
        </details>
      </section>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-3xl p-3 sm:hidden">
        <div className="rounded-2xl border border-border bg-card p-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Suggested plan</div>
              <div className="text-sm font-semibold text-card-foreground">{bestPlan?.name}</div>
            </div>
            <button
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
              onClick={() => alert("Proceed to Razorpay checkout (to wire)")}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PricingPage() {
  return (
    <AppLayout>
      <Helmet>
        <title>Pricing - VakilGPT | Simple, Transparent AI Legal Assistant Plans</title>
        <meta 
          name="description" 
          content="Choose from flexible VakilGPT pricing plans. Start free with 200 credits, upgrade to Pro for 75K credits. Pay only for what you use with our credit-based system." 
        />
        <meta name="keywords" content="VakilGPT pricing, legal AI plans, Indian law AI pricing, legal assistant cost" />
        <link rel="canonical" href="https://vakilgpt.com/pricing" />
      </Helmet>
      <PricingContent />
    </AppLayout>
  );
}