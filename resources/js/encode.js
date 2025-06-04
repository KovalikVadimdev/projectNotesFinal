// crypto-js - хешування
// SJCL - шифрування від Стендфорда

"use strict";
import SHA256 from 'crypto-js/sha256';
import sjcl from 'sjcl';


export function hashTextSHA256(text) {
  if (typeof text !== "string") {
    throw new Error("Вхідні дані повинні бути рядком (String).");
  }

  const sha256Hash = SHA256(text);
  return sha256Hash.toString();
}


export function encryptString(plaintext, password) {
  if (typeof plaintext !== 'string' || typeof password !== 'string') {
    throw new Error("Plaintext and password must be strings.");
  }

  try {
    const encryptedObject = sjcl.encrypt(password, plaintext);
    return encryptedObject;
  } catch (e) {
    console.error("Помилка шифрування SJCL:", e);
    throw e;
  }
}

export function decryptString(encryptedData, password) {
  if (typeof password !== 'string') {
    throw new Error("Password must be a string.");
  }

  if (typeof encryptedData !== 'string' && typeof encryptedData !== 'object') {
    throw new Error("Encrypted data must be a string or an object.");
  }

  try {
    const decryptedPlaintext = sjcl.decrypt(password, encryptedData);
    return decryptedPlaintext;
  } catch (e) {
    console.error("Помилка дешифрування SJCL:", e);
    throw new Error("Не вдалося дешифрувати дані. Перевірте пароль або цілісність даних.");
  }
}