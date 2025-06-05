// Функция открытия модального окна
export function openModal(popupElement) {
  popupElement.classList.add("popup_is-opened");
  // Добавляем обработчик нажатия клавиши Esc
  document.addEventListener("keydown", handleEscClose);
}

// Функция закрытия модального окна
export function closeModal(popupElement) {
  popupElement.classList.remove("popup_is-opened");
  // Удаляем обработчик нажатия клавиши Esc
  document.removeEventListener("keydown", handleEscClose);
}

// Функция-обработчик для Esc
function handleEscClose(evt) {
  if (evt.key === "Escape") {
    // Находим открытый попап
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}
