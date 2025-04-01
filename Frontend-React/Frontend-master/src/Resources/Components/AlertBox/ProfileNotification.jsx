// React Hooks
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

// Components
import Button from "../Buttons/button.jsx";
import Noti from "../Buttons/noti.jsx";
import Tag from "../Tag/tag.jsx";


export default function ProfileNotification({ responseMessage, removeMessage, name, Title, clubName, Des, image, keyName, keyName2, approve, reject }) {

  const [approveActive, setApproveActive] = useState(false);
  const [rejectActive, setRejectActive] = useState(false);
  const navigate = useNavigate();

 useEffect(() => {
  if (name) {
    if (localStorage.getItem(`${name}ShopName`)) {
      setApproveActive(true);
    }
  }

 },[])


  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const handleApprove = async () => {
    if (window.confirm("Are you sure want to Approve?")) {
      try {
        const value = Title ? Title : name;

        const res = await fetch(`http://localhost:8080/${approve}`, {
          method: "POST",
          headers: {
            "Content-type": "Application/json"
          },
          body: JSON.stringify({ [keyName]: value, [keyName2]: clubName })
        });

        const result = await res.text();
        if (!res.ok) {
          const errorMessage = result;
          throw new Error(errorMessage);
        }

        await delay(1000);
        setApproveActive(true);
        await delay(1000);
        if (keyName === "club_name") {
          localStorage.setItem(`${name}`, `Congratulations! Your request for ${Title} as a founder has been Approved. `);
          localStorage.setItem(`${name}clubName`, Title);
          localStorage.setItem(`${name}Des`, Des);
        } else if (keyName === "shop_name") {
          localStorage.setItem(`${name}`, `Congratulations! Your request for ${Title} as a owner has been Approved. `);
          localStorage.setItem(`${name}ShopName`, Title);
          localStorage.setItem(`${name}Des`, Des);
        } else if (keyName === "name") {
          localStorage.setItem(`${name}`, `Congratulations! Your request for ${clubName} as a member has been Approved. `);
          localStorage.setItem(`${name}clubName`, Title);
          localStorage.setItem(`${name}Des`, Des);
        }
        alert(`${Title ? Title : name} have been approved successfully!`)
      } catch (error) {
        console.log(error);
      }
    }

  }

  
  const handleApproveShopORClub = async () => {
    if (window.confirm("Are you sure want to Accept?")) {
    setApproveActive(true);
        if (keyName === "club_name") {
          localStorage.setItem(`${name}club`, `Congratulations! Your request for ${Title} as a founder has been Approved. `);
          localStorage.setItem(`${name}clubName`, Title);
          localStorage.setItem(`${name}Des`, Des);
        } else if (keyName === "shop_name") {
          localStorage.setItem(`${name}shop`, `Congratulations! Your request for ${Title} as a owner has been Approved. `);
          localStorage.setItem(`${name}ShopName`, Title);
          localStorage.setItem(`${name}Des`, Des);
        }
        alert(`${Title ? Title : name} have been accepted successfully!`)
    }
  }


  const handleReject = async () => {

    if (window.confirm("Are you sure want to Reject?")) {
      try {
        const value = Title ? Title : name;

        const res = await fetch(`http://localhost:8080/${reject}`, {
          method: "POST",
          headers: {
            "Content-type": "Application/json"
          },
          body: JSON.stringify({ [keyName]: value, [keyName2]: clubName })
        });
        const result = await res.text();
        if (!res.ok) {
          const errorMessage = result;
          throw new Error(errorMessage);
        }
        await delay(1000);
        setRejectActive(true);
        if (keyName === "club_name") {
          localStorage.setItem(`${name}club`, `Unfortunately. Your request for ${Title} as a founder has been Rejected.`);
        } else if (keyName === "shop_name") {
          localStorage.setItem(`${name}shop`, `Unfortunately. Your request for ${Title} as a owner has been Rejected.`);
        } else if (keyName === "name") {
          localStorage.setItem(`${name}club`, `Unfortunately. Your request for ${clubName} as a owner has been Rejected.`);
        }
        await delay(1000)
        alert(`${Title ? Title : name} have been rejected successfully! `)
      } catch (error) {
        console.log(error);
      }
    }

  }
  return (
    <div className="notification">
      <div className="notification-wrapper">

        <a href="#" className="notification-content">
          {!responseMessage && <img src={`data:image/jpeg;base64,${image}`} alt="" />}
          <div className="notification-text">
            {responseMessage ? (
              <h5>{responseMessage}</h5>
            ) : (
              <h5>{name}</h5>
            )}
            <span>
              {
                keyName === "club_name" && Title ? Title + " club" : Title
              }
            </span>
          </div>
        </a>
        {!responseMessage &&
          <div className="form-btn-row">
            {!rejectActive &&
              <Button
                btnSize={"M"}
                btnType={"normal"}
                btnText={approveActive ? "Accepted" : "Accept"}
                active={approveActive}
                onClick={() =>{
                  if (keyName2) {
                    handleApprove()
                  } else {
                    handleApproveShopORClub()
                  }
                }} />
            }
            {!approveActive &&
              <Button
                btnSize={"M"}
                btnType={"normal"}
                btnText={rejectActive ? "rejected" : "reject"}
                active={rejectActive}
                onClick={() => handleReject()} />
            }
          </div>
        }
        {responseMessage &&
          <div className="form-btn-row">
            {responseMessage.includes("Approved") && localStorage.getItem(`${name}clubName`) && !localStorage.getItem(`${name}ShopName`) &&
              <Button
                btnSize={"M"}
                btnType={"normal"}
                btnText={"Create"}
                active={rejectActive}
                  onClick={() => navigate(`/editClub?clubName=${localStorage.getItem(`${name}clubName`)}`)}
              />
            }
             {responseMessage.includes("Approved") && localStorage.getItem(`${name}ShopName`) &&
              <Button
                btnSize={"M"}
                btnType={"normal"}
                btnText={"Create"}
                active={rejectActive}
                  onClick={() => navigate(`/editShop?shopName=${localStorage.getItem(`${name}ShopName`)}`)}
              />
            }
            {responseMessage.includes("Rejected") && localStorage.getItem(`${name}club`)  &&
              <Button
                  btnSize={"M"}
                  btnType={"normal"}
                  btnText={"delete"}
                  onClick={() => removeMessage("club")}
                />
            }
             {responseMessage.includes("Rejected") && localStorage.getItem(`${name}shop`)  &&
              <Button
                  btnSize={"M"}
                  btnType={"normal"}
                  btnText={"delete"}
                  onClick={() => removeMessage("shop")}
                />
            }
            
            {/* {responseMessage.includes("Approved") && localStorage.getItem(`${name}ShopName`) &&
              <Button
                btnSize={"M"}
                btnType={"normal"}
                btnText={"Create"}
                active={rejectActive}
                onClick={() => navigate(`/editShop?shopName=${localStorage.getItem(`${name}ShopName`)}&shopDes=${localStorage.getItem(`${name}Des`)}`)}
              />
            } */}

          </div>
        }
      </div>
    </div>
  );
}
