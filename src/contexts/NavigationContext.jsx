import { createContext, useState } from 'react';

export const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('/');

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const setActive = (path) => setActiveMenu(path);

  return (
    <NavigationContext.Provider value={{
      isOpen,
      activeMenu,
      toggleMenu,
      closeMenu,
      setActive
    }}>
      {children}
    </NavigationContext.Provider>
  );
};