import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPen, faClock, faCalendar, faChartBar } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = ({ onScrollToSection, toggleNavbar }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggleNavbar = () => {
    setIsExpanded(!isExpanded);
    toggleNavbar();
  };

  return (
    <div className={`navbar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="navbar-toggle" onClick={handleToggleNavbar}>
        <FontAwesomeIcon icon={isExpanded ? faChevronLeft : faChevronRight} />
      </div>
      <ul>
        <li onClick={() => onScrollToSection('goalSection')}>
          <FontAwesomeIcon icon={faPen} />
          {isExpanded && 'Goals'}
        </li>
        <li onClick={() => onScrollToSection('stopwatchSection')}>
          <FontAwesomeIcon icon={faClock} />
          {isExpanded && 'Stopwatch'}
        </li>
        <li onClick={() => onScrollToSection('calendarSection')}>
          <FontAwesomeIcon icon={faCalendar} />
          {isExpanded && 'Calendar'}
        </li>
        <li onClick={() => onScrollToSection('chartSection')}>
          <FontAwesomeIcon icon={faChartBar} />
          {isExpanded && 'Charts'}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
