import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import './ChartComponent.css';

const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const ChartComponent = ({ onSwitchChart }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [weeklyData, setWeeklyData] = useState({ labels: [], data: [] });
  const [weeksAgo, setWeeksAgo] = useState(0);
  const [dateRange, setDateRange] = useState('');

  useEffect(() => {
    const storedData = localStorage.getItem(`weeklyData-${weeksAgo}`);
    if (storedData) {
      const { labels, data, dateRange } = JSON.parse(storedData);
      setWeeklyData({ labels, data });
      setDateRange(dateRange);
    } else {
      fetchWeeklyData(weeksAgo);
    }
  }, [weeksAgo]);

  const fetchWeeklyData = async (weeksAgo) => {
    try {
      const response = await axios.get(`/api/times/weekly-summary?weeksAgo=${weeksAgo}`);
      const data = response.data;
      const labels = daysOfWeek;
      const values = labels.map(day => data[day] / 60); 
      setWeeklyData({ labels, data: values });
      const dateRange = calculateDateRange(weeksAgo);
      setDateRange(dateRange);
      localStorage.setItem(`weeklyData-${weeksAgo}`, JSON.stringify({ labels, data: values, dateRange }));
    } catch (error) {
      console.error('Error fetching weekly summary:', error);
    }
  };

  const calculateDateRange = (weeksAgo) => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - endDate.getDay() + 7 - (weeksAgo * 7));
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${day}.${month}`;
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  useEffect(() => {
    if (chartRef.current && weeklyData.labels.length > 0) {
      const ctx = chartRef.current.getContext('2d');

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: weeklyData.labels,
          datasets: [{
            label: 'Time Spent (minutes)',
            data: weeklyData.data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: 'white' 
              },
              grid: {
                color: 'white' 
              }
            },
            x: {
              ticks: {
                color: 'white' 
              },
              grid: {
                color: 'white' 
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'white' 
              }
            }
          }
        }
      });
    }
  }, [weeklyData]);

  const handlePreviousWeek = () => {
    setWeeksAgo(weeksAgo + 1);
  };

  const handleNextWeek = () => {
    setWeeksAgo(Math.max(weeksAgo - 1, 0));
  };

  return (
    <div className="chart-container">
      <div className="chart-navigation">
        <div className="date-range white-text">
          {dateRange}
        </div>
        <div className="buttons">
          <button onClick={handlePreviousWeek}>{'<'}</button>
          <button onClick={handleNextWeek} disabled={weeksAgo === 0}>{'>'}</button>
          <button onClick={onSwitchChart}>Weekly Chart</button>
        </div>
      </div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;
