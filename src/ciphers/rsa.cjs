const random = require("crypto-random-prime");

function generateRandomBigInt(bits) {
  const randomBits = Array.from({ length: bits }, () => Math.floor(Math.random() * 2)).join('');
  return BigInt(`0b${randomBits}`);
}

function selectExponent(phi) {
  const commonExponents = [3n, 5n, 17n, 257n];
  let e;
  do {
    e = commonExponents[Math.floor(Math.random() * commonExponents.length)];
  } while (gcd(e, phi) !== 1n);
  return e;
}

function gcd(a, b) {
  while (b !== 0n) {
    [a, b] = [b, a % b];
  }
  return a;
}

function modInverse(a, m) {
  [a, m] = [a % m, m];
  if (a < 0n) a = a + m;
  let [x, y] = [0n, 1n];
  while (a !== 0n) {
    [x, y] = [y, x - y * (m / a)];
    [a, m] = [m % a, a];
  }
  return x + (x < 0n ? m : 0n);
}

function generateKeys(bits) {
  const p = generateRandomBigInt(bits);
  const q = generateRandomBigInt(bits);
  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  const e = selectExponent(phi);
  const d = modInverse(e, phi);

  return {
    publicKey: [e, n],
    privateKey: d,
  };
}

module.exports = { generateKeys };
