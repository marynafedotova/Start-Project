let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

const cartItemsContainer = document.getElementById("cartItems");

// Добавление товара в корзину
function addToCart(item) {
  const existingItem = cart.find(cartItem => cartItem.id === item.id);

  // Если товар уже в корзине, не добавляем его повторно
  if (!existingItem) {
    item.quantity = 1; // Фиксированное количество
    cart.push(item);
  }
  sessionStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}

// Обновление корзины
function updateCart() {
  sessionStorage.setItem("cart", JSON.stringify(cart)); 
  updateCartDisplay(); 
}

// Функция для отображения корзины
function updateCartDisplay() {
  const cartItemsContainer = document.getElementById("cartItems");
  const header = document.querySelector("h1"); 

  cartItemsContainer.innerHTML = ""; 
  if (cart.length === 0) {
      const emptyCartMessage = document.createElement("div");
      emptyCartMessage.classList.add("empty-cart-message");
      emptyCartMessage.innerHTML = `Ваша кошик ще пустий, переходьте в <a class="link" href="catalog.html" target="_parent">Каталог запчастин</a>`;
      header.insertAdjacentElement("afterend", emptyCartMessage);
  } else {
      cart.forEach((item, index) => {
          const itemElement = document.createElement("div");
          itemElement.classList.add("cart-item");

          const itemImage = document.createElement("img");
          itemImage.src = item.photo;
          itemImage.style.width = "130px";
          itemImage.style.marginRight = "10px";

          const itemText = document.createElement("div");
          itemText.innerHTML = `
              <div class="cart-list">
                  <div class="item-id-link" data-id="${item.id}" style="cursor: pointer; color: white; text-decoration: underline;">${item.id}</strong></div>
                  <div class="cart_item_tile">${item.name}</div>
                  <div class="quantity">1 шт.</div> <!-- Фиксированное количество -->
                  <div class="cart_item_price">${item.price} грн</div>
              </div>
          `;

          const controls = document.createElement("div");
          controls.classList.add("cart-controls");

          const deleteButton = document.createElement("button");
          deleteButton.innerHTML = `<img src="../img/icons-delete.svg" alt="видалити" style="width: 20px; height: 20px;">`;
          deleteButton.addEventListener("click", () => {
              cart.splice(index, 1); 
              updateCart(); 
          });

          controls.appendChild(deleteButton);

          itemElement.appendChild(itemImage);
          itemElement.appendChild(itemText);
          itemElement.appendChild(controls);

          cartItemsContainer.appendChild(itemElement);
      });

      document.querySelectorAll(".item-id-link").forEach(link => {
          link.addEventListener("click", (event) => {
              const productId = event.target.getAttribute("data-id");
              window.location.href = `product.html?id=${productId}`;
          });
      });

      let totalAmountElement = document.getElementById("totalAmount");
      if (!totalAmountElement) {
          totalAmountElement = document.createElement("div");
          totalAmountElement.id = "totalAmount";
          totalAmountElement.style.marginTop = "20px";
          totalAmountElement.style.fontWeight = "bold";
          cartItemsContainer.appendChild(totalAmountElement);
      }

      const totalAmount = calculateTotal();
      totalAmountElement.textContent = `Загальна сума: ${totalAmount} грн`;
  }
}

// Расчет общей суммы заказа
function calculateTotal() {
  return cart.reduce((total, item) => total + item.price, 0); // Убираем умножение на quantity
}

// Обработчик событий для кнопки "Добавить в корзину"
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("add-to-cart")) {
    const item = {
      id: event.target.dataset.id,
      name: event.target.dataset.name,
      price: parseFloat(event.target.dataset.price || 0),
      quantity: 1, // Фиксированное количество
      photo: event.target.dataset.photo || "default-photo.jpg",
    };
    addToCart(item);
  }
});

// Инициализация отображения корзины
updateCartDisplay();
//нп

