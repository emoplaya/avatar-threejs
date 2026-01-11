import { useState } from "react";

export const AppModeSelector = ({ mode, onModeChange }) => {
  const modes = [
    { id: "mirror", label: "Зеркальный аватар", icon: "👤" },
    { id: "dactyl", label: "Дактильный аватар", icon: "✋" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: "15px",
        borderRadius: "12px",
        border: "2px solid rgba(79, 195, 247, 0.5)",
        boxShadow: "0 5px 20px rgba(0,0,0,0.7)",
        backdropFilter: "blur(10px)",
        zIndex: 1001,
        color: "white",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h3 style={{ margin: "0 0 15px 0", color: "#4FC3F7", fontSize: "16px" }}>
        🎮 Режим работы
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 15px",
              backgroundColor:
                mode === m.id
                  ? "rgba(79, 195, 247, 0.3)"
                  : "rgba(255, 255, 255, 0.1)",
              border: `2px solid ${
                mode === m.id ? "#4FC3F7" : "rgba(255, 255, 255, 0.2)"
              }`,
              borderRadius: "8px",
              color: "white",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.3s",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "20px" }}>{m.icon}</span>
            <span>{m.label}</span>
            {mode === m.id && (
              <span style={{ marginLeft: "auto", color: "#4FC3F7" }}>✓</span>
            )}
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: "15px",
          padding: "10px",
          backgroundColor: "rgba(38, 50, 56, 0.5)",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#CFD8DC",
        }}
      >
        {mode === "mirror"
          ? "Режим зеркального аватара: Аватар повторяет ваши движения в реальном времени"
          : "Режим дактильного аватара: Аватар показывает дактильную азбуку по введенному тексту"}
      </div>
    </div>
  );
};
