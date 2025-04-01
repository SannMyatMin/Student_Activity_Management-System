// React Hooks
import React from "react";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
// Components
import Button from "../Buttons/button.jsx";
import Tag from "../Tag/tag.jsx";

// Resources
import profileImg from "../../Images/profile.jpg";


export default function Item({available, shopName, name, price, image, inStockQuantity, isOwner, onAddToCart, buttonActive }) {
  const userName = Cookies.get("user") && JSON.parse(Cookies.get("user")).name;
  const navigate = useNavigate();
  const handleAddToCart = () => {
    const existingOrders = JSON.parse(localStorage.getItem(`${shopName}OrderList`)) || {};
    const updatedOrders = {
      ...existingOrders,
      [name]: { userName, shopName, name, price, quantity: 1, inStockQuantity: inStockQuantity, itemImage: image }
    };

    localStorage.setItem(`${shopName}OrderList`, JSON.stringify(updatedOrders));
    // Notify parent component
    onAddToCart(updatedOrders);
  }

  return (
    <div className={`item-container ${available || "inactive"}`}>
      <div className="status-bar">
        <marquee behavior="" direction="left">
          sold out
        </marquee>
      </div>
      <div className="item-container-img">
        <img src={`data:image/jpeg;base64,${image}`} alt="" />
      </div>
      <div className="item-container-content">
        <div className="item-container-text">
          <h5>{name}</h5>
          <p>{price} MMK</p>
          <p>In stock : {inStockQuantity}</p>
        </div>
        {!isOwner && 
         <Button
            btnType={"normal"}
            btnSize={"M"}
            btnText={buttonActive ? "added" : "add to cart"}
            active={buttonActive}
            onClick={() => {
              if (userName) {
               handleAddToCart()
              } else {
                navigate('/')
              }
            }}
          />
        }
        
      </div>
    </div>
  );
}
