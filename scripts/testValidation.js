import { validateMedication }
from "../src/validation/medicationValidator.js";
try {
    validateMedication({
        childId: "",
        name: ""
    });
}
catch(e) {
    console.log(
        e.message
    );
}