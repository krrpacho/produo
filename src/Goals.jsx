import React, { useEffect, useState } from 'react';
import './Goals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const Goals = ({ goals, onSelectGoal, onAddGoalClick, onEditGoalClick }) => {
  const [localGoals, setLocalGoals] = useState(goals);

  useEffect(() => {
    setLocalGoals(goals);
  }, [goals]);

  const handleDelete = (goalId) => {
    const updatedGoals = localGoals.filter(goal => goal.id !== goalId);
    setLocalGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    alert('Goal deleted successfully!');
  };

  return (
    <div className="rect">
      <div className="goals-container">
        <h1 style={{ color: '#ffffff' }}>Your goals:</h1>
        <ul>
          {localGoals.map(goal => (
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
