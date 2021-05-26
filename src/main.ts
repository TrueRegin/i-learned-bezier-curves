import { Vector2D, cubicBezier } from './bezier';
const canvas = document.querySelector('canvas#canvas') as HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
const controlPoints: [Vector2D, Vector2D, Vector2D, Vector2D] = [
    [20, window.innerHeight],
    [20, 20],
    [window.innerWidth - 20, 20],
    [window.innerWidth - 20, window.innerHeight],
];
const mousePos: [number, number] = [0, 0];
let transform: [number, number] = [0, 0];
let scale = 1;
let mousedown = false;

let selectedControl = -1;
const CIRCLE_RADIUS = 6;
const INTERACT_RADIUS = CIRCLE_RADIUS * 2.3;

// Main Function
(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    redrawFrame();

    /**
     * On window resize make sure the canvas always fits the screen
     */
    window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        redrawFrame();
    };

    /**
     * If you press the keys 1, 2, 3 or 4 the corresponding handle moves to your mouse position.
     */
    window.addEventListener('keydown', (event: KeyboardEvent) => {
        for (let i = 0; i < 4; i++) {
            if (event.key === (i + 1).toString()) {
                const transformedMousePos = screenToCanvasSpace(mousePos);
                for (let j = 0; j < 2; j++) {
                    controlPoints[i][j] = transformedMousePos[j];
                }
                redrawFrame();
            }
        }
    });

    /**
     * Zooms in your view whenever the escape key is pressed.
     * The complicated code is just to make it zoom in smoothly instead of abruptly
     *
     * ! That code is partially broken at the moment !
     */
    window.addEventListener('keydown', (event: KeyboardEvent) => {
        console.log(event.key);
        if (event.key == 'Escape') {
            // The number of iterations since the zoom start.
            const DUR = 1000;
            let t = 0;
            // [SCALE, X, Y]
            let start = [scale, ...transform];
            let dest = [1, 0, 0];

            // Loop until we have reached our destination.
            let prevTime = Date.now();
            let interval = setInterval(() => {
                const now = Date.now();
                const elapsed = now - prevTime;

                t += elapsed / DUR;
                if (t > 1) t = 1;
                // Easing value of t so the transition isn't linear.
                let tEasing = Math.pow(t, 1 / 3);

                console.log(start[0], dest[0]);
                scale = ease(start[0], dest[0], tEasing);
                transform[0] = ease(start[1], dest[1], tEasing);
                transform[1] = ease(start[2], dest[2], tEasing);
                redrawFrame();

                if (t == 1) {
                    clearInterval(interval);
                }
            }, 1000 / 60);

            function ease(dest: number, start: number, t: number) {
                return (t - 1) * dest + t * start;
            }
        }
    });

    /**
     * We want to zoom in on the canvas whenever we scroll towards the screen
     * and out when we scroll away from it.
     *
     * The negative before `event.deltaY` is because scrolling in is by default -100 which would zoom us in not out.
     */
    window.onwheel = (event: WheelEvent) => {
        console.log(event.deltaY, {});
        scale += -event.deltaY / 500;
        if (scale < 0.3) scale = 0.3;
        else if (scale > 5) scale = 5;
        redrawFrame();
    };

    /**
     * We want to pan the camera when the mouse is down and the mouse is moving.
     * We don't pan the camera when a handle is selected.
     */
    window.onmousemove = (event: MouseEvent) => {
        mousePos[0] = event.pageX;
        mousePos[1] = event.pageY;

        if (mousedown) {
            if (selectedControl === -1) {
                // ? If we are not selecting a handle pan the screen.
                transform[0] += -event.movementX;
                transform[1] += -event.movementY;

            } else {
                // ? If we are selecting a handle, move it to the mouse's position in canvas coordinates.
                let mouseCoords = screenToCanvasSpace([event.x, event.y]);
                controlPoints[selectedControl][0] = mouseCoords[0];
                controlPoints[selectedControl][1] = mouseCoords[1];
            }
        }
        redrawFrame();
    };

    window.onmousedown = (event: MouseEvent) => {
        let mouseCoords = screenToCanvasSpace([event.clientX, event.clientY]);
        for (let i = 3; i >= 0; i--) {
            let a = mouseCoords[0] - controlPoints[i][0];
            let b = mouseCoords[1] - controlPoints[i][1];
            let dist = Math.sqrt(a * a + b * b);

            if (dist < INTERACT_RADIUS) {
                selectedControl = i;
                break;
            }
        }

        mousedown = true;
    };
    window.onmouseup = () => {
        selectedControl = -1;
        mousedown = false;
    };
})();

