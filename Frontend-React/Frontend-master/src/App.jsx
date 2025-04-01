// React Hooks
import { Outlet } from "react-router";
import { ReactLenis } from "lenis/dist/lenis-react";
import { useLocation } from "react-router";
import { useEffect } from "react";
// Components
import Navbar from "./Resources/Components/Navbar/navbar.jsx";
import Login from "./Resources/Components/Login-Signup/login.jsx";
import Signup from "./Resources/Components/Login-Signup/signup.jsx";
import Footer from "./Resources/Components/Footer/footer.jsx";
import Tag from "./Resources/Components/Tag/tag.jsx";
import Profile from "./Resources/Components/Profile/profile.jsx";
import FoodCourt from "./Resources/Components/Food court/foodCourt.jsx";
import AdminDashBoard from "./Resources/Components/Dashboard/adminDashBoard.jsx";
import Shop from "./Resources/Components/Shop/shop.jsx";
// Resources



export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);  // Scroll to the top of the page
  }, [location.pathname]);

  return (
    <>
     <ReactLenis root
      options={{
        lerp: .09
      }}></ReactLenis>
      <Navbar theme={"dark"}/>
      <Outlet />
      {/* <Shop /> */}
      {/* <AdminDashBoard /> */}
      {/* Add other components as necessary */}
    </>
  );
}
