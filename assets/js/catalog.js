const urlMonoBank = 'https://api.monobank.ua/bank/currency';
let usdToUahRate = 37; // Курс USD к UAH
let currentProductIndex = 0;
const productsPerPage = 12;
let products = []; 
let searchResults = []; 
let searchProductIndex = 0; 
const productsPerSearchPage = 12;

// Функция для получения курса валют с кешированием
async function fetchCurrencyRate() {
  const cachedRate = localStorage.getItem('usdToUahRate');
  const cachedTime = localStorage.getItem('usdToUahRateTime');
  const now = Date.now();

  if (cachedRate && cachedTime && now - cachedTime < 5 * 60 * 1000) {
    usdToUahRate = parseFloat(cachedRate);
    return;
  }

  try {
    const response = await fetch(urlMonoBank);
    if (!response.ok) throw new Error('Ошибка загрузки курса валют');
    const data = await response.json();
    const usdToUah = data.find(item => item.currencyCodeA === 840);
    if (usdToUah && usdToUah.rateSell) {
      usdToUahRate = usdToUah.rateSell;
      localStorage.setItem('usdToUahRate', usdToUahRate);
      localStorage.setItem('usdToUahRateTime', now);
    }
  } catch (error) {
    console.error('Ошибка получения курса валют:', error);
  }
}

// Функция для отображения товаров
function displayProducts(filteredProducts = []) {
  const isSearch = filteredProducts.length > 0;
  const productContainer = document.querySelector(isSearch ? '.search-results' : '.product-list');

  if (!productContainer) {
    console.error('Контейнер для товаров не найден');
    return;
  }

  if (isSearch) {
    productContainer.innerHTML = '';
  }

  const productsToDisplay = isSearch
    ? filteredProducts
    : products.slice(currentProductIndex, currentProductIndex + productsPerPage);

  productsToDisplay.forEach(product => {
    const priceInUah = Math.ceil(product.zena * usdToUahRate);

    // Печать для диагностики пути
    // console.log('Фото для товара:', product.photo);
    
    // Берем первое изображение из списка, если оно есть, или дефолтное фото
    const photoUrl = product.photo ? product.photo.split(',')[0].trim() : 'default-photo.jpg';
    // console.log('Используемое фото:', photoUrl);  // Логирование выбранного пути

    const productCard = `
      <div class="product-card">
        <img src="${photoUrl}" alt="${product.zapchast}">
        <h3>Артикул: ${product.ID_EXT}</h3>
        <h3>Назва: ${product.zapchast}</h3>
        <p>Ціна: ${product.zena} ${product.valyuta} / ${priceInUah} грн</p>
        <div class="btn-cart">
          <button class="add-to-cart" 
                  data-id="${product.ID_EXT}" 
                  data-price="${priceInUah}" 
                  data-name="${product.zapchast}" 
                  data-photo="${photoUrl}">
              Додати до кошика
          </button>
        </div>
        <div class="product_btn">
          <a href="product.html?id=${product.ID_EXT}">Детальніше</a>
        </div>
      </div>`;

    productContainer.insertAdjacentHTML('beforeend', productCard);
  });

  if (!isSearch) {
    currentProductIndex += productsPerPage;
    if (currentProductIndex >= products.length) {
      document.querySelector('.load-more').style.display = 'none';
    }
  } else if (filteredProducts.length === 0) {
    productContainer.innerHTML = '<p>Ничего не найдено.</p>';
  }
}

