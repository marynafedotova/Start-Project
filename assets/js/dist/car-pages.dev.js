"use strict";

window.onload = function () {
  var params = new URLSearchParams(window.location.search);
  var markaavto = decodeURIComponent(params.get('make'));
  var model = decodeURIComponent(params.get('model'));
  var year = decodeURIComponent(params.get('year'));
  var categoryMap = {
    "Інтер'єр/салон": 'interior',
    "Двигун": 'engine',
    "Кузов": 'body',
    "Електрика": 'electronics',
    "Запчастини ІНШІ": 'parts',
    "Гальмівна система": 'brake-system',
    "Підвіска та рульове": 'suspension',
    "Двері": 'doors',
    "Кріплення": 'fasteners',
    "Трансмісія": 'transmission',
    "Колеса": 'wheels',
    "Замок багажника": 'trunk-lock'
  };

  if (!markaavto || !model || !year) {
    document.getElementById('car-info').innerHTML = "<p>Некоректні параметри URL.</p>";
    return;
  }

  fetch('../data/data_ukr.json').then(function (response) {
    if (!response.ok) {
      throw new Error("HTTP error! status: ".concat(response.status));
    }

    return response.json();
  }).then(function (data) {
    var carsArray = data.Sheet1;
    var carData = carsArray.filter(function (car) {
      return car.markaavto && car.markaavto.trim().toLowerCase() === markaavto.trim().toLowerCase() && car.model && car.model.trim().toLowerCase() === model.trim().toLowerCase() && car.god && car.god.trim() === year.trim();
    });

    if (carData.length > 0) {
      var partsByCategory = {};
      var totalParts = 0;
      carData.forEach(function (car) {
        var categories = car.category ? car.category.split(',').map(function (cat) {
          return cat.trim();
        }) : ['ІНШІ'];
        categories.forEach(function (category) {
          if (!partsByCategory[category]) {
            partsByCategory[category] = 0;
          }

          partsByCategory[category]++;
          totalParts++;
        });
      });
      var images = carData[0].pictures ? carData[0].pictures.split(',').map(function (url) {
        return url.trim();
      }) : [];
      var carInfoElement = document.getElementById('car-info');
      carInfoElement.innerHTML = "\n          <h2>".concat(markaavto, " ").concat(model, " (").concat(year, ")</h2>\n          <div class=\"car-info-card\">\n            <div class=\"car-info-img\">\n              ").concat(images.map(function (img) {
        return "<img src=\"".concat(img, "\" alt=\"").concat(markaavto, " ").concat(model, "\" />");
      }).join(''), "\n              </div>\n                <div class=\"car-info-total\">\u0417\u0430\u0433\u0430\u043B\u044C\u043D\u0430 \u043A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0434\u0435\u0442\u0430\u043B\u0435\u0439: \n                <div class=\"totalParts\">").concat(totalParts, "\n              </div>\n            </div>\n          </div>\n        "); // Добавляем количество деталей в заголовки вкладок с кликабельными ссылками

      Object.keys(partsByCategory).forEach(function (categoryName) {
        var categoryId = categoryMap[categoryName];
        var tabTitleElement = document.querySelector("#tab-titles li a[href=\"#".concat(categoryId, "\"]"));

        if (tabTitleElement) {
          var newUrl = "product-category.html?category=".concat(encodeURIComponent(categoryName), "&make=").concat(encodeURIComponent(markaavto), "&model=").concat(encodeURIComponent(model), "&year=").concat(encodeURIComponent(year));
          tabTitleElement.innerHTML = "".concat(categoryName, " <div class=\"sum-details\">(").concat(partsByCategory[categoryName], ")</div>");
          tabTitleElement.href = newUrl;
        }

        var tabContentElement = document.getElementById(categoryId);

        if (tabContentElement) {
          tabContentElement.style.display = "block";
          tabContentElement.innerHTML = "\n              <h3>".concat(categoryName, "</h3>\n              <p>\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0434\u0435\u0442\u0430\u043B\u0435\u0439: <div class=\"parts-count\">").concat(partsByCategory[categoryName], "</div></p>\n            ");
        }
      });
      console.log("Загальна кількість деталей:", totalParts);
      console.log("Деталі по категоріях:", partsByCategory);
    } else {
      document.getElementById('car-info').innerHTML = "<p>Цей автомобіль не знайдено.</p>";
    }
  })["catch"](function (error) {
    console.error('Помилка при завантаженні даних:', error);
    document.getElementById('car-info').innerHTML = "<p>Сталася помилка під час завантаження даних.</p>";
  });
};