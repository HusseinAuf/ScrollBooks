import BaseLayout from "./BaseLayout";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <BaseLayout>
      <div>
        <Outlet />
      </div>
    </BaseLayout>
  );
};

export default AuthLayout;
