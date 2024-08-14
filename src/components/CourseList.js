import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import WeekPopup from './WeekPopup';
import './CourseList.css';

const courses = [
  { name: 'Design and Implementation of Human-Computer Interfaces' },
  { name: 'Psychology of Learning' },
  { name: 'Course 3' },
  { name: 'Course 4' },
  { name: 'Course 5' },
  { name: 'Course 6' }
];

const CourseList = () => {
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    if (showPopup) {
      Swal.fire({
        title: 'For reference only',
        html: `
          <p>We discourage copying answers. Strive for understanding.</p>
          <label>
            <input type="checkbox" id="agreement-checkbox" />
            I agree
          </label>
        `,
        confirmButtonText: 'OK',
        preConfirm: () => {
          const checkbox = Swal.getPopup().querySelector('#agreement-checkbox');
          if (!checkbox.checked) {
            Swal.showValidationMessage('Please check the checkbox to agree.');
          }
          return checkbox.checked;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          setShowPopup(false);
        }
      });
    }
  }, [showPopup]);

  const openPopup = (course, week) => {
    setSelectedCourse(course);
    setSelectedWeek(week);
  };

  const closePopup = () => {
    setSelectedCourse(null);
    setSelectedWeek(null);
  };

  return (
    <div className="course-list-container">
      {/* Header with navigation */}
      <header className="App-header">
        <img src="logo.png" alt="Logo" className="App-logo" />
        <nav className="App-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search-code">Search Code</Link></li>
            <li><Link to="/nptel">NPTEL</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
          </ul>
        </nav>
      </header>
      
      {/* Course List */}
      {!showPopup && (
        <div className="course-list">
          {courses.map((course, index) => (
            <div key={index} className="course">
              <h3 className="course-title">{course.name}</h3>
              {[...Array(12).keys()].map((week) => (
                <div
                  key={week + 1}
                  className="week"
                  onClick={() => openPopup(course.name, `Week ${week + 1}`)}
                >
                  {`Week ${week + 1}`}
                </div>
              ))}
            </div>
          ))}
          {selectedWeek && selectedCourse && (
            <WeekPopup
              course={selectedCourse}
              week={selectedWeek}
              onClose={closePopup}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CourseList;