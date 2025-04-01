import React from "react";

export default function FilterTag({ onClick, btnSize, btnText, btnType }) {
  return (
    <button
      onClick={onClick}
      href=""
      className={`btn-primary btn-primary-${btnType} btn-primary-${btnSize}`}
    >
      <div className="btn-text btn__original-text">
        <span>
          {btnText}
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
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </span>
      </div>
      <div className="btn-text btn__duplicate-text">
        <span>
          {btnText}
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
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </span>
      </div>
    </button>
  );
}
