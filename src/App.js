import React, { useEffect, useRef, useState } from "react";
import Joystick from "./components/JoystickSlider";

function App() {
  const socketRef = useRef(null);
  const [left, setLeft] = useState({ x: 0, y: 0 });
  const [right, setRight] = useState({ x: 0, y: 0 });

  // Store the last sent values for comparison
  const lastSentRef = useRef({ lx: null, ly: null, rx: null, ry: null });

  useEffect(() => {
    socketRef.current = new WebSocket("wss://drone-ui-2.onrender.com");

    socketRef.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        const payload = {
          lx: left.x,
          ly: left.y,
          rx: right.x,
          ry: right.y,
        };

        const last = lastSentRef.current;

        const hasChanged =
          payload.lx !== last.lx ||
          payload.ly !== last.ly ||
          payload.rx !== last.rx ||
          payload.ry !== last.ry;

        if (hasChanged) {
          socketRef.current.send(JSON.stringify(payload));
          lastSentRef.current = { ...payload };
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [left, right]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "100px",
        marginTop: "50px",
      }}
    >
      <div style={{ marginBottom: "50px" }}>
        <h3 style={{ textAlign: "center", color: "#555" }}>Left Joystick</h3>
        <Joystick onMove={setLeft} />
      </div>
      <div>
        <h3 style={{ textAlign: "center", color: "#555" }}>Right Joystick</h3>
        <Joystick onMove={setRight} />
      </div>
    </div>
  );
}

export default App;

