// 1. Импорты модулей и стилей
import "./pages/index.css"; // Импорт основного CSS-файла
import {
  createCard,
  deleteCard,
  handleLikeButtonClick,
} from "./components/card.js"; // Импорт функций и данных для карточек

import { openModal, closeModal } from "./components/modal"; // Импорт функций для работы с попапами
import { clearValidation, enableValidation } from "./components/validate"; //bvgjhn aeyrwbq dfkblfwbb
import {
  getUserInfo,
  getInitialCards,
  updateUserProfile,
  addCard,
  updateUserAvatar,
  removeCard,
} from "./components/api.js"; // Импорт функций для получения данных профиля
import { setDeleteButtonClickHandler } from "./components/card.js";

const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");

// Элементы для обновления аватараAdd commentMore actions
const avatarEditButton = document.querySelector(".profile__image-edit-button");
const avatarPopup = document.querySelector(".popup_type_avatar");
const avatarForm = document.querySelector('form[name="avatar-update"]');
const avatarLinkInput = avatarForm.querySelector('input[name="avatar-link"]');
const profileImage = document.querySelector(".profile__image");

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

// Элементы попапа для удаления карточки
const deleteCardPopup = document.querySelector(".popup_type_delete-card");
//const deleteCardButton = deleteCardPopup.querySelector(".popup__button_delete");
let cardToDelete = null; // Переменная для хранения ссылки на удаляемую карточку
const popups = document.querySelectorAll(".popup");

// cards
const addButton = document.querySelector(".profile__add-button");
const addCardPopup = document.querySelector(".popup_type_new-card");
const addCardForm = document.querySelector('form[name="new-place"]');
const placeNameInput = addCardForm.querySelector('input[name="place-name"]');
const placeLinkInput = addCardForm.querySelector('input[name="link"]');
const deleteCardButton = deleteCardPopup.querySelector(".popup__button_delete");

// Конфиг валидации форм
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// 3. Функции-обработчики
// Устанавливаем обработчик для удаления карточек
setDeleteButtonClickHandler(handleDeleteButtonClick);

