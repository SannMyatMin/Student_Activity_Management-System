// React Hooks
import React from "react";
import { useState } from "react";

// Components
import Button from "../Buttons/button";

// Resources
import profileImg from "../../Images/profile.jpg";

export default function SelectionNoti() {
  return (
    <div className="selectionNoti-container">
      <div className="selectionNoti-content">
        <h5>Congratulation! You was chosen as a queen selection.</h5>
        <span>You can edit your profile in selection page.</span>
      </div>
      <div className="selectionNoti-CTA">
        <Button btnSize={"M"} btnType={"normal"} btnText={"go to edit"} />
      </div>
    </div>
  );
}
