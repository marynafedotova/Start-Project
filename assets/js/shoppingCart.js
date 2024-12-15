const shoppingCart = {
  cart: [],

  initCart: function() {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.updateCartDisplay();
    }
  },

  addItemToCart: function(item) {
    const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cart.push({ ...item, quantity: item.quantity });
    }
    this.saveCart();
    this.updateCartDisplay();
  },

  saveCart: function() {
    sessionStorage.setItem('cart', JSON.stringify(this.cart));
  },

  updateCartDisplay: function() {
    const cartBody = document.querySelector('.show-cart');
    const totalDisplay = document.querySelector('.total-cart');

    if (!cartBody || !totalDisplay) {
      console.error('Элементы отображения корзины не найдены.');
      return;
    }

    cartBody.innerHTML = ''; // Очищаем содержимое корзины
    let total = 0;

    this.cart.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.id || 'Невідомий'}</td>
        <td>${item.tipe || 'Немає типу'}</td>
        <td>${item.price || 0} грн</td>
        <td>${item.quantity}</td>
        <td><button class="remove-item" data-id="${item.id}">Видалити</button></td>
      `;
      cartBody.appendChild(row);
      total += (item.price || 0) * item.quantity; // Учитываем цену товара
    });

    totalDisplay.textContent = total.toFixed(2); // Обновляем общее количество
    this.bindRemoveItemButtons(); // Привязываем кнопки удаления
  },

  bindRemoveItemButtons: function() {
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const itemId = button.getAttribute('data-id'); // Получаем ID товара
        this.removeFromCart(itemId); // Вызываем метод удаления
      });
    });
  },

  removeFromCart: function(itemId) {
    this.cart = this.cart.filter(item => item.id !== itemId); // Удаляем товар по ID
    this.saveCart(); // Сохраняем обновлённую корзину
    this.updateCartDisplay(); // Обновляем отображение корзины
  },

  clearCart: function() {
    this.cart = []; // Очищаем корзину
    this.saveCart(); // Сохраняем обновлённую корзину
    this.updateCartDisplay(); // Обновляем отображение корзины
  }
};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
  shoppingCart.initCart();

  const openCartButton = document.getElementById('openCartBtn');
  if (openCartButton) {
    openCartButton.addEventListener('click', function() {
      if (shoppingCart.cart.length === 0) {
        toast.warning('Кошик порожній!');
        console.log('Кошик порожній!');
      } else {
        showCartModal();
        shoppingCart.updateCartDisplay();
      }
    });
  }

  const clearCartButton = document.querySelector('.clear-cart');
  if (clearCartButton) {
    clearCartButton.addEventListener('click', () => {
      shoppingCart.clearCart(); // Вызываем метод очистки корзины
    });
  }

  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart')) {
      event.preventDefault();
      const button = event.target;
      const item = {
        id: Number(button.getAttribute('data-id')),
        price: Number(button.getAttribute('data-price')),
        tipe: button.getAttribute('data-tipe'), // Добавляем поле типа
        quantity: 1
      };
      shoppingCart.addItemToCart(item);
      showCartModal();
      console.log("Кнопка 'Добавить в корзину' нажата!");
    }
  });

  // Оформление заказа
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      hideCartModal();
      showOrderModal();
      const orderItemsList = document.querySelector('.order-items-list');
      orderItemsList.innerHTML = '';
      const cartItems = shoppingCart.cart;
      if (cartItems.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'Кошик порожній';
        orderItemsList.appendChild(emptyMessage);
      } else {
        cartItems.forEach(item => {
          const listItem = document.createElement('li');
          listItem.textContent = `ID: ${item.id} - ${item.tipe} - ${item.price} грн (Кількість: ${item.quantity})`;
          orderItemsList.appendChild(listItem);
        });
      }
    });
  }  

  // Обработка формы заказа
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const cartItems = shoppingCart.cart;

      // Валидация формы
      if (!name || !phone) {
        toast.warning('Будь ласка, заповніть поля форми!');
        return;
      }

      if (cartItems.length === 0) {
        toast.info('Кошик порожній. Будь ласка, додайте товар до кошику перед оформленням замовлення.');
        return;
      }

      const orderDetails = { name, phone, items: cartItems };
      console.log('Order placed:', orderDetails);

      // Формируем данные заказа
      const itemsDetails = cartItems.map(item => `ID: ${item.id} - ${item.tipe} - ${item.price} грн (Кількість: ${item.quantity})`).join('\n');
      const message = `<b>Имя:</b> ${name}\n<b>Телефон:</b> ${phone}\n<b>Ваше замовлення:</b>\n${itemsDetails}`;
      const encodedMessage = encodeURIComponent(message); 

      // Telegram 
      const CHAT_ID = '-1002326954626';
      const BOT_TOKEN = '7789690626:AAGEoRLZY2WpWhU22cjfN7fbj7fS_nFCsYM'; // Перенести на сервер
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodedMessage}&parse_mode=HTML`;

      // Отправка данных
      console.log('Отправляем сообщение:', message);
      console.log('Формируемый URL:', url);

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Ошибка при отправке сообщения в Telegram');
          }
          return response.json();
        })
        .then(data => {
          console.log('Сообщение отправлено:', data);
          toast.success('Ваше замовлення успішно відправлене!');
          hideOrderModal();
          checkoutForm.reset();
          shoppingCart.cart = [];
          shoppingCart.saveCart();
          shoppingCart.updateCartDisplay();
        })
        .catch(error => {
          console.error('Ошибка при отправке сообщения:', error);
          toast.error('Відбулася помилка при відправленні замовлення. Спробуйте, будь ласка, ще раз!');
        });
    });
  }

  // Закрытие модальных окон
  window.onclick = function(event) {
    const cartModal = document.getElementById('modalWrapper');
    const orderModal = document.getElementById('orderModal');
    if (event.target === cartModal) {
      hideCartModal();
    } else if (event.target === orderModal) {
      hideOrderModal();
    }
  };
});

// Функции управления модальными окнами
function showCartModal() {
  const cartModal = document.getElementById('modalWrapper');
  if (cartModal) {
    console.log('Открытие модального окна корзины');
    cartModal.style.display = 'block'; // Показываем модальное окно

    // Обновление отображения корзины
    shoppingCart.updateCartDisplay();

    // Проверка, пуста ли корзина
    if (shoppingCart.cart.length === 0) {
      toast.warning('Кошик порожній!'); // Показываем предупреждение, если корзина пуста
    }
  } else {
    console.error('Элемент modalWrapper не найден.');
  }
}

function hideCartModal() {
  const cartModal = document.getElementById('modalWrapper');
  if (cartModal) {
    cartModal.style.display = 'none';
  }
}

function showOrderModal() {
  const orderModal = document.getElementById('orderModal');
  if (orderModal) {
    orderModal.style.display = 'none'; // Скрываем модальное окно заказа
  }
}
