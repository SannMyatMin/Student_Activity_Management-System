// React Hooks
import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import { useNavigate, useLocation } from "react-router";
// Components
import Tag from "../Tag/tag";

// Resources
import Img from "../../Images/profile.jpg";
import PostDetail from "./PostDetail";

export default function Post({
  postList,
  postId,
  postAuthor,
  postTag,
  postDes,
  postCaption,
  posterName,
  postTitle,
  postDate,
  postImg,
  isEvent
}) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);  // Scroll to the top of the page
  }, [location.pathname]);

  const postSubj =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum voluptas quasi aperiam quam facere provident, debitis maiores atque animi fuga iste delectus adipisci nobis illo tempore, ipsam eum magni odit.";
  const postDesc =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum voluptas quasi aperiam quam facere provident, debitis maiores atque animi fuga iste delectus adipisci nobis illo tempore, ipsam eum magni odit.Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum voluptas quasi aperiam quam facere provident, debitis maiores atque animi fuga iste delectus adipisci nobis illo tempore, ipsam eum magni odit..Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum voluptas quasi aperiam quam facere provident, debitis maiores atque animi fuga iste delectus adipisci nobis illo tempore, ipsam eum magni odit..Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum voluptas quasi aperiam quam facere provident, debitis maiores atque animi fuga iste delectus adipisci nobis illo tempore, ipsam eum magni odit..Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum voluptas quasi aperiam quam facere provident, debitis maiores atque animi fuga iste delectus adipisci nobis illo tempore, ipsam eum magni odit..Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum voluptas quasi aperiam quam facere provident, debitis maiores atque animi fuga iste delectus adipisci nobis illo tempore, ipsam eum magni odit.";
  return (
    <>
      <a href="">
        <div className="post-container" onClick={() => {

          sessionStorage.setItem("postId", postId)
          sessionStorage.setItem("postTitle", postTitle);
          sessionStorage.setItem("author", postAuthor);
          sessionStorage.setItem("posterName", posterName);
          sessionStorage.setItem("postDate", postDate);
          sessionStorage.setItem("postCaption", postCaption);
          sessionStorage.setItem("postDesc", postDes);
          sessionStorage.setItem("clubImage", postImg);
          sessionStorage.setItem("postList", JSON.stringify(postList))
          if (isEvent) {
            sessionStorage.setItem("isEvent", isEvent)
          }else {
            sessionStorage.removeItem("isEvent")
          }
          // Navigate to the postDetail page
          navigate(`/postDetail`);
        }}>

          <div className="post-wrapper">
            <div className="postLeft-container">
              <div className="postTag-container">
                <div className="role-wrapper">
                  <Tag tagText={posterName} tagType={"monochrome"} />
                  {isEvent && <Tag tagText={"Event"} tagType={"monochrome"} />}
                </div>
              </div>
              <h3>{postTitle}</h3>
              <div className="postAuthor-container">
                <h5>{postAuthor}</h5>
                <h5>{postDate}</h5>
              </div>
            </div>
            <p>{postCaption}</p>
          </div>
        </div>

      </a>


    </>
  );
}
