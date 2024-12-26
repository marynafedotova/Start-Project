"use strict";

var cart = JSON.parse(sessionStorage.getItem("cart")) || [];
var cartItemsContainer = document.getElementById("cartItems"); // Добавление товара в корзину

function addToCart(item) {
  var existingItem = cart.find(function (cartItem) {
    return cartItem.id === item.id;
  }); // Если товар уже в корзине, не добавляем его повторно

  if (!existingItem) {
    item.quantity = 1; // Фиксированное количество

    cart.push(item);
  }

  sessionStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
} // Обновление корзины


function updateCart() {
  sessionStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
} // Функция для отображения корзины


function updateCartDisplay() {
  var cartItemsContainer = document.getElementById("cartItems");
  var header = document.querySelector("h1");
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    var emptyCartMessage = document.createElement("div");
    emptyCartMessage.classList.add("empty-cart-message");
    emptyCartMessage.innerHTML = "\u0412\u0430\u0448\u0430 \u043A\u043E\u0448\u0438\u043A \u0449\u0435 \u043F\u0443\u0441\u0442\u0438\u0439, \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u044C\u0442\u0435 \u0432 <a class=\"link\" href=\"catalog.html\" target=\"_parent\">\u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u0437\u0430\u043F\u0447\u0430\u0441\u0442\u0438\u043D</a>";
    header.insertAdjacentElement("afterend", emptyCartMessage);
  } else {
    cart.forEach(function (item, index) {
      var itemElement = document.createElement("div");
      itemElement.classList.add("cart-item");
      var itemImage = document.createElement("img");
      itemImage.src = item.photo;
      itemImage.style.width = "130px";
      itemImage.style.marginRight = "10px";
      var itemText = document.createElement("div");
      itemText.innerHTML = "\n              <div class=\"cart-list\">\n                  <div class=\"item-id-link\" data-id=\"".concat(item.id, "\" style=\"cursor: pointer; color: white; text-decoration: underline;\">").concat(item.id, "</strong></div>\n                  <div class=\"cart_item_tile\">").concat(item.name, "</div>\n                  <div class=\"quantity\">1 \u0448\u0442.</div> <!-- \u0424\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E -->\n                  <div class=\"cart_item_price\">").concat(item.price, " \u0433\u0440\u043D</div>\n              </div>\n          ");
      var controls = document.createElement("div");
      controls.classList.add("cart-controls");
      var deleteButton = document.createElement("button");
      deleteButton.innerHTML = "<img src=\"../img/icons-delete.svg\" alt=\"\u0432\u0438\u0434\u0430\u043B\u0438\u0442\u0438\" style=\"width: 20px; height: 20px;\">";
      deleteButton.addEventListener("click", function () {
        cart.splice(index, 1);
        updateCart();
      });
      controls.appendChild(deleteButton);
      itemElement.appendChild(itemImage);
      itemElement.appendChild(itemText);
      itemElement.appendChild(controls);
      cartItemsContainer.appendChild(itemElement);
    });
    document.querySelectorAll(".item-id-link").forEach(function (link) {
      link.addEventListener("click", function (event) {
        var productId = event.target.getAttribute("data-id");
        window.location.href = "product.html?id=".concat(productId);
      });
    });
    var totalAmountElement = document.getElementById("totalAmount");

    if (!totalAmountElement) {
      totalAmountElement = document.createElement("div");
      totalAmountElement.id = "totalAmount";
      totalAmountElement.style.marginTop = "20px";
      totalAmountElement.style.fontWeight = "bold";
      cartItemsContainer.appendChild(totalAmountElement);
    }

    var totalAmount = calculateTotal();
    totalAmountElement.textContent = "\u0417\u0430\u0433\u0430\u043B\u044C\u043D\u0430 \u0441\u0443\u043C\u0430: ".concat(totalAmount, " \u0433\u0440\u043D");
  }
} // Расчет общей суммы заказа


function calculateTotal() {
  return cart.reduce(function (total, item) {
    return total + item.price;
  }, 0); // Убираем умножение на quantity
} // Обработчик событий для кнопки "Добавить в корзину"


document.addEventListener("click", function (event) {
  if (event.target.classList.contains("add-to-cart")) {
    var item = {
      id: event.target.dataset.id,
      name: event.target.dataset.name,
      price: parseFloat(event.target.dataset.price || 0),
      quantity: 1,
      // Фиксированное количество
      photo: event.target.dataset.photo || "default-photo.jpg"
    };
    addToCart(item);
  }
}); // Инициализация отображения корзины

