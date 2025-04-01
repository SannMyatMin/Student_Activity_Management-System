// React Hooks
import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useScroll, useTransform, motion } from "motion/react";
import { useLocation } from "react-router";

// Components
import Button from "../Buttons/button.jsx";
import Post from "../Club/Post";

// Resources
import shopImg from "../../Images/profile.jpg";

export default function Posts() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [allPostList, setAllPostList] = useState([]);
  const [clubPostList, setClubPostList] = useState([]);
  const [eventPostList, setEventPostList] = useState([]);
  const [clubMemberList, setClubMemberList] = useState({}); // Store members per club
  const [isMember, setIsMember] = useState(new Set());

  const [allPostActive, setAllPostActive] = useState(true);
  const [clubPostActive, setclubPostActive] = useState(false);
  const [eventPostActive, setEventPostActive] = useState(false);

  const userData = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {};
  const userName = userData.name;

  useEffect(() => {
    if (params.get("tag") === "Event") {
      setEventPostActive(true);
      setAllPostActive(false);
      setclubPostActive(false);
    } else if (params.get("tag") === "Club") {
      setEventPostActive(false);
      setclubPostActive(true);
      setAllPostActive(false);
    } else if (params.get("tag") === "All") {
      setEventPostActive(false);
      setclubPostActive(false);
      setAllPostActive(true);
    }
  }, []);

  useEffect(() => {
    const api = async () => {
      const res = await fetch("http://localhost:8080/post/getAllPosts", {
        method: "GET",
      });
      const result = await res.json();

      const sortedPosts = result.sort((a, b) => b.post_id - a.post_id);

      const latestPost = sortedPosts[0];
      const latestPostDatetime = `${latestPost.created_date} ${latestPost.created_time}`;

      const savedDatetime = localStorage.getItem("newPost");

      // Compare and update localStorage if new post is detected
      if (
        !savedDatetime ||
        new Date(latestPostDatetime) > new Date(savedDatetime)
      ) {
        localStorage.setItem("newPost", latestPostDatetime);
      }

      setAllPostList([]);
      setClubPostList([]);
      setEventPostList([]);

      Object.keys(sortedPosts).forEach((key) => {
        const post = sortedPosts[key];
        if (
          post.poster_name === Cookies.get("clubOwner") ||
          isMember.has(post.poster_name) ||
          post.visibility === "shopEvent" ||
          post.visibility === "clubEvent"
        ) {
          setAllPostList((prevClubPosts) => [...prevClubPosts, post]);
        }

        if (
          post.visibility === "clubEvent" ||
          post.visibility === "shopEvent"
        ) {
          setEventPostList((prevClubPosts) => [...prevClubPosts, post]);
        }
        fetchData(post.poster_name); // Fetch members for each club post
      });
    };

    api();
  }, [isMember]);

  useEffect(() => {
    Object.keys(allPostList).forEach((key) => {
      const post = allPostList[key];
      if (post.visibility === "Club" || post.visibility === "clubEvent") {
        setClubPostList((prevClubPosts) => [...prevClubPosts, post]);
      }
    });
  }, [allPostList]);

  const fetchData = async (clubName) => {
    if (!clubMemberList[clubName]) {
      // Fetch only if not already fetched
      try {
        const res = await fetch("http://localhost:8080/club/getClubMembers", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ club_name: clubName }),
        });
        const data = await res.json();
        // Store members for this club
        setClubMemberList((prevList) => ({
          ...prevList,
          [clubName]: data,
        }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    // Iterating over the clubMemberList
    Object.keys(clubMemberList).forEach((key) => {
      clubMemberList[key].forEach((member) => {
        if (member.name === userName) {
          setIsMember((prevSet) => {
            const updatedSet = new Set(prevSet);
            updatedSet.add(key); // Add the key to the Set
            return updatedSet; // Return the updated Set
          });
        }
      });
    });
  }, [clubMemberList, userName]); // Include userName as dependency

  const title = useRef(null);
  const { scrollYProgress: titleYProgress } = useScroll({
    target: title,
    offset: ["start end", "end start"],
  });
  const titleAnimation = useTransform(titleYProgress, [0, 1], [-320, 250]);
  const smallTitleAnimation = useTransform(titleYProgress, [0, 1], [-300, 220]);

  return (
    <>
      <section className="posts-header">
        <div ref={title} className="posts-title-container">
          <motion.h1 style={{ y: titleAnimation }}>News</motion.h1>
          <motion.span style={{ y: smallTitleAnimation }} className="shopNum">
            ({allPostActive && allPostList.length}
            {clubPostActive && clubPostList.length}
            {eventPostActive && eventPostList.length})
          </motion.span>
        </div>
        <div className="posts-filter-container">
          <span>
            Filter:{" "}
            {allPostActive
              ? "All Posts"
              : clubPostActive
              ? "Club Posts"
              : eventPostActive
              ? "Event Posts"
              : ""}
          </span>
          <div className="posts-filter-wrapper">
            <Button
              btnText={"All"}
              btnType={"monochrome"}
              btnSize={"L"}
              active={allPostActive}
              onClick={() => {
                setAllPostActive(true);
                setclubPostActive(false);
                setEventPostActive(false);
              }}
            />
            <Button
              btnText={"Club"}
              btnType={"monochrome"}
              btnSize={"L"}
              active={clubPostActive}
              onClick={() => {
                setAllPostActive(false);
                setclubPostActive(true);
                setEventPostActive(false);
              }}
            />
            <Button
              btnText={"Event"}
              btnType={"monochrome"}
              btnSize={"L"}
              active={eventPostActive}
              onClick={() => {
                setAllPostActive(false);
                setclubPostActive(false);
                setEventPostActive(true);
              }}
            />
          </div>
        </div>
      </section>

      <section className="posts-container">
        <div className="clubPosts-wrapper">
          {allPostActive &&
            allPostList.map((post) => {
              return (
                <Post
                  key={post}
                  postList={allPostList}
                  isEvent={post.visibility === "clubEvent" ? true : false}
                  postId={post.post_id}
                  postImg={post.image}
                  postTitle={post.title}
                  postCaption={post.caption}
                  posterName={post.poster_name}
                  postAuthor={post.creator_name}
                  postTag={post.title}
                  postDate={post.created_date}
                  postDes={post.content}
                />
              );
            })}

          {clubPostActive &&
            clubPostList.map((post) => (
              <Post
                key={post}
                postList={clubPostList}
                isEvent={post.visibility === "clubEvent" ? true : false}
                postId={post.post_id}
                postImg={post.image}
                postTitle={post.title}
                postCaption={post.caption}
                posterName={post.poster_name}
                postAuthor={post.creator_name}
                postTag={post.title}
                postDate={post.created_date}
                postDes={post.content}
              />
            ))}

          {eventPostActive &&
            eventPostList.map((post) => (
              <Post
                key={post}
                postList={eventPostList}
                isEvent={post.visibility === "clubEvent" ? true : false}
                postId={post.post_id}
                postImg={post.image}
                postTitle={post.title}
                postCaption={post.caption}
                posterName={post.poster_name}
                postAuthor={post.creator_name}
                postTag={post.title}
                postDate={post.created_date}
                postDes={post.content}
              />
            ))}
        </div>
      </section>
    </>
  );
}
