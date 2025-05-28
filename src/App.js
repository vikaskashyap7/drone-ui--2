// client/src/App.js
import React, { useEffect, useRef, useState } from "react";
import Joystick from "./components/JoystickSlider";

function App() {
  const socketRef = useRef(null);
  const [left, setLeft] = useState({ x: 0, y: 0 });
  const [right, setRight] = useState({ x: 0, y: 0 });

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:5000");

    socketRef.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const interval = setInterval(() => {
        const payload = JSON.stringify({ lx: left.x, ly: left.y, rx: right.x, ry: right.y });
        socketRef.current.send(payload);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [left, right]);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "300px", marginTop: "100px" }}>
      <Joystick onMove={setLeft} />
      <Joystick onMove={setRight} />
    </div>
  );
}

export default App;
