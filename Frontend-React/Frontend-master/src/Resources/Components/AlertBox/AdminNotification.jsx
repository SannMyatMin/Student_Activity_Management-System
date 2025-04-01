// React Hooks
import React, { useEffect } from "react";
import { useState } from "react";

// Components
import Button from "../Buttons/button.jsx";
import Noti from "../Buttons/noti.jsx";
import Tag from "../Tag/tag.jsx";

// Resources
import profileImg from "../../Images/profile.jpg";

export default function AdminNotification({ type, img, name, clubName, desc }) {

    const [approveActive, setApproveActive] = useState(false);
    const [rejectActive, setRejectActive] = useState(false);
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    // const handleApprove = async () => {
    //     if (window.confirm("Are you sure want to Approve?")) {
    //         try {
    //             const res = await fetch(`http://localhost:8080/admin/approveClub`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-type": "Application/json"
    //                 },
    //                 body: JSON.stringify({ name: name, club_name: clubName })
    //             });

    //             const result = await res.text();
    //             if (!res.ok) {
    //                 const errorMessage = result;
    //                 throw new Error(errorMessage);
    //             }

    //             await delay(1000);
    //             setApproveActive(true);
    //             await delay(1000);
    //             localStorage.setItem(`${name}`, `Congratulations! Your request for ${clubName} as a member has been Approved. `);
    //             localStorage.setItem(`${name}clubName`, clubName);
    //             localStorage.setItem(`${name}Des`, desc);
    //             alert(`${clubName} ${result}`)
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    // }

    const handleApprove = async () => {
        if (window.confirm("Are you sure want to Approve?")) {
            await delay(1000);
            setApproveActive(true);
            await delay(1000);
            localStorage.setItem(`${name}club`, `Congratulations! Your request for ${clubName} as a member has been Approved. `);
            localStorage.setItem(`${name}clubName`, clubName);
            localStorage.setItem(`${name}Des`, desc);
            sessionStorage.setItem(`${name}Approve`, "approve");
            alert(`${clubName} club approved successfully`)
        }
    }

    const handleReject = async () => {

        if (window.confirm("Are you sure want to Reject?")) {
            try {
                const res = await fetch(`http://localhost:8080/admin/rejectClub`, {
                    method: "POST",
                    headers: {
                        "Content-type": "Application/json"
                    },
                    body: JSON.stringify({ name: name, club_name: clubName })
                });
                const result = await res.text();
                if (!res.ok) {
                    const errorMessage = result;
                    throw new Error(errorMessage);
                }
                await delay(1000);
                setRejectActive(true);
                localStorage.setItem(`${name}`, `Unfortunately. Your request for ${clubName} as a owner has been Rejected.`);

                await delay(1000)
                alert(`${clubName} ${result} `)
            } catch (error) {
                console.log(error);
            }
        }

    }
    return (
        <div className="notification">
            <div className="notification-wrapper">
                <a href="" className="notification-content">
                    <img src={`data:image/jpeg;base64,${img}`} alt="" />
                    <div className="notification-text">
                        <h5>{name}</h5>
                        <span>Request {type} type : {clubName}</span>
                    </div>
                </a>
                <div className="notification-CTA">
                    {!rejectActive && 
                        <Button
                            btnSize={"M"}
                            btnType={"normal"}
                            btnText={approveActive || sessionStorage.getItem(`${name}Approve`) ? "approved" : "approve"}
                            active={approveActive || sessionStorage.getItem(`${name}Approve`)}
                            onClick={() => handleApprove()} />
                    }
                    {!approveActive && !sessionStorage.getItem(`${name}Approve`) &&
                        <Button
                            btnSize={"M"}
                            btnType={"normal"}
                            btnText={rejectActive ? "rejected" : "reject"}
                            active={rejectActive}
                            onClick={() => handleReject()} />
                    }
                </div>
            </div>
            <p>{desc}</p>
        </div>
    );
}
