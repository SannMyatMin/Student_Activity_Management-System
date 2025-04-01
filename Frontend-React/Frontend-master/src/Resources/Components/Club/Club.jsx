// React Hooks
import React, { useReducer, useEffect, useRef } from "react";
import { useState } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import Cookies from "js-cookie";
// Resources
import Img from "../../Images/profile.jpg";
import Slider from "../Buttons/Slider.jsx";
import Button from "../Buttons/button.jsx";
import ClubEvent from "./ClubEvent.jsx";
import Member from "./Member.jsx";
import Post from "./Post.jsx";

export default function Club() {
  const userCookie = Cookies.get("user");
  const userData = userCookie && JSON.parse(userCookie);
  const roles = userData && userData.roles;
  const studentName = userData && userData.name;

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [clubMembers, setClubMembers] = useState([]);
  const [eventPostList, setEventPostList] = useState([]);
  const [clubPostList, setClubPostList] = useState([]);
  const [clubMemberList, setClubMemberList] = useState({}); // Store members per club
  const [isMember, setIsMember] = useState(false);
  const [remove, setRemove] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [location]);

  const container = useRef();
  const { scrollYProgress: sliderYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  const eventContainer = useRef();
  const { scrollYProgress: eventYProgress } = useScroll({
    target: eventContainer,
    offset: ["start end", "end start"],
  });
  const x = useTransform(eventYProgress, [0, 1], [250, -250]);
  const [overlayActive, setOverlayActive] = useState(false);
  const [articleActive, setArticleActive] = useState(false);
  const imgRef = useRef(null);
  const { scrollYProgress: imgPositionY } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  const imgPosition = useTransform(imgPositionY, [0, 500], ["0%", "100%"]);
  const photoContainer = useRef();
  const { scrollYProgress: photoYProgress } = useScroll({
    target: photoContainer,
    offset: ["start end", "end start"],
  });
  const photoAnimation = useTransform(
    photoYProgress,
    [0, 1],
    ["250px", "-250px"]
  );

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const handleRequestClub = async () => {
    if (window.confirm("Are you sure want to join club?")) {
      try {
        const res = await fetch("http://localhost:8080/api/applyClub", {
          method: "POST",
          headers: {
            "Content-type": "Application/json",
          },
          body: JSON.stringify({
            name: studentName,
            club_name: params.get("clubName"),
          }),
        });

        if (!res.ok) {
          const errorMsg = await res.text();
          alert(errorMsg);
          return;
        }
        await delay(1000);
        alert(`Successfully send request to join ${params.get("clubName")}`);
      } catch (error) {
        console.log(error);
        alert("Fail to send request");
      }
    }
  };

  useEffect(() => {
    const api = async () => {
      const res = await fetch("http://localhost:8080/post/getAllPosts", {
        method: "GET",
      });
      const result = await res.json();
      const sortedPosts = result.sort((a, b) => b.post_id - a.post_id);
      setEventPostList([]);
      setClubPostList([]);

      Object.keys(sortedPosts).forEach((key) => {
        const post = sortedPosts[key];
        if (
          (post.visibility === "clubEvent" || post.visibility === "Club") &&
          post.poster_name === params.get("clubName")
        ) {
          setClubPostList((prevClubPosts) => [...prevClubPosts, post]);
        }
        if (
          post.visibility === "clubEvent" &&
          post.poster_name === params.get("clubName")
        ) {
          setEventPostList((prevClubPosts) => [...prevClubPosts, post]);
        }
        fetchData(post.poster_name); // Fetch members for each club post
      });
    };

    api();
  }, [isMember]);

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
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/club/getClubMembers", {
          method: "POST",
          headers: {
            "Content-type": "Application/json",
          },
          body: JSON.stringify({ club_name: params.get("clubName") }),
        });
        const data = await res.json();
        Object.keys(data).map((key) => {
          if (data[key].name === userData.name) {
            setIsMember(true);
          }
        });
        setClubMembers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [remove]);

  // const scrollToBottom = () => {
  //   setTimeout(() => {
  //     window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  //   }, 500); // Delay for 100 milliseconds before scrolling
  // };
  console.log(isMember);
  const handleRemoveMember = async (memberName) => {
    if (window.confirm(`Are you sure want to leave?`)) {
      const res = await fetch(`http://localhost:8080/club/removeFromClub`, {
        method: "POST",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify({
          student_name: memberName,
          club_name: params.get("clubName"),
        }),
      });
      if (!res.ok) {
        const errorMessage = await res.text();
        console.log(errorMessage);
      }
      setRemove(true);
      navigate("/club");
    }
  };

  const title = useRef(null);
  const { scrollYProgress: titleYProgress } = useScroll({
    target: title,
    offset: ["start end", "end start"],
  });
  const titleAnimation = useTransform(titleYProgress, [0, 1], [-450, 350]);

  return (
    <>
      <div
        onClick={() => {
          setOverlayActive(false);
          setArticleActive(false);
        }}
        className={`overlay nav-mobile-overlay ${overlayActive && "active"}`}
      ></div>
      <div className={`readArticle-container ${articleActive && "active"}`}>
        <div className="readArticle-container-CTA">
          <img src={Img} alt="" />
          <div
            className="delete-btn"
            onClick={() => {
              setOverlayActive(false);
              setArticleActive(false);
            }}
          >
            <span className="delete-bar"></span>
          </div>
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint minus
          voluptatem voluptates ex, mollitia necessitatibus quam ratione ab
          inventore vero libero facilis ullam voluptas accusantium delectus
          consequatur pariatur illum. Mollitia.
        </p>
        <h5>
          From : <a href="">Art Club</a>
        </h5>
      </div>
      <section ref={title} className="clubDetailTitle-container">
        <motion.h1 style={{ y: titleAnimation }}>
          {params.get("clubTitle")}
        </motion.h1>
      </section>
      <section className="clubDetailContent-container">
        <div className="clubDetailContent-title">
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
            onClick={() => navigate("/club")}
          />
          <span>Created from : {params.get("date")}</span>
          {Cookies.get("clubOwner") !== params.get("clubName") && isMember && (
            <Button
              btnSize={"M"}
              btnText={"Leave club"}
              btnType={"light"}
              onClick={() => handleRemoveMember(userData.name)}
            />
          )}

          {Cookies.get("clubOwner") === params.get("clubName") && (
            <Button
              btnSize={"M"}
              btnText={"Edit club"}
              btnType={"normal"}
              onClick={() =>
                navigate(
                  `/editClub?clubName=${params.get(
                    "clubName"
                  )}&clubTitle=${params.get("clubTitle")}&clubDes=${params.get(
                    "clubDes"
                  )}&date=${params.get("date")}`
                )
              }
            />
          )}
        </div>
        <div ref={imgRef} className="clubDetailContent-img">
          <motion.div
            className="clubDetail-img"
            style={{
              backgroundImage: `url(data:image/jpeg;base64,${JSON.parse(
                sessionStorage.getItem("clubPfImage")
              )})`,
              backgroundSize: "cover",
              backgroundPosition: `0% ${imgPosition}`,
            }}
          ></motion.div>
        </div>
        <div className="clubDetailAbout-wrapper">
          <h2>{params.get("clubName")}</h2>
          <p>{params.get("clubDes")}</p>
        </div>
      </section>

      {/* <section className="clubEvents-container clubEvents-container-light">
        <div className="clubEvents-wrapper">
          <div className="clubEvents-title">
            <h2>
              things to <br />
              enjoy
            </h2>
            <Button
              btnSize={"M"}
              btnText={"events overview"}
              btnType={"monochrome"}
              onClick={() => navigate("/post?tag=Event")}
            />
          </div>
          <div ref={eventContainer} className="clubEvents">
            <motion.div className="clubEvents-box" style={{ x }}>
              {eventPostList && Object.keys(eventPostList).map(key => {
                return (
                  <ClubEvent
                    onClick={() => {
                      // setOverlayActive(!overlayActive);
                      // setArticleActive(!articleActive);

                      sessionStorage.setItem("postId", eventPostList[key].post_id)
                      sessionStorage.setItem("postTitle", eventPostList[key].title);
                      sessionStorage.setItem("author", eventPostList[key].creator_name);
                      sessionStorage.setItem("posterName", eventPostList[key].poster_name);
                      sessionStorage.setItem("postDate", eventPostList[key].created_date);
                      sessionStorage.setItem("postCaption", eventPostList[key].caption);
                      sessionStorage.setItem("postDesc", eventPostList[key].content);
                      sessionStorage.setItem("clubImage", eventPostList[key].image);
                      sessionStorage.setItem("postList", JSON.stringify(eventPostList))
                      navigate("/postDetail")
                    }}
                    theme={"light"}
                    title={eventPostList[key].title}
                    clubName={eventPostList[key].poster_name}
                    eventSubject={eventPostList[key].caption}
                  />
                )
              })}
            </motion.div>
          </div>
        </div>
      </section> */}
      <section className="clubMembers-container">
        <div className="clubMembers-title">
          <h2>The squad</h2>
          {Cookies.get("clubOwner") !== params.get("clubName") && !isMember && (
            <Button
              btnSize={"M"}
              btnText={"Wanna join club ?"}
              btnType={"normal"}
              onClick={() => {
                if (userCookie) {
                  handleRequestClub();
                } else {
                  navigate("/");
                }
              }}
            />
          )}
        </div>

        <div className="clubMembers-wrapper">
          {clubMembers &&
            clubMembers.map((member) => (
              <Member
                img={`data:image/jpeg;base64,${member.image}`}
                name={member.name}
                role={member.role}
              />
            ))}
        </div>
      </section>
      <section className="clubPosts-container">
        <div className="clubPosts-title">
          <h2>
            featured <br />
            posts
          </h2>
          <Button
            btnSize={"M"}
            btnText={"posts overview"}
            btnType={"monochrome"}
            onClick={() => navigate(`/post?tag=Club`)}
          />
        </div>
        <div className="clubPosts-wrapper">
          {clubPostList.map((post) => (
            <Post
              key={post}
              postList={clubPostList}
              isEvent={post.visibility === "clubEvent" ? true : false}
              postId={post.post_id}
              postImg={post.image}
              postCaption={post.caption}
              postTitle={post.title}
              posterName={post.poster_name}
              postAuthor={post.creator_name}
              postTag={post.title}
              postDate={post.created_date}
              postDes={post.content}
            />
          ))}
        </div>
      </section>
      {/* <section ref={photoContainer} className="clubPhotos-container">
        <motion.div
          className="clubPhotos-wrapper"
          style={{ x: photoAnimation }}
        >
          <img src={Img} alt="" />
          <img src={Img} alt="" />
          <img src={Img} alt="" />
          <img src={Img} alt="" />
        </motion.div>
        {!Cookies.get("clubOwner") &&
          <a href="#" onClick={() => handleRequestClub()}>
            <div className="container clubJoin-container">
              <Slider
                left="-25%"
                progress={sliderYProgress}
                text={"Join Club"}
                borderRadius={"bottom"}
              />
            </div>
          </a>
        }
      </section> */}
    </>
  );
}
