/* eslint-disable @next/next/no-img-element */
import { Fragment } from "react";
import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react";
import { HiChevronDown } from "react-icons/hi";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function HeaderPop() {
  const router = useRouter();
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="cursor-pointer flex justify-center items-center mr-1 focus:outline-none focus-visible:ring-0 text-xl">
          Hosting
          <HiChevronDown className="text-2xl " />
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
       <Menu.Items className="absolute right-0 sm:-right-36 z-10 mt-4 w-[90vw] max-w-sm sm:w-96 py-6 px-6 sm:px-10 origin-top-right rounded bg-white dark:bg-lightGray shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
          <div className="w-16 absolute top-0 right-36 -mt-5 overflow-hidden inline-block">
            <div className=" h-5 w-5 bg-white dark:bg-lightGray rotate-45 transform origin-bottom-left"></div>
          </div>
          <div className="">
            <Menu.Item>
              <button
                type="button"
                onClick={() => router.push("/hosting/web-hosting")}
                className="flex w-full my-6 justify-start items-center gap-5 text-left bg-transparent border-0 p-0 text-textColor dark:text-white hover:scale-105 transition duration-200 ease-out cursor-pointer"
              >
                <img src="/assets/icons/Web Hosting.svg" alt="" />
                <div>
                  <h4 className=" text-xl md:text-xl font-extrabold ">
                    Web Hosting
                  </h4>
                  <p className="capitalize">For Small to medium website</p>
                </div>
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                type="button"
                onClick={() => router.push("/hosting/cloud-hosting")}
                className="flex w-full my-6 justify-start items-center gap-5 text-left bg-transparent border-0 p-0 text-textColor dark:text-white hover:scale-105 transition duration-200 ease-out cursor-pointer"
              >
                <img src="/assets/icons/Cloud.svg" alt="" />
                <div>
                  <h4 className=" text-xl md:text-xl font-extrabold ">
                    Cloud Hosting
                  </h4>
                  <p className="capitalize">For Large scale projects</p>
                </div>
              </button>
            </Menu.Item>
<Menu.Item>
              <button
                type="button"
                onClick={() => router.push("/hosting/wordpress-hosting")}
                className="flex w-full my-6 justify-start items-center gap-5 text-left bg-transparent border-0 p-0 text-textColor dark:text-white hover:scale-105 transition duration-200 ease-out cursor-pointer"
              >
                <img src="/assets/icons/Wordpress.svg" alt="" />
                <div>
                  <h4 className=" text-xl md:text-xl font-extrabold ">
                    Wordpress Hosting
                  </h4>
                 <p className="capitalize">
                    Optimized solutions for Wordpress Hosting
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
