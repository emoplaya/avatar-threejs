import { useState, useEffect } from "react";
import { useControls } from "leva";

export const DactylModal = ({
  isVisible = true,
  onTextSubmit,
  onClear,
  isProcessing = false,
  currentLetter = "",
  dactylText = "",
  onBonesToggle,
  showBones = false,
  onSpeedChange,
  currentSpeed = 1.0,
}) => {
  const [inputText, setInputText] = useState("");
  const [isMinimized, setIsMinimized] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [speed, setSpeed] = useState(currentSpeed);

  const { avatarType } = useControls("Avatar", {
    avatarType: {
      value: "VRM",
      options: ["VRM", "GLB"],
    },
  });

  // Если тип аватара не GLB, не показываем окно
  if (avatarType !== "GLB") {
    return null;
  }

  const handleSubmit = () => {
    if (!inputText.trim()) {
      alert("Введите текст для воспроизведения дактиля");
      return;
    }
    onTextSubmit(inputText, speed);
    setIsMinimized(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    setInputText("");
    onClear();
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    if (onSpeedChange) {
      onSpeedChange(newSpeed);
    }
  };

  // Настройки скоростей
  const speedOptions = [
    { value: 0.5, label: "0.5x", description: "Очень медленно" },
    { value: 0.75, label: "0.75x", description: "Медленно" },
    { value: 1.0, label: "1x", description: "Нормально", default: true },
    { value: 1.25, label: "1.25x", description: "Быстро" },
    { value: 1.5, label: "1.5x", description: "Очень быстро" },
    { value: 2.0, label: "2x", description: "Максимальная" },
  ];

  if (!isVisible) return null;

  const supportedLetters = "а-я, ё, ъ, ы, ь, пробел";
  const exampleText = "Привет мир";

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        width: isExpanded ? "420px" : "320px",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: isMinimized ? "10px" : "15px",
        borderRadius: "12px",
        border: "2px solid rgba(79, 195, 247, 0.5)",
        boxShadow: "0 5px 20px rgba(0,0,0,0.7)",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
        color: "white",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        transition: "all 0.3s ease",
        maxHeight: isMinimized ? "50px" : isExpanded ? "550px" : "400px",
        overflow: "hidden",
      }}
    >
      {/* Заголовок с кнопками управления */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: isMinimized ? "0" : "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            flex: 1,
          }}
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <h3
            style={{
              margin: 0,
              color: "#4FC3F7",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "18px" }}>✋</span>
            Дактиль
            {currentLetter && isProcessing && (
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#00E676",
                  marginLeft: "5px",
                }}
              >
                [{currentLetter.toUpperCase()}]
              </span>
            )}
          </h3>
          {!isMinimized && (
            <span
              style={{
                fontSize: "12px",
                backgroundColor: "rgba(79, 195, 247, 0.2)",
                padding: "2px 8px",
                borderRadius: "10px",
                border: "1px solid rgba(79, 195, 247, 0.5)",
              }}
            >
              {speed}x
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "5px" }}>
          <button
            style={{
              background: "rgba(79, 195, 247, 0.2)",
              border: "1px solid rgba(79, 195, 247, 0.5)",
              color: "#4FC3F7",
              fontSize: "12px",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "5px",
              minWidth: "60px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? "Свернуть" : "Развернуть"}
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#4FC3F7",
              fontSize: "14px",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "5px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
          >
            {isMinimized ? "▼" : "▲"}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div
          style={{
            opacity: isMinimized ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          {/* Блок с текущей буквой - компактный */}
          {currentLetter && isProcessing && (
            <div
              style={{
                marginBottom: "10px",
                padding: "8px",
                backgroundColor: "rgba(79, 195, 247, 0.15)",
                borderRadius: "6px",
                textAlign: "center",
                border: "1px solid #4FC3F7",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#4FC3F7",
                  textTransform: "uppercase",
                }}
              >
                {currentLetter}
              </div>
              <div
                style={{ fontSize: "11px", color: "#B0BEC5", marginTop: "4px" }}
              >
                Текущая буква • Скорость: {speed}x
              </div>
            </div>
          )}

          {/* Выбор скорости */}
          <div style={{ marginBottom: "15px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <label
                style={{
                  fontSize: "12px",
                  color: "#B0BEC5",
                }}
              >
                Скорость воспроизведения:
              </label>
              <span
                style={{
                  fontSize: "12px",
                  backgroundColor: "rgba(79, 195, 247, 0.2)",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  border: "1px solid rgba(79, 195, 247, 0.5)",
                }}
              >
                {speed}x
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: "4px",
                flexWrap: "wrap",
              }}
            >
              {speedOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSpeedChange(option.value)}
                  disabled={isProcessing}
                  style={{
                    flex: "1 1 calc(33.333% - 4px)",
                    minWidth: "70px",
                    padding: "6px 4px",
                    fontSize: "11px",
                    backgroundColor:
                      speed === option.value
                        ? option.value === 1.0
                          ? "#4FC3F7"
                          : "#00C853"
                        : "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    border: `1px solid ${
                      speed === option.value
                        ? option.value === 1.0
                          ? "#4FC3F7"
                          : "#00C853"
                        : "rgba(255, 255, 255, 0.3)"
                    }`,
                    borderRadius: "5px",
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    opacity: isProcessing ? 0.7 : 1,
                    transition: "all 0.2s",
                  }}
                  title={option.description}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Поле ввода - компактное */}
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "12px",
                color: "#B0BEC5",
              }}
            >
              Введите текст:
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`"${exampleText}"`}
              disabled={isProcessing}
              style={{
                width: "100%",
                minHeight: isExpanded ? "100px" : "60px",
                padding: "8px",
                fontSize: "14px",
                borderRadius: "6px",
                border: "1px solid #546E7A",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                color: "black",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Кнопки управления - компактные */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "15px",
            }}
          >
            <button
              onClick={handleSubmit}
              disabled={isProcessing || !inputText.trim()}
              style={{
                flex: 2,
                padding: "8px",
                fontSize: "14px",
                fontWeight: "bold",
                backgroundColor: isProcessing ? "#78909C" : "#00C853",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isProcessing ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {isProcessing ? (
                <>
                  <span
                    className="spinner"
                    style={{
                      display: "inline-block",
                      width: "14px",
                      height: "14px",
                      border: "2px solid white",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Идет...
                </>
              ) : (
                "▶ Воспроизвести"
              )}
            </button>

            <button
              onClick={handleClear}
              style={{
                flex: 1,
                padding: "8px",
                fontSize: "14px",
                backgroundColor: "#FF5252",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              Очистить
            </button>
          </div>

          {/* Текущий текст - только в развернутом режиме */}
          {isExpanded && dactylText && (
            <div
              style={{
                marginBottom: "15px",
                padding: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "6px",
                borderLeft: "3px solid #4FC3F7",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#B0BEC5",
                  marginBottom: "4px",
                }}
              >
                Текущий текст:
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  wordBreak: "break-word",
                  maxHeight: "60px",
                  overflowY: "auto",
                }}
              >
                {dactylText}
              </div>
            </div>
          )}

          {/* Информация - только в развернутом режиме */}
          {isExpanded && (
            <div
              style={{
                marginTop: "15px",
                padding: "10px",
                backgroundColor: "rgba(38, 50, 56, 0.5)",
                borderRadius: "6px",
                fontSize: "11px",
                color: "#CFD8DC",
              }}
            >
              <div style={{ marginBottom: "4px" }}>
                <strong>Поддерживаемые символы:</strong> {supportedLetters}
              </div>
              <div style={{ marginBottom: "4px" }}>
                <strong>Скорость:</strong> регулирует темп жестов
              </div>
              <div>
                <strong>Совет:</strong> Enter для быстрого воспроизведения
              </div>
            </div>
          )}

          {/* Переключатель костей - всегда виден */}
          <div
            style={{
              marginTop: isExpanded ? "15px" : "10px",
              paddingTop: isExpanded ? "10px" : "0",
              borderTop: isExpanded ? "1px solid #444" : "none",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
              }}
            >
              <input
                type="checkbox"
                checked={showBones}
                onChange={(e) => onBonesToggle?.(e.target.checked)}
                style={{
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                }}
              />
              <span>Показать кости</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
