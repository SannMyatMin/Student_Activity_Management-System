// React Hooks
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, isSession } from "react-router";
import Cookies from "js-cookie";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

// Components
import Button from "../Buttons/button.jsx";
import NavTextLink from "../Buttons/navTextLink.jsx";

// Resources
import profileImg from "../../Images/profile.jpg";
export default function Navbar({ theme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isUser = Cookies.get("user");
  const userName = isUser && isUser.name;
  const isAdmin = Cookies.get("admin");
  const profileImage = localStorage.getItem("pf_Image");
  const isOwnShop = Cookies.get("shopOwner") || "";
  const isOrganizer = isUser && JSON.parse(isUser).roles.includes("Organizer");
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [isNewPost, setIsNewPost] = useState(false);
  const [isOrder, setIsOrder] = useState(false);
  const [isNewShop, setIsNewShop] = useState(false);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  let navLinks;

  if (isAdmin) {
    // for admin nav
    navLinks = [
      {
        id: 1,
        name: "student",
        url: "adminDashBoard/student",
      },
      {
        id: 2,
        name: "club",
        url: "adminDashBoard/club",
      },
      {
        id: 3,
        name: "post",
        url: "adminDashBoard/post",
      },
    ];
  } else {
    navLinks = [
      {
        id: 1,
        name: "club",
        url: "club",
      },
      {
        id: 2,
        name: "fresher welcome",
        url: "foodCourt",
      },
    ];
  }

  const [open, setOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Add animation configs
  const variants = {
    hidden: {
      y: "-82%",
    },
    visible: {
      y: "0%",
    },
  };

  const transition = {
    duration: 0.8,
    ease: [0.5, 0.5, 0, 1],
  };

  const { scrollY } = useScroll();
  const lastYRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const difference = y - lastYRef.current;
    if (Math.abs(difference) > 50) {
      setIsHidden(difference > 0);
      lastYRef.current = y;
    }
  });

  const isCurrentUrl = (path) => {
    if (currentPath === path) {
      return true;
    }
  };

  const adminLogoutHandler = () => {
    Cookies.remove("admin");
    navigate("/");
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const studentLogoutHandler = () => {
    const allCookies = Cookies.get(); // Get all cookies
    Object.keys(allCookies).forEach((cookieName) => {
      Cookies.remove(cookieName, { path: "/" }); // Ensure proper removal
    });
    Cookies.remove();
    sessionStorage.removeItem("shopPfImage"); // Clear session storage
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  useEffect(() => {
    if (location.pathname === "/post") {
      setIsNewPost(false);
    }
  });

  useEffect(() => {
    if (location.pathname === "/ownerView") {
      setIsOrder(false);
    }
  });

  useEffect(() => {
    if (location.pathname === "/foodCourt") {
      setIsNewShop(false);
    }
  });

  useEffect(() => {
    const api = async () => {
      const res = await fetch("http://localhost:8080/post/getAllPosts", {
        method: "GET",
      });
      const result = await res.json();

      if (result.length > 0) {
        const sortedPosts = result.sort((a, b) => b.post_id - a.post_id);

        const latestPost = sortedPosts[0];
        const latestPostDatetime = `${latestPost.created_date} ${latestPost.created_time}`;

        const savedDatetime = localStorage.getItem("newPost");

        // Compare and update localStorage if new post is detected
        if (new Date(latestPostDatetime) > new Date(savedDatetime)) {
          setIsNewPost(true);
        } else {
          setIsNewPost(false);
        }
      }
    };

    api();
  });

  const [orderRecord, setOrderRecord] = useState({}); // stored orderRecord for shop Owner

  // fetch order records
  useEffect(() => {
    const api = async () => {
      try {
        const res = await fetch(`http://localhost:8080/shop/getOrderRecord`, {
          method: "POST",
          headers: {
            "Content-type": "Application/json",
          },
          body: JSON.stringify({ shop_name: Cookies.get("shopTitle") }),
        });
        const result = await res.json();
        const newOrder = localStorage.getItem("newOrder");

        if (newOrder && parseInt(newOrder, 10) < result.length) {
          setIsOrder(true);
        } else {
          setIsOrder(false);
        }

        setOrderRecord(result);
      } catch (error) {
        console.log(error);
      }
    };

    api();
  }, [isUser]);

  // useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const res = await fetch("http://localhost:8080/shop/getShops", {
  //           method: "GET"
  //         });
  //         const data = await res.json();
  //         const newShop = localStorage.getItem("newShop")
  //       if (newShop && parseInt(newShop, 10) < data.length) {
  //         setIsNewShop(true)
  //       } else {
  //         setIsNewShop(false)
  //       }
  //       } catch (error) {
  //         console.log(error)
  //       }
  //     }
  //     fetchData();
  //   }, [location.pathname, isUser])

  const orderCart = JSON.parse(
    localStorage.getItem(`${Cookies.get("storedShopName")}OrderList`)
  );

  return (
    <nav
      className={`nav-desktop nav-desktop-${
        isCurrentUrl("/post") ? (theme = "light") : theme
      }`}
    >
      <div
        onClick={() => {
          setOpen(!open);
        }}
        className={`overlay nav-mobile-overlay ${open ? "active" : "inactive"}`}
      ></div>
      <div className="nav-links">
        <motion.div
          animate={isHidden ? "hidden" : "visible"}
          whileHover={"visible"}
          variants={variants}
          transition={transition}
          className="nav-links-container"
        >
          <div className="nav-links-wrapper">
            <ul className="ul-desktop">
              <li>
                <Button
                  onClick={() => navigate(`/club`)}
                  btnSize={"S"}
                  btnText={"Club"}
                  btnType={theme === "dark" ? "monochrome" : "normal"}
                  active={
                    isCurrentUrl(`/club`) || isCurrentUrl(`/clubInfoPage`)
                  }
                />
              </li>
              <li>
                <Button
                  onClick={() => navigate(`/foodCourt`)}
                  btnSize={"S"}
                  btnText={"fresher welcome"}
                  btnType={theme === "dark" ? "monochrome" : "normal"}
                  active={isCurrentUrl(`/foodCourt`) || isCurrentUrl(`/shop`)}
                />
              </li>
              <li>
                <Button
                  onClick={() => {
                    navigate(`/post`);
                    setIsNewPost(false);
                  }}
                  btnSize={"S"}
                  hasNew={isNewPost}
                  btnText={"Posts"}
                  btnType={theme === "dark" ? "monochrome" : "normal"}
                  active={isCurrentUrl(`/post`)}
                />
              </li>
              {isOrganizer && (
                <li>
                  <Button
                    onClick={() => navigate(`/organizerDashBoard`)}
                    btnSize={"S"}
                    btnText={"DashBoard"}
                    btnType={theme === "dark" ? "monochrome" : "normal"}
                    active={isCurrentUrl(`/organizerDashBoard`)}
                  />
                </li>
              )}
              {(currentPath === "/shop" || currentPath === "/shop/orders") &&
                !(
                  Cookies.get("storedShopName") === Cookies.get("shopOwner")
                ) && (
                  <li>
                    <Button
                      onClick={() => navigate(`/shop/orders`)}
                      hasNew={orderCart && Object.keys(orderCart).length > 0}
                      btnSize={"S"}
                      btnText={"Cart"}
                      btnType={theme === "dark" ? "monochrome" : "normal"}
                      active={isCurrentUrl(`/shop/orders`)}
                    />
                  </li>
                )}

              {Cookies.get("shopTitle") && Cookies.get("user") && (
                <li>
                  <Button
                    onClick={() => {
                      navigate(
                        `/ownerView?shopName=${Cookies.get("shopTitle")}`
                      );
                      setIsOrder(false);
                    }}
                    hasNew={isOrder}
                    btnSize={"S"}
                    btnText={"View Orders"}
                    btnType={theme === "dark" ? "monochrome" : "normal"}
                    active={isCurrentUrl(`/ownerView`)}
                  />
                </li>
              )}
              {isAdmin && (
                <li>
                  <Button
                    onClick={() => navigate(`/adminDashBoard/student`)}
                    btnSize={"S"}
                    btnText={"DashBoard"}
                    btnType={theme === "dark" ? "monochrome" : "normal"}
                    active={
                      isCurrentUrl("/adminDashBoard") ||
                      isCurrentUrl("/adminDashBoard/student") ||
                      isCurrentUrl("/adminDashBoard/club") ||
                      isCurrentUrl("/adminDashBoard/post") ||
                      isCurrentUrl("/adminDashBoard/noti")
                    }
                  />
                </li>
              )}
            </ul>
            <div className="right-CTA-container">
              {isAdmin ? (
                <Button
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                      />
                    </svg>
                  }
                  btnType={theme === "dark" ? "monochrome" : "normal"}
                  btnSize={"M"}
                  btnText={"logout"}
                  onClick={adminLogoutHandler}
                />
              ) : isUser ? (
                <>
                  {currentPath === "/profile" ? (
                    <Button
                      onClick={studentLogoutHandler}
                      btnType={theme === "dark" ? "monochrome" : "normal"}
                      btnText={"logout"}
                      btnSize={"M"}
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                          />
                        </svg>
                      }
                    />
                  ) : (
                    <div className="profile-box">
                      <a href="#" onClick={() => navigate("/profile")}>
                        <img
                          src={`data:image/jpeg;base64,${profileImage}`}
                          alt="Profile"
                        />
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <Button
                  onClick={() => navigate("/")}
                  btnType={theme === "dark" ? "monochrome" : "normal"}
                  btnSize={"M"}
                  btnText={"login / signup"}
                  active={isCurrentUrl("/")}
                />
              )}

              {!isAdmin && (
                <div
                  className={`hamburger-wrapper ${
                    open ? "active" : "inactive"
                  }`}
                  onClick={() => {
                    setOpen(!open);
                  }}
                >
                  <div className="hamburger">
                    <div className="hamburger-bar"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className={`modal-nav-mobile ${open ? "active" : "inactive"}`}>
          <div className={`modal-block ${open ? "active" : "inactive"}`}>
            <ul className="ul-mobile">
              <span className="modal-menu">menu</span>
              <NavTextLink link={"/"} btnText={"Home"} />
              {navLinks.map((navLink) => (
                <NavTextLink
                  key={navLink.id}
                  onClick={() => {
                    setOpen(!open);
                    navigate(`/${navLink.url}`);
                  }}
                  btnText={
                    navLink.name[0].toUpperCase() + navLink.name.slice(1)
                  }
                  active={isCurrentUrl(`/${navLink.url}`)}
                />
              ))}
              {isUser ? (
                <NavTextLink
                  onClick={() => {
                    setOpen(!open);
                    navigate(`/profile`);
                  }}
                  btnText={"Profile"}
                  active={isCurrentUrl("/profile")}
                />
              ) : (
                <NavTextLink
                  onClick={() => {
                    setOpen(!open);
                    navigate(`/`);
                  }}
                  btnText={"Login / Signup"}
                  active={isCurrentUrl("/")}
                />
              )}
            </ul>
          </div>
        </div>
        <div className="modal-nav-background overlay"></div>
      </div>
    </nav>
  );
}
