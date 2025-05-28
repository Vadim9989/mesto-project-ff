// @todo: Функция создания карточки
import { initialCards } from "./cards";

const cardTemplate = document.querySelector("#card-template").content;
const placeList = document.querySelector(".places__list");

function createCard(cardData, deleteCard) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true); // клонируем шаблон карты

  //элементы внутри картф

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  //установка значения из данных карточки

  cardImage.src = cardData.link;
  cardImage.alt = `Фотография места: ${cardData.name}`;
  cardTitle.textContent = cardData.name;

  //обработчик удаления карточки

  deleteButton.addEventListener("click", () => {
    deleteCard(cardElement);
  });

  //Обработчик лайка

  likeButton.addEventListener("click", handleLikeButtonClick);

  return cardElement;
}

// @todo: Функция удаления карточки

function deleteCard(cardElement) {
  cardElement.remove();
}

// @todo: Вывести карточки на страницу

function addCards() {
  initialCards.forEach((cardData) => {
    const cardElement = createCard(cardData, deleteCard);
    placeList.append(cardElement);
  });
}

addCards();

//кнопка лайка

function handleLikeButtonClick(evt) {
  // Переключает состояние кнопки лайка (активный/неактивный)
  evt.target.classList.toggle("card__like-button_is-active");
}

export { createCard, deleteCard, handleLikeButtonClick };
