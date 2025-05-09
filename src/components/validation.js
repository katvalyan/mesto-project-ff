//показывать ошибку
const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`); //находим элемент ошибки
  inputElement.classList.add(config.inputErrorClass); //добавляем класс ошибки полю
  errorElement.textContent = errorMessage; //добавляем текст ошибки 
  errorElement.classList.add(config.errorClass); //показываем ошибку
};

//скрывать ошибку
const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`); //находим элемент ошибки
  inputElement.classList.remove(config.inputErrorClass); //убираем класс ошибки полю
  errorElement.classList.remove(config.errorClass); //убираем текст ошибки 
  errorElement.textContent = ""; //скрываем ошибку
};

//проверка валидности
const isValid = (formElement, inputElement, config) => {
  //проверяем состояния валидации
  if (inputElement.validity.valueMissing) {
    inputElement.setCustomValidity(inputElement.dataset.errorValue); //для пустого поля
  } else if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage); //для несоотвествия паттерну
  } else {
    inputElement.setCustomValidity(""); //если валидно
  }
  //показываем/скрываем ошибку в зависимости от валидности
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    );
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

//управление состоянием кнопки: блокировка / разблокировка 
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
};

//вешаем обработчики
const setEventListeners = (formElement, config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  toggleButtonState(inputList, buttonElement, config);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      isValid(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

//включение валидности
export const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
};

//сброс состояния валидации формы
export const clearValidation = (formElement, config) => {
  //находим все формы и собираем в массив
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  //находим кнопку
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  //проходимся по списку и очищаем ошибки
  inputList.forEach((input) => {
    hideInputError(formElement, input, config);
    input.setCustomValidity("");
  });
  //обновляем состояние кнопки
  toggleButtonState(inputList, buttonElement, config);
};
