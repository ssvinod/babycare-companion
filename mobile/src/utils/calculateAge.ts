export function calculateAge(
  birthDate: string
): string {
  const birth = new Date(birthDate);
  const today = new Date();

  let months =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    (today.getMonth() - birth.getMonth());

  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    days += 30;
  }

  return `${months} month${months !== 1 ? "s" : ""} ${days} day${days !== 1 ? "s" : ""}`;
}