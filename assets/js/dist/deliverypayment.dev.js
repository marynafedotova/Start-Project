"use strict";

function loadData() {
  var response, data;
  return regeneratorRuntime.async(function loadData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch('../data/deliverypayment.json'));

        case 2:
          response = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(response.json());

        case 5:
          data = _context.sent;
          generateContent(data);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}

function generateContent(data) {
  var contentSection = document.getElementById('content');
  var deliverySection = document.createElement('div');
  deliverySection.innerHTML = "\n  <div class=\"container\">\n    <h1>".concat(data.delivery.title, "</h1>\n    <ul>").concat(data.delivery.options.map(function (option) {
    return "<li>&#9733; ".concat(option, "</li>");
  }).join(''), "</ul>\n  </div>");
  contentSection.appendChild(deliverySection);
  var paymentSection = document.createElement('div');
  paymentSection.innerHTML = "\n  <div class=\"container\">\n    <div class=\"delivery_payment_title\">".concat(data.payment.title, "</div>\n    <ul>").concat(data.payment.options.map(function (option) {
    return "<li>&#10004; ".concat(option, "</li>");
  }).join(''), "</ul>\n    <div class=\"important\">").concat(data.payment.important, "</div>\n  </div>");
  contentSection.appendChild(paymentSection);
  var workSchedule = document.createElement('div');
  workSchedule.innerHTML = "\n    <div class=\"container\">\n    <div class=\"delivery_payment_title\">".concat(data.workingHours.title, "</div>\n    <ul>").concat(data.workingHours.schedule.map(function (day) {
    return "<li>&#9734; ".concat(day, "</li>");
  }).join(''), "</ul>\n  </div>");
  contentSection.appendChild(workSchedule);
  var partsSection = document.createElement('div');
  partsSection.innerHTML = "\n  <div class=\"container\">\n    <div class=\"delivery_payment_title\">\u0421\u043F\u0438\u0441\u043E\u043A \u0437\u0430\u043F\u0447\u0430\u0441\u0442\u0438\u043D</div>\n    <div class=\"flex-table\">\n      <div class=\"flex-table-row flex-table-header\">\n        <div class=\"flex-table-cell\">\u041F\u043E\u0437\u0438\u0446\u0456\u044F</div>\n        <div class=\"flex-table-cell price\">\u0421\u0443\u043C\u0430 (\u0433\u0440\u043D)</div>\n      </div>\n      ".concat(data.partsList.map(function (part) {
    return "\n        <div class=\"flex-table-row\">\n          <div class=\"flex-table-cell\">".concat(part.name, "</div>\n          <div class=\"flex-table-cell price\">").concat(part.price, "</div>\n        </div>");
  }).join(''), "\n    </div>\n  </div>");
  contentSection.appendChild(partsSection);
}

loadData();