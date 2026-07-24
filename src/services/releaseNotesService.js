import { getProjectInfo } from "./projectInfoService.js";

export function generateReleaseNotes() {
    const info = getProjectInfo();
    const lines = [];
    lines.push(`# ${info.name}`);
    lines.push("");
    lines.push(`Version: ${info.version}`);
    lines.push(`Codename: ${info.codename}`);
    lines.push(`Regression Target: ${info.regressionTarget}/62 PASS`);
    lines.push("");
    lines.push("## Features");
    lines.push("");
    info.features.forEach(feature => {
        lines.push(`- ${feature}`);
    });
    lines.push("");
    lines.push("Generated automatically.");
    return lines.join("\n");
}