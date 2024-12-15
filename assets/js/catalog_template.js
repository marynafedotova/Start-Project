document.querySelectorAll('.submenu a').forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    const imgElement = this.querySelector('img');
    if (imgElement && imgElement.alt) {
      const brand = imgElement.alt.toLowerCase();
      const pageUrl = `catalog-template.html?brand=${brand}`;
      window.location.href = pageUrl;
    } else {
      console.error('Атрибут alt у изображения не найден.');
    }
  });
});

    document.addEventListener('DOMContentLoaded', function () {
      const urlParams = new URLSearchParams(window.location.search);
      const brand = urlParams.get('brand');
  
      const brandData = {
    acura: { 
      title: 'Acura Catalog', 
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Acura.' 
    },
    audi: { 
      title: 'Audi Catalog', 
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Audi.' 
    },
    bmw: { 
      title: 'BMW Catalog', 
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки BMW.' 
    },
    crysler: { 
      title: 'Chrysler Catalog', 
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Chrysler.' 
    },
    dodge: { 
      title: 'Dodge Catalog', 
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Dodge.' 
    },
    honda: { 
      title: 'Honda Catalog', 
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Honda.' 
    },
    hyundai: { 
      title: 'Hyundai Catalog', 
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Hyundai.' 
    },
    infiniti: { 
      title: 'Infiniti Catalog', 
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Infiniti.' 
    },
    jaguar: { 
      title: 'Jaguar Catalog', 
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Jaguar.' 
    },
    jeep: { 
      title: 'Jeep Catalog', 
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Jeep.' 
    },
    lincoln: { 
      title: 'Lincoln Catalog', 
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Lincoln.' 
    },
    kia: { 
      title: 'Kia Catalog', 
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Kia.' 
    },
    land_rover: { 
      title: 'Land Rover Catalog', 
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів маркиLand Rover.' 
    },
    nissan: { 
      title: 'Nissan Catalog', 
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Nissan.' 
    },
    volkswagen: { 
      title: 'Volkswagen Catalog', 
      description: 'Ласкаво просимо до каталогу запчастин до автомобілів марки Volkswagen.' 
    },
  };
  
  
      if (brand && brandData[brand]) {
        document.getElementById('brand-title').textContent = brandData[brand].title;
        document.getElementById('brand-description').textContent = brandData[brand].description;
      } else {
        const contentElement = document.getElementById('content');
        if (contentElement) {
          contentElement.innerHTML = '<p>Бренд не найден.</p>';
        } else {
          console.error('Элемент с id="content" не найден.');
        }
      }
    });
  
  async function loadData() {
    try {
      const response = await fetch('../data/data_ukr.json');
      const data = await response.json();
      return data.Sheet1; 
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      return [];
    }
  }
  
function groupByUniqueCars(cars) {
  const uniqueCars = new Map();
  cars.forEach(car => {
    const key = `${car.markaavto.toLowerCase()}-${car.model.toLowerCase()}-${car.god}`;
    if (!uniqueCars.has(key)) {
      uniqueCars.set(key, car);
    }
  });
  return Array.from(uniqueCars.values());
}

function filterCars(cars, brand, minYear = 2000) {
  const filteredCars = cars.filter(car => 
    car.markaavto && 
    car.markaavto.toLowerCase() === brand.toLowerCase() && 
    car.god >= minYear
  );
  return groupByUniqueCars(filteredCars); 
}


function createCarCards(brand, minYear = 2000) {
  loadData().then(cars => {
    const filteredCars = filterCars(cars, brand, minYear);

    const catalogElement = document.getElementById('cars-catalog');
    if (!catalogElement) {
      console.error('Элемент с id="cars-catalog" не найден.');
      return;
    }

    catalogElement.innerHTML = '';

    if (filteredCars.length === 0) {
      catalogElement.innerHTML = '<p>Нет автомобилей для отображения по выбранному фильтру.</p>';
      return;
    }

    filteredCars.forEach(car => {
      const card = document.createElement('div');
      card.classList.add('car-card');
      card.innerHTML = `
        <img src="${car.pictures.split(',')[0]}" alt="${car.model}">
        <div class="car-details">
          <h2>${car.markaavto} ${car.model}</h2>
          <p>Рік: ${car.god}</p>
          <button class="view-details-btn" data-make="${car.markaavto}" data-model="${car.model}" data-year="${car.god}">Детальніше</button>
        </div>
      `;

      catalogElement.appendChild(card);
    });
    document.querySelectorAll('.view-details-btn').forEach(button => {
      button.addEventListener('click', function () {
        const make = this.dataset.make;
        const model = this.dataset.model;
        const year = this.dataset.year;
        window.location.href = `car-page.html?make=${make}&model=${model}&year=${year}`;
      });
    });
  }).catch(error => {
    console.error('Ошибка при создании карточек:', error);
  });
}


document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const brand = urlParams.get('brand');
  if (brand) {
    createCarCards(brand);
  }
});

