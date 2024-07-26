import React, { useEffect } from 'react';
import axiosInstance from './axiosConfig';
import './Goals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const Goals = ({ goals, onSelectGoal, onDeleteGoal, onAddGoalClick, onEditGoalClick }) => {
  useEffect(() => {
    const savedGoalId = localStorage.getItem('selectedGoalId');
    if (savedGoalId) {
      const savedGoal = goals.find(goal => goal.id === parseInt(savedGoalId, 10));
      if (savedGoal) {
        onSelectGoal(savedGoal);
      }
    }
  }, [goals, onSelectGoal]);

  const handleSelectGoal = (goal) => {
    localStorage.setItem('selectedGoalId', goal.id);
    onSelectGoal(goal);
  };

  const handleDelete = async (goalId) => {
    try {
      const response = await axios.delete(`/api/goals/${goalId}`);
      if (response.status === 204) {
        alert('Goal deleted successfully!');
        onDeleteGoal(goalId);
        const savedGoalId = localStorage.getItem('selectedGoalId');
        if (savedGoalId === goalId.toString()) {
          localStorage.removeItem('selectedGoalId');
        }
      } else {
        alert('Failed to delete goal.');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Failed to delete goal.');
    }
  };

  return (
    <div className="rect">
      <div className="goals-container">
        <h1 style={{ color: '#ffffff' }}>Your goals:</h1>
        <ul>
          {goals.map(goal => (
            <li 
              key={goal.id} 
              style={{ backgroundColor: goal.color }} 
              className="goal-item" 
              onClick={() => handleSelectGoal(goal)}
            >
              <span>{goal.name}</span>
              <div className="icons">
                <FontAwesomeIcon
                  icon={faEdit}
                  onClick={(e) => { e.stopPropagation(); onEditGoalClick(goal); }}
                  className="edit-icon"
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={(e) => { e.stopPropagation(); handleDelete(goal.id); }}
                  className="delete-icon"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="goals-footer">
        <button className="add-goals" onClick={onAddGoalClick}>
          <span className="plus-symbol">+</span>
        </button>
      </div>
    </div>
  );
};

export default Goals;
