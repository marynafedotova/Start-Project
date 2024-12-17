"use strict";

//header
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
//baner slider
// $(document).ready(function() {
//   $('#baner').lightSlider({
//     item: 1,
//     controls: false,
//     loop: true,
//     auto: true,
//     slideMove: 1,
//     slideMargin: 0,
//     speed: 900
//         });
// });
//advantages slider

document.addEventListener('DOMContentLoaded', function () {
  fetch('assets/data/advantages.json').then(function (response) {
    return response.json();
  }).then(function (data) {
    createAdvantagesSlider('advantages_slider', data);
  })["catch"](function (error) {
    return console.error('Error fetching data:', error);
  });
});

function createAdvantagesSlider(elementId, jsonData) {
  var sliderContainer = $("#" + elementId);
  var ulElement = $("<ul></ul>");
  jsonData.forEach(function (item) {
    var slideElement = $("\n      <li>\n      <div class=\"adventages-slide\">\n        <img src=\"".concat(item.image, "\" alt=\"").concat(item.text, "\">\n        <div class=\"adventages-text\">").concat(item.text, "</div>\n      </li>\n      </div>\n    "));
    ulElement.append(slideElement);
  });
  sliderContainer.append(ulElement);
  ulElement.lightSlider({
    item: 2,
    controls: true,
    loop: true,
    auto: true,
    slideMove: 1,
    slideMargin: 20,
    pager: true,
    responsive: [{
      breakpoint: 1200,
      settings: {
        item: 2,
        slideMove: 1
      }
    }, {
      breakpoint: 900,
      settings: {
        item: 1,
        slideMove: 1
      }
    }]
  });
}

function createAdvantagesGallery(elementId, jsonData) {
  var galleryContainer = $("#" + elementId);
  jsonData.forEach(function (item) {
    var linkElement = $("<a href=\"".concat(item.image, "\" title=\"").concat(item.text, "\" data-gallery><img src=\"").concat(item.image, "\" alt=\"").concat(item.text, "\"></a>"));
    galleryContainer.append(linkElement);
  }); // Инициализация Blueimp Gallery

  $("#links").on("click", "a", function (event) {
    event.preventDefault();
    blueimp.Gallery($("#links a").toArray(), {
      container: "#blueimp-gallery",
      carousel: true
    });
  });
}

var urlMonoBank = 'https://api.monobank.ua/bank/currency';
var products = [];
var usdToUahRate = 37;
var displayedProductCount = 0;
var PRODUCTS_PER_PAGE = 12;

function fetchCurrencyRate() {
  var cachedRate, cachedTime, now, response, data, usdToUah;
  return regeneratorRuntime.async(function fetchCurrencyRate$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          cachedRate = localStorage.getItem('usdToUahRate');
          cachedTime = localStorage.getItem('usdToUahRateTime');
          now = Date.now();

          if (!(cachedRate && cachedTime && now - cachedTime < 5 * 60 * 1000)) {
            _context.next = 7;
            break;
          }

          usdToUahRate = parseFloat(cachedRate);
          return _context.abrupt("return");

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(fetch(urlMonoBank));

        case 9:
          response = _context.sent;

          if (response.ok) {
            _context.next = 12;
            break;
          }

          throw new Error('Не удалось получить курс валют');

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
          _context.t0 = _context["catch"](0);
          console.error('Ошибка при получении курса валют:', _context.t0);

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 19]]);
} // Функция для получения продуктов


function fetchProducts() {
  var response, data;
  return regeneratorRuntime.async(function fetchProducts$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetch('assets/data/data_ukr.json'));

        case 3:
          response = _context2.sent;

          if (response.ok) {
            _context2.next = 6;
            break;
          }

          throw new Error('Не удалось загрузить продукты');

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          data = _context2.sent;

          if (!(!data.Sheet1 || !Array.isArray(data.Sheet1))) {
            _context2.next = 11;
            break;
          }

          throw new Error('Некорректный формат данных');

        case 11:
          products = data.Sheet1;
          console.log('Loaded products:', products);
          _context2.next = 18;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          console.error('Ошибка при получении данных продуктов:', _context2.t0);

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
} // Функция для отображения продуктов


