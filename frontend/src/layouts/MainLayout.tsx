import BaseLayout from "./BaseLayout";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-4 sm:py-6 md:py-8">
        <Outlet />
      </div>
    </BaseLayout>
  );
};

export default MainLayout;
