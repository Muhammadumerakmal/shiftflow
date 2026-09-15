const STYLES = {
  draft: "bg-gray-100 text-gray-600",
  published: "bg-success-bg text-success",
  cancelled: "bg-danger-bg text-danger",
  open: "bg-warning-bg text-warning",
  accepted: "bg-warning-bg text-warning",
  manager_review: "bg-warning-bg text-warning",
  approved: "bg-success-bg text-success",
  rejected: "bg-danger-bg text-danger",
  pending: "bg-warning-bg text-warning",
  denied: "bg-danger-bg text-danger",
};

const LABELS = {
  manager_review: "Manager Review",
};

export default function StatusPill({ status }) {
  const style = STYLES[status] || "bg-gray-100 text-gray-600";
  const label = LABELS[status] || status?.charAt(0).toUpperCase() + status?.slice(1);
  return <span className={`status-pill ${style}`}>{label}</span>;
}
