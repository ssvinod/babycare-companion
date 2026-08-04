import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';
export interface LineChartPoint {
    label: string;
    value: number;
}
interface Props {
    points: LineChartPoint[];
    unit: string;
    height?: number;
}
const CHART_WIDTH = 300;
const PADDING_LEFT = 38;
const PADDING_RIGHT = 14;
const PADDING_TOP = 18;
const PADDING_BOTTOM = 34;
function roundedValue(value: number): string {
    if (Number.isInteger(value)) {
        return String(value);
    }
    return value.toFixed(1);
}
export default function LineChart({ points, unit, height = 180 }: Props) {
    const chart = useMemo(() => {
        if (points.length === 0) {
            return null;
        }
        const values = points.map((point) => point.value);
        const minimum = Math.min(...values);
        const maximum = Math.max(...values);
        const spread = maximum - minimum;
        const padding = spread === 0 ? Math.max(maximum * 0.08, 1) : spread * 0.18;
        const yMinimum = minimum - padding;
        const yMaximum = maximum + padding;
        const drawableWidth = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
        const drawableHeight = height - PADDING_TOP - PADDING_BOTTOM;
        const xStep = points.length <= 1 ? 0 : drawableWidth / (points.length - 1);
        const coordinates = points.map((point, index) => {
            const x = PADDING_LEFT + index * xStep;
            const normalized =
                yMaximum === yMinimum
                    ? 0.5
                    : (point.value - yMinimum) / (yMaximum - yMinimum);
            const y = PADDING_TOP + drawableHeight * (1 - normalized);
            return {
                ...point,
                x,
                y,
            };
        });
        return {
            coordinates,
            yMinimum,
            yMaximum,
            drawableHeight,
        };
    }, [points, height]);
    if (!chart) {
        return (
            <View
                style={[
                    styles.empty,
                    {
                        height,
                    },
                ]}
            >
                <Text style={styles.emptyText}>
                    Add at least one record to view this chart.
                </Text>
            </View>
        );
    }
    const polylinePoints = chart.coordinates
        .map((point) => `${point.x},${point.y}`)
        .join(' ');
    const midValue = (chart.yMinimum + chart.yMaximum) / 2;
    return (
        <View style={styles.container}>
            <Svg width="100%" height={height} viewBox={`0 0 ${CHART_WIDTH} ${height}`}>
                {[0, 0.5, 1].map((ratio) => {
                    const y = PADDING_TOP + chart.drawableHeight * ratio;
                    const value =
                        chart.yMaximum - (chart.yMaximum - chart.yMinimum) * ratio;
                    return (
                        <React.Fragment key={ratio}>
                            <Line
                                x1={PADDING_LEFT}
                                y1={y}
                                x2={CHART_WIDTH - PADDING_RIGHT}
                                y2={y}
                                stroke="#E5E7EB"
                                strokeWidth={1}
                            />
                            <SvgText
                                x={PADDING_LEFT - 7}
                                y={y + 4}
                                fontSize="10"
                                textAnchor="end"
                                fill="#9CA3AF"
                            >
                                {roundedValue(value)}
                            </SvgText>
                        </React.Fragment>
                    );
                })}
                {chart.coordinates.length > 1 ? (
                    <Polyline
                        points={polylinePoints}
                        fill="none"
                        stroke="#4F46E5"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                ) : null}
                {chart.coordinates.map((point, index) => (
                    <React.Fragment key={`${point.label}-${index}`}>
                        <Circle
                            cx={point.x}
                            cy={point.y}
                            r={5}
                            fill="#FFFFFF"
                            stroke="#4F46E5"
                            strokeWidth={3}
                        />
                        {(index === 0 || index === chart.coordinates.length - 1) && (
                            <SvgText
                                x={point.x}
                                y={height - 10}
                                fontSize="10"
                                textAnchor={index === 0 ? 'start' : 'end'}
                                fill="#6B7280"
                            >
                                {point.label}
                            </SvgText>
                        )}
                    </React.Fragment>
                ))}
                <SvgText
                    x={CHART_WIDTH - PADDING_RIGHT}
                    y={14}
                    fontSize="10"
                    textAnchor="end"
                    fill="#9CA3AF"
                >
                    {unit}
                </SvgText>
                <SvgText
                    x={PADDING_LEFT - 7}
                    y={PADDING_TOP + chart.drawableHeight / 2 + 4}
                    fontSize="10"
                    textAnchor="end"
                    fill="#9CA3AF"
                >
                    {roundedValue(midValue)}
                </SvgText>
            </Svg>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 20,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 13,
        lineHeight: 19,
        color: '#9CA3AF',
    },
});
