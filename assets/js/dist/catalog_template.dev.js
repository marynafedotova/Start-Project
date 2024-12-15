"use strict";

document.querySelectorAll('.submenu a').forEach(function (link) {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    var imgElement = this.querySelector('img');

    if (imgElement && imgElement.alt) {
      var brand = imgElement.alt.toLowerCase();
      var pageUrl = "catalog-template.html?brand=".concat(brand);
      window.location.href = pageUrl;
    } else {
      console.error('Атрибут alt у изображения не найден.');
    }
  });
});
document.addEventListener('DOMContentLoaded', function () {
  var urlParams = new URLSearchParams(window.location.search);
  var brand = urlParams.get('brand');
  var brandData = {
    acura: {
      title: 'Acura Catalog',
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Acura.'
    },
    audi: {
      title: 'Audi Catalog',
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Audi.'
    },
    bmw: {
      title: 'BMW Catalog',
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки BMW.'
    },
    crysler: {
      title: 'Chrysler Catalog',
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Chrysler.'
    },
    dodge: {
      title: 'Dodge Catalog',
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Dodge.'
    },
    honda: {
      title: 'Honda Catalog',
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Honda.'
    },
    hyundai: {
      title: 'Hyundai Catalog',
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Hyundai.'
    },
    infiniti: {
      title: 'Infiniti Catalog',
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Infiniti.'
    },
    jaguar: {
      title: 'Jaguar Catalog',
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Jaguar.'
    },
    jeep: {
      title: 'Jeep Catalog',
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Jeep.'
    },
    lincoln: {
      title: 'Lincoln Catalog',
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Lincoln.'
    },
    kia: {
      title: 'Kia Catalog',
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Kia.'
    },
    land_rover: {
      title: 'Land Rover Catalog',
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів маркиLand Rover.'
    },
    nissan: {
      title: 'Nissan Catalog',
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Nissan.'
    },
    volkswagen: {
      title: 'Volkswagen Catalog',
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Volkswagen.'
    }
  };

  if (brand && brandData[brand]) {
    document.getElementById('brand-title').textContent = brandData[brand].title;
    document.getElementById('brand-description').textContent = brandData[brand].description;
  } else {
    var contentElement = document.getElementById('content');

    if (contentElement) {
      contentElement.innerHTML = '<p>Бренд не найден.</p>';
    } else {
      console.error('Элемент с id="content" не найден.');
    }
  }
});

function loadData() {
  var response, data;
  return regeneratorRuntime.async(function loadData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch('../data/data_ukr.json'));

        case 3:
          response = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(response.json());

        case 6:
          data = _context.sent;
          return _context.abrupt("return", data.Sheet1);

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error('Ошибка загрузки данных:', _context.t0);
          return _context.abrupt("return", []);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

function groupByUniqueCars(cars) {
  var uniqueCars = new Map();
  cars.forEach(function (car) {
    var key = "".concat(car.markaavto.toLowerCase(), "-").concat(car.model.toLowerCase(), "-").concat(car.god);

    if (!uniqueCars.has(key)) {
      uniqueCars.set(key, car);
    }
  });
  return Array.from(uniqueCars.values());
}

function filterCars(cars, brand) {
  var minYear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2000;
  var filteredCars = cars.filter(function (car) {
    return car.markaavto && car.markaavto.toLowerCase() === brand.toLowerCase() && car.god >= minYear;
  });
  return groupByUniqueCars(filteredCars);
}

function createCarCards(brand) {
  var minYear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;
  loadData().then(function (cars) {
    var filteredCars = filterCars(cars, brand, minYear);
    var catalogElement = document.getElementById('cars-catalog');

    if (!catalogElement) {
      console.error('Элемент с id="cars-catalog" не найден.');
      return;
    }

    catalogElement.innerHTML = '';

    if (filteredCars.length === 0) {
      catalogElement.innerHTML = '<p>Нет автомобилей для отображения по выбранному фильтру.</p>';
      return;
    }

    filteredCars.forEach(function (car) {
      var card = document.createElement('div');
      card.classList.add('car-card');
      card.innerHTML = "\n        <img src=\"".concat(car.pictures.split(',')[0], "\" alt=\"").concat(car.model, "\">\n        <div class=\"car-details\">\n          <h2>").concat(car.markaavto, " ").concat(car.model, "</h2>\n          <p>\u0420\u0456\u043A: ").concat(car.god, "</p>\n          <button class=\"view-details-btn\" data-make=\"").concat(car.markaavto, "\" data-model=\"").concat(car.model, "\" data-year=\"").concat(car.god, "\">\u0414\u0435\u0442\u0430\u043B\u044C\u043D\u0456\u0448\u0435</button>\n        </div>\n      ");
      catalogElement.appendChild(card);
    });
    document.querySelectorAll('.view-details-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        var make = this.dataset.make;
        var model = this.dataset.model;
        var year = this.dataset.year;
        window.location.href = "car-page.html?make=".concat(make, "&model=").concat(model, "&year=").concat(year);
      });
    });
  })["catch"](function (error) {
    console.error('Ошибка при создании карточек:', error);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var urlParams = new URLSearchParams(window.location.search);
  var brand = urlParams.get('brand');

  if (brand) {
    createCarCards(brand);
  }
});