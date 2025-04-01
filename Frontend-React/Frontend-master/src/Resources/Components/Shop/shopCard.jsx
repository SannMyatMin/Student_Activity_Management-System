// React Hooks
import React, { useEffect } from "react";
import { useState } from "react";

// Components
import Button from "../Buttons/button.jsx";

// Resources

export default function FoodShop({ shopName, shopDes, shopType, shopImg, onClick, isOwner }) {
  return (

    <div className="shop-item"  onClick={onClick}>
        <img src={shopImg} alt="" className="shopImg" />
        <div className="shop-content-container">
          <h4>{shopName} {isOwner && "( Owner )"}</h4>
          <h5>{shopDes}</h5>
        </div>
    </div>
  );
}
