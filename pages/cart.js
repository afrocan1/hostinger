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

const BTC_PAYMENT_ADDRESS = "15BgobKtBKaBSmYdend8qzSbVj2VS3t5b8";
const PAYMENT_WINDOW_SECONDS = 60 * 60; // 60 minutes

const CartScreen = () => {
    const [items, setItems] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [btcPrice, setBtcPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(PAYMENT_WINDOW_SECONDS);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const fetchBtcPrice = async () => {
    setPriceLoading(true);
    setPriceError(false);
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      );
      const data = await res.json();
      setBtcPrice(data.bitcoin.usd);
    } catch (err) {
      setPriceError(true);
    } finally {
      setPriceLoading(false);
    }
  };

  useEffect(() => {
    if (!showPaymentModal) return;

    setSecondsLeft(PAYMENT_WINDOW_SECONDS);
    fetchBtcPrice();

    const priceInterval = setInterval(fetchBtcPrice, 30000);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearInterval(priceInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(priceInterval);
    };
  }, [showPaymentModal]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(BTC_PAYMENT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateQty = (id, delta) => {
    setItems(updateCartQty(id, delta));
  };

  const removeItem = (id) => {
    setItems(removeFromCart(id));
  };

    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const btcAmount = btcPrice ? (subtotal / btcPrice).toFixed(8) : null;

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
              onClick={() => setShowPaymentModal(true)}
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
          <button
            onClick={() => setShowPaymentModal(false)}
            className="absolute top-4 right-4 text-2xl opacity-60 hover:opacity-100"
          >
            <HiX />
          </button>

          <h2 className="text-xl font-extrabold mb-1">Pay with Bitcoin</h2>
          <p className="text-sm opacity-60 mb-5">
            Send the exact BTC amount below to complete your order.
          </p>

          {secondsLeft === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <HiOutlineExclamationCircle className="text-5xl text-red-500" />
              <p className="font-bold">Payment window expired</p>
              <p className="text-sm opacity-60">
                This quote is no longer valid. Please start checkout again.
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
                  Amount Due
                </p>
                {priceLoading && !btcPrice ? (
                  <p className="text-sm opacity-60">Fetching live BTC price...</p>
                ) : priceError && !btcPrice ? (
                  <p className="text-sm text-red-500">
                    Couldn&apos;t fetch BTC price. Retrying...
                  </p>
                ) : (
                  <>
                    <p className="text-2xl font-extrabold">{btcAmount} BTC</p>
                    <p className="text-xs opacity-50">
                      ≈ ${subtotal.toFixed(2)} USD · 1 BTC = $
                      {btcPrice?.toLocaleString()}
                    </p>
                  </>
                )}
              </div>

              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wide opacity-50 mb-2">
                  Send to this address
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=bitcoin:${BTC_PAYMENT_ADDRESS}${
                      btcAmount ? `?amount=${btcAmount}` : ""
                    }`}
                    alt="BTC payment QR code"
                    className="rounded-lg border border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2">
                  <span className="text-xs break-all flex-1">
                    {BTC_PAYMENT_ADDRESS}
                  </span>
                  <button
                    onClick={copyAddress}
                    className="shrink-0 text-lg opacity-70 hover:opacity-100"
                    title="Copy address"
                  >
                    <HiOutlineClipboardCopy />
                  </button>
                </div>
                {copied && <p className="text-xs text-green-500 mt-1">Copied!</p>}
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-white/5 px-4 py-3">
                <span className="text-sm font-medium">Time remaining</span>
                <span className="font-mono font-bold text-lg">
                  {formatTime(secondsLeft)}
                </span>
              </div>

              <p className="text-xs opacity-50 mt-4 text-center">
                This is a placeholder payment flow. No automated confirmation
                is wired up yet.
              </p>
            </>
          )}
        </div>
      </div>
    )}
    </>
  );
};
export default CartScreen;
