import React from "react";
import logo from "../assets/images/Logo.png";
import DesktopMenu from "./Navigation/DesktopMenu";
import MobileMenu from "./Navigation/MobileMenu";
import MenuToggle from "./Navigation/MenuToggle";

const Navbar = () => {
  return (
    <header className="w-full h-20 relative text-white bg-transparent">
      <div className="w-full h-full flex items-center justify-between px-4 md:px-16">
        <img
          className="w-fit h-8 md:h-10 flex-shrink-0"
          src={logo}
          alt="Company Logo"
        />
        <DesktopMenu />
        <MenuToggle />
      </div>
      <MobileMenu />
    </header>
  );
};

export default Navbar;
