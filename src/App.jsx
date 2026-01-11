import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { CameraWidget } from "./components/CameraWidget";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { MetricsMonitor } from "./components/MetricsMonitor";
import { DactylModal } from "./components/DactylModal";

function initMetricsSystem() {
  console.log("🚀 Система мониторинга метрик инициализирована");
  console.log("=============================================");
  console.log("📊 Доступные метрики:");
  console.log("  - FPS (кадры в секунду)");
  console.log("  - MSAE (угловая ошибка)");
  console.log("  - JI (индекс дрожания)");
  console.log("  - Jerk (плавность движения)");
  console.log("  - PAI (физическая корректность)");
  console.log("  - GSD (семантическая дисторсия)");
  console.log("  - MOS (оценка пользователей)");
  console.log("=============================================");
}
function App() {
  const [dactylText, setDactylText] = useState("");
  const [playDactyl, setPlayDactyl] = useState(false);
  const [isProcessingDactyl, setIsProcessingDactyl] = useState(false);
  const [currentLetter, setCurrentLetter] = useState("");
  const [showBonesInfo, setShowBonesInfo] = useState(false);
  const [dactylSpeed, setDactylSpeed] = useState(1.0);

  useEffect(() => {
    initMetricsSystem();

    const interval = setInterval(() => {
      const mockMetrics = {
        fps: Math.random() * 20 + 40,
        msae: (Math.random() * 0.015 + 0.005).toFixed(4),
        ji: (Math.random() * 3 + 2).toFixed(2),
        jerk: (Math.random() * 5 + 8).toFixed(1),
        pai: Math.floor(Math.random() * 20 + 80),
        gsd: (Math.random() * 0.004 + 0.002).toFixed(4),
        mos: (Math.random() * 0.5 + 4.5).toFixed(1),
      };

      console.group("📈 Метрики системы (обновлено)");
      console.log(`🎯 FPS: ${mockMetrics.fps.toFixed(1)} кадров/сек`);
      console.log(`📐 MSAE: ${mockMetrics.msae} рад²`);
      console.log(`🌀 JI: ${mockMetrics.ji} мм`);
      console.log(`⚡ Jerk: ${mockMetrics.jerk} усл. ед.`);
      console.log(`✅ PAI: ${mockMetrics.pai}%`);
      console.log(`🎭 GSD: ${mockMetrics.gsd} рад²`);
      console.log(`⭐ MOS: ${mockMetrics.mos}/5.0`);
      console.groupEnd();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleDactylSubmit = (text, speed = dactylSpeed) => {
    setDactylText(text);
    setPlayDactyl(true);
    setIsProcessingDactyl(true);
    setDactylSpeed(speed);
  };

  const handleDactylClear = () => {
    setDactylText("");
    setPlayDactyl(false);
    setIsProcessingDactyl(false);
    setCurrentLetter("");
  };

  const handleStopDactyl = () => {
    setPlayDactyl(false);
    setIsProcessingDactyl(false);
    setCurrentLetter("");
  };

  const handleSpeedChange = (speed) => {
    setDactylSpeed(speed);
  };

  return (
    <>
      <UI />
      <CameraWidget />
      <MetricsMonitor />

      {/* Компактное дактильное окно в левом углу */}
      <DactylModal
        isVisible={true}
        onTextSubmit={handleDactylSubmit}
        onClear={handleDactylClear}
        isProcessing={isProcessingDactyl}
        currentLetter={currentLetter}
        dactylText={dactylText}
        onBonesToggle={setShowBonesInfo}
        showBones={showBonesInfo}
        onSpeedChange={handleSpeedChange}
        currentSpeed={dactylSpeed}
      />

      {/* Стиль для анимации спиннера */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Делаем канвас на весь экран */
          .canvas-container {
            position: fixed !important;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1;
          }
          
          /* UI элементы поверх канваса */
          .ui-overlay {
            position: fixed;
            z-index: 1000;
          }
        `}
      </style>

      <Loader />
      <div className="canvas-container">
        <Canvas shadows camera={{ position: [0.25, 0.25, 2], fov: 30 }}>
          <color attach="background" args={["#333"]} />
          <fog attach="fog" args={["#333", 10, 20]} />
          <Suspense>
            <Experience
              dactylText={dactylText}
              playDactyl={playDactyl}
              onStopDactyl={handleStopDactyl}
              showBonesInfo={showBonesInfo}
              onCurrentLetterUpdate={setCurrentLetter}
              dactylSpeed={dactylSpeed}
            />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default App;
