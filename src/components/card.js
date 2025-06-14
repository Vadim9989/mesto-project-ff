import { removeCard, likeCard, unlikeCard } from "./api.js";

const cardTemplate = document.querySelector("#card-template").content;

let handleDeleteButtonClick; // Будет определена позже

// Добавьте эту функцию в конец файла, перед экспортом
export function setDeleteButtonClickHandler(handler) {
  handleDeleteButtonClick = handler;
}

function createCard(
  cardData,
  cardTemplate,
  deleteCard,
  handleLikeButtonClick,
  openImagePopup,
  handleDeleteButtonClick
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true); // клонируем шаблон карты

  // Сохраняем ID карточки в data-атрибуте
  cardElement.dataset.cardId = cardData._id;

  //элементы внутри картф

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");

  //установка значения из данных карточки

  cardImage.src = cardData.link;
  cardImage.alt = `Фотография места: ${cardData.name}`;
  cardTitle.textContent = cardData.name;

  // Устанавливаем количество лайковAdd commentMore actions
  likeCount.textContent = cardData.likes.length;

  // Получаем ID текущего пользователя
  const userId = document.querySelector(".profile__title").dataset.userId;

  // Проверяем, является ли текущий пользователь владельцем карточки
  if (cardData.owner && cardData.owner._id !== userId) {
    // Если не владелец - скрываем кнопку удаления
    deleteButton.style.display = "none";
  }

  // Проверяем, лайкнул ли текущий пользователь карточку
  const isLiked = cardData.likes.some((user) => user._id === userId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Добавить обработчик события для кнопки подтверждения
  deleteButton.addEventListener("click", () =>
    handleDeleteButtonClick(cardElement)
  );
  //Обработчик лайка

  likeButton.addEventListener("click", (evt) => {
    handleLikeButtonClick(evt, cardData._id, likeCount);
  });

  cardImage.addEventListener("click", () => openImagePopup(cardData));

  return cardElement;
}

// Функция удаления карточки (теперь просто вызывает обработчик)
function deleteCard(cardElement) {
  // Просто удаляем элемент из DOM
  cardElement.remove();
}
//кнопка лайка

function handleLikeButtonClick(evt, cardId, likeCount) {
  const likeButton = evt.target;
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  // Выбираем подходящий метод в зависимости от текущего состояния
  const likeMethod = isLiked ? unlikeCard : likeCard;

  likeMethod(cardId)
    .then((updatedCard) => {
      // Обновляем состояние кнопки
      likeButton.classList.toggle("card__like-button_is-active");

      // Обновляем счетчик лайков из ответа сервера
      likeCount.textContent = updatedCard.likes.length;
    })
    .catch((err) => {
      console.error(`Ошибка при обновлении лайка: ${err}`);
    });
}

//
export function setDeleteButtonClickHandler(handler) {
  handleDeleteButtonClick = handler;
}

export { createCard, deleteCard, handleLikeButtonClick };
