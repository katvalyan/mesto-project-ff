// Функция создания карточки
function aboutCard(cardData, deleteCallback) {
  // // Темплейт карточки
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  // // DOM узлы
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  // // Функция Callback
  deleteButton.addEventListener("click", function () {
    deleteCallback(cardElement);
  });

  return cardElement;
}

// // Функция удаления карточки
function DeleteCard(cardElement) {
  cardElement.remove();
}

// // Вывод карточки на страницу
const placesList = document.querySelector(".places__list");
initialCards.forEach((cardData) => {
  const cardElement = aboutCard(cardData, DeleteCard);
  placesList.appendChild(cardElement);
});
