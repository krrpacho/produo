import React, { useState } from 'react';
import axiosInstance from './axiosConfig';
import './EditGoalModal.css';

const EditGoalModal = ({ goals, setGoals, goal, onGoalUpdated, onClose }) => {
  const [name, setName] = useState(goal.name);
  const [targetTime, setTargetTime] = useState(goal.targetTime);
  const [color, setColor] = useState(goal.color);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedGoal = { ...goal, name, targetTime, color };
      const response = await axiosInstance.put(`/api/goals/${goal.id}`, updatedGoal);
      if (response.status === 200) {
        alert('Goal updated successfully!');

        // Update the goals list in local storage
        const updatedGoals = goals.map(g => g.id === goal.id ? updatedGoal : g);
        setGoals(updatedGoals);
        localStorage.setItem('goals', JSON.stringify(updatedGoals));

        onGoalUpdated(updatedGoal); // Pass the updated goal to the callback
        onClose();
      } else {
        alert('Failed to update goal.');
      }
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
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGoalModal;
