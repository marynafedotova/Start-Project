fetch("../data/news.json")
  .then(response => response.json())
  .then(newsData => {
    createAccordion(newsData);
  })
  .catch(error => console.error('Ошибка загрузки данных:', error));

function createAccordion(news) {
  const accordionContainer = document.getElementById('news-accordion');
  
  news.forEach((item, index) => {
    const newsItem = document.createElement('div');
    newsItem.classList.add('news-item');

    const title = document.createElement('h3');
    title.innerText = item.title;
    title.classList.add('accordion-title');
    title.setAttribute('data-index', index);

    const content = document.createElement('div');
    content.classList.add('accordion-content');
    content.style.display = 'none';

    // Генерация галереи изображений
    const gallery = document.createElement('div');
    gallery.classList.add('gallery');
    gallery.id = `gallery-${index}`; // Уникальный ID для каждой галереи

    item.images.forEach((imgSrc, imgIndex) => {
      const imgLink = document.createElement('a');
      imgLink.href = imgSrc; // Используем относительный путь
      imgLink.setAttribute('data-lg-size', '1406-1390'); // Размер для lightGallery

      const img = document.createElement('img');
      img.src = imgSrc; // Используем относительный путь
      img.alt = `Image ${imgIndex + 1}`;

      imgLink.appendChild(img);
      gallery.appendChild(imgLink);
    });

    // Добавление информации о транспортном средстве
    const vehicleInfo = document.createElement('div');
    vehicleInfo.classList.add('vehicle-info');
    vehicleInfo.innerHTML = `
      <p><span class="news-item-title">Рік випуску:</span> ${item.vehicle.year}</p>
      <p><span class="news-item-title">VIN:</span>  ${item.vehicle.vin}</p>
      <p><span class="news-item-title">Двигун:</span>  ${item.vehicle.engine}</p>
      <p><span class="news-item-title">Коробка передач:</span>  ${item.vehicle.transmission}</p>
      <p><span class="news-item-title">Колір кузова:</span>  ${item.vehicle.body_color}</p>
      <p><span class="news-item-title">Привід:</span>  ${item.vehicle.drive}</p>
    `;

    content.appendChild(gallery);
    content.appendChild(vehicleInfo); // Добавление информации о транспортном средстве
    newsItem.appendChild(title);
    newsItem.appendChild(content);
    accordionContainer.appendChild(newsItem);

    // Добавление функционала аккордеона
    title.addEventListener('click', function () {
      const isVisible = content.style.display === 'block';
      content.style.display = isVisible ? 'none' : 'block';

      // Инициализация lightGallery при открытии аккордеона
      if (!isVisible) {
        lightGallery(document.getElementById(`gallery-${index}`), {
          plugins: [lgZoom, lgThumbnail],
          speed: 500
        });
      }
    });
  });
}
