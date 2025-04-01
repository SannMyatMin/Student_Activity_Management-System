import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";

export default function CountDown({ timeLimit, timeout }) {
  const [endTime, setEndTime] = useState(() => {
    const storedEndTime = localStorage.getItem("endTime");
    return storedEndTime ? parseInt(storedEndTime, 10) : null;
  });
  const [ended, setEnded] = useState(false);

  // Set a new end time if there isn't one or it's in the past
  useEffect(() => {
    const now = Date.now();

    if (!endTime || endTime <= now) {
      const newEndTime = now + parseInt(timeLimit, 10) * 60 * 1000;
      localStorage.setItem("endTime", newEndTime);
      setEndTime(newEndTime);
      setEnded(false);
    }
  }, [timeLimit, endTime]);

  // Effect to check if the timer should be considered "ended"
  useEffect(() => {
    const interval = setInterval(() => {
      if (endTime && Date.now() >= endTime) {
        setEnded(true);
        localStorage.removeItem("countDownTime")
        localStorage.removeItem("endTime")
        clearInterval(interval);
        timeout(true)
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);
  return (
    <>
      {endTime && !ended ? (
        <h5>
          Voting will end in{" "}
          <span>
            <Countdown
              date={endTime}
              renderer={({ minutes, seconds }) => (
                <span className={minutes < 7 && `counting-alert`}>
                  {minutes} : {seconds < 10 ? `0${seconds}` : seconds}
                </span>
              )}
              onComplete={() => setEnded(true)}
            />
          </span>{" "}
          mins.
        </h5>
      ) : null}


      {(ended || (localStorage.getItem("countDownTime") && localStorage.getItem("timeout")))  && <h5>The voting time has ended!</h5>}
    </>
  );
}
