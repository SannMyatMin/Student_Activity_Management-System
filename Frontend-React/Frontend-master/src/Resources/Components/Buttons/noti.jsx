import React from "react";

export default function Noti({
  onClick,
  icon,
  btnType,
  btnSize,
  active,
  hasNew,
}) {
  return (
    <button
      onClick={onClick}
      className={`btn-primary btn-primary-${btnType} btn-primary-${btnSize} btn-primary-noti ${
        hasNew && "has-new"
      } ${active && "active"}
      ${ active && "disable" }`
      }
    >
      <div className="btn-text btn__original-text">
        <span>{icon}</span>
      </div>
      <div className="btn-text btn__duplicate-text">
        <span>{icon}</span>
      </div>
    </button>
  );
}
