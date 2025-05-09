// подключаем файлы проекта
import "../pages/index.css";
// подключаем функций
import { openPopup, closePopup } from "./modal.js"; //работа с попапами
import { createCard, deleteCard, likeCardHandler } from "./card.js";
import {
  enableValidation,
  validationConfig,
  clearValidation,
} from "./validation.js"; //работа с валидацией
import {
  getProfile,
  getCards,
  updateProfile,
  addNewCard,
  updateAvatar,
} from "./api.js"; //работа с API
import { loadingButton } from "./utils.js"; //вспомогательная функция управления состоянием кнопки
//подключаем валидацию
enableValidation(validationConfig);

// получение DOM-элементов
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
//элементы аватарки
const avatarPopup = document.querySelector(".popup_type_edit_avatar");
const avatarForm = document.forms["edit-avatar"];
const avatarImage = document.querySelector(".profile__image");
const avatarInput = avatarForm.elements.avatar;
const profileImage = document.querySelector(".profile__image");

//переменная для идентификации текущего пользователя
let profileId;

//открытие попапа профиля
editButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  openPopup(editPopup);
  clearValidation(editForm, validationConfig);
});

//обработчик редактирования профиля
editForm.addEventListener("submit", function (evt) {
  evt.preventDefault(); // отменяем дефолтную отправку формы

  //обновляем данные на странице
  const submitButton = editForm.querySelector(".popup__button");

  loadingButton(submitButton, updateProfile(nameInput.value, jobInput.value))
    .then((updateProfileData) => {
      profileName.textContent = updateProfileData.name; //обновляем имя
      profileJob.textContent = updateProfileData.about; //обновляем работу
      closePopup(editPopup); //закрываем попап
    })

    .catch((error) => {
      console.log("Ошибка ui обновления профиля:", error); //вывод ошибки
    });
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

  //обновляем данные на странице
  const submitButton = newCardForm.querySelector(".popup__button");

  loadingButton(
    submitButton,
    addNewCard(nameCardInput.value, linkCardInput.value)
  )
    .then((newCard) => {
      //отображаем новую карточку
      renderCard(newCard, placesList, true, profileId);
      //очищаем формы
      clearValidation(newCardForm, validationConfig); //сбрасываем валидацию
      newCardForm.reset(); //очищаем поля
      closePopup(newCardPopup);
    })
    .catch((error) => {
      console.log("Ошибка ui при добавлении новой карточки:", error); //вывод ошибки
    });
});

//плавность попапов
popups.forEach((popup) => {
  popup.classList.add("popup_is-animated");
});

// Функция обработки клика по изображению
function handleCardImageClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.alt;
  popupCaption.textContent = cardData.name;
  openPopup(imagePopup);
}

//загрузка карточек с сервера
Promise.all([getProfile(), getCards()]) //запросы данных профиля и списка карточек

  .then(([profileData, cards]) => {
    //обновляем данные профиля
    profileName.textContent = profileData.name;
    profileJob.textContent = profileData.about;
    profileImage.style.backgroundImage = `url('${profileData.avatar}')`;
    profileId = profileData._id;
    showProfile(); //показываем профиль
    placesList.innerHTML = ""; //очищаем список перед добавлением
    //добавляем карточки
    cards.forEach((cardData) => {
      renderCard(cardData, placesList, false, profileId);
    });
  })
  //вывод ошибки
  .catch((error) => {
    console.log("Ошибка ui карточек:", error);
  });

//функция плавного появления элементов профиля
function showProfile() {
  const elements = document.querySelectorAll(
    ".profile__image, .profile__info, .profile__add-button"
  );
  elements.forEach((el) => (el.style.opacity = "1"));
}

//функция создания новых карточек
function renderCard(cardData, container, prepend = false, profileId) {
  const cardElement = createCard(
    cardData,
    deleteCard,
    (evt) => likeCardHandler(evt, cardData),
    handleCardImageClick,
    profileId
  );
  if (prepend) {
    container.prepend(cardElement);
  } else {
    container.appendChild(cardElement);
  }
}

//обновляем аватара
avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault(); // отменяем дефолтную отправку формы

  //обновляем данные на странице
  const submitButton = avatarForm.querySelector(".popup__button");

  loadingButton(submitButton, updateAvatar(avatarInput.value))
    .then((updateAvatarData) => {
      profileImage.style.backgroundImage = `url('${updateAvatarData.avatar}')`; //обновляем аватарку
      //очищаем формы
      clearValidation(avatarForm, validationConfig); //сбрасываем валидацию
      avatarForm.reset(); //очищаем поле
      closePopup(avatarPopup);
    })
    .catch((error) => {
      console.log("Ошибка ui обновления аватара:", error); //вывод ошибки
    });
});

//клик по аватару
avatarImage.addEventListener("click", () => {
  openPopup(avatarPopup);
});
