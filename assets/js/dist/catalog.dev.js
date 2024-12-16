"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var urlMonoBank = 'https://api.monobank.ua/bank/currency';
var usdToUahRate = 37; // Курс USD к UAH

var currentProductIndex = 0;
var productsPerPage = 12;
var products = [];
var searchResults = [];
var searchProductIndex = 0;
var productsPerSearchPage = 12; // Функция для получения курса валют с кешированием

function fetchCurrencyRate() {
  var cachedRate, cachedTime, now, response, data, usdToUah;
  return regeneratorRuntime.async(function fetchCurrencyRate$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          cachedRate = localStorage.getItem('usdToUahRate');
          cachedTime = localStorage.getItem('usdToUahRateTime');
          now = Date.now();

          if (!(cachedRate && cachedTime && now - cachedTime < 5 * 60 * 1000)) {
            _context.next = 6;
            break;
          }

          usdToUahRate = parseFloat(cachedRate);
          return _context.abrupt("return");

        case 6:
          _context.prev = 6;
          _context.next = 9;
          return regeneratorRuntime.awrap(fetch(urlMonoBank));

        case 9:
          response = _context.sent;

          if (response.ok) {
            _context.next = 12;
            break;
          }

          throw new Error('Ошибка загрузки курса валют');

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(response.json());

        case 14:
          data = _context.sent;
          usdToUah = data.find(function (item) {
            return item.currencyCodeA === 840;
          });

          if (usdToUah && usdToUah.rateSell) {
            usdToUahRate = usdToUah.rateSell;
            localStorage.setItem('usdToUahRate', usdToUahRate);
            localStorage.setItem('usdToUahRateTime', now);
          }

          _context.next = 22;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](6);
          console.error('Ошибка получения курса валют:', _context.t0);

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 19]]);
} // Функция для отображения товаров


function displayProducts() {
  var filteredProducts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var isSearch = filteredProducts.length > 0;
  var productContainer = document.querySelector(isSearch ? '.search-results' : '.product-list');

  if (!productContainer) {
    console.error('Контейнер для товаров не найден');
    return;
  }

  if (isSearch) {
    productContainer.innerHTML = '';
  }

  var productsToDisplay = isSearch ? filteredProducts : products.slice(currentProductIndex, currentProductIndex + productsPerPage);
  productsToDisplay.forEach(function (product) {
    var priceInUah = Math.ceil(product.zena * usdToUahRate); // Печать для диагностики пути
    // console.log('Фото для товара:', product.photo);
    // Берем первое изображение из списка, если оно есть, или дефолтное фото

    var photoUrl = product.photo ? product.photo.split(',')[0].trim() : 'default-photo.jpg'; // console.log('Используемое фото:', photoUrl);  // Логирование выбранного пути

    var productCard = "\n      <div class=\"product-card\">\n        <img src=\"".concat(photoUrl, "\" alt=\"").concat(product.zapchast, "\">\n        <h3>\u0410\u0440\u0442\u0438\u043A\u0443\u043B: ").concat(product.ID_EXT, "</h3>\n        <h3>\u041D\u0430\u0437\u0432\u0430: ").concat(product.zapchast, "</h3>\n        <p>\u0426\u0456\u043D\u0430: ").concat(product.zena, " ").concat(product.valyuta, " / ").concat(priceInUah, " \u0433\u0440\u043D</p>\n        <div class=\"btn-cart\">\n          <button class=\"add-to-cart\" \n                  data-id=\"").concat(product.ID_EXT, "\" \n                  data-price=\"").concat(priceInUah, "\" \n                  data-name=\"").concat(product.zapchast, "\" \n                  data-photo=\"").concat(photoUrl, "\">\n              \u0414\u043E\u0434\u0430\u0442\u0438 \u0434\u043E \u043A\u043E\u0448\u0438\u043A\u0430\n          </button>\n        </div>\n        <div class=\"product_btn\">\n          <a href=\"product.html?id=").concat(product.ID_EXT, "\">\u0414\u0435\u0442\u0430\u043B\u044C\u043D\u0456\u0448\u0435</a>\n        </div>\n      </div>");
    productContainer.insertAdjacentHTML('beforeend', productCard);
  });

  if (!isSearch) {
    currentProductIndex += productsPerPage;

    if (currentProductIndex >= products.length) {
      document.querySelector('.load-more').style.display = 'none';
    }
  } else if (filteredProducts.length === 0) {
    productContainer.innerHTML = '<p>Ничего не найдено.</p>';
  }
} // Функция для отображения результатов поиска


