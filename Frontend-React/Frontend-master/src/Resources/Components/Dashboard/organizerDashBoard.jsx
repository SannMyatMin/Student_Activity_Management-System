// React Hooks
import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

// Components
import Button from "../Buttons/button.jsx";
import Shop from "../Shop/shopCard.jsx";
import NavTextLink from "../Buttons/navTextLink.jsx";
import Tag from "../Tag/tag.jsx";
import Notification from "../AlertBox/Notification.jsx";

// Resources
import shopImg from "../../Images/profile.jpg";
import "../../Css/_dashBoard.css";
import SearchBar from "../Buttons/SearchBar.jsx";

export default function OrganizerDashBoard() {
  const [studentData, setStudentData] = useState({});
  const [selectionData, setSelectionData] = useState([]);
  const [searchValue, setSearchValue] = useState(false);
  const [isReset, setIsReset] = useState(true);
  const [timer, setTimer] = useState("");
  const [add, setAdd] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleCountDownTime = (data) => {
    alert(`Countdown timer successfully set for ${data.timer} minutes!`);
    localStorage.removeItem("timeout");
    setTimer(data.timer);
    setIsReset(false);
    localStorage.setItem("countDownTime", data.timer);
  };

  useEffect(() => {
    const api = async () => {
      const res = await fetch("http://localhost:8080/admin/studentData", {
        method: "GET",
      });
      const result = await res.json();
      setStudentData(result);
    };
    api();
  }, []);

  useEffect(() => {
    const api = async () => {
      const res = await fetch("http://localhost:8080/organizer/getSelections", {
        method: "GET",
      });
      const result = await res.json();
      console.log(result);

      setSelectionData(result);
    };
    setAdd(false);
    api();
  }, [add]);

  const addSelection = async (studentName, gender) => {
    if (window.confirm("Are you sure want to add as selection?")) {
      try {
        const res = await fetch(
          "http://localhost:8080/organizer/addSelection",
          {
            method: "POST",
            headers: {
              "Content-type": "Application/json",
            },
            body: JSON.stringify({ name: studentName }),
          }
        );

        if (!res.ok) {
          const errorMessage = await res.text();
          console.log(errorMessage);
        }
        setAdd(true);
        await delay(1000);
        alert(
          `Successfully addedd as selection`
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onChangeSearch = (value) => {
    setSearchValue(value);
  };

  const isAlreadySelected = (name) => {
    return selectionData.some((selectionName) => selectionName.name === name);
  };

  const sortedStudentData = Object.keys(studentData)
    .sort((a, b) => {
      const isASelected = isAlreadySelected(studentData[a].name) ? 1 : 0;
      const isBSelected = isAlreadySelected(studentData[b].name) ? 1 : 0;

      // Sort selected students to the top
      return isBSelected - isASelected;
    })
    .map((key) => studentData[key]); // Get the sorted array of student data

  return (
    <section className="data-container">
      {/* for setting count down time */}
      <div className="organizer-CTA">
        <form
          className="setTimer-form"
          onSubmit={handleSubmit(handleCountDownTime)}
        >
          <div className="form-row">
            <input
              type="number"
              placeholder="Countdown Time"
              defaultValue={
                timer !== "" ? timer : localStorage.getItem("countDownTime")
              }
              {...register("timer", {
                required: "Countdown time is required",
                min: { value: 1, message: "Time must be greater than 0" },
              })}
            />

            {errors.timer && (
              <div className="alert alert-error">
                <span>{errors.timer.message}</span>
              </div>
            )}
          </div>

          <div className="form-btn-row">
            <Button
              btnSize={"M"}
              btnText={"Set"}
              btnType={"normal"}
              active={timer || localStorage.getItem("countDownTime")}
            />
            <Button
              btnSize={"M"}
              btnText={"Reset"}
              btnType={"normal"}
              type={"button"}
              active={!localStorage.getItem("countDownTime") && isReset}
              onClick={() => {
                reset();
                setTimer(false);
                setIsReset(true);
                alert("Successfully reset the timer!");
                localStorage.removeItem("countDownTime");
                localStorage.removeItem("endTime");
                localStorage.setItem("timeout", "end");
              }}
            />
          </div>
        </form>
        <Button
          btnSize={"M"}
          btnText={"Create Post"}
          btnType={"normal"}
          onClick={() => navigate("/editPost")}
        />
      </div>

      {/* for Student dashboard */}
      <div className="student-data-wrapper">
        <div className="search-bar-container">
          <SearchBar inputSearchValue={onChangeSearch} />
        </div>
        <div className="student-table-wrapper">
          <table>
            <tr>
              <th>Name</th>
              <th>RollNumber</th>
              <th>Gender</th>
              <th>Set as Selection</th>
            </tr>
            {Object.keys(sortedStudentData).map((key) => {
              let isSelected = isAlreadySelected(sortedStudentData[key].name);

              if (
                sortedStudentData[key].rollNumber.includes(searchValue) ||
                sortedStudentData[key].name.toUpperCase().includes(searchValue)
              ) {
                return (
                  <tr key={sortedStudentData[key].rollNumber}>
                    <td>{sortedStudentData[key].name}</td>
                    <td>{sortedStudentData[key].rollNumber}</td>
                    <td>{sortedStudentData[key].gender}</td>
                    <td>
                      <Button
                        btnType={"normal"}
                        btnSize={"M"}
                        btnText={isSelected ? "Added" : "Add"}
                        active={isSelected}
                        onClick={() =>
                          addSelection(
                            sortedStudentData[key].name,
                            sortedStudentData[key].gender
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              } else if (!searchValue) {
                return (
                  <tr key={sortedStudentData[key].rollNumber}>
                    <td>{sortedStudentData[key].name}</td>
                    <td>{sortedStudentData[key].rollNumber}</td>
                    <td>{sortedStudentData[key].gender}</td>
                    <td>
                      <Button
                        btnType={"normal"}
                        btnSize={"M"}
                        btnText={isSelected ? "Added" : "Add"}
                        active={isSelected}
                        onClick={() =>
                          addSelection(
                            sortedStudentData[key].name,
                            sortedStudentData[key].gender
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              }
            })}
          </table>

          <div>
            <table>
              <tr>
                <th>Selection Name</th>
                <th>RollNumber</th>
                <th>Gender</th>
              </tr>
              {Object.keys(selectionData).map((key) => (
                <tr key={selectionData[key].rollNumber}>
                  <td>{selectionData[key].name}</td>
                  <td>{selectionData[key].roll_number}</td>
                  <td>{selectionData[key].gender}</td>
                </tr>
              ))}
            </table>{" "}
          </div>
        </div>
      </div>
    </section>
  );
}
