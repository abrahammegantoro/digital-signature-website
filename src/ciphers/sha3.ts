// Define the state as a 5x5 array of 32-bit integers
let state: number[][] = Array.from({ length: 5 }, () => Array(5).fill(0));

function ROT(x: number, y: number): number {
    return (x << y) | (x >>> (32 - y));
}

function XOR(a: number, b: number): number {
    return a ^ b;
}

function initialize() {
    state = Array.from({ length: 5 }, () => Array(5).fill(0));
}

function absorb(data: number[]) {
    for (let i = 0; i < data.length; i++) {
        const x = i % 5;
        const y = Math.floor(i / 5) % 5;
        state[x][y] = XOR(state[x][y], data[i]);
    }
}

function permute() {
    for (let i = 0; i < 24; i++) {
        let newState = Array.from({ length: 5 }, () => Array(5).fill(0));
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                newState[x][y] = ROT(state[x][y], (x + y) % 32);
            }
        }
        state = newState;
    }
}

function squeeze(): number[] {
    let output: number[] = [];
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            output.push(state[x][y]);
            if (output.length >= 8) return output;
        }
    }
    return output;
}

function pad(input: string): number[] {
    const data = Array.from(input).map(char => char.charCodeAt(0));
    data.push(1);
    while (data.length % 25 !== 0) {
        data.push(0);
    }
    return data;
}

export function keccakHash(input: string): string {
    initialize();
    const data = pad(input);
    absorb(data);
    permute();
    const hashed = squeeze();
    return hashed.map(n => n.toString(16).padStart(8, '0')).join('');
}

