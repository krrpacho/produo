import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import axiosInstance from './axiosConfig';
import './ChartComponent.css';

const monthsOfYear = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YearlyBarChart = ({ onSwitchChart }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [yearlyData, setYearlyData] = useState({ labels: [], data: [] });
  const [yearsAgo, setYearsAgo] = useState(0);
  const [dateRange, setDateRange] = useState('');

  useEffect(() => {
    const savedYearlyData = JSON.parse(localStorage.getItem('yearlyData'));
    if (savedYearlyData && savedYearlyData.yearsAgo === yearsAgo) {
      setYearlyData({
        labels: savedYearlyData.labels,
        data: savedYearlyData.data,
      });
      setDateRange(savedYearlyData.dateRange);
    } else {
      fetchYearlyData(yearsAgo);
    }
  }, [yearsAgo]);

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
  }, [yearlyData]);

  const fetchYearlyData = async (yearsAgo) => {
    try {
      const response = await axiosInstance.get(`/api/times/yearly-summary?yearsAgo=${yearsAgo}`);
      const data = response.data;
      console.log('Yearly data fetched:', data); // Debugging line

      const labels = monthsOfYear;
      const values = labels.map(month => data[month] ? data[month] / 60 : 0); 
      const dateRange = calculateDateRange(yearsAgo);
      const newYearlyData = { labels, data: values, dateRange };

      setYearlyData({ labels, data: values });
      setDateRange(dateRange);
      localStorage.setItem('yearlyData', JSON.stringify({ ...newYearlyData, yearsAgo }));
    } catch (error) {
      console.error('Error fetching yearly summary:', error);
    }
  };

  const calculateDateRange = (yearsAgo) => {
    const date = new Date();
    if (yearsAgo > 0) {
      date.setFullYear(date.getFullYear() - yearsAgo);
    }

    const year = date.getFullYear();
    return `${year}`;
  };

  const handlePreviousYear = () => {
    setYearsAgo(yearsAgo + 1);
  };

  const handleNextYear = () => {
    setYearsAgo(yearsAgo - 1);
  };

  return (
    <div className="chart-container">
      <div className="chart-navigation">
        <div className="date-range white-text">
          {dateRange}
        </div>
        <div className="buttons">
          <button onClick={handlePreviousYear}>{'<'}</button>
          <button onClick={handleNextYear}>{'>'}</button>
          <button onClick={onSwitchChart}>Yearly Chart</button>
        </div>
      </div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default YearlyBarChart;
