import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Import interaction plugin for handling event clicks
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import './CalendarComponent.css';

const CalendarComponent = ({ times, onTimeDeleted, onTimeAdded }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
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

  const handleAdd = (info) => {
    const newTime = {
      id: new Date().toISOString(), // Generate a unique ID
      elapsedTime: 'New Event',
      date: info.startStr,
      color: '#FF9F00' // Default color
    };

    try {
      // Notify parent component to update state
      onTimeAdded(newTime);

      // Update local storage
      const storedTimes = JSON.parse(localStorage.getItem('times')) || [];
      storedTimes.push(newTime);
      localStorage.setItem('times', JSON.stringify(storedTimes));

      alert('Time added successfully!');
    } catch (error) {
      console.error('Error adding time:', error);
      alert('Failed to add time.');
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
        plugins={[dayGridPlugin, interactionPlugin]} // Add interaction plugin
        initialView="dayGridMonth"
        events={events}
        eventContent={renderEventContent}
        dateClick={handleAdd} // Handle adding event on date click
      />
    </div>
  );
};

export default CalendarComponent;
