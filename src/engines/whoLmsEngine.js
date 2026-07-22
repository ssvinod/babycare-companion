export function calculateZScore(
    measurement,
    L,
    M,
    S
) {

    if (L === 0) {
        return Math.log(
            measurement / M
        ) / S;
    }

    return (
        Math.pow(
            measurement / M,
            L
        ) - 1
    ) / (L * S);

}

export function calculatePercentile(z) {

    const t =
        1 /
        (
            1 +
            0.2316419 *
            Math.abs(z)
        );

    const d =
        0.3989423 *
        Math.exp(
            -z * z / 2
        );

    let p =
        d *
        t *
        (
            0.3193815 +
            t *
            (
                -0.3565638 +
                t *
                (
                    1.781478 +
                    t *
                    (
                        -1.821256 +
                        t *
                        1.330274
                    )
                )
            )
        );

    if (z > 0)
        p = 1 - p;

    return p * 100;

}