document.addEventListener("DOMContentLoaded", () => {
  const deliveryForm = document.getElementById("deliveryForm");
  const pickupMap = document.getElementById("pickupMap");
  const novaPostDepartment = document.getElementById("novaPostDepartment");
  const addressDelivery = document.getElementById("addressDelivery");

  const cityInput = document.getElementById("cityInput");
  const citySuggestions = document.getElementById("citySuggestions");
  const departmentSelect = document.getElementById("department");

  // Создаем объект с опциями доставки
  const deliveryOptions = {
    Pickup: pickupMap,
    NovaPostDepartment: novaPostDepartment,
    NovaPostAddress: addressDelivery,
  };

  // Скрываем все блоки доставки
  function hideAllDeliveryOptions() {
    Object.values(deliveryOptions).forEach((element) => {
      element.classList.add("hidden");
    });
  }

  // Обработчик выбора доставки
  deliveryForm.addEventListener("change", (event) => {
    hideAllDeliveryOptions();
    const selectedOption = deliveryOptions[event.target.value];
    if (selectedOption) {
      selectedOption.classList.remove("hidden");

      switch (event.target.value) {
        case "Pickup":
          break;
        case "NovaPostDepartment":
          // loadCitiesAndDepartments();
          break;
        case "NovaPostAddress":
          break;
        default:
          console.warn("Неизвестный способ доставки:", event.target.value);
      }
    }
  });

  hideAllDeliveryOptions();
});


// Функция для загрузки городов и отделений
document.addEventListener("DOMContentLoaded", function () {
  const cityInput = document.getElementById("cityInput");
  const citySuggestions = document.getElementById("citySuggestions");
  const departmentInput = document.getElementById("departmentInput");
  const departmentSuggestions = document.getElementById("departmentSuggestions");

  let selectedCityName = ""; // Сохранение выбранного города

  // Поиск городов
  cityInput.addEventListener("input", function () {
    const query = cityInput.value.trim();

    if (query.length > 0) {
      fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: "42c819c8fa548077af98a2bfca982d5e",
          modelName: "Address",
          calledMethod: "searchSettlements",
          methodProperties: {
            CityName: query,
            Limit: 10,
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          citySuggestions.innerHTML = "";

          if (data.success && data.data && data.data[0] && data.data[0].Addresses && data.data[0].Addresses.length > 0) {
            data.data[0].Addresses.forEach((address) => {
              const listItem = document.createElement("li");
              listItem.textContent = `${address.MainDescription}, ${address.Area}, ${address.Region}`;
              listItem.dataset.cityName = address.MainDescription;

              listItem.addEventListener("click", () => {
                selectedCityName = listItem.dataset.cityName;
                cityInput.value = listItem.textContent;
                citySuggestions.innerHTML = "";

                // Разблокировать ввод отделений
                departmentInput.disabled = false;
                departmentInput.focus();
              });

              citySuggestions.appendChild(listItem);
            });
          } else {
            citySuggestions.innerHTML = "<li>Нічого не знайдено</li>";
          }
        })
        .catch((error) => {
          console.error("Ошибка поиска городов:", error);
          citySuggestions.innerHTML = "<li>Ошибка загрузки городов</li>";
        });
    } else {
      citySuggestions.innerHTML = "";
    }
  });

  // Поиск отделений
  departmentInput.addEventListener("input", function () {
    const query = departmentInput.value.trim();

    if (selectedCityName && query.length > 0) {
      fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: "42c819c8fa548077af98a2bfca982d5e",
          modelName: "Address",
          calledMethod: "getWarehouses",
          methodProperties: {
            CityName: selectedCityName,
            FindByString: query,
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          departmentSuggestions.innerHTML = "";

          if (data.success && data.data.length > 0) {
            data.data.forEach((department) => {
              const listItem = document.createElement("li");
              listItem.textContent = department.Description;

              listItem.addEventListener("click", () => {
                departmentInput.value = listItem.textContent;
                departmentSuggestions.innerHTML = "";
              });

              departmentSuggestions.appendChild(listItem);
            });
          } else {
            departmentSuggestions.innerHTML = "<li>Відділення не знайдені</li>";
          }
        })
        .catch((error) => {
          console.error("Ошибка поиска отделений:", error);
          departmentSuggestions.innerHTML = "<li>Ошибка загрузки відділень</li>";
        });
    } else {
      departmentSuggestions.innerHTML = "";
    }
  });

  // Закрытие подсказок при клике вне поля
  document.addEventListener("click", (event) => {
    if (!cityInput.contains(event.target) && !citySuggestions.contains(event.target)) {
      citySuggestions.innerHTML = "";
    }
    if (!departmentInput.contains(event.target) && !departmentSuggestions.contains(event.target)) {
      departmentSuggestions.innerHTML = "";
    }
  });
});

