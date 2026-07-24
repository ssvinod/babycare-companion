import { getDashboard } from "../src/services/dashboardService.js";

const dashboard = getDashboard();

console.dir(dashboard, {
    depth: null
});