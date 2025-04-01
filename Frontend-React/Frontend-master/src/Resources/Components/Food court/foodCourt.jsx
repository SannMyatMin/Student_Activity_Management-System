// React Hooks
import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useScroll, useTransform, motion } from "motion/react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

// Components
import Button from "../Buttons/button.jsx";
import FoodShop from "../Shop/shopCard.jsx";
import FilterTag from "../Buttons/filterTag.jsx";
import AlertBox from "../AlertBox/AlertBox.jsx";
import Slider from "../Buttons/Slider.jsx";
import WinnerCard from "./WinnerCard.jsx";
import CountDown from "./countDown.jsx";

export default function FoodCourt() {
  const container = useRef();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  const [overlayActive, setOverlayActive] = useState(false);
  const [formActive, setFormActive] = useState(false);

  const navigate = useNavigate();
  const [shopData, setShopData] = useState([]);
  const [totalShop, setTotalShop] = useState(0);
  const [selectionData, setSelectionData] = useState([]);
  const [timeOut, setTimeout] = useState(
    localStorage.getItem("selectionResult")
  );
  const [finalResult, setFinalResult] = useState([]);

  const [kingQueen, setKingQueen] = useState(true);
  const [princePrincess, setPrincePrincess] = useState(false);
  const [popular, setPopular] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("King & Queen");
  // const getCountTime = localStorage.getItem("countDownTime");
  // const countDownTime = getCountTime && parseInt(getCountTime, 10);
  const [countDownTime, setCountDownTime] = useState(
    localStorage.getItem("countDownTime")
  );
  const [isVote, setIsVote] = useState(false);
  const userCookie = Cookies.get("user");
  const userData = userCookie && JSON.parse(userCookie);
  const roles = userData && userData.roles;
  const studentName = userData && userData.name;
  const isShopOwner = Cookies.get("shopTitle");
  const isOrganizer = roles && roles.includes("Organizer");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    setCountDownTime(localStorage.getItem("countDownTime"));
  }, [countDownTime]);

  useEffect(() => {
    setTimeout(localStorage.getItem("selectionResult"));
  }, [timeOut]);

  const onVote = (bol) => {
    if (bol === isVote) {
      setIsVote(false);
    } else {
      setIsVote(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/shop/getShops", {
          method: "GET",
        });
        const data = await res.json();

        // const newShop = localStorage.getItem("newShop");

        // if (!newShop || parseInt(newShop, 10) < data.length) {
        //   localStorage.setItem("newShop", data.length);
        // }

        setShopData(data);
        setTotalShop(data.length);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const api = async () => {
      const res = await fetch("http://localhost:8080/organizer/getSelections", {
        method: "GET",
      });
      const result = await res.json();
      setSelectionData(result);
    };
    api();
  }, [isVote]);

  // Display the top section of other shops if the user is the owner
  if (isShopOwner) {
    let keyword = "Owner of";
    let shopname = roles.includes(keyword)
      ? roles.split(keyword)[1].split(",")[0].trim()
      : "";

    Cookies.set("shopOwner", shopname, { expires: 1, path: "/" });

    let ownedShop = shopData.findIndex((shop) => shop.shopName === shopname);
    if (ownedShop !== -1) shopData.unshift(...shopData.splice(ownedShop, 1));
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", studentName);
      formData.append("title", data.shopTitle);
      formData.append("description", data.shopDescription);

      const res = await fetch(`http://localhost:8080/api/submitShopForm`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        alert(errorMessage);
        return;
      }

      alert("Form submitted successfully!");
      setOverlayActive(false);
      setFormActive(false);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Form submission failed. Please try again.");
    }
  };

  const ended = (data) => {
    localStorage.setItem("selectionResult", data);
    setTimeout(data);
  };
  useEffect(() => {
    const api = async () => {
      const res = await fetch(
        "http://localhost:8080/organizer/getWonSelections",
        {
          method: "GET",
        }
      );
      const result = await res.json();
      setFinalResult(result);
    };
    if (timeOut) {
      api();
    }
  }, [timeOut]);

  const title = useRef(null);
  const { scrollYProgress: titleYProgress } = useScroll({
    target: title,
    offset: ["start end", "end start"],
  });
  const titleAnimation = useTransform(titleYProgress, [0, 1], [-320, 250]);
  const smallTitleAnimation = useTransform(titleYProgress, [0, 1], [-300, 220]);

  return (
    <>
      <div
        onClick={() => {
          setOverlayActive(false);
        }}
        className={`overlay nav-mobile-overlay ${overlayActive && "active"}`}
      ></div>
      <div className={`shopRequestForm-container ${formActive && "active"}`}>
        <div className="modal-container-CTA">
          <h5>Shop Request Form</h5>
          <div
            className="delete-btn"
            onClick={() => {
              setOverlayActive(false);
              setFormActive(false);
              reset();
            }}
          >
            <span className="delete-bar"></span>
          </div>
        </div>
        <div className="shopRequestForm-wrapper">
          <h5>
            We will use your name and email automatically as a shop owner.
          </h5>
          <div className="form-container">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-row">
                <label htmlFor="shopTitle">Shop title</label>
                <input
                  type="text"
                  placeholder="Your shop title"
                  {...register("shopTitle", {
                    required: "Shop title is required",
                  })}
                />
                {errors.shopTitle && (
                  <div className="alert alert-error">
                    <span>{errors.shopTitle.message}</span>
                  </div>
                )}
              </div>
              <div className="form-row">
                <label htmlFor="shopDescription">Shop Description</label>
                <textarea
                  type="text"
                  placeholder="Your shop description"
                  {...register("shopDescription", {
                    required: "Shop description is required",
                  })}
                />
                {errors.shopDescription && (
                  <div className="alert alert-error">
                    <span>{errors.shopDescription.message}</span>
                  </div>
                )}
              </div>
              {/* <div className="form-row">
                <input
                  type="file"
                  accept="image/*"
                  {...register("shopImage", {
                    required: "Shop image is required",
                  })}
                />
                {errors.shopImage && (
                  <div className="alert alert-error">
                    <span>{errors.shopImage.message}</span>
                  </div>
                )}
              </div> */}
              <div className="form-row">
                <Button
                  btnType={"monochrome"}
                  btnSize={"M"}
                  btnText={"Submit"}
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <AlertBox theme={"light"} desc={"Your order has been placed."} />
      <section className="foodCourt-section">
        <div className="foodCourt-container">
          <div ref={title} className="foodCourt-title-container">
            <motion.h1 style={{ y: titleAnimation }} className="big">
              shops
            </motion.h1>
            <motion.span style={{ y: smallTitleAnimation }} className="shopNum">
              ({totalShop})
            </motion.span>
          </div>
        </div>
        <div className="foodShops-container">
          <div className="foodShops-wrapper">
            {shopData.map((shop) => (
              <FoodShop
                key={shop.shopName}
                shopImg={`data:image/jpeg;base64,${shop.image}`}
                shopName={shop.shopName}
                shopType={"food"}
                shopDes={shop.description}
                isOwner={roles && shop.shopName.includes(isShopOwner)}
                onClick={() => {
                  navigate(
                    `/shop?shopName=${shop.shopName}&shopDes=${shop.description}`
                  );
                  sessionStorage.setItem(
                    "shopPfImage",
                    JSON.stringify(shop.image)
                  );
                  Cookies.set("storedShopName", shop.shopName, {
                    expires: 1,
                    path: "/",
                  });
                }}
              />
            ))}
          </div>
          {!isShopOwner && !isOrganizer && (
            <div
              onClick={() => {
                if (userCookie) {
                  setOverlayActive(!overlayActive);
                  setFormActive(!formActive);
                } else {
                  navigate("/");
                }
              }}
              className="container foodShopRequest-wrapper"
            >
              <Slider
                left="-25%"
                progress={scrollYProgress}
                text={"Join as vendor"}
                borderRadius={"bottom"}
              />
            </div>
          )}
        </div>
      </section>
      {userCookie && (
        <section className="voting-container">
          <div className="voting-title-container">
            <h2>
              Make Your <br /> Choice
            </h2>
            <div className="voting-filter-container">
              <Button
                btnText={"King and Queen"}
                btnType={"normal"}
                btnSize={"L"}
                active={kingQueen}
                onClick={() => {
                  setIsVote(!isVote);
                  setKingQueen(true);
                  setPrincePrincess(false);
                  setPopular(false);
                  setSelectedPosition("King & Queen");
                }}
              />
              <Button
                btnText={"Prince and Princess"}
                btnType={"normal"}
                btnSize={"L"}
                active={princePrincess}
                onClick={() => {
                  setIsVote(!isVote);
                  setKingQueen(false);
                  setPrincePrincess(true);
                  setPopular(false);
                  setSelectedPosition("Prince & Princess");
                }}
              />
              <Button
                btnText={"Mr. and Mrs. Popular"}
                btnType={"normal"}
                btnSize={"L"}
                active={popular}
                onClick={() => {
                  setIsVote(!isVote);
                  setKingQueen(false);
                  setPrincePrincess(false);
                  setPopular(true);
                  setSelectedPosition("Mr. & Mrs. Popular");
                }}
              />
            </div>
          </div>

          <div className="voting-results-container">
            <div className="voting-results-title">
              {!timeOut && (
                <>
                  <h4>Voting for {selectedPosition}</h4>
                  <CountDown timeLimit={countDownTime} timeout={ended} />
                </>
              )}
            </div>

            <div className="voting-results-wrapper">
              <div className="boy-voting-winner-container">
                {!timeOut && (
                  <>
                    <h4>Boys Selection</h4>
                    <div className="boy-voting-winner-wrapper">
                      {Object.keys(selectionData).map((key) => {
                        if (selectionData[key].gender === "Male") {
                          return (
                            <WinnerCard
                              key={key}
                              isClick={onVote}
                              selectionName={selectionData[key].name}
                              selectionImg={selectionData[key].image}
                              kingQueen={
                                selectedPosition === "King & Queen"
                                  ? "King"
                                  : ""
                              }
                              princePrincess={
                                selectedPosition === "Prince & Princess"
                                  ? "Prince"
                                  : ""
                              }
                              popular={
                                selectedPosition === "Mr. & Mrs. Popular"
                                  ? "Mr.Popular"
                                  : ""
                              }
                            />
                          );
                        }
                      })}
                    </div>
                  </>
                )}
              </div>
              <div className="girl-voting-winner-container">
                {!timeOut && (
                  <>
                    <h4>Girls Selection</h4>
                    <div className="girl-voting-winner-wrapper">
                      {Object.keys(selectionData).map((key) => {
                        if (selectionData[key].gender === "Female") {
                          return (
                            <WinnerCard
                              key={key}
                              isClick={onVote}
                              selectionName={selectionData[key].name}
                              selectionImg={selectionData[key].image}
                              kingQueen={
                                selectedPosition === "King & Queen"
                                  ? "Queen"
                                  : ""
                              }
                              princePrincess={
                                selectedPosition === "Prince & Princess"
                                  ? "Princess"
                                  : ""
                              }
                              popular={
                                selectedPosition === "Mr. & Mrs. Popular"
                                  ? "Mrs.Popular"
                                  : ""
                              }
                            />
                          );
                        }
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/*------------------ winner result  ----------------------*/}
            <div className="voting-results-wrapper">
              <div className="boy-voting-winner-container">
                {timeOut && (
                  <>
                    <h4>{selectedPosition === "King & Queen" && "King"}</h4>
                    <h4>
                      {selectedPosition === "Prince & Princess" && "Prince"}
                    </h4>
                    <h4>
                      {selectedPosition === "Mr. & Mrs. Popular" &&
                        "Mr. Popular"}
                    </h4>
                    <div className="boy-voting-winner-result">
                      {Object.keys(finalResult).map((key) => {
                        if (
                          selectedPosition === "King & Queen" &&
                          finalResult[key].position === "King"
                        ) {
                          return (
                            <WinnerCard
                              key={key}
                              selectionName={finalResult[key].name}
                              selectionImg={finalResult[key].image}
                              kingQueen={
                                selectedPosition === "King & Queen"
                                  ? "King"
                                  : ""
                              }
                              winner={true}
                            />
                          );
                        }
                        if (
                          selectedPosition === "Prince & Princess" &&
                          finalResult[key].position === "Prince"
                        ) {
                          return (
                            <WinnerCard
                              key={key}
                              selectionName={finalResult[key].name}
                              selectionImg={finalResult[key].image}
                              princePrincess={
                                selectedPosition === "Prince & Princess"
                                  ? "Prince"
                                  : ""
                              }
                              winner={true}
                            />
                          );
                        }
                        if (
                          selectedPosition === "Mr. & Mrs. Popular" &&
                          finalResult[key].position === "Mr.Popular"
                        ) {
                          return (
                            <WinnerCard
                              key={key}
                              selectionName={finalResult[key].name}
                              selectionImg={finalResult[key].image}
                              popular={
                                selectedPosition === "Mr. & Mrs. Popular"
                                  ? "Mr.Popular"
                                  : ""
                              }
                              winner={true}
                            />
                          );
                        }
                      })}
                    </div>
                  </>
                )}
              </div>
              <div className="girl-voting-winner-container">
                {timeOut && (
                  <>
                    <h4>{selectedPosition === "King & Queen" && "Queen"}</h4>
                    <h4>
                      {selectedPosition === "Prince & Princess" && "Princess"}
                    </h4>
                    <h4>
                      {selectedPosition === "Mr. & Mrs. Popular" &&
                        "Mrs. Popular"}
                    </h4>
                    <div className="girl-voting-winner-result">
                      {Object.keys(finalResult).map((key) => {
                        if (
                          selectedPosition === "King & Queen" &&
                          finalResult[key].position === "Queen"
                        ) {
                          return (
                            <WinnerCard
                              key={key}
                              selectionName={finalResult[key].name}
                              selectionImg={finalResult[key].image}
                              kingQueen={
                                selectedPosition === "King & Queen"
                                  ? "Queen"
                                  : ""
                              }
                              winner={true}
                            />
                          );
                        }
                        if (
                          selectedPosition === "Prince & Princess" &&
                          finalResult[key].position === "Princess"
                        ) {
                          return (
                            <WinnerCard
                              key={key}
                              selectionName={finalResult[key].name}
                              selectionImg={finalResult[key].image}
                              princePrincess={
                                selectedPosition === "Prince & Princess"
                                  ? "Princess"
                                  : ""
                              }
                              winner={true}
                            />
                          );
                        }
                        if (
                          selectedPosition === "Mr. & Mrs. Popular" &&
                          finalResult[key].position === "Mrs.Popular"
                        ) {
                          return (
                            <WinnerCard
                              key={key}
                              selectionName={finalResult[key].name}
                              selectionImg={finalResult[key].image}
                              popular={
                                selectedPosition === "Mr. & Mrs. Popular"
                                  ? "Mrs.Popular"
                                  : ""
                              }
                              winner={true}
                            />
                          );
                        }
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
