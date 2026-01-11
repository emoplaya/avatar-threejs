import React, { useEffect, useState } from "react";

export const BonesInfoPanel = ({ bonesData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBones, setFilteredBones] = useState([]);
  const [activeTab, setActiveTab] = useState("position"); // 'position' или 'rotation'

  // Фильтрация костей по поиску
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBones(bonesData);
    } else {
      const filtered = bonesData.filter((bone) =>
        bone.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBones(filtered);
    }
  }, [bonesData, searchTerm]);

  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0.000";
    return num.toFixed(3);
  };

  const formatQuaternion = (q) => {
    if (!q) return "(0.000, 0.000, 0.000, 0.000)";
    return `(${formatNumber(q.x)}, ${formatNumber(q.y)}, ${formatNumber(
      q.z
    )}, ${formatNumber(q.w)})`;
  };

  const formatVector = (v) => {
    if (!v) return "(0.000, 0.000, 0.000)";
    return `(${formatNumber(v.x)}, ${formatNumber(v.y)}, ${formatNumber(v.z)})`;
  };

  const formatEuler = (q) => {
    if (!q) return "(0.000, 0.000, 0.000)";
    // Преобразуем кватернион в углы Эйлера (в радианах)
    const euler = new THREE.Euler().setFromQuaternion(
      new THREE.Quaternion(q.x, q.y, q.z, q.w)
    );
    return `(${formatNumber(euler.x)}, ${formatNumber(euler.y)}, ${formatNumber(
      euler.z
    )})`;
  };

  if (!bonesData || bonesData.length === 0) {
    return (
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          width: "300px",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          borderRadius: "12px",
          padding: "15px",
          color: "white",
          fontFamily: "'Monaco', 'Courier New', monospace",
          fontSize: "12px",
          zIndex: 1000,
          border: "2px solid rgba(255, 107, 107, 0.3)",
          boxShadow: "0 5px 20px rgba(0,0,0,0.7)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <span style={{ fontSize: "18px", color: "#FF6B6B" }}>🦴</span>
          <h3 style={{ margin: 0, color: "#FF6B6B", fontSize: "14px" }}>
            Информация о костях
          </h3>
        </div>
        <div style={{ textAlign: "center", padding: "20px", color: "#B0BEC5" }}>
          Данные о костях не получены
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        width: isExpanded ? "600px" : "450px",
        height: isExpanded ? "85vh" : "60vh",
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        borderRadius: "12px",
        padding: "15px",
        color: "white",
        fontFamily: "'Monaco', 'Courier New', monospace",
        fontSize: "12px",
        overflow: "hidden",
        zIndex: 1000,
        border: "2px solid rgba(255, 193, 7, 0.3)",
        boxShadow: "0 5px 20px rgba(0,0,0,0.7)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Заголовок */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
          paddingBottom: "10px",
          borderBottom: "1px solid rgba(255, 193, 7, 0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px", color: "#FFC107" }}>🦴</span>
          <div>
            <h3 style={{ margin: 0, color: "#FFC107", fontSize: "14px" }}>
              Информация о костях
              <span
                style={{
                  fontSize: "11px",
                  color: "#B0BEC5",
                  marginLeft: "10px",
                  fontWeight: "normal",
                }}
              >
                {filteredBones.length} костей
              </span>
            </h3>
            <div
              style={{ fontSize: "10px", color: "#78909C", marginTop: "2px" }}
            >
              Обновляется в реальном времени
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: "rgba(255, 193, 7, 0.2)",
              border: "1px solid rgba(255, 193, 7, 0.5)",
              color: "#FFC107",
              fontSize: "11px",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "5px",
              minWidth: "70px",
            }}
          >
            {isExpanded ? "Свернуть" : "Развернуть"}
          </button>
        </div>
      </div>

      {/* Панель поиска и фильтров */}
      <div style={{ marginBottom: "15px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Поиск костей..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
              fontSize: "12px",
              borderRadius: "6px",
              border: "1px solid #546E7A",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
              outline: "none",
            }}
          />
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            style={{
              padding: "8px",
              fontSize: "12px",
              borderRadius: "6px",
              border: "1px solid #546E7A",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
              cursor: "pointer",
            }}
          >
            <option value="position">Позиция</option>
            <option value="rotation">Вращение</option>
          </select>
        </div>
        {searchTerm && (
          <div
            style={{
              fontSize: "11px",
              color: "#B0BEC5",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Найдено: {filteredBones.length} костей</span>
            <span>
              {activeTab === "position"
                ? "X, Y, Z позиции"
                : "Кватернион вращения"}
            </span>
          </div>
        )}
      </div>

      {/* Заголовок таблицы */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isExpanded
            ? "minmax(150px, 1fr) 1fr"
            : "minmax(120px, 1fr) 1fr",
          gap: "15px",
          padding: "10px",
          backgroundColor: "rgba(255, 193, 7, 0.15)",
          borderRadius: "6px",
          marginBottom: "10px",
          fontSize: "11px",
          color: "#FFC107",
          fontWeight: "bold",
        }}
      >
        <div>Имя кости</div>
        <div>
          {activeTab === "position"
            ? "Позиция (X, Y, Z)"
            : "Вращение (X, Y, Z, W)"}
        </div>
      </div>

      {/* Список костей с прокруткой */}
      <div
        style={{
          height: `calc(${isExpanded ? "85vh" : "60vh"} - 180px)`,
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "5px",
        }}
      >
        {filteredBones.length > 0 ? (
          filteredBones.map((bone, index) => (
            <div
              key={bone.id || index}
              style={{
                display: "grid",
                gridTemplateColumns: isExpanded
                  ? "minmax(150px, 1fr) 1fr"
                  : "minmax(120px, 1fr) 1fr",
                gap: "15px",
                padding: "10px",
                marginBottom: "8px",
                backgroundColor:
                  index % 2 === 0 ? "rgba(255, 255, 255, 0.05)" : "transparent",
                borderRadius: "6px",
                borderLeft: "3px solid rgba(255, 193, 7, 0.3)",
                fontSize: "11px",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 193, 7, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  index % 2 === 0 ? "rgba(255, 255, 255, 0.05)" : "transparent";
              }}
            >
              <div
                style={{
                  wordBreak: "break-word",
                  color: "#E0E0E0",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <span style={{ color: "#4FC3F7" }}>•</span>
                {bone.name}
              </div>
              <div
                style={{
                  color: activeTab === "position" ? "#4FC3F7" : "#69F0AE",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "10px",
                }}
              >
                {activeTab === "position"
                  ? formatVector(bone.position)
                  : formatQuaternion(bone.quaternion)}
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#B0BEC5",
              fontSize: "14px",
            }}
          >
            {searchTerm ? "Кости не найдены" : "Загрузка данных о костях..."}
          </div>
        )}
      </div>

      {/* Статистика внизу */}
      <div
        style={{
          marginTop: "15px",
          paddingTop: "10px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          fontSize: "10px",
          color: "#B0BEC5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "#4FC3F7",
                borderRadius: "2px",
              }}
            ></div>
            <span>Позиция</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "#69F0AE",
                borderRadius: "2px",
              }}
            ></div>
            <span>Вращение</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div>Последнее обновление: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  );
};
