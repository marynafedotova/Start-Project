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
  fetch('assets/data/news_slider.json')
    .then(response => response.json())
    .then(data => {
      console.log('Fetched data:', data);
      createNewsSlider('news_slider', data);
    })
    .catch(error => console.error('Error fetching news data:', error));
});

function createNewsSlider(elementId, jsonData) {
  if (!Array.isArray(jsonData)) {
    console.error('Expected an array, but got:', jsonData);
    return;
  }

  const sliderContainer = $("#" + elementId);
  const ulElement = $("<ul></ul>");

  jsonData.forEach((item, index) => {
    // Создаем галерею для изображений
    const imageGallery = item.images
      .map(image => `<a href="${image}" data-fancybox="gallery-${index}" data-caption="${item.title}">
        <img src="${image}" alt="${item.title}>
      </a>`)
      .join("");

    // Создаем слайд с текстом и галереей
    const slideElement = $(`
      <li>
        <div class="slide">
          <div class="slide-top">${imageGallery}</div>
          <div class="title">${item.title}</div>
          <div class="vehicle-details">
            <div><strong>Рік випуску:</strong> ${item.vehicle.year}</div>
            <p><strong>VIN:</strong> ${item.vehicle.vin}</p>
            <p><strong>Двигун:</strong> ${item.vehicle.engine}</p>
            <p><strong>Коробка передач:</strong> ${item.vehicle.transmission}</p>
            <p><strong>Колір кузова:</strong> ${item.vehicle.body_color}</p>
            <p><strong>Привід:</strong> ${item.vehicle.drive}</p>
          </div>
        </div>
      </li>
    `);

    ulElement.append(slideElement);
  });

  sliderContainer.append(ulElement);

  // Инициализация LightSlider
  ulElement.lightSlider({
    item: 3,
    controls: true,
    loop: true,
    auto: true,
    slideMove: 1,
    slideMargin: 20,
    pager: true,
    verticalHeight: 1000,
    responsive: [
      {
        breakpoint: 1200,
        settings: { item: 2, slideMove: 1 }
      },
      {
        breakpoint: 900,
        settings: { item: 1, slideMove: 1 }
      }
    ]
  });
}
