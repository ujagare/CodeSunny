import React from "react";
import { NavigationProvider } from "./contexts/NavigationContext";
import AppRoutes from "./Utils/Routes";

const App = () => {
  return (
    <NavigationProvider>
      <div id="main">
        <AppRoutes />
      </div>
    </NavigationProvider>
  );
};

export default App;
