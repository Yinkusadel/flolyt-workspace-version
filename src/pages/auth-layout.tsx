

import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const AuthLayout = () => {


  return (
    <div className="text-green-700">
      <Outlet />
    </div>
  );
};
