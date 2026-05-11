import { useState } from 'react';
import styles from './ContactForm.module.css';

const INITIAL_STATE = {
  name: '',
  phone: '',
  email: '',
  weddingDate: '',
  weddingLocation: '',
  message: '',
};

export default function ContactForm() {
  const [fields, setFields] = useState(INITIAL_STATE);
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection and try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success}>
        <span className={styles.successIcon} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l4.5 4.5L19 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className={styles.successTitle}>Thank you</p>
        <p className={styles.successBody}>
          Your message is on its way. We&rsquo;ll be in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Name <span className={styles.required}>*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={fields.name}
            onChange={handleChange}
            className={styles.input}
            placeholder="Your full name"
            autoComplete="name"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="phone" className={styles.label}>
            Phone <span className={styles.required}>*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={fields.phone}
            onChange={handleChange}
            className={styles.input}
            placeholder="+91 98765 43210"
            autoComplete="tel"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={fields.email}
          onChange={handleChange}
          className={styles.input}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="weddingDate" className={styles.label}>Wedding Date</label>
          <input
            id="weddingDate"
            name="weddingDate"
            type="date"
            value={fields.weddingDate}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="weddingLocation" className={styles.label}>Wedding Location</label>
          <input
            id="weddingLocation"
            name="weddingLocation"
            type="text"
            value={fields.weddingLocation}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g. Orchha Palace"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>Message</label>
        <textarea
          id="message"
          name="message"
          rows={3}
          value={fields.message}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Tell us about your wedding plans, vision, or any questions..."
        />
      </div>

      {status === 'error' && (
        <p className={styles.errorMsg} role="alert">{errorMsg}</p>
      )}

      <button
        type="submit"
        className={styles.submit}
        disabled={status === 'submitting'}
      >
        <span>{status === 'submitting' ? 'Sending…' : 'Send enquiry'}</span>
        {status !== 'submitting' && (
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
            <path d="M1 5h15m0 0L12 1m4 4l-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </form>
  );
}
