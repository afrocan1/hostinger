import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  HiOutlineTrash,
  HiOutlineShoppingCart,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiX,
  HiOutlineClipboardCopy,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import Header from "../sections/Header";
import { getCart, removeFromCart, updateCartQty } from "@/lib/cart";
import { useRouter } from "next/router";
import { CHAINS } from "@/lib/chains";

const PAYMENT_WINDOW_SECONDS = 60 * 60; // 60 minutes
const POLL_MS = 8000;

const CartScreen = () => {
      const router = useRouter();
  const [items, setItems] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [chainKey, setChainKey] = useState("tron");
  const [payAmount, setPayAmount] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [status, setStatus] = useState("waiting"); // "waiting" | "paid"
  const [secondsLeft, setSecondsLeft] = useState(PAYMENT_WINDOW_SECONDS);
  const [copied, setCopied] = useState(null);
  const timerRef = useRef(null);
  const expired = secondsLeft === 0;
  const chain = CHAINS[chainKey];

  useEffect(() => {
    setItems(getCart());
  }, []);

    // Countdown
  useEffect(() => {
    if (!showPaymentModal || status === "paid") return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [showPaymentModal, status]);

  // Auto-detect payment
  useEffect(() => {
    if (!showPaymentModal || !startedAt || status === "paid" || expired) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(
          `/api/check-payment?chain=${chainKey}&amount=${payAmount}&since=${startedAt - 120000}`
        );
        const data = await res.json();
        if (!cancelled && data.paid) setStatus("paid");
      } catch (e) {}
    };
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [showPaymentModal, startedAt, chainKey, payAmount, status, expired]);

  // Redirect after confirmation
  useEffect(() => {
    if (status !== "paid") return;
    // If lib/cart has a clear function, call it here so the cart empties.
    const t = setTimeout(() => router.push("/dashboard"), 3000);
    return () => clearTimeout(t);
  }, [status]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

    const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const updateQty = (id, delta) => {
    setItems(updateCartQty(id, delta));
  };

  const removeItem = (id) => {
    setItems(removeFromCart(id));
  };

    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const startPayment = () => {
    const unique = Math.floor(Math.random() * 999 + 1) / 100000; // 0.00001 to 0.00999
    setPayAmount((Math.round(subtotal * 100) / 100 + unique).toFixed(5));
    setStartedAt(Date.now());
    setStatus("waiting");
    setSecondsLeft(PAYMENT_WINDOW_SECONDS);
    setShowPaymentModal(true);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-darkGray text-black dark:text-white px-5 md:px-10 py-10">
        <h1 className="text-3xl font-extrabold mb-8">Your Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <HiOutlineShoppingCart className="text-6xl opacity-40" />
          <p className="text-xl opacity-70">Your cart is empty</p>
          <Link href={"/"}>
            <button className="rounded-full bg-primary text-white py-2 px-6 font-bold">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 flex flex-col gap-4">
                        {items.map((item) => (
              <div
                key={item.id}
                className="border border-gray-300 dark:border-gray-700 rounded-xl p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-lg">{item.name}</p>
                    <p className="opacity-60 text-sm mt-0.5">
                      ${item.price.toFixed(2)}{item.type === "domain" ? " / year" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-full">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="px-3 py-1 text-xl"
                      >
                        -
                      </button>
                      <span className="px-2">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="px-3 py-1 text-xl"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 text-2xl"
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                </div>

                {item.includes?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-700">
                                        <p className="text-xs font-bold uppercase tracking-wide opacity-50 mb-3">
                      What&apos;s included
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                      {item.includes.map((inc, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          {inc.pending ? (
                            <HiOutlineClock className="mt-0.5 shrink-0 opacity-50" />
                          ) : (
                            <HiOutlineCheckCircle className="mt-0.5 shrink-0 text-green-500" />
                          )}
                          <span>
                            <span className="font-medium">{inc.label}</span>
                            <span className="opacity-60"> — {inc.detail}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="w-full lg:w-80 border border-gray-300 dark:border-gray-700 rounded-xl p-6 h-fit">
            <h2 className="text-xl font-extrabold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-6 font-bold text-lg border-t border-gray-300 dark:border-gray-700 pt-4">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
                                    <button
                            onClick={startPayment}
              className="w-full rounded-full bg-primary text-white py-3 font-bold hover:opacity-90 transition"
            >
              Continue to Purchase
            </button>
          </div>
                </div>
      )}
    </div>

        {showPaymentModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-darkGray border border-gray-300 dark:border-gray-700 p-6 relative max-h-[90vh] overflow-y-auto">
          {status !== "paid" && (
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-2xl opacity-60 hover:opacity-100"
            >
              <HiX />
            </button>
          )}

          {status === "paid" ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <HiOutlineCheckCircle className="text-6xl text-green-500" />
              <p className="text-xl font-extrabold">Payment confirmed</p>
              <p className="text-sm opacity-60">Redirecting you to your dashboard...</p>
              <Link href="/dashboard">
                <button className="mt-2 rounded-full bg-primary text-white py-2 px-6 font-bold">
                  Go to Dashboard
                </button>
              </Link>
            </div>
          ) : expired ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <HiOutlineExclamationCircle className="text-5xl text-red-500" />
              <p className="font-bold">Payment window expired</p>
              <p className="text-sm opacity-60">
                This quote is no longer valid. If you already sent payment, contact support with your transaction hash.
              </p>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="mt-2 rounded-full bg-primary text-white py-2 px-6 font-bold"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-extrabold mb-1">Pay with USDT</h2>
              <p className="text-sm opacity-60 mb-4">
                Choose a network, then send the exact amount below.
              </p>

              <div className="grid grid-cols-3 gap-2 mb-5">
                {Object.entries(CHAINS).map(([key, c]) => (
                  <button
                    key={key}
                    onClick={() => setChainKey(key)}
                    className={`rounded-lg border px-2 py-2 text-xs font-bold ${
                      chainKey === key
                        ? "bg-primary text-white border-primary"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wide opacity-50 mb-2">
                  Order Summary
                </p>
                <div className="flex flex-col gap-1 text-sm max-h-32 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="opacity-80">
                        {item.name} {item.qty > 1 ? `x${item.qty}` : ""}
                      </span>
                      <span>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold border-t border-gray-300 dark:border-gray-700 mt-2 pt-2">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-300 dark:border-gray-700 p-4 mb-5">
                <p className="text-xs font-bold uppercase tracking-wide opacity-50 mb-2">
                  Exact amount due
                </p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-2xl font-extrabold">{payAmount} USDT</p>
                  <button
                    onClick={() => copy(payAmount, "amount")}
                    className="text-lg opacity-70 hover:opacity-100"
                    title="Copy amount"
                  >
                    <HiOutlineClipboardCopy />
                  </button>
                </div>
                {copied === "amount" && <p className="text-xs text-green-500 mt-1">Copied!</p>}
                <p className="text-xs text-red-500 mt-2">
                  Send exactly this amount on {chain.label}. If your wallet or exchange deducts a fee, add it on top so the received amount matches.
                </p>
              </div>

              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wide opacity-50 mb-2">
                  {chain.label} address
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${chain.address}`}
                    alt="Payment QR code"
                    className="rounded-lg border border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2">
                  <span className="text-xs break-all flex-1">{chain.address}</span>
                  <button
                    onClick={() => copy(chain.address, "addr")}
                    className="shrink-0 text-lg opacity-70 hover:opacity-100"
                    title="Copy address"
                  >
                    <HiOutlineClipboardCopy />
                  </button>
                </div>
                {copied === "addr" && <p className="text-xs text-green-500 mt-1">Copied!</p>}
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-white/5 px-4 py-3 mb-3">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-sm">Waiting for payment... detected automatically</span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-white/5 px-4 py-3">
                <span className="text-sm font-medium">Time remaining</span>
                <span className="font-mono font-bold text-lg">{formatTime(secondsLeft)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    )}
    </>
  );
};
export default CartScreen;
