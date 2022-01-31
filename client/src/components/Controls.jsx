import { FaRegPauseCircle, FaRegStopCircle, FaRegTimesCircle } from "react-icons/fa";

import styles from "./../../styles/Controls.module.css";

export default function Controls({ stopRecording }) {
  return (
    <div className={styles.controls}>
      <FaRegPauseCircle  className={styles.controlIcon} />
      <FaRegStopCircle  className={styles.controlIcon} onClick={stopRecording} />
      <FaRegTimesCircle  className={styles.controlIcon} />
    </div>
  );
}
