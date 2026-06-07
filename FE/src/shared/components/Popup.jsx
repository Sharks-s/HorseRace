// popup.jsx

import { createRoot } from "react-dom/client";

export const popup = {
  open: ({ title, content, onConfirm }) => {
    // Tạo vùng chứa tạm thời cho popup này
    const popupContainer = document.createElement("div");
    document.body.appendChild(popupContainer);
    const root = createRoot(popupContainer);

    const close = () => {
      root.unmount();
      popupContainer.remove();
    };

    const backdropStyle = {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    };

    const modalStyle = {
      backgroundColor: "white",
      padding: "24px",
      borderRadius: "8px",
      maxWidth: "450px",
      width: "90%",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      fontFamily: "sans-serif",
    };

    root.render(
      <div style={backdropStyle} onClick={close}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <h3 style={{ marginTop: 0, fontSize: "20px" }}>{title}</h3>
          <div style={{ margin: "20px 0", color: "#333" }}>{content}</div>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <button
              onClick={close}
              style={{
                padding: "8px 16px",
                border: "1px solid #ccc",
                background: "#fff",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Hủy
            </button>
            {onConfirm && (
              <button
                onClick={() => {
                  onConfirm();
                  close();
                }}
                style={{
                  padding: "8px 16px",
                  background: "#2196F3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Xác nhận
              </button>
            )}
          </div>
        </div>
      </div>,
    );
  },
};
