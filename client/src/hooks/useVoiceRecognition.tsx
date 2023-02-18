import { useState } from "react";

// @ts-ignore
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export const useVoiceRecognition = (onFinish: (text: string) => void) => {
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);

  const recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.continuous = true;
  recognition.lang = "ru-RU";

  recognition.addEventListener("result", (event: any) => {
    let interimTranscript = "";
    for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal || transcript.length > 100) {
        setTranscript(transcript);
        handleStopRecording();
        onFinish(transcript);
      } else {
        interimTranscript += transcript;
      }
    }
    setTranscript(interimTranscript);
  });

  const handleStartRecording = () => {
    setRecording(true);
    recognition.start();
  };

  const handleStopRecording = () => {
    setRecording(false);
    recognition.stop();
  };

  return { transcript, recording, handleStartRecording, handleStopRecording };
};
