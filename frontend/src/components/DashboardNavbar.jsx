import styles from "../styles/DashboardNavbar.module.scss";
import { Bell as BellIcon, Search as SearchIcon } from "lucide-react";



export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.searchBox}>
                <input type="text" placeholder="Search..." />
            </div>

            <div className={styles.iconsSection}>
                <div className={styles.bellWrapper}>
                    <BellIcon size={24} className={styles.bellIcon} />
                    <span className={styles.badge}></span>
                </div>

                <div className={styles.userSection}>
                    <img src="/assets/User (3).png" alt="User" className={styles.userImg} width={40} height={40} />
                </div>
            </div>
        </nav>
    );
}

