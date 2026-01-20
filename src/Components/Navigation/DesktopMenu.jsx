import { NavLink } from 'react-router-dom';
import { useNavigation } from '../../hooks/useNavigation';
import { navigationConfig } from '../../config/navigation';

const DesktopMenu = () => {
  const { activeMenu, setActive } = useNavigation();

  return (
    <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label={navigationConfig.accessibility.ariaLabel}>
      {navigationConfig.items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={() => setActive(item.path)}
          className={`transition-colors hover:text-blue-300 ${
            activeMenu === item.path ? 'text-blue-300' : 'text-white'
          }`}
          style={{ 
            fontFamily: 'NeueMachina, sans-serif',
            fontSize: '16px',
            fontWeight: '300',
            fontStyle: 'normal',
            fontVariant: 'normal',
            textTransform: 'none',
            textDecoration: 'none',
            textAlign: 'start'
          }}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default DesktopMenu;