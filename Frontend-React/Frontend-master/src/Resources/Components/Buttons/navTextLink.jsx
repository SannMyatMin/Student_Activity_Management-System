import React from "react";

export default function NavTextLink({ onClick, btnText, active }) {
  return (
    <li className={`${ active && "active" } `}>
      <a href="#" onClick={onClick}>
        <span>{btnText}</span>
      </a>
    </li>
  );
}
