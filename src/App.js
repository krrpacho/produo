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

  // Load state from local storage on component mount
  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem('goals')) || [];
    const savedTimes = JSON.parse(localStorage.getItem('times')) || [];
    const savedWeeklyData = JSON.parse(localStorage.getItem('weeklyData')) || { labels: [], data: [] };
    const savedCurrentChart = localStorage.getItem('currentChart') || 'weekly';

    setGoals(savedGoals);
    setTimes(savedTimes);
    setWeeklyData(savedWeeklyData);
    setCurrentChart(savedCurrentChart);
  }, []);

  // Save state to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('times', JSON.stringify(times));
  }, [times]);

  useEffect(() => {
    localStorage.setItem('weeklyData', JSON.stringify(weeklyData));
  }, [weeklyData]);

  useEffect(() => {
    localStorage.setItem('currentChart', currentChart);
  }, [currentChart]);

  const handleGoalSaved = () => {
    // Reload goals from local storage and update state
    const storedGoals = JSON.parse(localStorage.getItem('goals')) || [];
    setGoals(storedGoals);
    setShowNewGoal(false);
  };

  const handleGoalUpdated = () => {
    // Reload goals from local storage and update state
    const storedGoals = JSON.parse(localStorage.getItem('goals')) || [];
    setGoals(storedGoals);
  };

  // const handleTimeAdded = (newTime) => {
  //   fetchTimes(); // Reload times from local storage
  //   fetchWeeklySummary();
  // };

  const handleTimeDeleted = (id) => {
    const updatedTimes = times.filter(time => time.id !== id);
    setTimes(updatedTimes);
    localStorage.setItem('times', JSON.stringify(updatedTimes)); // Update local storage
    fetchWeeklySummary(); // Update weekly summary after deletion
  };

  const switchChart = (chartType) => {
    setCurrentChart(chartType);
  };

  const scrollToSection = (section) => {
    switch (section) {
      case 'goalSection':
        goalSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'stopwatchSection':
        stopwatchSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'calendarSection':
        calendarSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'chartSection':
        chartSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <div className={`app-container ${isNavbarOpen ? 'navbar-open' : 'navbar-collapsed'}`}>
      <Navbar onScrollToSection={scrollToSection} toggleNavbar={toggleNavbar} />
      <div className="main-content">
        <div ref={goalSectionRef} className="goal-section">
          <Goals
            goals={goals}
            onSelectGoal={setActiveGoal}
            onAddGoalClick={() => setShowNewGoal(true)}
            onEditGoalClick={setEditingGoal}
          />
          {showNewGoal && <NewGoals onGoalSaved={handleGoalSaved} onClose={() => setShowNewGoal(false)} />}
          {editingGoal && (
            <EditGoalModal
              goal={editingGoal}
              onGoalUpdated={handleGoalUpdated}  // Updated prop
              onClose={() => setEditingGoal(null)}
            />
          )}
        </div>
        <div ref={stopwatchSectionRef} className="stopwatch-section">
          <Stopwatch activeGoal={activeGoal} onTimeAdded={handleTimeAdded} />
        </div>
        <div ref={calendarSectionRef} className="calendar-section">
          <CalendarComponent times={times} onTimeDeleted={handleTimeDeleted} />
        </div>
        <div ref={chartSectionRef} className="chart-section">
          {currentChart === 'weekly' && <ChartComponent weeklyData={weeklyData} onSwitchChart={() => switchChart('monthly')} />}
          {currentChart === 'monthly' && <MonthlyBarChart onSwitchChart={() => switchChart('yearly')} />}
          {currentChart === 'yearly' && <YearlyBarChart onSwitchChart={() => switchChart('weekly')} />}
        </div>
        <Footer />  
      </div>
    </div>
  );
};

export default App;