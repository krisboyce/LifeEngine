
export const up = 0;
export const right = 1;
export const down = 2;
export const left = 3;
export const scalars = [[0, -1], [1, 0], [0, 1], [-1, 0]];

export function getRandomDirection() {
    return Math.floor(Math.random() * 4);
}

export function getRandomScalar() {
    return scalars[Math.floor(Math.random() * scalars.length)];
}

export function getOppositeDirection(dir) {
    switch (dir) {
        case up:
            return down;
        case down:
            return up;
        case left:
            return right;
        case right:
            return left;
    }
}

export function rotateRight(dir) {
    dir++;
    if (dir > 3) {
        dir = 0;
    }
    return dir;
}
