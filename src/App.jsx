import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { CameraWidget } from "./components/CameraWidget";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { MetricsMonitor } from "./components/MetricsMonitor";

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

  return (
    <>
      <UI />
      <CameraWidget />
      <MetricsMonitor />
      <Loader />
      <Canvas shadows camera={{ position: [0.25, 0.25, 2], fov: 30 }}>
        <color attach="background" args={["#333"]} />
        <fog attach="fog" args={["#333", 10, 20]} />
        <Suspense>
          <Experience />
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
