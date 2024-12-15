"use strict";

//news
// document.addEventListener('DOMContentLoaded', function () {
//   fetch('assets/data/news_slider.json')
//     .then(response => response.json())  
//     .then(data => {
//       console.log('Fetched data:', data);
//       createNewsSlider('news_slider', data); 
//     })
//     .catch(error => console.error('Error fetching news data:', error));
// });
// function createNewsSlider(elementId, jsonData) {
//   console.log(jsonData)
//   if (!Array.isArray(jsonData)) {
//     console.error('Expected an array, but got:', jsonData);
//     return;
//   }
//   const sliderContainer = $("#" + elementId);
//   const ulElement = $("<ul></ul>");
//   jsonData.forEach((item, index) => {
//     const imageGalleryId = `image-gallery-${index}`;
//     const imageSlider = $(`<div class='image-gallery' id='${imageGalleryId}'></div>`);
//     item.images.forEach(image => {
//       const imageSlide = $(`<a href="${image}" ><img data-src="${image}" alt="${item.title}" class="lazy"></a>`);
//       imageSlider.append(imageSlide);
//     });
//     const slideElement = $(`<li>
//       <div class="slide">
//         <div class="slide-top"></div>
//         <div class="title">${item.title}</div>
//         <div class="vehicle-details">
//           <div><strong>Рік випуску:</strong> ${item.vehicle.year}</div>
//           <p><strong>VIN:</strong> ${item.vehicle.vin}</p>
//           <p><strong>Двигун:</strong> ${item.vehicle.engine}</p>
//           <p><strong>Коробка передач:</strong> ${item.vehicle.transmission}</p>
//           <p><strong>Колір кузова:</strong> ${item.vehicle.body_color}</p>
//           <p><strong>Привід:</strong> ${item.vehicle.drive}</p>
//         </div>
//       </div>
//     </li>`);
//     slideElement.find(".slide-top").append(imageSlider);
//     ulElement.append(slideElement);
//   });
//   sliderContainer.append(ulElement);
//   ulElement.lightSlider({
//     item: 3,
//     controls: true,
//     loop: true,
//     auto: true,
//     slideMove: 1,
//     slideMargin: 20,
//     pager: true,
//     verticalHeight: 1000,
//     responsive: [
//       {
//         breakpoint: 1200,
//         settings: {
//           item: 2,
//           slideMove: 1
//         }
//       },
//       {
//         breakpoint: 900,
//         settings: {
//           item: 1,
//           slideMove: 1
//         }
//       }
//     ]
//   });
//   setTimeout(() => {
//     $('.image-gallery').each(function () {
//       lightGallery(this, {
//         allowMediaOverlap: true,
//         toggleThumb: true
//       });
//     });
//   }, 100);
// }
document.addEventListener('DOMContentLoaded', function () {
  fetch('assets/data/news_slider.json').then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log('Fetched data:', data);
    createNewsSlider('news_slider', data);
  })["catch"](function (error) {
    return console.error('Error fetching news data:', error);
  });
});

function createNewsSlider(elementId, jsonData) {
  if (!Array.isArray(jsonData)) {
    console.error('Expected an array, but got:', jsonData);
    return;
  }

  var sliderContainer = $("#" + elementId);
  var ulElement = $("<ul></ul>");
  jsonData.forEach(function (item, index) {
    // Создаем галерею для изображений
    var imageGallery = item.images.map(function (image) {
      return "<a href=\"".concat(image, "\" data-fancybox=\"gallery-").concat(index, "\" data-caption=\"").concat(item.title, "\">\n        <img src=\"").concat(image, "\" alt=\"").concat(item.title, ">\n      </a>");
    }).join(""); // Создаем слайд с текстом и галереей

    var slideElement = $("\n      <li>\n        <div class=\"slide\">\n          <div class=\"slide-top\">".concat(imageGallery, "</div>\n          <div class=\"title\">").concat(item.title, "</div>\n          <div class=\"vehicle-details\">\n            <div><strong>\u0420\u0456\u043A \u0432\u0438\u043F\u0443\u0441\u043A\u0443:</strong> ").concat(item.vehicle.year, "</div>\n            <p><strong>VIN:</strong> ").concat(item.vehicle.vin, "</p>\n            <p><strong>\u0414\u0432\u0438\u0433\u0443\u043D:</strong> ").concat(item.vehicle.engine, "</p>\n            <p><strong>\u041A\u043E\u0440\u043E\u0431\u043A\u0430 \u043F\u0435\u0440\u0435\u0434\u0430\u0447:</strong> ").concat(item.vehicle.transmission, "</p>\n            <p><strong>\u041A\u043E\u043B\u0456\u0440 \u043A\u0443\u0437\u043E\u0432\u0430:</strong> ").concat(item.vehicle.body_color, "</p>\n            <p><strong>\u041F\u0440\u0438\u0432\u0456\u0434:</strong> ").concat(item.vehicle.drive, "</p>\n          </div>\n        </div>\n      </li>\n    "));
    ulElement.append(slideElement);
  });
  sliderContainer.append(ulElement); // Инициализация LightSlider

  ulElement.lightSlider({
    item: 3,
    controls: true,
    loop: true,
    auto: true,
    slideMove: 1,
    slideMargin: 20,
    pager: true,
    verticalHeight: 1000,
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