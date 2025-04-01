// AdminDashBoard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
// Components
import Button from "../Buttons/button.jsx";
import Shop from "../Shop/shopCard.jsx";
import NavTextLink from "../Buttons/navTextLink.jsx";
import Tag from "../Tag/tag.jsx";
import AdminNotification from "../AlertBox/AdminNotification.jsx";
import SearchBar from "../Buttons/SearchBar.jsx";
import shopImg from "../../Images/profile.jpg";
import PostForm from "./postForm.jsx";

export default function AdminDashBoard() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUrl = location.pathname;
  const blankMsg = "Please enter a name.";
  const [formActive, setFormActive] = useState(false);

  const isAdmin = Cookies.get("admin");
  const adminData = isAdmin && JSON.parse(isAdmin);

  // States
  const [clubName, setClubName] = useState("");
  const [studentData, setStudentData] = useState({});
  const [clubData, setClubData] = useState({});
  const [reqClubData, setReqClubData] = useState(null);
  const [createPost, setCreatePost] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [searchValue, setSearchValue] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [overlayActive, setOverlayActive] = useState(false);
  const [articleActive, setArticleActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  // Functions

  const handleClub = (name) => {
    setClubName(name);
  };

  const buttonText = (role) => {
    return role.includes(" Organizer") ? "Remove" : "Add";
  };

  const apiResponse = async (dir) => {
    const res = await fetch(`http://localhost:8080/admin/${dir}`, {
      method: "GET",
    });
    const result = await res.json();
    return result;
  };

  // Fetch student data from the server
  useEffect(() => {
    const fetchData = async () => {
      const studentData = await apiResponse("studentData");
      const clubData = await apiResponse("clubs");

      // Sort studentData so that students with "Organizer" role are moved to the top
      const sortedStudentData = studentData.sort((a, b) => {
        const isAOrganizer = a.role.includes("Organizer") ? 1 : 0;
        const isBOrganizer = b.role.includes("Organizer") ? 1 : 0;

        return isBOrganizer - isAOrganizer; // Sorts in descending order (Organizer on top)
      });

      setStudentData(sortedStudentData);
      setClubData(clubData);
    };
    fetchData();
  }, [updateTrigger]);

  // Ensure each student's role is stored as an array
  Object.keys(studentData).forEach((key) => {
    if (typeof studentData[key].role === "string") {
      studentData[key].role = studentData[key].role.split(",");
    }
  });

  const organizerApi = async (data, dir) => {
    const res = await fetch(`http://localhost:8080/admin/${dir}`, {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.text();
    return result;
  };

  // Handler to add or remove a student as an organizer
  const handleAddOrganizer = async (btnText, studentMail) => {
    try {
      if (btnText === "Add") {
        const result = await organizerApi(
          { mail: studentMail },
          "addOrganizer"
        );
      } else if (btnText === "Remove") {
        const result = await organizerApi(
          { mail: studentMail },
          "removeOrganizer"
        );
      }

      // Trigger a re-fetch of data
      setUpdateTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating organizer status:", error);
    }
  };

  // Reset club selection if current URL is for students
  useEffect(() => {
    if (currentUrl === "/adminDashBoard/student") {
      setClubName("");
    }
  }, [currentUrl]);

  // to fetch club request form data
  useEffect(() => {
    const api = async () => {
      const res = await fetch("http://localhost:8080/admin/getReqClubs", {
        method: "GET",
      });
      const result = await res.json();
      setReqClubData(result);
    };
    api();
  }, []);

  const onChangeSearch = (value) => {
    setSearchValue(value);
  };

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const isCurrentUrl = (path) => {
    if (currentPath === path) {
      return true;
    }
  };

  const handleAddStudentForm = async (data) => {
    setIsSubmitLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/admin/addStudent`, {
        method: "POST",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify({
          name: data.studentName,
          roll_number: data.rollNumber,
          mail: data.email,
          gender: data.gender,
        }),
      });

      const result = await res.text();

      alert(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitLoading(true);
    }
  };

  return (
    <>
      {/* ------------ add student form ----------- */}
      <div
        onClick={() => {
          setOverlayActive(false);
        }}
        className={`overlay nav-mobile-overlay ${overlayActive && "active"}`}
      ></div>
      <div className={`shopRequestForm-container ${formActive && "active"}`}>
        <div className="modal-container-CTA">
          <h5>Add Student Form</h5>
          <div
            className="delete-btn"
            onClick={() => {
              setOverlayActive(false);
              setFormActive(false);
              reset();
            }}
          >
            <span className="delete-bar"></span>
          </div>
        </div>
        <div className="shopRequestForm-wrapper">
          <div className="form-container">
            <form onSubmit={handleSubmit(handleAddStudentForm)}>
              <div className="form-row">
                <label htmlFor="studentName">Student Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  {...register("studentName", {
                    required: "Student name is required",
                  })}
                />
                {errors.studentName && (
                  <div className="alert alert-error">
                    <span>{errors.studentName.message}</span>
                  </div>
                )}
              </div>

              <div className="form-row">
                <label htmlFor="rollNumber">Roll Number</label>
                <input
                  type="text"
                  placeholder="Enter your roll number"
                  {...register("rollNumber", {
                    required: "Roll number is required",
                  })}
                />
                {errors.rollNumber && (
                  <div className="alert alert-error">
                    <span>{errors.rollNumber.message}</span>
                  </div>
                )}
              </div>

              <div className="form-row">
                <label htmlFor="gender">Gender</label>
                <select
                  {...register("gender", {
                    required: "Gender is required",
                  })}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && (
                  <div className="alert alert-error">
                    <span>{errors.gender.message}</span>
                  </div>
                )}
              </div>

              <div className="form-row">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <div className="alert alert-error">
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>

              <div className="form-row">
                <Button
                  btnType={"monochrome"}
                  btnSize={"M"}
                  btnText={isSubmitLoading ? "Adding" : "Add"}
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <section className="data-container">
        <div className="adminDashboard-CTA">
          <Button
            onClick={() => navigate(`/adminDashBoard/student`)}
            btnSize={"S"}
            btnText={"Student"}
            btnType={"normal"}
            active={isCurrentUrl(`/adminDashBoard/student`)}
          />
          <Button
            onClick={() => navigate(`/adminDashBoard/club`)}
            btnSize={"S"}
            btnText={"Club"}
            btnType={"normal"}
            active={isCurrentUrl(`/adminDashBoard/club`)}
          />
          <Button
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
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            }
            hasNew={reqClubData && reqClubData.length !== 0 ? true : false}
            btnSize={"S"}
            btnType={"normal"}
            active={isCurrentUrl(`/adminDashBoard/noti`)}
            onClick={() => navigate("/adminDashBoard/noti")}
          />
        </div>

        {(currentUrl === "/adminDashBoard/student" ||
          currentUrl === "/adminDashBoard") && (
          <>
            <div className="student-data-wrapper">
              <div className="search-bar-container">
                <SearchBar inputSearchValue={onChangeSearch} />
                <Button
                  btnSize={"M"}
                  btnText={"Add Student"}
                  btnType={"normal"}
                  onClick={() => {
                    setOverlayActive(!overlayActive);
                    setFormActive(!formActive);
                  }}
                />
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>RollNumber</th>
                    <th>Role</th>
                    <th>Set as a organizer</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData &&
                    Object.keys(studentData).map((key) => {
                      if (
                        studentData[key].rollNumber.includes(searchValue) ||
                        studentData[key].name
                          .toUpperCase()
                          .includes(searchValue)
                      ) {
                        return (
                          <tr key={key}>
                            <td>{studentData[key].name}</td>
                            <td>{studentData[key].mail}</td>
                            <td>{studentData[key].rollNumber}</td>
                            <td>
                              <div className="role-wrapper">
                                {studentData[key].role.map((role, index) => (
                                  <Tag
                                    key={index}
                                    tagText={role}
                                    tagType={"normal"}
                                  />
                                ))}
                              </div>
                            </td>
                            <td>
                              <Button
                                btnType={"normal"}
                                btnSize={"M"}
                                btnText={buttonText(studentData[key].role)}
                                onClick={() =>
                                  handleAddOrganizer(
                                    buttonText(studentData[key].role),
                                    studentData[key].mail
                                  )
                                }
                              />
                            </td>
                          </tr>
                        );
                      } else if (!searchValue) {
                        return (
                          <tr key={key}>
                            <td>{studentData[key].name}</td>
                            <td>{studentData[key].mail}</td>
                            <td>{studentData[key].rollNumber}</td>
                            <td>
                              <div className="role-wrapper">
                                {studentData[key].role.map((role, index) => (
                                  <Tag
                                    key={index}
                                    tagText={role}
                                    tagType={"normal"}
                                  />
                                ))}
                              </div>
                            </td>
                            <td>
                              <Button
                                btnType={"normal"}
                                btnSize={"M"}
                                btnText={buttonText(studentData[key].role)}
                                onClick={() =>
                                  handleAddOrganizer(
                                    buttonText(studentData[key].role),
                                    studentData[key].mail
                                  )
                                }
                              />
                            </td>
                          </tr>
                        );
                      }
                    })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Club Dashboard - Shop list */}
        {currentUrl === "/adminDashBoard/club" && !clubName && (
          <div className="club-data-wrapper">
            <div className="search-bar-container">
              <SearchBar inputSearchValue={onChangeSearch} directory={"club"} />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Club_Name</th>
                  <th>Club_Founder</th>
                  <th>Number_of_Member</th>
                  <th>Created_date</th>
                </tr>
              </thead>
              <tbody>
                {studentData &&
                  Object.keys(clubData).map((key) => {
                    if (
                      clubData[key].club_name
                        .toUpperCase()
                        .includes(searchValue) ||
                      clubData[key].club_founder
                        .toUpperCase()
                        .includes(searchValue)
                    ) {
                      return (
                        <tr key={key}>
                          <td>{clubData[key].club_name}</td>
                          <td>{clubData[key].club_founder}</td>
                          <td>{clubData[key].number_of_members}</td>
                          <td>{clubData[key].created_date}</td>
                        </tr>
                      );
                    } else if (!searchValue) {
                      return (
                        <tr key={key}>
                          <td>{clubData[key].club_name}</td>
                          <td>{clubData[key].club_founder}</td>
                          <td>{clubData[key].number_of_members}</td>
                          <td>{clubData[key].created_date}</td>
                        </tr>
                      );
                    }
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* Club Dashboard - Club Details */}
        {clubName && currentUrl === "/adminDashBoard/club" && (
          <div className="club-data-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Club_Name</th>
                  <th>Club_Founder</th>
                  <th>Number_of_Member</th>
                  <th>Created_date</th>
                </tr>
              </thead>
              <tbody>
                {studentData &&
                  Object.keys(clubData).map((key) => (
                    <tr key={key}>
                      <td>{clubData[key].club_name}</td>
                      <td>{clubData[key].club_founder}</td>
                      <td>{clubData[key].number_of_members}</td>
                      <td>{clubData[key].created_date}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* for create post dashboard  */}
        {currentUrl === "/adminDashBoard/post" && (
          <div className="post-create-wrapper">
            <div className="post-data-wrapper-content">
              <h5>Posts</h5>
              <Button
                btnType={"normal"}
                btnSize={"M"}
                btnText={"create"}
                active={createPost}
                onClick={() => setCreatePost(true)}
              />
            </div>
            <div className="form-container">
              <PostForm buttonName={"Update"} />
              {createPost && <PostForm buttonName={"Create"} />}
            </div>
          </div>
        )}

        {/* for notifications */}
        {currentUrl === "/adminDashBoard/noti" && (
          <div className="adminNoti-container">
            {isAdmin &&
              reqClubData &&
              reqClubData.map((reqData) => (
                <div className="adminNoti-wrapper">
                  <AdminNotification
                    type={"Club"}
                    img={reqData.student_image}
                    name={reqData.student_name}
                    clubName={reqData.club_name}
                    desc={reqData.description}
                  />
                </div>
              ))}
          </div>
        )}
      </section>
    </>
  );
}
