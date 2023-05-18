import React, { useState, useEffect } from "react";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  function getTimeLeft() {
    const difference = targetDate - new Date();
    const timeLeft = {};

    if (difference > 0) {
      timeLeft.days = Math.floor(difference / (1000 * 60 * 60 * 24));
      timeLeft.hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      timeLeft.minutes = Math.floor((difference / 1000 / 60) % 60);
      timeLeft.seconds = Math.floor((difference / 1000) % 60);
    }

    return timeLeft;
  }
  return (
    <div className="flex justify-center bg-gray-900 text-white py-10 my-10">
      <div className="text-center">
        <div className="flex items-center justify-center">
          <div className="gradient-bg-gray-600 text-gray-200 p-4 rounded-lg mr-4">
            <div className="text-4xl font-bold">{timeLeft.days}</div>
            <div className="text-sm uppercase">Days</div>
          </div>
          <div className="gradient-bg-gray-600 text-gray-200 p-4 rounded-lg mr-4">
            <div className="text-4xl font-bold">{timeLeft.hours}</div>
            <div className="text-sm uppercase">Hours</div>
          </div>
          <div className="gradient-bg-gray-600 text-gray-200 p-4 rounded-lg mr-4">
            <div className="text-4xl font-bold">{timeLeft.minutes}</div>
            <div className="text-sm uppercase">Minutes</div>
          </div>
          <div className="gradient-bg-gray-600 text-gray-200 p-4 rounded-lg">
            <div className="text-4xl font-bold">{timeLeft.seconds}</div>
            <div className="text-sm uppercase">Seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
