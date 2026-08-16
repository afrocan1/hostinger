import Head from "next/head";
import Link from "next/link";
import Header from "../sections/Header";

function Check() {
  return (
    <svg
      className="w-5 h-5 text-primary flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function HostingPlanTemplate({
  seoTitle,
  eyebrow,
  title,
  subtitle,
  stats,
  plans,
  perks,
}) {
  return (
    <>
      <Head>
        <title>{seoTitle}</title>
      </Head>

      <Header />
      <main className="bg-white dark:bg-darkGray text-textColor dark:text-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-darkGray px-6 pt-28 pb-24 text-center">
          {/* quiet blueprint backdrop, no glow, no motion */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage:
                "radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 100%)",
            }}
          />

          <div className="relative">
            <p className="flex items-center justify-center gap-2 font-mono uppercase tracking-[0.2em] text-primary text-xs font-semibold mb-6">
              <span className="h-1.5 w-1.5 bg-primary" />
              {eyebrow}
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 max-w-3xl mx-auto">
              {title}
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10">
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <Link href="/pricing" passHref>
                <a className="rounded-full bg-primary px-8 py-3.5 font-semibold text-white hover:brightness-110 active:brightness-95 transition">
                  Get Started
                </a>
              </Link>
              <Link href="/pricing" passHref>
                <a className="rounded-full border border-white/15 px-8 py-3.5 font-semibold text-white hover:border-white/30 transition">
                  Compare all plans
                </a>
              </Link>
            </div>

            {stats?.length > 0 && (
              <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-white/[0.02]">
                <div
                  className="grid divide-x divide-white/10"
                  style={{
                    gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
                  }}
                >
                  {stats.map((stat) => (
                    <div key={stat.label} className="px-4 py-5">
                      <p className="font-mono text-2xl font-bold text-white">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-500">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Plans */}
        <section className="px-6 py-24 max-w-6xl mx-auto">
          <p className="text-center font-mono uppercase tracking-[0.2em] text-primary text-xs font-semibold mb-3">
            Plans
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-14">
            Choose your plan
          </h2>
          <div className="grid gap-6 md:grid-cols-3 items-start">
            {plans.map((plan) => (
              <div key={plan.name} className={cardClasses(plan.featured)}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-extrabold">{plan.name}</h3>
                  {plan.featured && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-primary border border-primary/30 rounded px-2 py-0.5">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-7">
                  {plan.tagline}
                </p>

                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-3xl font-black">{plan.price}</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400 text-sm">
                    /{plan.period}
                  </span>
                </div>
                {plan.mrp && (
                  <p className="font-mono text-xs text-slate-500 dark:text-slate-400 mb-7">
                    <span className="line-through">{plan.mrp}</span>{" "}
                    <span className="text-primary font-semibold">
                      Save {plan.savePercent}
                    </span>
                  </p>
                )}

                <Link href="/pricing" passHref>
                  
                    <a className={
                      plan.featured
                        ? "block text-center rounded-md py-3 mb-8 font-semibold bg-primary text-white hover:brightness-110 active:brightness-95 transition"
                        : "block text-center rounded-md py-3 mb-8 font-semibold border border-slate-300 dark:border-white/15 hover:border-primary hover:text-primary transition"
                    }
                  >
                    Choose plan
                  </a>
                </Link>

                <ul className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm py-2.5 first:pt-0 last:pb-0"
                    >
                      <Check />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.renewNote && (
                  <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 mt-6">
                    {plan.renewNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Perks strip */}
        {perks?.length > 0 && (
          <section className="px-6 py-16 border-y border-slate-200 dark:border-white/10">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200 dark:divide-white/10">
              {perks.map((perk) => (
                <div
                  key={perk.label}
                  className="flex items-center gap-3 px-6 py-4"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded border border-slate-200 dark:border-white/10 flex-shrink-0">
                    <img src={perk.icon} alt="" className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-semibold">{perk.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Guarantee banner */}
        <section className="px-6 py-24">
          <div className="max-w-2xl mx-auto text-center rounded-2xl border border-slate-200 dark:border-white/10 px-8 py-14">
            <p className="font-mono uppercase tracking-[0.2em] text-primary text-xs font-semibold mb-4">
              Guarantee
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
              30 day money back guarantee
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-8">
              Not satisfied within 30 days? Get a full refund, no questions
              asked.
            </p>
            <Link href="/pricing" passHref>
              <a className="inline-block rounded-full bg-primary px-8 py-3.5 font-semibold text-white hover:brightness-110 active:brightness-95 transition">
                Get started
              </a>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

function cardClasses(featured) {
  return [
    "relative rounded-2xl p-8 border transition duration-200",
    featured
      ? "border-slate-200 dark:border-white/10 border-t-2 border-t-primary bg-white dark:bg-lightGray"
      : "border-slate-200 dark:border-white/10 bg-white dark:bg-lightGray/60",
  ].join(" ");
}
