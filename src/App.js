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

  useEffect(() => {
    fetchGoals();
    fetchTimes();
    fetchWeeklySummary();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axiosInstance.get('/api/goals');
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const fetchTimes = async () => {
    try {
      const response = await axiosInstance.get('/api/times');
      setTimes(response.data);
    } catch (error) {
      console.error('Error fetching times:', error);
    }
  };

  const fetchWeeklySummary = async () => {
    try {
      const response = await axiosInstance.get('/api/times/weekly-summary');
      const summary = response.data;
      const labels = Object.keys(summary);
      const data = Object.values(summary).map(seconds => seconds / 60); 
      setWeeklyData({ labels, data });
    } catch (error) {
      console.error('Error fetching weekly summary:', error);
    }
  };

  const handleGoalSaved = () => {
    setShowNewGoal(false);
    fetchGoals();
  };

  const handleTimeAdded = (newTime) => {
    fetchTimes();
    fetchWeeklySummary();
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
            onDeleteGoal={fetchGoals}
            onAddGoalClick={() => setShowNewGoal(true)}
            onEditGoalClick={setEditingGoal}
          />
          {showNewGoal && <NewGoals onGoalSaved={handleGoalSaved} onClose={() => setShowNewGoal(false)} />}
          {editingGoal && (
            <EditGoalModal
              goal={editingGoal}
              onGoalUpdated={fetchGoals}
              onClose={() => setEditingGoal(null)}
            />
          )}
        </div>
        <div ref={stopwatchSectionRef} className="stopwatch-section">
          <Stopwatch activeGoal={activeGoal} onTimeAdded={handleTimeAdded} />
        </div>
        <div ref={calendarSectionRef} className="calendar-section">
          <CalendarComponent times={times} onTimeDeleted={fetchTimes} />
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

export default App;//