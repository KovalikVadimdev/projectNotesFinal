// crypto-js - хешування
// SJCL - шифрування від Стендфорда


"use strict"

import CryptoJS from 'crypto-js';

function hashTextSHA256(text) {
  if (typeof text !== "string") {
    throw new Error("Вхідні дані повинні бути рядком (String).");
  }

  // ПІСЛЯ ПЕРШОГО РАЗУ ШИФРУВАННЯ ПРИБРАТИ
  const sha256Hash = CryptoJS.SHA256(text);
  return sha256Hash.toString(CryptoJS.enc.Hex);
}

console.log(hashTextSHA256("Hello world"));
console.log(hashTextSHA256("Hello world"));