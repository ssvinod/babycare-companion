import { generateICS } from "./icsGenerator.js";

export function exportMilestoneCalendar(child, milestones) {

    const events = milestones.map(item => ({

    id: item.id,

    title: `${item.age} Development Milestone`,

    descriptionLabel: "Milestones",

    milestones: item.milestones,

    dueDate: item.dueDate

    }));

    return generateICS(child, events);

}