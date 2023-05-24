import React, { useEffect, useState } from 'react';

const CountdownTimer: React.FC = () => {
  const [remainingTime, setRemainingTime] = useState(119); // Initial remaining time in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <p className="text-s text-center font-bold tracking-wider text-green-600">
      {formatTime(remainingTime)}
    </p>
  );
};

export default CountdownTimer;