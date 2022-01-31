import styles from "./../../styles/Feed.module.css";

export default function ScreenFeed({ isRecording }) {
  return (
    <div className={styles.feedContainer}>
      <video id="screen-feedback"  height="180" width="180" className={styles.feedVideo} />
    </div>
  );
}
