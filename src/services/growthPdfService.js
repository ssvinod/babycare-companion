import fs from "fs";
import PDFDocument from "pdfkit";
export function generateGrowthPdf(summary) {
    fs.mkdirSync("./output", {
        recursive: true
    });
    const doc = new PDFDocument({
        margin: 50
    });
    doc.pipe(
        fs.createWriteStream(
            "./output/growth-report.pdf"
        )
    );
    doc
        .fontSize(22)
        .text(
            "BabyCare Companion",
            {
                align: "center"
            }
        );
    doc.moveDown();
    doc
        .fontSize(18)
        .text("Growth Report");
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Child : ${summary.child}`);
    doc.text(
        `Last Measurement : ${summary.lastMeasurement}`
    );
    doc.text(
        `Weight : ${summary.weight} kg`
    );
    doc.text(
        `Weight Percentile : ${summary.weightPercentile}`
    );
    doc.text(
        `Weight Status : ${summary.weightStatus}`
    );
    doc.text(
        `Trend : ${summary.trend}`
    );
    doc.text(
        `Alerts : ${summary.alertCount}`
    );
    if (summary.alerts?.length) {
        doc.moveDown();
        doc
            .fontSize(16)
            .text("Alerts");
        summary.alerts.forEach(alert => {
            doc.text(`• ${alert.message}`);
        });
    }
    if (summary.vaccinations?.length) {
        doc.moveDown();
        doc
            .fontSize(18)
            .text("Vaccinations");
        doc.moveDown();
        summary.vaccinations.forEach(v => {
            doc.fontSize(12).text(
                `${v.visit} : ${v.completed ? "Completed" : "Pending"}`
            );
        });
    }
    if (summary.milestones?.length) {
        doc.moveDown();
        doc
            .fontSize(18)
            .text("Development Milestones");
        doc.moveDown();
        summary.milestones.forEach(m => {
            doc
                .fontSize(12)
                .text(`${m.age}`);
        });
    }
    if (summary.appointments?.length) {
        doc.moveDown();
        doc
            .fontSize(18)
            .text("Doctor Visits");
        doc.moveDown();
        summary.appointments.forEach(a => {
            doc
                .fontSize(12)
                .text(`${a.date} : ${a.title}`);
        });
    }
    if (summary.timeline?.length) {
        doc.moveDown();
        doc
            .fontSize(18)
            .text("Timeline");
        doc.moveDown();
        summary.timeline.forEach(item => {
            doc
                .fontSize(12)
                .text(`${item.date} : ${item.title}`);
        });
    }
    doc.end();
}