updateCartDisplay(); //нп

document.addEventListener("DOMContentLoaded", function () {
  var deliveryForm = document.getElementById("deliveryForm");
  var pickupMap = document.getElementById("pickupMap");
  var novaPostDepartment = document.getElementById("novaPostDepartment");
  var addressDelivery = document.getElementById("addressDelivery");
  var cityInput = document.getElementById("cityInput");
  var citySuggestions = document.getElementById("citySuggestions");
  var departmentSelect = document.getElementById("department"); // Создаем объект с опциями доставки

  var deliveryOptions = {
    Pickup: pickupMap,
    NovaPostDepartment: novaPostDepartment,
    NovaPostAddress: addressDelivery
  }; // Скрываем все блоки доставки

  function hideAllDeliveryOptions() {
    Object.values(deliveryOptions).forEach(function (element) {
      element.classList.add("hidden");
    });
  } // Обработчик выбора доставки


  deliveryForm.addEventListener("change", function (event) {
    hideAllDeliveryOptions();
    var selectedOption = deliveryOptions[event.target.value];

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
}); // Функция для загрузки городов и отделений

document.addEventListener("DOMContentLoaded", function () {
  var cityInput = document.getElementById("cityInput");
  var citySuggestions = document.getElementById("citySuggestions");
  var departmentInput = document.getElementById("departmentInput");
  var departmentSuggestions = document.getElementById("departmentSuggestions");
  var selectedCityName = ""; // Сохранение выбранного города
  // Поиск городов

  cityInput.addEventListener("input", function () {
    var query = cityInput.value.trim();

    if (query.length > 0) {
      fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          apiKey: "42c819c8fa548077af98a2bfca982d5e",
          modelName: "Address",
          calledMethod: "searchSettlements",
          methodProperties: {
            CityName: query,
            Limit: 10
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        citySuggestions.innerHTML = "";

        if (data.success && data.data && data.data[0] && data.data[0].Addresses && data.data[0].Addresses.length > 0) {
          data.data[0].Addresses.forEach(function (address) {
            var listItem = document.createElement("li");
            listItem.textContent = "".concat(address.MainDescription, ", ").concat(address.Area, ", ").concat(address.Region);
            listItem.dataset.cityName = address.MainDescription;
            listItem.addEventListener("click", function () {
              selectedCityName = listItem.dataset.cityName;
              cityInput.value = listItem.textContent;
              citySuggestions.innerHTML = ""; // Разблокировать ввод отделений

              departmentInput.disabled = false;
              departmentInput.focus();
            });
            citySuggestions.appendChild(listItem);
          });
        } else {
          citySuggestions.innerHTML = "<li>Нічого не знайдено</li>";
        }
      })["catch"](function (error) {
        console.error("Ошибка поиска городов:", error);
        citySuggestions.innerHTML = "<li>Ошибка загрузки городов</li>";
      });
    } else {
      citySuggestions.innerHTML = "";
    }
  }); // Поиск отделений

  departmentInput.addEventListener("input", function () {
    var query = departmentInput.value.trim();

    if (selectedCityName && query.length > 0) {
      fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          apiKey: "42c819c8fa548077af98a2bfca982d5e",
          modelName: "Address",
          calledMethod: "getWarehouses",
          methodProperties: {
            CityName: selectedCityName,
            FindByString: query
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        departmentSuggestions.innerHTML = "";

        if (data.success && data.data.length > 0) {
          data.data.forEach(function (department) {
            var listItem = document.createElement("li");
            listItem.textContent = department.Description;
            listItem.addEventListener("click", function () {
              departmentInput.value = listItem.textContent;
              departmentSuggestions.innerHTML = "";
            });
            departmentSuggestions.appendChild(listItem);
          });
        } else {
          departmentSuggestions.innerHTML = "<li>Відділення не знайдені</li>";
        }
      })["catch"](function (error) {
        console.error("Ошибка поиска отделений:", error);
        departmentSuggestions.innerHTML = "<li>Ошибка загрузки відділень</li>";
      });
    } else {
      departmentSuggestions.innerHTML = "";
    }
  }); // Закрытие подсказок при клике вне поля

  document.addEventListener("click", function (event) {
    if (!cityInput.contains(event.target) && !citySuggestions.contains(event.target)) {
      citySuggestions.innerHTML = "";
    }

    if (!departmentInput.contains(event.target) && !departmentSuggestions.contains(event.target)) {
      departmentSuggestions.innerHTML = "";
    }
  });
}); //адресна доставка

