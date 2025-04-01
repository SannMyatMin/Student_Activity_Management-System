// React Hooks
import React, { useReducer, useEffect, useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import { useState } from "react";
import { useNavigate, useLocation, resolvePath } from "react-router";
import Cookies from "js-cookie";

// Components
import Button from "../Buttons/button.jsx";
import Tag from "../Tag/tag.jsx";
import Item from "./item.jsx";
import TextLinkIcon from "../Buttons/textLinkIcon.jsx";

// Resources
import profileImg from "../../Images/profile.jpg";
import ReceiptList from "./receiptList.jsx";

export default function Shop() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [isActive, setIsActive] = useState(true);
  const [receiptActive, setReceiptActive] = useState(false);

  const [itemList, setItemList] = useState({}); // stored items to display
  const [storedItem, setStoredItem] = useState({}); // stored items for edit form
  const [orderList, setOrderList] = useState({}); // stored orderList for student
  const [receiptList, setReceiptList] = useState({}); // stored receipt data
  const [buttonActive, setButtionActive] = useState({});

  //to handle loading state
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);

  // to stored data from get params
  const [shopName, setShopName] = useState(params.get("shopName"));
  const [shopDes, setShopDes] = useState(params.get("shopDes"));
  const isOwnShop = Cookies.get("shopTitle") || "";
  const userCookie = Cookies.get("user");
  const userData = userCookie && JSON.parse(userCookie);
  const roles = userData && userData.roles;
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const api = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/shop/getItemOfShop?shopName=${params.get(
            "shopName"
          )}`,
          {
            method: "GET",
            headers: {
              "Content-type": "Application/json",
            },
          }
        );
        const result = await res.json();
        if (result && result.length > 0) {
          const formattedItems = result.reduce((acc, item, index) => {
            acc[`item${index + 1}`] = {
              name: item.itemname,
              price: item.price,
              image: item.image,
              quantity: item.quantity,
            };
            return acc;
          }, {});

          setItemList(formattedItems);
        } else {
          console.log("No items returned from API");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    if (params.get("shopName")) {
      api();
    }
  }, [receiptActive]);

  useEffect(() => {
    if (Object.keys(itemList).length >= 0) {
      setStoredItem((prevItem) => {
        const newItems = { ...prevItem };
        Object.keys(itemList).forEach((key) => {
          newItems[itemList[key].name] = {
            itemName: itemList[key].name,
            price: itemList[key].price,
            image: itemList[key].image,
            quantity: itemList[key].quantity,
          };
        });
        return newItems;
      });
    }
  }, [itemList, receiptActive]);

  useEffect(() => {
    if (Object.keys(storedItem).length >= 0) {
      sessionStorage.setItem("itemList", JSON.stringify(storedItem));
    }
  }, [storedItem]);

  // for order list
  useEffect(() => {
    if (localStorage.getItem(`${shopName}OrderList`)) {
      const savedOrders = localStorage.getItem(`${shopName}OrderList`);
      if (savedOrders) {
        setOrderList(JSON.parse(savedOrders));
      }
    }
  }, [shopName]);

  const handleAddToCart = (updatedOrders) => {
    setOrderList(updatedOrders);
  };

  const afterRemoveOrder = (updatedOrders) => {
    setOrderList(updatedOrders);
  };

  const afterIncreaseQuantity = (updateQuantity) => {
    setOrderList(updateQuantity);
  };

  useEffect(() => {
    // Reset buttonActive state
    const newButtonState = {};

    Object.keys(orderList).forEach((key) => {
      newButtonState[orderList[key].name] = true;
    });

    setButtionActive(newButtonState); // Correctly updates the state
  }, [orderList]);

  const numberOfOrder =
    localStorage.getItem(`${shopName}OrderList`) &&
    Object.keys(JSON.parse(localStorage.getItem(`${shopName}OrderList`)))
      .length;

  useEffect(() => {
    if (isActive === false) {
      setIsActive(true);
      navigate(`/shop?shopName=${shopName}&shopDes=${shopDes}`);
    }
  }, [isActive, navigate, shopDes, shopName]);

  // ---------  to handle place order api and receipt-------- //
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const handlePlaceOrder = async () => {
    if (window.confirm("Do you want to place the order?")) {
      const userName =
        Cookies.get("user") && JSON.parse(Cookies.get("user")).name;
      const storedOrderList = JSON.parse(
        localStorage.getItem(`${shopName}OrderList`)
      );
      let itemList = [];
      let totalPrice = 0;
      let placeOrderList = {};

      Object.keys(storedOrderList).forEach((key) => {
        itemList.push({
          item_name: storedOrderList[key].name,
          price: storedOrderList[key].price,
          quantity: storedOrderList[key].quantity,
        });
        totalPrice =
          totalPrice +
          Number(storedOrderList[key].price) *
            Number(storedOrderList[key].quantity);
      });

      placeOrderList = {
        name: userName,
        shop_name: shopName,
        total_bill: totalPrice,
        items: itemList,
      };

      setPlaceOrderLoading(true);
      try {
        const res = await fetch("http://localhost:8080/shop/placeOrder", {
          method: "POST",
          headers: {
            "Content-type": "Application/json",
          },
          body: JSON.stringify(placeOrderList),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        const receiptData = await res.json();
        setReceiptList(receiptData);

        await delay(1000);
        alert("Your order have been placed successfully");

        navigate(`/shop?shopName=${shopName}&shopDes=${shopDes}`);
        localStorage.removeItem(`${shopName}OrderList`);
        setOrderList({});

        await delay(1000);
        setReceiptActive(true);
      } catch (error) {
        console.log(error);
        alert("Failed to place order");
      } finally {
        setPlaceOrderLoading(false);
      }
    }
  };

  const title = useRef(null);
  const { scrollYProgress: titleYProgress } = useScroll({
    target: title,
    offset: ["start end", "end start"],
  });
  const titleAnimation = useTransform(titleYProgress, [0, 1], [-450, 350]);

  return (
    <>
      {currentPath === "/shop/orders" && (
        <>
          <div
            onClick={() => {
              setIsActive(!isActive);
            }}
            className={`overlay nav-mobile-overlay ${
              isActive ? "active" : "inactive"
            }`}
          ></div>

          <div className={`order-container ${isActive && "active"}`}>
            <div className="order-container-CTA">
              <h5>On going : {numberOfOrder ? numberOfOrder : 0} Items</h5>
              <div
                className="delete-btn"
                onClick={() => {
                  setIsActive(true);
                  navigate(`/shop?shopName=${shopName}&shopDes=${shopDes}`);
                }}
              >
                <span className="delete-bar"></span>
              </div>
            </div>
            <div className="order-wrapper">
              {orderList &&
                Object.keys(orderList).map((key) => (
                  <Order
                    key={orderList[key].name}
                    shopName={shopName}
                    name={orderList[key].name}
                    price={orderList[key].price}
                    Image={orderList[key].itemImage}
                    orderList={orderList}
                    updateOrderList={afterRemoveOrder}
                    quantity={orderList[key].quantity}
                    updateQuantity={afterIncreaseQuantity}
                  />
                ))}
              {!(isOwnShop === shopName) &&
                Object.keys(orderList).length !== 0 && (
                  <Button
                    btnType={"monochrome"}
                    btnSize={"M"}
                    btnText={
                      placeOrderLoading ? "Placing order..." : "place order"
                    }
                    onClick={() => handlePlaceOrder()}
                  />
                )}
            </div>
          </div>
        </>
      )}

      {/* for student to view receipt */}
      {receiptActive && (
        <ReceiptList
          receiptList={receiptList}
          receiptActive={receiptActive}
          setReceiptActive={setReceiptActive}
        />
      )}

      <section className="shop-container">
        <div className="shop-container-wrapper">
          <div ref={title} className="shop-container-title">
            <motion.h1 style={{ y: titleAnimation }}>
              Where quality meets style – shop smarter, live better!
            </motion.h1>
          </div>
          <div className="shop-container-wrapper-info">
            <div className="shop-container-wrapper-info-container">
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
                      d="M15.75 19.5 8.25 12l7.5-7.5"
                    />
                  </svg>
                }
                btnType={"normal"}
                btnSize={"M"}
                btnText={"back"}
                onClick={() => navigate("/foodCourt")}
              />
              <h5>{shopName}</h5>
              {/* <div className="shop-types-wrapper">
                <Tag tagText={"flower"} tagType={"monochrome"} />
              </div> */}

              {isOwnShop === shopName && (
                <a href="#">
                  <Button
                    btnType={"normal"}
                    btnSize={"M"}
                    btnText={"Edit Shop"}
                    onClick={() =>
                      navigate(
                        `/editShop?shopName=${shopName}&shopDes=${shopDes}`
                      )
                    }
                  />
                </a>
              )}
              {/* <a href="#">
                <Button
                  btnType={"normal"}
                  btnSize={"M"}
                  btnText={"Edit Shop"}
                  onClick={() => navigate(`/editShop?shopName=${shopName}&shopDes=${shopDes}`)}
                />
              </a> */}
            </div>
            {/* <img src={profileImg} alt="" /> */}
          </div>
          <div className="items-wrapper">
            {Object.keys(itemList).map((key) => (
              <Item
                key={key}
                available={itemList[key].quantity !== 0}
                shopName={shopName}
                name={itemList[key].name}
                price={itemList[key].price}
                image={itemList[key].image}
                isOwner={roles && roles.includes(shopName)}
                inStockQuantity={itemList[key].quantity}
                onAddToCart={handleAddToCart}
                buttonActive={buttonActive[itemList[key].name]}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ------------------ order component ------------------ //
const Order = ({
  shopName,
  name,
  isOwnShop,
  receiptRecord,
  price,
  Image,
  date,
  orderList,
  updateOrderList,
  quantity,
  updateQuantity,
}) => {
  const removeOrder = (name) => {
    const updatedOrder = Object.fromEntries(
      Object.entries(orderList).filter(([key, value]) => value.name !== name)
    );

    localStorage.setItem(`${shopName}OrderList`, JSON.stringify(updatedOrder));

    updateOrderList(updatedOrder);
  };

  const addQuantity = (name) => {
    const newQuantity = Object.fromEntries(
      Object.entries(orderList).map(([key, value]) => {
        if (key === name && value.quantity < orderList[key].inStockQuantity) {
          return [key, { ...value, quantity: value.quantity + 1 }];
        } else {
          return [key, value];
        }
      })
    );

    localStorage.setItem(`${shopName}OrderList`, JSON.stringify(newQuantity));
    updateQuantity(newQuantity);
  };

  const reduceQuantity = (name) => {
    const newQuantity = Object.fromEntries(
      Object.entries(orderList).map(([key, value]) => {
        if (key === name && value.quantity > 1) {
          return [key, { ...value, quantity: value.quantity - 1 }];
        } else {
          return [key, value];
        }
      })
    );

    localStorage.setItem(`${shopName}OrderList`, JSON.stringify(newQuantity));

    updateQuantity(newQuantity);
  };

  return (
    <>
      <div className="order-content">
        <div className="order-content-wrapper">
          <img
            src={`data:image/jpeg;base64,${
              receiptRecord ? receiptRecord.image : Image
            }`}
            alt=""
          />
          <div className="order-content-details">
            <h5>{receiptRecord ? receiptRecord.student_name : name}</h5>
            <span>
              {isOwnShop && receiptRecord
                ? receiptRecord.date
                : price * quantity + " MMK"}{" "}
            </span>
          </div>
        </div>

        {!isOwnShop && (
          <div className="order-content-CTA">
            <div className="quantity-container">
              <TextLinkIcon
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
                      d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                }
                onClick={() => reduceQuantity(name)}
              />
              <span className="order-quantity">{quantity}</span>
              <TextLinkIcon
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
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                }
                onClick={() => addQuantity(name)}
              />
            </div>
            <Button
              btnType={"monochrome"}
              btnSize={"S"}
              btnText={"remove"}
              onClick={() => removeOrder(name)}
            />
          </div>
        )}
      </div>
    </>
  );
};
