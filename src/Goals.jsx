import React, { useEffect, useState } from 'react';
import './Goals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const Goals = ({ onSelectGoal, onAddGoalClick, onEditGoalClick }) => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    // Retrieve goals from local storage
    const storedGoals = JSON.parse(localStorage.getItem('goals')) || [];
    setGoals(storedGoals);
  }, []);

  const handleDelete = (goalId) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    alert('Goal deleted successfully!');
  };

  const handleEditClick = (goal) => {
    onEditGoalClick(goal);
  };

  return (
    <div className="goals-container">
      <button className="add-goal-btn" onClick={onAddGoalClick}>
        Add New Goal
      </button>
      {goals.length > 0 ? (
        <ul className="goals-list">
          {goals.map(goal => (
            <li key={goal.id} className="goal-item" style={{ backgroundColor: goal.color }}>
              <div className="goal-info" onClick={() => onSelectGoal(goal)}>
                <div className="goal-name" style={{ color: goal.color }}>
                  {goal.name}
                </div>
                <div className="goal-time">{goal.targetTime}</div>
              </div>
              <div className="icons">
                <FontAwesomeIcon
                  icon={faEdit}
                  onClick={(e) => { e.stopPropagation(); handleEditClick(goal); }}
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
      ) : (
        <p>No goals available.</p>
      )}
    </div>
  );
};

export default Goals;
