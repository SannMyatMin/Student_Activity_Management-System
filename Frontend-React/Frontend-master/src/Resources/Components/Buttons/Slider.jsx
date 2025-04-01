// React Hooks
import React, { useRef } from "react";
import { useState } from "react";
import { useScroll, useTransform, motion } from "motion/react";

const Slider = ({ left, progress, text, borderRadius }) => {
  const x = useTransform(progress, [0, 1], [-250, 250]);
  return (
    <div className={`slider-container slider-${borderRadius}-round`}>
      <motion.div className="slider-wrapper" style={{ left, x }}>
        <SliderText text={text} />
        <SliderText text={text} />
        <SliderText text={text} />
        <SliderText text={text} />
        <SliderText text={text} />
        <SliderText text={text} />
        <SliderText text={text} />
      </motion.div>
    </div>
  );
};

const SliderText = ({ text }) => {
  return (
    <div className="sliderText-wrapper">
      <h4>{text}</h4>
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
          d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
        />
      </svg>
    </div>
  );
};

export default Slider;
