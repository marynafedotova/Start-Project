"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

document.addEventListener("DOMContentLoaded", function () {
  var params = new URLSearchParams(window.location.search);
  var category = decodeURIComponent(params.get('category')).toLowerCase();
  var markaavto = decodeURIComponent(params.get('make')).toLowerCase();
  var model = decodeURIComponent(params.get('model')).toLowerCase();
  var year = decodeURIComponent(params.get('year'));
  console.log("Отримані параметри:", {
    category: category,
    markaavto: markaavto,
    model: model,
    year: year
  });
  fetch('../data/data_ukr.json').then(function (response) {
    return response.json();
  }).then(function (data) {
    var carsArray = data.Sheet1.map(function (car) {
      return _objectSpread({}, car, {
        category: car.category && car.category.toLowerCase(),
        markaavto: car.markaavto && car.markaavto.toLowerCase(),
        model: car.model && car.model.toLowerCase(),
        god: car.god ? Math.floor(car.god) : null
      });
    });
    console.log("Дані з бази даних:", carsArray);
    var filteredParts;
    var alternativeMessage = '';
    var isYearNull = year === "null";
    filteredParts = carsArray.filter(function (car) {
      return car.category === category && car.markaavto === markaavto && car.model === model && (!isYearNull ? car.god === parseInt(year) : true);
    });
    console.log("Результат після першого фільтрування (повний збіг):", filteredParts);

    if (filteredParts.length === 0) {
      filteredParts = carsArray.filter(function (car) {
        return car.category === category && car.markaavto === markaavto && car.model === model;
      });
      alternativeMessage = "Підходящі запчастини в цій категорії не знайдені, але можливо вас зацікавлять інші варіанти для цієї моделі.";
      console.log("Результат після другого фільтрування (категорія, марка, модель):", filteredParts);

      if (filteredParts.length === 0) {
        filteredParts = carsArray.filter(function (car) {
          return car.category === category && car.markaavto === markaavto && (!isYearNull ? car.god === parseInt(year) : true);
        });
        alternativeMessage = "Підходящі запчастини в цій категорії не знайдені, але можливо вас зацікавлять інші варіанти для цієї марки і року.";
        console.log("Результат після третього фільтрування (категорія, марка, рік):", filteredParts);

        if (filteredParts.length === 0) {
          filteredParts = carsArray.filter(function (car) {
            return car.category === category && car.markaavto === markaavto;
          });
          alternativeMessage = "Підходящі запчастини в цій категорії не знайдені, але можливо вас зацікавлять інші варіанти для цієї марки.";
          console.log("Результат після четвертого фільтрування (категорія і марка):", filteredParts);

          if (filteredParts.length === 0) {
            filteredParts = carsArray.filter(function (car) {
              return car.markaavto === markaavto;
            });
            alternativeMessage = "Запчастини для цієї марки авто:";
            console.log("Результат після п'ятого фільтрування (тільки марка):", filteredParts);
          }
        }
      }
    }

    var partsContainer = document.querySelector('.product-list');

    if (filteredParts.length > 0) {
      partsContainer.innerHTML = "\n          ".concat(alternativeMessage ? "<p>".concat(alternativeMessage, "</p>") : '', "\n          ").concat(filteredParts.map(function (part) {
        return "\n            <div class=\"product-card\">\n              <img src=\"".concat(part.photo.split(',')[0].trim(), "\" alt=\"").concat(part.zapchast, "\" width=\"100%\">\n              <h2>\u0410\u0440\u0442\u0438\u043A\u0443\u043B: ").concat(part.ID_EXT, "</h2>\n              <h3>").concat(part.zapchast, "</h3>\n              <p>\u0426\u0456\u043D\u0430: ").concat(part.zena, " ").concat(part.valyuta, " / ").concat((parseFloat(part.zena) * usdToUahRate).toFixed(2), " \u0433\u0440\u043D</p>\n              <div class=\"btn-cart\">\n                <button class=\"add-to-cart\" \n                        data-id=\"").concat(part.ID_EXT, "\"\n                        data-price=\"").concat(part.zena, "\"\n                        data-name=\"").concat(part.zapchast, "\"\n                        data-photo=\"").concat(part.photo, "\">\n                  \u0414\u043E\u0434\u0430\u0442\u0438 \u0434\u043E \u043A\u043E\u0448\u0438\u043A\u0430\n                </button>\n              </div>\n              <div class=\"product_btn\">\n                <a href=\"product.html?id=").concat(part.ID_EXT, "\">\u0414\u0435\u0442\u0430\u043B\u044C\u043D\u0456\u0448\u0435</a>\n              </div>\n            </div>\n          ");
      }).join(''), "\n        ");
    } else {
      partsContainer.innerHTML = "<p>Запчастини для цієї категорії не знайдені.</p>";
    }

    fetch('https://api.monobank.ua/bank/currency').then(function (response) {
      return response.json();
    }).then(function (currencyData) {
      var usdRate = currencyData.find(function (currency) {
        return currency.currencyCodeA === 840 && currency.currencyCodeB === 980;
      });

      if (!usdRate) {
        throw new Error('Курс валюты не знайдено');
      }

      var usdToUahRate = usdRate.rate; // Курс USD → UAH

      var parts = document.querySelectorAll('.product-card');
      parts.forEach(function (part) {
        var priceElement = part.querySelector('p'); // Ищем элемент p с ценой

        if (priceElement) {
          var priceInUsd = parseFloat(part.zena); // Конвертация строки в число

          var priceInUah = (priceInUsd * usdToUahRate).toFixed(2); // Конвертируем цену в гривны

          priceElement.textContent = "\u0426\u0456\u043D\u0430: ".concat(priceInUsd, " ").concat(part.valyuta, " / ").concat(priceInUah, " \u0433\u0440\u043D"); // Обновляем текст цены
        }
      });
    })["catch"](function (error) {
      console.error('Ошибка при получении курса валюты:', error); // Обработать ошибки при отсутствии курса
    });
  })["catch"](function (error) {
    console.error('Помилка при завантаженні даних:', error);
    document.querySelector('.product-list').innerHTML = "<p>Помилка при завантаженні даних.</p>";
  });
});