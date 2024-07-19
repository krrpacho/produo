import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import './ChartComponent.css';

const YearlyBarChart = ({ onSwitchChart }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [yearlyData, setYearlyData] = useState({ labels: [], data: [] });
  const [yearsAgo, setYearsAgo] = useState(() => {
    // Load yearsAgo from local storage or default to 0
    return parseInt(localStorage.getItem('yearsAgo') || '0', 10);
  });
  const [dateRange, setDateRange] = useState('');

  useEffect(() => {
    fetchYearlyData(yearsAgo);
  }, [yearsAgo]);

  const fetchYearlyData = async (yearsAgo) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/times/yearly-summary?yearsAgo=${yearsAgo}`);
      const data = response.data;

      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const sortedLabels = months;
      const sortedData = months.map((month, index) =>
        data[String(index + 1).padStart(2, '0')] ? data[String(index + 1).padStart(2, '0')] / 60 : 0
      ); // Convert to minutes

      setYearlyData({ labels: sortedLabels, data: sortedData });
      setDateRange(calculateDateRange(yearsAgo));
    } catch (error) {
      console.error('Error fetching yearly summary:', error);
    }
  };

  const calculateDateRange = (yearsAgo) => {
    const date = new Date();
    if (yearsAgo > 0) {
      date.setFullYear(date.getFullYear() - yearsAgo);
    }
    return date.getFullYear();
  };

  useEffect(() => {
    if (chartRef.current && yearlyData.labels.length > 0) {
      const ctx = chartRef.current.getContext('2d');

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: yearlyData.labels,
          datasets: [{
            label: 'Time Spent (minutes)',
            data: yearlyData.data,
            backgroundColor: 'rgba(255, 159, 64, 0.6)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: 'white' // Y-axis text color
              },
              grid: {
                color: 'white' // Y-axis grid color
              }
            },
            x: {
              ticks: {
                color: 'white' // X-axis text color
              },
              grid: {
                color: 'white' // X-axis grid color
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'white' // Legend text color
              }
            }
          }
        }
      });
    }
  }, [yearlyData]);

  const handlePreviousYear = () => {
    const newYearsAgo = yearsAgo + 1;
    setYearsAgo(newYearsAgo);
    localStorage.setItem('yearsAgo', newYearsAgo); // Save to local storage
  };

  const handleNextYear = () => {
    const newYearsAgo = yearsAgo - 1;
    setYearsAgo(newYearsAgo);
    localStorage.setItem('yearsAgo', newYearsAgo); // Save to local storage
  };

  const canGoNextYear = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    return dateRange < currentYear;
  };

  return (
    <div className="chart-container">
      <div className="chart-navigation">
        <div className="date-range white-text">
          {dateRange}
        </div>
        <div className="buttons">
          <button onClick={handlePreviousYear}>{'<'}</button>
          <button onClick={handleNextYear} disabled={!canGoNextYear()}>{'>'}</button>
          <button onClick={onSwitchChart}>Yearly Chart</button>
        </div>
      </div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default YearlyBarChart;
