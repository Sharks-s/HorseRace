import "../referee.css";

type StatusBadgeProps = {
  label: string;
  type?: "success" | "danger" | "warning" | "neutral";
};

export default function StatusBadge({
  label,
  type = "neutral",
}: StatusBadgeProps) {
  return (
    <span className={`status-badge status-${type}`}>
      {label}
    </span>
  );
}