import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosConfig';
import './stopwatch.css';

const Stopwatch = ({ activeGoal, onTimeAdded }) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const handleStartStop = () => {
    setIsActive(!isActive);
  };

  const handleEnd = async () => {
    setIsActive(false);
    try {
      const date = new Date().toISOString().split('T')[0];
      const response = await axiosInstance.post('/api/times', {
        elapsedTime: `${Math.floor(time / 60)}m ${time % 60}s`,
        date: date,
        goalName: activeGoal.name,
        color: activeGoal.color,
      });
      alert('Time saved successfully!');
      onTimeAdded(response.data);
    } catch (error) {
      console.error('Error saving time:', error);
    }
    setTime(0);
  };

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return (
    <div className="rectangle">
      <div className="stopwatch-container">
        <h1 className="stopwatch-title">Currently working on: {activeGoal ? activeGoal.name : 'No goal selected'}</h1>
        {activeGoal && <h2 className="stopwatch-subtitle">Time you wanted to spend: {activeGoal.targetTime}</h2>}
        <p className="stopwatch-time">
          {hours.toString().padStart(2, "0")}:
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </p>
        <div className="stopwatch-buttons">
          <button className="stopwatch-button" onClick={handleStartStop}>
            {isActive ? "Stop session" : "Start session"}
          </button>
          <button className="stopwatch-button" onClick={handleEnd}>
            End session
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;