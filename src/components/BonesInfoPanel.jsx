import React, { useState, useEffect } from "react";

export const BonesInfoPanel = ({ bonesData, visible = true }) => {
  const [filter, setFilter] = useState("");
  const [showPositions, setShowPositions] = useState(true);
  const [showRotations, setShowRotations] = useState(true);
  const [showScales, setShowScales] = useState(false);
  const [showWorldPositions, setShowWorldPositions] = useState(true);
  const [groupedView, setGroupedView] = useState(true);

  if (!visible || !bonesData || bonesData.length === 0) {
    return null;
  }

  // Группировка костей по типам
  const groupedBones = {
    hand: bonesData.filter(
      (b) =>
        b.name.includes("Hand") ||
        b.name.includes("Index") ||
        b.name.includes("Thumb") ||
        b.name.includes("Finger")
    ),
    arm: bonesData.filter(
      (b) =>
        b.name.includes("Arm") ||
        b.name.includes("Shldr") ||
        b.name.includes("Forearm")
    ),
    body: bonesData.filter(
      (b) =>
        !b.name.includes("Arm") &&
        !b.name.includes("Hand") &&
        !b.name.includes("Finger")
    ),
  };

  const filteredBones = bonesData.filter((bone) =>
    bone.name.toLowerCase().includes(filter.toLowerCase())
  );

  const filteredGroupedBones = {
    hand: groupedBones.hand.filter((b) =>
      b.name.toLowerCase().includes(filter.toLowerCase())
    ),
    arm: groupedBones.arm.filter((b) =>
      b.name.toLowerCase().includes(filter.toLowerCase())
    ),
    body: groupedBones.body.filter((b) =>
      b.name.toLowerCase().includes(filter.toLowerCase())
    ),
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        width: 450,
        maxHeight: "80vh",
        overflowY: "auto",
        background: "rgba(0, 0, 0, 0.9)",
        color: "#fff",
        padding: "15px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "11px",
        zIndex: 999,
        border: "2px solid #4FC3F7",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: "15px",
          color: "#4fc3f7",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>🦴 Координаты костей</span>
        <span style={{ fontSize: "12px", color: "#81c784" }}>
          {bonesData.length} костей
        </span>
      </h3>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="🔍 Фильтр по имени кости..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid #555",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <div>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="checkbox"
                checked={showPositions}
                onChange={(e) => setShowPositions(e.target.checked)}
              />
              📍 Позиции
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="checkbox"
                checked={showRotations}
                onChange={(e) => setShowRotations(e.target.checked)}
              />
              🔄 Вращения
            </label>
          </div>
          <div>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="checkbox"
                checked={showScales}
                onChange={(e) => setShowScales(e.target.checked)}
              />
              📐 Масштаб
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="checkbox"
                checked={showWorldPositions}
                onChange={(e) => setShowWorldPositions(e.target.checked)}
              />
              🌍 Мировые
            </label>
          </div>
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginTop: "5px",
          }}
        >
          <input
            type="checkbox"
            checked={groupedView}
            onChange={(e) => setGroupedView(e.target.checked)}
          />
          📁 Группировать по типам
        </label>
      </div>

      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          borderTop: "1px solid #444",
          paddingTop: "5px",
        }}
      >
        {groupedView ? (
          <>
            {filteredGroupedBones.hand.length > 0 && (
              <div style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    color: "#ffb74d",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    padding: "5px",
                    background: "rgba(255, 183, 77, 0.1)",
                    borderRadius: "4px",
                  }}
                >
                  ✋ Рука и пальцы ({filteredGroupedBones.hand.length})
                </div>
                {filteredGroupedBones.hand.map((bone, index) => (
                  <BoneItem
                    key={bone.name}
                    bone={bone}
                    index={index}
                    showPositions={showPositions}
                    showRotations={showRotations}
                    showScales={showScales}
                    showWorldPositions={showWorldPositions}
                  />
                ))}
              </div>
            )}

            {filteredGroupedBones.arm.length > 0 && (
              <div style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    color: "#81c784",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    padding: "5px",
                    background: "rgba(129, 199, 132, 0.1)",
                    borderRadius: "4px",
                  }}
                >
                  💪 Рука ({filteredGroupedBones.arm.length})
                </div>
                {filteredGroupedBones.arm.map((bone, index) => (
                  <BoneItem
                    key={bone.name}
                    bone={bone}
                    index={index}
                    showPositions={showPositions}
                    showRotations={showRotations}
                    showScales={showScales}
                    showWorldPositions={showWorldPositions}
                  />
                ))}
              </div>
            )}

            {filteredGroupedBones.body.length > 0 && (
              <div style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    color: "#ba68c8",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    padding: "5px",
                    background: "rgba(186, 104, 200, 0.1)",
                    borderRadius: "4px",
                  }}
                >
                  👤 Тело ({filteredGroupedBones.body.length})
                </div>
                {filteredGroupedBones.body.map((bone, index) => (
                  <BoneItem
                    key={bone.name}
                    bone={bone}
                    index={index}
                    showPositions={showPositions}
                    showRotations={showRotations}
                    showScales={showScales}
                    showWorldPositions={showWorldPositions}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          filteredBones.map((bone, index) => (
            <BoneItem
              key={bone.name}
              bone={bone}
              index={index}
              showPositions={showPositions}
              showRotations={showRotations}
              showScales={showScales}
              showWorldPositions={showWorldPositions}
            />
          ))
        )}

        {filteredBones.length === 0 && (
          <div
            style={{ color: "#ff6b6b", textAlign: "center", padding: "20px" }}
          >
            Кости не найдены
          </div>
        )}
      </div>
    </div>
  );
};