//адресна доставка
document.addEventListener("DOMContentLoaded", function () {
  const addressCityInput = document.getElementById("addressCityInput");
  const addressCitySuggestions = document.getElementById("addressCitySuggestions");
  const addressStreetInput = document.getElementById("addressStreetInput");
  const addressStreetSuggestions = document.getElementById("addressStreetSuggestions");

  let selectedCityRef = ""; // Ідентифікатор вибраного міста

  // Перевірка наявності необхідних елементів
  if (!addressCityInput || !addressCitySuggestions || !addressStreetInput || !addressStreetSuggestions) {
    console.error("Одного або кількох елементів не знайдено на сторінці.");
    return;
  }

  // Пошук міст
  addressCityInput.addEventListener("input", function () {
    const query = addressCityInput.value.trim();

    if (query.length > 0) {
      fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: "42c819c8fa548077af98a2bfca982d5e",
          modelName: "Address",
          calledMethod: "searchSettlements",
          methodProperties: {
            CityName: query,
            Limit: 10,
          },
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("City search response:", data); // Лог відповіді

          addressCitySuggestions.innerHTML = "";

          if (
            data.success &&
            data.data &&
            data.data[0] &&
            data.data[0].Addresses &&
            data.data[0].Addresses.length > 0
          ) {
            data.data[0].Addresses.forEach((address) => {
              const listItem = document.createElement("li");
              listItem.textContent = `${address.MainDescription}, ${address.Area}, ${address.Region}`;
              listItem.dataset.cityRef = address.Ref; // Збереження Ref міста

              listItem.addEventListener("click", () => {
                selectedCityRef = listItem.dataset.cityRef; // Перевірка CityRef
                console.log("Selected CityRef:", selectedCityRef);
                addressCityInput.value = listItem.textContent;
                addressCitySuggestions.innerHTML = "";

                // Розблокувати введення вулиці
                addressStreetInput.disabled = false;
                addressStreetInput.focus();
              });

              addressCitySuggestions.appendChild(listItem);
            });
          } else {
            console.warn("Міста не знайдено. Введений запит:", query);
            addressCitySuggestions.innerHTML = "<li>Нічого не знайдено</li>";
          }
        })
        .catch((error) => {
          console.error("Помилка завантаження міст:", error);
          addressCitySuggestions.innerHTML = "<li>Помилка завантаження міст</li>";
        });
    } else {
      addressCitySuggestions.innerHTML = "";
    }
  });

  // Пошук вулиць
  addressStreetInput.addEventListener("input", function () {
    const query = addressStreetInput.value.trim();
  
    if (query.length > 0) {
      if (!selectedCityRef) {
        toast.error("Не обрано місто. Спочатку введіть та виберіть місто.");
        addressStreetSuggestions.innerHTML = "<li>Введіть та виберіть місто</li>";
        return;
      }
  
      fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: "42c819c8fa548077af98a2bfca982d5e",
          modelName: "Address",
          calledMethod: "searchSettlementStreets",
          methodProperties: {
            StreetName: query, // Пошуковий запит
            SettlementRef: selectedCityRef, // Ref населеного пункту
            Limit: 10, // Обмеження кількості результатів
          },
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Response data:", data); // Лог відповіді API
          addressStreetSuggestions.innerHTML = ""; // Очищуємо список пропозицій
        
          if (data.success && data.data && data.data[0] && data.data[0].Addresses.length > 0) {
            data.data[0].Addresses.forEach((street) => {
              // Перевірка на наявність значення в Present
              console.log("Street found:", street.Present); // Лог знайденої вулиці
              const listItem = document.createElement("li");
              
              // Якщо в полі Present є назва, виводимо її
              listItem.textContent = street.Present || "Без назви"; 
        
              listItem.addEventListener("click", () => {
                addressStreetInput.value = listItem.textContent;
                addressStreetSuggestions.innerHTML = ""; // Очищуємо список після вибору
              });
        
              addressStreetSuggestions.appendChild(listItem); // Додаємо в список
            });
          } else {
            // Якщо вулиць не знайдено
            toast.warn("Вулиці не знайдено для запиту:", query);
            addressStreetSuggestions.innerHTML = "<li>Вулиця не знайдена</li>";
          }
        })
        
        
        .catch((error) => {
          console.error("Помилка завантаження вулиць:", error);
          addressStreetSuggestions.innerHTML = "<li>Шукаємо вулицю, введіть ще одну літеру</li>";
        });
    } else {
      addressStreetSuggestions.innerHTML = "";
    }
  });
  });




