import { useEffect, useState } from "react";

export function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleLoading = (event) => {
      setIsLoading(Boolean(event.detail));
    };

    window.addEventListener("global-loading", handleLoading);
    return () => {
      window.removeEventListener("global-loading", handleLoading);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(255, 255, 255, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: "4px solid #e5e7eb",
          borderTop: "4px solid #2563eb",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
    </div>
  );
}