document.addEventListener("DOMContentLoaded", function () {
  var addressCityInput = document.getElementById("addressCityInput");
  var addressCitySuggestions = document.getElementById("addressCitySuggestions");
  var addressStreetInput = document.getElementById("addressStreetInput");
  var addressStreetSuggestions = document.getElementById("addressStreetSuggestions");
  var selectedCityRef = ""; // Ідентифікатор вибраного міста
  // Перевірка наявності необхідних елементів

  if (!addressCityInput || !addressCitySuggestions || !addressStreetInput || !addressStreetSuggestions) {
    console.error("Одного або кількох елементів не знайдено на сторінці.");
    return;
  } // Пошук міст


  addressCityInput.addEventListener("input", function () {
    var query = addressCityInput.value.trim();

    if (query.length > 0) {
      fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          apiKey: "42c819c8fa548077af98a2bfca982d5e",
          modelName: "Address",
          calledMethod: "searchSettlements",
          methodProperties: {
            CityName: query,
            Limit: 10
          }
        })
      }).then(function (response) {
        if (!response.ok) {
          throw new Error("HTTP error! Status: ".concat(response.status));
        }

        return response.json();
      }).then(function (data) {
        console.log("City search response:", data); // Лог відповіді

        addressCitySuggestions.innerHTML = "";

        if (data.success && data.data && data.data[0] && data.data[0].Addresses && data.data[0].Addresses.length > 0) {
          data.data[0].Addresses.forEach(function (address) {
            var listItem = document.createElement("li");
            listItem.textContent = "".concat(address.MainDescription, ", ").concat(address.Area, ", ").concat(address.Region);
            listItem.dataset.cityRef = address.Ref; // Збереження Ref міста

            listItem.addEventListener("click", function () {
              selectedCityRef = listItem.dataset.cityRef; // Перевірка CityRef

              console.log("Selected CityRef:", selectedCityRef);
              addressCityInput.value = listItem.textContent;
              addressCitySuggestions.innerHTML = ""; // Розблокувати введення вулиці

              addressStreetInput.disabled = false;
              addressStreetInput.focus();
            });
            addressCitySuggestions.appendChild(listItem);
          });
        } else {
          console.warn("Міста не знайдено. Введений запит:", query);
          addressCitySuggestions.innerHTML = "<li>Нічого не знайдено</li>";
        }
      })["catch"](function (error) {
        console.error("Помилка завантаження міст:", error);
        addressCitySuggestions.innerHTML = "<li>Помилка завантаження міст</li>";
      });
    } else {
      addressCitySuggestions.innerHTML = "";
    }
  }); // Пошук вулиць

  addressStreetInput.addEventListener("input", function () {
    var query = addressStreetInput.value.trim();

    if (query.length > 0) {
      if (!selectedCityRef) {
        toast.error("Не обрано місто. Спочатку введіть та виберіть місто.");
        addressStreetSuggestions.innerHTML = "<li>Введіть та виберіть місто</li>";
        return;
      }

      fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          apiKey: "42c819c8fa548077af98a2bfca982d5e",
          modelName: "Address",
          calledMethod: "searchSettlementStreets",
          methodProperties: {
            StreetName: query,
            // Пошуковий запит
            SettlementRef: selectedCityRef,
            // Ref населеного пункту
            Limit: 10 // Обмеження кількості результатів

          }
        })
      }).then(function (response) {
        if (!response.ok) {
          throw new Error("HTTP error! Status: ".concat(response.status));
        }

        return response.json();
      }).then(function (data) {
        console.log("Response data:", data); // Лог відповіді API

        addressStreetSuggestions.innerHTML = ""; // Очищуємо список пропозицій

        if (data.success && data.data && data.data[0] && data.data[0].Addresses.length > 0) {
          data.data[0].Addresses.forEach(function (street) {
            // Перевірка на наявність значення в Present
            console.log("Street found:", street.Present); // Лог знайденої вулиці

            var listItem = document.createElement("li"); // Якщо в полі Present є назва, виводимо її

            listItem.textContent = street.Present || "Без назви";
            listItem.addEventListener("click", function () {
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
      })["catch"](function (error) {
        console.error("Помилка завантаження вулиць:", error);
        addressStreetSuggestions.innerHTML = "<li>Шукаємо вулицю, введіть ще одну літеру</li>";
      });
    } else {
      addressStreetSuggestions.innerHTML = "";
    }
  });
}); // document.addEventListener("click", (event) => {
//   if (citySuggestions && !cityInput.contains(event.target) && !citySuggestions.contains(event.target)) {
//     citySuggestions.innerHTML = "";
//   }
//   if (streetSuggestions && !streetInput.contains(event.target) && !streetSuggestions.contains(event.target)) {
//     streetSuggestions.innerHTML = "";
//   }
// });