function displaySearchResults() {
  var filteredProducts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var productContainer = document.querySelector('.search-results');

  if (!productContainer) {
    console.error('Контейнер для результатов поиска не найден');
    return;
  }

  if (filteredProducts.length === 0) {
    console.log('Нет результатов для поиска');
    productContainer.innerHTML = '<p>Ничего не найдено.</p>';
    return;
  }

  console.log('Найдено товаров:', filteredProducts.length);
  var productsToDisplay = filteredProducts.slice(searchProductIndex, searchProductIndex + productsPerSearchPage);
  console.log('Отображаем товары с индекса:', searchProductIndex);
  productsToDisplay.forEach(function (product) {
    var priceInUah = Math.ceil(product.zena * usdToUahRate);
    var photoUrl = product.photo ? product.photo.split(',')[0].trim() : 'default-photo.jpg'; // Используем поле photo

    var productCard = "\n      <div class=\"product-card\">\n        <img src=\"".concat(photoUrl, "\" alt=\"").concat(product.zapchast, "\">\n        <h3>\u0410\u0440\u0442\u0438\u043A\u0443\u043B: ").concat(product.ID_EXT, "</h3>\n        <h3>\u041D\u0430\u0437\u0432\u0430: ").concat(product.zapchast, "</h3>\n        <p>\u0426\u0456\u043D\u0430: ").concat(product.zena, " ").concat(product.valyuta, " / ").concat(priceInUah, " \u0433\u0440\u043D</p>\n        <div class=\"btn-cart\">\n          <button class=\"add-to-cart\" \n                  data-id=\"").concat(product.ID_EXT, "\" \n                  data-price=\"").concat(priceInUah, "\" \n                  data-name=\"").concat(product.zapchast, "\" \n                  data-photo=\"").concat(photoUrl, "\">\n              \u0414\u043E\u0434\u0430\u0442\u0438 \u0434\u043E \u043A\u043E\u0448\u0438\u043A\u0430\n          </button>\n        </div>\n        <div class=\"product_btn\">\n          <a href=\"product.html?id=").concat(product.ID_EXT, "\">\u0414\u0435\u0442\u0430\u043B\u044C\u043D\u0456\u0448\u0435</a>\n        </div>\n      </div>");
    productContainer.insertAdjacentHTML('beforeend', productCard);
  });
  searchProductIndex += productsPerSearchPage;
  console.log('Новый индекс поиска:', searchProductIndex);
  var loadMoreButton = document.querySelector('.load-more-search');

  if (searchProductIndex < filteredProducts.length) {
    loadMoreButton.style.display = 'block';
  } else {
    loadMoreButton.style.display = 'none';
  }
} // Обработчик кнопки "Загрузить ещё"


document.querySelector('.load-more-search').addEventListener('click', function (event) {
  event.preventDefault(); // Отменяем стандартное поведение ссылки

  var query = document.getElementById('search-input').value.trim().toLowerCase();
  var filteredProducts = products.filter(function (product) {
    return product.ID_EXT && product.ID_EXT.toLowerCase().includes(query) || product.zapchast && product.zapchast.toLowerCase().includes(query) || product.markaavto && product.markaavto.toLowerCase().includes(query) || product.model && product.model.toLowerCase().includes(query) || product.category && product.category.toLowerCase().includes(query) || product.dop_category && product.dop_category.toLowerCase().includes(query) || product.originalnumber && product.originalnumber.toLowerCase().includes(query);
  });
  displayProducts(filteredProducts);
}); // Обработчик формы поиска

