import { CameraControls, Environment, Gltf, Html } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import { useRef, useState, useEffect } from "react";
import { VRMAvatar } from "./VRMAvatar";
import { GLBAvatar } from "./GLBAvatar";
import { BonesInfoPanel } from "./BonesInfoPanel";

export const Experience = () => {
  const controls = useRef();
  const [dactylText, setDactylText] = useState("");
  const [playDactyl, setPlayDactyl] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [bonesData, setBonesData] = useState([]);
  const [showBonesInfo, setShowBonesInfo] = useState(false);
  const [currentLetter, setCurrentLetter] = useState("");
  const avatarRef = useRef();

  const { avatar, avatarType, animation, showDactylControls, showBonesPanel } =
    useControls("Avatar", {
      avatarType: {
        value: "VRM",
        options: ["VRM", "GLB"],
      },
      avatar: {
        value: "3859814441197244330.vrm",
        options: [
          "262410318834873893.vrm",
          "3859814441197244330.vrm",
          "3636451243928341470.vrm",
          "8087383217573817818.vrm",
          "avatar2.glb",
        ],
      },
      animation: {
        value: "Idle",
        options: ["None", "Idle", "Swing Dancing", "Thriller Part 2"],
      },
      showDactylControls: {
        value: true,
        label: "Показать управление дактилем",
      },
      showBonesPanel: {
        value: false,
        label: "Показать координаты костей",
      },
    });

  const handleStopDactyl = () => {
    setPlayDactyl(false);
    setIsProcessing(false);
    setCurrentLetter("");
  };

  const handlePlayDactyl = () => {
    if (!inputText.trim()) {
      alert("Введите текст для воспроизведения дактиля");
      return;
    }

    if (avatarType !== "GLB") {
      alert("Дактиль доступен только для GLB аватаров");
      return;
    }

    setIsProcessing(true);
    setDactylText(inputText);
    setPlayDactyl(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handlePlayDactyl();
    }
  };

  const handleClear = () => {
    setInputText("");
    setDactylText("");
    setPlayDactyl(false);
    setCurrentLetter("");
  };

  const handleBonesUpdate = (bones) => {
    setBonesData(bones);
  };

  // Обновляем текущую букву при воспроизведении
  useEffect(() => {
    if (playDactyl && avatarRef.current) {
      const interval = setInterval(() => {
        if (avatarRef.current.getCurrentLetter) {
          const letter = avatarRef.current.getCurrentLetter();
          if (letter && letter !== currentLetter) {
            setCurrentLetter(letter);
          }
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [playDactyl, currentLetter]);

  const supportedLetters = "а-я, ё, ъ, ы, ь, пробел";
  const exampleText = "Привет мир";

  return (
    <>
      <CameraControls
        ref={controls}
        maxPolarAngle={Math.PI / 2}
        minDistance={1}
        maxDistance={10}
      />

      <directionalLight intensity={2} position={[10, 10, 5]} />
      <directionalLight intensity={1} position={[-10, 10, 5]} />

      {/* UI для ввода текста и управления дактилем */}
      {showDactylControls && avatarType === "GLB" && (
        <Html
          position={[0, 2.5, 0]}
          center
          style={{
            width: "500px",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            padding: "25px",
            borderRadius: "15px",
            border: "3px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              color: "white",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: "20px",
                textAlign: "center",
                color: "#4FC3F7",
                fontSize: "24px",
              }}
            >
              ✋ Дактильный алфавит
            </h3>

            {currentLetter && isProcessing && (
              <div
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  backgroundColor: "rgba(79, 195, 247, 0.2)",
                  borderRadius: "8px",
                  textAlign: "center",
                  border: "2px solid #4FC3F7",
                }}
              >
                <div style={{ fontSize: "14px", color: "#B0BEC5" }}>
                  Текущая буква:
                </div>
                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: "bold",
                    color: "#4FC3F7",
                    textTransform: "uppercase",
                  }}
                >
                  {currentLetter}
                </div>
              </div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "16px",
                  color: "#B0BEC5",
                }}
              >
                Введите текст:
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Например: "${exampleText}"`}
                disabled={isProcessing}
                style={{
                  width: "100%",
                  minHeight: "80px",
                  padding: "12px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  border: "2px solid #546E7A",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  color: "black",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <button
                onClick={handlePlayDactyl}
                disabled={isProcessing || !inputText.trim()}
                style={{
                  flex: 2,
                  padding: "12px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  backgroundColor: isProcessing ? "#78909C" : "#00C853",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseOver={(e) => {
                  if (!isProcessing && inputText.trim()) {
                    e.target.style.backgroundColor = "#00E676";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isProcessing && inputText.trim()) {
                    e.target.style.backgroundColor = "#00C853";
                  }
                }}
              >
                {isProcessing ? (
                  <>
                    <span
                      className="spinner"
                      style={{
                        display: "inline-block",
                        width: "16px",
                        height: "16px",
                        border: "2px solid white",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    Воспроизводится...
                  </>
                ) : (
                  "▶ Воспроизвести дактиль"
                )}
              </button>

              <button
                onClick={handleClear}
                style={{
                  flex: 1,
                  padding: "12px",
                  fontSize: "16px",
                  backgroundColor: "#FF5252",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#FF867F")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#FF5252")}
              >
                Очистить
              </button>
            </div>

            {dactylText && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "15px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  borderLeft: "4px solid #4FC3F7",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    color: "#B0BEC5",
                    marginBottom: "5px",
                  }}
                >
                  Текущий текст:
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    wordBreak: "break-word",
                  }}
                >
                  {dactylText}
                </div>
                {isProcessing && (
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "14px",
                      color: "#81C784",
                    }}
                  >
                    ⏳ Идет воспроизведение...
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "rgba(38, 50, 56, 0.5)",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#CFD8DC",
              }}
            >
              <div style={{ marginBottom: "8px" }}>
                <strong>Поддерживаемые символы:</strong> {supportedLetters}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>Пример:</strong> "{exampleText}" → "привет мир"
              </div>
              <div>
                <strong>Совет:</strong> Введите текст и нажмите Enter для
                быстрого воспроизведения
              </div>
            </div>

            <div
              style={{
                marginTop: "20px",
                paddingTop: "15px",
                borderTop: "1px solid #444",
              }}
            >
              <label
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <input
                  type="checkbox"
                  checked={showBonesInfo}
                  onChange={(e) => setShowBonesInfo(e.target.checked)}
                  style={{ width: "18px", height: "18px" }}
                />
                <span>Показать координаты костей</span>
              </label>
            </div>
          </div>
        </Html>
      )}

      {/* Панель с координатами костей */}
      {showBonesInfo && bonesData.length > 0 && (
        <BonesInfoPanel bonesData={bonesData} />
      )}

      {/* Добавляем стили для анимации спиннера */}
      <Html>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Html>

      <group position-y={-1.25}>
        {avatarType === "VRM" ? (
          <VRMAvatar avatar={avatar} />
        ) : (
          <GLBAvatar
            ref={avatarRef}
            avatar={avatar}
            animation={animation}
            userText={dactylText}
            playDactyl={playDactyl}
            onStopDactyl={handleStopDactyl}
            showBones={showBonesInfo}
            onBonesUpdate={handleBonesUpdate}
            speed={1.0}
          />
        )}
        <Gltf
          src="models/scene.glb"
          position-z={-1.4}
          position-x={-0.5}
          scale={0.65}
        />
      </group>
      <EffectComposer>
        <Bloom mipmapBlur intensity={0.7} />
      </EffectComposer>
    </>
  );
};