function getPaymentLabel(paymentData) {
  var paymentMethod = paymentData.get('payment');
  return document.querySelector("input[name=\"payment\"][value=\"".concat(paymentMethod, "\"]")).nextElementSibling.textContent;
}

(function () {
  emailjs.init("pR7YN2WMFPV8ft58t");
})();

function sendEmail(message, name, lastName, email, paymentMethod, deliveryMethod, phone) {
  var emailTemplateParams = {
    order_details: message,
    name: name,
    last_name: lastName,
    email: email,
    payment_method: paymentMethod,
    delivery_method: deliveryMethod,
    phone: phone
  };
  emailjs.send('service_k6d6ieu', // Вставить Service ID
  'template_8fohjaj', // Вставить Template ID
  emailTemplateParams, // Передаємо дані
  'pR7YN2WMFPV8ft58t' // Вставити Public Key
  ).then(function () {
    console.log('Message sent successfully to Email.');
    toast.success('Ваше повідомлення успішно надіслано в Telegram та на Email.');
  })["catch"](function (error) {
    console.error('Error sending to Email:', error);
    toast.error('Повідомлення до Email не вдалося надіслати.');
  });
}

function sendDataToTelegram() {
  var cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    toast.error('У вашій корзині немає товарів. Будь ласка, додайте товари до замовлення.');
    return;
  }

  var contactsForm = document.querySelector('.contacts-cart form');
  var deliveryForm = document.querySelector('#deliveryForm');
  var paymentForm = document.querySelector('.payment-cart form');
  var formData = new FormData(contactsForm);
  var deliveryData = new FormData(deliveryForm);
  var paymentData = new FormData(paymentForm);
  var errors = []; // Валидация имени

  var nameFld = document.querySelector('#name');
  var name = nameFld.value.trim();

  if (name === '') {
    errors.push('Введіть ім\'я, будь ласка');
    nameFld.classList.add('is-invalid');
  } else if (name.length < 2) {
    errors.push('Ваше ім\'я занадто коротке');
    nameFld.classList.add('is-invalid');
  } // Валидация фамилии


  var lastNameFld = document.querySelector('#last_name');
  var lastName = lastNameFld ? lastNameFld.value.trim() : '';

  if (lastName === '') {
    errors.push('Введіть прізвище, будь ласка');
    lastNameFld.classList.add('is-invalid');
  } else if (lastName.length < 2) {
    errors.push('Ваше прізвище занадто коротке');
    lastNameFld.classList.add('is-invalid');
  }

  var phoneFld = document.querySelector('#telephon');
  var phone = phoneFld.value.trim(); // Валидация email

  var emailFld = document.querySelector('#email');
  var email = emailFld.value.trim();

  if (email === '') {
    errors.push('Введіть email, будь ласка');
    emailFld.classList.add('is-invalid');
  } else if (!isValidEmail(email)) {
    errors.push('Невірний формат email, будь ласка');
    emailFld.classList.add('is-invalid');
  } // Выводим ошибку в консоль, если есть


  if (errors.length) {
    console.log('Errors:', errors);
    toast.error(errors.join('. '));
    return;
  }

  var deliveryMethod = deliveryData.get('delivery');

  if (!deliveryMethod) {
    errors.push('Оберіть метод доставки.');
  } // Перевірка вибору оплати


  var paymentMethod = getPaymentLabel(paymentData);

  if (!paymentMethod) {
    errors.push('Оберіть спосіб оплати.');
  }

  if (errors.length) {
    toast.error(errors.join('. ')); // Показуємо всі помилки

    return;
  }

  var message = "\u0417\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F:\n";
  cart.forEach(function (item) {
    message += "ID: ".concat(item.id, " \u041D\u0430\u0437\u0432\u0430: ").concat(item.name, " \u0426\u0456\u043D\u0430: ").concat(item.price, " \u0433\u0440\u043D\n");
  });
  var totalAmount = calculateTotal();
  message += "\n\u0417\u0430\u0433\u0430\u043B\u044C\u043D\u0430 \u0441\u0443\u043C\u0430 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F: ".concat(totalAmount.toFixed(2), " \u0433\u0440\u043D\n"); // Контактні дані

  message += "\n\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u0456 \u0434\u0430\u043D\u0456:\n\u0406\u043C'\u044F: ".concat(name, "\n\u041F\u0440\u0456\u0437\u0432\u0438\u0449\u0435: ").concat(lastName, "\n\u041C\u043E\u0431\u0456\u043B\u044C\u043D\u0438\u0439 \u0442\u0435\u043B\u0435\u0444\u043E\u043D: ").concat(phone, "\n\u0415\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u0430 \u043F\u043E\u0448\u0442\u0430: ").concat(email, "\n"); // Доставка и оплата

  if (deliveryMethod === 'Pickup') {
    message += "\u0421\u0430\u043C\u043E\u0432\u0438\u0432\u0456\u0437\n";
  } else if (deliveryMethod === 'NovaPostDepartment') {
    message += "\u041D\u043E\u0432\u0430 \u043F\u043E\u0448\u0442\u0430 (\u0412\u0456\u0434\u0434\u0456\u043B\u0435\u043D\u043D\u044F/\u041F\u043E\u0448\u0442\u043E\u043C\u0430\u0442)\n\u041C\u0456\u0441\u0442\u043E: ".concat(deliveryData.get('city'), "\n\u0412\u0456\u0434\u0434\u0456\u043B\u0435\u043D\u043D\u044F: ").concat(deliveryData.get('department'), "\n");
  } else if (deliveryMethod === 'NovaPostAddress') {
    message += "\u041D\u043E\u0432\u0430 \u043F\u043E\u0448\u0442\u0430 (\u0410\u0434\u0440\u0435\u0441\u043D\u0430 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430)\n\u041C\u0456\u0441\u0442\u043E: ".concat(deliveryData.get('deliveryCity'), "\n\u0412\u0443\u043B\u0438\u0446\u044F: ").concat(deliveryData.get('street'), "\n\u0411\u0443\u0434\u0438\u043D\u043E\u043A: ").concat(deliveryData.get('house'), "\n\u041A\u0432\u0430\u0440\u0442\u0438\u0440\u0430: ").concat(deliveryData.get('apartment'), "\n");
  }

  if (paymentMethod) {
    message += "\n\u0421\u043F\u043E\u0441\u0456\u0431 \u043E\u043F\u043B\u0430\u0442\u0438: ".concat(paymentMethod);
  } // Telegram API и отправка сообщения


  var CHAT_ID = "-1002422030496";
  var BOT_TOKEN = "7598927769:AAGEAZ5pRe-5I1rtmaRroxja94iPboFIGuw";
  var url = "https://api.telegram.org/bot".concat(BOT_TOKEN, "/sendMessage?chat_id=").concat(CHAT_ID, "&text=").concat(encodeURIComponent(message), "&parse_mode=HTML");
  fetch(url, {
    method: 'POST'
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.ok) {
      console.log('Message sent successfully to Telegram.');
      sendEmail(message, name, lastName, email, paymentMethod, phone); // Очищення форм та кошика

      contactsForm.reset();
      clearCart();
      updateCartDisplay();
    } else {
      console.log('Error sending message to Telegram:', data);
      toast.error('Сталася помилка під час надсилання в Telegram.');
    }
  })["catch"](function (error) {
    console.log('Error:', error);
    toast.error('Помилка: ' + error.message);
  });
} // Валидация номера телефона


