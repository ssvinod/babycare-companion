import { Vaccination } from "../models/Vaccination";
export function generateVaccinationSchedule(
  dob: string
): Vaccination[] {
  const birth = new Date(dob);
  function addDays(days: number) {
    const d = new Date(birth);
    d.setDate(d.getDate() + days);
    return d.toISOString();
  }
  function addMonths(months: number) {
    const d = new Date(birth);
    d.setMonth(d.getMonth() + months);
    return d.toISOString();
  }
  function addYears(years: number) {
    const d = new Date(birth);
    d.setFullYear(d.getFullYear() + years);
    return d.toISOString();
  }
  return [
    {
      vaccine: "BCG + OPV-0 + Hepatitis B",
      dueDate: addDays(0),
      completed: false,
    },
    {
      vaccine: "6 Weeks",
      dueDate: addDays(42),
      completed: false,
    },
    {
      vaccine: "10 Weeks",
      dueDate: addDays(70),
      completed: false,
    },
    {
      vaccine: "14 Weeks",
      dueDate: addDays(98),
      completed: false,
    },
    {
      vaccine: "6 Months",
      dueDate: addMonths(6),
      completed: false,
    },
    {
      vaccine: "9 Months",
      dueDate: addMonths(9),
      completed: false,
    },
    {
      vaccine: "12 Months",
      dueDate: addMonths(12),
      completed: false,
    },
    {
      vaccine: "15 Months",
      dueDate: addMonths(15),
      completed: false,
    },
    {
      vaccine: "18 Months",
      dueDate: addMonths(18),
      completed: false,
    },
    {
      vaccine: "5 Years",
      dueDate: addYears(5),
      completed: false,
    },
    {
      vaccine: "10 Years",
      dueDate: addYears(10),
      completed: false,
    },
    {
      vaccine: "16 Years",
      dueDate: addYears(16),
      completed: false,
    },
  ];
}