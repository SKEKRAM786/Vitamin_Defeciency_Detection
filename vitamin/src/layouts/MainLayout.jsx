import HealthChatbot from "../components/HealthChatbot";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      {/* Page Content */}
      <Outlet />

      {/* Side Chatbot */}
      <HealthChatbot />
    </>
  );
}

export default MainLayout;
