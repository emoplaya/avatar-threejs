import { CameraControls, Environment, Gltf } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import { useRef, useEffect, useState } from "react";
import { VRMAvatar } from "./VRMAvatar";
import { GLBAvatar } from "./GLBAvatar";
import { BonesInfoPanel } from "./BonesInfoPanel";

export const Experience = ({
  dactylText = "",
  playDactyl = false,
  onStopDactyl = () => {},
  showBonesInfo = false,
  onCurrentLetterUpdate = () => {},
  dactylSpeed = 1.0,
}) => {
  const controls = useRef();
  const [bonesData, setBonesData] = useState([]);
  const avatarRef = useRef();

  const { avatar, avatarType, animation } = useControls("Avatar", {
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
  });

  const handleBonesUpdate = (bones) => {
    setBonesData(bones);
  };

  // Обновляем текущую букву
  useEffect(() => {
    if (playDactyl && avatarRef.current) {
      const interval = setInterval(() => {
        if (avatarRef.current.getCurrentLetter) {
          const letter = avatarRef.current.getCurrentLetter();
          if (letter) {
            onCurrentLetterUpdate(letter);
          }
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [playDactyl, onCurrentLetterUpdate]);

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

      {/* Панель с координатами костей */}
      {showBonesInfo && bonesData.length > 0 && (
        <BonesInfoPanel bonesData={bonesData} />
      )}

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
            onStopDactyl={onStopDactyl}
            showBones={showBonesInfo}
            onBonesUpdate={handleBonesUpdate}
            dactylSpeed={dactylSpeed}
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
