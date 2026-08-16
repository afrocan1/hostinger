import Head from "next/head";
import Header from "../../sections/Header";
import { FaCheckDouble } from "react-icons/fa";

const benefits = [
  "Free domain privacy protection included",
  "No downtime during transfer",
  "Extends your registration by 1 year",
  "24/7 support throughout the process",
];

export default function DomainTransfer() {
  return (
    <>
      <Head>
        <title>Domain Transfer - Hostier</title>
      </Head>

      <Header />

      <main className="px-4 pt-32 pb-20 min-h-screen bg-white dark:bg-darkGray text-textColor dark:text-white relative">
        <div
          className="absolute top-0 left-[10%] right-[10%] w-[80%] h-96 z-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at center, #673ee5 0%, transparent 70%)`,
            opacity: 0.5,
            mixBlendMode: "multiply",
          }}
        />

        <div className="relative text-center max-w-2xl mx-auto mb-12">
          <p className="uppercase tracking-[0.2em] text-primary text-xs font-semibold mb-4">
            Domain
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold mb-4">
            Transfer Your Domain
          </h1>
          <p className="text-neutral-500 dark:text-slate-400">
            Bring your domain over — we&apos;ll handle the rest.
          </p>
        </div>

        <div className="relative max-w-lg mx-auto rounded-2xl bg-white dark:bg-lightGray shadow-lg shadow-primary/10 border border-neutral-200 dark:border-white/10 p-8 mb-16">
          <form className="space-y-5">
            <div>
              <label className="text-sm font-semibold block mb-2">
                Domain Name
              </label>
              <input
                type="text"
                placeholder="yourdomain.com"
                className="w-full rounded-lg border border-neutral-300 dark:border-white/10 bg-transparent px-4 py-3 outline-none focus:border-primary transition"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">
                Authorization / EPP Code
              </label>
              <input
                type="text"
                placeholder="Enter your auth code"
                className="w-full rounded-lg border border-neutral-300 dark:border-white/10 bg-transparent px-4 py-3 outline-none focus:border-primary transition"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-primary text-white font-semibold py-3 hover:opacity-90 transition"
            >
              Start Transfer
            </button>
            <p className="text-xs text-center text-neutral-500 dark:text-slate-400">
              This form isn&apos;t connected to a registrar API yet — UI only
              for now.
            </p>
          </form>
        </div>

        <div className="relative max-w-md mx-auto space-y-3">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-3">
              <FaCheckDouble className="text-primary flex-shrink-0" />
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
