// React Hooks
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
// Components
import PostForm from "./postForm.jsx";
import Button from "../Buttons/button.jsx";

export default function EditPost() {
      const userCookie = Cookies.get("user");
      const userData = userCookie && JSON.parse(userCookie);
  const navigate = useNavigate();
  const location = useLocation();
  const [buttonName, setButtonName] = useState("Update");
  const [eventPostList, setEventPostList] = useState([]);
  const [storedShopPosts, setStoredShopPosts] = useState({});

  const params = new URLSearchParams(location.search);

  // Fetch posts associated with the shop
  useEffect(() => {
    const api = async () => {
      const res = await fetch("http://localhost:8080/post/getAllPosts", {
        method: "GET",
      });
      const result = await res.json();

      setEventPostList([]);

      Object.keys(result).forEach((key) => {
        const post = result[key];

        if (post.visibility === "shopEvent" && post.creator_name === userData.name) {
          setEventPostList((prevEventPosts) => [...prevEventPosts, post]);
        }
      });
    };

    api();
  }, []);


  // Store fetched posts in state
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
      });
    }
  }, [eventPostList]);

  // Save posts to session storage
  useEffect(() => {
    if (Object.keys(storedShopPosts).length >= 0) {
      sessionStorage.setItem("organizerPostList", JSON.stringify(storedShopPosts));
    }
  }, [storedShopPosts]);

  // Handle post removal
  const handlePostRemoval = (postId) => {
    setStoredShopPosts(prevList => {
      const newList = { ...prevList };
      delete newList[postId];
      sessionStorage.setItem("organizerPostList", JSON.stringify(newList));
      return newList;
    });
  };

  return (
    
    <section className="editShop-section">
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
              onClick={() => navigate(`/organizerDashBoard`)}
            />
      <div className="editShop-content-container">
        <div className="editShop-content-wrapper">
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
                );
              })}

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