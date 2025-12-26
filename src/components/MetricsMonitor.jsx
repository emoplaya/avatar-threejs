// components/MetricsMonitor.jsx
import { useState, useEffect } from "react";

export const MetricsMonitor = () => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    msae: 0,
    ji: 0,
    jerk: 0,
    pai: 0,
    gsd: 0,
    mos: 0,
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [metricHistory, setMetricHistory] = useState([]);

  useEffect(() => {
    // Эмуляция реальных метрик системы
    const updateMetrics = () => {
      const newMetrics = {
        fps: Math.random() * 20 + 40,
        msae: parseFloat((Math.random() * 0.015 + 0.005).toFixed(4)),
        ji: parseFloat((Math.random() * 3 + 2).toFixed(2)),
        jerk: parseFloat((Math.random() * 5 + 8).toFixed(1)),
        pai: Math.floor(Math.random() * 20 + 80),
        gsd: parseFloat((Math.random() * 0.004 + 0.002).toFixed(4)),
        mos: parseFloat((Math.random() * 0.5 + 4.5).toFixed(1)),
      };

      setMetrics(newMetrics);

      // Сохраняем историю FPS для графика
      setMetricHistory((prev) => {
        const newHistory = [...prev, newMetrics.fps];
        return newHistory.slice(-30); // Последние 30 значений
      });
    };

    const interval = setInterval(updateMetrics, 1000);
    updateMetrics(); // Первый вызов

    return () => clearInterval(interval);
  }, []);

  const getFPSColor = (fps) => {
    if (fps >= 50) return "text-green-500";
    if (fps >= 30) return "text-yellow-500";
    return "text-red-500";
  };

  const getMetricColor = (value, goodThreshold, warningThreshold) => {
    if (value >= goodThreshold) return "text-green-500";
    if (value >= warningThreshold) return "text-yellow-500";
    return "text-red-500";
  };

  const metricsList = [
    {
      label: "FPS",
      value: metrics.fps.toFixed(1),
      unit: "кадр/сек",
      color: getFPSColor(metrics.fps),
      description: "Частота кадров",
    },
    {
      label: "MSAE",
      value: metrics.msae.toFixed(4),
      unit: "рад²",
      color: getMetricColor(metrics.msae, 0.01, 0.02),
      description: "Угловая ошибка",
    },
    {
      label: "JI",
      value: metrics.ji.toFixed(2),
      unit: "мм",
      color: getMetricColor(metrics.ji, 3, 5),
      description: "Индекс дрожания",
    },
    {
      label: "Jerk",
      value: metrics.jerk.toFixed(1),
      unit: "",
      color: getMetricColor(metrics.jerk, 10, 15),
      description: "Плавность движения",
    },
    {
      label: "PAI",
      value: metrics.pai,
      unit: "%",
      color: getMetricColor(metrics.pai, 90, 80),
      description: "Физическая корректность",
    },
    {
      label: "GSD",
      value: metrics.gsd.toFixed(4),
      unit: "рад²",
      color: getMetricColor(metrics.gsd, 0.004, 0.006),
      description: "Семантическая дисторсия",
    },
    {
      label: "MOS",
      value: metrics.mos,
      unit: "/5.0",
      color: getMetricColor(metrics.mos, 4.5, 4.0),
      description: "Оценка пользователей",
    },
  ];

  return (
    <>
      {/* Основная панель метрик */}
      <div className="fixed top-4 left-4 z-50">
        <div
          className={`bg-black/90 backdrop-blur-sm rounded-xl border border-gray-800 shadow-2xl transition-all duration-300 ${
            isExpanded ? "p-4 w-96" : "p-3 w-48"
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-bold text-lg flex items-center">
              📊 Системные метрики
              <span className="ml-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                ЭКСПЕРИМЕНТ
              </span>
            </h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? "▲" : "▼"}
            </button>
          </div>

          {isExpanded ? (
            <>
              {/* Развернутый вид */}
              <div className="space-y-3">
                {metricsList.map((metric, index) => (
                  <div key={index} className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className="text-gray-400 text-sm">
                          {metric.label}
                        </span>
                        <div className="text-xs text-gray-500">
                          {metric.description}
                        </div>
                      </div>
                      <div className={`text-xl font-bold ${metric.color}`}>
                        {metric.value}
                        <span className="text-sm text-gray-400 ml-1">
                          {metric.unit}
                        </span>
                      </div>
                    </div>

                    {metric.label === "FPS" && (
                      <div className="mt-2">
                        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getFPSColor(
                              metric.value
                            ).replace(
                              "text-",
                              "bg-"
                            )} transition-all duration-300`}
                            style={{
                              width: `${Math.min(
                                100,
                                (metric.value / 60) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* График FPS */}
                <div className="mt-4 pt-3 border-t border-gray-800">
                  <div className="text-sm text-gray-400 mb-2">
                    📈 История FPS (последние 30 сек)
                  </div>
                  <div className="h-20 flex items-end space-x-1">
                    {metricHistory.map((value, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-t transition-all duration-300 ${
                          value >= 50
                            ? "bg-green-500"
                            : value >= 30
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ height: `${(value / 60) * 100}%` }}
                        title={`${value.toFixed(1)} FPS`}
                      />
                    ))}
                  </div>
                </div>

                {/* Статус системы */}
                <div className="mt-4 p-3 bg-gray-900/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Статус системы:</span>
                    <span className="flex items-center text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      Работает нормально
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Задержка:{" "}
                    {(1000 / Math.max(metrics.fps, 1) + 15).toFixed(1)} мс
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Свернутый вид */
            <div className="grid grid-cols-2 gap-2">
              {metricsList.slice(0, 4).map((metric, index) => (
                <div key={index} className="bg-gray-900/30 p-2 rounded">
                  <div className="text-xs text-gray-400">{metric.label}</div>
                  <div className={`text-lg font-bold ${metric.color}`}>
                    {metric.value}
                    <span className="text-xs text-gray-400 ml-1">
                      {metric.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Дополнительная информация в углу */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-black/80 backdrop-blur-sm p-3 rounded-lg border border-gray-700">
          <div className="text-xs text-gray-400">📊 Эксперимент №4</div>
          <div className="text-sm text-white font-medium">
            ИИ-анимации: DeepMotion + Rokoko
          </div>
          <div className="text-xs text-green-400 mt-1">
            Время интеграции: 45 мин (↓85%)
          </div>
        </div>
      </div>

      {/* Логирование в консоль */}
      <MetricsLogger metrics={metrics} />
    </>
  );
};

// Компонент для логирования в консоль
const MetricsLogger = ({ metrics }) => {
  useEffect(() => {
    console.log(
      `[МЕТРИКИ] FPS: ${metrics.fps.toFixed(1)}, MSAE: ${metrics.msae.toFixed(
        4
      )}, PAI: ${metrics.pai}%`
    );
  }, [metrics]);

  return null;
};

export default MetricsMonitor;
