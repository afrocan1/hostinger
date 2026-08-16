import Head from "next/head";

function Check() {
  return (
    <svg
      className="w-5 h-5 text-gold flex-shrink-0"
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
  plans,
}) {
  return (
    <>
      <Head>
        <title>{seoTitle}</title>
      </Head>

      <main className="bg-white dark:bg-darkBg text-textColor dark:text-white">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-24 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/60 dark:from-black dark:to-lightGray -z-10" />
          <p className="uppercase tracking-widest text-gold text-sm font-semibold mb-4">
            {eyebrow}
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            {title}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{subtitle}</p>
        </section>

        {/* Plans */}
        <section className="px-6 py-20 max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={classNamesPlan(plan.featured)}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-black text-xs font-bold uppercase tracking-wide px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-extrabold mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-400 mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-gray-400">/{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="block text-center rounded-md py-3 font-semibold bg-gold text-black hover:opacity-90 transition"
              >
                Get Started
              </a>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}

function classNamesPlan(featured) {
  return [
    "relative rounded-xl p-8 border backdrop-blur-md transition duration-200",
    featured
      ? "border-gold bg-black/40 dark:bg-lightGray scale-105 shadow-lg"
      : "border-white/10 bg-black/20 dark:bg-lightGray/60",
  ].join(" ");
}
