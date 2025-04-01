// React Hooks
import React, { useRef } from "react";
import { useState } from "react";
import { useScroll, useTransform, motion } from "motion/react";

// Components
import Button from "../Buttons/button.jsx";
import FoodShop from "../Shop/shopCard.jsx";
import FilterTag from "../Buttons/filterTag.jsx";
import Slider from "../Buttons/Slider.jsx";

export default function AlertBox({ theme, desc, active }) {
  return (
    <div
      className={`alertBox-container alertBox-container-${theme} ${
        active && "active"
      }`}
    >
      <h3>{desc}</h3>
      <div className="alertBox-CTA">
        <Button btnSize={"M"} btnType={"monochrome"} btnText={"view"} />
        <Button btnSize={"M"} btnType={"monochrome"} btnText={"close"} />
      </div>
    </div>
  );
}
