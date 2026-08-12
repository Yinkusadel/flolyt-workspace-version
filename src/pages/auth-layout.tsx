

import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const AuthLayout = () => {


  return (
    <div >
      <Outlet />
    </div>
  );
};
