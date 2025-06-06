// 1. Импорты модулей и стилей
import "./pages/index.css"; // Импорт основного CSS-файла
import {
  createCard,
  deleteCard,
  handleLikeButtonClick,
} from "./components/card.js"; // Импорт функций и данных для карточек
import { initialCards } from "./components/cards.js"; // Импорт массива карточек
import { openModal, closeModal } from "./components/modaL"; // Импорт функций для работы с попапами

const cardTemplate = document.querySelector("#card-template").content;
const placeList = document.querySelector(".places__list");

// profile
const editProfilePopup = document.querySelector(".popup_type_edit");
const editButton = document.querySelector(".profile__edit-button");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const fromEditProfile = document.querySelector('form[name="edit-profile"]');
const nameInput = fromEditProfile.querySelector('input[name="name"]');
const jobInput = fromEditProfile.querySelector('input[name="description"]');

// image popup
const imagePopup = document.querySelector(".popup_type_image");
const imagePopupImage = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");
const popups = document.querySelectorAll(".popup");

// cards
const addButton = document.querySelector(".profile__add-button");
const addCardPopup = document.querySelector(".popup_type_new-card");
const addCardForm = document.querySelector('form[name="new-place"]');
const placeNameInput = addCardForm.querySelector('input[name="place-name"]');
const placeLinkInput = addCardForm.querySelector('input[name="link"]');

// 3. Функции-обработчики

function openImagePopup({ link, name }) {
  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupCaption.textContent = name;
  openModal(imagePopup);
}

// Обработчик отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault(); // Отменяем стандартную отправку формы
  // Обновляем данные профиля на странице
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  // Закрываем попап
  closeModal(editProfilePopup);
}

// Обработчик отправки формы добавления новой карточки
function handleAddCardSubmit(e) {
  e.preventDefault();
  const cardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value,
  };

  placeList.prepend(
    createCard(cardData, deleteCard, openImagePopup, handleLikeButtonClick)
  );
  addCardForm.reset();
  closeModal(addCardPopup);
}

// 4. Навешивание обработчиков событий

// Отправка формы редактирования профиля
fromEditProfile.addEventListener("submit", handleProfileFormSubmit);
// Отправка формы добавления карточки
addCardForm.addEventListener("submit", handleAddCardSubmit);

// Открытие попапа редактирования профиля
editButton.addEventListener("click", () => {
  // Подставляем актуальные значения в инпуты
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editProfilePopup);
});

// Открытие попапа добавления карточки
addButton.addEventListener("click", () => openModal(addCardPopup));

//закрытие по клику на крестик и оверлей

popups.forEach(function (popup) {
  const closeButton = popup.querySelector(".popup__close");
  closeButton.addEventListener("click", function () {
    closeModal(popup);
  });
  popup.addEventListener("mousedown", function (evt) {
    if (evt.target === evt.currentTarget) {
      closeModal(popup);
    }
  });
});

// @todo: Вывести карточки на страницу

function addCards() {
  initialCards.forEach((cardData) => {
    const cardElement = createCard(
      cardData,
      deleteCard,
      openImagePopup,
      handleLikeButtonClick
    );
    placeList.append(cardElement);
  });
}

addCards();
