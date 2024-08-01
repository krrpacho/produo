import React, { useState } from 'react';
import axiosInstance from './axiosConfig';
import './NewGoals.css';

const NewGoals = ({ onGoalSaved, onClose }) => {
  const [goalName, setGoalName] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const [color, setColor] = useState('#000000');

  const handleSaveGoal = async () => {
    try {
      const newGoal = {
        name: goalName,
        targetTime,
        color
      };
      
      await axiosInstance.post('/api/goals', newGoal);

      // Update local storage and state of goals
      const savedGoals = JSON.parse(localStorage.getItem('goals')) || [];
      savedGoals.push(newGoal);
      localStorage.setItem('goals', JSON.stringify(savedGoals));

      onGoalSaved();
      setGoalName('');
      setTargetTime('');
      setColor('#000000');

    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h1>New goal:</h1>
        <div className="form-group">
          <input
            type="text"
            placeholder="Goal Name"
            className="goal-input"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
          />
        </div>
        <div className="form-group inline-container">
          <label className="time-label">Time I want to spend:</label>
          <input
            type="text"
            placeholder="00:00:00"
            className="time-input"
            value={targetTime}
            onChange={(e) => setTargetTime(e.target.value)}
          />
        </div>
        <div className="form-group inline-container">
          <label className="color-label">Color:</label>
          <input
            type="color"
            className="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div className="add-button">
          <button className="add-goals" onClick={handleSaveGoal}>
            Done!
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGoals;
