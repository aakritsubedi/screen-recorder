import {
  FaRegPauseCircle,
  FaRegStopCircle,
  FaRegTimesCircle,
  FaPlayCircle,
} from "react-icons/fa";

import styles from "./../../styles/Controls.module.css";

export default function Controls({
  recordingState,
  stopRecording,
  pauseRecording,
  resumeRecording,
  cancelRecording,
}) {
  return (
    <div className={styles.controls}>
      {recordingState === "RECORDING" ? (
        <FaRegPauseCircle
          color="#F4BE2C"
          className={styles.controlIcon}
          onClick={pauseRecording}
          title="Pause Recording"
        />
      ) : (
        <FaPlayCircle
          color="#F4BE2C"
          className={styles.controlIcon}
          onClick={resumeRecording}
          title="Resume Recording"
        />
      )}
      <FaRegStopCircle
        color="#1FAA59"
        className={styles.controlIcon}
        onClick={stopRecording}
        title="Stop Recording"
      />
      <FaRegTimesCircle
        color="#B4161B"
        className={styles.controlIcon}
        onClick={cancelRecording}
        title="Cancel Recording"
      />
    </div>
  );
}
