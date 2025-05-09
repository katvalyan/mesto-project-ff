//импорт библиотеки для выполнения HTTP-запросов
import fetch from 'node-fetch';

//конфигурация API
const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-37',//адрес API сервера
  headers: {
    authorization: 'a2ba6c4f-ddb5-42a5-b9a4-745a013fc9b2',//персональный токен
    'Content-Type': 'application/json'
  }
}

//проверяем ответ от сервера
function checkResponse(res) {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
}

//получаем данные профиля (GET-запрос)
export const getProfile = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  })
  .then(checkResponse)
}

//получаем данные карточки (GET-запрос)
export const getCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
  .then(checkResponse)
}

//обновляем профиль (PATCH-запрос)
export const updateProfile = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',//тип запроса
    headers: config.headers, //заголовки берем из конфига
    body: JSON.stringify({name: name, about: about})//преобразуем объект в JSON-строку
  })
  .then(checkResponse)//отдаем на обработку функции
}

//добавляем новые карточки (POST-запрос)
export const addNewCard = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({name: name, link: link})
  })
  .then(checkResponse)
}

//удаляем карточки (DELETE-запрос)
export const deleteRequestCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  }).then(checkResponse)
}

//удаление/добавление лайков (DELETE/PUT-запросы)
export const toggleCardLike = (cardId, isLiked) => {
  return fetch(`${config.baseUrl}/cards/${cardId}/likes`, {
    method: isLiked ? 'DELETE' : 'PUT', //true - удаляем лайк, false -  добавляем
    headers: config.headers
  }).then(checkResponse)
}

//обновляем автарку (PATCH-запрос)
export const updateAvatar = (avatarUrl) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({avatar: avatarUrl})
  }).then(checkResponse)
}