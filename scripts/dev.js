import { logger } from "../src/core/logger.js";
//import { Child } from "../src/models/child.js";
import { loadProfile } from "../src/services/profileService.js";
import { generateVaccinationPlan } from "../src/services/vaccinationService.js";
import { formatDate } from "../src/utils/dateUtils.js";

//const viha = new Child({
//
//    name: "Viha",
//
//    birthDate: "2026-06-22",
//
//    gender: "Female"
//
//});
const child = loadProfile();

logger.info(`Child : ${child.name}`);

const plan = generateVaccinationPlan(child);

for (const visit of plan) {

    logger.info("--------------------------------");

    logger.info(`Visit : ${visit.visit}`);

    logger.info(`Due : ${formatDate(visit.dueDate)}`);

    logger.info(`Vaccines :`);

    visit.vaccines.forEach(v =>

        logger.info(`   • ${v}`)

    );

}