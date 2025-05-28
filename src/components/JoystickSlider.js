// client/src/Joystick.js
import React, { useEffect, useRef, useState } from "react";

const Joystick = ({ onMove }) => {
  const baseRef = useRef(null);
  const knobRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const radius = 100;

  useEffect(() => {
    const knob = knobRef.current;
    const base = baseRef.current;
    let mouseMove, mouseUp;

    const startDrag = (e) => {
      e.preventDefault();

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

      mouseMove = (e) => move(e.clientX, e.clientY);
      mouseUp = () => {
        knob.style.left = `${radius - 30}px`;
        knob.style.top = `${radius - 30}px`;
        setPosition({ x: 0, y: 0 });
        onMove({ x: 0, y: 0 });

        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
      };

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    };

    knob.addEventListener("mousedown", startDrag);
    return () => {
      knob.removeEventListener("mousedown", startDrag);
    };
  }, [onMove]);

  return (
    <div
      ref={baseRef}
      style={{
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: "#333",
        position: "relative",
        userSelect: "none",
        touchAction: "none",
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
          left: 70,
          top: 70,
          cursor: "grab",
        }}
      ></div>
    </div>
  );
};

export default Joystick;