// Функция для отображения результатов поиска
function displaySearchResults(filteredProducts = []) {
  const productContainer = document.querySelector('.search-results');
  if (!productContainer) {
    console.error('Контейнер для результатов поиска не найден');
    return;
  }

  if (filteredProducts.length === 0) {
    console.log('Нет результатов для поиска');
    productContainer.innerHTML = '<p>Ничего не найдено.</p>';
    return;
  }

  console.log('Найдено товаров:', filteredProducts.length);
  const productsToDisplay = filteredProducts.slice(
    searchProductIndex,
    searchProductIndex + productsPerSearchPage
  );

  console.log('Отображаем товары с индекса:', searchProductIndex);

  productsToDisplay.forEach(product => {
    const priceInUah = Math.ceil(product.zena * usdToUahRate);
    const photoUrl = product.photo ? product.photo.split(',')[0].trim() : 'default-photo.jpg'; // Используем поле photo
    const productCard = `
      <div class="product-card">
        <img src="${photoUrl}" alt="${product.zapchast}">
        <h3>Артикул: ${product.ID_EXT}</h3>
        <h3>Назва: ${product.zapchast}</h3>
        <p>Ціна: ${product.zena} ${product.valyuta} / ${priceInUah} грн</p>
        <div class="btn-cart">
          <button class="add-to-cart" 
                  data-id="${product.ID_EXT}" 
                  data-price="${priceInUah}" 
                  data-name="${product.zapchast}" 
                  data-photo="${photoUrl}">
              Додати до кошика
          </button>
        </div>
        <div class="product_btn">
          <a href="product.html?id=${product.ID_EXT}">Детальніше</a>
        </div>
      </div>`;
    productContainer.insertAdjacentHTML('beforeend', productCard);
  });

  searchProductIndex += productsPerSearchPage;

  console.log('Новый индекс поиска:', searchProductIndex);

  const loadMoreButton = document.querySelector('.load-more-search');
  if (searchProductIndex < filteredProducts.length) {
    loadMoreButton.style.display = 'block';
  } else {
    loadMoreButton.style.display = 'none';
  }
}



// Обработчик кнопки "Загрузить ещё"
document.querySelector('.load-more-search').addEventListener('click', function (event) {
  event.preventDefault(); // Отменяем стандартное поведение ссылки

  const query = document.getElementById('search-input').value.trim().toLowerCase();
  const filteredProducts = products.filter(product => {
    return (product.ID_EXT && product.ID_EXT.toLowerCase().includes(query)) ||
           (product.zapchast && product.zapchast.toLowerCase().includes(query)) ||
           (product.markaavto && product.markaavto.toLowerCase().includes(query)) ||
           (product.model && product.model.toLowerCase().includes(query)) ||
           (product.category && product.category.toLowerCase().includes(query)) ||
           (product.dop_category && product.dop_category.toLowerCase().includes(query)) ||
           (product.originalnumber && product.originalnumber.toLowerCase().includes(query));
  });

  displayProducts(filteredProducts);
});


// Обработчик формы поиска
document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const query = document.getElementById('search-input').value.trim().toLowerCase();
  console.log('Search query:', query);
  if (query) {

    const filteredProducts = products.filter(product => {
      return (product.ID_EXT && product.ID_EXT.toLowerCase().includes(query)) || 
             (product.zapchast && product.zapchast.toLowerCase().includes(query)) || 
             (product.markaavto && product.markaavto.toLowerCase().includes(query)) ||
             (product.model && product.model.toLowerCase().includes(query)) ||
            (product.category && product.category.toLowerCase().includes(query)) ||
            (product.dop_category && product.dop_category.toLowerCase().includes(query)) ||
            (product.originalnumber && product.originalnumber.toLowerCase().includes(query));
    });
    console.log('Filtered products:', filteredProducts); 
    displayedProductCount = 0;
    displayProducts(filteredProducts);
  } else {
    displayedProductCount = 0;
    displayProducts([]);
  }

  const resultsContainer = document.querySelector('.search-results');
  if (resultsContainer) {
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});


document.getElementById('search-input').addEventListener('input', function() {
  const query = this.value.trim().toLowerCase();

  if (query) {
    const filteredProducts = products.filter(product => {
      return (product.ID_EXT && product.ID_EXT.toLowerCase().includes(query)) || 
             (product.zapchast && product.zapchast.toLowerCase().includes(query)) || 
             (product.markaavto && product.markaavto.toLowerCase().includes(query)) ||
             (product.model && product.model.toLowerCase().includes(query)) ||
            (product.category && product.category.toLowerCase().includes(query)) ||
            (product.dop_category && product.dop_category.toLowerCase().includes(query)) ||
            (product.originalnumber && product.originalnumber.toLowerCase().includes(query));
    });

    displayedProductCount = 0;  
    displayProducts(filteredProducts);
  } else {
    displayedProductCount = 0;
    displayProducts([]);
  }
});




// Функция инициализации каталога
async function initializeCatalog() {
  await fetchCurrencyRate();

  try {
    const response = await fetch('../data/data_ukr.json');
    if (!response.ok) throw new Error('Ошибка загрузки JSON');
    const data = await response.json();
    if (!data || !data.Sheet1) throw new Error('Некорректный формат данных');
    products = data.Sheet1;
    displayProducts();  

    document.querySelector('.load-more').addEventListener('click', event => {
      event.preventDefault();
      displayProducts();
    });
  } catch (error) {
    console.error('Ошибка инициализации каталога:', error);
  }
}

