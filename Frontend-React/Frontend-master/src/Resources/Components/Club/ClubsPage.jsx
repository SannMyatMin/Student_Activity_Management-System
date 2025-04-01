import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "motion/react";

import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
// Components
import Button from "../Buttons/button.jsx";
import FoodShop from "../Shop/shopCard.jsx";
import Slider from "../Buttons/Slider.jsx";
import Post from "./Post.jsx";
import ClubEvent from "./ClubEvent.jsx";

// Resources
import Img from "../../Images/profile.jpg";

export default function ClubsPage() {
  const [clubMemberList, setClubMemberList] = useState({}); // Store members per club

  const [isMember, setIsMember] = useState(new Set());

  const userCookie = Cookies.get("user");
  const userData = userCookie && JSON.parse(userCookie);
  const userName = userData && userData.name;
  const roles = userData && userData.roles;
  const studentName = userData && userData.name;
  // const isClubFounder = roles && roles.includes("Founder");
  const isClubFounder = Cookies.get("clubOwner");

  const container = useRef();
  const { scrollYProgress } = useScroll({
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
  const [formActive, setFormActive] = useState(false);
  const [articleActive, setArticleActive] = useState(false);
  const [clubNames, setClubNames] = useState({ club_names: [] });

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [allPostList, setAllPostList] = useState([]);
  const [clubPostList, setClubPostList] = useState([]);
  const [eventPostList, setEventPostList] = useState([]);

  const [clubData, setClubData] = useState([]);
  const navigate = useNavigate();

  // UseForm setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const api = async () => {
      const res = await fetch("http://localhost:8080/post/getAllPosts", {
        method: "GET",
      });
      const result = await res.json();
      const sortedPosts = result.sort((a, b) => b.post_id - a.post_id);
      setEventPostList([]);

      Object.keys(sortedPosts).forEach((key) => {
        const post = sortedPosts[key];
        if (post.visibility === "clubEvent") {
          setEventPostList((prevClubPosts) => [...prevClubPosts, post]);
        }
      });
    };

    api();
  }, [isMember]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/club/getClubs", {
          method: "GET",
        });
        const data = await res.json();
        const clubNames = {
          club_names: data.map((club) => ({ club_name: club.club_name })),
        };

        setClubNames(clubNames);
        setClubData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     if (!clubNames || clubNames.club_names.length === 0) {
  //       console.log("No club names available");
  //       return;  // Ensure there's data before making the POST request
  //     }

  //     try {
  //       const res = await fetch("http://localhost:8080/post/getClubPosts", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify(clubNames)  // Sending the correct payload
  //       });

  //       if (!res.ok) {
  //         const errorMessage = await res.text();
  //         console.log("Error response:", errorMessage);
  //       } else {
  //         const data = await res.json();
  //         console.log("Fetched posts:", data);  // Check the posts received
  //       }
  //     } catch (error) {
  //       console.log("Error during fetch:", error);
  //     }
  //   };

  //   fetchPosts();
  // }, [clubNames]);  // Runs when clubNames is updated

  // Display the top section of other clubs if the user is the founder
  if (isClubFounder) {
    const clubName = isClubFounder;

    let founderOfClub = clubData.findIndex(
      (club) => club.club_name === clubName
    );
    if (founderOfClub !== -1) {
      clubData.unshift(...clubData.splice(founderOfClub, 1));
    }
  }

  // useEffect(() => {
  //   const api = async () => {
  //     const res = await fetch("http://localhost:8080/post/getAllPosts", {
  //       method: "GET",
  //     });
  //     const result = await res.json();

  //     setClubPostList([]);

  //     Object.keys(result).forEach((key) => {
  //       const post = result[key];
  //       if (post.visibility === "Club" || post.visibility === "clubEvent") {
  //         if (post.poster_name === Cookies.get("clubOwner") || isMember.has(post.poster_name)) {
  //           setClubPostList((prevClubPosts) => [...prevClubPosts, post]);
  //         }
  //         fetchData(post.poster_name); // Fetch members for each club post
  //       }
  //     });
  //   };

  //   api();
  // }, [isMember]);

  useEffect(() => {
    const api = async () => {
      const res = await fetch("http://localhost:8080/post/getAllPosts", {
        method: "GET",
      });
      const result = await res.json();

      const sortedPosts = result.sort((a, b) => b.post_id - a.post_id);

      //  const latestPost = sortedPosts[0];
      // const latestPostDatetime = `${latestPost.created_date} ${latestPost.created_time}`;

      // const savedDatetime = localStorage.getItem("newPost");

      // // Compare and update localStorage if new post is detected
      // if (!savedDatetime || new Date(latestPostDatetime) > new Date(savedDatetime)) {
      //   localStorage.setItem("newPost", latestPostDatetime);
      // }

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

  const onSubmit = async (data) => {
    setIsSubmitLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/submitClubForm`, {
        method: "POST",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify({
          club_name: data.clubName,
          description: data.clubDes,
          name: studentName,
        }),
      });
      if (!res.ok) {
        const errorMessage = await res.text();
        alert(errorMessage);
        return;
      }

      alert("Form submitted successfully!");
      setOverlayActive(false);
      setFormActive(false);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Form submission failed. Please try again.");
    } finally {
      setIsSubmitLoading(false);
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
          setFormActive(false);
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
      <div className={`shopRequestForm-container ${formActive && "active"}`}>
        <div className="modal-container-CTA">
          <h5>Club Request Form</h5>
          <div
            className="delete-btn"
            onClick={() => {
              setOverlayActive(false);
              setFormActive(false);
            }}
          >
            <span className="delete-bar"></span>
          </div>
        </div>
        <div className="shopRequestForm-wrapper">
          <h5>
            We will use your name and email automatically as a club founder.
          </h5>
          <div className="form-container">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-row">
                <label htmlFor="clubType">Club Name</label>
                <input
                  type="text"
                  placeholder="Enter club Name"
                  {...register("clubName", {
                    required: "Please enter a club Name.",
                    minLength: {
                      value: 3,
                      message: "Club name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.clubName && (
                  <div className="alert alert-error">
                    <span>{errors.clulbName.message}</span>
                  </div>
                )}
              </div>
              <div className="form-row">
                <label htmlFor="clubType">Description</label>
                <textarea
                  type="text"
                  placeholder="Enter club description"
                  {...register("clubDes", {
                    required: "Please enter a club description.",
                    minLength: {
                      value: 3,
                      message: "Club name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.clubDes && (
                  <div className="alert alert-error">
                    <span>{errors.clubDes.message}</span>
                  </div>
                )}
              </div>

              <div className="form-row">
                <Button
                  btnType="monochrome"
                  btnSize="M"
                  btnText={isSubmitLoading ? "Submitting..." : "Submit"}
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <section className="club-container">
        <div className="club-wrapper">
          <div ref={title} className="club-wrapper-title">
            <motion.h1 style={{ y: titleAnimation }}>
              Join Like-Minded Students in Amazing Club Activities
            </motion.h1>
          </div>
          <div className="club-wrapper-content">
            {!isClubFounder && !localStorage.getItem(`${userName}clubName`) && (
              <div
                onClick={() => {
                  if (userCookie) {
                    setOverlayActive(!overlayActive);
                    setFormActive(!formActive);
                  } else {
                    navigate("/");
                  }
                }}
                className="container clubRequest-container"
              >
                <Slider
                  left="-25%"
                  progress={scrollYProgress}
                  text={"Create your own"}
                  borderRadius={"bottom"}
                />
              </div>
            )}
            <div className="club-text-container">
              <span>Our Clubs</span>
              <h3>
                Join a vibrant community of like-minded individuals to explore
                your passions, engage in exciting activities, and make lifelong
                connections.
              </h3>
            </div>
            <div className="clubs-wrapper">
              {clubData.map((club) => (
                <FoodShop
                  key={club.club_name}
                  shopImg={`data:image/jpeg;base64,${club.image}`}
                  shopName={club.club_name}
                  shopDes={club.title}
                  isOwner={roles && club.club_name.includes(isClubFounder)}
                  onClick={() => {
                    navigate(
                      `/clubInfoPage?clubName=${club.club_name}&clubTitle=${club.title}&clubDes=${club.description}&date=${club.created_date}`
                    );
                    sessionStorage.setItem(
                      "clubPfImage",
                      JSON.stringify(club.image)
                    );
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* <section className="clubEvents-container clubEvents-container-dark">
        <div className="clubEvents-wrapper">
          <div className="clubEvents-title">
            <h2>
              things to <br />
              enjoy
            </h2>
            <Button
              btnSize={"M"}
              btnText={"events overview"}
              btnType={"normal"}
              onClick={() => navigate(`/post?tag=Event`)}
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
                    theme={"dark"}
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
    </>
  );
}
