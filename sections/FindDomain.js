import React, { useState, useEffect, useRef } from "react";
import { Check, X, ShoppingCart, Loader2, HelpCircle } from "lucide-react";
import { addToCart } from "@/lib/cart";

const TLD_PRICES = {
  com: 12.99, net: 14.99, org: 13.99, io: 39.99, ai: 79.99,
  xyz: 2.99, art: 6.99, dev: 15.99, app: 15.99, co: 27.99,
  info: 12.99, online: 34.99, store: 4.99, live: 24.99, in: 8.99,
      tech: 24.99, shop: 24.99, site: 19.99, me: 19.99, biz: 14.99,
  vu: 89.99, ru: 39.99, td: 149.99, tv: 34.99, cc: 29.99,
  ws: 44.99, to: 79.99, gg: 54.99, sh: 59.99, fm: 99.99,
  la: 44.99, im: 44.99, je: 44.99, cx: 64.99, nu: 44.99,
};

const RARE_TLDS = new Set([
  "vu", "ru", "td", "tv", "cc", "ws", "to", "gg", "sh", "fm",
  "la", "im", "je", "cx", "nu",
]);

// Bundle shown in the cart for each domain — mirrors what a registrar like
// Namecheap displays at checkout. Rare/unsupported TLDs get a trimmed bundle
// since hosting bundling isn't guaranteed available for every registry.
function getDomainIncludes(tld) {
  const isRare = RARE_TLDS.has(tld);
  const includes = [
    { label: "WHOIS Privacy Protection", detail: "Free for the first year" },
    { label: "DNS Management", detail: "Full control panel access" },
    { label: "Email Forwarding", detail: "Up to 5 forwarding addresses" },
  ];
  if (isRare) {
    includes.push(
      { label: "Registry Verification", detail: "Manual review required for this TLD" },
      { label: "Hosting", detail: "Available on request", pending: true }
    );
  } else {
    includes.push(
      { label: "SSL Certificate", detail: "Auto-issued on activation" },
      { label: "Hosting", detail: "Included — not activated yet", pending: true },
      { label: "cPanel", detail: "Not activated by developer", pending: true }
    );
  }
  return includes;
}

export default function FindDomain() {
     const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addedTlds, setAddedTlds] = useState([]);
  const debounceRef = useRef(null);

  const runSearch = async (rawQuery) => {
    const cleanQuery = rawQuery.trim().split(".")[0];
    if (!cleanQuery) {
      setLoading(false);
      return;
    }
    setError("");
    try {
      setSearchedQuery(cleanQuery);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/domain-search?domain=${encodeURIComponent(cleanQuery)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || data.error || "Search failed. Try again.");
        setResults([]);
        return;
      }

      const parsed = Object.entries(data).map(([tld, info]) => ({
        tld,
        status: info.status,
      }));
      setResults(parsed);
      setAddedTlds([]);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Live lookup as the user types, debounced so we're not firing a request
  // on every keystroke.
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError("");
      setLoading(false);
      return;
    }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSearch(query);
    }, 450);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSearch = () => {
    if (!query.trim()) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLoading(true);
    runSearch(query);
  };

  return (
    <section className="bg-[#f5f5ff] dark:bg-lightGray py-20">
      <div className="flex flex-col space-y-5 justify-center items-center">
        <h2 className="text-[1.7rem]" data-aos="fade-up">
          Find the perfect domain name
        </h2>
        <p
          data-aos="fade-up"
          className="text-center md:w-1/2 mx-auto text-textColor dark:text-white px-5 text-lg"
        >
          Enter domain name of your choice and pick any extension name on the
          next step (choose between .in, .com, .online, .live, .store, .info
          and many more)
        </p>
        <div
          data-aos="fade-up"
          className="flex flex-col gap-4 md:gap-0 md:w-1/2 md:relative justify-center items-center"
        >
          <input
            type="text"
            id="domain"
            name="domain"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Type in that perfect domain name"
            className="w-full relative bg-white rounded-full border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300 text-lg outline-none text-gray-700 leading-8 transition-colors duration-200 ease-in-out py-2.5 px-7"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full md:w-fit right-0 md:absolute bg-gray-500 mx-auto border border-gray-300 text-white font-bold text-lg rounded-full py-3 px-12 disabled:opacity-60"
          >
            {loading ? "Checking..." : "Search"}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {results.length > 0 && (
          <div className="w-full md:w-1/2">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide opacity-50">
                {results.length} result{results.length > 1 ? "s" : ""}
              </span>
              {loading && (
                <span className="flex items-center gap-1.5 text-xs opacity-60">
                  <Loader2 size={12} className="animate-spin" />
                  Updating
                </span>
              )}
            </div>
            <div
              className={`flex flex-col gap-2 ${
                results.length > 5 ? "max-h-[340px] overflow-y-auto pr-1" : ""
              }`}
            >
              {results.map((r) => (
                <div
                  key={r.tld}
                  className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-5 py-3 shadow-sm"
                >
                  <span className="font-medium">
                    {searchedQuery}.{r.tld}
                  </span>
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex items-center gap-1.5 font-medium ${
                        r.status === "available"
                          ? "text-green-500"
                          : r.status === "unknown"
                          ? "text-amber-500"
                          : "text-red-500"
                      }`}
                    >
                      {r.status === "available" ? (
                        <>
                          <Check size={18} strokeWidth={2.5} />
                          Available
                        </>
                      ) : r.status === "unknown" ? (
                        <>
                          <HelpCircle size={18} strokeWidth={2.5} />
                          Unverified
                        </>
                      ) : (
                        <>
                          <X size={18} strokeWidth={2.5} />
                          Taken
                        </>
                      )}
                    </span>
                    {r.status === "available" && (
                      <button
                        onClick={() => {
                          addToCart({
                            id: `${searchedQuery}.${r.tld}`,
                            name: `Domain - .${r.tld} (1yr)`,
                            price: TLD_PRICES[r.tld] || 12.99,
                            type: "domain",
                            tld: r.tld,
                            includes: getDomainIncludes(r.tld),
                          });
                          setAddedTlds((prev) => [...prev, r.tld]);
                        }}
                        disabled={addedTlds.includes(r.tld)}
                        className="flex items-center gap-1.5 text-sm font-bold rounded-full border border-primary text-primary px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart size={14} />
                        {addedTlds.includes(r.tld) ? "Added" : "Add to Cart"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
