import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Русский дактильный словарь
const dactMap = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "solM",
  ы: "yi",
  ь: "softM",
  э: "e",
  ю: "yu",
  я: "ya",
};

// Буквы с базовыми анимациями (для fallback)
const fallbackAnimations = {
  а: "Idle", // Используем Idle как базовую анимацию
  б: "Idle",
  в: "Idle",
  // ... добавьте другие буквы при необходимости
};

const processText = (text) => {
  return text
    .toLowerCase()
    .split("")
    .filter((char) => char === " " || char in dactMap);
};

export const GLBAvatar = ({
  avatar = "avatar2.glb",
  userText = "",
  playDactyl = false,
  onStopDactyl = () => {},
  animation = "Idle",
  ...props
}) => {
  const { scene, animations } = useGLTF(`models/${avatar}`);
  const { actions, mixer } = useAnimations(animations, scene);

  const dactylMixerRef = useRef(null);
  const dactylActionsRef = useRef({});
  const [dactylMixerReady, setDactylMixerReady] = useState(false);
  const [loadedAnimations, setLoadedAnimations] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState("Загрузка анимаций...");

  const isPlayingDactylRef = useRef(false);
  const dactylQueueRef = useRef([]);
  const currentLetterIndexRef = useRef(0);
  const baseAnimationRef = useRef(null);

  // Инициализация миксера для дактильных анимаций
  useEffect(() => {
    const dactylMixer = new THREE.AnimationMixer(scene);
    dactylMixerRef.current = dactylMixer;

    const loader = new GLTFLoader();
    const letters = Object.keys(dactMap);
    const totalLetters = letters.length;
    let loadedCount = 0;

    const updateLoadingStatus = () => {
      loadedCount++;
      setLoadedAnimations(loadedCount);
      if (loadedCount === totalLetters) {
        setLoadingStatus("Анимации загружены");
        setDactylMixerReady(true);

        // Логируем статус загрузки
        console.log(
          `Загружено анимаций: ${
            Object.keys(dactylActionsRef.current).filter(
              (k) => dactylActionsRef.current[k] !== null
            ).length
          }/${totalLetters}`
        );
      }
    };

    letters.forEach((letter) => {
      const animName = dactMap[letter];

      // Проверяем существование файла перед загрузкой
      fetch(`/models/anims/d_${animName}.glb`, { method: "HEAD" })
        .then((response) => {
          if (!response.ok) {
            throw new Error("File not found");
          }
          return loader.load(
            `/models/anims/d_${animName}.glb`,
            (gltf) => {
              if (gltf.animations && gltf.animations.length > 0) {
                const clip = gltf.animations[0];
                const action = dactylMixer.clipAction(clip);
                action.setLoop(THREE.LoopOnce, 0);
                action.clampWhenFinished = true;
                dactylActionsRef.current[letter] = {
                  action,
                  duration: clip.duration,
                  name: animName,
                  available: true,
                };
              } else {
                console.warn(
                  `Анимация для буквы "${letter}" не найдена в файле`
                );
                dactylActionsRef.current[letter] = {
                  action: null,
                  duration: 0.5,
                  name: animName,
                  available: false,
                };
              }
              updateLoadingStatus();
            },
            (progress) => {
              // Прогресс загрузки
            },
            (error) => {
              console.warn(
                `Файл анимации для буквы "${letter}" не найден, используем fallback`
              );
              dactylActionsRef.current[letter] = {
                action: null,
                duration: 0.5,
                name: animName,
                available: false,
              };
              updateLoadingStatus();
            }
          );
        })
        .catch((error) => {
          console.warn(
            `Файл анимации для буквы "${letter}" (d_${animName}.glb) не найден`
          );
          dactylActionsRef.current[letter] = {
            action: null,
            duration: 0.5,
            name: animName,
            available: false,
          };
          updateLoadingStatus();
        });
    });

    return () => {
      if (dactylMixerRef.current) {
        dactylMixerRef.current.stopAllAction();
      }
      dactylQueueRef.current = [];
    };
  }, [scene]);

  // Управление базовыми анимациями
  useEffect(() => {
    if (!actions || isPlayingDactylRef.current) return;

    if (animation !== "None") {
      Object.values(actions).forEach((action) => action.stop());
      const baseAction = actions[animation];
      if (baseAction) {
        baseAction.reset().fadeIn(0.3).play();
        baseAnimationRef.current = baseAction;
      }
    } else {
      Object.values(actions).forEach((action) => action.stop());
      baseAnimationRef.current = null;
    }
  }, [actions, animation]);

  // Воспроизведение дактиля
  useEffect(() => {
    if (
      !dactylMixerReady ||
      !userText ||
      !playDactyl ||
      isPlayingDactylRef.current
    ) {
      return;
    }

    const letters = processText(userText);
    if (letters.length === 0) {
      console.warn("Нет поддерживаемых символов для воспроизведения");
      onStopDactyl();
      return;
    }

    console.log(`Начинаем воспроизведение дактиля: "${userText}"`);
    console.log(`Обработанные символы: ${letters.join("")}`);

    isPlayingDactylRef.current = true;
    dactylQueueRef.current = letters;
    currentLetterIndexRef.current = 0;

    // Останавливаем базовую анимацию
    if (mixer) {
      mixer.stopAllAction();
    }
    if (baseAnimationRef.current) {
      baseAnimationRef.current.stop();
    }

    // Очищаем микшер дактиля
    if (dactylMixerRef.current) {
      dactylMixerRef.current.stopAllAction();
    }

    const playNextLetter = () => {
      if (currentLetterIndexRef.current >= dactylQueueRef.current.length) {
        finishDactyl();
        return;
      }

      const letter = dactylQueueRef.current[currentLetterIndexRef.current];

      // Пропускаем пробелы
      if (letter === " ") {
        console.log("Пауза (пробел)");
        setTimeout(() => {
          currentLetterIndexRef.current++;
          playNextLetter();
        }, 500);
        return;
      }

      const letterData = dactylActionsRef.current[letter];

      if (!letterData || !letterData.available) {
        console.warn(
          `Анимация для буквы "${letter}" недоступна, используем fallback`
        );

        // Показываем букву в консоли или UI
        console.log(`Буква: ${letter}`);

        // Используем базовую анимацию как fallback
        if (actions[fallbackAnimations[letter] || "Idle"]) {
          const fallbackAction = actions[fallbackAnimations[letter] || "Idle"];
          fallbackAction.reset().play();

          setTimeout(() => {
            fallbackAction.stop();
            currentLetterIndexRef.current++;
            playNextLetter();
          }, 500);
        } else {
          // Просто пауза для отсутствующей анимации
          setTimeout(() => {
            currentLetterIndexRef.current++;
            playNextLetter();
          }, 300);
        }
        return;
      }

      console.log(`Воспроизведение буквы: ${letter}`);

      // Останавливаем предыдущую анимацию
      dactylMixerRef.current.stopAllAction();

      // Воспроизводим текущую букву
      const action = letterData.action;
      action.reset().play();

      // Планируем следующую букву
      setTimeout(() => {
        currentLetterIndexRef.current++;
        playNextLetter();
      }, letterData.duration * 1000 + 200);
    };

    const finishDactyl = () => {
      console.log("Дактиль завершен");
      isPlayingDactylRef.current = false;

      setTimeout(() => {
        onStopDactyl();

        if (baseAnimationRef.current && animation !== "None") {
          baseAnimationRef.current.reset().fadeIn(0.5).play();
        }
      }, 500);
    };

    playNextLetter();

    return () => {
      if (dactylMixerRef.current) {
        dactylMixerRef.current.stopAllAction();
      }
    };
  }, [
    userText,
    playDactyl,
    dactylMixerReady,
    onStopDactyl,
    mixer,
    animation,
    actions,
  ]);

  // Обновление микшеров
  useFrame((_, delta) => {
    if (mixer && !isPlayingDactylRef.current) {
      mixer.update(delta);
    }

    if (dactylMixerRef.current) {
      dactylMixerRef.current.update(delta);
    }
  });

  // Функция для принудительной остановки дактиля
  const stopDactyl = useCallback(() => {
    if (dactylMixerRef.current) {
      dactylMixerRef.current.stopAllAction();
    }
    isPlayingDactylRef.current = false;
    dactylQueueRef.current = [];
    onStopDactyl();

    if (baseAnimationRef.current && animation !== "None") {
      baseAnimationRef.current.reset().fadeIn(0.5).play();
    }
  }, [onStopDactyl, animation]);

  useEffect(() => {
    if (!playDactyl && isPlayingDactylRef.current) {
      stopDactyl();
    }
  }, [playDactyl, stopDactyl]);

  return (
    <>
      <primitive object={scene} {...props} />
    </>
  );
};
