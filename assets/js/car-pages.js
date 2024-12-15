window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const markaavto = decodeURIComponent(params.get('make'));
  const model = decodeURIComponent(params.get('model'));
  const year = decodeURIComponent(params.get('year'));

  const categoryMap = {
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
    "Замок багажника": 'trunk-lock',
  };

  if (!markaavto || !model || !year) {
    document.getElementById('car-info').innerHTML = "<p>Некоректні параметри URL.</p>";
    return;
  }

  fetch('../data/data_ukr.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const carsArray = data.Sheet1;

      const carData = carsArray.filter(car =>
        car.markaavto && car.markaavto.trim().toLowerCase() === markaavto.trim().toLowerCase() &&
        car.model && car.model.trim().toLowerCase() === model.trim().toLowerCase() &&
        car.god && car.god.trim() === year.trim()
      );

      if (carData.length > 0) {
        const partsByCategory = {};
        let totalParts = 0;

        carData.forEach(car => {
          const categories = car.category ? car.category.split(',').map(cat => cat.trim()) : ['ІНШІ'];
          categories.forEach(category => {
            if (!partsByCategory[category]) {
              partsByCategory[category] = 0;
            }
            partsByCategory[category]++;
            totalParts++;
          });
        });

        const images = carData[0].pictures ? carData[0].pictures.split(',').map(url => url.trim()) : [];

        const carInfoElement = document.getElementById('car-info');
        carInfoElement.innerHTML = `
          <h2>${markaavto} ${model} (${year})</h2>
          <div class="car-info-card">
            <div class="car-info-img">
              ${images.map(img => `<img src="${img}" alt="${markaavto} ${model}" />`).join('')}
              </div>
                <div class="car-info-total">Загальна кількість деталей: 
                <div class="totalParts">${totalParts}
              </div>
            </div>
          </div>
        `;

        // Добавляем количество деталей в заголовки вкладок с кликабельными ссылками
        Object.keys(partsByCategory).forEach(categoryName => {
          const categoryId = categoryMap[categoryName];
          const tabTitleElement = document.querySelector(`#tab-titles li a[href="#${categoryId}"]`);

          if (tabTitleElement) {
            const newUrl = `product-category.html?category=${encodeURIComponent(categoryName)}&make=${encodeURIComponent(markaavto)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`;
            tabTitleElement.innerHTML = `${categoryName} <div class="sum-details">(${partsByCategory[categoryName]})</div>`;
            tabTitleElement.href = newUrl;
          }

          const tabContentElement = document.getElementById(categoryId);
          if (tabContentElement) {
            tabContentElement.style.display = "block";
            tabContentElement.innerHTML = `
              <h3>${categoryName}</h3>
              <p>Кількість деталей: <div class="parts-count">${partsByCategory[categoryName]}</div></p>
            `;
          }
        });

        console.log("Загальна кількість деталей:", totalParts);
        console.log("Деталі по категоріях:", partsByCategory);

      } else {
        document.getElementById('car-info').innerHTML = "<p>Цей автомобіль не знайдено.</p>";
      }
    })
    .catch(error => {
      console.error('Помилка при завантаженні даних:', error);
      document.getElementById('car-info').innerHTML = "<p>Сталася помилка під час завантаження даних.</p>";
    });
};
