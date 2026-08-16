import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaServer, FaCheckDouble } from "react-icons/fa";
import Header from "../sections/Header";

// Local stand-ins for shadcn's Card primitives (not installed in this project)
function Card({ className = "", children }) {
  return (
    <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}
function CardHeader({ className = "", children }) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
}
function CardContent({ className = "", children }) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

// Local stand-in for the sourced TimelineContent scroll-reveal wrapper
function TimelineContent({ as: Tag = "div", animationNum = 0, customVariants, className, children }) {
  const MotionTag = motion[Tag] || motion.div;
  return (
    <MotionTag
      custom={animationNum}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={customVariants}
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
      <div className="relative z-50 mx-auto flex w-fit rounded-full bg-neutral-50 border border-gray-200 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={`relative z-10 w-fit sm:h-12 h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${
            selected === "0" ? "text-white" : "text-gray-500 hover:text-black"
          }`}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-primary border-primary bg-gradient-to-t from-primary/80 via-primary to-primary"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={`relative z-10 w-fit sm:h-12 h-8 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${
            selected === "1" ? "text-white" : "text-gray-500 hover:text-black"
          }`}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-primary border-primary bg-gradient-to-t from-primary/80 via-primary to-primary"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Yearly
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-black">
              Save 20%
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
  plans,
}) {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef(null);

  const revealVariants = {
    visible: (i) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: i * 0.4, duration: 0.5 },
    }),
    hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
  };

  const togglePricingPeriod = (value) => setIsYearly(Number.parseInt(value) === 1);

  // Accept either the new plan shape (description, popular, features:[{text,icon}], includes)
  // or the older shape (tagline, featured, features:[string]) so existing hosting pages still work.
  const normalizedPlans = (plans || []).map((plan) => ({
    ...plan,
    description: plan.description || plan.tagline,
    popular: plan.popular ?? plan.featured,
    features: (plan.features || []).map((f) =>
      typeof f === "string" ? { text: f, icon: <FaServer size={20} /> } : f
    ),
  }));

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
      </Head>

      <Header />

      <div className="px-4 pt-20 min-h-screen mx-auto relative bg-white dark:bg-darkGray" ref={pricingRef}>
        <div
          className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0"
          style={{
            backgroundImage: `
        radial-gradient(circle at center, #673ee5 0%, transparent 70%)
      `,
            opacity: 0.6,
            mixBlendMode: "multiply",
          }}
        />

        <div className="text-center mb-6 max-w-3xl mx-auto">
          <TimelineContent
            as="h2"
            animationNum={0}
            customVariants={revealVariants}
            className="md:text-6xl sm:text-4xl text-3xl font-medium text-gray-900 mb-4"
          >
            {title}{" "}
            {eyebrow && (
              <TimelineContent
                as="span"
                animationNum={1}
                customVariants={revealVariants}
                className="border border-dashed border-primary px-2 py-1 rounded-xl bg-primary/10 capitalize inline-block"
              >
                {eyebrow}
              </TimelineContent>
            )}
          </TimelineContent>

          {subtitle && (
            <TimelineContent
              as="p"
              animationNum={2}
              customVariants={revealVariants}
              className="sm:text-base text-sm text-gray-600 sm:w-[70%] w-[80%] mx-auto"
            >
              {subtitle}
            </TimelineContent>
          )}
        </div>

        <TimelineContent as="div" animationNum={3} customVariants={revealVariants}>
          <PricingSwitch onSwitch={togglePricingPeriod} />
        </TimelineContent>

        <div className="grid md:grid-cols-3 max-w-7xl gap-4 py-6 mx-auto">
          {normalizedPlans.map((plan, index) => (
            <TimelineContent
              key={plan.name}
              as="div"
              animationNum={4 + index}
              customVariants={revealVariants}
            >
              <Card
                className={`relative border-neutral-200 ${
                  plan.popular ? "ring-2 ring-primary bg-primary/5" : "bg-white "
                }`}
              >
                <CardHeader className="text-left">
                  <div className="flex justify-between">
                    <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    {plan.popular && (
                      <div className="">
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                          Popular
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-semibold text-gray-900">
                      {typeof plan.price === "number"
                        ? `$${isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price}`
                        : isYearly && plan.yearlyPrice
                        ? plan.yearlyPrice
                        : plan.price}
                    </span>
                    <span className="text-gray-600 ml-1">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <Link href="/pricing" passHref>
                    <a
                      className={`block text-center w-full mb-6 p-4 text-xl rounded-xl ${
                        plan.popular
                          ? "bg-gradient-to-t from-primary/80 to-primary shadow-lg shadow-primary border border-primary text-white"
                          : "bg-gradient-to-t from-neutral-900 to-neutral-600 shadow-lg shadow-neutral-900 border border-neutral-700 text-white"
                      }`}
                    >
                      {plan.buttonText || "Get started"}
                    </a>
                  </Link>
                  <ul className="space-y-2 font-semibold py-5">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className="text-neutral-800 grid place-content-center mt-0.5 mr-3">
                          {feature.icon}
                        </span>
                        <span className="text-sm text-gray-600">{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.includes?.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-neutral-200">
                      <h4 className="font-medium text-base text-gray-900 mb-3">
                        {plan.includes[0]}
                      </h4>
                      <ul className="space-y-2 font-semibold">
                        {plan.includes.slice(1).map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <span className="h-6 w-6 bg-green-50 border border-primary rounded-full grid place-content-center mt-0.5 mr-3">
                              <FaCheckDouble className="h-4 w-4 text-primary" />
                            </span>
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TimelineContent>
          ))}
        </div>
      </div>
    </>
  );
}
