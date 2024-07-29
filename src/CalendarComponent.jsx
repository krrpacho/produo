import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axiosInstance from './axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './CalendarComponent.css';

const CalendarComponent = ({ times, onTimeDeleted }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      fetchEvents();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('http://localhost:8080/api/times');
      const fetchedEvents = response.data.map(time => ({
        id: time.id,
        title: time.elapsedTime,
        start: time.date,
        color: time.color
      }));
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting time with ID:', id);
      const response = await axiosInstance.delete(`/api/times/${id}`);
      if (response.status === 204) {
        alert('Time deleted successfully!');
        const updatedEvents = events.filter(event => event.id !== id);
        setEvents(updatedEvents);
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

  const formattedEvents = times.map(time => ({
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
        events={formattedEvents}
        eventContent={renderEventContent}
      />
    </div>
  );
};

export default CalendarComponent;