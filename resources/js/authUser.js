"use strict"

import {handleUserLogin} from "./profileName.js";

export async function authUser(email, password) {
  const payload = {
    email: email,
    password: password
  };

  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Помилка: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Помилка додавання замітки:', error);
    throw error;
  }
}
