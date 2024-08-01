import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosConfig';
import './EditGoalModal.css';

const EditGoalModal = ({ goal, onGoalUpdated, onClose }) => {
  const [name, setName] = useState(goal.name);
  const [targetTime, setTargetTime] = useState(goal.targetTime);
  const [color, setColor] = useState(goal.color);

  // Load saved goal data from local storage when the modal opens
  useEffect(() => {
    const savedGoal = JSON.parse(localStorage.getItem(`goal-${goal.id}`)) || {};
    setName(savedGoal.name || goal.name);
    setTargetTime(savedGoal.targetTime || goal.targetTime);
    setColor(savedGoal.color || goal.color);
  }, [goal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'targetTime':
        setTargetTime(value);
        break;
      case 'color':
        setColor(value);
        break;
      default:
        break;
    }
    
    // Save the current state to local storage
    localStorage.setItem(`goal-${goal.id}`, JSON.stringify({ name, targetTime, color }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedGoal = { ...goal, name, targetTime, color };
      const response = await axiosInstance.put(`/api/goals/${goal.id}`, updatedGoal);
      if (response.status === 200) {
        alert('Goal updated successfully!');
        onGoalUpdated();  
        onClose(); 
        // Clear local storage after successful update
        localStorage.removeItem(`goal-${goal.id}`);
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
              name="name"
              onChange={handleChange}
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
              name="targetTime"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group inline-container">
            <label className="color-label">Color:</label>
            <input
              type="color"
              className="color"
              value={color}
              name="color"
              onChange={handleChange}
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
