/* eslint-disable @next/next/no-img-element */
import { Fragment } from "react";
import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react";
import { HiChevronDown } from "react-icons/hi";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function HeaderPop3() {
  const router = useRouter();
  const isActive = router.pathname.startsWith("/email");

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className={`relative cursor-pointer flex justify-center items-center mr-1 focus:outline-none focus-visible:ring-0 text-xl transition-colors duration-200 ${
            isActive ? "text-primary dark:text-primary font-bold" : ""
          }`}
        >
          Email
          <HiChevronDown className="text-2xl " />
          {isActive && (
            <span className="absolute -bottom-2 left-0 right-6 h-[3px] rounded-full bg-primary" />
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 sm:-right-44 z-10 mt-4 w-[90vw] max-w-md sm:w-[28rem] py-6 px-6 sm:px-10 origin-top-right rounded bg-white dark:bg-lightGray shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
          <div className="w-16 absolute top-0 right-40 -mt-5 overflow-hidden inline-block">
            <div className=" h-5 w-5 bg-white dark:bg-lightGray rotate-45 transform origin-bottom-left"></div>
          </div>
          <div className="">
            <Menu.Item>
              <button
                type="button"
                onClick={() => router.push("/email/google-workspace-hosting")}
                className="flex w-full my-6 justify-start items-center gap-5 text-left bg-transparent border-0 p-0 text-textColor dark:text-white hover:scale-105 transition duration-200 ease-out cursor-pointer"
              >
                <img src="/assets/icons/Google.svg" alt="" />
                <div>
                  <h4 className=" text-xl md:text-xl font-extrabold ">
                    Google Workspace Email Hosting
                  </h4>
                  <p className="capitalize">
                    get custom image and 30GB storage
                  </p>
                </div>
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                type="button"
                onClick={() => router.push("/email/hostinger-email-hosting")}
                className="flex w-full my-6 justify-start items-center gap-5 text-left bg-transparent border-0 p-0 text-textColor dark:text-white hover:scale-105 transition duration-200 ease-out cursor-pointer"
              >
                <img src="/assets/icons/Email.svg" alt="" />
                <div>
                  <h4 className=" text-xl md:text-xl font-extrabold ">
                    Hostinger Email Hosting
                  </h4>
                  <p className="capitalize">
                    Promote your business with every outreach
                  </p>
                </div>
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
