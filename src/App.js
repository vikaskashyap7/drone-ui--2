import React, { useEffect, useRef, useState } from "react";
import Joystick from "./components/JoystickSlider";

function App() {
  const socketRef = useRef(null);
  const [left, setLeft] = useState({ x: 0, y: 0 });
  const [right, setRight] = useState({ x: 0, y: 0 });

  useEffect(() => {
    socketRef.current = new WebSocket(`https://drone-ui-2.onrender.com`); // Ensure `wss://`

    socketRef.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        const payload = JSON.stringify({ lx: left.x, ly: left.y, rx: right.x, ry: right.y });
        socketRef.current.send(payload);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [left, right]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: "50px",
        marginTop: "100px",
        flexWrap: "wrap",
        padding: "0 20px",
      }}
    >
      <Joystick onMove={setLeft} />
      <Joystick onMove={setRight} />
    </div>
  );
}

export default App;
