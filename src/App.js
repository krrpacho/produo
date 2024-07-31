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

  const userId = 'defaultUser'; // Replace with actual user ID logic
  const goalSectionRef = useRef(null);
  const stopwatchSectionRef = useRef(null);
  const calendarSectionRef = useRef(null);
  const chartSectionRef = useRef(null);

  useEffect(() => {
    const storedGoals = localStorage.getItem(`goals_${userId}`);
    const storedTimes = localStorage.getItem(`times_${userId}`);
    const storedWeeklyData = localStorage.getItem(`weeklyData_${userId}`);

    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    } else {
      fetchGoals();
    }

    if (storedTimes) {
      setTimes(JSON.parse(storedTimes));
    } else {
      fetchTimes();
    }

    if (storedWeeklyData) {
      setWeeklyData(JSON.parse(storedWeeklyData));
    } else {
      fetchWeeklySummary();
    }
  }, [userId]);

  const fetchGoals = async () => {
    try {
      const response = await axiosInstance.get('/api/goals');
      const goalsData = response.data;
      setGoals(goalsData);
      localStorage.setItem(`goals_${userId}`, JSON.stringify(goalsData));
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const fetchTimes = async () => {
    try {
      const response = await axiosInstance.get('/api/times');
      const timesData = response.data;
      setTimes(timesData);
      localStorage.setItem(`times_${userId}`, JSON.stringify(timesData));
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
      const weeklyData = { labels, data };
      setWeeklyData(weeklyData);
      localStorage.setItem(`weeklyData_${userId}`, JSON.stringify(weeklyData));
    } catch (error) {
      console.error('Error fetching weekly summary:', error);
    }
  };

  const handleGoalSaved = () => {
    setShowNewGoal(false);
    fetchGoals(); // Fetch and update goals to local storage
  };

  const handleTimeAdded = (newTime) => {
    fetchTimes(); // Fetch and update times to local storage
    fetchWeeklySummary(); // Fetch and update weekly summary to local storage
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
          {currentChart === 'monthly' && <MonthlyBarChart onSwitchChart={() => switchChart('yearly')} userId={userId} />}
          {currentChart === 'yearly' && <YearlyBarChart onSwitchChart={() => switchChart('weekly')} userId={userId} />}
        </div>
        <Footer />  
      </div>
    </div>
  );
};

export default App;