document.getElementById('search-form').addEventListener('submit', function (event) {
  event.preventDefault();
  var query = document.getElementById('search-input').value.trim().toLowerCase();
  console.log('Search query:', query);

  if (query) {
    var filteredProducts = products.filter(function (product) {
      return product.ID_EXT && product.ID_EXT.toLowerCase().includes(query) || product.zapchast && product.zapchast.toLowerCase().includes(query) || product.markaavto && product.markaavto.toLowerCase().includes(query) || product.model && product.model.toLowerCase().includes(query) || product.category && product.category.toLowerCase().includes(query) || product.dop_category && product.dop_category.toLowerCase().includes(query) || product.originalnumber && product.originalnumber.toLowerCase().includes(query);
    });
    console.log('Filtered products:', filteredProducts);
    displayedProductCount = 0;
    displayProducts(filteredProducts);
  } else {
    displayedProductCount = 0;
    displayProducts([]);
  }

  var resultsContainer = document.querySelector('.search-results');

  if (resultsContainer) {
    resultsContainer.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
});
document.getElementById('search-input').addEventListener('input', function () {
  var query = this.value.trim().toLowerCase();

  if (query) {
    var filteredProducts = products.filter(function (product) {
      return product.ID_EXT && product.ID_EXT.toLowerCase().includes(query) || product.zapchast && product.zapchast.toLowerCase().includes(query) || product.markaavto && product.markaavto.toLowerCase().includes(query) || product.model && product.model.toLowerCase().includes(query) || product.category && product.category.toLowerCase().includes(query) || product.dop_category && product.dop_category.toLowerCase().includes(query) || product.originalnumber && product.originalnumber.toLowerCase().includes(query);
    });
    displayedProductCount = 0;
    displayProducts(filteredProducts);
  } else {
    displayedProductCount = 0;
    displayProducts([]);
  }
}); // Функция инициализации каталога

function initializeCatalog() {
  var response, data;
  return regeneratorRuntime.async(function initializeCatalog$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(fetchCurrencyRate());

        case 2:
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(fetch('../data/data_ukr.json'));

        case 5:
          response = _context2.sent;

          if (response.ok) {
            _context2.next = 8;
            break;
          }

          throw new Error('Ошибка загрузки JSON');

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(response.json());

        case 10:
          data = _context2.sent;

          if (!(!data || !data.Sheet1)) {
            _context2.next = 13;
            break;
          }

          throw new Error('Некорректный формат данных');

        case 13:
          products = data.Sheet1;
          displayProducts();
          document.querySelector('.load-more').addEventListener('click', function (event) {
            event.preventDefault();
            displayProducts();
          });
          _context2.next = 21;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](2);
          console.error('Ошибка инициализации каталога:', _context2.t0);

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 18]]);
} // Инициализация


initializeCatalog(); //accordion

fetch('../data/data_ukr.json').then(function (response) {
  return response.json();
}).then(function (data) {
  var cars = data.Sheet1.filter(function (item) {
    return item.markaavto && item.model && item.god;
  }).map(function (item) {
    return {
      markaavto: item.markaavto,
      model: item.model,
      god: item.god // Добавляем год для передачи в ссылку

    };
  });
  var carAccordionData = cars.reduce(function (acc, car) {
    if (!acc[car.markaavto]) {
      acc[car.markaavto] = {};
    }

    if (!acc[car.markaavto][car.model]) {
      acc[car.markaavto][car.model] = new Set(); // Используем Set для уникальных годов
    }

    acc[car.markaavto][car.model].add(car.god); // Добавляем только уникальные года

    return acc;
  }, {});
  var accordionContainer = document.getElementById('carAccordion');

  var _loop = function _loop() {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        make = _Object$entries$_i[0],
        models = _Object$entries$_i[1];

    if (!make) return "continue"; // Пропускаем, если марка null или пустая

    var makeDiv = document.createElement('div');
    makeDiv.classList.add('accordion-item');
    var makeHeader = document.createElement('h3');
    makeHeader.textContent = make;
    makeHeader.classList.add('accordion-header');
    makeHeader.addEventListener('click', function () {
      var modelList = this.nextElementSibling;
      modelList.classList.toggle('active');
    });
    makeDiv.appendChild(makeHeader);
    var modelList = document.createElement('div');
    modelList.classList.add('accordion-content');

    var _loop2 = function _loop2() {
      var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
          model = _Object$entries2$_i[0],
          years = _Object$entries2$_i[1];

      var modelHeader = document.createElement('h4');
      modelHeader.textContent = model;
      modelHeader.classList.add('model-header');
      modelHeader.addEventListener('click', function () {
        var yearList = this.nextElementSibling;
        yearList.classList.toggle('active');
      });
      modelList.appendChild(modelHeader);
      var yearList = document.createElement('div');
      yearList.classList.add('year-list');
      years.forEach(function (year) {
        var yearItem = document.createElement('p');
        yearItem.textContent = "\u0413\u043E\u0434: ".concat(year);
        yearItem.classList.add('year-item');
        yearItem.addEventListener('click', function () {
          window.location.href = "./car-page.html?make=".concat(make, "&model=").concat(model, "&year=").concat(year);
        });
        yearList.appendChild(yearItem);
      });
      modelList.appendChild(yearList);
    };

    for (var _i2 = 0, _Object$entries2 = Object.entries(models); _i2 < _Object$entries2.length; _i2++) {
      _loop2();
    }

    makeDiv.appendChild(modelList);
    accordionContainer.appendChild(makeDiv);
  };

  for (var _i = 0, _Object$entries = Object.entries(carAccordionData); _i < _Object$entries.length; _i++) {
    var _ret = _loop();

    if (_ret === "continue") continue;
  }
})["catch"](function (error) {
  return console.error('Помилка завантаження даних:', error);
}); //cars card

