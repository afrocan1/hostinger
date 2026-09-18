/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  RiFacebookBoxFill,
  RiLinkedinBoxFill,
  RiInstagramFill,
  RiTwitterFill,
  RiYoutubeFill,
} from "react-icons/ri";

const Footer = () => {
  return (
    <>
      <footer className="bg-[#f5f5ff] dark:bg-lightGray">
                <div className="container px-5 pt-24 pb-16 mx-auto flex flex-col items-center text-center">
          <div
            data-aos="zoom-in"
            data-aos-offset="100"
            data-aos-duration="400"
            className="w-full max-w-xl mx-auto text-center"
          >
                        <a className="flex title-font font-medium items-center md:justify-start text-gray-900 pb-5">
              <img
                src="/Dark Empire.png"
                alt="Logo"
                className="h-[1.8rem] md:h-[2.2rem] w-auto object-contain"
              />
            </a>
            <p className="text-indigo-900 dark:text-white hover:text-gray-500 cursor-pointer leading-tight mt-5">
              We are a web hosting company with a mission to help everyone who
              goes online succeed. We accomplish this by continuously developing
              server technology, giving expert assistance, and ensuring a
              flawless online website hosting experience.
            </p>
            
            <p className="text-textColor dark:text-white text-sm leading-tight mt-5 cursor-pointer">
              The Best There Is
            </p>
          </div>
                  </div>
        <div
          // data-aos="zoom-in"
          // data-aos-offset="100"
          // data-aos-duration="400"
          className="bg-[#f5f5ff] dark:bg-lightGray text-base text-gray-400 dark:text-white"
        >
          <div className="container border-t  border-gray-200 mx-auto py-6 px-5 flex flex-wrap flex-col sm:flex-row text">
                        <p className="md:text-center sm:text-left">
              © 2026 Dark Empire. All rights reserved.
            </p>
            <p className="inline-flex sm:ml-auto sm:mt-0 mt-5 justify-start">
              Prices are listed without VAT
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
