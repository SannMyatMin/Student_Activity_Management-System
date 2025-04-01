// React Hooks
import React, { useRef } from "react";
import { useState } from "react";

// Components
import Button from "../Buttons/button.jsx";
import ClubEvent from "../Club/ClubEvent.jsx";

// Resources
import Img from "../../Images/profile.jpg";
import Club from "../Club/ClubsPage.jsx";
import Shop from "../Shop/shopCard.jsx";

export default function Events() {
  const [articleActive, setArticleActive] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);

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
      <section className="events-header">
        <div className="events-title-container">
          <h1>events</h1>
          <span className="shopNum">(5)</span>
        </div>
        <div className="events-filter-container">
          <span>Filter : All Events</span>
          <div className="posts-filter-wrapper">
            <Button btnText={"All"} btnType={"normal"} btnSize={"L"} />
            <Button btnText={"Club"} btnType={"normal"} btnSize={"L"} />
            <Button btnText={"Local"} btnType={"normal"} btnSize={"L"} />
          </div>
        </div>
      </section>
      <section className="events-container">
        <div className="events-wrapper">
          <ClubEvent
            onClick={() => {
              setOverlayActive(!overlayActive);
              setArticleActive(!articleActive);
            }}
            theme={"dark"}
            img={Img}
            clubName={"Art Club"}
            eventSubject={`"Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, harum."`}
          />
          <ClubEvent
            onClick={() => {
              setOverlayActive(!overlayActive);
              setArticleActive(!articleActive);
            }}
            theme={"dark"}
            img={Img}
            clubName={"Art Club"}
            eventSubject={`"Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, harum."`}
          />
          <ClubEvent
            onClick={() => {
              setOverlayActive(!overlayActive);
              setArticleActive(!articleActive);
            }}
            theme={"dark"}
            img={Img}
            clubName={"Art Club"}
            eventSubject={`"Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, harum."`}
          />
          <ClubEvent
            onClick={() => {
              setOverlayActive(!overlayActive);
              setArticleActive(!articleActive);
            }}
            theme={"dark"}
            img={Img}
            clubName={"Art Club"}
            eventSubject={`"Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, harum."`}
          />
          <ClubEvent
            onClick={() => {
              setOverlayActive(!overlayActive);
              setArticleActive(!articleActive);
            }}
            theme={"dark"}
            img={Img}
            clubName={"Art Club"}
            eventSubject={`"Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, harum."`}
          />
        </div>
      </section>
    </>
  );
}
