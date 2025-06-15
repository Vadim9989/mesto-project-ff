import { removeCard, likeCard, unlikeCard } from "./api.js";
import { getCurrentUserId } from "../index.js";

const cardTemplate = document.querySelector("#card-template").content;

let handleDeleteButtonClick; // Будет определена позже

function createCard(
  cardData,
  cardTemplate,
  deleteCard,
  handleLikeButtonClick,
  openImagePopup,
  handleDeleteButtonClick
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");

  cardImage.src = cardData.link;
  cardImage.alt = `Фотография места: ${cardData.name}`;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  const userId = getCurrentUserId();

  if (cardData.owner && cardData.owner._id !== userId) {
    deleteButton.style.display = "none";
  }

  const isLiked = cardData.likes.some((user) => user._id === userId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Передаем ID карточки напрямую в обработчик
  deleteButton.addEventListener("click", () =>
    deleteCard(cardData._id, cardElement)
  );

  likeButton.addEventListener("click", () => {
    handleLikeButtonClick(cardData._id, likeButton, likeCount);
  });

  cardImage.addEventListener("click", () => openImagePopup(cardData));

  return cardElement;
}

// Функция удаления карточки (теперь просто вызывает обработчик)
function deleteCard(cardId, cardElement) {
  removeCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.error(`Ошибка при удалении карточки: ${err}`);
    });
}
//кнопка лайка

function handleLikeButtonClick(cardId, likeButton, likeCount) {
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

export function setDeleteButtonClickHandler(handler) {
  handleDeleteButtonClick = handler;
}

export { createCard, deleteCard, handleLikeButtonClick };
