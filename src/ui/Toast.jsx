import { useEffect } from "react";

function Toast({ gameName, type = "success", onClose }) {
  const isSuccess = type === "success";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed right-5 bottom-5 z-50 flex animate-[slideIn_0.3s_ease-out] items-center gap-3 rounded-lg bg-gray-900 px-5 py-3 shadow-lg`}
    >
      <span className="text-lg">{isSuccess ? "❤️" : "💔"}</span>

      <p className="font-medium">
        <span
          className={`rounded-md px-2 py-1 ${isSuccess ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
        >
          {gameName}
        </span>

        <span className="ml-2 text-white">
          {isSuccess ? "added to favorites" : "removed from favorites"}
        </span>
      </p>

      <button
        onClick={onClose}
        className="ml-2 cursor-pointer text-lg text-gray-400 transition hover:text-white"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
