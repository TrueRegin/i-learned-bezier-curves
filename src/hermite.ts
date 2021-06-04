import { Vector2D } from "./bezier";
import { vector_direction } from "./Vector";

export function hermiteCurve(p0: Vector2D, p1: Vector2D, T1: Vector2D, T2: Vector2D, t: number) {
    let output: Vector2D = [0, 0]
    for(let i = 0; i < p0.length; i++) {
        let v1 = p0[i] * (1 - 3 * Math.pow(t, 2) + 2 * Math.pow(t, 3));
        let v2 = p1[i] * Math.pow(t, 2) * (3 - 2 * t)
        let v3 = T1[i] * Math.pow(t-1, 2) * t;
        let v4 = T2[i] * (t-1) * Math.pow(t, 2);
        output[i] = v1 + v2 + v3 + v4;
    }

    return output;
}

export function hermiteDerivative(p0: Vector2D, p1: Vector2D, T1: Vector2D, T2: Vector2D, t: number) {
    let output: Vector2D = [0, 0]
    for(let i = 0; i < p0.length; i++) {
        let v1 = p0[i] * (-6*t + 6*Math.pow(t, 2));
        let v2 = p1[i] * (6*t - 6*Math.pow(t,2))
        let v3 = T1[i] * (1 - 4*t + 3*Math.pow(t, 2)); // is 1 at t = 0 && 0 at t = 1 ✅
        let v4 = T2[i] * (-2*t + 3*Math.pow(t, 2)); // is 0 at t = 0 && 1 at t =1 ✅
        output[i] = v1 + v2 + v3 + v4;
    }

    return output;
}

/**
 * A helper function that converts a list of vectors in 3D space into a list
 * of 2 end points + 2 tangent vectors for a hermite curve calculation.
 */
export function controlsToHermite(controlPoints: Vector2D[]) {
    return [
        controlPoints[0],
        controlPoints[3],
        vector_direction(controlPoints[1], controlPoints[0]) as Vector2D,
        vector_direction(controlPoints[3], controlPoints[2]) as Vector2D,
    ]
}