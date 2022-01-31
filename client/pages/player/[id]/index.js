import styles from "./../../../styles/Feed.module.css";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from 'axios';

export default function Player() {
  const router = useRouter();
  const { id, url } = router.query;
  const [video, setVideo] = useState(null);
  console.log(url);
  useEffect(() => {
    (async () => {
      if (!url) {
        const response = await axios.get(`http://localhost:8080/video/${id}`);
        console.log(response);

        setVideo(response.data);
      }
    })();
  }, [id]);

  return (
    <div className={styles.playerContainer}>
      <video className={styles.videoPlayer} src={url ? url : video?.path} autoPlay controls />
    </div>
  );
}
