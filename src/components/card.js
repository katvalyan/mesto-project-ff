import { deleteRequestCard, toggleCardLike } from "./api.js";

// Функция создания карточки
export function createCard(
  cardData,
  deleteCallback,
  likeCardCallback,
  imageCallback,
  profileId
) {

  const cardElement = getCardTemplate();//шаблон карточки 

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likesCountElement = cardElement.querySelector(".card__like-count");

  //проверка элементов карточки
  if (!cardImage || !cardTitle || !deleteButton || !likeButton || !likesCountElement) {
    console.error('Не найдены обязательные элементы карточки');
    return null;
  }

//заполнение карточки данными
  cardImage.src = cardData.link;
  cardImage.alt = cardData.alt || cardData.name; // Используем alt если он есть, иначе name
  cardTitle.textContent = cardData.name;

  //устанавливаем начальное кол-во лайков
  likesCountElement.textContent = cardData.likes.length;

  //проверяем, есть ли лайк текущего пользователя
  const isLikedByMe = cardData.likes.some(like => like._id === profileId);
  if (isLikedByMe) {
    likeButton.classList.add("card__like-button_is-active");
  }

  //кнопка удаления карточки
  if (cardData.owner._id !== profileId) {
    deleteButton.style.display = "none";
  } else {
    deleteButton.addEventListener("click", () => {
      deleteCallback(cardElement, cardData._id);
    });
  }

  //Обоработчик лайка
  likeButton.addEventListener("click", () => {
    likeCardCallback(cardElement, cardData, likeButton, likesCountElement);
  });

  // Обоработчик клика по изображению
  cardImage.addEventListener("click", () => imageCallback(cardData));

  return cardElement;
}

// функция удаления карточки
export function deleteCard(cardElement, cardId) {
  deleteRequestCard(cardId)
    .then(() => {
      cardElement.remove(); //удаляем карточку
    })
    .catch((error) => {
      console.log("Ошибка ui при удалении карточки:", error); //вывод ошибки
    });
}

//обработчик лайка
export function likeCardHandler(cardElement, cardData, likeButton, likesCountElement) {
  const isLiked = likeButton.classList.contains("card__like-button_is-active"); //проверка состояния лайка

  //отправка запроса на сервер
  toggleCardLike(cardData._id, isLiked)
    .then((updatedCard) => {
      //обновляем состояние лайка
      likeButton.classList.toggle("card__like-button_is-active"); //визуал
      likesCountElement.textContent = updatedCard.likes.length; //счетчик
    })
    .catch((error) => {
      console.error("Ошибка ui при изменении лайка:", error); //вывод ошибки
    });
}

// функция клонирования карточки из HTML
function getCardTemplate() {
  const cardTemplate = document.querySelector("#card-template").content; //находим шаблон
  return cardTemplate.querySelector(".card").cloneNode(true); //возвращаем копию
}
