import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Cookies from "js-cookie";
import Tag from "../Tag/tag";
export default function OwnerView() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [orderRecord, setOrderRecord] = useState({}); // stored orderRecord for shop Owner
  // fetch order records
  useEffect(() => {
    const api = async () => {
      try {
        const res = await fetch(`http://localhost:8080/shop/getOrderRecord`, {
          method: "POST",
          headers: {
            "Content-type": "Application/json",
          },
          body: JSON.stringify({ shop_name: params.get("shopName") }),
        });
        const result = await res.json();

        const newOrder = localStorage.getItem("newOrder");

        if (!newOrder || parseInt(newOrder, 10) < result.length) {
          localStorage.setItem("newOrder", result.length);
        }

        setOrderRecord(result);
      } catch (error) {
        console.log(error);
      }
    };
    api();
  }, []);

  return (
    <section className="data-container">
      <div className="order-data-wrapper">
        <h4>Customer Orders</h4>
        <table>
          <thead>
            <tr>
              <th>Student_Name</th>
              <th>Order_code</th>
              <th>Purchased_Items</th>
              <th>Total_bill</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orderRecord &&
              Object.keys(orderRecord).map((key) => (
                <tr key={orderRecord[key].order_code}>
                  <td>{orderRecord[key].student_name}</td>
                  <td>{orderRecord[key].order_code}</td>
                  <td>
                    <div className="role-wrapper">
                      {orderRecord[key].purchased_items
                        .split(",")
                        .map((role, index) => (
                          <Tag key={index} tagText={role} tagType={"normal"} />
                        ))}
                    </div>
                  </td>
                  <td>{orderRecord[key].total_bill}</td>
                  <td>{orderRecord[key].date}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
