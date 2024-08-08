import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './CalendarComponent.css';

const CalendarComponent = ({ times, onTimeDeleted }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Update events state when times prop changes
    const updatedEvents = times.map(time => ({
      id: time.id,
      title: time.elapsedTime,
      start: time.date,
      color: time.color
    }));
    setEvents(updatedEvents);
  }, [times]);

  const handleDelete = (id) => {
    try {
      // Notify parent component to update state
      onTimeDeleted(id);

      // Remove time from local storage
      const storedTimes = JSON.parse(localStorage.getItem('times')) || [];
      const updatedTimes = storedTimes.filter(time => time.id !== id);
      localStorage.setItem('times', JSON.stringify(updatedTimes));

      alert('Time deleted successfully!');
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
