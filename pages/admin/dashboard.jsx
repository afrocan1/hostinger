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
} from "lucide-react";

const TABS = ["Overview", "Payments", "Pricing", "Admins"];
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
      const isAdmin = await checkIsAdmin(user.email);
      if (!isAdmin) {
        await signOut(auth);
        router.replace("/admin/login");
        return;
      }
      setAdminEmail(user.email);
      setChecking(false);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (checking) return;
    (async () => {
      setLoadingData(true);
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
      setLoadingData(false);
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
    const numericPrices = Object.fromEntries(
      Object.entries(prices).map(([k, v]) => [k, Number(v) || 0])
    );
    await updateTldPrices(numericPrices, adminEmail);
    setSavingPrices(false);
    setMessage("Pricing updated.");
    setTimeout(() => setMessage(""), 2500);
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    await addAdmin({ email: newAdminEmail, addedByEmail: adminEmail });
    setAdmins(await getAllAdmins());
    setNewAdminEmail("");
  };

  const handleRemoveAdmin = async (email) => {
    if (email === adminEmail) {
      setMessage("You can't remove yourself.");
      return;
    }
    await removeAdmin(email);
    setAdmins((prev) => prev.filter((a) => a.email !== email));
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5ff] dark:bg-darkGray">
      <header className="flex items-center justify-between bg-white dark:bg-lightGray shadow-sm px-6 py-4">
        <h1 className="text-xl font-bold text-textColor dark:text-white">
          Admin Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {adminEmail}
          </span>
          <button
            onClick={() => signOut(auth).then(() => router.push("/admin/login"))}
            className="flex items-center gap-1.5 text-sm font-bold text-red-500"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </header>

      <nav className="flex gap-2 px-6 pt-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition ${
              tab === t
                ? "bg-primary text-white"
                : "bg-white dark:bg-lightGray text-textColor dark:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {message && <p className="px-6 pt-3 text-sm text-green-600">{message}</p>}

      <main className="p-6">
        {loadingData ? (
          <Loader2 className="animate-spin text-primary" size={28} />
        ) : (
          <>
            {tab === "Overview" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={<Users size={22} />} label="Registered users" value={users.length} />
                <StatCard icon={<ShieldCheck size={22} />} label="Active now (5 min)" value={activeNow} />
                <StatCard
                  icon={<CreditCard size={22} />}
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
              <div className="bg-white dark:bg-lightGray rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                      <th className="p-3">Client</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Tx Hash</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-gray-400">
                          No payments yet.
                        </td>
                      </tr>
                    )}
                    {payments.map((p) => (
                      <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="p-3">{p.email}</td>
                        <td className="p-3">
                          {p.amount} {p.currency}
                        </td>
                        <td className="p-3 font-mono text-xs truncate max-w-[160px]">
                          {p.txHash || "—"}
                        </td>
                        <td className="p-3">
                          <span
                            className={
                              p.status === "confirmed"
                                ? "text-green-500"
                                : p.status === "failed"
                                ? "text-red-500"
                                : "text-amber-500"
                            }
                          >
                            {p.status || "pending"}
                          </span>
                        </td>
                        <td className="p-3">
                          {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleString() : "—"}
                        </td>
                        <td className="p-3">
                          {p.status !== "confirmed" && (
                            <button
                              onClick={() => handleMarkConfirmed(p.id)}
                              className="text-xs font-bold text-primary"
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

            {tab === "Pricing" && (
              <div className="bg-white dark:bg-lightGray rounded-xl shadow-sm p-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(prices)
                    .filter(([k]) => k !== "updatedAt" && k !== "updatedBy")
                    .map(([tld, price]) => (
                      <label key={tld} className="flex flex-col gap-1 text-sm">
                        <span className="font-bold">.{tld}</span>
                        <input
                          type="number"
                          step="0.01"
                          value={price}
                          onChange={(e) => handlePriceChange(tld, e.target.value)}
                          className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-transparent"
                        />
                      </label>
                    ))}
                </div>
                <button
                  onClick={handleSavePrices}
                  disabled={savingPrices}
                  className="mt-5 flex items-center gap-2 bg-primary text-white font-bold rounded-full px-6 py-2.5 disabled:opacity-60"
                >
                  <Tag size={16} /> {savingPrices ? "Saving..." : "Save pricing"}
                </button>
              </div>
            )}

            {tab === "Admins" && (
              <div className="bg-white dark:bg-lightGray rounded-xl shadow-sm p-5 max-w-lg">
                <form onSubmit={handleAddAdmin} className="flex gap-2 mb-5">
                  <input
                    type="email"
                    required
                    placeholder="teammate@company.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 bg-transparent"
                  />
                  <button type="submit" className="bg-primary text-white font-bold rounded-full px-5 py-2">
                    Add
                  </button>
                </form>
                <ul className="flex flex-col gap-2">
                  {admins.map((a) => (
                    <li
                      key={a.email}
                      className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 py-2"
                    >
                      <span className="text-sm">{a.email}</span>
                      <button onClick={() => handleRemoveAdmin(a.email)} className="text-red-500">
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
    <div className="bg-white dark:bg-lightGray rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
        <p className="text-xl font-bold text-textColor dark:text-white">{value}</p>
      </div>
    </div>
  );
}
