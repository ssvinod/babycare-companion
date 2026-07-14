import { logger } from "../src/core/logger.js";
import { Child } from "../src/models/child.js";
import { generateVaccinationPlan } from "../src/services/vaccinationService.js";
import { formatDate } from "../src/utils/dateUtils.js";

const viha = new Child({

    name: "Viha",

    birthDate: "2026-06-22",

    gender: "Female"

});

logger.info(`Child : ${viha.name}`);

const plan = generateVaccinationPlan(viha);

for (const visit of plan) {

    logger.info("--------------------------------");

    logger.info(`Visit : ${visit.visit}`);

    logger.info(`Due : ${formatDate(visit.dueDate)}`);

    logger.info(`Vaccines :`);

    visit.vaccines.forEach(v =>

        logger.info(`   • ${v}`)

    );

}