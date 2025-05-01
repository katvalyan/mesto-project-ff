// Функция создания карточки
export function createCard(
  cardData,
  deleteCallback,
  likeCardCallback,
  imageCallback
) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  // Заполнение карточки данными
  cardImage.src = cardData.link;
  cardImage.alt = cardData.alt || cardData.name; // Используем alt если он есть, иначе name
  cardTitle.textContent = cardData.name;

  // Обработчик удаления карточки
  deleteButton.addEventListener("click", function () {
    deleteCallback(cardElement);
  });

  //Обоработчик лайка
  likeButton.addEventListener("click", likeCardCallback);

  // Обоработчик клика по изображению
  cardImage.addEventListener("click", () => imageCallback(cardData));

  return cardElement;
}

// функция удаления карточки
export function deleteCard(cardElement) {
  cardElement.remove();
}

export function likeCardCallback(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}
