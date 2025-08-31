import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Hola Nicole ♥</h1>
      </main>
      <footer className={styles.footer}>
        <p>© 2025 Esteban Hurtado Blumberg tu amor. All rights reserved.</p>
      </footer>
    </div>
  );
}
