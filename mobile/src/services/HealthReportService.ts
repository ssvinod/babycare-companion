import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { db } from '../database/database';
type RowValue = string | number | null;
type DatabaseRow = Record<string, RowValue>;
function readTable(tableName: string, orderBy = ''): DatabaseRow[] {
    return db.getAllSync<DatabaseRow>(
        `
        SELECT *
        FROM ${tableName}
        ${orderBy};
        `
    );
}
function escapeHtml(value: unknown): string {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
function displayDate(value: RowValue): string {
    if (typeof value !== 'string' || !value) {
        return '—';
    }
    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (dateOnly) {
        return [dateOnly[3], dateOnly[2], dateOnly[1]].join('-');
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}
function yesNo(value: RowValue): string {
    return Number(value) === 1 ? 'Yes' : 'No';
}
function tableHtml(headers: string[], rows: string[][]): string {
    if (rows.length === 0) {
        return `
            <p class="empty">
                No records available.
            </p>
        `;
    }
    return `
        <table>
            <thead>
                <tr>
                    ${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${rows
                    .map(
                        (row) => `
                            <tr>
                                ${row
                                    .map((cell) => `<td>${escapeHtml(cell)}</td>`)
                                    .join('')}
                            </tr>
                        `
                    )
                    .join('')}
            </tbody>
        </table>
    `;
}
function reportFileName(babyName: string): string {
    const safeName =
        babyName
            .trim()
            .replace(/[^a-zA-Z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .toLowerCase() || 'baby';
    const date = new Date().toISOString().slice(0, 10);
    return `niva-health-report-` + `${safeName}-${date}.pdf`;
}
export interface HealthReportResult {
    fileName: string;
    fileUri: string;
}
export async function exportHealthReport(): Promise<HealthReportResult> {
    const profile = db.getFirstSync<DatabaseRow>(`
            SELECT *
            FROM profile
            LIMIT 1;
        `);
    if (!profile) {
        throw new Error('NO_PROFILE');
    }
    const growth = readTable('growth', 'ORDER BY date DESC');
    const vaccinations = readTable('vaccination', 'ORDER BY dueDate ASC');
    const medications = readTable('medication', 'ORDER BY completed ASC, id DESC');
    const feedings = readTable('feeding', 'ORDER BY time DESC LIMIT 25');
    const sleep = readTable('sleep', 'ORDER BY startTime DESC LIMIT 25');
    const generatedAt = new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
    const babyName = typeof profile.name === 'string' ? profile.name : 'Baby';
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <style>
        @page {
            margin: 28px;
        }
        body {
            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Arial,
                sans-serif;
            color: #1F2937;
            font-size: 11px;
            line-height: 1.45;
        }
        h1 {
            margin: 0;
            color: #047857;
            font-size: 25px;
        }
        h2 {
            margin-top: 24px;
            margin-bottom: 9px;
            border-bottom: 2px solid #D1FAE5;
            padding-bottom: 5px;
            color: #065F46;
            font-size: 16px;
        }
        .subtitle {
            margin-top: 4px;
            color: #6B7280;
            font-size: 12px;
        }
        .profile {
            margin-top: 18px;
            border: 1px solid #D1FAE5;
            border-radius: 10px;
            background: #ECFDF5;
            padding: 14px;
        }
        .profile-grid {
            display: grid;
            grid-template-columns:
                1fr 1fr;
            gap: 8px 18px;
        }
        .label {
            color: #6B7280;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .value {
            margin-top: 2px;
            color: #111827;
            font-size: 12px;
            font-weight: 700;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
        }
        tr {
            page-break-inside: avoid;
        }
        th {
            background: #F3F4F6;
            color: #374151;
            font-size: 10px;
            text-align: left;
        }
        th,
        td {
            border: 1px solid #E5E7EB;
            padding: 6px;
            vertical-align: top;
        }
        td {
            color: #4B5563;
        }
        .empty {
            border-radius: 8px;
            background: #F9FAFB;
            padding: 10px;
            color: #9CA3AF;
        }
        .footer {
            margin-top: 28px;
            border-top: 1px solid #E5E7EB;
            padding-top: 10px;
            color: #9CA3AF;
            font-size: 9px;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>Niva Health Report</h1>
    <div class="subtitle">
        Growing Healthy. Together.
        <br />
        Generated ${escapeHtml(generatedAt)}
    </div>
    <div class="profile">
        <div class="profile-grid">
            <div>
                <div class="label">
                    Baby Name
                </div>
                <div class="value">
                    ${escapeHtml(babyName)}
                </div>
            </div>
            <div>
                <div class="label">
                    Date of Birth
                </div>
                <div class="value">
                    ${escapeHtml(displayDate(profile.birthDate))}
                </div>
            </div>
            <div>
                <div class="label">
                    Gender
                </div>
                <div class="value">
                    ${escapeHtml(profile.gender)}
                </div>
            </div>
            <div>
                <div class="label">
                    Blood Group
                </div>
                <div class="value">
                    ${escapeHtml(profile.bloodGroup ?? 'Not added')}
                </div>
            </div>
        </div>
    </div>
    <h2>Growth History</h2>
    ${tableHtml(
        ['Date', 'Weight', 'Height', 'Head', 'Notes'],
        growth.map((row) => [
            displayDate(row.date),
            row.weight !== null ? `${row.weight} kg` : '—',
            row.height !== null ? `${row.height} cm` : '—',
            row.headCircumference !== null ? `${row.headCircumference} cm` : '—',
            String(row.notes ?? '—'),
        ])
    )}
    <h2>Vaccinations</h2>
    ${tableHtml(
        ['Vaccine', 'Due Date', 'Completed', 'Completed Date'],
        vaccinations.map((row) => [
            String(row.vaccine ?? '—'),
            displayDate(row.dueDate),
            yesNo(row.completed),
            displayDate(row.completedDate),
        ])
    )}
    <h2>Medications</h2>
    ${tableHtml(
        ['Medicine', 'Dosage', 'Frequency', 'Start', 'End', 'Completed'],
        medications.map((row) => [
            String(row.medicine ?? '—'),
            [row.dosage, row.unit].filter(Boolean).join(' ') || '—',
            String(row.frequency ?? '—'),
            displayDate(row.startDate),
            displayDate(row.endDate),
            yesNo(row.completed),
        ])
    )}
    <h2>Recent Feeding Records</h2>
    ${tableHtml(
        ['Time', 'Type', 'Quantity', 'Notes'],
        feedings.map((row) => [
            displayDate(row.time),
            String(row.type ?? '—'),
            row.quantity !== null ? String(row.quantity) : '—',
            String(row.notes ?? '—'),
        ])
    )}
    <h2>Recent Sleep Records</h2>
    ${tableHtml(
        ['Start', 'End', 'Duration'],
        sleep.map((row) => [
            displayDate(row.startTime),
            displayDate(row.endTime),
            row.durationMinutes !== null ? `${row.durationMinutes} min` : '—',
        ])
    )}
    <div class="footer">
        This report is generated from
        records entered in Niva and is
        not a substitute for medical
        advice.
    </div>
</body>
</html>
`;
    const result = await Print.printToFileAsync({
        html,
    });
    const sharingAvailable = await Sharing.isAvailableAsync();
    if (!sharingAvailable) {
        throw new Error('SHARING_UNAVAILABLE');
    }
    const fileName = reportFileName(babyName);
    await Sharing.shareAsync(result.uri, {
        dialogTitle: 'Share Niva Health Report',
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
    });
    return {
        fileName,
        fileUri: result.uri,
    };
}
