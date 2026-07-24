import { PROJECT_MANIFEST } from "../config/projectManifest.js";

export function getProjectInfo() {
    return {
        ...PROJECT_MANIFEST,
        featureCount:
            PROJECT_MANIFEST.features.length
    };
}