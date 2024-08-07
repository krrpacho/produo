import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import axiosInstance from './axiosConfig';
import './ChartComponent.css';

const MonthlyBarChart = ({ onSwitchChart }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [monthlyData, setMonthlyData] = useState({ labels: [], data: [] });
  const [monthsAgo, setMonthsAgo] = useState(0);
  const [dateRange, setDateRange] = useState('');

  useEffect(() => {
    fetchMonthlyData(monthsAgo);
  }, [monthsAgo]);

  const fetchMonthlyData = async (monthsAgo) => {
    try {
      const response = await axiosInstance.get(`/api/times/monthly-summary?monthsAgo=${monthsAgo}`);
      const data = response.data;

      const order = ['1-8', '9-16', '17-23', '24-31'];

      const sortedLabels = order;
      const sortedData = order.map(period => data[period] ? data[period] / 60 : 0); 

      setMonthlyData({ labels: sortedLabels, data: sortedData });
      setDateRange(calculateDateRange(monthsAgo));
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
    }
  };

  const calculateDateRange = (monthsAgo) => {
    const date = new Date();
    if (monthsAgo > 0) {
      date.setMonth(date.getMonth() - monthsAgo);
    }

    const options = { month: 'long', year: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const monthYear = formatter.format(date);

    const [month, year] = monthYear.split(' ');
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    return `${capitalizedMonth} ${year}`;
  };

  useEffect(() => {
    if (chartRef.current && monthlyData.labels.length > 0) {
      const ctx = chartRef.current.getContext('2d');

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: monthlyData.labels,
          datasets: [{
            label: 'Time Spent (minutes)',
            data: monthlyData.data,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
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
  }, [monthlyData]);

  const handlePreviousMonth = () => {
    setMonthsAgo(monthsAgo + 1);
  };

  const handleNextMonth = () => {
    setMonthsAgo(monthsAgo - 1);
  };

  const canGoNextMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const [dateRangeMonth, dateRangeYear] = dateRange.split(' ');
    const rangeMonthIndex = new Date(Date.parse(dateRangeMonth +" 1, 2022")).getMonth(); // Convert month name to index
    const rangeYear = parseInt(dateRangeYear, 10);

    return (rangeYear < currentYear) || (rangeYear === currentYear && rangeMonthIndex < currentMonth);
  };

  return (
    <div className="chart-container">
      <div className="chart-navigation">
        <div className="date-range white-text">
          {dateRange}
        </div>
        <div className="buttons">
          <button onClick={handlePreviousMonth}>{'<'}</button>
          <button onClick={handleNextMonth} disabled={!canGoNextMonth()}>{'>'}</button>
          <button onClick={onSwitchChart}>Monthly Chart</button>
        </div>
      </div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default MonthlyBarChart;