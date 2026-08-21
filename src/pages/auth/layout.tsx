

import { Outlet } from "react-router-dom";

export const AuthLayout = () => {


  return (
    <div className="min-h-dvh bg-paper">
      <Outlet />
    </div>
  );
};
