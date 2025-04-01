import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../Buttons/button.jsx";

export default function SearchBar({inputSearchValue, directory}) {
  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   inputSearchValue(inputValue);
  // };

  const onChangeSearch = (value) => {
    inputSearchValue(value)
  }

  return (
    <div className="search-bar">
      <div className="form-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <input
              type="text"
              placeholder={directory === "club" ?  "Search by club name or club founder" :"Search by roll number or student name ..."}
              onChange={(e) => {
                 onChangeSearch(e.target.value.toUpperCase())
              }}
            />
          </div>
          <div className="form-btn-row">
            {/* <Button 
             btnType={"normal"} 
             btnText={"search"} 
             btnSize={"M"}
             active={inputValue === ""}
            /> */}
          </div>
        </form>
      </div>
    </div>
  );
}
