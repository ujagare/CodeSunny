export const navigationConfig = {
  items: [
    { 
      label: 'Home', 
      path: '/', 
    },
    { 
      label: 'About', 
      path: '/about', 
    },
    { 
      label: 'Services', 
      path: '/services', 
    },
    { 
      label: 'Contact', 
      path: '/contact', 
    }
  ],
  breakpoint: 'md',
  animation: {
    duration: 300,
    easing: 'ease-in-out'
  },
  accessibility: {
    ariaLabel: 'Main navigation',
    toggleLabel: 'Toggle navigation menu'
  }
};