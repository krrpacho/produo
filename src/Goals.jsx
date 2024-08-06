import React, { useEffect, useState } from 'react';
import './Goals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const Goals = ({ onSelectGoal, onAddGoalClick, onGoalUpdated }) => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const storedGoals = JSON.parse(localStorage.getItem('goals')) || [];
    setGoals(storedGoals);
  }, []);

  const handleDelete = (goalId) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    alert('Goal deleted successfully!');
  };

  const handleEdit = (updatedGoal) => {
    const updatedGoals = goals.map(goal =>
      goal.id === updatedGoal.id ? updatedGoal : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
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
                  onClick={(e) => { e.stopPropagation(); onGoalUpdated(goal); }}
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
