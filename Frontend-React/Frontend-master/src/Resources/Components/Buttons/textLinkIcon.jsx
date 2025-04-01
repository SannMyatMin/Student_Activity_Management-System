import React from "react";

export default function TextLinkIcon({ theme, onClick, btnText, icon }) {
  return (
    <button onClick={onClick} className={`btn-readMore btn-readMore-${theme}`}>
      <span className="btn-readMore-text">
        {icon} {btnText}
      </span>
    </button>
  );
}
