"use client"

import styles from '../styles/UpcomingExams.module.scss';
import React from 'react';

function UpcomingExams() {
  return (
    <div className={styles.tableSection}>
      <h3>Upcoming Exams</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Course</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Subject Name">HTML</td>
              <td data-label="Course">Web Development</td>
              <td data-label="Date">Dec 15, 2024</td>
              <td data-label="Status">
                <span className={styles.upcoming}>Upcoming</span>
              </td>
            </tr>
            <tr>
              <td data-label="Subject Name">JavaScript</td>
              <td data-label="Course">Advanced Web Development</td>
              <td data-label="Date">Dec 18, 2024</td>
              <td data-label="Status">
                <span className={styles.scheduled}>Scheduled</span>
              </td>
            </tr>
            <tr>
              <td data-label="Subject Name">React Native</td>
              <td data-label="Course">Mobile App Development</td>
              <td data-label="Date">Dec 10, 2024</td>
              <td data-label="Status">
                <span className={styles.completed}>Completed</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UpcomingExams;

