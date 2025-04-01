import React from "react";

export default function Button({
  onClick,
  btnType,
  type,
  btnSize,
  btnText,
  icon,
  active,
  hasNew,
}) {
  return (
      <button
        type={type}
        onClick={onClick}
        disabled={active}
        className={`btn-primary btn-primary-${btnType} btn-primary-${btnSize} 
      ${active && "active"} 
      ${active && "disable"}
      ${hasNew && "has-new"}`
        }>
        <div className="btn-text btn__original-text">
          <span>
            {icon} {btnText}
          </span>
        </div>
        <div className="btn-text btn__duplicate-text">
          <span>
            {icon} {btnText}
          </span>
        </div>
      </button>

  );
}
