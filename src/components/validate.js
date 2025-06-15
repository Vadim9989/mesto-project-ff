// Функция, которая показывает ошибку валидации
function showInputError(formElement, inputElement, errorMessage, config) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

// Функция, которая скрывает ошибку валидации
function hideInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = "";
}

// Функция проверки валидности поля
function checkInputValidity(formElement, inputElement, config) {
  if (!inputElement.validity.valid) {
    // Проверка на соответствие регулярному выражению (только латинские и кириллические буквы, дефисы и пробелы)
    if (inputElement.validity.patternMismatch) {
      // Используем data-error-message атрибут для кастомного сообщения об ошибке
      const errorMessage =
        inputElement.dataset.errorMessage ||
        "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы";
      showInputError(formElement, inputElement, errorMessage, config);
    } else {
      showInputError(
        formElement,
        inputElement,
        inputElement.validationMessage,
        config
      );
    }
  } else {
    hideInputError(formElement, inputElement, config);
  }
}

// Функция проверки валидности всей формы для управления состоянием кнопки
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

// Функция добавления обработчиков всем полям формы
function setEventListeners(formElement, config) {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  // Проверяем состояние кнопки при первой загрузке страницы
  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
}

// Функция для управления состоянием кнопки
function setButtonDisabled(buttonElement, isDisabled, config) {
  if (isDisabled) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

// Функция переключения состояния кнопки
function toggleButtonState(inputList, buttonElement, config) {
  const isInvalid = hasInvalidInput(inputList);
  setButtonDisabled(buttonElement, isInvalid, config);
}

// Функция очистки ошибок валидации
function clearValidation(formElement, config) {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
  });

  // Делаем кнопку неактивной при очистке формы
  setButtonDisabled(buttonElement, true, config);
}

// Функция включения валидации
function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));

  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
}

export { clearValidation, enableValidation };
