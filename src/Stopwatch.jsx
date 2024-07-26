import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosConfig';
import './stopwatch.css';

const Stopwatch = ({ activeGoal, onTimeAdded }) => {
  const [time, setTime] = useState(() => {
    const savedTime = localStorage.getItem('stopwatchTime');
    return savedTime ? parseInt(savedTime, 10) : 0;
  });

  const [isActive, setIsActive] = useState(() => {
    const savedState = localStorage.getItem('stopwatchState');
    return savedState === 'true';
  });

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

  useEffect(() => {
    localStorage.setItem('stopwatchTime', time);
    localStorage.setItem('stopwatchState', isActive);
  }, [time, isActive]);

  const handleStartStop = () => {
    setIsActive(!isActive);
  };

  const handleEnd = async () => {
    setIsActive(false);
    try {
      const date = new Date().toISOString().split('T')[0];
      const response = await axios.post('/api/times', {
        elapsedTime: `${Math.floor(time / 60)}m ${time % 60}s`,
        date: date,
        goalName: activeGoal.name,
        color: activeGoal.color,
      });
      alert('Time saved successfully!');
      onTimeAdded(response.data);
      localStorage.removeItem('stopwatchTime');
      localStorage.removeItem('stopwatchState');
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
        <h1 className="stopwatch-title">Currently Working on: {activeGoal ? activeGoal.name : 'No goal selected'}</h1>
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
