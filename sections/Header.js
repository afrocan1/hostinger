/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Disclosure, Popover } from "@headlessui/react";
import { FaAngleDown } from "react-icons/fa";
import HeaderPop from "../components/HeaderPop";
import { motion, useScroll, useSpring } from "framer-motion";

import {
  HiChevronDown,
  HiOutlineShoppingCart,
  HiMenuAlt3,
  HiX,
} from "react-icons/hi";
import { MdLockOutline } from "react-icons/md";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import HeaderPop2 from "../components/HeaderPop2";
import HeaderPop3 from "../components/HeaderPop3";
import HeaderPop4 from "../components/HeaderPop4";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { getCartCount } from "@/lib/cart";
const Header = () => {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Change nav color on scroll
  const [color, setColor] = useState(false);
  const changeColor = () => {
    if (window.scrollY >= 90) {
      setColor(true);
    } else {
      setColor(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeColor);
  }, []);

      const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    setCartCount(getCartCount());
    const handleCartUpdate = () => setCartCount(getCartCount());
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const navigations = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
  ];
  const renderThemeChanger = () => {
    if (!mounted) return null;

    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      return (
        <div
          className="rounded-full border-none cursor-pointer"
          onClick={() => setTheme("light")}
        >
          <BsSunFill className="text-2xl" />
        </div>
      );
    } else {
      return (
        <div
          className="rounded-full border-none cursor-pointer"
          onClick={() => setTheme("dark")}
        >
          <BsMoonStarsFill className="text-2xl" />
        </div>
      );
    }
  };

  return (
    <>
      <motion.div
        className="progress-bar h-[3px] sticky top-0 z-50 bg-[#ff3f79]"
        style={{ scaleX }}
      />
      <header
        className={
          color
            ? "flex text-black dark:text-white sticky top-0 z-40 transition duration-75 ease-in-out items-center rounded-b-2xl justify-between bg-white dark:bg-darkGray shadow-lg h-16 md:h-20 px-5 md:px-10 py-1 md:py-4"
            : "flex text-white sticky top-0 z-40 transition duration-75 ease-in-out items-center justify-between bg-primary dark:bg-darkGray h-16 md:h-20 px-5 md:px-10 py-1 md:py-4"
        }
      >
        <div
          data-aos="zoom-in-down"
          data-aos-duration="300"
          className="flex justify-center items-center gap-5 md:gap-10 cursor-pointer"
        >
          <Link href={"/"}>
            <img
              src="/Dark Empire.png"
              alt="Logo"
              className="h-[1.5rem] md:h-[1.8rem] w-auto object-contain"
            />
          </Link>
          <div>{renderThemeChanger()}</div>
        </div>
        <div
          data-aos="zoom-in-down"
          data-aos-duration="300"
          className="hidden md:flex justify-center items-center space-x-5"
        >
          <ul className="flex justify-center items-center space-x-7 mr-4">
            <li className="cursor-pointer flex justify-center items-center mr-1">
              <HeaderPop />
            </li>
            <li className="cursor-pointer flex justify-center items-center mr-1">
              <HeaderPop2 />
            </li>
            <li className="cursor-pointer flex justify-center items-center mr-1">
              <HeaderPop3 />
            </li>
            <li className="cursor-pointer flex justify-center items-center mr-1">
              <HeaderPop4 />
            </li>
          </ul>
          {mounted && user ? (
            <>
              <Link href={"/dashboard"}>
                <button className="flex justify-center items-center gap-3 rounded-full border border-white py-1 px-5 text-xl">
                  Dashboard
                </button>
              </Link>
              <Link href={"/dashboard"}>
                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/40 cursor-pointer flex-shrink-0">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "Profile"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-sm font-bold uppercase">
                      {(user.displayName || user.email || "?").charAt(0)}
                    </div>
                  )}
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href={"/login"}>
                <button className="flex justify-center items-center gap-3 rounded-full border border-white py-1 px-5 text-xl">
                  <div>
                    <MdLockOutline className="text-2xl" />
                  </div>
                  Log In
                </button>
              </Link>
              <Link href={"/signup"}>
                <button className="flex justify-center items-center gap-3 rounded-full border border-white py-1 px-5 text-xl">
                  Sign Up
                </button>
              </Link>
            </>
          )}
                    <Link href={"/cart"}>
            <button className="flex text-xl justify-center items-center gap-3">
              <div className="relative">
                <HiOutlineShoppingCart className="text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff3f79] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              Cart
            </button>
          </Link>
        </div>
        {/* Burger icon standard */}
        <div
          data-aos="zoom-in-down"
          data-aos-duration="300"
          className="flex md:hidden gap-4 items-center"
        >
                    <Link href={"/cart"}>
            <button className="flex justify-center items-center gap-3 rounded-full">
              <div className="relative">
                <HiOutlineShoppingCart className="text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff3f79] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </Link>
          {mounted && user && (
            <Link href={"/dashboard"}>
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/40 cursor-pointer flex-shrink-0">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "Profile"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center text-xs font-bold uppercase">
                    {(user.displayName || user.email || "?").charAt(0)}
                  </div>
                )}
              </div>
            </Link>
          )}
          <button className="flex justify-center items-center gap-3 rounded-full">
            <div>
              {isOpen ? (
                <HiX className="text-2xl" onClick={() => setIsOpen(!isOpen)} />
              ) : (
                <HiMenuAlt3
                  className="text-2xl"
                  onClick={() => setIsOpen(!isOpen)}
                />
              )}
            </div>
          </button>
        </div>
      </header>
      {/* :MOBILE MENU */}
      {isOpen && (
        <div className="">
          <div
            data-aos="fade-up"
            data-aos-duration="300"
            className="fixed z-50 bg-white dark:bg-gray-100 h-screen w-screen"
          >
            {/* :FAQ */}
            <dl className="mx-auto mb-10 max-w-4xl flex flex-col items-center">
              {/* ::Accordion Panel */}
              <Disclosure>
                {({ open }) => (
                  <>
                    {/* Question */}
                    <dt
                      className={`group w-full border-t border-gray-400 text-black hover:bg-white hover:text-black ${
                        open && "bg-white text-black"
                      }`}
                    >
                      <Disclosure.Button className="py-4 px-3 w-full flex justify-between items-center">
                        <span className="text-xl font-extrabold text-left hover:text-primary">
                          Hosting
                        </span>
                        <HiChevronDown
                          className={`${
                            open && "transform rotate-180 text-white"
                          } flex-shrink-0 ml-2 w-7 h-7 text-black group-hover:text-black`}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                    </dt>
                    {/* Answer */}
                    <dd className="w-full text-base text-black px-3">
                      <Disclosure.Panel>
                        <ul className="text-base">
                          <li
                            onClick={() => {
                              setIsOpen(false);
                              router.push("/hosting/web-hosting");
                            }}
                            className="pl-8 cursor-pointer pb-3 pt-4 font-extrabold text-left hover:text-primary border-t border-gray-400 bg-gray-50"
                          >
                            Web Hosting
                          </li>
                          <li
                            onClick={() => {
                              setIsOpen(false);
                              router.push("/hosting/cloud-hosting");
                            }}
                            className="bg-gray-50 cursor-pointer pl-8 py-3 font-extrabold   text-left hover:text-primary border-y border-gray-400"
                          >
                            Cloud Hosting
                          </li>
                          <li
                            onClick={() => {
                              setIsOpen(false);
                              router.push("/hosting/wordpress-hosting");
                            }}
                            className="bg-gray-50 cursor-pointer pl-8 py-3 font-extrabold   text-left hover:text-primary"
                          >
                            WordPress Hosting
                          </li>
                        </ul>
                      </Disclosure.Panel>
                    </dd>
                  </>
                )}
              </Disclosure>
              <Disclosure>
                {({ open }) => (
                  <>
                    {/* Question */}
                    <dt
                      className={`group w-full border-t border-gray-400 text-black hover:bg-white hover:text-black ${
                        open && "bg-white text-black"
                      }`}
                    >
                      <Disclosure.Button className="py-4 px-3 w-full flex justify-between items-center">
                        <span className="text-xl font-extrabold text-left hover:text-primary">
                          VPS
                        </span>
                        <HiChevronDown
                          className={`${
                            open && "transform rotate-180 text-white"
                          } flex-shrink-0 ml-2 w-7 h-7 text-black group-hover:text-black`}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                    </dt>
                    {/* Answer */}
                    <dd className="w-full text-base text-black px-3">
                      <Disclosure.Panel>
                        <ul className="text-base">
                          <li
                            onClick={() => {
                              setIsOpen(false);
                              router.push("/vps/vps-hosting");
                            }}
                            className="pl-8 cursor-pointer pb-3 pt-4 font-extrabold text-left hover:text-primary border-t border-gray-400 bg-gray-50"
                          >
                            VPS Hosting
                          </li>
                          <li
                            onClick={() => {
                              setIsOpen(false);
                              router.push("/vps/cyberpanel-hosting");
                            }}
                            className="bg-gray-50 cursor-pointer pl-8 py-3 font-extrabold   text-left hover:text-primary border-y border-gray-400"
                          >
                            CyberPanel Hosting
                          </li>
                          <li
                            onClick={() => {
                              setIsOpen(false);
                              router.push("/vps/minecraft-hosting");
                            }}
                            className="bg-gray-50 cursor-pointer pl-8 py-3 font-extrabold   text-left hover:text-primary"
                          >
                            Minecraft Servere Hosting
                          </li>
                        </ul>
                      </Disclosure.Panel>
                    </dd>
                  </>
                )}
              </Disclosure>
              <Disclosure>
                {({ open }) => (
                  <>
                    {/* Question */}
                    <dt
                      className={`group w-full border-t border-gray-400 text-black hover:bg-white hover:text-black ${
                        open && "bg-white text-black"
                      }`}
                    >
                      <Disclosure.Button className="py-4 px-3 w-full flex justify-between items-center">
                        <span className="text-xl font-extrabold text-left hover:text-primary">
                          Email
                        </span>
                        <HiChevronDown
                          className={`${
                            open && "transform rotate-180 text-white"
                          } flex-shrink-0 ml-2 w-7 h-7 text-black group-hover:text-black`}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                    </dt>
                    {/* Answer */}
                    <dd className="w-full text-base text-black px-3">
                      <Disclosure.Panel>
                        <ul className="text-base">
                          <li
                            onClick={() => {
                              setIsOpen(false);
                              router.push("/email/google-workspace-hosting");
                            }}
                            className="pl-8 cursor-pointer pb-3 pt-4 font-extrabold text-left hover:text-primary border-t border-gray-400 bg-gray-50"
                          >
                            Google Workspace Email Hosting
                          </li>
                          <li
                            onClick={() => {
                              setIsOpen(false);
                              router.push("/email/hostinger-email-hosting");
                            }}
                            className="bg-gray-50 cursor-pointer pl-8 py-3 font-extrabold   text-left hover:text-primary"
                          >
                            Hostier Email Hosting
                          </li>
                        </ul>
                      </Disclosure.Panel>
                    </dd>
                  </>
                )}
              </Disclosure>
              <Disclosure>
                {({ open }) => (
                  <>
                    {/* Question */}
                    <dt
                      className={`group w-full border-t border-gray-400 text-black hover:bg-white hover:text-black ${
                        open && "bg-white text-black"
                      }`}
                    >
                      <Disclosure.Button className="py-4 px-3 w-full flex justify-between items-center">
                        <span className="text-xl font-extrabold text-left hover:text-primary">
                          Domain
                        </span>
                        <HiChevronDown
                          className={`${
                            open && "transform rotate-180 text-white"
                          } flex-shrink-0 ml-2 w-7 h-7 text-black group-hover:text-black`}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                    </dt>
                    {/* Answer */}
                    <dd className="w-full text-base text-black px-3">
                      <Disclosure.Panel>
                        <ul className="text-base">
                          <li className="pl-8 cursor-pointer pb-3 pt-4 font-extrabold text-left hover:text-primary border-t border-gray-400 bg-gray-50">
                            Domain Name Search
                          </li>
                          <li
                            onClick={() => {
                              setIsOpen(false);
                              router.push("/domain/whois-lookup");
                            }}
                            className="bg-gray-50 cursor-pointer pl-8 py-3 font-extrabold   text-left hover:text-primary border-y border-gray-400"
                          >
                            WHOIS Lookup
                          </li>
                          <li
                            onClick={() => {
                              setIsOpen(false);
                              router.push("/domain/domain-transfer");
                            }}
                            className="bg-gray-50 cursor-pointer pl-8 py-3 font-extrabold   text-left hover:text-primary"
                          >
                            Domain Transfer
                          </li>
                        </ul>
                      </Disclosure.Panel>
                    </dd>
                  </>
                )}
              </Disclosure>
            </dl>
            {mounted && user ? (
              <Link href={"/dashboard"}>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-3 flex justify-center items-center gap-3 rounded-full bg-primary w-10/12 mx-auto py-3 px-5 font-bold text-white transition duration-300 ease-out"
                >
                  <span>Dashboard</span>
                </button>
              </Link>
            ) : (
              <>
                <Link href={"/login"}>
                  <button className="flex justify-center items-center gap-3 rounded-full border-2 border-primary w-10/12 mx-auto py-3 px-5 font-bold hover:bg-primary text-primary hover:text-white transition duration-300 ease-out">
                    <div>
                      <MdLockOutline className="text-2xl" />
                    </div>
                    <span className=" ">Log In</span>
                  </button>
                </Link>
                <Link href={"/signup"}>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-3 flex justify-center items-center gap-3 rounded-full bg-primary w-10/12 mx-auto py-3 px-5 font-bold text-white transition duration-300 ease-out"
                  >
                    <span>Sign Up</span>
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
