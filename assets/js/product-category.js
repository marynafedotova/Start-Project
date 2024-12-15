document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const category = decodeURIComponent(params.get('category')).toLowerCase();
  const markaavto = decodeURIComponent(params.get('make')).toLowerCase();
  const model = decodeURIComponent(params.get('model')).toLowerCase();
  const year = decodeURIComponent(params.get('year'));

  console.log("Отримані параметри:", { category, markaavto, model, year });

  fetch('../data/data_ukr.json')
    .then(response => response.json())
    .then(data => {
      const carsArray = data.Sheet1.map(car => ({
        ...car,
        category: car.category && car.category.toLowerCase(),
        markaavto: car.markaavto && car.markaavto.toLowerCase(),
        model: car.model && car.model.toLowerCase(),
        god: car.god ? Math.floor(car.god) : null
      }));

      console.log("Дані з бази даних:", carsArray);

      let filteredParts;
      let alternativeMessage = '';

      const isYearNull = year === "null"; 

      filteredParts = carsArray.filter(car =>
        car.category === category &&
        car.markaavto === markaavto &&
        car.model === model &&
        (!isYearNull ? car.god === parseInt(year) : true)
      );
      console.log("Результат після першого фільтрування (повний збіг):", filteredParts);
      if (filteredParts.length === 0) {
        filteredParts = carsArray.filter(car =>
          car.category === category &&
          car.markaavto === markaavto &&
          car.model === model
        );
        alternativeMessage = "Підходящі запчастини в цій категорії не знайдені, але можливо вас зацікавлять інші варіанти для цієї моделі.";
        console.log("Результат після другого фільтрування (категорія, марка, модель):", filteredParts);

        if (filteredParts.length === 0) {
          filteredParts = carsArray.filter(car =>
            car.category === category &&
            car.markaavto === markaavto &&
            (!isYearNull ? car.god === parseInt(year) : true)
          );
          alternativeMessage = "Підходящі запчастини в цій категорії не знайдені, але можливо вас зацікавлять інші варіанти для цієї марки і року.";
          console.log("Результат після третього фільтрування (категорія, марка, рік):", filteredParts);

          if (filteredParts.length === 0) {
            filteredParts = carsArray.filter(car =>
              car.category === category &&
              car.markaavto === markaavto
            );
            alternativeMessage = "Підходящі запчастини в цій категорії не знайдені, але можливо вас зацікавлять інші варіанти для цієї марки.";
            console.log("Результат після четвертого фільтрування (категорія і марка):", filteredParts);

            if (filteredParts.length === 0) {
              filteredParts = carsArray.filter(car => car.markaavto === markaavto);
              alternativeMessage = "Запчастини для цієї марки авто:";
              console.log("Результат після п'ятого фільтрування (тільки марка):", filteredParts);
            }
          }
        }
      }

      const partsContainer = document.querySelector('.product-list');
      if (filteredParts.length > 0) {
        partsContainer.innerHTML = `
          ${alternativeMessage ? `<p>${alternativeMessage}</p>` : ''}
          ${filteredParts.map(part => `
            <div class="product-card">
              <img src="${part.photo.split(',')[0].trim()}" alt="${part.zapchast}" width="100%">
              <h2>Артикул: ${part.ID_EXT}</h2>
              <h3>${part.zapchast}</h3>
              <p>Ціна: ${part.zena} ${part.valyuta} / ${(parseFloat(part.zena) * usdToUahRate).toFixed(2)} грн</p>
              <div class="btn-cart">
                <button class="add-to-cart" 
                        data-id="${part.ID_EXT}"
                        data-price="${part.zena}"
                        data-name="${part.zapchast}"
                        data-photo="${part.photo}">
                  Додати до кошика
                </button>
              </div>
              <div class="product_btn">
                <a href="product.html?id=${part.ID_EXT}">Детальніше</a>
              </div>
            </div>
          `).join('')}
        `;
      } else {
        partsContainer.innerHTML = "<p>Запчастини для цієї категорії не знайдені.</p>";
      }

      fetch('https://api.monobank.ua/bank/currency')
        .then(response => response.json())
        .then(currencyData => {
          const usdRate = currencyData.find(currency => currency.currencyCodeA === 840 && currency.currencyCodeB === 980);
          if (!usdRate) {
            throw new Error('Курс валюты не знайдено');
          }

          const usdToUahRate = usdRate.rate; // Курс USD → UAH
          const parts = document.querySelectorAll('.product-card');

          parts.forEach(part => {
            const priceElement = part.querySelector('p'); // Ищем элемент p с ценой
            
            if (priceElement) {
              const priceInUsd = parseFloat(part.zena); // Конвертация строки в число
              const priceInUah = (priceInUsd * usdToUahRate).toFixed(2); // Конвертируем цену в гривны
              priceElement.textContent = `Ціна: ${priceInUsd} ${part.valyuta} / ${priceInUah} грн`; // Обновляем текст цены
            }
          });
          
          
        })
        .catch(error => {
          console.error('Ошибка при получении курса валюты:', error);
          // Обработать ошибки при отсутствии курса
        });

    })
    .catch(error => {
      console.error('Помилка при завантаженні даних:', error);
      document.querySelector('.product-list').innerHTML = "<p>Помилка при завантаженні даних.</p>";
    });
});
