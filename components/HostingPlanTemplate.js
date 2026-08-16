import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckDouble } from "react-icons/fa";
import Header from "../sections/Header";

const revealVariants = {
  hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

function Reveal({ as: Tag = "div", index = 0, className, children }) {
  const MotionTag = motion[Tag] || motion.div;
  return (
    <MotionTag
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={revealVariants}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

const PricingSwitch = ({ onSwitch }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-white dark:bg-lightGray border border-slate-200 dark:border-white/10 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={`relative z-10 w-fit sm:h-12 h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${
            selected === "0"
              ? "text-white"
              : "text-slate-500 dark:text-slate-400 hover:text-textColor dark:hover:text-white"
          }`}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full bg-primary"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={`relative z-10 w-fit sm:h-12 h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${
            selected === "1"
              ? "text-white"
              : "text-slate-500 dark:text-slate-400 hover:text-textColor dark:hover:text-white"
          }`}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full bg-primary"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Yearly
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Save
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default function HostingPlanTemplate({
  seoTitle,
  eyebrow,
  title,
  subtitle,
  stats,
  plans,
  perks,
}) {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef(null);

  const togglePricingPeriod = (value) => setIsYearly(Number.parseInt(value) === 1);
  const hasYearlyPricing = plans.some((plan) => plan.yearlyPrice);

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
      </Head>

      <Header />

      <main
        className="relative px-4 pt-20 pb-24 mx-auto bg-white dark:bg-darkGray text-textColor dark:text-white"
        ref={pricingRef}
      >
        {/* signature backdrop, brand color, kept subtle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-[10%] right-[10%] w-[80%] h-[26rem] z-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, #673ee5 0%, transparent 70%)",
            opacity: 0.12,
          }}
        />

        <div className="relative text-center mb-6 max-w-3xl mx-auto">
          {eyebrow && (
            <Reveal
              as="p"
              index={0}
              className="font-mono uppercase tracking-[0.2em] text-primary text-xs font-semibold mb-4"
            >
              {eyebrow}
            </Reveal>
          )}

          <Reveal
            as="h1"
            index={1}
            className="md:text-6xl sm:text-4xl text-3xl font-medium mb-4"
          >
            {title}
          </Reveal>

          {subtitle && (
            <Reveal
              as="p"
              index={2}
              className="sm:text-base text-sm text-slate-500 dark:text-slate-400 sm:w-[70%] w-[90%] mx-auto"
            >
              {subtitle}
            </Reveal>
          )}
        </div>

        {stats?.length > 0 && (
          <Reveal as="div" index={3} className="flex justify-center mb-10">
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-lightGray px-8 py-4">
              {stats.map((stat) => (
                <span key={stat.label} className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="text-textColor dark:text-white font-bold">
                    {stat.value}
                  </span>{" "}
                  {stat.label}
                </span>
              ))}
            </div>
          </Reveal>
        )}

        {hasYearlyPricing && (
          <Reveal as="div" index={4}>
            <PricingSwitch onSwitch={togglePricingPeriod} />
          </Reveal>
        )}

        <div className="relative grid md:grid-cols-3 max-w-7xl gap-6 py-10 mx-auto">
          {plans.map((plan, index) => (
            <Reveal as="div" index={5 + index} key={plan.name}>
              <div
                className={`relative rounded-2xl border p-8 h-full ${
                  plan.featured
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-slate-200 dark:border-white/10 bg-white dark:bg-lightGray"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-2xl font-semibold">{plan.name}</h3>
                  {plan.featured && (
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most popular
                    </span>
                  )}
                </div>

                {plan.tagline && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    {plan.tagline}
                  </p>
                )}

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-semibold">
                    {isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    /{isYearly && plan.yearlyPeriod ? plan.yearlyPeriod : plan.period}
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
                  <a
                    className={`block text-center w-full mb-8 p-3.5 rounded-xl font-semibold transition ${
                      plan.featured
                        ? "bg-primary text-white hover:brightness-110 active:brightness-95"
                        : "border border-slate-300 dark:border-white/15 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {plan.buttonText || "Choose plan"}
                  </a>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="h-6 w-6 flex-shrink-0 bg-primary/10 border border-primary/30 rounded-full grid place-content-center mt-0.5">
                        <FaCheckDouble className="h-3 w-3 text-primary" />
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.renewNote && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                    {plan.renewNote}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {perks?.length > 0 && (
          <Reveal as="div" index={8}>
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-200 dark:border-white/10">
              {perks.map((perk) => (
                <div key={perk.label} className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded border border-slate-200 dark:border-white/10 flex-shrink-0">
                    <img src={perk.icon} alt="" className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-semibold">{perk.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </main>
    </>
  );
}
