import React from "react";
import { Poppins, Caveat } from "next/font/google";
import { FaCircleUser } from "react-icons/fa6";
import Image from "next/image";

const poppinsFont = Poppins({ subsets: ["latin"], weight: "400" });
const caveatFont = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function Header() {
  return (
    <div
      className={`w-full py-2 px-18 flex flex-row items-center justify-between z-50 fixed backdrop-blur-2xl opacity-100 bg-white/70`}
    >
      <div className="flex flex-row items-center justify-center gap-x-4">
        <Image
          src="/resq-forces.png" // Your logo path
          alt="Rosterly Background"
          className="object-cover" // Subtle 10% opacity
          quality={50} // Optimizes performance
          width={95}
          height={95}
          priority
        />
        <span className={`font-[700] ${caveatFont.className} text-4xl`}>
          ResQ-Forces
        </span>
      </div>
      <div className="flex flex-row items-center justify-center gap-x-6">
        <span className="font-medium text-gray-500 text-xl hover:cursor-pointer">
          FAQ
        </span>
        <FaCircleUser size={30} />
      </div>
    </div>
  );
}

export default Header;
