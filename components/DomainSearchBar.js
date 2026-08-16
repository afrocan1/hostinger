import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function DomainSearchBar({ placeholder, onSearch, buttonText = "Search" }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle"); // idle | pending | unavailable

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setStatus("pending");
    onSearch?.(query.trim());
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:rounded-full rounded-2xl bg-white dark:bg-lightGray shadow-lg shadow-primary/10 border border-neutral-200 dark:border-white/10 p-2"
      >
        <div className="flex items-center gap-3 flex-1 px-4 py-2">
          <FaSearch className="text-neutral-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none text-textColor dark:text-white placeholder:text-neutral-400"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-primary text-white font-semibold px-8 py-3 hover:opacity-90 transition"
        >
          {buttonText}
        </button>
      </form>

      {status === "pending" && (
        <p className="text-center text-sm text-neutral-500 dark:text-slate-400 mt-4">
          Search isn&apos;t connected to a live registrar yet — this is the
          interface only. Once a backend/API is wired up, results for &quot;
          {query}&quot; will appear here.
        </p>
      )}
    </div>
  );
}