function displayProducts(filteredProducts) {
  var productContainer = document.querySelector('.search-results');
  var loadMoreButton = document.querySelector('.load-more-search');

  if (!productContainer || !loadMoreButton) {
    console.error('Контейнер для товаров или кнопка "Загрузить ещё" не найдены');
    return;
  } // Если это первая загрузка, очищаем контейнер


  if (displayedProductCount === 0) {
    productContainer.innerHTML = '';
  } // Определяем текущий диапазон отображаемых товаров


  var productsToDisplay = filteredProducts.slice(displayedProductCount, displayedProductCount + PRODUCTS_PER_PAGE);
  productsToDisplay.forEach(function (product) {
    var priceInUah = Math.ceil(product.zena * usdToUahRate);
    var photoUrl = product.photo ? product.photo.split(',')[0].trim() : 'default-photo.jpg';
    var productCard = "\n      <div class=\"product-card\">\n        <img src=\"".concat(photoUrl, "\" alt=\"").concat(product.zapchast, "\">\n        <div>\u0410\u0440\u0442\u0438\u043A\u0443\u043B: ").concat(product.ID_EXT, "</div>\n        <h3>").concat(product.zapchast, "</h3>\n        <p>\u0426\u0435\u043D\u0430: ").concat(product.zena, " ").concat(product.valyuta, " / ").concat(priceInUah, " \u0433\u0440\u043D</p>\n        <div class=\"btn-cart\">\n          <button class=\"add-to-cart\" \n                  data-id=\"").concat(product.ID_EXT, "\" \n                  data-name=\"").concat(product.zapchast, "\" \n                  data-price=\"").concat(priceInUah, "\" \n                  data-photo=\"").concat(photoUrl, "\">\n              \u0414\u043E\u0434\u0430\u0442\u0438 \u0434\u043E \u043A\u043E\u0448\u0438\u043A\u0430\n          </button>\n        </div>\n        <div class=\"product_btn\">\n          <a href=\"assets/pages/product.html?id=").concat(product.ID_EXT, "\">\u0414\u0435\u0442\u0430\u043B\u044C\u043D\u0456\u0448\u0435</a>\n        </div>\n      </div>");
    productContainer.insertAdjacentHTML('beforeend', productCard);
  }); // Обновляем счетчик отображенных товаров

  displayedProductCount += productsToDisplay.length; // Показываем или скрываем кнопку "Загрузить ещё"

  if (displayedProductCount < filteredProducts.length) {
    loadMoreButton.style.display = 'block';
  } else {
    loadMoreButton.style.display = 'none';
  }
} //cart
// Обработчик для кнопок добавления товара в корзину


document.addEventListener('click', function (event) {
  if (event.target.classList.contains('add-to-cart')) {
    var item = {
      id: event.target.dataset.id,
      name: event.target.dataset.name,
      price: parseFloat(event.target.dataset.price || 0),
      quantity: 1,
      photo: event.target.dataset.photo
    };
    addToCart(item);
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
    document.body.style.overflow = ""; // Разрешаем прокрутку страницы, если была заблокирована
  } else {
    console.error('Модальное окно или затемняющий фон не найдены!');
  }
} // Функция для перехода к оформлению заказа


function proceedToCheckout() {
  closeCartModal();
  window.location.href = "assets/pages/cart.html";
}

document.getElementById('continueShopping').addEventListener('click', function (event) {
  event.preventDefault(); // Отменяет переход по ссылке

  closeCartModal();
}); // Обработчик кнопки "Загрузить ещё"

document.querySelector('.load-more-search').addEventListener('click', function (event) {
  event.preventDefault();
  var query = document.getElementById('search-input').value.trim().toLowerCase();
  var filteredProducts = products.filter(function (product) {
    return product.ID_EXT && product.ID_EXT.toLowerCase().includes(query) || product.zapchast && product.zapchast.toLowerCase().includes(query) || product.markaavto && product.markaavto.toLowerCase().includes(query) || product.model && product.model.toLowerCase().includes(query) || product.category && product.category.toLowerCase().includes(query) || product.dop_category && product.dop_category.toLowerCase().includes(query) || product.originalnumber && product.originalnumber.toLowerCase().includes(query);
  });
  displayProducts(filteredProducts);
}); // Обработчик формы поиска

document.getElementById('search-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Отменяем стандартное поведение формы (перезагрузка страницы)

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
}); // Инициализация

function initialize() {
  return regeneratorRuntime.async(function initialize$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(fetchCurrencyRate());

        case 2:
          _context3.next = 4;
          return regeneratorRuntime.awrap(fetchProducts());

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
} // Запуск


initialize(); // Код для обработки кликов по ссылкам

document.querySelectorAll('.submenu a').forEach(function (link) {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    var brand = this.querySelector('img').alt.toLowerCase();
    var pageUrl = "assets/pages/catalog-template.html?brand=".concat(brand);
    window.location.href = pageUrl;
  });
});
document.querySelectorAll('.catalog-list a').forEach(function (link) {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    var brand = this.querySelector('img').alt.toLowerCase();
    var pageUrl = "assets/pages/catalog-template.html?brand=".concat(brand);
    window.location.href = pageUrl;
  });
}); // form

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
}); //copiraite

document.addEventListener("DOMContentLoaded", function () {
  var currentYear = new Date().getFullYear();
  document.getElementById("year").textContent = currentYear;
});