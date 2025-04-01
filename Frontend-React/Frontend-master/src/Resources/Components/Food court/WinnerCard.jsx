import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

// Components
import TextLink from "../Buttons/textLink";

export default function WinnerCard({ selectionName, selectionImg, kingQueen, princePrincess, popular, winner, isClick }) {
  const [position, setPosition] = useState("");
  const [isVote, setIsVote] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userData = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {};
  // Set the position based on props
  useEffect(() => {
    if (kingQueen) setPosition(kingQueen);
    else if (princePrincess) setPosition(princePrincess);
    else if (popular) setPosition(popular);
  }, [kingQueen, princePrincess, popular]);


  // Handle vote submission
  const handleVoteClick = async () => {
    if (window.confirm(`Are you sure want to vote ${selectionName} as ${position}`)) {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/api/vote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ voter_name: userData.name, selection_name: selectionName, position: position }),
        });

        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(errorMessage || "Failed to submit vote");
        }

        // Store the vote in localStorage
        const storageKey = `${userData.name}-${position}`;
        localStorage.setItem(storageKey, selectionName);
        isClick(true)
        setIsVote(`${userData.name}-${position}`);
        alert("Vote submitted successfully");
      } catch (error) {
        console.error(error);
        alert(error.message || "An error occurred while submitting your vote.");
      } finally {
        setIsLoading(false);
      }
    }

  };


  // Check if the user has already voted for this position 
  const storageKey = `${userData.name}-${position}`;
  const hasVotedForPosition = localStorage.getItem(storageKey);
  const stateHasVotedForPosition = isVote;

  // Check if the current selection is the one the user voted for
  const hasVotedForThisSelection = hasVotedForPosition === selectionName;
  const stateHasVotedForThisSelection = stateHasVotedForPosition === selectionName;

  return (
    <div className="winnerCard-container">
      <img src={`data:image/jpeg;base64,${selectionImg}`} alt={selectionName} />
      <div className="winnerCard-content">
        <h5>{selectionName}</h5>

        {!winner && (hasVotedForThisSelection || stateHasVotedForThisSelection) ? (
          <TextLink btnText={"Voted"} disabled={true} />
        ) : hasVotedForPosition || stateHasVotedForPosition ? (
          null
        ) : !winner && (
          <TextLink
            btnText={isLoading ? "Voting..." : "Vote"}
            onClick={handleVoteClick}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
}