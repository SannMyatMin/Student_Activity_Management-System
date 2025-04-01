// React Hooks
import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import Cookies from "js-cookie";
// Components
import Button from "../Buttons/button.jsx";
import EditForm from "./editForm.jsx";

export default function EditClub() {
  const navigate = useNavigate();
  const location = useLocation();
  const userCookie = Cookies.get("user");
  const userData = userCookie && JSON.parse(userCookie);
  const userName = userData.name;
  const params = new URLSearchParams(location.search);

  const [createForm, setCreateForm] = useState(false);
  const [clubMembers, setClubMembers] = useState([]);

  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [clubPostList, setClubPostList] = useState([]);
  const [clubMemberList, setClubMemberList] = useState({}); // Store members per club
  const [storedClubPosts, setStoredClubPosts] = useState({});
  const [btnText, setbtnText] = useState("");
  const [isMember, setIsMember] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [remove, setRemove] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/club/getClubMembers", {
          method: "POST",
          headers: {
            "Content-type": "Application/json",
          },
          body: JSON.stringify({ club_name: params.get("clubName") }),
        });
        const data = await res.json();
        setClubMembers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [remove]);

  function base64ToBlob(base64, mimeType = "image/png") {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  useEffect(() => {
    if (localStorage.getItem(`${userName}clubName`)) {
      setbtnText("Create");
    } else {
      setbtnText("Update");
    }
  }, []);

  // for edit shop name and description
  const handleEditClub = async (data) => {
    setIsUpdateLoading(true);

    if (localStorage.getItem(`${userName}clubName`)) {
      console.log("Approve");
      const res = await handleApprove();
      if (!res.ok) {
        alert("Not ok");
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("old_name", params.get("clubName"));
      formData.append("new_name", data.clubName);
      formData.append("title", data.clubTitle);
      formData.append("description", data.clubDescription);

      // Check if both input image and sessionStorage image are missing
      if (
        (!data.clubImage || data.clubImage.length === 0) &&
        !sessionStorage.getItem("clubPfImage")
      ) {
        alert("Please provide an image.");
        setIsUpdateLoading(false);
        return;
      }

      // Append image if provided
      if (data.clubImage && data.clubImage.length > 0) {
        formData.append("image", data.clubImage[0]);
      } else if (sessionStorage.getItem("clubPfImage")) {
        const blob = base64ToBlob(
          JSON.parse(sessionStorage.getItem("clubPfImage"))
        );
        formData.append("image", blob, "defaultImage.png");
      }

      const res = await fetch("http://localhost:8080/club/updateClub", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      if (btnText === "Create") {
        alert("Created successfully");
      } else {
        alert("Updated successfully");
      }

      localStorage.removeItem(`${userName}club`);
      localStorage.removeItem(`${userName}clubName`);
      localStorage.removeItem(`${userName}Des`);
      sessionStorage.removeItem(`${userName}Approve`);

      navigate(
        `/club?clubName=${data.clubName}&clubDes=${
          data.clubTitle
        }&date=${params.get("date")}`
      );
    } catch (error) {
      console.log(error);
      alert("Fail to update");
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const res = await fetch(`http://localhost:8080/admin/approveClub`, {
        method: "POST",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify({
          name: userName,
          club_name: params.get("clubName"),
        }),
      });

      const result = await res.text();
      if (!res.ok) {
        const errorMessage = result;
        throw new Error(errorMessage);
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const api = async () => {
      const res = await fetch("http://localhost:8080/post/getAllPosts", {
        method: "GET",
      });
      const result = await res.json();

      setClubPostList([]);

      Object.keys(result).forEach((key) => {
        const post = result[key];
        if (post.visibility === "Club" || post.visibility === "clubEvent") {
          if (
            post.poster_name === Cookies.get("clubOwner") ||
            isMember.has(post.poster_name)
          ) {
            setClubPostList((prevClubPosts) => [...prevClubPosts, post]);
          }
          fetchData(post.poster_name); // Fetch members for each club post
        }
      });
    };

    api();
  }, [isMember, createForm]);

  const handlePostRemoval = (postId) => {
    setStoredClubPosts((prevList) => {
      const newList = { ...prevList };
      delete newList[postId];
      sessionStorage.setItem("clubPostList", JSON.stringify(newList));
      return newList;
    });
  };

  useEffect(() => {
    // Iterating over the clubMemberList
    Object.keys(clubMemberList).forEach((key) => {
      clubMemberList[key].forEach((member) => {
        if (member.name === userName) {
          setIsMember((prevSet) => {
            const updatedSet = new Set(prevSet);
            updatedSet.add(key); // Add the key to the Set
            return updatedSet; // Return the updated Set
          });
        }
      });
    });
  }, [clubMemberList, userName]); // Include userName as dependency

  const fetchData = async (clubName) => {
    if (!clubMemberList[clubName]) {
      // Fetch only if not already fetched
      try {
        const res = await fetch("http://localhost:8080/club/getClubMembers", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ club_name: clubName }),
        });
        const data = await res.json();
        // Store members for this club
        setClubMemberList((prevList) => ({
          ...prevList,
          [clubName]: data,
        }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (Object.keys(clubPostList).length >= 0) {
      setStoredClubPosts((prevItem) => {
        const newItems = { ...prevItem };
        Object.keys(clubPostList).forEach((key) => {
          newItems[clubPostList[key].post_id] = {
            post_id: clubPostList[key].post_id,
            title: clubPostList[key].title,
            image: clubPostList[key].image,
            content: clubPostList[key].content,
            caption: clubPostList[key].caption,
            visibility: clubPostList[key].visibility,
          };
        });
        return newItems;
      });
    }
  }, [clubPostList]);

  useEffect(() => {
    if (Object.keys(storedClubPosts).length >= 0) {
      sessionStorage.setItem("clubPostList", JSON.stringify(storedClubPosts));
    }
  }, [storedClubPosts, clubPostList]);

  // const handleApprove = async () => {
  //     if (window.confirm("Are you sure want to Approve?")) {
  //         try {
  //             const res = await fetch(`http://localhost:8080/admin/approveClub`, {
  //                 method: "POST",
  //                 headers: {
  //                     "Content-type": "Application/json"
  //                 },
  //                 body: JSON.stringify({ name: userName, club_name: params.get("clubName") })
  //             });

  //             const result = await res.text();
  //             if (!res.ok) {
  //                 const errorMessage = result;
  //                 throw new Error(errorMessage);
  //             }

  //             await delay(1000);
  //             await delay(1000);
  //             alert(`${params.get("clubName")} ${result}`)
  //         } catch (error) {
  //             console.log(error);
  //         }
  //     }
  // }

  const handleRemoveMember = async (memberName) => {
    if (
      window.confirm(`Are you sure want to remove ${memberName} from club ?`)
    ) {
      const res = await fetch(`http://localhost:8080/club/removeFromClub`, {
        method: "POST",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify({
          student_name: memberName,
          club_name: params.get("clubName"),
        }),
      });
      if (!res.ok) {
        const errorMessage = await res.text();
        console.log(errorMessage);
      }
      setRemove(true);
      await delay(500);
      alert(`Successfully remove ${memberName} from your club`);
    }
  };

  return (
    <section className="editClub-container-CTA">
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
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        }
        btnType={"normal"}
        btnSize={"M"}
        btnText={"back"}
        onClick={() =>
          navigate(
            `/clubInfoPage?clubName=${params.get(
              "clubName"
            )}&clubTitle=${params.get("clubTitle")}&clubDes=${params.get(
              "clubDes"
            )}&date=${params.get("date")}`
          )
        }
      />
      <div className="editClub-content">
        <div className="form-container">
          <form onSubmit={handleSubmit(handleEditClub)}>
            <div className="form-row">
              <label htmlFor="clubName">Club Name</label>
              <input
                type="text"
                defaultValue={params.get("clubName")}
                {...register("clubName", { required: "Club Name is required" })}
              />
              {errors.clubName && (
                <div className="alert alert-error">
                  <span>{errors.clubName.message}</span>
                </div>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="clubName">Club Title</label>
              <input
                type="text"
                defaultValue={params.get("clubTitle")}
                {...register("clubTitle", {
                  required: "Club Title is required",
                })}
              />
              {errors.clubTitle && (
                <div className="alert alert-error">
                  <span>{errors.clubTitle.message}</span>
                </div>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="clubDescription">Club Description</label>
              <textarea
                placeholder="Short description about your shop"
                defaultValue={params.get("clubDes")}
                {...register("clubDescription", {
                  required: "Club description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                })}
              />
              {errors.clubDescription && (
                <div className="alert alert-error">
                  <span>{errors.clubDescription.message}</span>
                </div>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="clubImage">Club Image</label>
              <input type="file" {...register("clubImage")} />
            </div>

            <div className="form-btn-row">
              <Button
                btnType={"normal"}
                btnSize={"M"}
                btnText={isUpdateLoading ? btnText + "ing..." : btnText}
              />
            </div>
          </form>
        </div>
        <div className="club-data-wrapper">
          <div className="club-data-wrapper-content">
            <h5>Club Members</h5>
          </div>
          <table>
            <tr>
              <th>Member_Name</th>
              <th>Club_Role</th>
              <th>Join_Date</th>
            </tr>
            {clubMembers &&
              clubMembers.map((member) => (
                <tr key={member.name}>
                  <td>{member.name}</td>
                  <td>{member.role}</td>
                  <td>{member.joined_date}</td>
                  <td>
                    {member.role !== "founder" && (
                      <Button
                        btnType={"normal"}
                        btnSize={"M"}
                        btnText={"Remove"}
                        onClick={() => handleRemoveMember(member.name)}
                      />
                    )}
                  </td>
                </tr>
              ))}
          </table>
        </div>
      </div>
      <div className="editClubPosts-container">
        <div className="editClubPosts-CTA">
          <h5>Posts</h5>
          <Button
            btnType={"normal"}
            btnSize={"M"}
            btnText={"Create"}
            active={createForm}
            onClick={() => setCreateForm(true)}
          />
        </div>
        <div className="editClubPosts-wrapper">
          {Object.keys(storedClubPosts).map((key) => {
            return (
              <EditForm
                clubPostData={storedClubPosts}
                postId={storedClubPosts[key].post_id}
                title={storedClubPosts[key].title}
                caption={storedClubPosts[key].caption}
                description={storedClubPosts[key].content}
                image={storedClubPosts[key].image}
                visibility={storedClubPosts[key].visibility}
                onPostRemove={handlePostRemoval}
                buttonName={"Update"}
                setCreateForm={setCreateForm}
              />
            );
          })}

          {createForm && (
            <EditForm buttonName={"Create"} setCreateForm={setCreateForm} />
          )}
        </div>
      </div>
    </section>
  );
}
