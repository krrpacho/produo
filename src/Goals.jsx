import React, { useEffect } from 'react';
import axiosInstance from './axiosConfig';
import './Goals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const Goals = ({ goals, onSetGoals, onSelectGoal, onDeleteGoal, onAddGoalClick, onEditGoalClick }) => {
  // Load goals from local storage on mount
  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem('goals'));
    if (savedGoals) {
      onSetGoals(savedGoals);
    }
  }, [onSetGoals]);

  // Save goals to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const handleDelete = async (goalId) => {
    try {
      const response = await axiosInstance.delete(`/api/goals/${goalId}`);
      if (response.status === 204) {
        alert('Goal deleted successfully!');
        onDeleteGoal(goalId);
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
              onClick={() => onSelectGoal(goal)}
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
