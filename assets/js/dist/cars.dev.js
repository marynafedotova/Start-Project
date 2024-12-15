"use strict";

fetch('../data/cars.json').then(function (response) {
  return response.json();
}).then(function (data) {
  createTable(data.cars_in_transit);
})["catch"](function (error) {
  console.error('Помилка завантаження даних:', error);
});

function createTable(cars) {
  var tableContainer = document.getElementById('cars-table');

  if (!tableContainer) {
    console.error('Таблиця не знайдена в DOM');
    return;
  }

  var table = document.createElement('table');
  table.innerHTML = "\n    <thead>\n      <tr>\n        <th><div class=\"cars-title\">\u041D\u0430\u0437\u0432\u0430 \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0456\u043B\u044F</div></th>\n        <th><div class=\"cars-title\">\u0411\u0440\u043E\u043D\u044E\u0432\u0430\u043D\u043D\u044F</div></th>\n      </tr>\n    </thead>\n    <tbody>\n    </tbody>\n  ";
  var tbody = table.querySelector('tbody');
  cars.forEach(function (car) {
    var row = document.createElement('tr');
    var nameCell = document.createElement('td');
    var wrapperDiv = document.createElement('div');
    var carLink = document.createElement('a');
    carLink.href = "#";
    carLink.textContent = car.model;
    carLink.addEventListener('click', function (event) {
      event.preventDefault();
      toggleAccordion(row);
    });
    wrapperDiv.appendChild(carLink);
    nameCell.appendChild(wrapperDiv);
    row.appendChild(nameCell);
    var bookingCell = document.createElement('td');
    var bookingButton = document.createElement('button');
    bookingButton.textContent = "Забронювати";
    bookingButton.addEventListener('click', function () {
      return openModal(car.model);
    });
    bookingCell.appendChild(bookingButton);
    row.appendChild(bookingCell);
    tbody.appendChild(row);
    var accordionRow = document.createElement('tr');
    var accordionCell = document.createElement('td');
    accordionCell.colSpan = 2;
    accordionCell.innerHTML = "\n      <div class=\"accordion-content\" style=\"display: none;\"> \n      <div class=\"car-deteils\">\n        <h3>\u041C\u043E\u0434\u0435\u043B\u044C: ".concat(car.model, "</h3>\n        <ul>\n          <li><div class=\"cardeteils-item\">\u0420\u0456\u043A \u0432\u0438\u043F\u0443\u0441\u043A\u0443: </div> ").concat(car.year, "</li>\n          <li><div class=\"cardeteils-item\">\u0410\u0443\u043A\u0446\u0456\u043E\u043D:</div> ").concat(car.auction, "</li>\n          <li><div class=\"cardeteils-item\">\u0414\u0430\u0442\u0430 \u043F\u0440\u043E\u0434\u0430\u0436\u0443:</div> ").concat(car.sale_date, "</li>\n          <li><div class=\"cardeteils-item\">VIN:</div> ").concat(car.vin, "</li>\n          <li><div class=\"cardeteils-item\">\u0421\u0442\u0430\u043D:</div> ").concat(car.status, "</li>\n          <li><div class=\"cardeteils-item\">\u0414\u0432\u0438\u0433\u0443\u043D:</div> ").concat(car.engine, "</li>\n          <li><div class=\"cardeteils-item\">\u041F\u0440\u043E\u0431\u0456\u0433:</div> ").concat(car.mileage, "</li>\n          <li><div class=\"cardeteils-item\">\u041F\u0440\u043E\u0434\u0430\u0432\u0435\u0446\u044C:</div> ").concat(car.seller, "</li>\n          <li><div class=\"cardeteils-item\">\u041C\u0456\u0441\u0446\u0435 \u043F\u0440\u043E\u0434\u0430\u0436\u0443:</div> ").concat(car.location, "</li>\n          <li><div class=\"cardeteils-item\">\u041E\u0441\u043D\u043E\u0432\u043D\u0435 \u0443\u0448\u043A\u043E\u0434\u0436\u0435\u043D\u043D\u044F:</div> ").concat(car.primary_damage, "</li>\n          <li><div class=\"cardeteils-item\">\u0414\u0440\u0443\u0433\u043E\u0440\u044F\u0434\u043D\u0435 \u043F\u043E\u0448\u043A\u043E\u0434\u0436\u0435\u043D\u043D\u044F:</div> ").concat(car.secondary_damage, "</li>\n          <li><div class=\"cardeteils-item\">\u041E\u0446\u0456\u043D\u043E\u0447\u043D\u0430 \u0432\u0430\u0440\u0442\u0456\u0441\u0442\u044C:</div> ").concat(car.estimated_value, "</li>\n          <li><div class=\"cardeteils-item\">\u0426\u0456\u043D\u0430 \u0440\u0435\u043C\u043E\u043D\u0442\u0443:</div> ").concat(car.repair_cost, "</li>\n          <li><div class=\"cardeteils-item\">\u041A\u043E\u0440\u043E\u0431\u043A\u0430 \u043F\u0435\u0440\u0435\u0434\u0430\u0447:</div> ").concat(car.transmission, "</li>\n          <li><div class=\"cardeteils-item\">\u041A\u043E\u043B\u0456\u0440 \u043A\u0443\u0437\u043E\u0432\u0430:</div> ").concat(car.color, "</li>\n          <li><div class=\"cardeteils-item\">\u041F\u0440\u0438\u0432\u0456\u0434:</div> ").concat(car.drive, "</li>\n        </ul>\n        </div>\n         <div id=\"car-slider\">\n        <ul id=\"image-slider-").concat(car.vin, "\" class=\"image-slider\"></ul>\n      </div>\n      </div>\n    ");
    accordionRow.appendChild(accordionCell);
    tbody.appendChild(accordionRow);

    if (car.images && car.images.length > 0) {
      setTimeout(function () {
        var sliderElement = document.getElementById("image-slider-".concat(car.vin));

        if (sliderElement) {
          initImageSlider(car, "image-slider-".concat(car.vin));
        } else {
          console.error("\u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u0441\u043B\u0430\u0439\u0434\u0435\u0440\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u0434\u043B\u044F ".concat(car.vin));
        }
      }, 0);
    }
  });
  tableContainer.appendChild(table);
} // Функция для переключения отображения аккордеона


