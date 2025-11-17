"use client"

import styles from '../styles/DashboardStats.module.scss'
import { FileText, CalendarDays, Users, BookOpen } from "lucide-react";

export default function DashboardStats() {
  const stats = [
    {
      id: 1,
      title: 'Total Exams',
      value: 248,
      icon: <FileText size={26} color="#3b82f6" />,
      bg: '#eff6ff',
      percent: '+12%',
    },
    {
      id: 2,
      title: 'Upcoming Exams',
      value: 15,
      icon: <CalendarDays size={26} color="#a855f7" />,
      bg: '#faf5ff',
      percent: '+5%',
    },
    {
      id: 3,
      title: 'Total Students',
      value: 1847,
      icon: <Users size={26} color="#22c55e" />,
      bg: '#f0fdf4',
      percent: '+24%',
    },
    {
      id: 4,
      title: 'Active Courses',
      value: 42,
      icon: <BookOpen size={26} color="#f59e0b" />,
      bg: '#fffbeb',
      percent: '+3%',
    },
  ];


  return (
    <div className={styles.statsContainer}>
      {stats.map(item => (
        <div key={item.id} className={styles.card}>
          <div className={styles.cardTop}>
            <div
              className={styles.iconBox}
              style={{ backgroundColor: item.bg }}
            >
              {item.icon}
            </div>
            <span className={styles.percent}>{item.percent}</span>
          </div>
          <h2>{item.value}</h2>
          <p>{item.title}</p>
        </div>
      ))}
    </div>
  );
}

