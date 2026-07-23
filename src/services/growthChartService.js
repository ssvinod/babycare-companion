import fs from "fs";
function scale(value, min, max, height) {
    return height - ((value - min) / (max - min)) * height;
}
export function generateSvgChart({
    title,
    points,
    output
}) {
    const width = 800;
    const height = 400;
    const padding = 50;
    const values = points.map(p => p.value);
    const min = Math.min(...values) - 1;
    const max = Math.max(...values) + 1;
    const xStep =
        (width - padding * 2) /
        (points.length - 1 || 1);
    const coordinates = points.map((point, index) => {
        const x =
            padding + index * xStep;
        const y =
            scale(
                point.value,
                min,
                max,
                height - padding * 2
            ) + padding;
        return `${x},${y}`;
    }).join(" ");
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg"
width="${width}"
height="${height}">
<rect width="100%" height="100%" fill="white"/>
<text
x="${width / 2}"
y="30"
text-anchor="middle"
font-size="22"
font-family="Arial">
${title}
</text>
<polyline
fill="none"
stroke="#2563eb"
stroke-width="3"
points="${coordinates}" />
${points.map((point, index) => {
    const x =
        padding + index * xStep;
    const y =
        scale(
            point.value,
            min,
            max,
            height - padding * 2
        ) + padding;
    return `
<circle
cx="${x}"
cy="${y}"
r="5"
fill="#2563eb"/>
<text
x="${x}"
y="${height - 10}"
font-size="10"
text-anchor="middle">
${point.label}
</text>
`;
}).join("")}
</svg>
`;
    fs.mkdirSync("./output", {
        recursive: true
    });
    fs.writeFileSync(
        output,
        svg
    );
    return output;
}