// Обработчик подтверждения удаления карточки
function handleDeleteConfirm() {
  if (!cardToDelete) return;

  // Получаем ID карточки из data-атрибута
  const cardId = cardToDelete.dataset.cardId;

  // Меняем текст кнопки на время удаления
  const originalButtonText = deleteCardButton.textContent;
  deleteCardButton.textContent = "Удаление...";

  // Отправляем запрос на удаление
  removeCard(cardId)
    .then(() => {
      // Удаляем карточку из DOM
      cardToDelete.remove();
      // Закрываем попап
      closeModal(deleteCardPopup);
    })
    .catch((err) => {
      console.error(`Ошибка при удалении карточки: ${err}`);
    })
    .finally(() => {
      // Возвращаем исходный текст кнопки
      deleteCardButton.textContent = originalButtonText;
      // Очищаем переменную
      cardToDelete = null;
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  // Получаем значение из инпута
  const avatarLink = avatarLinkInput.value;

  // Получаем кнопку отправки формы
  const submitButton = avatarForm.querySelector(".popup__button");
  // Сохраняем оригинальный текст кнопки
  const originalButtonText = submitButton.textContent;
  // Меняем текст кнопки на "Сохранение..."
  submitButton.textContent = "Сохранение...";

  // Отправляем запрос на сервер для обновления аватара
  updateUserAvatar(avatarLink)
    .then((userData) => {
      // Обновляем аватар на странице
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      // Закрываем попап
      closeModal(avatarPopup);
      // Сбрасываем форму
      avatarForm.reset();
    })
    .catch((err) => {
      console.error(`Ошибка при обновлении аватара: ${err}`);
    })
    .finally(() => {
      // Возвращаем исходный текст кнопки
      submitButton.textContent = originalButtonText;
    });
}

function openImagePopup({ link, name }) {
  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupCaption.textContent = name;
  openModal(imagePopup);
}

// Обработчик отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault(); // Отменяем стандартную отправку формыAdd commentMore actions

  // Получаем значения из инпутов
  const name = nameInput.value;
  const about = jobInput.value;

  // Получаем кнопку отправки формы
  const submitButton = fromEditProfile.querySelector(".popup__button");
  // Сохраняем оригинальный текст кнопки
  const originalButtonText = submitButton.textContent;
  // Меняем текст кнопки на "Сохранение..."
  submitButton.textContent = "Сохранение...";

  // Отправляем запрос на сервер для обновления профиля
  updateUserProfile(name, about)
    .then((userData) => {
      // Обновляем данные профиля на странице
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      // Закрываем попап
      closeModal(editProfilePopup);
    })
    .catch((err) => {
      console.error(`Ошибка при обновлении профиля: ${err}`);
    })
    .finally(() => {
      // Возвращаем исходный текст кнопки
      submitButton.textContent = originalButtonText;
    });
}

// Обработчик отправки формы добавления новой карточки
function handleAddCardSubmit(evt) {
  evt.preventDefault(); // Отменяем стандартную отправку формыAdd commentMore actions

  // Получаем значения из инпутов
  const name = placeNameInput.value;
  const link = placeLinkInput.value;

  // Получаем кнопку отправки формы
  const submitButton = addCardForm.querySelector(".popup__button");
  // Сохраняем оригинальный текст кнопки
  const originalButtonText = submitButton.textContent;
  // Меняем текст кнопки на "Сохранение..."
  submitButton.textContent = "Сохранение...";

  // Отправляем запрос на сервер для добавления карточки
  addCard(name, link)
    .then((cardData) => {
      // Создаём новую карточку с данными, полученными с сервера
      const newCard = createCard(
        cardData,
        cardTemplate,
        deleteCard,
        handleLikeButtonClick,
        openImagePopup,
        handleDeleteButtonClick
      );

      // Добавляем карточку в начало списка
      placesList.prepend(newCard);

      // Закрываем попап и очищаем форму
      closeModal(addCardPopup);
      addCardForm.reset();
    })
    .catch((err) => {
      console.error(`Ошибка при добавлении карточки: ${err}`);
    })
    .finally(() => {
      // Возвращаем исходный текст кнопки
      submitButton.textContent = originalButtonText;
    });
}

// Функция загрузки информации о пользователе
function loadUserInfo() {
  getUserInfo()
    .then((userData) => {
      // Обновляем данные профиля на странице
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;

      // Если у пользователя есть аватар, обновляем его
      const profileImage = document.querySelector(".profile__image");
      if (userData.avatar) {
        profileImage.style.backgroundImage = `url(${userData.avatar})`;
      }

      // Сохраняем ID пользователя (может пригодиться позже)
      // Можно добавить как data-атрибут или в переменную
      profileTitle.dataset.userId = userData._id;
    })
    .catch((err) => {
      console.error(`Ошибка при загрузке информации о пользователе: ${err}`);
    });
}

// Функция для открытия попапа удаления карточки
function handleDeleteButtonClick(cardElement) {
  cardToDelete = cardElement; // Сохраняем ссылку на карточку, которую нужно удалить
  openModal(deleteCardPopup);
}

// 4. Навешивание обработчиков событий

// Отправка формы обновления аватараAdd commentMore actions
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

// Открытие попапа обновления аватара
avatarEditButton.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
});

// Отправка формы редактирования профиля
fromEditProfile.addEventListener("submit", handleProfileFormSubmit);
// Отправка формы добавления карточки
addCardForm.addEventListener("submit", handleAddCardSubmit);

// Открытие попапа редактирования профиля
editButton.addEventListener("click", () => {
  // Подставляем актуальные значения в инпуты
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;

  clearValidation(fromEditProfile, validationConfig);
  openModal(editProfilePopup);
});

// Открытие попапа добавления карточки
addButton.addEventListener("click", () => {
  addCardForm.reset(); ///очищение формы
  clearValidation(addCardForm, validationConfig);
  openModal(addCardPopup);
});

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

function renderCard(cards) {
  // Перебираем массив карточек и добавляем каждую на страницу
  cards.forEach((cardData) => {
    const cardElement = createCard(
      cardData,
      cardTemplate,
      deleteCard,
      handleLikeButtonClick,
      openImagePopup,
      handleDeleteButtonClick
    );
    placesList.append(cardElement);
  });
}

// Загрузка данных пользователя и карточек при инициализации страницы

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    // Обновляем данные профиля
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;

    // Если у пользователя есть аватар, обновляем его
    const profileImage = document.querySelector(".profile__image");
    if (userData.avatar) {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
    }

    // Сохраняем ID пользователя
    profileTitle.dataset.userId = userData._id;

    // Отрисовываем карточки
    renderCard(cards);
  })
  .catch((err) => {
    console.error(`Ошибка при загрузке данных: ${err}`);
  });

enableValidation(validationConfig); // Инициализация валидации
