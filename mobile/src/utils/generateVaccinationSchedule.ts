import { Vaccination } from "../models/Vaccination";
export function generateVaccinationSchedule(
  dob: string
): Vaccination[] {
  const birth = new Date(dob);
  function addDays(days: number) {
    const date = new Date(birth);
    date.setDate(
      date.getDate() + days
    );
    return date.toISOString();
  }
  function addMonths(months: number) {
    const date = new Date(birth);
    date.setMonth(
      date.getMonth() + months
    );
    return date.toISOString();
  }
  function addYears(years: number) {
    const date = new Date(birth);
    date.setFullYear(
      date.getFullYear() + years
    );
    return date.toISOString();
  }
  return [
    {
      vaccine:
        "BCG + OPV-0 + Hepatitis B",
      dueDate: addDays(0),
      completed: 0,
    },
    {
      vaccine: "6 Weeks",
      dueDate: addDays(42),
      completed: 0,
    },
    {
      vaccine: "10 Weeks",
      dueDate: addDays(70),
      completed: 0,
    },
    {
      vaccine: "14 Weeks",
      dueDate: addDays(98),
      completed: 0,
    },
    {
      vaccine: "6 Months",
      dueDate: addMonths(6),
      completed: 0,
    },
    {
      vaccine: "9 Months",
      dueDate: addMonths(9),
      completed: 0,
    },
    {
      vaccine: "12 Months",
      dueDate: addMonths(12),
      completed: 0,
    },
    {
      vaccine: "15 Months",
      dueDate: addMonths(15),
      completed: 0,
    },
    {
      vaccine: "18 Months",
      dueDate: addMonths(18),
      completed: 0,
    },
    {
      vaccine: "5 Years",
      dueDate: addYears(5),
      completed: 0,
    },
    {
      vaccine: "10 Years",
      dueDate: addYears(10),
      completed: 0,
    },
    {
      vaccine: "16 Years",
      dueDate: addYears(16),
      completed: 0,
    },
  ];
}