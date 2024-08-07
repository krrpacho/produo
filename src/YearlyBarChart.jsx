import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import axiosInstance from './axiosConfig';
import './ChartComponent.css';

const YearlyBarChart = ({ onSwitchChart }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [yearlyData, setYearlyData] = useState({ labels: [], data: [] });
  const [yearsAgo, setYearsAgo] = useState(0);
  const [dateRange, setDateRange] = useState('');

  useEffect(() => {
    fetchYearlyData(yearsAgo);
  }, [yearsAgo]);

  const fetchYearlyData = async (yearsAgo) => {
    try {
      const response = await axiosInstance.get(`/api/times/yearly-summary?yearsAgo=${yearsAgo}`);
      const data = response.data;

      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const sortedLabels = months;
      const sortedData = months.map((month, index) => data[String(index + 1).padStart(2, '0')] ? data[String(index + 1).padStart(2, '0')] / 60 : 0); 
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
              beginAtZero: true
            }
          }
        }
      });
    }
  }, [yearlyData]);

  const handlePreviousYear = () => {
    setYearsAgo(yearsAgo + 1);
  };

  const handleNextYear = () => {
    setYearsAgo(yearsAgo - 1);
  };

  const canGoNextYear = () => {
    const now = new Date();
    const currentYear = now.getFullYear();

    return dateRange < currentYear;
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