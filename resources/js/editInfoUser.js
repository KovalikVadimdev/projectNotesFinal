"use strict"

export async function editInfo(email, fullname, nickname, gender, country) {
  const payload = {
    email: email,
    fullname: fullname,
    nickname: nickname,
    gender: gender,
    country: country
  };

  try {
    const response = await fetch('http://localhost:8000/api/user/update', {
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