export function getWeightStatus(percentile) {

    switch (percentile) {

        case "<3rd":
            return "Underweight";

        case "3rd-15th":
            return "Below Average";

        case "15th-50th":
            return "Normal";

        case "50th-85th":
            return "Above Average";

        case "85th-97th":
            return "High";

        case ">97th":
            return "Very High";

        default:
            return "Unknown";

    }

}