// document.addEventListener("click", (event) => {
//   if (citySuggestions && !cityInput.contains(event.target) && !citySuggestions.contains(event.target)) {
//     citySuggestions.innerHTML = "";
//   }
//   if (streetSuggestions && !streetInput.contains(event.target) && !streetSuggestions.contains(event.target)) {
//     streetSuggestions.innerHTML = "";
//   }
// });




function getPaymentLabel(paymentData) {
  const paymentMethod = paymentData.get('payment');
  return document.querySelector(`input[name="payment"][value="${paymentMethod}"]`).nextElementSibling.textContent;
}

(function() {
  emailjs.init("pR7YN2WMFPV8ft58t");
})();


  function sendEmail(message, name, lastName, email, paymentMethod, deliveryMethod, phone) {
  const emailTemplateParams = {
    order_details: message,
    name: name,
    last_name: lastName,
    email: email,
    payment_method: paymentMethod,
    delivery_method: deliveryMethod,
    phone: phone,
  };

  emailjs.send(
    'service_k6d6ieu',    // Вставить Service ID
    'template_8fohjaj',   // Вставить Template ID
    emailTemplateParams, // Передаємо дані
    'pR7YN2WMFPV8ft58t'     // Вставити Public Key
  )
  .then(() => {
    console.log('Message sent successfully to Email.');
    toast.success('Ваше повідомлення успішно надіслано в Telegram та на Email.');
  })
  .catch(error => {
    console.error('Error sending to Email:', error);
    toast.error('Повідомлення до Email не вдалося надіслати.');
  });
}