// Инициализация
initializeCatalog();

//accordion
fetch('../data/data_ukr.json')
    .then(response => response.json())
    .then(data => {
        const cars = data.Sheet1
            .filter(item => item.markaavto && item.model && item.god)
            .map(item => ({
                markaavto: item.markaavto,
                model: item.model,
                god: item.god // Добавляем год для передачи в ссылку
            }));

        const carAccordionData = cars.reduce((acc, car) => {
            if (!acc[car.markaavto]) {
                acc[car.markaavto] = {};
            }
            if (!acc[car.markaavto][car.model]) {
                acc[car.markaavto][car.model] = new Set(); // Используем Set для уникальных годов
            }
            acc[car.markaavto][car.model].add(car.god); // Добавляем только уникальные года
            return acc;
        }, {});

        const accordionContainer = document.getElementById('carAccordion');
        for (const [make, models] of Object.entries(carAccordionData)) {
            if (!make) continue; // Пропускаем, если марка null или пустая

            const makeDiv = document.createElement('div');
            makeDiv.classList.add('accordion-item');

            const makeHeader = document.createElement('h3');
            makeHeader.textContent = make;
            makeHeader.classList.add('accordion-header');
            makeHeader.addEventListener('click', function() {
                const modelList = this.nextElementSibling;
                modelList.classList.toggle('active');
            });
            makeDiv.appendChild(makeHeader);

            const modelList = document.createElement('div');
            modelList.classList.add('accordion-content');

            for (const [model, years] of Object.entries(models)) {
                const modelHeader = document.createElement('h4');
                modelHeader.textContent = model;
                modelHeader.classList.add('model-header');
                modelHeader.addEventListener('click', function() {
                    const yearList = this.nextElementSibling;
                    yearList.classList.toggle('active');
                });
                modelList.appendChild(modelHeader);

                const yearList = document.createElement('div');
                yearList.classList.add('year-list');

                years.forEach(year => {
                    const yearItem = document.createElement('p');
                    yearItem.textContent = `Год: ${year}`;
                    yearItem.classList.add('year-item');
                    yearItem.addEventListener('click', () => {
                        window.location.href = `./car-page.html?make=${make}&model=${model}&year=${year}`;
                    });
                    yearList.appendChild(yearItem);
                });

                modelList.appendChild(yearList);
            }

            makeDiv.appendChild(modelList);
            accordionContainer.appendChild(makeDiv);
        }
    })
    .catch(error => console.error('Помилка завантаження даних:', error));










//cars card
fetch('../data/data_ukr.json')
    .then(response => response.json())
    .then(data => {
        const carsCatalog = document.getElementById('cars-catalog');
        const uniqueCars = new Set();
        const carsArray = [];

        data.Sheet1.forEach(car => {
            // Проверяем, что марка, модель и год не null и не пусты
            if (car.markaavto && car.model && car.god) {
                const uniqueKey = `${car.markaavto}-${car.model}-${car.god}`;

                if (!uniqueCars.has(uniqueKey)) {
                    uniqueCars.add(uniqueKey);

                    const carObject = {
                        markaavto: car.markaavto,
                        model: car.model,
                        god: car.god,
                        pictures: car.pictures
                    };
                    carsArray.push(carObject);
                }
            }
        });

        const sortedCars = carsArray.sort((a, b) => {
            const makeA = a.markaavto || '';
            const makeB = b.markaavto || '';
            return makeA.localeCompare(makeB);
        });

        sortedCars.forEach(car => {
            const carCard = document.createElement('div');
            carCard.classList.add('car-card');

            const carImage = document.createElement('img');
            carImage.src = car.pictures;
            carImage.alt = `${car.markaavto} ${car.model}`;
            carCard.appendChild(carImage);

            const carDetails = document.createElement('div');
            carDetails.classList.add('car-details');

            const carMakeModel = document.createElement('h3');
            carMakeModel.textContent = `${car.markaavto} ${car.model}`;
            carDetails.appendChild(carMakeModel);

            const carYear = document.createElement('p');
            carYear.textContent = `Рік: ${car.god}`;
            carDetails.appendChild(carYear);

            // Обработчик события для картки машины
            carCard.addEventListener('click', () => {
                window.location.href = `./car-page.html?make=${car.markaavto}&model=${car.model}&year=${car.god}`;
            });

            carCard.appendChild(carDetails);
            carsCatalog.appendChild(carCard);
        });
    })
    .catch(error => console.error('Помилка завантаження даних:', error));


