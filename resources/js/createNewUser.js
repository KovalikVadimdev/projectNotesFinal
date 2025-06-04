"use strict"

export async function createUser(email, password, nickname) {
  const payload = {
    email: email,
    password: password,
    nickname: nickname
  };

  try {
    const response = await fetch('http://localhost:8000/api/register', {
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