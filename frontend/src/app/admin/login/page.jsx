import LoginForm from "@/components/LoginForm"; 
import styles from "../../../styles/LoginForm.module.scss";
export default function LoginPage() {
  return (
    <div className={styles.containers}>
      <LoginForm />
    </div>
  );
}