/**
 * Redraws the bezier curve, bezier control point text, and background.
 */
function redrawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(0 - transform[0], -transform[1]);
    ctx.scale(scale, scale);

    ctx.font = '40px monospace, bold';

    for (let i = 0; i < 4; i += 2) {
        ctx.beginPath();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.moveTo(controlPoints[i][0], controlPoints[i][1]);
        ctx.lineTo(controlPoints[i + 1][0], controlPoints[i + 1][1]);
        ctx.stroke();
    }

    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 3;
    let x = controlPoints[0][0];
    let y = controlPoints[0][1];
    ctx.beginPath();
    ctx.moveTo(x, y);
    const LINE_SEGMENTS = 100;
    for (let i = 1; i < LINE_SEGMENTS + 1; i++) {
        const bezierPoint = cubicBezier(
            controlPoints[0],
            controlPoints[1],
            controlPoints[2],
            controlPoints[3],
            i / LINE_SEGMENTS
        );
        x = bezierPoint[0];
        y = bezierPoint[1];
        ctx.lineTo(x, y);
    }
    ctx.stroke();

    /**
     * We want to draw text on the control handles that is ALWAYS on the screen.
     * 
     * If we're inside a zone where we can drag a control handle, we want to place an opaque square behind the handle.
     */
     for (let i = 0; i < controlPoints.length; i++) {
        let textPosOnScreen = canvasToScreenSpace(controlPoints[i]);
        let x = controlPoints[i][0];
        let y = controlPoints[i][1];
        let sx = textPosOnScreen[0];
        let sy = textPosOnScreen[1];
        let tx = x + 30;
        let ty = y + 30;

        const text = (i + 1) + "";
        const textMetrics = ctx.measureText(text);
        const tWidth = textMetrics.width;
        const tHeight = textMetrics.emHeightAscent - textMetrics.emHeightDescent;

        // Buffer between the edge of the screen before text gets flopped.
        const BUFFER = 50;
        if (sx + tWidth + BUFFER > window.innerWidth) tx -= 70;
        if (sy + BUFFER > window.innerHeight) ty -= 60;

        /**
         * Filling in the handles interactable circle if we're hovering in it.
         */
        const mouseInCanvasCoords = screenToCanvasSpace(mousePos);
        // We're going backwards here because the handle in the last index of the array is
        // Rendered on top of the others (thus it should be interacted with first)
        for(let i = 3; i >= 0; i--) {
            if(distance(mouseInCanvasCoords, controlPoints[i]) <= INTERACT_RADIUS) {
                ctx.fillStyle = "#a3f6"
                ctx.beginPath();
                ctx.arc(x, y, INTERACT_RADIUS, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.fill();
                break;
            }
        }

        /**
         * Filling in the handle itself.
         */
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, y, CIRCLE_RADIUS, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#F30A0A';
        ctx.fillText(text.toString(), tx, ty);
    }

    ctx.resetTransform();
}

/**
 * Transforms a mouse from web window coordinates to the coordinates of our canvas so
 * we can use them to transform the bezier controls fluidly.
 * 
 * As a note, this could easily be transformed into a matrix format, just something I was thinking about.
 */
function screenToCanvasSpace(pos: Vector2D): Vector2D {
    let temp: Vector2D = [...pos];
    for (let i = 0; i < pos.length; i++) {
        temp[i] += transform[i];
        temp[i] *= 1 / scale;
    }

    return temp;
}

/**
 * Inverts the function `screenToCanvasSpace` above so we can make
 * sure the text for the handles doesn't appear offscreen.
 */
function canvasToScreenSpace(pos: Vector2D): Vector2D {
    let temp: Vector2D = [...pos];
    for (let i = 0; i < pos.length; i++) {
        temp[i] -= transform[i];
        temp[i] *= scale;
    }

    return temp;
}

function distance(pos1: Vector2D, pos2: Vector2D) {
    const a = pos1[0] - pos2[0];
    const b = pos1[1] - pos2[1];
    return Math.sqrt(a*a + b*b);
}