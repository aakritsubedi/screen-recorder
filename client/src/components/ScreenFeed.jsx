import styles from "./../../styles/Feed.module.css";

export default function ScreenFeed({ isRecording, meetingLink }) {
  return (
    <div className={styles.feedContainer}>
      <video
        id="screen-feedback"
        height="180"
        width="180"
        className={styles.feedVideo}
      />
      {meetingLink && (
        <>
        <label htmlFor="meetingLink"> Meeting Link</label>
        <input type="text" value={meetingLink} id="meetingLink" />
        </>

      )}
    </div>
  );
}
