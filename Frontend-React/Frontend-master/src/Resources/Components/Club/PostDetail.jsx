import React from "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useScroll, useTransform, motion } from "motion/react";
import Button from "../Buttons/button.jsx";
import Post from "./Post.jsx";
import Tag from "../Tag/tag.jsx";

export default function PostDetail() {
  // Retrieve data from sessionStorage
  const postList = JSON.parse(sessionStorage.getItem("postList"));
  const postId = sessionStorage.getItem("postId");
  const author = sessionStorage.getItem("author");
  const date = sessionStorage.getItem("postDate");
  const title = sessionStorage.getItem("postTitle");
  const posterName = sessionStorage.getItem("posterName");
  const caption = sessionStorage.getItem("postCaption");
  const desc = sessionStorage.getItem("postDesc");
  const img = sessionStorage.getItem("clubImage");
  const isEvent = sessionStorage.getItem("isEvent");

  const navigate = useNavigate();

  const animationTitle = useRef(null);
  const { scrollYProgress: titleYProgress } = useScroll({
    target: animationTitle,
    offset: ["start end", "end start"],
  });
  const titleAnimation = useTransform(titleYProgress, [0, 1], [-450, 350]);

  return (
    <>
      <section ref={animationTitle} className="postDetail-header">
        <motion.div
          style={{ y: titleAnimation }}
          className="postDetail-header-wrapper"
        >
          <div className="role-wrapper">
            <Tag tagText={posterName} tagType={"normal"} />
            {isEvent && <Tag tagText={"Event"} tagType={"normal"} />}
          </div>
          <h1>{title}</h1>
        </motion.div>
      </section>
      <section className="postDetail-container">
        <div className="postDetail-author">
          <h5>{author}</h5>
          <span>{date}</span>
        </div>
        <img src={`data:image/jpeg;base64,${img}`} alt="" />
        <div className="postDetail-content">
          <h3>{caption}</h3>
          <p>{desc}</p>
        </div>
      </section>
      <section className="clubPosts-container">
        <div className="clubPosts-title">
          <h2>Next Up</h2>
          <Button
            btnSize={"M"}
            btnText={"posts overview"}
            btnType={"monochrome"}
            onClick={() => navigate(`/post?tag=All`)}
          />
        </div>
        <div className="clubPosts-wrapper">
          {Object.keys(postList).map((key) => {
            if (postList[key].post_id != postId) {
              return (
                <Post
                  key={key}
                  postList={postList}
                  isEvent={
                    postList[key].visibility === "clubEvent" ? true : false
                  }
                  postId={postList[key].post_id}
                  postImg={postList[key].image}
                  postCaption={postList[key].caption}
                  postTitle={postList[key].title}
                  posterName={postList[key].poster_name}
                  postAuthor={postList[key].creator_name}
                  postTag={postList[key].title}
                  postDate={postList[key].created_date}
                  postDes={postList[key].content}
                />
              );
            }
          })}
        </div>
      </section>
    </>
  );
}
