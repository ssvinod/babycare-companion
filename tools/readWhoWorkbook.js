import xlsx from "xlsx";

export function readWorkbook(filePath) {

    const workbook = xlsx.readFile(filePath);

    const sheet = workbook.Sheets[
        workbook.SheetNames[0]
    ];

    return xlsx.utils.sheet_to_json(
        sheet,
        {
            defval: null
        }
    );
}