export function getDateLabel(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const d = date.toDateString();
  if (d === today.toDateString()) {
    return "TODAY";
  }
  if (d === yesterday.toDateString()) {
    return "YESTERDAY";
  }
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
export function formatDisplayDateTime(
  dateString: string | null
) {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
export function formatDisplayDate(
  dateString: string
) {
  return new Date(dateString).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}
export function formatDisplayTime(
  dateString: string
) {
  return new Date(dateString).toLocaleTimeString(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  );
}