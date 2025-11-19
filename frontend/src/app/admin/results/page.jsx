"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../../lib/api";
import styles from "../../../styles/results.module.scss";
import DashboardNavbar from "../../../components/DashboardNavbar";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, TrendingUp, Users, Award, Filter } from "lucide-react";

const COLORS = ["#2563eb", "#7c3aed", "#10b981", "#f59e0b", "#ef4444"];

export default function ResultsPage() {
  const [user, setUser] = useState(null);
  const [completions, setCompletions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const navigate = useNavigate();

  const userRole = user?.role || "admin";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/admin/login");

    const fetchUser = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (userRole === "admin") {
          // Fetch all completions for admin
          const params = new URLSearchParams();
          if (startDate) params.append("startDate", startDate);
          if (endDate) params.append("endDate", endDate);
          if (selectedStudent) params.append("studentId", selectedStudent);

          const res = await fetch(
            `${apiUrl("/api/topic-completions/all")}?${params.toString()}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (res.ok) {
            const data = await res.json();
            setCompletions(data);
          }

          // Fetch students for filter
          const studentsRes = await fetch(apiUrl("/api/students/student"));
          if (studentsRes.ok) {
            const studentsData = await studentsRes.json();
            setStudents(studentsData);
          }
        } else {
          // Fetch student's own completions
          const res = await fetch(
            apiUrl(`/api/topic-completions/student/${user.id || user._id}`),
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (res.ok) {
            const data = await res.json();
            setCompletions(data);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, startDate, endDate, selectedStudent, userRole]);

  // Process data for charts
  const getChartData = () => {
    if (!completions.length) return [];

    const dateMap = new Map();
    completions.forEach((completion) => {
      const completionDate = new Date(completion.completedAt);
      const dateKey = completionDate.toISOString().split("T")[0]; // YYYY-MM-DD for sorting
      const dateLabel = completionDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, { date: dateLabel, dateKey, completions: 0 });
      }
      dateMap.get(dateKey).completions += 1;
    });

    return Array.from(dateMap.values())
      .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
      .map(({ date, completions }) => ({ date, completions }));
  };

  const getStudentStats = () => {
    if (!completions.length) return [];

    const studentMap = new Map();
    completions.forEach((completion) => {
      const studentName =
        completion.studentId?.name ||
        completion.studentId?.username ||
        completion.studentId?.email ||
        "Unknown";
      studentMap.set(
        studentName,
        (studentMap.get(studentName) || 0) + 1
      );
    });

    return Array.from(studentMap.entries())
      .map(([name, count]) => ({ name, completions: count }))
      .sort((a, b) => b.completions - a.completions)
      .slice(0, 5);
  };

  const getTopicStats = () => {
    if (!completions.length) return [];

    const topicMap = new Map();
    completions.forEach((completion) => {
      const topicName =
        completion.topicId?.topic || "Unknown Topic";
      topicMap.set(topicName, (topicMap.get(topicName) || 0) + 1);
    });

    return Array.from(topicMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const getStatsSummary = () => {
    const total = completions.length;
    const uniqueStudents = new Set(
      completions.map((c) => c.studentId?._id || c.studentId)
    ).size;
    const uniqueTopics = new Set(
      completions.map((c) => c.topicId?._id || c.topicId)
    ).size;
    const thisWeek = completions.filter((c) => {
      const date = new Date(c.completedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length;

    return { total, uniqueStudents, uniqueTopics, thisWeek };
  };

  const chartData = getChartData();
  const studentStats = getStudentStats();
  const topicStats = getTopicStats();
  const stats = getStatsSummary();

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedStudent("");
  };

  if (loading) {
    return (
      <div className={styles.resultsPage}>
        <DashboardNavbar />
        <div className={styles.loading}>Loading results...</div>
      </div>
    );
  }

  return (
    <div className={styles.resultsPage}>
      <DashboardNavbar />
      <hr className="hr" />

      <header className={styles.header}>
        <div>
          <h2>Results & Analytics</h2>
          <p>
            {userRole === "admin"
              ? "View and analyze completion data across all students"
              : "Track your learning progress and completion statistics"}
          </p>
        </div>
      </header>

      {/* Filters - Only for Admin */}
      {userRole === "admin" && (
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <Filter size={18} />
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">All Students</option>
              {students.map((student) => (
                <option key={student._id || student.id} value={student._id || student.id}>
                  {student.name || student.email}
                </option>
              ))}
            </select>
          </div>
          <button
            className={styles.resetBtn}
            onClick={handleResetFilters}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Award size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.total}</h3>
            <p>Total Completions</p>
          </div>
        </div>
        {userRole === "admin" && (
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Users size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.uniqueStudents}</h3>
              <p>Active Students</p>
            </div>
          </div>
        )}
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.uniqueTopics}</h3>
            <p>Topics Completed</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Calendar size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.thisWeek}</h3>
            <p>This Week</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {completions.length > 0 ? (
        <>
          <div className={styles.chartsGrid}>
            {/* Completion Trend Chart */}
            {chartData.length > 0 && (
              <div className={styles.chartCard}>
                <h3>Completion Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="completions"
                      stroke="#2563eb"
                      strokeWidth={2}
                      name="Completions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Top Students Chart (Admin only) */}
            {userRole === "admin" && studentStats.length > 0 && (
              <div className={styles.chartCard}>
                <h3>Top Students</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={studentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completions" fill="#7c3aed" name="Completions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Top Topics Chart */}
            {topicStats.length > 0 && (
              <div className={styles.chartCard}>
                <h3>Most Completed Topics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topicStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {topicStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Results Table */}
          <div className={styles.tableCard}>
            <h3>Completion Details</h3>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {userRole === "admin" && <th>Student</th>}
                    <th>Topic</th>
                    <th>Completed At</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completions.map((completion, index) => (
                    <tr key={completion._id || index}>
                      {userRole === "admin" && (
                        <td>
                          {completion.studentId?.name ||
                            completion.studentId?.username ||
                            completion.studentId?.email ||
                            "Unknown"}
                        </td>
                      )}
                      <td>
                        {completion.topicId?.topic || "Unknown Topic"}
                      </td>
                      <td>
                        {new Date(completion.completedAt).toLocaleString()}
                      </td>
                      <td>
                        <span className={styles.statusBadge}>Completed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <Award size={48} />
          <h3>No completions found</h3>
          <p>
            {userRole === "admin"
              ? "No students have completed any topics yet."
              : "You haven't completed any topics yet. Start learning to see your progress here!"}
          </p>
        </div>
      )}
    </div>
  );
}
