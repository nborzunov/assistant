import React, { useEffect, useReducer, useState } from "react";
import ky from "ky";
export const useGrantsListAssistant = () => {
  const [messages, updateMessages] = useReducer(
    (
      messages: {
        content: any;
        type: "in" | "out";
        error?: string | null;
        noOutline?: boolean;
      }[],
      newMessage: {
        content: any;
        type: "in" | "out";
        error?: string | null;
        noOutline?: boolean;
      }
    ) => {
      return [...messages, newMessage];
    },
    []
  );

  const [text, setText] = useState("");

  const sendMessage = (e: any, transcript: string = "") => {
    e?.preventDefault();

    transcript = transcript || text;
    ky.post("http://127.0.0.1:8000/translate/", {
      json: transcript,
    })
      .json()
      .then((data: any) => {
        let result = {
          content: transcript,
          type: "in" as const,
        };

        updateMessages(result);
        setText("");
      });
  };

  useEffect(() => {
    updateMessages({
      content: (
        <>
          <div>Добрый день! </div>
          <div>Я бот-помощник. Чем я могу вам помочь?</div>
        </>
      ),
      type: "out",
    });
  }, []);

  return { text, setText, sendMessage, messages };
};
