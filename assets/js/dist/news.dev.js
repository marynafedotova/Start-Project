"use strict";

fetch("../data/news.json").then(function (response) {
  return response.json();
}).then(function (newsData) {
  createAccordion(newsData);
})["catch"](function (error) {
  return console.error('Ошибка загрузки данных:', error);
});

function createAccordion(news) {
  var accordionContainer = document.getElementById('news-accordion');
  news.forEach(function (item, index) {
    var newsItem = document.createElement('div');
    newsItem.classList.add('news-item');
    var title = document.createElement('h3');
    title.innerText = item.title;
    title.classList.add('accordion-title');
    title.setAttribute('data-index', index);
    var content = document.createElement('div');
    content.classList.add('accordion-content');
    content.style.display = 'none'; // Генерация галереи изображений

    var gallery = document.createElement('div');
    gallery.classList.add('gallery');
    gallery.id = "gallery-".concat(index); // Уникальный ID для каждой галереи

    item.images.forEach(function (imgSrc, imgIndex) {
      var imgLink = document.createElement('a');
      imgLink.href = imgSrc; // Используем относительный путь

      imgLink.setAttribute('data-lg-size', '1406-1390'); // Размер для lightGallery

      var img = document.createElement('img');
      img.src = imgSrc; // Используем относительный путь

      img.alt = "Image ".concat(imgIndex + 1);
      imgLink.appendChild(img);
      gallery.appendChild(imgLink);
    }); // Добавление информации о транспортном средстве

    var vehicleInfo = document.createElement('div');
    vehicleInfo.classList.add('vehicle-info');
    vehicleInfo.innerHTML = "\n      <p><span class=\"news-item-title\">\u0420\u0456\u043A \u0432\u0438\u043F\u0443\u0441\u043A\u0443:</span> ".concat(item.vehicle.year, "</p>\n      <p><span class=\"news-item-title\">VIN:</span>  ").concat(item.vehicle.vin, "</p>\n      <p><span class=\"news-item-title\">\u0414\u0432\u0438\u0433\u0443\u043D:</span>  ").concat(item.vehicle.engine, "</p>\n      <p><span class=\"news-item-title\">\u041A\u043E\u0440\u043E\u0431\u043A\u0430 \u043F\u0435\u0440\u0435\u0434\u0430\u0447:</span>  ").concat(item.vehicle.transmission, "</p>\n      <p><span class=\"news-item-title\">\u041A\u043E\u043B\u0456\u0440 \u043A\u0443\u0437\u043E\u0432\u0430:</span>  ").concat(item.vehicle.body_color, "</p>\n      <p><span class=\"news-item-title\">\u041F\u0440\u0438\u0432\u0456\u0434:</span>  ").concat(item.vehicle.drive, "</p>\n    ");
    content.appendChild(gallery);
    content.appendChild(vehicleInfo); // Добавление информации о транспортном средстве

    newsItem.appendChild(title);
    newsItem.appendChild(content);
    accordionContainer.appendChild(newsItem); // Добавление функционала аккордеона

    title.addEventListener('click', function () {
      var isVisible = content.style.display === 'block';
      content.style.display = isVisible ? 'none' : 'block'; // Инициализация lightGallery при открытии аккордеона

      if (!isVisible) {
        lightGallery(document.getElementById("gallery-".concat(index)), {
          plugins: [lgZoom, lgThumbnail],
          speed: 500
        });
      }
    });
  });
}