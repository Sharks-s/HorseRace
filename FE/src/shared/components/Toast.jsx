import { createRoot } from "react-dom/client";

const createContainer = () => {
  let container = document.getElementById("custom-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "custom-toast-container";
    Object.assign(container.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    });
    document.body.appendChild(container);
  }
  return container;
};

const show = (message, type = "info", duration = 3000) => {
  if (!message) return;

  const container = createContainer();
  const toastId = document.createElement("div");
  container.appendChild(toastId);

  const root = createRoot(toastId);

  const bgColors = {
    success: "#4CAF50",
    error: "#f44336",
    info: "#2196F3",
  };

  const styles = {
    backgroundColor: bgColors[type] || bgColors.info,
    color: "white",
    padding: "12px 24px",
    borderRadius: "4px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    animation: "slideIn 0.3s ease-out",
  };

  const removeToast = () => {
    root.unmount();
    toastId.remove();
  };

  root.render(
    <div style={styles}>
      <span>{message}</span>
      <button
        onClick={removeToast}
        style={{
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ✕
      </button>
    </div>,
  );

  setTimeout(removeToast, duration);
};

export const toast = {
  success: (msg, dur) => show(msg, "success", dur),
  error: (msg, dur) => show(msg, "error", dur),
  info: (msg, dur) => show(msg, "info", dur),
};
