export type Vector2D = [number, number]

/**
 * We use the a 4 term formula to calculate the position of a point on some cubic bezier term given
 * the interpolation `i` we want between the two control points.
 */
export function cubicBezier(p0: Vector2D, p1: Vector2D, p2: Vector2D, p3: Vector2D, t: number) {
    const output: Vector2D = [0, 0];
    for(let i = 0; i < p0.length; i++) {
        // Splitting the four terms of the cubic bezier formula into seperate variables so you can read them better.
        const t1 = Math.pow(1 - t, 3) * p0[i];
        const t2 = 3 * Math.pow(1 - t, 2) * Math.pow(t, 1) * p1[i];
        const t3 = 3 * Math.pow(1 - t, 1) * Math.pow(t, 2) * p2[i];
        const t4 = Math.pow(1 - t, 0) * Math.pow(t, 3) * p3[i];
        const sum = t1 + t2 + t3 + t4;

        output[i] = sum;
    }

    return output;
}