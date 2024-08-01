import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axiosInstance from './axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './CalendarComponent.css';

const CalendarComponent = ({ times, onTimeDeleted }) => {
  const [events, setEvents] = useState([]);

  // Load events from local storage when the component mounts
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setEvents(savedEvents);
  }, []);

  // Save events to local storage whenever `times` changes
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleDelete = async (id) => {
    try {
      console.log('Deleting time with ID:', id);
      const response = await axiosInstance.delete(`/api/times/${id}`);
      if (response.status === 204) {
        alert('Time deleted successfully!');
        onTimeDeleted(id);
        // Remove event from local storage after deletion
        const updatedEvents = events.filter(event => event.id !== id);
        setEvents(updatedEvents);
        localStorage.setItem('events', JSON.stringify(updatedEvents));
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

  // Transform times to match the format FullCalendar expects
  useEffect(() => {
    const transformedEvents = times.map(time => ({
      id: time.id,
      title: time.elapsedTime,
      start: time.date,
      color: time.color
    }));
    setEvents(transformedEvents);
    localStorage.setItem('events', JSON.stringify(transformedEvents));
  }, [times]);

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