//cart
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('add-to-cart')) {
    const item = {
      id: event.target.dataset.id, // ID товара
      name: event.target.dataset.name, // Название товара
      price: parseFloat(event.target.dataset.price || 0), // Цена товара
      quantity: 1, // Количество товара (по умолчанию 1)
      photo: event.target.dataset.photo // Фото товара
    };

    addToCart(item); // Добавляем товар в корзину
  }
});


// Функция для добавления товара в корзину
function addToCart(item) {
  let cart = JSON.parse(sessionStorage.getItem("cart")) || []; 

  const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1; 
  } else {
    cart.push(item); 
  }

  sessionStorage.setItem("cart", JSON.stringify(cart)); 
  console.log('Корзина обновлена:', cart); 
  showCartModal(); 
}

// Функция для отображения модального окна
function showCartModal() {
  const modal = document.getElementById("cartModal");
  const overlay = document.querySelector(".overlay");

  if (modal && overlay) {
    console.log("Показываем модальное окно"); // Для проверки
    modal.classList.remove("hidden");
    overlay.style.display = "block";

    // Проверим текущие стили модального окна
    console.log("Стили модального окна:", window.getComputedStyle(modal));
  } else {
    console.error('Модальное окно или затемняющий фон не найдены!');
  }
}


// Функция для закрытия модального окна
function closeCartModal() {
  const modal = document.getElementById("cartModal");
  const overlay = document.querySelector(".overlay"); 

  if (modal && overlay) {
    modal.classList.add("hidden");
    overlay.style.display = "none";
  } else {
    console.error('Модальное окно или затемняющий фон не найдены!');
  }
}

// Функция для перехода к оформлению заказа
function proceedToCheckout() {
  closeCartModal();
  window.location.href = "cart.html";
}



//header
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
  const scrollDistance = window.scrollY;
  const threshold = 30;

  if (scrollDistance > threshold) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

//hamburger-menu
document.getElementById('hamb-btn').addEventListener('click', function () {
  document.body.classList.toggle('open-mobile-menu')
})

document.getElementById('hamb-btn-mobile').addEventListener('click', function () {
  document.body.classList.toggle('open-mobile-menu')
})
//lazy

var lazyLoadInstance = new LazyLoad({});

// wow
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
document.querySelectorAll('.catalog-list a').forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    const brand = this.querySelector('img').alt.toLowerCase();
    const pageUrl = `catalog-template.html?brand=${brand}`;
    window.location.href = pageUrl;
  });
});

document.querySelectorAll('.submenu a').forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    const brand = this.querySelector('img').alt.toLowerCase();
    const pageUrl = `catalog-template.html?brand=${brand}`;
    window.location.href = pageUrl;
  });
});
//form
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('feedback_form');
  const nameFld = document.getElementById('exampleInputName');
  const telFld = document.getElementById('exampleInputTel');

  if (!form || !nameFld || !telFld) {
    console.error('Form or fields not found!');
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = nameFld.value ? nameFld.value.trim() : ''; 
    const tel = telFld.value ? telFld.value.trim() : '';

    const errors = [];

    // Очистка классов ошибок
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

    const CHAT_ID = '-1002278785620';
    const BOT_TOKEN = '8046931960:AAHhJdRaBEv_3zyB9evNFxZQlEdiz8FyWL8';
    const message = `<b>Ім'я: </b> ${name}\r\n<b>Телефон: </b>${tel}`;
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}&parse_mode=HTML`;

    fetch(url, {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        nameFld.value = '';
        telFld.value = '';
        toast.success('Ваше повідомлення успішно надіслано.');
      } else {
        toast.error('Сталася помилка.');
      }
    })
    .catch(error => {
      toast.error('Помилка: ' + error.message);
    });
  });

  if (telFld) {
    telFld.addEventListener('input', function (e) {
      let input = e.target.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
      const prefix = '38'; // Префикс для Украины
      const maxLength = 12; // Максимальная длина номера
  
      if (!input.startsWith(prefix)) {
        input = prefix + input;
      }
  
      if (input.length > maxLength) {
        input = input.substring(0, maxLength);
      }

      let formattedInput = '+38';
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

      const cursorPosition = e.target.selectionStart; 
      const prevLength = e.target.value.length; 
      const newLength = formattedInput.length;
      const diff = newLength - prevLength;
  
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
    let input = e.target.value;
    e.target.value = input.replace(/[^A-Za-zА-Яа-яІіЇїЄє']/g, '');
  });

  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = currentYear;
  }
});