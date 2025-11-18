"use client";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  Award,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Book,
} from "lucide-react";
import { useState, useEffect } from "react";
import styles from "../styles/AdminSidebar.module.scss";

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Get user role from localStorage
    const userStr = localStorage.getItem("user");
    try {
      const user = userStr ? JSON.parse(userStr) : null;
      setUserRole(user?.role || null);
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      setUserRole(null);
    }
  }, []);

  const allLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { href: "/admin/course", label: "Course", icon: <FileText size={18} /> },
    { href: "/admin/subjects", label: "Subject", icon: <Book size={18} /> },
    { href: "/admin/students", label: "Students", icon: <Users size={18} /> },
    { href: "/admin/results", label: "Results", icon: <Award size={18} /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  // Filter links based on user role
  const links = userRole === "student"
    ? allLinks.filter(link => 
        link.href === "/admin/course" || link.href === "/admin/results"
      )
    : allLinks;
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  return (
    <>
      <button
        className={`${styles.menuButton} ${mobileOpen ? styles.activeBtn : ""}`}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <aside
        className={`${styles.adminSidebar} 
          ${collapsed ? styles.collapsed : ""} 
          ${mobileOpen ? styles.open : ""}`}
      >
        <Link to="/" className={styles.logoLink}>
          <img
            className={styles.logoImg}
            src="https://www.kiteztech.com/image/kitez-logo1.svg"
            alt="ExamSite"
          />
        </Link>

        <nav>
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`${styles.link} ${pathname === link.href ? styles.active : ""
                }`}
              onClick={() => setMobileOpen(false)}
            >
              <span className={styles.icon}>{link.icon}</span>
              <span className={styles.label}>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.logoutContainer}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <span className={styles.icon}><LogOut size={18} /></span>
            <span className={styles.label}>Logout</span>
          </button>
        </div>

        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </aside>
    </>
  );
}


