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
  dactylSpeed = 1.0, // Новая пропса для скорости
  ...props
}) => {
  const { scene, animations } = useGLTF(`models/${avatar}`);
  const { actions, mixer } = useAnimations(animations, scene);

  const dactylMixerRef = useRef(null);
  const dactylActionsRef = useRef({});
  const [dactylMixerReady, setDactylMixerReady] = useState(false);
  const [loadedAnimations, setLoadedAnimations] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState("Загрузка анимаций...");

  // Рефы для управления анимациями
  const isPlayingDactylRef = useRef(false);
  const dactylQueueRef = useRef([]);
  const currentLetterIndexRef = useRef(0);
  const baseAnimationRef = useRef(null);
  const currentActionRef = useRef(null);
  const previousActionRef = useRef(null);
  const fadeDurationRef = useRef(0.3);
  const pendingTimeoutRef = useRef(null);
  const currentSpeedRef = useRef(1.0); // Реф для текущей скорости

  // Обновляем скорость при изменении пропсы
  useEffect(() => {
    currentSpeedRef.current = dactylSpeed;
    if (dactylMixerRef.current && isPlayingDactylRef.current) {
      dactylMixerRef.current.timeScale = dactylSpeed;
      console.log(`Скорость дактиля изменена: ${dactylSpeed}x`);
    }
  }, [dactylSpeed]);

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
            undefined,
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
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
      }
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

  // Функция для плавного перехода между анимациями
  const fadeToAction = useCallback(
    (newAction, speed = currentSpeedRef.current) => {
      if (!dactylMixerRef.current) return;

      // Устанавливаем скорость для действия
      newAction.setEffectiveTimeScale(speed);

      if (currentActionRef.current) {
        // Плавный переход от текущей анимации к новой
        newAction.reset();
        newAction.setEffectiveWeight(1);
        newAction.fadeIn(fadeDurationRef.current);

        // Плавно убираем предыдущую анимацию
        currentActionRef.current.fadeOut(fadeDurationRef.current);

        // Запускаем новую анимацию
        newAction.play();
        previousActionRef.current = currentActionRef.current;
      } else {
        // Если нет текущей анимации, просто запускаем новую
        newAction.reset();
        newAction.setEffectiveWeight(1);
        newAction.fadeIn(fadeDurationRef.current);
        newAction.play();
      }

      currentActionRef.current = newAction;
    },
    []
  );

  // Очистка всех дактильных анимаций
  const clearDactylAnimations = useCallback(() => {
    if (currentActionRef.current) {
      currentActionRef.current.fadeOut(fadeDurationRef.current);
      currentActionRef.current = null;
    }
    if (previousActionRef.current) {
      previousActionRef.current.fadeOut(fadeDurationRef.current);
      previousActionRef.current = null;
    }
  }, []);

  // Воспроизведение дактиля с плавными переходами
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
    console.log(`Скорость: ${currentSpeedRef.current}x`);
    console.log(`Обработанные символы: ${letters.join("")}`);

    isPlayingDactylRef.current = true;
    dactylQueueRef.current = letters;
    currentLetterIndexRef.current = 0;

    // Устанавливаем скорость миксера
    if (dactylMixerRef.current) {
      dactylMixerRef.current.timeScale = currentSpeedRef.current;
    }

    // Останавливаем базовую анимацию
    if (mixer) {
      mixer.stopAllAction();
    }
    if (baseAnimationRef.current) {
      baseAnimationRef.current.stop();
    }

    // Очищаем предыдущие дактильные анимации
    clearDactylAnimations();

    const playNextLetter = () => {
      if (currentLetterIndexRef.current >= dactylQueueRef.current.length) {
        finishDactyl();
        return;
      }

      const letter = dactylQueueRef.current[currentLetterIndexRef.current];

      // Пропускаем пробелы - делаем паузу между словами
      if (letter === " ") {
        console.log("Пауза (пробел)");

        // Учитываем скорость при паузе
        const pauseDuration = Math.max(500 / currentSpeedRef.current, 200);

        // Во время паузы продолжаем показывать последнюю анимацию
        setTimeout(() => {
          currentLetterIndexRef.current++;
          playNextLetter();
        }, pauseDuration);
        return;
      }

      const letterData = dactylActionsRef.current[letter];

      if (!letterData || !letterData.available) {
        console.warn(`Анимация для буквы "${letter}" недоступна, пропускаем`);

        // Учитываем скорость при пропуске буквы
        const skipDuration = Math.max(300 / currentSpeedRef.current, 150);

        setTimeout(() => {
          currentLetterIndexRef.current++;
          playNextLetter();
        }, skipDuration);
        return;
      }

      console.log(
        `Воспроизведение буквы: ${letter} (${currentSpeedRef.current}x)`
      );

      // Плавный переход к новой анимации
      const action = letterData.action;
      fadeToAction(action, currentSpeedRef.current);

      // Рассчитываем время до следующей буквы с учетом скорости
      const baseDuration = Math.max(
        letterData.duration * 1000 - fadeDurationRef.current * 1000,
        100
      );
      const adjustedDuration = baseDuration / currentSpeedRef.current;

      // Планируем следующую букву
      pendingTimeoutRef.current = setTimeout(() => {
        currentLetterIndexRef.current++;
        playNextLetter();
      }, adjustedDuration);
    };

    const finishDactyl = () => {
      console.log("Дактиль завершен");
      isPlayingDactylRef.current = false;

      // Плавно завершаем последнюю анимацию
      if (currentActionRef.current) {
        currentActionRef.current.fadeOut(fadeDurationRef.current);
      }

      setTimeout(() => {
        onStopDactyl();
        clearDactylAnimations();

        // Возвращаем базовую анимацию
        if (baseAnimationRef.current && animation !== "None") {
          baseAnimationRef.current.reset().fadeIn(0.5).play();
        }
      }, fadeDurationRef.current * 1000);
    };

    playNextLetter();

    return () => {
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
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
    fadeToAction,
    clearDactylAnimations,
  ]);

  // Обновление микшеров
  useFrame((_, delta) => {
    if (mixer && !isPlayingDactylRef.current) {
      mixer.update(delta);
    }

    if (dactylMixerRef.current) {
      // Умножаем delta на скорость для плавного воспроизведения
      const scaledDelta = delta * currentSpeedRef.current;
      dactylMixerRef.current.update(scaledDelta);
    }
  });

  // Функция для принудительной остановки дактиля
  const stopDactyl = useCallback(() => {
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
    }

    if (dactylMixerRef.current) {
      dactylMixerRef.current.stopAllAction();
    }

    clearDactylAnimations();

    isPlayingDactylRef.current = false;
    dactylQueueRef.current = [];
    onStopDactyl();

    if (baseAnimationRef.current && animation !== "None") {
      baseAnimationRef.current.reset().fadeIn(0.5).play();
    }
  }, [onStopDactyl, animation, clearDactylAnimations]);

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
