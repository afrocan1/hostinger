import { useState } from "react";
import { HiOutlineChatAlt2, HiX, HiOutlineMail } from "react-icons/hi";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";

// Fill these in. Leave a value as "" to hide that option.
const WHATSAPP_NUMBER = "233XXXXXXXXX"; // country code + number, digits only, no + or spaces
const SUPPORT_EMAIL = "support@yourdomain.com";
const TELEGRAM_USERNAME = "yourusername"; // without the @

const SupportWidget = () => {
  const [open, setOpen] = useState(false);

  const options = [
    WHATSAPP_NUMBER && {
      label: "WhatsApp",
      detail: "Chat with us live",
      href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hello, I need help with my order."
      )}`,
      icon: <FaWhatsapp className="text-green-500 text-xl" />,
    },
    TELEGRAM_USERNAME && {
      label: "Telegram",
      detail: "Message us on Telegram",
      href: `https://t.me/${blvk_bird}`,
      icon: <FaTelegramPlane className="text-sky-500 text-xl" />,
    },
    SUPPORT_EMAIL && {
      label: "Email",
      detail: SUPPORT_EMAIL,
      href: `mailto:${SUPPORT_EMAIL}`,
      icon: <HiOutlineMail className="text-primary text-xl" />,
    },
  ].filter(Boolean);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="w-72 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkGray text-black dark:text-white shadow-2xl p-4">
          <p className="font-extrabold text-lg">Customer Care</p>
          <p className="text-sm opacity-60 mb-3">
            Need help? Pick the way that suits you best.
          </p>
          <div className="flex flex-col gap-2">
            {options.map((o) => (
              <a
                key={o.label}
                href={o.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 transition"
              >
                {o.icon}
                <span className="flex flex-col min-w-0">
                  <span className="text-sm font-bold">{o.label}</span>
                  <span className="text-xs opacity-60 truncate">{o.detail}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close customer care" : "Contact customer care"}
        className="w-14 h-14 rounded-full bg-primary text-white text-2xl flex items-center justify-center shadow-lg hover:opacity-90 transition"
      >
        {open ? <HiX /> : <HiOutlineChatAlt2 />}
      </button>
    </div>
  );
};

export default SupportWidget;
