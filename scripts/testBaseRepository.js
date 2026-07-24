import { SleepRepository } from "../src/repositories/sleepRepository.js";
const repo = new SleepRepository();
console.log(
    "Repository Loaded"
);
console.log(
    repo.findAll().length >= 0
);