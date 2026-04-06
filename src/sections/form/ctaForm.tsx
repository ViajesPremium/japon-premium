import styles from "./ctaForm.module.css";

export default function CTAForm() {
  return (
    <section className={styles.ctaForm}>
      <div className={styles.ctaFormContent}>
        <div className={styles.ctaFormText}>
          <h2>CTAForm</h2>
          <p>CTAForm</p>
        </div>
        <div className={styles.ctaFormForm}>
          <form>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <textarea placeholder="Message"></textarea>
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </section>
  );
}
