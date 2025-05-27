import "../src/pages/index.css";
import { initialCards } from "./components/cards.js";

const cardTemplate = document.querySelector("#card-template").content;
const placeList = document.querySelector(".places__list");

// @todo: Функция создания карточки

function createCard(cardData, deleteCard) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true); // клонируем шаблон карты

  //элементы внутри картф

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  //установка значения из данных карточки

  cardImage.src = cardData.link;
  cardImage.alt = `Фотография места: ${cardData.name}`;
  cardTitle.textContent = cardData.name;

  //обработчик удаления карточки

  deleteButton.addEventListener("click", () => {
    deleteCard(cardElement);
  });

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
