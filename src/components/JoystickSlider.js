import React, { useEffect, useRef, useState } from "react";

const Joystick = ({ onMove }) => {
  const baseRef = useRef(null);
  const knobRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const radius = 80; // smaller for responsiveness

  useEffect(() => {
    const knob = knobRef.current;
    const base = baseRef.current;

    let moveListener, upListener;

    const move = (clientX, clientY) => {
      const rect = base.getBoundingClientRect();
      const dx = clientX - rect.left - radius;
      const dy = clientY - rect.top - radius;
      const dist = Math.min(Math.hypot(dx, dy), radius);
      const angle = Math.atan2(dy, dx);

      const knobX = Math.cos(angle) * dist;
      const knobY = Math.sin(angle) * dist;

      knob.style.left = `${knobX + radius - 30}px`;
      knob.style.top = `${knobY + radius - 30}px`;

      const x = parseFloat((knobX / radius).toFixed(2));
      const y = parseFloat((-knobY / radius).toFixed(2));
      setPosition({ x, y });
      onMove({ x, y });
    };

    const startDrag = (e) => {
      e.preventDefault();
      const isTouch = e.type === "touchstart";
      const getClient = (evt) => isTouch ? evt.touches[0] : evt;

      const handleMove = (evt) => {
        const { clientX, clientY } = getClient(evt);
        move(clientX, clientY);
      };

      const handleUp = () => {
        knob.style.left = `${radius - 30}px`;
        knob.style.top = `${radius - 30}px`;
        setPosition({ x: 0, y: 0 });
        onMove({ x: 0, y: 0 });

        const moveEvent = isTouch ? "touchmove" : "mousemove";
        const upEvent = isTouch ? "touchend" : "mouseup";
        document.removeEventListener(moveEvent, handleMove);
        document.removeEventListener(upEvent, handleUp);
      };

      const moveEvent = isTouch ? "touchmove" : "mousemove";
      const upEvent = isTouch ? "touchend" : "mouseup";

      document.addEventListener(moveEvent, handleMove);
      document.addEventListener(upEvent, handleUp);
    };

    knob.addEventListener("mousedown", startDrag);
    knob.addEventListener("touchstart", startDrag, { passive: false });

    return () => {
      knob.removeEventListener("mousedown", startDrag);
      knob.removeEventListener("touchstart", startDrag);
    };
  }, [onMove]);

  return (
    <div
      ref={baseRef}
      style={{
        width: 160,
        height: 160,
        borderRadius: "50%",
        background: "#333",
        position: "relative",
        userSelect: "none",
        touchAction: "none",
        flexShrink: 0,
      }}
    >
      <div
        ref={knobRef}
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#0af",
          position: "absolute",
          left: radius - 30,
          top: radius - 30,
          cursor: "grab",
        }}
      />
    </div>
  );
};

export default Joystick;
