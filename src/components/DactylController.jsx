import { useState } from "react";

export const DactylController = ({ onPlayDactyl, isGLBAvatar, isPlaying }) => {
  const [inputText, setInputText] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && isGLBAvatar && isEnabled) {
      onPlayDactyl(inputText.trim());
      setIsEnabled(false);
      setTimeout(() => setIsEnabled(true), 100); // Защита от двойного клика
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && isEnabled) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isGLBAvatar) return null;

  return (
    <div className="fixed top-20 left-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-black/80 p-4 rounded-lg backdrop-blur-sm border border-gray-700 min-w-80"
      >
        <label className="block mb-2 text-white text-sm font-medium">
          Введите текст для перевода на язык жестов:
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напишите текст на русском..."
            className="flex-1 px-3 py-2 bg-gray-900 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabled={isPlaying || !isEnabled}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isPlaying || !isEnabled}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isPlaying ? "⏸️" : "▶️"}
          </button>
        </div>

        {isPlaying ? (
          <div className="flex items-center text-green-400 text-sm animate-pulse">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Идет воспроизведение жестов...
          </div>
        ) : (
          <div className="text-xs text-gray-400">
            Нажмите Enter или кнопку ▶️ для перевода
          </div>
        )}
      </form>
    </div>
  );
};
