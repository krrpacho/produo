import React, { useState } from 'react';
import axiosInstance from './axiosConfig';
import './EditGoalModal.css';

const EditGoalModal = ({ goal, onGoalUpdated, onClose }) => {
  const [name, setName] = useState(goal.name);
  const [targetTime, setTargetTime] = useState(goal.targetTime);
  const [color, setColor] = useState(goal.color);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedGoal = { ...goal, name, targetTime, color };
      const storedGoals = JSON.parse(localStorage.getItem('goals')) || [];
      const updatedGoals = storedGoals.map(g => g.id === goal.id ? updatedGoal : g);
      localStorage.setItem('goals', JSON.stringify(updatedGoals));  // Store the updated goals array
      onGoalUpdated(updatedGoals);  // Pass the updated goals array to the parent component
      onClose();
    } catch (error) {
      console.error('Error updating goal:', error);
      alert('Failed to update goal.');
    }
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h1>Edit Goal:</h1>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Goal Name"
              className="goal-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group inline-container">
            <label className="time-label">Time to Spend:</label>
            <input
              type="text"
              placeholder="00:00:00"
              className="time-input"
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group inline-container">
            <label className="color-label">Color:</label>
            <input
              type="color"
              className="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="button" onClick={handleSubmit}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGoalModal;//old