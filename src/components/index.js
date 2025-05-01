// подключаем файлы проекта
import "../pages/index.css";
import { initialCards } from "./cards.js";
// подключаем функций
import { openPopup, closePopup } from "./modal.js"; //работа с попапами
import { createCard, deleteCard, likeCardCallback } from "./card.js";

// Получение DOM-элементов
const placesList = document.querySelector(".places__list"); // выводим карточек на страницу
// попапы
const popups = document.querySelectorAll(".popup"); //все попапы
const editPopup = document.querySelector(".popup_type_edit"); //редактирование
const newCardPopup = document.querySelector(".popup_type_new-card"); //добавление новой карточки
const imagePopup = document.querySelector(".popup_type_image"); //просмотр изображения в полном размере
const popupImage = imagePopup.querySelector(".popup__image"); // для отображения увеличенного изображения карточки
const popupCaption = imagePopup.querySelector(".popup__caption"); //подпись к изображению
// формы
const editForm = document.forms["edit-profile"]; //редактирование
const nameInput = editForm.elements.name; // поле ввода имени
const jobInput = editForm.elements.description; // поле ввода работы
const newCardForm = document.forms["new-place"]; //поле ввода сохранить
const nameCardInput = newCardForm.elements["place-name"]; // поле ввода названия места
const linkCardInput = newCardForm.elements["link"]; // поля ввода ссылки на картинку
//кнопки интерфейса
const editButton = document.querySelector(".profile__edit-button"); //кнопка открытия попапа профиля
const addButton = document.querySelector(".profile__add-button"); //кнопка открытия попапа добавления картинки
//элементы профиля
const profileName = document.querySelector(".profile__title"); //имя
const profileJob = document.querySelector(".profile__description"); //работа

//открытие попапа профиля
editButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  openPopup(editPopup);
});

//обработчик редактирования профиля
editForm.addEventListener("submit", function (evt) {
  evt.preventDefault(); // отменяем дефолтную отправку формы

  // обновляем данные на странице
  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;

  closePopup(editPopup); // закрываем попап
});

//закрытие попапа по крестику и оверлею
popups.forEach((popup) => {
  const closeButton = popup.querySelector(".popup__close");
  closeButton.addEventListener("click", () => closePopup(popup));
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});

//добавление новой карточки
addButton.addEventListener("click", () => {
  openPopup(newCardPopup);
});

// обработчик отправки формы новой карточки
newCardForm.addEventListener("submit", function (evt) {
  evt.preventDefault(); // Отменяем дефолтную отправку формы

  // создаем объект с данными новой карточки
  const newCardData = {
    name: nameCardInput.value,
    link: linkCardInput.value,
    alt: nameCardInput.value,
  };

  // создаем и добавляем новую карточку
  const newCardElement = createCard(
    newCardData,
    deleteCard,
    likeCardCallback,
    imageCallback
  );
  placesList.prepend(newCardElement); // добавляем в начало списка

  newCardForm.reset(); // очищаем форму
  closePopup(newCardPopup); // закрываем попап
});

//плавность попапов
popups.forEach((popup) => {
  popup.classList.add("popup_is-animated");
});

// очищаем список перед добавлением
placesList.innerHTML = "";

// добавляем каждую карточку из массива initialCards
initialCards.forEach((cardData) => {
  const cardElement = createCard(
    cardData,
    deleteCard,
    likeCardCallback,
    imageCallback
  );

  placesList.appendChild(cardElement);
});

// Функция обработки клика по изображению
function imageCallback(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.alt || cardData.name;
  popupCaption.textContent = cardData.name;
  openPopup(imagePopup);
}
