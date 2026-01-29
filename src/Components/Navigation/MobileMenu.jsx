import { NavLink } from "react-router-dom";
import { useNavigation } from "../../hooks/useNavigation";
import { navigationConfig } from "../../config/navigation";
import { useEffect } from "react";

const MobileMenu = () => {
  const { isOpen, closeMenu, activeMenu, setActive } = useNavigation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLinkClick = (path) => {
    setActive(path);
    closeMenu();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 md:hidden transition-opacity duration-500 ease-in-out z-[999] ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenu}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-gradient-to-r from-[#000000] to-[#0a0a2e] shadow-lg md:hidden transition-transform duration-500 ease-in-out z-[1000] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-white/20 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white">Menu</h2>
          <button
            onClick={closeMenu}
            className="flex flex-col justify-center items-center w-8 h-8 cursor-pointer relative"
          >
            <span className="absolute w-6 h-0.5 bg-white transition-all duration-300 ease-in-out rotate-45" />
            <span className="absolute w-6 h-0.5 bg-white transition-all duration-300 ease-in-out -rotate-45" />
          </button>
        </div>
        <nav
          className="py-4"
          role="navigation"
          aria-label={navigationConfig.accessibility.ariaLabel}
        >
          {navigationConfig.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => handleLinkClick(item.path)}
              className={`block px-6 py-3 text-white hover:bg-white/10 transition-colors font-medium text-2xl ${
                activeMenu === item.path
                  ? "bg-white/20 text-white border-r-2 border-white"
                  : ""
              }`}
              style={{ fontFamily: "NeueMachina, sans-serif" }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;