fetch('../data/data_ukr.json').then(function (response) {
  return response.json();
}).then(function (data) {
  var carsCatalog = document.getElementById('cars-catalog');
  var uniqueCars = new Set();
  var carsArray = [];
  data.Sheet1.forEach(function (car) {
    // Проверяем, что марка, модель и год не null и не пусты
    if (car.markaavto && car.model && car.god) {
      var uniqueKey = "".concat(car.markaavto, "-").concat(car.model, "-").concat(car.god);

      if (!uniqueCars.has(uniqueKey)) {
        uniqueCars.add(uniqueKey);
        var carObject = {
          markaavto: car.markaavto,
          model: car.model,
          god: car.god,
          pictures: car.pictures
        };
        carsArray.push(carObject);
      }
    }
  });
  var sortedCars = carsArray.sort(function (a, b) {
    var makeA = a.markaavto || '';
    var makeB = b.markaavto || '';
    return makeA.localeCompare(makeB);
  });
  sortedCars.forEach(function (car) {
    var carCard = document.createElement('div');
    carCard.classList.add('car-card');
    var carImage = document.createElement('img');
    carImage.src = car.pictures;
    carImage.alt = "".concat(car.markaavto, " ").concat(car.model);
    carCard.appendChild(carImage);
    var carDetails = document.createElement('div');
    carDetails.classList.add('car-details');
    var carMakeModel = document.createElement('h3');
    carMakeModel.textContent = "".concat(car.markaavto, " ").concat(car.model);
    carDetails.appendChild(carMakeModel);
    var carYear = document.createElement('p');
    carYear.textContent = "\u0420\u0456\u043A: ".concat(car.god);
    carDetails.appendChild(carYear); // Обработчик события для картки машины

    carCard.addEventListener('click', function () {
      window.location.href = "./car-page.html?make=".concat(car.markaavto, "&model=").concat(car.model, "&year=").concat(car.god);
    });
    carCard.appendChild(carDetails);
    carsCatalog.appendChild(carCard);
  });
})["catch"](function (error) {
  return console.error('Помилка завантаження даних:', error);
}); //cart

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('add-to-cart')) {
    var item = {
      id: event.target.dataset.id,
      // ID товара
      name: event.target.dataset.name,
      // Название товара
      price: parseFloat(event.target.dataset.price || 0),
      // Цена товара
      quantity: 1,
      // Количество товара (по умолчанию 1)
      photo: event.target.dataset.photo // Фото товара

    };
    addToCart(item); // Добавляем товар в корзину
  }
}); // Функция для добавления товара в корзину

function addToCart(item) {
  var cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  var existingItemIndex = cart.findIndex(function (cartItem) {
    return cartItem.id === item.id;
  });

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push(item);
  }

  sessionStorage.setItem("cart", JSON.stringify(cart));
  console.log('Корзина обновлена:', cart);
  showCartModal();
} // Функция для отображения модального окна


function showCartModal() {
  var modal = document.getElementById("cartModal");
  var overlay = document.querySelector(".overlay");

  if (modal && overlay) {
    console.log("Показываем модальное окно"); // Для проверки

    modal.classList.remove("hidden");
    overlay.style.display = "block"; // Проверим текущие стили модального окна

    console.log("Стили модального окна:", window.getComputedStyle(modal));
  } else {
    console.error('Модальное окно или затемняющий фон не найдены!');
  }
} // Функция для закрытия модального окна


function closeCartModal() {
  var modal = document.getElementById("cartModal");
  var overlay = document.querySelector(".overlay");

  if (modal && overlay) {
    modal.classList.add("hidden");
    overlay.style.display = "none";
  } else {
    console.error('Модальное окно или затемняющий фон не найдены!');
  }
} // Функция для перехода к оформлению заказа


function proceedToCheckout() {
  closeCartModal();
  window.location.href = "cart.html";
} //header


var header = document.querySelector('header');
window.addEventListener('scroll', function () {
  var scrollDistance = window.scrollY;
  var threshold = 30;

  if (scrollDistance > threshold) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}); //hamburger-menu

document.getElementById('hamb-btn').addEventListener('click', function () {
  document.body.classList.toggle('open-mobile-menu');
});
document.getElementById('hamb-btn-mobile').addEventListener('click', function () {
  document.body.classList.toggle('open-mobile-menu');
}); //lazy

