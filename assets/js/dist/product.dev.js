"use strict";

document.addEventListener("DOMContentLoaded", function _callee() {
  var urlParams, productId, setElementTextContent, getCachedExchangeRate, usdToUahRate;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          getCachedExchangeRate = function _ref2() {
            var cachedRate, cachedTime, oneHour, response, data, usdToUah, rate;
            return regeneratorRuntime.async(function getCachedExchangeRate$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    cachedRate = sessionStorage.getItem('usdToUahRate');
                    cachedTime = sessionStorage.getItem('currencyUpdateTime');
                    oneHour = 60 * 60 * 1000; // 1 час в миллисекундах

                    if (!(cachedRate && cachedTime && Date.now() - cachedTime < oneHour)) {
                      _context.next = 7;
                      break;
                    }

                    return _context.abrupt("return", parseFloat(cachedRate));

                  case 7:
                    _context.prev = 7;
                    _context.next = 10;
                    return regeneratorRuntime.awrap(fetch('https://api.monobank.ua/bank/currency'));

                  case 10:
                    response = _context.sent;
                    _context.next = 13;
                    return regeneratorRuntime.awrap(response.json());

                  case 13:
                    data = _context.sent;
                    usdToUah = data.find(function (item) {
                      return item.currencyCodeA === 840 && item.currencyCodeB === 980;
                    });

                    if (!(usdToUah && usdToUah.rateSell)) {
                      _context.next = 20;
                      break;
                    }

                    rate = usdToUah.rateSell;
                    sessionStorage.setItem('usdToUahRate', rate);
                    sessionStorage.setItem('currencyUpdateTime', Date.now());
                    return _context.abrupt("return", rate);

                  case 20:
                    _context.next = 26;
                    break;

                  case 22:
                    _context.prev = 22;
                    _context.t0 = _context["catch"](7);
                    console.error('Ошибка при получении курса валют:', _context.t0);
                    return _context.abrupt("return", 1);

                  case 26:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[7, 22]]);
          };

          setElementTextContent = function _ref(selector, content) {
            var element = document.querySelector(selector);

            if (element) {
              element.textContent = content;
            } else {
              console.warn("\u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u0441 \u0441\u0435\u043B\u0435\u043A\u0442\u043E\u0440\u043E\u043C ".concat(selector, " \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D"));
            }
          };

          urlParams = new URLSearchParams(window.location.search);
          productId = urlParams.get('id');

          if (!productId) {
            _context2.next = 9;
            break;
          }

          _context2.next = 7;
          return regeneratorRuntime.awrap(getCachedExchangeRate());

        case 7:
          usdToUahRate = _context2.sent;
          fetch('../data/data_ukr.json').then(function (response) {
            return response.json();
          }).then(function (data) {
            var product = data.Sheet1.find(function (item) {
              return item.ID_EXT === productId;
            });

            if (product) {
              var priceInUah = Math.ceil(product.zena * usdToUahRate);
              setElementTextContent('.stan', product.stan);
              setElementTextContent('.product-id', product.ID_EXT);
              setElementTextContent('.product-name', product.zapchast);
              setElementTextContent('.product-markaavto', product.markaavto);
              setElementTextContent('.product-dop_category', product.dop_category);
              setElementTextContent('.product-pod_category', product.pod_category);
              setElementTextContent('.product-typ_kuzova', product.typ_kuzova);
              setElementTextContent('.product-price', "".concat(product.zena, " ").concat(product.valyuta));
              setElementTextContent('.product-price-uah', "".concat(priceInUah, " \u0433\u0440\u043D"));
              setElementTextContent('.product-model', product.model);
              setElementTextContent('.product-god', product.god);
              setElementTextContent('.product-category', product.category);
              setElementTextContent('.product-toplivo', product.toplivo);
              setElementTextContent('.product-originalnumber', product.originalnumber);
              setElementTextContent('.opysanye', product.opysanye);
              var imageGallery = document.querySelector('#imageGallery');

              if (product.photo && typeof product.photo === 'string' && imageGallery) {
                product.photo.split(',').forEach(function (photoUrl) {
                  var listItem = "\n                <li data-thumb=\"".concat(photoUrl.trim(), "\" data-src=\"").concat(photoUrl.trim(), "\">\n                  <a href=\"").concat(photoUrl.trim(), "\" data-lightgallery=\"item\">\n                    <img src=\"").concat(photoUrl.trim(), "\" alt=\"").concat(product.zapchast, "\">\n                  </a>\n                </li>\n              ");
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
                  onSliderLoad: function onSliderLoad() {
                    $('#imageGallery').removeClass('cS-hidden');
                  }
                });
              } else {
                console.error('Поле photo не содержит данных или не является строкой для товара с ID:', productId);
              }
            } else {
              console.error('Продукт с указанным ID не найден:', productId);
            }
          })["catch"](function (error) {
            return console.error('Ошибка загрузки данных продукта:', error);
          });

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // Табы 

document.addEventListener("DOMContentLoaded", function () {
  var tabs = document.querySelectorAll(".info-tab");
  var contents = document.querySelectorAll(".info-content");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      // Удаляем активные классы со всех табов и контента
      tabs.forEach(function (item) {
        return item.classList.remove("active");
      });
      contents.forEach(function (content) {
        return content.classList.remove("active");
      }); // Добавляем активный класс текущему табу и связанному контенту

      tab.classList.add("active");
      document.querySelector(".".concat(tab.id, "-info")).classList.add("active");
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.querySelector('.InOneClickoverlay');
  var modal = document.querySelector('.buyInOneClick');
  var buyNowButtons = document.querySelectorAll('.buy-now');
  var sendButton = document.getElementById('sendToTelegram');
  var CHAT_ID = "-1002422030496";
  var BOT_TOKEN = "7598927769:AAGEAZ5pRe-5I1rtmaRroxja94iPboFIGuw";

  function getProductData(button) {
    var productItem = button.closest('.product-item');
    return {
      id: productItem.querySelector('.product-id').textContent.trim(),
      name: productItem.querySelector('.product-name').textContent.trim(),
      price: productItem.querySelector('.product-price-uah').textContent.trim()
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

  buyNowButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var productData = getProductData(button);
      console.log('Дані товару:', productData);
      openModal(productData);
    });
  });

  function sendDataToTelegram() {
    var name = document.getElementById('nameBuyInOneClick').value.trim();
    var phone = document.getElementById('telBuyInOneClick').value.trim();
    var comment = document.getElementById('comment').value.trim();
    var productId = document.querySelector('.product-id').textContent.trim();
    var productName = document.querySelector('.product-name').textContent.trim();
    var productPrice = document.querySelector('.product-price-uah').textContent.trim();
    var errors = [];

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

    var message = "\n      <b>\u041D\u043E\u0432\u0435 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0432 1 \u043A\u043B\u0456\u043A:</b>\n      \uD83D\uDD39 <b>\u041D\u0430\u0437\u0432\u0430:</b> ".concat(productName, "\n      \uD83D\uDD39 <b>ID:</b> ").concat(productId, "\n      \uD83D\uDD39 <b>\u0426\u0456\u043D\u0430:</b> ").concat(productPrice, "\n      \uD83D\uDD39 <b>\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C:</b> 1\n\n      <b>\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u0456 \u0434\u0430\u043D\u0456:</b>\n      \uD83D\uDC64 <b>\u0406\u043C'\u044F:</b> ").concat(name, "\n      \uD83D\uDCDE <b>\u0422\u0435\u043B\u0435\u0444\u043E\u043D:</b> ").concat(phone, "\n      \uD83D\uDCDD <b>\u041A\u043E\u043C\u0435\u043D\u0442\u0430\u0440:</b> ").concat(comment || 'Без коментарів', "\n    ");
    var url = "https://api.telegram.org/bot".concat(BOT_TOKEN, "/sendMessage?chat_id=").concat(CHAT_ID, "&text=").concat(encodeURIComponent(message), "&parse_mode=HTML");
    fetch(url, {
      method: 'POST'
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data.ok) {
        toast.success('Ваше замовлення успішно надіслано.');
        closeModal();
      } else {
        toast.error('Сталася помилка під час надсилання. Спробуйте пізніше.');
      }
    })["catch"](function (error) {
      toast.error('Помилка: ' + error.message);
    });
  }

  if (sendButton) {
    sendButton.addEventListener('click', function (e) {
      e.preventDefault();
      sendDataToTelegram();
    });
  }

  var telephone = document.getElementById('telBuyInOneClick');

  if (telephone) {
    telephone.addEventListener('input', function (e) {
      var input = e.target.value.replace(/\D/g, '');
      var prefix = '38';
      var maxLength = 12;

      if (!input.startsWith(prefix)) {
        input = prefix + input;
      }

      if (input.length > maxLength) {
        input = input.substring(0, maxLength);
      }

      var formattedInput = '+38';
      var cursorPosition = e.target.selectionStart;
      var prevLength = e.target.value.length;

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

      var newLength = formattedInput.length;
      var diff = newLength - prevLength;
      e.target.value = formattedInput;

      if (diff > 0 && cursorPosition >= prevLength) {
        cursorPosition += diff;
      } else if (diff < 0 && cursorPosition > newLength) {
        cursorPosition = newLength;
      }

      setTimeout(function () {
        e.target.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    });
  }
});