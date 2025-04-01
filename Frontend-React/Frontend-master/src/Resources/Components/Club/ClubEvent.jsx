import React from "react";

// Resources
import TextLinkIcon from "../Buttons/textLinkIcon";


export default function ClubEvent({
  theme,
  onClick,
  title,
  eventSubject,
  clubName,
}) {
  return (
    <div className={`event-container event-container-${theme}`}>
      <h5>{title}</h5>
      <h3>{eventSubject}</h3>
      <TextLinkIcon
        icon={
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
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        }
        theme={theme}
        btnText={"read article"}
        onClick={onClick}
      />
      <h5>From  {clubName}</h5>
    </div>
  );
}
