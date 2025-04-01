import React from "react";

export default function TextLink({ btnType, btnText, onClick, disabled }) {
  return (
    <button type={btnType} className="text-link" onClick={onClick} disabled={disabled}>
      <span>{btnText}</span>
    </button>
  );
}
