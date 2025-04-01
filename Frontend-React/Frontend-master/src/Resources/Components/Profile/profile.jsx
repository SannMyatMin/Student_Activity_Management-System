// React Hooks
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

// Components
import Button from "../Buttons/button.jsx";
import Noti from "../Buttons/noti.jsx";
import Tag from "../Tag/tag.jsx";
import Notification from "../AlertBox/Notification.jsx";
import SelectionNoti from "../AlertBox/SelectionNoti.jsx";
// Resources
import profileImg from "../../Images/profile.jpg";
import OrderList from "./orderList.jsx";
import ProfileNotification from "../AlertBox/ProfileNotification.jsx";

export default function Profile() {
  const imageInputRef = useRef(null);
  const [shopData, setShopData] = useState(null);
  const [clubName, setClubName] = useState(null);

  const [reqShopData, setReqShopData] = useState(null);
  const [reqClubData, setReqClubData] = useState(null);
  const [reqClubMember, setReqClubMember] = useState(null);
  const [selectionData, setSelectionData] = useState([]);

  const [recentOrder, setRecentOrder] = useState(null);
  const [notiBtnActive, setNotiBtnActive] = useState(false);
  const [selectionBtnActive, setSelectionBtnActive] = useState(false);
  const [orderBtnActive, setOrderBtnActive] = useState(false);

  const [imageInput, setImageInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const userData = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {};
  const userName = userData.name;
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    mail: "",
    image: "",
    roles: [],
  })

  const [responseMessage, setResponseMessage] = useState(null);
  useEffect(() => {
    if (localStorage.getItem(`${data.name}shop`)) {
      setResponseMessage(localStorage.getItem(`${data.name}shop`))
    }
  }, [data.name])

  useEffect(() => {
    if (localStorage.getItem(`${data.name}club`)) {
      setResponseMessage(localStorage.getItem(`${data.name}club`))
    }
  }, [data.name])
  // for update the user profile image
  const handleImageUpload = async (image) => {
    const file = image[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("mail", data.mail);
    formData.append("pf_image", file);

    const res = await fetch("http://localhost:8080/api/updatePF", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    localStorage.setItem("pf_Image", result.image)
    setData((prev) => ({ ...prev, image: result.image }));
  }
  useEffect(() => {
    if (!userData.mail) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/profile?mail=${userData.mail}`);
        if (!res.ok) throw new Error("Failed to fetch profile data");
        const result = await res.json();
        const isShopOwner = result.roles && result.roles.includes("Owner");
        const isClubFounder = result.roles && result.roles.includes("Founder");
        
         localStorage.setItem("pf_Image", result.image)
        if (isShopOwner && Cookies.get("user")) {
          let keyword = "Owner of";
          let shopname = result.roles.includes(keyword) ? result.roles.split(keyword)[1].split(",")[0].trim() : "";
          Cookies.set("shopTitle", shopname, { expires: 1, path: "/" });
        }

        if (isClubFounder && Cookies.get("user")) {
          let keyword = "Founder of";
          let start = result.roles.indexOf(keyword);

          if (start !== -1) {
            let clubName = result.roles.substring(start + keyword.length + 1).split(",")[0].trim();
            Cookies.set("clubOwner", clubName, { expires: 1, path: "/" });
          }
        }
        setData(prev => ({
          ...prev,
          name: result.name,
          mail: result.mail,
          image: result.image,
          roles: result.roles.split(","),
        }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [userData.mail]);

  const removeMessage = (dir) => {
    localStorage.removeItem(`${data.name}${dir}`);
    localStorage.removeItem(`${data.name}Des`);
    if (dir === "shop") {
      localStorage.removeItem(`${data.name}ShopName`);
    } else {
      localStorage.removeItem(`${data.name}clubName`);
    }
    setResponseMessage(null);
  }
  // useEffect(() => {
  //   const userCookie = Cookies.get("user")
  //   const userData = JSON.parse(userCookie) || {};
  //   const roles = userData.roles.split(",");
  //   setData({
  //     name: userData.name,
  //     mail: userData.mail,
  //     image: profileImage,
  //     roles: roles,
  //   })
  // }, [profileImage])

  const handleUploadClick = () => {
    if (imageInputRef.current)
      imageInputRef.current.click();
  }

  // to fetch shop request form data
  useEffect(() => {
    const api = async () => {
      const res = await fetch("http://localhost:8080/organizer/getReqShops", {
        method: "GET",
      });

      const result = await res.json();
      setReqShopData(result);
    }
    api()
  }, [userName]);

  // to fetch club request form data
  useEffect(() => {
    const api = async () => {
      const res = await fetch("http://localhost:8080/admin/getReqClubs", {
        method: "GET",
      });
      const result = await res.json();
      setReqClubData(result);
    }
    api()
  }, []);


  // fetch selection data
  useEffect(() => {
    const api = async () => {
      const res = await fetch("http://localhost:8080/organizer/getSelections", {
        method: "GET",
      })
      const result = await res.json();
      setSelectionData(result)
    }
    api()
  }, [])



  // to fetch club member request form data

  useEffect(() => {
    if (!data.roles) return;
    const roleWithKeyword = data.roles.find(role => role.includes("Founder of"));
    setClubName(roleWithKeyword ? roleWithKeyword.split("Founder of")[1].trim() : null);
  }, [data.roles]); // Only run when roles change

  useEffect(() => {
    if (!clubName) return;

    const api = async () => {
      const res = await fetch("http://localhost:8080/founder/reqMembers", {
        method: "POST",
        headers: {
          "Content-type": "Application/json"
        },
        body: JSON.stringify({ club_name: clubName })
      });
      const result = await res.json();
      setReqClubMember(result);
    };

    api();
  }, [clubName]); // Run only when clubName is updated




  // for selection upload a photo
  const handleSelectionImageUpload = async (e) => {
    e.preventDefault();
    const file = imageInput[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", file);

    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/addSelectionImage`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        console.log(errorMessage)
      }

      alert("Image added successfully")

    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  // for recent order receipts
  useEffect(() => {
    const api = async () => {
      const res = await fetch(`http://localhost:8080/shop/getAllReceipts?name=${userName}`, {
        method: "GET"
      });


      const result = await res.json();
      setRecentOrder(result);
    }
    api()
  }, [recentOrder, userName])


  const isSelected = (name) => {
    return selectionData.some(selectionName => selectionName.name === name)
  }

  return (
    <section className="profile-section">
      <div className="profile-container">
        <div className="profile-detail-container">

          {/* --------- profile image ---------*/}
          <div className="profile-img-container">
            <img src={`data:image/jpeg;base64,${data.image}`} alt="" />
            <Button
              btnType={"monochrome"}
              btnSize={"S"}
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
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              }
              onClick={handleUploadClick}
            />
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(e.target.files)}
            />

          </div>
          <div className="profile-content-container">
            <h3>{data.name}</h3>
            <h5>{data.mail}</h5>
            <div className="profile-role-wrapper">
              {data.roles && data.roles.map(role => (
                <Tag key={role} tagText={role} tagType={"normal"} />
              ))}
            </div>
          </div>
        </div>
        <div className="profile-activity-container">
          <div className="profile-actions-container">
            <div className="profile-actions-wrapper">
              <Button
                btnSize={"M"}
                btnType={"normal"}
                hasNew={recentOrder && recentOrder.length !== 0 ? true : false}
                btnText={"Orders"}
                active={orderBtnActive}
                onClick={() => {
                  setOrderBtnActive(true)
                  setNotiBtnActive(false)
                  setSelectionBtnActive(false)
                }}
              />
              {isSelected(data.name) &&
                <Button
                  btnSize={"M"}
                  btnType={"normal"}
                  btnText={"selection"}
                  active={selectionBtnActive}
                  onClick={() => {
                    setSelectionBtnActive(true)
                    setNotiBtnActive(false)
                    setOrderBtnActive(false)
                  }}
                />
              }
              <Noti
                hasNew={
          ((responseMessage || (reqShopData && reqShopData.length !== 0) || (reqClubMember && reqClubMember.lengthub)) ||
            (reqClubMember &&  reqClubMember.length !== 0))
           && true
          }
                btnSize={"M"}
                btnType={"normal"}
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
                active={notiBtnActive}
                onClick={() => {
                  setNotiBtnActive(true)
                  setOrderBtnActive(false)
                  setSelectionBtnActive(false)
                }}
              />
            </div>
          </div>
          <div className="profile-activities-container">
            {/* <div className="notifications-container">
                <h4>Notifications</h4>
                <div className="notifications wrapper">
                  <Notification
                    type={"Shop"}
                    img={profileImg}
                    name={"Nyan Tun Naing"}
                    data={"Food"}
                    desc={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi,
        reprehenderit suscipit. Inventore, eligendi. Eum provident natus esse
        vitae fuga illum.`}
                  />
                  <SelectionNoti />
                </div>
              </div> */}
            {selectionBtnActive &&
              <div className="editSelection-container">
                <h4>Selection Profile</h4>
                <div className="form-container">
                  <form onSubmit={handleSelectionImageUpload}>
                    <div className="form-row">
                      <h5>We will automatically use your name.</h5>
                    </div>
                    <div className="form-row">
                      <label htmlFor="">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageInput(e.target.files)}
                      />
                    </div>
                    <div className="form-btn-row">
                      {imageInput &&
                        <Button
                          btnType={"normal"}
                          btnText={isLoading ? "Uploading..." : "Upload"}
                          btnSize={"M"}
                        />
                      }
                    </div>
                  </form>
                </div>
              </div>
            }
            {notiBtnActive &&
              <div className="notifications-container">
                <h4>Notifications</h4>
                <div className="notifications wrapper">
                  {/* for shop request notification at organizer */}
                  {data.roles.find(role => role.includes("Organizer")) && reqShopData && reqShopData.map(reqData => (
                    <ProfileNotification
                      name={reqData.student_name}
                      Title={reqData.title}
                      Des={reqData.description}
                      image={reqData.student_image}
                      keyName={"shop_name"}
                      reject={"organizer/rejectShop"}
                    />
                  ))}

                  {/* for club request notification at admin */}
                  {/* {data.roles.find(role => role.includes("Organizer")) && reqClubData && reqClubData.map(reqData => (
                    <ProfileNotification
                      name={reqData.student_name}
                      Title={reqData.club_name}
                      Des={reqData.description}
                      image={reqData.student_image}
                      keyName={"club_name"}
                      approve={"admin/approveClub"}
                      reject={"admin/rejectClub"}
                    />
                  ))} */}

                  {/* for club member request notification at club founder */}
                  {data.roles.find(role => role.includes("Founder")) && reqClubMember && reqClubMember.map(reqData => (
                    <ProfileNotification
                      name={reqData.name}
                      clubName={clubName}
                      Des={reqData.description}
                      image={reqData.image}
                      keyName={"name"}
                      keyName2={"club_name"}
                      approve={"founder/acceptMember"}
                      reject={"founder/rejectMember"}
                    />
                  ))}
                  {/* for response (approve or reject ) notification at student */}
                  {responseMessage &&
                    <ProfileNotification
                      name={data.name}
                      responseMessage={responseMessage}
                      removeMessage={(dir) => removeMessage(dir)}
                    />
                  }
                </div>

              </div>

            }
            {orderBtnActive &&
              <div className="notifications-container">
                <h4>Your Order Lists</h4>
                <div className="notifications wrapper">
                  {Object.keys(recentOrder).map(key => (
                    <OrderList
                      Name={recentOrder[key].shop_name}
                      shopImg={recentOrder[key].shop_image}
                      date={recentOrder[key].date}
                      numOfItem={recentOrder[key].items}
                      totatBill={recentOrder[key].total_bill}
                    />
                  ))}

                </div>
              </div>
            }
          </div>

        </div>
      </div>
    </section>
  );
}
