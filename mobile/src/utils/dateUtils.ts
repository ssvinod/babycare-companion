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