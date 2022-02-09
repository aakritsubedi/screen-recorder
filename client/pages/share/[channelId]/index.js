import styles from "./../../../styles/Feed.module.css";

import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

export default function Share() {
  const router = useRouter();
  const { channelId } = router.query;
  const [isStreamAvailable, setIsStreamAvailable] = useState(false);
  const peerInstance = useRef(null);

  useEffect(() => {
    import("peerjs").then(({ default: Peer }) => {
      const peer = new Peer();

      peerInstance.current = peer;
    });
  }, [channelId]);

  const call = async (remotePeerId) => {
    const camera = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 2048,
        height: 2048,
        facingMode: "user",
        zoom: false,
        focusMode: true,
      },
    });
    const call = peerInstance.current.call(channelId, camera);
    call.on("stream", (remoteStream) => {
      setIsStreamAvailable(true);
      const video = document.querySelector("#remote-feedback");
      video.srcObject = remoteStream;
      video.play();
    });
  };

  return (
    <div className={styles.playerContainer}>
      {!isStreamAvailable ? (
        <button onClick={() => call(channelId)}>Click Me</button>
      ) : (
        <video className={styles.videoPlayer} id="remote-feedback" autoPlay />
      )}
    </div>
  );
}
