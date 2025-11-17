import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/QuickActions.module.scss';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from 'recharts';

function QuickActions () {
  const navigate = useNavigate();
  const handleNavigation = path => {
    navigate(path);
  };

  const data = [
    {week: 'Week 1', exams: 12},
    {week: 'Week 2', exams: 18},
    {week: 'Week 3', exams: 25},
    {week: 'Week 4', exams: 32},
    {week: 'Week 5', exams: 28},
    {week: 'Week 6', exams: 35},
  ];

  return (
    <div className={styles.middleSection}>
      <div className={styles.chart}>
        <h3>Exam Activity</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="week" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="exams"
              stroke="#3b82f6"
              fill="url(#colorBlue)"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="exams"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{fill: '#3b82f6', strokeWidth: 2, r: 5}}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.actions}>
        <h3>Quick Actions</h3>
        <button className={styles.btnBlue}  onClick={() => handleNavigation("/admin/subjects")}>+ Create Exam</button>
        <button className={styles.btnPink}  onClick={() => handleNavigation("/admin/course")}>📃Manage Courses</button>
        <button className={styles.btnGreen}  onClick={() => handleNavigation("/admin/dashboard")}>👁️View All</button>
      </div>
    </div>
  );
}

export default QuickActions;


