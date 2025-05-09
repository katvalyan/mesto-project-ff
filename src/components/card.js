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
    likeCardCallback(cardElement, cardData);
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
export function likeCardHandler(cardElement, cardData) {
  const likeButton = cardElement.querySelector(".card__like-button"); //кнопка лайка
  const isLiked = likeButton.classList.contains("card__like-button_is-active"); //проверка состояния лайка

  //отправка запроса на сервер
  toggleCardLike(cardData._id, isLiked)
    .then((updatedCard) => {
      //обновляем состояние лайка
      likeButton.classList.toggle("card__like-button_is-active");
      //обновляем количество лайков
      const likesCountElement = cardElement.querySelector(".card__like-count");
      if (likesCountElement) {
        likesCountElement.textContent = updatedCard.likes.length;
      }
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
