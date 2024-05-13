import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const { pathname } = useLocation();

  useEffect(() => {

    console.log(`Cambiando a layout personalizado en la ruta: ${pathname}`);
  }, [pathname]);

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
