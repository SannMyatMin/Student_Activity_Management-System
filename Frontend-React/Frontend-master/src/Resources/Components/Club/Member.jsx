import React from "react";

// Components
import Tag from "../Tag/tag";

export default function Member({ img, name, role }) {
  return (
    <div className="member-container">
      <img src={img} alt="" />
      <div className="member-text">
        <h5>{name}</h5>
        <Tag tagText={role} tagType={"normal"} />
      </div>
    </div>
  );
}
