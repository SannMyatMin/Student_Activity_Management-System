import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../Buttons/button.jsx";


export default function EditForm({ itemData, shopName, buttonName, onItemRemoved, onItemAdd }) {

  const [storedItem, setStoredItem] = useState({}); // stored items for edit form
  const [btnName, setBtnName] = useState(buttonName);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isRemoveLoading, setIsRemoveLoading] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);


  // ----------------- item add -------------- //

  const addHandler = async (data) => {
    setIsAddLoading(true);
    try {
      const formData = new FormData();
      formData.append('shop_name', shopName);
      formData.append('item-name', data.itemTitle);
      formData.append('image', data.itemImage[0]);
      formData.append('price', data.itemPrice);
      formData.append('quantity', data.itemQuantity);

      const res = await fetch(`http://localhost:8080/shop/addItem`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to add item');
      }

      onItemAdd({ itemName: data.itemTitle, price: data.itemPrice, quantity: data.itemQuantity })
      setBtnName("Update")
      alert("Item Added successfully!");
    } catch (error) {
      console.error("Error add item:", error);
      alert("Failed to add item. Please try again.");
    } finally {
      setIsAddLoading(false);
    }
  };


  function base64ToBlob(base64, mimeType = "image/png") {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  // ----------------- item update -------------- //
  const updateHandler = async (data) => {

    setIsUpdateLoading(true);
    try {
      const formData = new FormData();
      formData.append('old-name', itemData.itemName);
      formData.append('new-name', data.itemTitle);


      // Check if a new file is provided
      if (data.itemImage && data.itemImage.length > 0) {
        formData.append("image", data.itemImage[0]);
      } else if (itemData.image) {
        const blob = base64ToBlob(itemData.image);
        formData.append("image", blob, "defaultImage.png");
      }
      formData.append('price', data.itemPrice);
      formData.append('quantity', data.itemQuantity);

      const res = await fetch(`http://localhost:8080/shop/updateItem`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to add item');
      }

      // to update the sessionStorage
      if (Object.keys(itemData).length > 0) {
        setStoredItem((prevItem) => {
          const newItems = { ...prevItem };
          Object.keys(itemData).forEach(key => {
            newItems[itemData[key].name] = {
              itemName: itemData[key].name,
              price: itemData[key].price,
              quantity: itemData[key].quantity,
            }
          });
          return newItems;
        })
      }
      if (Object.keys(storedItem).length > 0) {
        sessionStorage.setItem("itemList", JSON.stringify(storedItem));
      }
      ///////////////////////////


      alert("Item updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item. Please try again.");
    } finally {
      setIsUpdateLoading(false);
    }
  };

  // ----------------- item remove -------------- //
  const removeHandler = async () => {
    setIsRemoveLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/shop/deleteItem`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ item_name: itemData.itemName })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to delete item');
      }

      if (onItemRemoved) {
        onItemRemoved(itemData.itemName);
      }

      alert(`${itemData.itemName} item deleted successfully`);
    } catch (error) {
      console.log(error);
      alert("Failed to delete item");
    } finally {
      setIsRemoveLoading(false);
    }
  }

  return (
    <div className="editShopItem-wrapper">

      <div className="form-container">
        <form onSubmit={btnName === "Update" ? handleSubmit(updateHandler) : handleSubmit(addHandler)}>
          <div className="form-row">
            <label htmlFor="itemTitle">Title</label>
            <input
              type="text"
              id="itemTitle"
              placeholder="item title"
              defaultValue={itemData.itemName}
              {...register("itemTitle", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters"
                }
              })}
            />
            {errors.itemTitle && (
              <div className="alert alert-error">
                <span>{errors.itemTitle.message}</span>
              </div>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="itemPrice">Price</label>
            <input
              type="text"
              id="itemPrice"
              placeholder="Enter price"
              defaultValue={itemData.price}
              {...register("itemPrice", {
                required: "Price is required",
                min: {
                  value: 0,
                  message: "Price must be greater than 0"
                },
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Please enter valid number"
                }
              })}
            />
            {errors.itemPrice && (
              <div className="alert alert-error">
                <span>{errors.itemPrice.message}</span>
              </div>
            )}
          </div>

           <div className="form-row">
            <label htmlFor="itemPrice">Quantity</label>
            <input
              type="text"
              id="itemPrice"
              placeholder="Item quantity"
              defaultValue={itemData.quantity}
              {...register("itemQuantity", {
                required: "Price is required",
                min: {
                  value: 0,
                  message: "Price must be greater than 0"
                },
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Please enter valid number"
                }
              })}
            />
            {errors.itemQuantity && (
              <div className="alert alert-error">
                <span>{errors.itemQuantity.message}</span>
              </div>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="itemImage">Item Image</label>
            <input
              type="file"
              id="itemImage"
              accept="image/*"
              {...register("itemImage")}
            />

          </div>

          <div className="form-btn-row">
            {btnName === "Update" && itemData ? (
              <>
                <Button
                  btnType={"normal"}
                  btnSize={"M"}ww
                  btnText={isUpdateLoading ? "Updating..." : buttonName}
                  type={"submit"}
                  disabled={isUpdateLoading}
                />
                <Button
                  btnType={"normal"}
                  btnSize={"M"}
                  btnText={isRemoveLoading ? "Removing..." : "Remove"}
                  type={"button"}
                  disabled={isRemoveLoading}
                  onClick={() => removeHandler(itemData.itemName)}
                />
              </>
            ) : (
              <Button
                btnType={"normal"}
                btnSize={"M"}
                btnText={isAddLoading ? "Adding..." : buttonName}
                type={"submit"}
                disabled={isAddLoading}
              />
            )}
          </div>
        </form>


      </div>
    </div>
  );
}
