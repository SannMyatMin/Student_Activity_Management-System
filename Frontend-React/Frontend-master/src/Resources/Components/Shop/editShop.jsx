// React Hooks
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
// Components
import Button from "../Buttons/button.jsx";
import EditForm from "./editForm.jsx";
import PostForm from "./postForm.jsx";

export default function EditShop() {

  const userCookie = Cookies.get("user");
  const userData = userCookie && JSON.parse(userCookie);
  const userName = userData.name;
  const navigate = useNavigate();
  const location = useLocation();
  const [itemList, setItemList] = useState({});
  const [addForm, setAddForm] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [buttonName, setButtonName] = useState("Update");
  const [eventPostList, setEventPostList] = useState([]);
  const [storedShopPosts, setStoredShopPosts] = useState({});
  const [btnText, setbtnText] = useState("");

  const params = new URLSearchParams(location.search);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // Add new form hook for posts
  const {
    register: registerPost,
    handleSubmit: handlePostSubmit,
    formState: { errors: postErrors }
  } = useForm();

  useEffect(() => {
    if (sessionStorage.getItem("itemList")) {
      setItemList(JSON.parse(sessionStorage.getItem("itemList")))
    }
  }, [])


    useEffect(() => {
      if (localStorage.getItem(`${userName}ShopName`)) {
        setbtnText("Create")
      } else {
        setbtnText("Update")
      }
    },[])


  const handleItemAdd = (item) => {
    setItemList(prevList => {
      const newList = { ...prevList };
      newList[item.itemName] = {
        itemName: item.itemName,
        price: item.price,
        quantity: item.quantity,
        image: item.file
      }
      sessionStorage.setItem("itemList", JSON.stringify(newList))
      return newList;
    })
    setAddForm(false);
  }

  // Add this function to handle item removal
  const handleItemRemoval = (itemName) => {
    setItemList(prevList => {
      const newList = { ...prevList };
      delete newList[itemName];
      sessionStorage.setItem("itemList", JSON.stringify(newList));
      return newList;
    });
  };

  const handlePostRemoval = (postId) => {
    setStoredShopPosts(prevList => {
      const newList = { ...prevList };
      delete newList[postId];
      sessionStorage.setItem("shopPostList", JSON.stringify(newList));
      return newList;
    });
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

  // for edit shop name and description 
  const handleEditShop = async (data) => {
    setIsUpdateLoading(true);
    if (localStorage.getItem(`${userName}ShopName`)) {
      console.log("Approve")
      await handleApprove();
      localStorage.removeItem(`${userName}ShopName`)
      localStorage.removeItem(`${userName}Des`)
      sessionStorage.removeItem(`${userName}Approve`);
    }

    try {
      const formData = new FormData();
      formData.append('old_name', params.get("shopName"));
      formData.append('new_name', data.shopTitle);
      formData.append('new_description', data.shopDes);

      // // Check if a new file is provided
      if (data.shopImage && data.shopImage.length > 0) {
        formData.append("image", data.shopImage[0]);
      } else if (sessionStorage.getItem("shopPfImage")) {
        const blob = base64ToBlob(JSON.parse(sessionStorage.getItem("shopPfImage")));
        formData.append("image", blob, "defaultImage.png");
      }

      const res = await fetch("http://localhost:8080/shop/updateShop", {
        method: "POST",
        body: formData
      })

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText)
      }
      localStorage.removeItem(`${userName}shop`)
      localStorage.removeItem(`${userName}ShopName`)
      localStorage.removeItem(`${userName}Des`)
      sessionStorage.removeItem(`${userName}Approve`);

       if (btnText === "Create") {
          alert("Created successfully");
      } else {
          alert("Updated successfully");
      }
 
      navigate(`/editShop?shopName=${data.shopTitle}&shopDes=${data.shopDes}`)
    } catch (error) {
      console.log(error)
      alert("Fail to update")
    } finally {
      setIsUpdateLoading(false);
    }

  }



  useEffect(() => {
    const api = async () => {
      const res = await fetch("http://localhost:8080/post/getAllPosts", {
        method: "GET",
      });
      const result = await res.json();

      setEventPostList([]);


      Object.keys(result).forEach((key) => {
        const post = result[key];

        if (post.visibility === "shopEvent" && post.poster_name === params.get("shopName")) {
          setEventPostList((prevEventPosts) => [...prevEventPosts, post]);
        }
      });
    };

    api();
  }, []);

  useEffect(() => {
    if (Object.keys(eventPostList).length >= 0) {
      setStoredShopPosts((prevItem) => {
        const newItems = { ...prevItem };
        Object.keys(eventPostList).forEach(key => {

          newItems[eventPostList[key].post_id] = {
            post_id: eventPostList[key].post_id,
            title: eventPostList[key].title,
            image: eventPostList[key].image,
            content: eventPostList[key].content,
            caption: eventPostList[key].caption,
            visibility: eventPostList[key].visibility
          }
        });
        return newItems;
      })
    }
  }, [eventPostList]);

  useEffect(() => {
    if (Object.keys(storedShopPosts).length >= 0) {
      sessionStorage.setItem("shopPostList", JSON.stringify(storedShopPosts));
    }
  }, [storedShopPosts]);

  const handleApprove = async () => {
    try {
      const res = await fetch(`http://localhost:8080/organizer/approveShop`, {
        method: "POST",
        headers: {
          "Content-type": "Application/json"
        },
        body: JSON.stringify({ shop_name: params.get("shopName") })
      });

      const result = await res.text();
      if (!res.ok) {
        const errorMessage = result;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className="editShop-section">
      <div className="editShop-content-container">
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
          onClick={() => navigate(`/shop?shopName=${params.get("shopName")}&shopDes=${params.get("shopDes")}`)}
        />
        <div className="editShop-content-wrapper">
          <div className="form-container">
            {/* edit shop name and description */}
            <form onSubmit={handleSubmit(handleEditShop)}>
              <div className="form-row">
                <label htmlFor="">Shop Name</label>
                <input
                  type="text"
                  placeholder="previous shop title"
                  defaultValue={params.get("shopName")}
                  {...register("shopTitle", { required: true })}
                />
                {errors.shopTitle &&
                  <div className="alert alert-error">
                    <span>Shop title is required</span>
                  </div>}
              </div>
              <div className="form-row">
                <label htmlFor="">Shop description</label>
                <textarea
                  name=""
                  id=""
                  placeholder="short description about your shop"
                  defaultValue={params.get("shopDes")}
                  {...register("shopDes", { required: true })}
                />
                {errors.shopDes &&
                  <div className="alert alert-error">
                    <span>Shop title is required</span>
                  </div>}
              </div>
              <div className="form-row">
                <label htmlFor="">Shop Image</label>
                <input
                  type="file"
                  id="itemImage"
                  accept="image/*"
                  {...register("shopImage")}
                />
              </div>

              <Button
                btnType={"normal"}
                btnSize={"M"}
                btnText={isUpdateLoading ? btnText + "ing..." : btnText}
                type={"submit"}
                disabled={isUpdateLoading}
              />
            </form>
          </div>
          <div className="editShopItems-container">
            <div className="editShopItems-CTA">
              <h4>Items</h4>
              <Button
                btnType={"normal"}
                btnSize={"M"}
                btnText={"add item"}
                onClick={() => setAddForm(true)}
                active={addForm}
              />
            </div>
            <div className="editShopItems-wrapper">
              {Object.keys(itemList).map((key) => (
                <EditForm
                  key={key}
                  itemData={itemList[key] || null}
                  shopName={params.get("shopName")}
                  buttonName={"Update"}
                  onItemRemoved={handleItemRemoval}
                />
              ))}
              {addForm &&
                <EditForm
                  itemData={""}
                  shopName={params.get("shopName")}
                  buttonName={"Add"}
                  onItemAdd={handleItemAdd}
                />
              }
            </div>
          </div>
          <div className="shopPosts-container">
            <div className="editShopItems-CTA">
              <h4>Posts</h4>
              <Button
                btnType={"normal"}
                btnSize={"M"}
                btnText={"Create"}
                onClick={() => setButtonName("Create")}
                active={buttonName === "Update" ? false : true}
              />
            </div>
            <div className="form-container">
              {Object.keys(storedShopPosts).map(key => {
                return (
                  <PostForm
                    shopPostData={storedShopPosts}
                    image={storedShopPosts[key].image}
                    postId={storedShopPosts[key].post_id}
                    postImg={storedShopPosts[key].image}
                    postTitle={storedShopPosts[key].title}
                    postCaption={storedShopPosts[key].caption}
                    postDes={storedShopPosts[key].content}
                    visibility={storedShopPosts[key].visibility}
                    buttonName={"Update"}
                    onPostRemove={handlePostRemoval}
                    shopName={params.get("shopName")}
                  />
                )
              })
              }

              {buttonName === "Create" &&
                <PostForm buttonName={buttonName} shopName={params.get("shopName")} />
              }
            </div>
            <div className="previousPosts-wrapper"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