function validatePhone(phone) {
  var phonePattern = /^\+38 \(\d{2}\) \d{3}-\d{2}-\d{2}$/;
  phone = phone.replace(/\D/g, ''); // Удаляем все нечисловые символы

  return phonePattern.test(phone); // Проверяем формат
}

document.querySelector('#telephon').addEventListener('input', function (e) {
  var input = e.target.value.replace(/\D/g, ''); // Удаляем всё кроме цифр

  var prefix = '38'; // Префикс для Украины

  var maxLength = 12; // Максимальная длина номера

  if (!input.startsWith(prefix)) {
    input = prefix + input;
  }

  if (input.length > maxLength) {
    input = input.substring(0, maxLength);
  }

  var formattedInput = '+38';

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
}); // Валидация имени (только буквы и апострофы)

function validateName(name) {
  var namePattern = /^[A-Za-zА-Яа-яІіЇїЄє' ]+$/;
  return namePattern.test(name);
}

function isValidEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
} // Ограничение ввода имени


document.querySelector('#name').addEventListener('input', function (e) {
  e.target.value = e.target.value.replace(/[^A-Za-zА-Яа-яІіЇїЄє' ]/g, '');
});
var sendButton = document.getElementById('sendToTelegram');
sendButton.addEventListener('click', sendDataToTelegram);

function clearCart() {
  cart.length = 0;
  sessionStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}