function toggleAccordion(row) {
  var accordionRow = row.nextElementSibling;

  if (accordionRow && accordionRow.querySelector('.accordion-content')) {
    var accordionContent = accordionRow.querySelector('.accordion-content');
    accordionContent.style.display = accordionContent.style.display === 'none' ? 'flex' : 'none';
  }
}

function initImageSlider(car, sliderId) {
  var imageSlider = document.getElementById(sliderId);
  var ulElement = document.createElement('ul');
  car.images.forEach(function (imagePath, index) {
    var fullPath = "../img/cars/".concat(imagePath.replace('../img/cars/', ''));
    var imageLi = document.createElement('li');
    imageLi.setAttribute('data-thumb', fullPath); // Добавляем ссылку и изображение внутри элемента li

    imageLi.innerHTML = "\n      <a href=\"".concat(fullPath, "\" data-lightgallery=\"item\">\n        <img src=\"").concat(fullPath, "\" alt=\"\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 ").concat(car.model, " ").concat(index + 1, "\">\n      </a>\n    ");
    ulElement.appendChild(imageLi);
  });
  imageSlider.appendChild(ulElement); // Инициализируем LightSlider

  var lightSliderInstance = $(ulElement).lightSlider({
    gallery: true,
    item: 1,
    vertical: true,
    thumbItem: car.images.length,
    slideMargin: 10,
    enableDrag: true,
    currentPagerPosition: 'left',
    controls: false,
    verticalHeight: 500,
    auto: true,
    loop: true,
    onSliderLoad: function onSliderLoad() {
      console.log('Слайдер загружен'); // Инициализируем LightGallery после загрузки слайдера

      lightGallery(imageSlider, {
        selector: 'a[data-lightgallery="item"]',
        allowMediaOverlap: true,
        toggleThumb: true
      });
    }
  });
} // Получение элементов


var modal = document.getElementById('car-modal');
var overlay = modal ? modal.querySelector('.overlay-feedback-modal') : null;
var closeModalButton = modal ? modal.querySelector('.close-feedback') : null;
var openModalButtons = document.querySelectorAll('button[data-action="book"]');

if (modal && overlay && closeModalButton && openModalButtons.length > 0) {
  // События для закрытия модального окна
  closeModalButton.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  openModalButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var carName = button.dataset.carName || 'Неизвестная модель';
      openModal(carName);
    });
  });
} // Функция открытия модального окна


function openModal(carName) {
  if (modal && overlay) {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    var carNameField = modal.querySelector('#car-name');

    if (carNameField) {
      carNameField.textContent = carName;
    }
  }
} // Функция закрытия модального окна


function closeModal() {
  if (modal && overlay) {
    modal.style.display = 'none';
    overlay.style.display = 'none';
  }
} // Событие для кнопок "Забронювати"


openModalButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    var carName = button.dataset.carName || 'Неизвестная модель'; // Получить название автомобиля

    openModal(carName);
  });
}); // События для закрытия модального окна

closeModalButton.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal); // Убираем автоматическое открытие модального окна при загрузке страницы

document.addEventListener('DOMContentLoaded', function () {
  modal.style.display = 'none';
  overlay.style.display = 'none';
}); // form

