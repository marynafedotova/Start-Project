document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  function setElementTextContent(selector, content) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = content;
    } else {
      console.warn(`Элемент с селектором ${selector} не найден`);
    }
  }
 
  async function getCachedExchangeRate() {
    const cachedRate = sessionStorage.getItem('usdToUahRate');
    const cachedTime = sessionStorage.getItem('currencyUpdateTime');
    const oneHour = 60 * 60 * 1000; // 1 час в миллисекундах

    if (cachedRate && cachedTime && (Date.now() - cachedTime < oneHour)) {
      return parseFloat(cachedRate);
    } else {
      try {
        const response = await fetch('https://api.monobank.ua/bank/currency');
        const data = await response.json();
        const usdToUah = data.find(item => item.currencyCodeA === 840 && item.currencyCodeB === 980);
        if (usdToUah && usdToUah.rateSell) {
          const rate = usdToUah.rateSell;
          sessionStorage.setItem('usdToUahRate', rate);
          sessionStorage.setItem('currencyUpdateTime', Date.now());
          return rate;
        }
      } catch (error) {
        console.error('Ошибка при получении курса валют:', error);
        return 1; // Возвращаем базовое значение, если запрос не удался
      }
    }
  }

  if (productId) {
    const usdToUahRate = await getCachedExchangeRate();

    fetch('../data/data_ukr.json')
      .then(response => response.json())
      .then(data => {
        const product = data.Sheet1.find(item => item.ID_EXT === productId);

        if (product) {
          const priceInUah = Math.ceil(product.zena * usdToUahRate);

          setElementTextContent('.stan', product.stan);
          setElementTextContent('.product-id', product.ID_EXT);
          setElementTextContent('.product-name', product.zapchast);
          setElementTextContent('.product-markaavto', product.markaavto);
          setElementTextContent('.product-dop_category', product.dop_category);
          setElementTextContent('.product-pod_category', product.pod_category);
          setElementTextContent('.product-typ_kuzova', product.typ_kuzova);
          setElementTextContent('.product-price', `${product.zena} ${product.valyuta}`);
          setElementTextContent('.product-price-uah', `${priceInUah} грн`);
          setElementTextContent('.product-model', product.model);
          setElementTextContent('.product-god', product.god);
          setElementTextContent('.product-category', product.category);
          setElementTextContent('.product-toplivo', product.toplivo);
          setElementTextContent('.product-originalnumber', product.originalnumber);
          setElementTextContent('.opysanye', product.opysanye);

          const imageGallery = document.querySelector('#imageGallery');
          if (product.photo && typeof product.photo === 'string' && imageGallery) {
            product.photo.split(',').forEach((photoUrl) => {
              const listItem = `
                <li data-thumb="${photoUrl.trim()}" data-src="${photoUrl.trim()}">
                  <a href="${photoUrl.trim()}" data-lightgallery="item">
                    <img src="${photoUrl.trim()}" alt="${product.zapchast}">
                  </a>
                </li>
              `;
              imageGallery.innerHTML += listItem;
            });

            $('#imageGallery').lightSlider({
              gallery: true,
              item: 1,
              thumbItem: 3,
              slideMargin: 20,
              enableDrag: true,
              currentPagerPosition: 'left',
              controls: true,
              verticalHeight: 600,
              loop: true,
              auto: true,
              onSliderLoad: function() {
                $('#imageGallery').removeClass('cS-hidden');
              }
            });
          } else {
            console.error('Поле photo не содержит данных или не является строкой для товара с ID:', productId);
          }
        } else {
          console.error('Продукт с указанным ID не найден:', productId);
        }
      })
      .catch(error => console.error('Ошибка загрузки данных продукта:', error));
  }
});