const BoneItem = ({
  bone,
  index,
  showPositions,
  showRotations,
  showScales,
  showWorldPositions,
}) => {
  const [expanded, setExpanded] = useState(false);

  const getBoneTypeColor = (name) => {
    if (
      name.includes("Hand") ||
      name.includes("Index") ||
      name.includes("Thumb") ||
      name.includes("Finger")
    )
      return "#ffb74d";
    if (
      name.includes("Arm") ||
      name.includes("Shldr") ||
      name.includes("Forearm")
    )
      return "#81c784";
    return "#ba68c8";
  };

  return (
    <div
      style={{
        padding: "8px",
        marginBottom: "5px",
        borderBottom: "1px solid #333",
        backgroundColor:
          index % 2 === 0 ? "rgba(255,255,255,0.05)" : "transparent",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onClick={() => setExpanded(!expanded)}
      onMouseOver={(e) =>
        (e.target.style.backgroundColor = "rgba(79, 195, 247, 0.1)")
      }
      onMouseOut={(e) =>
        (e.target.style.backgroundColor =
          index % 2 === 0 ? "rgba(255,255,255,0.05)" : "transparent")
      }
    >
      <div
        style={{
          color: getBoneTypeColor(bone.name),
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{bone.name}</span>
        <span style={{ fontSize: "10px", color: "#aaa" }}>
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      {expanded && (
        <div
          style={{
            marginTop: "8px",
            paddingLeft: "10px",
            borderLeft: "2px solid #444",
          }}
        >
          {showPositions && (
            <div style={{ marginTop: "4px" }}>
              <span style={{ color: "#81c784" }}>📍 Pos: </span>
              <span style={{ color: "#cfd8dc" }}>
                X: {bone.position.x}, Y: {bone.position.y}, Z: {bone.position.z}
              </span>
            </div>
          )}

          {showRotations && (
            <div style={{ marginTop: "4px" }}>
              <span style={{ color: "#ffb74d" }}>🔄 Rot: </span>
              <span style={{ color: "#cfd8dc" }}>
                X: {bone.rotation.x}, Y: {bone.rotation.y}, Z: {bone.rotation.z}
                , W: {bone.rotation.w}
              </span>
            </div>
          )}

          {showScales && (
            <div style={{ marginTop: "4px" }}>
              <span style={{ color: "#e57373" }}>📐 Scale: </span>
              <span style={{ color: "#cfd8dc" }}>
                X: {bone.scale.x}, Y: {bone.scale.y}, Z: {bone.scale.z}
              </span>
            </div>
          )}

          {showWorldPositions && bone.worldPosition && (
            <div
              style={{ marginTop: "4px", color: "#ba68c8", fontSize: "10px" }}
            >
              <span>🌍 World: </span>
              <span>
                X: {bone.worldPosition.x.toFixed(2)}, Y:{" "}
                {bone.worldPosition.y.toFixed(2)}, Z:{" "}
                {bone.worldPosition.z.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
