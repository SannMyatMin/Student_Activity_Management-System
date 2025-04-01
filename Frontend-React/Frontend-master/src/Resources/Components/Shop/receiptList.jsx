import React, { useState } from 'react'

export default function ReceiptList({ receiptList, receiptActive, setReceiptActive }) {
    // const [receiptActive, setReceiptActive] = useState(false);
    const [overlayActive, setOverlayActive] = useState(false);
  
    return (
        <div className={`receipt-container ${receiptActive && "active"}`}>
            <div className="modal-container-CTA">
                <h5>{receiptList?.purchased_items ?  "Purchased Items": "Your Receipt"}</h5>
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
            {receiptList &&
                <>
                    <div className="receipt-wrapper">
                        <h5>Order No - {receiptList.orderCode}</h5>
                        <small>Date - {receiptList.date}</small>
                        {receiptList?.items?.map(item => (
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
                        <h5>Total price</h5>
                        <span>{receiptList.totalBill} MMK</span>
                    </div>
                </>
            }

        </div>
    )
}
