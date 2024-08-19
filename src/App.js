import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from './axiosConfig';
import Goals from './Goals';
import NewGoals from './NewGoals';
import EditGoalModal from './EditGoalModal';
import Stopwatch from './Stopwatch';
import CalendarComponent from './CalendarComponent';
import ChartComponent from './ChartComponent';
import MonthlyBarChart from './MonthlyBarChart';
import YearlyBarChart from './YearlyBarChart';
import Navbar from './Navbar';
import Footer from './Footer';  
import './App.css';

const App = () => {
  const [userId, setUserId] = useState(() => {
    let storedId = localStorage.getItem('userId');
    if (!storedId) {
      storedId = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', storedId);
    }
    return storedId;
  });

  const [goals, setGoals] = useState([]);
  const [activeGoal, setActiveGoal] = useState(null);
  const [times, setTimes] = useState([]);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [weeklyData, setWeeklyData] = useState({ labels: [], data: [] });
  const [currentChart, setCurrentChart] = useState('weekly');
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);

  const goalSectionRef = useRef(null);
  const stopwatchSectionRef = useRef(null);
  const calendarSectionRef = useRef(null);
  const chartSectionRef = useRef(null);

  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem(`goals_${userId}`)) || [];
    const savedTimes = JSON.parse(localStorage.getItem(`times_${userId}`)) || [];
    const savedWeeklyData = JSON.parse(localStorage.getItem(`weeklyData_${userId}_0`)) || { labels: [], data: [] };
    const savedCurrentChart = localStorage.getItem(`currentChart_${userId}`) || 'weekly';

    setGoals(savedGoals);
    setTimes(savedTimes);
    setWeeklyData(savedWeeklyData);
    setCurrentChart(savedCurrentChart);
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(`goals_${userId}`, JSON.stringify(goals));
  }, [goals, userId]);

  useEffect(() => {
    localStorage.setItem(`times_${userId}`, JSON.stringify(times));
  }, [times, userId]);

  useEffect(() => {
    localStorage.setItem(`weeklyData_${userId}_0`, JSON.stringify(weeklyData));
  }, [weeklyData, userId]);

  useEffect(() => {
    localStorage.setItem(`currentChart_${userId}`, currentChart);
  }, [currentChart, userId]);

  const fetchGoals = () => {
    const storedGoals = JSON.parse(localStorage.getItem(`goals_${userId}`)) || [];
    setGoals(storedGoals);
  };

  const fetchTimes = () => {
    const storedTimes = JSON.parse(localStorage.getItem(`times_${userId}`)) || [];
    setTimes(storedTimes);
  };

  const fetchWeeklySummary = async () => {
    try {
      const response = await axiosInstance.get('/api/times/weekly-summary');
      const summary = response.data;
      const labels = Object.keys(summary);
      const data = Object.values(summary);
      const newWeeklyData = { labels, data };
      setWeeklyData(newWeeklyData);
      localStorage.setItem(`weeklyData_${userId}_0`, JSON.stringify(newWeeklyData));
    } catch (error) {
      console.error('Error fetching weekly summary:', error);
    }
  };

  const handleSaveGoal = (goal) => {
    setGoals([...goals, goal]);
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const handleEditGoal = (updatedGoal) => {
    setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
  };

  const handleSaveTime = (timeEntry) => {
    setTimes([...times, timeEntry]);
  };

  const handleDeleteTime = (timeId) => {
    setTimes(times.filter(time => time.id !== timeId));
  };

  const handleSwitchChart = () => {
    if (currentChart === 'weekly') {
      setCurrentChart('monthly');
    } else if (currentChart === 'monthly') {
      setCurrentChart('yearly');
    } else {
      setCurrentChart('weekly');
    }
  };

  return (
    <div className="App">
      <Navbar isNavbarOpen={isNavbarOpen} setIsNavbarOpen={setIsNavbarOpen} />
      <div className="content">
        <Goals 
          goals={goals}
          onAddGoal={() => setShowNewGoal(true)}
          onEditGoal={setEditingGoal}
          onDeleteGoal={handleDeleteGoal}
          onSaveGoal={handleSaveGoal}
          activeGoal={activeGoal}
          setActiveGoal={setActiveGoal}
          ref={goalSectionRef}
        />
        <NewGoals
          onSaveGoal={handleSaveGoal}
          show={showNewGoal}
          onHide={() => setShowNewGoal(false)}
        />
        <EditGoalModal
          goal={editingGoal}
          onSaveGoal={handleEditGoal}
          onHide={() => setEditingGoal(null)}
        />
        <Stopwatch
          activeGoal={activeGoal}
          onSaveTime={handleSaveTime}
          times={times}
          ref={stopwatchSectionRef}
        />
        <CalendarComponent
          times={times}
          onSaveTime={handleSaveTime}
          onDeleteTime={handleDeleteTime}
          ref={calendarSectionRef}
        />
        <ChartComponent
          weeklyData={weeklyData}
          onSwitchChart={handleSwitchChart}
          currentChart={currentChart}
          ref={chartSectionRef}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
