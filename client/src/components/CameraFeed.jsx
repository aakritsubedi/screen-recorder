import styles from "./../../styles/Feed.module.css";

export default function CameraFeed() {
  return (
    <div className={styles.cameraFeedContainer}>
      <video id="camera-feedback" className={styles.cameraVideo} />
    </div>
  );
}
