// SHA3/KECCAK FOR HASHING

import pkg from 'js-sha3';
const { sha3_256, keccak_256 } = pkg;

export function keccakHash(message) {
    return keccak_256(message);
}

// EXAMPLE USAGE 
// console.log(keccakHash('apa kabar'));
