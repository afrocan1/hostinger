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
          {/* signature glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/30 blur-[120px] motion-safe:animate-pulse"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-[#8b5cf6]/20 blur-[100px]"
          />

          <div className="relative">
            <p className="uppercase tracking-[0.2em] text-[#a78bfa] text-xs font-semibold mb-5">
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
                <a className="rounded-full bg-primary px-8 py-3.5 font-semibold text-white hover:bg-[#7c4dff] transition">
                  Get Started
                </a>
              </Link>
              <Link href="/pricing" passHref>
                <a className="rounded-full border border-white/20 px-8 py-3.5 font-semibold text-white hover:border-white/40 transition">
                  Compare all plans
                </a>
              </Link>
            </div>

            {stats?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-slate-400">
                {stats.map((stat, i) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    {i > 0 && (
                      <span className="hidden sm:block h-4 w-px bg-white/10 -ml-5 mr-5" />
                    )}
                    <span>
                      <span className="text-white font-bold">{stat.value}</span>{" "}
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Plans */}
        <section className="px-6 py-20 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-12">
            Choose Your Plan
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className={cardClasses(plan.featured)}>
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold uppercase tracking-wide px-4 py-1 rounded-full">
                    Best Value
                  </span>
                )}
                <h3 className="text-lg font-extrabold mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  {plan.tagline}
                </p>

                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-3xl font-black">{plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    /{plan.period}
                  </span>
                </div>
                {plan.mrp && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                    <span className="line-through">{plan.mrp}</span>{" "}
                    <span className="text-primary font-semibold">
                      Save {plan.savePercent}
                    </span>
                  </p>
                )}

                <Link href="/pricing" passHref>
                  <a className="block text-center rounded-md py-3 mb-8 font-semibold bg-primary text-white hover:bg-[#7c4dff] transition">
                    Choose Plan
                  </a>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.renewNote && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
                    {plan.renewNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Perks strip */}
        {perks?.length > 0 && (
          <section className="bg-lightGray/5 dark:bg-lightGray px-6 py-16">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              {perks.map((perk) => (
                <div key={perk.label} className="flex items-center gap-3">
                  <img src={perk.icon} alt="" className="w-8 h-8" />
                  <span className="text-sm font-semibold">{perk.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Guarantee banner */}
        <section className="px-6 py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
            30-Day Money-Back Guarantee
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-8">
            We&apos;ll refund your payment if you&apos;re not 100% satisfied.
            No hassle, no risk.
          </p>
          <Link href="/pricing" passHref>
            <a className="inline-block rounded-full bg-primary px-8 py-3.5 font-semibold text-white hover:bg-[#7c4dff] transition">
              Get Started
            </a>
          </Link>
        </section>
      </main>
    </>
  );
}

function cardClasses(featured) {
  return [
    "relative rounded-2xl p-8 border transition duration-200",
    featured
      ? "border-primary shadow-xl shadow-primary/10 md:scale-105 bg-white dark:bg-lightGray"
      : "border-slate-200 dark:border-white/10 bg-white dark:bg-lightGray/60",
  ].join(" ");
}
