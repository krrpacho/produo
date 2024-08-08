import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axiosInstance from './axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './CalendarComponent.css';

const CalendarComponent = ({ onTimeDeleted }) => {
  const [times, setTimes] = useState([]);

  // Load times from local storage
  useEffect(() => {
    const savedTimes = JSON.parse(localStorage.getItem('times')) || [];
    setTimes(savedTimes);
  }, []);

  // Save times to local storage
  useEffect(() => {
    localStorage.setItem('times', JSON.stringify(times));
  }, [times]);

  const handleDelete = async (id) => {
    try {
      console.log('Deleting time with ID:', id);
      const response = await axiosInstance.delete(`/api/times/${id}`);
      if (response.status === 204) {
        alert('Time deleted successfully!');
        const updatedTimes = times.filter(time => time.id !== id);
        setTimes(updatedTimes);
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
