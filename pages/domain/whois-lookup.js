import Head from "next/head";
import Header from "../../sections/Header";
import DomainSearchBar from "../../components/DomainSearchBar";

export default function WhoisLookup() {
  return (
    <>
      <Head>
        <title>WHOIS Lookup - Hostier</title>
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
            WHOIS Lookup
          </h1>
          <p className="text-neutral-500 dark:text-slate-400">
            Look up registration details for any domain — owner, registrar,
            and expiry date.
          </p>
        </div>

        <div className="relative mb-16">
          <DomainSearchBar placeholder="example.com" buttonText="Lookup" />
        </div>

        <div className="relative max-w-lg mx-auto rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-lightGray/60 p-8 text-center text-sm text-neutral-500 dark:text-slate-400">
          Results will appear here once a domain is searched.
        </div>
      </main>
    </>
  );
}
