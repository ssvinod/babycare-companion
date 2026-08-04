import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
interface Props {
    /**
     * Date stored by the application
     * in YYYY-MM-DD format.
     */
    value: string;
    /**
     * Returns a valid date in
     * YYYY-MM-DD format.
     */
    onChange: (value: string) => void;
}
function isoToDisplay(isoDate: string): string {
    const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) {
        return isoDate;
    }
    const [, year, month, day] = match;
    return `${day}-${month}-${year}`;
}
function displayToIso(displayDate: string): string | null {
    const match = displayDate.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!match) {
        return null;
    }
    const [, dayText, monthText, yearText] = match;
    const day = Number(dayText);
    const month = Number(monthText);
    const year = Number(yearText);
    const date = new Date(year, month - 1, day);
    const isValid =
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;
    if (!isValid) {
        return null;
    }
    return `${yearText}-${monthText}-${dayText}`;
}
function formatTypedDate(text: string): string {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) {
        return digits;
    }
    if (digits.length <= 4) {
        return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    }
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
}
export default function DateInput({ value, onChange }: Props) {
    const [displayValue, setDisplayValue] = useState(() => isoToDisplay(value));
    useEffect(() => {
        setDisplayValue(isoToDisplay(value));
    }, [value]);
    function handleChange(text: string) {
        const formatted = formatTypedDate(text);
        setDisplayValue(formatted);
        const isoDate = displayToIso(formatted);
        if (isoDate) {
            onChange(isoDate);
        }
    }
    function handleBlur() {
        if (displayValue.trim() === '') {
            onChange('');
            return;
        }

        const isoDate = displayToIso(displayValue);

        if (!isoDate) {
            setDisplayValue(isoToDisplay(value));
        }
    }
    return (
        <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="DD-MM-YYYY"
            value={displayValue}
            onChangeText={handleChange}
            onBlur={handleBlur}
            maxLength={10}
            selectTextOnFocus={false}
        />
    );
}
const styles = StyleSheet.create({
    input: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 16,
        marginBottom: 18,
        fontSize: 18,
        color: '#111827',
    },
});
