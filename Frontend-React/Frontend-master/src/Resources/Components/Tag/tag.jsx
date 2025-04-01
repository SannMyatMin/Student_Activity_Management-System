import React from "react";

export default function Tag({ tagText, tagType }) {
  return (
    <div className={`tag tag-${tagType}`}>
      <span>{tagText}</span>
    </div>
  );
}
