import { shortDate } from "../src/utils/dateFormatter.js";
import { Child } from "../src/models/child.js";
import { generateMilestonePlan } from "../src/services/milestoneService.js";
import { formatDate } from "../src/utils/dateUtils.js";

const child = new Child({

    name: "Viha",
    birthDate: "2026-06-22"

});

const milestones = generateMilestonePlan(child);

for (const item of milestones) {

    console.log("--------------------------------");

    console.log(item.age);

    console.log(formatDate(item.dueDate));

    for (const milestone of item.milestones) {

        console.log("•", milestone);

    }

}