function sendDataToTelegram() {
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    toast.error('У вашій корзині немає товарів. Будь ласка, додайте товари до замовлення.');
    return;
  }
  
  const contactsForm = document.querySelector('.contacts-cart form');
  const deliveryForm = document.querySelector('#deliveryForm');
  const paymentForm = document.querySelector('.payment-cart form');

  const formData = new FormData(contactsForm);
  const deliveryData = new FormData(deliveryForm);
  const paymentData = new FormData(paymentForm);
  let errors = [];

  // Валидация имени
  const nameFld = document.querySelector('#name');
  const name = nameFld.value.trim();
  if (name === '') {
    errors.push('Введіть ім\'я, будь ласка');
    nameFld.classList.add('is-invalid');
  } else if (name.length < 2) {
    errors.push('Ваше ім\'я занадто коротке');
    nameFld.classList.add('is-invalid');
  }

  // Валидация фамилии
  const lastNameFld = document.querySelector('#last_name');
  const lastName = lastNameFld ? lastNameFld.value.trim() : '';
  if (lastName === '') {
    errors.push('Введіть прізвище, будь ласка');
    lastNameFld.classList.add('is-invalid');
  } else if (lastName.length < 2) {
    errors.push('Ваше прізвище занадто коротке');
    lastNameFld.classList.add('is-invalid');
  }

  const phoneFld = document.querySelector('#telephon');
  const phone = phoneFld.value.trim();
  
  // Валидация email
  const emailFld = document.querySelector('#email');
  const email = emailFld.value.trim();
  if (email === '') {
    errors.push('Введіть email, будь ласка');
    emailFld.classList.add('is-invalid');
  } else if (!isValidEmail(email)) {
    errors.push('Невірний формат email, будь ласка');
    emailFld.classList.add('is-invalid');
  }

  // Выводим ошибку в консоль, если есть
  if (errors.length) {
    console.log('Errors:', errors); 
    toast.error(errors.join('. '));
    return;
  }

  const deliveryMethod = deliveryData.get('delivery');
  if (!deliveryMethod) {
    errors.push('Оберіть метод доставки.');
  }
  
  // Перевірка вибору оплати
  const paymentMethod = getPaymentLabel(paymentData);
  if (!paymentMethod) {
    errors.push('Оберіть спосіб оплати.');
  }

  if (errors.length) {
    toast.error(errors.join('. ')); // Показуємо всі помилки
    return;
  }

  let message = `Замовлення:\n`;

  cart.forEach((item) => {
    message += `ID: ${item.id} Назва: ${item.name} Ціна: ${item.price} грн\n`;
  });
  const totalAmount = calculateTotal();
  message += `\nЗагальна сума замовлення: ${totalAmount.toFixed(2)} грн\n`;

  // Контактні дані
  message += `\nКонтактні дані:\nІм'я: ${name}\nПрізвище: ${lastName}\nМобільний телефон: ${phone}\nЕлектронна пошта: ${email}\n`;

  // Доставка и оплата
  if (deliveryMethod === 'Pickup') {
    message += `Самовивіз\n`;
  } else if (deliveryMethod === 'NovaPostDepartment') {
    message += `Нова пошта (Відділення/Поштомат)\nМісто: ${deliveryData.get('city')}\nВідділення: ${deliveryData.get('department')}\n`;
  } else if (deliveryMethod === 'NovaPostAddress') {
    message += `Нова пошта (Адресна доставка)\nМісто: ${deliveryData.get('deliveryCity')}\nВулиця: ${deliveryData.get('street')}\nБудинок: ${deliveryData.get('house')}\nКвартира: ${deliveryData.get('apartment')}\n`;
  }

  if (paymentMethod) {
    message += `\nСпосіб оплати: ${paymentMethod}`;
  }

  // Telegram API и отправка сообщения
  const CHAT_ID = "-1002422030496";
  const BOT_TOKEN = "7598927769:AAGEAZ5pRe-5I1rtmaRroxja94iPboFIGuw";
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}&parse_mode=HTML`;

  fetch(url, {
    method: 'POST'
  })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        console.log('Message sent successfully to Telegram.');
          sendEmail(
            message, 
            name, 
            lastName, 
            email, 
            paymentMethod,
            phone
          );
        // Очищення форм та кошика
        contactsForm.reset();
        clearCart();
        updateCartDisplay();
      } else {
        console.log('Error sending message to Telegram:', data);
        toast.error('Сталася помилка під час надсилання в Telegram.');
      }
    })
    .catch(error => {
      console.log('Error:', error);
      toast.error('Помилка: ' + error.message);
    });
}


// Валидация номера телефона
function validatePhone(phone) {
  const phonePattern = /^\+38 \(\d{2}\) \d{3}-\d{2}-\d{2}$/;
  phone = phone.replace(/\D/g, ''); // Удаляем все нечисловые символы
  return phonePattern.test(phone); // Проверяем формат
}

document.querySelector('#telephon').addEventListener('input', function (e) {
  let input = e.target.value.replace(/\D/g, ''); // Удаляем всё кроме цифр
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

  e.target.value = formattedInput;
});




// Валидация имени (только буквы и апострофы)
function validateName(name) {
  const namePattern = /^[A-Za-zА-Яа-яІіЇїЄє' ]+$/;
  return namePattern.test(name);
}


function isValidEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

// Ограничение ввода имени
document.querySelector('#name').addEventListener('input', function (e) {
  e.target.value = e.target.value.replace(/[^A-Za-zА-Яа-яІіЇїЄє' ]/g, '');
});

const sendButton = document.getElementById('sendToTelegram');
sendButton.addEventListener('click', sendDataToTelegram);

function clearCart() {
  cart.length = 0;
  sessionStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay(); 
}
