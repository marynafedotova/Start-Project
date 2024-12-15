fetch('../data/cars.json')
  .then(response => response.json())
  .then(data => {
    createTable(data.cars_in_transit);
  })
  .catch(error => {
    console.error('Помилка завантаження даних:', error);
  });

function createTable(cars) {
  const tableContainer = document.getElementById('cars-table');
  if (!tableContainer) {
    console.error('Таблиця не знайдена в DOM');
    return;
  }

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th><div class="cars-title">Назва автомобіля</div></th>
        <th><div class="cars-title">Бронювання</div></th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `;
  
  const tbody = table.querySelector('tbody');

  cars.forEach((car) => {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const wrapperDiv = document.createElement('div');
    const carLink = document.createElement('a');
    carLink.href = "#";
    carLink.textContent = car.model;

    carLink.addEventListener('click', (event) => {
      event.preventDefault();
      toggleAccordion(row);
    });

    wrapperDiv.appendChild(carLink);
    nameCell.appendChild(wrapperDiv);
    row.appendChild(nameCell);

    const bookingCell = document.createElement('td');
    const bookingButton = document.createElement('button');
    bookingButton.textContent = "Забронювати";
    bookingButton.addEventListener('click', () => openModal(car.model));
    

    bookingCell.appendChild(bookingButton);
    row.appendChild(bookingCell);
    tbody.appendChild(row);

    const accordionRow = document.createElement('tr');
    const accordionCell = document.createElement('td');
    accordionCell.colSpan = 2; 
    accordionCell.innerHTML = `
      <div class="accordion-content" style="display: none;"> 
      <div class="car-deteils">
        <h3>Модель: ${car.model}</h3>
        <ul>
          <li><div class="cardeteils-item">Рік випуску: </div> ${car.year}</li>
          <li><div class="cardeteils-item">Аукціон:</div> ${car.auction}</li>
          <li><div class="cardeteils-item">Дата продажу:</div> ${car.sale_date}</li>
          <li><div class="cardeteils-item">VIN:</div> ${car.vin}</li>
          <li><div class="cardeteils-item">Стан:</div> ${car.status}</li>
          <li><div class="cardeteils-item">Двигун:</div> ${car.engine}</li>
          <li><div class="cardeteils-item">Пробіг:</div> ${car.mileage}</li>
          <li><div class="cardeteils-item">Продавець:</div> ${car.seller}</li>
          <li><div class="cardeteils-item">Місце продажу:</div> ${car.location}</li>
          <li><div class="cardeteils-item">Основне ушкодження:</div> ${car.primary_damage}</li>
          <li><div class="cardeteils-item">Другорядне пошкодження:</div> ${car.secondary_damage}</li>
          <li><div class="cardeteils-item">Оціночна вартість:</div> ${car.estimated_value}</li>
          <li><div class="cardeteils-item">Ціна ремонту:</div> ${car.repair_cost}</li>
          <li><div class="cardeteils-item">Коробка передач:</div> ${car.transmission}</li>
          <li><div class="cardeteils-item">Колір кузова:</div> ${car.color}</li>
          <li><div class="cardeteils-item">Привід:</div> ${car.drive}</li>
        </ul>
        </div>
         <div id="car-slider">
        <ul id="image-slider-${car.vin}" class="image-slider"></ul>
      </div>
      </div>
    `;
    
    accordionRow.appendChild(accordionCell);
    tbody.appendChild(accordionRow);

    if (car.images && car.images.length > 0) {
      setTimeout(() => {
        const sliderElement = document.getElementById(`image-slider-${car.vin}`);
        if (sliderElement) {
          initImageSlider(car, `image-slider-${car.vin}`);
        } else {
          console.error(`Элемент слайдера не найден для ${car.vin}`);
        }
      }, 0); 
    }
    
  }); 

  tableContainer.appendChild(table); 
}

// Функция для переключения отображения аккордеона
function toggleAccordion(row) {
  const accordionRow = row.nextElementSibling;
  if (accordionRow && accordionRow.querySelector('.accordion-content')) {
    const accordionContent = accordionRow.querySelector('.accordion-content');
    accordionContent.style.display = accordionContent.style.display === 'none' ? 'flex' : 'none';
  }
}
function initImageSlider(car, sliderId) {
  const imageSlider = document.getElementById(sliderId);
  const ulElement = document.createElement('ul');

  car.images.forEach((imagePath, index) => {
    const fullPath = `../img/cars/${imagePath.replace('../img/cars/', '')}`;
    const imageLi = document.createElement('li');
    imageLi.setAttribute('data-thumb', fullPath);

    // Добавляем ссылку и изображение внутри элемента li
    imageLi.innerHTML = `
      <a href="${fullPath}" data-lightgallery="item">
        <img src="${fullPath}" alt="Изображение ${car.model} ${index + 1}">
      </a>
    `;

    ulElement.appendChild(imageLi);
  });

  imageSlider.appendChild(ulElement);

  // Инициализируем LightSlider
  const lightSliderInstance = $(ulElement).lightSlider({
    gallery: true,
    item: 1,
    vertical: true,
    thumbItem: car.images.length,
    slideMargin: 10,
    enableDrag: true,
    currentPagerPosition: 'left',
    controls: false,
    verticalHeight: 500,
    auto: true,
    loop: true,
    onSliderLoad: function() {
      console.log('Слайдер загружен');
      
      // Инициализируем LightGallery после загрузки слайдера
      lightGallery(imageSlider, {
        selector: 'a[data-lightgallery="item"]',
        allowMediaOverlap: true,
        toggleThumb: true
      });
    }
  });
}
// Получение элементов
const modal = document.getElementById('car-modal');
const overlay = modal ? modal.querySelector('.overlay-feedback-modal') : null;
const closeModalButton = modal ? modal.querySelector('.close-feedback') : null;
const openModalButtons = document.querySelectorAll('button[data-action="book"]');

if (modal && overlay && closeModalButton && openModalButtons.length > 0) {
  // События для закрытия модального окна
  closeModalButton.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const carName = button.dataset.carName || 'Неизвестная модель';
      openModal(carName);
    });
  });
}

// Функция открытия модального окна
function openModal(carName) {
  if (modal && overlay) {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    const carNameField = modal.querySelector('#car-name');
    if (carNameField) {
      carNameField.textContent = carName;
    }
  }
}
// Функция закрытия модального окна
function closeModal() {
  if (modal && overlay) {
    modal.style.display = 'none';
    overlay.style.display = 'none';
  }
}


// Событие для кнопок "Забронювати"
openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const carName = button.dataset.carName || 'Неизвестная модель'; // Получить название автомобиля
    openModal(carName);
  });
});

// События для закрытия модального окна
closeModalButton.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// Убираем автоматическое открытие модального окна при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  modal.style.display = 'none';
  overlay.style.display = 'none';
});


// form
document.getElementById('car-order-form_cars').addEventListener('submit', function(event) {
  event.preventDefault();

  const nameFld = document.getElementById('name');
  const telFld = document.getElementById('phone');
  const emailFld = document.getElementById('email');
  const commentsFld = document.getElementById('comments');

  const name = nameFld.value.trim();
  const phone = telFld.value.trim();
  const email = emailFld.value.trim();
  const comments = commentsFld.value.trim();

  const errors = [];

  // Очистка классов ошибок
  nameFld.classList.remove('is-invalid');
  telFld.classList.remove('is-invalid');
  emailFld.classList.remove('is-invalid');

  // Валидация имени
  if (name === '') {
    toast.error("Введіть, будь ласка, Ваше ім'я");
    nameFld.classList.add('is-invalid');
  } else if (name.length < 2) {
    toast.error("Ваше ім'я занадто коротке");
    nameFld.classList.add('is-invalid');
  } else {
    nameFld.classList.remove('is-invalid');
  }

  // Валидация телефона
  if (phone === '' || phone.length < 17) {
    toast.error('Введіть, будь ласка, правильний номер телефону');
    telFld.classList.add('is-invalid');
  } else {
    telFld.classList.remove('is-invalid');
  }

  // Валидация email
  if (email === '') {
    toast.error("Введіть, будь ласка, Вашу електронну пошту");
    emailFld.classList.add('is-invalid');
  } else if (!isValidEmail(email)) {
    toast.error("Невірний формат електронної пошти");
    emailFld.classList.add('is-invalid');
  } else {
    emailFld.classList.remove('is-invalid');
  }

  // Если есть ошибки, не отправляйте форму
  if (nameFld.classList.contains('is-invalid') || telFld.classList.contains('is-invalid') || emailFld.classList.contains('is-invalid')) {
    return;
  }

  // Предположим, что данные о машине хранятся в переменной car
  const car = {
    name: "Volkswagen Passat", // Пример имени автомобиля, замените на ваше реальное значение
    model: "1.8T Wolfsburg Edition 2014",
    vin: "1234567890",
  };

  // Отправка данных в Telegram
  const CHAT_ID = '-1002485030400';
  const BOT_TOKEN = '7527794477:AAFxOk9l6CH8EccTk9at2uVM3OSyEZbrUCw';
  const message = `
  🚗 <b>Нове бронювання авто</b> 🚗\n
  Назва авто: ${car.name}\n
  Модель: ${car.model}\n
  VIN: ${car.vin}\n
  Ім'я: ${name}\n
  Телефон: ${phone}\n
  Email: ${email}\n
  Коментарі: ${comments || 'Без коментарів'}
  `;

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}&parse_mode=HTML`;

  fetch(url, {
    method: 'POST',
  })
  .then(response => response.json())
  .then(data => {
    if (data.ok) {
      nameFld.value = '';
      telFld.value = '';
      emailFld.value = '';
      commentsFld.value = '';
      toast.success('Ваше повідомлення успішно надіслано.');
      closeModal(); // Закрытие модального окна
    } else {
      toast.error('Сталася помилка.');
    }
  })
  .catch(error => {
    toast.error('Помилка: ' + error.message);
  });
});

// Форматирование телефона
document.getElementById('phone').addEventListener('input', function(e) {
  let input = e.target.value.replace(/\D/g, ''); 
  let formattedInput = '';

  if (input.length > 0) formattedInput += '+38 (';
  if (input.length >= 1) formattedInput += input.substring(0, 3);
  if (input.length >= 4) formattedInput += ') ' + input.substring(3, 6);
  if (input.length >= 7) formattedInput += '-' + input.substring(6, 8);
  if (input.length >= 9) formattedInput += '-' + input.substring(8, 10);

  e.target.value = formattedInput;
});

// Запрещаем ввод чисел в поле имени
document.getElementById('name').addEventListener('input', function(e) {
  e.target.value = e.target.value.replace(/[^A-Za-zА-Яа-яІіЇїЄє']/g, '');
});

function isValidEmail(email) {
  const emailPattern = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return emailPattern.test(email);
}

