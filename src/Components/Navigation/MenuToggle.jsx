import { useNavigation } from '../../hooks/useNavigation';

const MenuToggle = () => {
  const { isOpen, toggleMenu } = useNavigation();

  return (
    <button
      onClick={toggleMenu}
      className={`flex flex-col gap-1 cursor-pointer p-2 z-50 ${isOpen ? '' : 'md:hidden'}`}
      aria-expanded={isOpen}
      aria-label="Toggle navigation menu"
    >
      <span className={`w-6 h-0.5 bg-white transition-all duration-500 ease-in-out ${
        isOpen ? 'rotate-45 translate-y-1' : ''
      }`} />
      <span className={`w-6 h-0.5 bg-white transition-all duration-500 ease-in-out ${
        isOpen ? '-rotate-45 -translate-y-1' : ''
      }`} />
    </button>
  );
};

export default MenuToggle;