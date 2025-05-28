import React, { useEffect, useRef } from "react";
import Joystick from "./components/JoystickSlider";

function App() {
  const socketRef = useRef(null);
  const leftRef = useRef({ x: 0, y: 0 });
  const rightRef = useRef({ x: 0, y: 0 });
  const lastSentRef = useRef({ lx: null, ly: null, rx: null, ry: null });

  useEffect(() => {
    socketRef.current = new WebSocket(`https://drone-ui-2.onrender.com`);

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

  const sendIfChanged = () => {
    const payload = {
      lx: leftRef.current.x,
      ly: leftRef.current.y,
      rx: rightRef.current.x,
      ry: rightRef.current.y,
    };

    const last = lastSentRef.current;

    const hasChanged =
      payload.lx !== last.lx ||
      payload.ly !== last.ly ||
      payload.rx !== last.rx ||
      payload.ry !== last.ry;

    if (hasChanged && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
      lastSentRef.current = { ...payload };
    }
  };

  const handleLeftMove = (pos) => {
    leftRef.current = pos;
    sendIfChanged();
  };

  const handleRightMove = (pos) => {
    rightRef.current = pos;
    sendIfChanged();
  };

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
        <Joystick onMove={handleLeftMove} />
      </div>
      <div>
        <h3 style={{ textAlign: "center", color: "#555" }}>Right Joystick</h3>
        <Joystick onMove={handleRightMove} />
      </div>
    </div>
  );
}

export default App;
