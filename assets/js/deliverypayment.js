async function loadData() {
  const response = await fetch('../data/deliverypayment.json');
  const data = await response.json();
  generateContent(data);
}

function generateContent(data) {
  const contentSection = document.getElementById('content');

  const deliverySection = document.createElement('div');
  deliverySection.innerHTML = `
  <div class="container">
    <h1>${data.delivery.title}</h1>
    <ul>${data.delivery.options.map(option => `<li>&#9733; ${option}</li>`).join('')}</ul>
  </div>`;
  contentSection.appendChild(deliverySection);

  const paymentSection = document.createElement('div');
  paymentSection.innerHTML = `
  <div class="container">
    <div class="delivery_payment_title">${data.payment.title}</div>
    <ul>${data.payment.options.map(option => `<li>&#10004; ${option}</li>`).join('')}</ul>
    <div class="important">${data.payment.important}</div>
  </div>`;
  contentSection.appendChild(paymentSection);

  const workSchedule = document.createElement('div');
  workSchedule.innerHTML = `
    <div class="container">
    <div class="delivery_payment_title">${data.workingHours.title}</div>
    <ul>${data.workingHours.schedule.map(day => `<li>&#9734; ${day}</li>`).join('')}</ul>
  </div>`;
  contentSection.appendChild(workSchedule);

  const partsSection = document.createElement('div');
  partsSection.innerHTML = `
  <div class="container">
    <div class="delivery_payment_title">Список запчастин</div>
    <div class="flex-table">
      <div class="flex-table-row flex-table-header">
        <div class="flex-table-cell">Позиція</div>
        <div class="flex-table-cell price">Сума (грн)</div>
      </div>
      ${data.partsList.map(part => `
        <div class="flex-table-row">
          <div class="flex-table-cell">${part.name}</div>
          <div class="flex-table-cell price">${part.price}</div>
        </div>`).join('')}
    </div>
  </div>`;
  contentSection.appendChild(partsSection);
}

loadData();