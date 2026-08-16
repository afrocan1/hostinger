import React, { useState } from "react";

export default function FindDomain() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const cleanQuery = query.trim().split(".")[0];
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/domain-search?domain=${encodeURIComponent(cleanQuery)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || data.error || "Search failed. Try again.");
        return;
      }

      const parsed = Object.entries(data).map(([tld, info]) => ({
        tld,
        status: info.status,
      }));
      setResults(parsed);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
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
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {results.length > 0 && (
          <div className="w-full md:w-1/2 flex flex-col gap-2">
            {results.map((r) => (
              <div
                key={r.tld}
                className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg px-5 py-3"
              >
                <span className="font-medium">
                  {query}.{r.tld}
                </span>
                <span
                  className={
                    r.status === "available" ? "text-green-500" : "text-red-500"
                  }
                >
                  {r.status === "available" ? "Available" : "Taken"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
