//Открытие попапов
export function openPopup(popup) {
  popup.classList.add("popup_is-opened"); //делаем попап видимым
  document.addEventListener("keydown", closeEscape); //вешаем обработчик по нажатию клавиш
}

//Закрытие попапа
export function closePopup(popup) {
  popup.classList.remove("popup_is-opened"); //делаем попап не видимым
  document.removeEventListener("keydown", closeEscape); //вешаем обработчик
}

//Закрытие попапа по клавише Escape
function closeEscape(evt) {
  if (evt.key === "Escape") {
    //проверка на зажатый Escape
    const openedPopup = document.querySelector(".popup_is-opened"); //ищем открытый попап
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}
