import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { MdLockOutline } from "react-icons/md";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, getAuthErrorMessage } from "@/lib/firebase";
import { checkIsAdmin } from "@/lib/adminAuth";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const isAdmin = await checkIsAdmin(cred.user.email);
      if (!isAdmin) {
        await signOut(auth);
        setError("This account is not registered as an admin.");
        setLoading(false);
        return;
      }
      router.push("/admin/dashboard");
    } catch (err) {
      setError(
        (getAuthErrorMessage && getAuthErrorMessage(err?.code)) ||
          "Login failed. Check your email and password."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#f5f5ff] dark:bg-darkGray px-5">
      <div className="w-full max-w-sm bg-white dark:bg-lightGray rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center gap-2 mb-6">
          <MdLockOutline className="text-4xl text-primary" />
          <h1 className="text-2xl font-bold text-textColor dark:text-white">
            Admin Login
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Sign in with your admin account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white dark:bg-darkGray border border-gray-300 dark:border-gray-600 rounded-full py-3 px-5 text-textColor dark:text-white outline-none focus:border-primary"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white dark:bg-darkGray border border-gray-300 dark:border-gray-600 rounded-full py-3 px-5 text-textColor dark:text-white outline-none focus:border-primary"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold rounded-full py-3 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <Link
          href="/"
          className="block text-center text-sm text-gray-400 mt-6 hover:text-primary"
        >
          Back to site
        </Link>
      </div>
    </div>
  );
}
