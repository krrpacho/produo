import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './CalendarComponent.css';

const CalendarComponent = ({ times, onTimeDeleted }) => {
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
    // Notify parent component to update state
    onTimeDeleted(id);
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
