/**
 * Gets the direction vector between 2 points.
 */
export function vector_direction(dest: number[], source: number[]) {
    let output: number[] = [];
    for(let i = 0; i < source.length; i++) {
        output[i] = dest[i] - source[i]
    }
    return output;
}

export function vector_divide(v: number[], amt: number) {
    let output: number[] = []
    for(let i = 0; i < v.length; i++) {
        output[i] = v[i] / amt;
    }

    return output;
}