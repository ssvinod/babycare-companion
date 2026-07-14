export class Vaccine {
  constructor(data) {
    this.name = data.name;
    this.ageDays = data.ageDays;
    this.reminders = data.reminders ?? [7, 3, 0];
    this.completed = false;
  }
}