var lazyLoadInstance = new LazyLoad({}); // wow
// new WOW().init();
//scroll
// document.getElementById('scrollButton').addEventListener('click', function(event) {
//   event.preventDefault();
//   const targetElement = document.getElementById('news');
//   const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
//   window.scrollTo({
//     top: targetPosition,
//     behavior: 'smooth'
//   });
// });

document.querySelectorAll('.catalog-list a').forEach(function (link) {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    var brand = this.querySelector('img').alt.toLowerCase();
    var pageUrl = "catalog-template.html?brand=".concat(brand);
    window.location.href = pageUrl;
  });
});
document.querySelectorAll('.submenu a').forEach(function (link) {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    var brand = this.querySelector('img').alt.toLowerCase();
    var pageUrl = "catalog-template.html?brand=".concat(brand);
    window.location.href = pageUrl;
  });
}); //form

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('feedback_form');
  var nameFld = document.getElementById('exampleInputName');
  var telFld = document.getElementById('exampleInputTel');

  if (!form || !nameFld || !telFld) {
    console.error('Form or fields not found!');
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = nameFld.value ? nameFld.value.trim() : '';
    var tel = telFld.value ? telFld.value.trim() : '';
    var errors = []; // Очистка классов ошибок

    nameFld.classList.remove('is-invalid');
    telFld.classList.remove('is-invalid');

    if (name === '') {
      errors.push("Введіть, будь ласка, Ваше ім'я");
      nameFld.classList.add('is-invalid');
    } else if (name.length < 2) {
      errors.push('Ваше ім\'я занадто коротке');
      nameFld.classList.add('is-invalid');
    }

    if (tel === '' || tel.length < 17) {
      errors.push('Введіть, будь ласка, правильний номер телефону');
      telFld.classList.add('is-invalid');
    }

    if (errors.length > 0) {
      toast.error(errors.join('. '));
      return;
    }

    var CHAT_ID = '-1002278785620';
    var BOT_TOKEN = '8046931960:AAHhJdRaBEv_3zyB9evNFxZQlEdiz8FyWL8';
    var message = "<b>\u0406\u043C'\u044F: </b> ".concat(name, "\r\n<b>\u0422\u0435\u043B\u0435\u0444\u043E\u043D: </b>").concat(tel);
    var url = "https://api.telegram.org/bot".concat(BOT_TOKEN, "/sendMessage?chat_id=").concat(CHAT_ID, "&text=").concat(encodeURIComponent(message), "&parse_mode=HTML");
    fetch(url, {
      method: 'POST'
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data.ok) {
        nameFld.value = '';
        telFld.value = '';
        toast.success('Ваше повідомлення успішно надіслано.');
      } else {
        toast.error('Сталася помилка.');
      }
    })["catch"](function (error) {
      toast.error('Помилка: ' + error.message);
    });
  });

  if (telFld) {
    telFld.addEventListener('input', function (e) {
      var input = e.target.value.replace(/\D/g, ''); // Удаляем все нецифровые символы

      var prefix = '38'; // Префикс для Украины

      var maxLength = 12; // Максимальная длина номера

      if (!input.startsWith(prefix)) {
        input = prefix + input;
      }

      if (input.length > maxLength) {
        input = input.substring(0, maxLength);
      }

      var formattedInput = '+38';

      if (input.length > 2) {
        formattedInput += ' (' + input.substring(2, 5);
      }

      if (input.length > 5) {
        formattedInput += ') ' + input.substring(5, 8);
      }

      if (input.length > 8) {
        formattedInput += '-' + input.substring(8, 10);
      }

      if (input.length > 10) {
        formattedInput += '-' + input.substring(10, 12);
      }

      var cursorPosition = e.target.selectionStart;
      var prevLength = e.target.value.length;
      var newLength = formattedInput.length;
      var diff = newLength - prevLength;
      e.target.value = formattedInput;

      if (diff > 0 && cursorPosition >= prevLength) {
        e.target.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
      } else if (diff < 0 && cursorPosition > newLength) {
        e.target.setSelectionRange(newLength, newLength);
      } else {
        e.target.setSelectionRange(cursorPosition, cursorPosition);
      }
    });
  }

  nameFld.addEventListener('input', function (e) {
    var input = e.target.value;
    e.target.value = input.replace(/[^A-Za-zА-Яа-яІіЇїЄє']/g, '');
  });
  var currentYear = new Date().getFullYear();
  var yearElement = document.getElementById('year');

  if (yearElement) {
    yearElement.textContent = currentYear;
  }
});