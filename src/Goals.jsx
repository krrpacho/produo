import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosConfig';
import './Goals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const Goals = ({ onSelectGoal, onAddGoalClick, onEditGoalClick }) => {
  const [goals, setGoals] = useState([]);

  // Load goals from local storage or server on component mount
  useEffect(() => {
    const loadGoals = async () => {
      const savedGoals = JSON.parse(localStorage.getItem('goals'));
      if (savedGoals) {
        setGoals(savedGoals);
      } else {
        try {
          const response = await axiosInstance.get('/api/goals');
          const fetchedGoals = response.data;
          setGoals(fetchedGoals);
          localStorage.setItem('goals', JSON.stringify(fetchedGoals));
        } catch (error) {
          console.error('Error fetching goals:', error);
        }
      }
    };

    loadGoals();
  }, []);

  // Save goals to local storage whenever the goals state changes
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const handleDelete = async (goalId) => {
    try {
      const response = await axiosInstance.delete(`/api/goals/${goalId}`);
      if (response.status === 204) {
        alert('Goal deleted successfully!');
        setGoals((prevGoals) => prevGoals.filter(goal => goal.id !== goalId));
      } else {
        alert('Failed to delete goal.');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Failed to delete goal.');
    }
  };

  const handleAddGoal = (newGoal) => {
    setGoals((prevGoals) => [...prevGoals, newGoal]);
    onAddGoalClick();
  };

  const handleEditGoal = (updatedGoal) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
    );
    onEditGoalClick(updatedGoal);
  };

  return (
    <div className="rect">
      <div className="goals-container">
        <h1 style={{ color: '#ffffff' }}>Your goals:</h1>
        <ul>
          {goals.map((goal) => (
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
                  onClick={(e) => { e.stopPropagation(); handleEditGoal(goal); }}
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