document.getElementById('car-order-form_cars').addEventListener('submit', function (event) {
  event.preventDefault();
  var nameFld = document.getElementById('name');
  var telFld = document.getElementById('phone');
  var emailFld = document.getElementById('email');
  var commentsFld = document.getElementById('comments');
  var name = nameFld.value.trim();
  var phone = telFld.value.trim();
  var email = emailFld.value.trim();
  var comments = commentsFld.value.trim();
  var errors = []; // Очистка классов ошибок

  nameFld.classList.remove('is-invalid');
  telFld.classList.remove('is-invalid');
  emailFld.classList.remove('is-invalid'); // Валидация имени

  if (name === '') {
    toast.error("Введіть, будь ласка, Ваше ім'я");
    nameFld.classList.add('is-invalid');
  } else if (name.length < 2) {
    toast.error("Ваше ім'я занадто коротке");
    nameFld.classList.add('is-invalid');
  } else {
    nameFld.classList.remove('is-invalid');
  } // Валидация телефона


  if (phone === '' || phone.length < 17) {
    toast.error('Введіть, будь ласка, правильний номер телефону');
    telFld.classList.add('is-invalid');
  } else {
    telFld.classList.remove('is-invalid');
  } // Валидация email


  if (email === '') {
    toast.error("Введіть, будь ласка, Вашу електронну пошту");
    emailFld.classList.add('is-invalid');
  } else if (!isValidEmail(email)) {
    toast.error("Невірний формат електронної пошти");
    emailFld.classList.add('is-invalid');
  } else {
    emailFld.classList.remove('is-invalid');
  } // Если есть ошибки, не отправляйте форму


  if (nameFld.classList.contains('is-invalid') || telFld.classList.contains('is-invalid') || emailFld.classList.contains('is-invalid')) {
    return;
  } // Предположим, что данные о машине хранятся в переменной car


  var car = {
    name: "Volkswagen Passat",
    // Пример имени автомобиля, замените на ваше реальное значение
    model: "1.8T Wolfsburg Edition 2014",
    vin: "1234567890"
  }; // Отправка данных в Telegram

  var CHAT_ID = '-1002485030400';
  var BOT_TOKEN = '7527794477:AAFxOk9l6CH8EccTk9at2uVM3OSyEZbrUCw';
  var message = "\n  \uD83D\uDE97 <b>\u041D\u043E\u0432\u0435 \u0431\u0440\u043E\u043D\u044E\u0432\u0430\u043D\u043D\u044F \u0430\u0432\u0442\u043E</b> \uD83D\uDE97\n\n  \u041D\u0430\u0437\u0432\u0430 \u0430\u0432\u0442\u043E: ".concat(car.name, "\n\n  \u041C\u043E\u0434\u0435\u043B\u044C: ").concat(car.model, "\n\n  VIN: ").concat(car.vin, "\n\n  \u0406\u043C'\u044F: ").concat(name, "\n\n  \u0422\u0435\u043B\u0435\u0444\u043E\u043D: ").concat(phone, "\n\n  Email: ").concat(email, "\n\n  \u041A\u043E\u043C\u0435\u043D\u0442\u0430\u0440\u0456: ").concat(comments || 'Без коментарів', "\n  ");
  var url = "https://api.telegram.org/bot".concat(BOT_TOKEN, "/sendMessage?chat_id=").concat(CHAT_ID, "&text=").concat(encodeURIComponent(message), "&parse_mode=HTML");
  fetch(url, {
    method: 'POST'
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.ok) {
      nameFld.value = '';
      telFld.value = '';
      emailFld.value = '';
      commentsFld.value = '';
      toast.success('Ваше повідомлення успішно надіслано.');
      closeModal(); // Закрытие модального окна
    } else {
      toast.error('Сталася помилка.');
    }
  })["catch"](function (error) {
    toast.error('Помилка: ' + error.message);
  });
}); // Форматирование телефона

document.getElementById('phone').addEventListener('input', function (e) {
  var input = e.target.value.replace(/\D/g, '');
  var formattedInput = '';
  if (input.length > 0) formattedInput += '+38 (';
  if (input.length >= 1) formattedInput += input.substring(0, 3);
  if (input.length >= 4) formattedInput += ') ' + input.substring(3, 6);
  if (input.length >= 7) formattedInput += '-' + input.substring(6, 8);
  if (input.length >= 9) formattedInput += '-' + input.substring(8, 10);
  e.target.value = formattedInput;
}); // Запрещаем ввод чисел в поле имени

document.getElementById('name').addEventListener('input', function (e) {
  e.target.value = e.target.value.replace(/[^A-Za-zА-Яа-яІіЇїЄє']/g, '');
});

function isValidEmail(email) {
  var emailPattern = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return emailPattern.test(email);
}