import React, { useEffect, useState } from 'react'
import Button from '../Buttons/button';
import profileImg from "../../Images/profile.jpg";

export default function OrderList({ Name, numOfItem, date, shopImg, totatBill }) {
    let totalQuantity = 0;
    const [receiptActive, setReceiptActive] = useState(false);
    const [overlayActive, setOverlayActive] = useState(false);


    numOfItem.map(item => {
        return totalQuantity = totalQuantity + item.quantity;
    })

    return (
        <>
            <div className="notification">
                <div className="notification-wrapper">
                    <a href="#" className="notification-content">
                        <img src={`data:image/jpeg;base64,${shopImg}`} alt="" />
                        <div className="notification-text">
                            <h5>{Name}</h5>
                            <span>{totalQuantity}  items </span>
                            <span>( {date} )</span>
                        </div>
                    </a>
                    <div>
                        <Button
                            btnSize={"M"}
                            btnType={"normal"}
                            btnText={"Receipt"}
                            onClick={() => setReceiptActive(true)}
                        />
                    </div>
                </div>

            </div >


            {/* for receipt  */}
            <div className={`receipt-container ${receiptActive && "active"}`}>
                <div className="modal-container-CTA">
                    <h5>Your Receipt</h5>
                    <div
                        className="delete-btn"
                        onClick={() => {
                            setReceiptActive(false);
                            setOverlayActive(false);
                        }}
                    >
                        <span className="delete-bar"></span>
                    </div>
                </div>

                <div className="receipt-wrapper">
                    <small>Date - {date}</small>
                    {numOfItem.map(item => (
                        <div className="receipt">
                            <div>
                                <span>{item.quantity} x</span>
                                <h6>{item.item_name}</h6>
                            </div>
                            <span>{item.total_price} MMK</span>
                        </div>
                    ))}

                </div>
                <div className="receipt-total">
                    <h5>Total</h5>
                    <span>{totatBill} MMK</span>
                </div>
            </div>
        </>

    )
}