// Табы 
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".info-tab");
  const contents = document.querySelectorAll(".info-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(item => item.classList.remove("active"));
      contents.forEach(content => content.classList.remove("active"));

      tab.classList.add("active");
      document.querySelector(`.${tab.id}-info`).classList.add("active");
    });
  });

});
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.querySelector('.InOneClickoverlay');
  const modal = document.querySelector('.buyInOneClick');
  const buyNowButtons = document.querySelectorAll('.buy-now'); 
  const sendButton = document.getElementById('sendToTelegram');

  const CHAT_ID = "-1002422030496";
  const BOT_TOKEN = "7598927769:AAGEAZ5pRe-5I1rtmaRroxja94iPboFIGuw";

  function getProductData(button) {
    const productItem = button.closest('.product-item'); 
    return {
      id: productItem.querySelector('.product-id').textContent.trim(),
      name: productItem.querySelector('.product-name').textContent.trim(),
      price: productItem.querySelector('.product-price-uah').textContent.trim(),
    };
  }

  function openModal(product) {
    overlay.style.display = 'block';
    modal.style.display = 'block';


    document.querySelector('.product-id').textContent = product.id;
    document.querySelector('.product-name').textContent = product.name;
    document.querySelector('.product-price-uah').textContent = product.price;
  }


  function closeModal() {
    overlay.style.display = 'none';
    modal.style.display = 'none';
  }

  buyNowButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productData = getProductData(button);
      console.log('Дані товару:', productData); 
      openModal(productData); 
    });
  });

  function sendDataToTelegram() {
    const name = document.getElementById('nameBuyInOneClick').value.trim();
    const phone = document.getElementById('telBuyInOneClick').value.trim();
    const comment = document.getElementById('comment').value.trim();

    const productId = document.querySelector('.product-id').textContent.trim();
    const productName = document.querySelector('.product-name').textContent.trim();
    const productPrice = document.querySelector('.product-price-uah').textContent.trim();

    const errors = [];

    if (name === '') {
      errors.push("Введіть, будь ласка, Ваше ім'я");
      document.getElementById('nameBuyInOneClick').classList.add('is-invalid');
    } else if (name.length < 2) {
      errors.push('Ваше ім\'я занадто коротке');
      document.getElementById('nameBuyInOneClick').classList.add('is-invalid');
    }

    if (phone === '' || phone.length < 17) {
      errors.push('Введіть, будь ласка, правильний номер телефону');
      document.getElementById('telBuyInOneClick').classList.add('is-invalid');
    }
    if (!/^(\+38\s\(\d{3}\)\s\d{3}-\d{2}-\d{2})$/.test(phone)) {
      errors.push('Невірний формат номера телефону');
      document.getElementById('telBuyInOneClick').classList.add('is-invalid');
    }

    if (errors.length > 0) {
      toast.error(errors.join('. '));
      return;
    }


    const message = `
      <b>Нове замовлення в 1 клік:</b>
      🔹 <b>Назва:</b> ${productName}
      🔹 <b>ID:</b> ${productId}
      🔹 <b>Ціна:</b> ${productPrice}
      🔹 <b>Кількість:</b> 1

      <b>Контактні дані:</b>
      👤 <b>Ім'я:</b> ${name}
      📞 <b>Телефон:</b> ${phone}
      📝 <b>Коментар:</b> ${comment || 'Без коментарів'}
    `;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}&parse_mode=HTML`;

    fetch(url, { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          toast.success('Ваше замовлення успішно надіслано.');
          closeModal();
        } else {
          toast.error('Сталася помилка під час надсилання. Спробуйте пізніше.');
        }
      })
      .catch(error => {
        toast.error('Помилка: ' + error.message);
      });
  }


  if (sendButton) {
    sendButton.addEventListener('click', (e) => {
      e.preventDefault(); 
      sendDataToTelegram();
    });
  }
  const telephone = document.getElementById('telBuyInOneClick');

  if (telephone) {
    telephone.addEventListener('input', function (e) {
      let input = e.target.value.replace(/\D/g, ''); 
      const prefix = '38'; 
      const maxLength = 12; 
  
      if (!input.startsWith(prefix)) {
        input = prefix + input;
      }
  
      if (input.length > maxLength) {
        input = input.substring(0, maxLength);
      }

      let formattedInput = '+38';
      let cursorPosition = e.target.selectionStart; 
      const prevLength = e.target.value.length; 
  
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
  
      const newLength = formattedInput.length;
      const diff = newLength - prevLength;
  
      e.target.value = formattedInput;
  
      if (diff > 0 && cursorPosition >= prevLength) {
        cursorPosition += diff;
      } else if (diff < 0 && cursorPosition > newLength) {
        cursorPosition = newLength;
      }
  
      setTimeout(() => {
        e.target.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    });
  }
});
