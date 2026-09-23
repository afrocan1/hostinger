import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import {
  checkIsAdmin,
  getAllAdmins,
  addAdmin,
  removeAdmin,
} from "@/lib/adminAuth";
import { getTldPrices, updateTldPrices } from "@/lib/pricing";
import {
  Loader2,
  LogOut,
  Users,
  CreditCard,
  Tag,
  ShieldCheck,
  Trash2,
  AlertTriangle,
} from "lucide-react";

const TABS = [
  { id: "Overview", icon: ShieldCheck },
  { id: "Payments", icon: CreditCard },
  { id: "Pricing", icon: Tag },
  { id: "Admins", icon: Users },
];
const ACTIVE_WINDOW_MS = 5 * 60 * 1000; // "active now" = touched in the last 5 min

export default function AdminDashboard() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [tab, setTab] = useState("Overview");

  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [prices, setPrices] = useState({});
  const [admins, setAdmins] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [savingPrices, setSavingPrices] = useState(false);
  const [message, setMessage] = useState("");

  // Gate: must be signed in AND listed in the admins collection.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }
      try {
        const isAdmin = await checkIsAdmin(user.email);
        if (!isAdmin) {
          await signOut(auth);
          router.replace("/admin/login");
          return;
        }
        setAdminEmail(user.email);
      } catch (err) {
        setLoadError(
          "Couldn't verify admin access — check your Firestore rules are deployed. (" +
            (err?.message || "unknown error") +
            ")"
        );
      } finally {
        setChecking(false);
      }
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (checking) return;
    (async () => {
      setLoadingData(true);
      setLoadError("");
      try {
        const [usersSnap, paymentsSnap, priceData, adminList] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(query(collection(db, "payments"), orderBy("createdAt", "desc"))),
          getTldPrices(),
          getAllAdmins(),
        ]);
        setUsers(usersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setPayments(paymentsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setPrices(priceData);
        setAdmins(adminList);
      } catch (err) {
        setLoadError(err?.message || "Failed to load dashboard data.");
      } finally {
        setLoadingData(false);
      }
    })();
  }, [checking]);

  const activeNow = users.filter((u) => {
    const ms = u.lastActiveAt?.toMillis ? u.lastActiveAt.toMillis() : 0;
    return ms && Date.now() - ms < ACTIVE_WINDOW_MS;
  }).length;

  const revenueByCurrency = payments
    .filter((p) => p.status === "confirmed")
    .reduce((acc, p) => {
      const cur = p.currency || "USD";
      acc[cur] = (acc[cur] || 0) + (Number(p.amount) || 0);
      return acc;
    }, {});

  const handleMarkConfirmed = async (paymentId) => {
    await updateDoc(doc(db, "payments", paymentId), { status: "confirmed" });
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: "confirmed" } : p))
    );
  };

  const handlePriceChange = (tld, value) => {
    setPrices((prev) => ({ ...prev, [tld]: value }));
  };

  const handleSavePrices = async () => {
    setSavingPrices(true);
    try {
      const numericPrices = Object.fromEntries(
        Object.entries(prices).map(([k, v]) => [k, Number(v) || 0])
      );
      await updateTldPrices(numericPrices, adminEmail);
      setMessage("Pricing updated.");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setMessage(err?.message || "Failed to save pricing.");
    } finally {
      setSavingPrices(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    try {
      await addAdmin({ email: newAdminEmail, addedByEmail: adminEmail });
      setAdmins(await getAllAdmins());
      setNewAdminEmail("");
    } catch (err) {
      setMessage(err?.message || "Failed to add admin.");
    }
  };

  const handleRemoveAdmin = async (email) => {
    if (email === adminEmail) {
      setMessage("You can't remove yourself.");
      return;
    }
    await removeAdmin(email);
    setAdmins((prev) => prev.filter((a) => a.email !== email));
  };

  const statusClasses = (status) =>
    status === "confirmed"
      ? "bg-green-500/10 text-green-500"
      : status === "failed"
      ? "bg-red-500/10 text-red-500"
      : "bg-amber-500/10 text-amber-500";

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-black dark:via-darkGray dark:to-black">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-black dark:via-darkGray dark:to-black">
      {/* Header — avatar+title group shrinks/truncates, sign-out never gets squeezed */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 dark:bg-darkGray/70 border-b border-black/5 dark:border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-8 py-3.5 sm:py-5">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
              {adminEmail.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="text-[15px] sm:text-xl font-extrabold text-textColor dark:text-white tracking-tight leading-tight truncate">
                Admin Dashboard
              </h1>
              <p className="text-[11px] sm:text-xs text-gray-400 truncate">
                {adminEmail}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut(auth).then(() => router.push("/admin/login"))}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-red-500 hover:text-red-600 transition rounded-full px-3 py-2 hover:bg-red-500/10 shrink-0"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>

        {/* Tabs — horizontally scrollable, icons always white when active */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-3 overflow-x-auto">
          <nav className="flex gap-2 w-max min-w-full sm:w-auto">
            {TABS.map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  tab === id
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : "bg-black/5 dark:bg-white/10 text-textColor dark:text-white hover:bg-black/10 dark:hover:bg-white/20"
                }`}
              >
                <Icon size={15} className={tab === id ? "text-white" : ""} />
                {id}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-8">
        {loadError && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-300 bg-red-50 dark:bg-red-950/40 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-300">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-bold">Couldn't load some dashboard data</p>
              <p className="opacity-80 break-words">{loadError}</p>
              <p className="opacity-60 mt-1">
                Almost always a Firestore rules issue — confirm{" "}
                <code>firestore.rules</code> is deployed and your account's doc
                exists in <code>admins</code>.
              </p>
            </div>
          </div>
        )}

        {message && (
          <p className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
            {message}
          </p>
        )}

        {loadingData ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : (
          <>
            {tab === "Overview" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={<Users size={20} />} label="Registered users" value={users.length} />
                <StatCard icon={<ShieldCheck size={20} />} label="Active now (5 min)" value={activeNow} />
                <StatCard
                  icon={<CreditCard size={20} />}
                  label="Confirmed revenue"
                  value={
                    Object.keys(revenueByCurrency).length
                      ? Object.entries(revenueByCurrency)
                          .map(([cur, amt]) => `${amt.toFixed(2)} ${cur}`)
                          .join(" · ")
                      : "0"
                  }
                />
              </div>
            )}

            {tab === "Payments" && (
              <div className="bg-white/80 dark:bg-lightGray/80 backdrop-blur-xl rounded-2xl shadow-xl border border-black/5 dark:border-white/10 overflow-hidden">
                {payments.length === 0 && (
                  <p className="p-8 text-center text-gray-400 text-sm">No payments yet.</p>
                )}

                {/* Mobile: stacked cards, one per payment */}
                {payments.length > 0 && (
                  <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-800">
                    {payments.map((p) => (
                      <div key={p.id} className="p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-sm font-semibold break-all min-w-0">{p.email}</span>
                          <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold ${statusClasses(p.status)}`}>
                            {p.status || "pending"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Amount</span>
                          <span className="font-semibold">{p.amount} {p.currency}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Date</span>
                          <span>{p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString() : "—"}</span>
                        </div>
                        <p className="text-xs font-mono text-gray-400 break-all">{p.txHash || "—"}</p>
                        {p.status !== "confirmed" && (
                          <button
                            onClick={() => handleMarkConfirmed(p.id)}
                            className="self-start text-xs font-bold text-primary mt-1"
                          >
                            Mark confirmed
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Desktop / tablet: table */}
                {payments.length > 0 && (
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                          <th className="p-4 font-bold">Client</th>
                          <th className="p-4 font-bold">Amount</th>
                          <th className="p-4 font-bold">Tx Hash</th>
                          <th className="p-4 font-bold">Status</th>
                          <th className="p-4 font-bold">Date</th>
                          <th className="p-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => (
                          <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                            <td className="p-4 max-w-[220px] truncate">{p.email}</td>
                            <td className="p-4 font-semibold whitespace-nowrap">{p.amount} {p.currency}</td>
                            <td className="p-4 font-mono text-xs truncate max-w-[160px]">{p.txHash || "—"}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusClasses(p.status)}`}>
                                {p.status || "pending"}
                              </span>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleString() : "—"}
                            </td>
                            <td className="p-4">
                              {p.status !== "confirmed" && (
                                <button
                                  onClick={() => handleMarkConfirmed(p.id)}
                                  className="text-xs font-bold text-primary hover:underline whitespace-nowrap"
                                >
                                  Mark confirmed
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {tab === "Pricing" && (
              <div className="bg-white/80 dark:bg-lightGray/80 backdrop-blur-xl rounded-2xl shadow-xl border border-black/5 dark:border-white/10 p-4 sm:p-7">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {Object.entries(prices)
                    .filter(([k]) => k !== "updatedAt" && k !== "updatedBy")
                    .map(([tld, price]) => (
                      <label key={tld} className="flex flex-col gap-1.5 text-sm min-w-0">
                        <span className="font-bold text-textColor dark:text-white">.{tld}</span>
                        <input
                          type="number"
                          step="0.01"
                          value={price}
                          onChange={(e) => handlePriceChange(tld, e.target.value)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-2.5 py-1.5 bg-transparent focus:border-primary outline-none"
                        />
                      </label>
                    ))}
                </div>
                <button
                  onClick={handleSavePrices}
                  disabled={savingPrices}
                  className="mt-6 w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white font-bold rounded-full px-6 py-2.5 disabled:opacity-60 hover:opacity-90 transition"
                >
                  <Tag size={16} className="text-white" /> {savingPrices ? "Saving..." : "Save pricing"}
                </button>
              </div>
            )}

            {tab === "Admins" && (
              <div className="bg-white/80 dark:bg-lightGray/80 backdrop-blur-xl rounded-2xl shadow-xl border border-black/5 dark:border-white/10 p-4 sm:p-7 max-w-xl">
                <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-2 mb-6">
                  <input
                    type="email"
                    required
                    placeholder="teammate@company.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="flex-1 min-w-0 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2.5 bg-transparent focus:border-primary outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-primary text-white font-bold rounded-full px-6 py-2.5 hover:opacity-90 transition"
                  >
                    Add
                  </button>
                </form>
                <ul className="flex flex-col gap-1">
                  {admins.length === 0 && (
                    <li className="text-sm text-gray-400 py-2">No admins found.</li>
                  )}
                  {admins.map((a) => (
                    <li
                      key={a.email}
                      className="flex justify-between items-center gap-2 border-b border-gray-100 dark:border-gray-800 last:border-0 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                          {a.email.charAt(0)}
                        </div>
                        <span className="text-sm truncate">{a.email}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveAdmin(a.email)}
                        className="text-red-400 hover:text-red-500 transition p-1.5 rounded-full hover:bg-red-500/10 shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white/80 dark:bg-lightGray/80 backdrop-blur-xl rounded-2xl shadow-xl border border-black/5 dark:border-white/10 p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
        <p className="text-xl font-extrabold text-textColor dark:text-white truncate">{value}</p>
      </div>
    </div>
  );
}
