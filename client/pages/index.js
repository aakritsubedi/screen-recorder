import styles from "../styles/Home.module.css";
import { FaPlayCircle } from "react-icons/fa";
import Controls from "../src/components/Controls";
import ScreenFeed from "../src/components/ScreenFeed";
import CameraFeed from "../src/components/CameraFeed";
import { useEffect, useState } from "react";
import axios from "axios";
import randomColorGenerator from "../src/utils/randomColor";

  
import { useRouter } from 'next/router'

export default function Home() {
  let stream = null;
  let audio = null;
  let camera = null;
  let mixedStream = null;
  let chunks = [];
  // let recorder = null;

  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [color, setColor] = useState({ color1: '#fafafa', color2: '#ddccee'})

  useEffect(() => {
    const color1 = randomColorGenerator();
    const color2 = randomColorGenerator();

    setColor({
      color1: color1,
      color2: color2
    })
  }, []);


  const router = useRouter()

  const setupStream = async () => {
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      audio = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      camera = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 2048,
          height: 2048,
          facingMode: "user",
          zoom: false,
          focusMode: true,
        },
        // video: false
      });

      setupVideoFeedback();
    } catch (err) {
      console.error(err);
    }
  };

  const setupVideoFeedback = function () {
    if (stream) {
      const video = document.querySelector("#screen-feedback");
      video.srcObject = stream;
      video.play();
    }
    if (camera) {
      const video = document.querySelector("#camera-feedback");
      video.srcObject = camera;
      video.play();
    }
  };

  const handleDataAvailable = (e) => {
    chunks.push(e.data);
  };

  const handleStop = async (e) => {
    const blob = new Blob(chunks, { type: "video/mp4" });
    blob.lastModified = Date.now();
    blob.name = "Recording.mp4";

    const myFile = new File([blob], blob.name, {
      type: blob.type,
    });
    console.log(myFile);

    let formData = new FormData();
    formData.append("recording", myFile);

    let response = await axios.post("http://localhost:8080/video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    response = response.data;

    chunks = [];

    stream.getTracks().forEach((track) => track.stop());
    audio.getTracks().forEach((track) => track.stop());

    console.log("Recording stopped");
    router.push({
      pathname: `/player/${response.id}`,
      query: {
        // path: a.data.path,
        url: URL.createObjectURL(blob)
      }
    }, `/player/${response.id}`, {
      scroll: true,
      getStaticProps: true,
    })
  };

  const startRecording = async () => {
    setIsRecording(true);
    await setupStream();

    if (stream && audio) {
      mixedStream = new MediaStream([
        ...stream.getTracks(),
        ...audio.getTracks(),
      ]);

      let recorder = new MediaRecorder(mixedStream);
      recorder.ondataavailable = handleDataAvailable;
      recorder.onstop = handleStop;
      recorder.start(1000);

      setRecorder(recorder);

      console.log("Recording started");
    } else {
      console.warn("No stream available.");
    }
  };

  const stopRecording = () => {
    recorder.stop();
    setIsRecording(false);
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `linear-gradient(to right, ${color.color1}, ${color.color2})`,
      }}
    >
      <div className={styles.main}>
        {!isRecording && (
          <>
            <FaPlayCircle
              className={styles.playCircle}
              onClick={startRecording}
              title="Start Recording"
            />
            <small>Click to start recording...</small>
          </>
        )}

        {isRecording && (
          <>
            <Controls stopRecording={stopRecording} />
            <ScreenFeed isRecording={isRecording} />
            <CameraFeed isRecording={isRecording} />
          </>
        )}
      </div>
    </div>
  );
}
