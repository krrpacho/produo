import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axiosInstance from './axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './CalendarComponent.css';

// Function to get user ID from local storage
const getUserId = () => localStorage.getItem('userId');

// Function to save times to local storage
const saveTimesToLocalStorage = (times) => {
  localStorage.setItem('times', JSON.stringify(times));
};

// Function to load times from local storage
const loadTimesFromLocalStorage = () => {
  const savedTimes = localStorage.getItem('times');
  return savedTimes ? JSON.parse(savedTimes) : [];
};

const CalendarComponent = ({ onTimeDeleted }) => {
  const [times, setTimes] = useState(loadTimesFromLocalStorage()); // Load times from local storage

  useEffect(() => {
    // Optionally load times from backend and update local storage
    const fetchTimes = async () => {
      try {
        const userId = getUserId();
        if (!userId) return;
        const response = await axiosInstance.get(`/api/times?userId=${userId}`);
        if (response.status === 200) {
          const fetchedTimes = response.data;
          setTimes(fetchedTimes);
          saveTimesToLocalStorage(fetchedTimes);
        }
      } catch (error) {
        console.error('Error fetching times:', error);
      }
    };

    fetchTimes();
  }, []);

  const handleDelete = async (id) => {
    try {
      console.log('Deleting time with ID:', id);
      const response = await axiosInstance.delete(`/api/times/${id}`);
      if (response.status === 204) {
        alert('Time deleted successfully!');
        const updatedTimes = times.filter(time => time.id !== id);
        setTimes(updatedTimes);
        saveTimesToLocalStorage(updatedTimes); // Save updated times to local storage
        onTimeDeleted(id);
      } else {
        alert('Failed to delete time.');
      }
    } catch (error) {
      console.error('Error deleting time:', error);
      alert('Failed to delete time.');
    }
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div className="event-content">
        <div className="event-info">
          <b>{eventInfo.timeText}</b>
          <i>{eventInfo.event.title}</i>
        </div>
        <FontAwesomeIcon
          icon={faTrash}
          onClick={() => handleDelete(eventInfo.event.id)}
          className="delete-icon"
        />
      </div>
    );
  };

  const events = times.map(time => ({
    id: time.id,
    title: time.elapsedTime,
    start: time.date,
    color: time.color
  }));

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventContent={renderEventContent}
      />
    </div>
  );
};

export default CalendarComponent;
