// React Hooks
import React from "react";
import { useState } from "react";

// Components
import Button from "../Buttons/button.jsx";
import Noti from "../Buttons/noti.jsx";
import Tag from "../Tag/tag.jsx";

// Resources
import profileImg from "../../Images/profile.jpg";

export default function Notification({ type, img, name, data, desc }) {
  return (
    <div className="notification">
      <div className="notification-wrapper">
        <a href="#" className="notification-content">
          <img src={img} alt="" />
          <div className="notification-text">
            <h5>{name}</h5>
            <span>Request {type} type : {data}</span>
          </div>
        </a>
        <div className="notification-CTA">
          <Button btnSize={"M"} btnType={"normal"} btnText={"approve"} />
          <Button btnSize={"M"} btnType={"normal"} btnText={"reject"} />
        </div>
      </div>
      <p>{desc}</p>
    </div>
  );
}
