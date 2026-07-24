import { shortDate } from "../src/utils/dateFormatter.js";
import { generateSvgChart }
from "../src/services/growthChartService.js";
generateSvgChart({
    title: "Weight Growth",
    output: "./output/weight-chart.svg",
    points: [
        {
            label: "Birth",
            value: 3.1
        },
        {
            label: "6 Weeks",
            value: 4.4
        },
        {
            label: "10 Weeks",
            value: 5.2
        },
        {
            label: "14 Weeks",
            value: 6.1
        }
    ]
});
console.log("Weight SVG generated.");