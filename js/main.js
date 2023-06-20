let API = "https://pokeapi.co/api/v2/pokemon"; // URL API для получения данных о покемонах
let container = document.querySelector(".container"); // Ссылка на HTML-элемент с классом "container"
let modal = document.querySelector(".modal"); // Ссылка на HTML-элемент с классом "modal"
let next = document.querySelector(".next"); // Ссылка на HTML-элемент с классом "next"
let prev = document.querySelector(".prev"); // Ссылка на HTML-элемент с классом "prev"
let every = document.querySelector(".every"); // Ссылка на HTML-элемент с классом "every"
let countt = document.querySelector(".count"); // Ссылка на HTML-элемент с классом "count"
let count = 1; // Текущий номер страницы
//пагинация
let nextvar = ""; // Переменная для хранения URL следующей страницы
let prevvar = ""; // Переменная для хранения URL предыдущей страницы

//Ассинх запрос для того чтобы вывести информацию
async function getFromApi(link = API) {
  container.innerHTML = ""; // Очистить контейнер перед загрузкой новых данных
  let res = await fetch(link); // Отправить запрос на получение данных
  let data = await res.json(); // Преобразовать ответ в формат JSON
  let info = data.results; // Получить массив результатов
  info.forEach((pocco, index) => {
    fetch(pocco.url)
      .then((res) => res.json())
      .then((informationPocco) => {
        container.innerHTML += `
        <div onclick="getInfo(${index})" class="every one">
          <img src="${informationPocco.sprites.front_default}" alt="#">
          <div class="word">${pocco.name}</div>
        </div>`;
      });
  });
  countt.innerHTML = count; // Обновить отображение текущего номера страницы
}

//Ассинх функция и запрос для того чтобы вывести информация об покемонах

async function getInfo(index) {
  modal.style.display = "block"; // Отобразить модальное окно
  let res = await fetch(API);
  let data = await res.json();
  let info = data.results;
  fetch(info[index].url)
    .then((res) => res.json())
    .then((data) => {
      modal.innerHTML = ""; // Очистить содержимое модального окна перед заполнением новыми данными
      let typesPocce = data.types
        .map((typeOpocce) => typeOpocce.type.name)
        .join(", ");
      modal.innerHTML += `
      <div class="eachChar">
        <img src="${data.sprites.front_default}" height=200 width=200>
        <div class="information">
          <h1>${data.name}</h1>
          <p>Тип: ${typesPocce}</p>
          <p>Высота: ${data.height}</p>
          <p>Вес: ${data.weight}</p>
        </div>
        <button onclick="closeModal()">X</button>
      </div>`;
    });
}
// слушатель нвесил на кнопку button onclick
function closeModal() {
  modal.style.display = "none"; // Скрыть модальное окно
}

// функция и ислушатель события при нажатии на nextClick
async function nextClick() {
  modal.style.display = "none"; // Скрыть модальное окно
  let res = await fetch(API);
  let data = await res.json();
  nextVariant = data.next; // Сохранить URL следующей страницы
  if (nextVariant == null) {
    alert("Нет следующей страницы! Перейдите на предыдущую страницу ;)");
    return;
  }
  API = nextVariant; // Установить новый URL API для получения следующей страницы
  count++; // Увеличить номер страницы
  getFromApi(nextVariant); // Получить данные для следующей страницы
}

// функция и ислушатель события при нажатии на prevClick

async function prevClick() {
  modal.style.display = "none"; // Скрыть модальное окно
  let res = await fetch(API);
  let data = await res.json();
  prevvar = data.previous; // Сохранить URL предыдущей страницы
  if (prevvar == null) {
    alert("Нет предыдущей страницы! Перейдите на следующую страницу ;)");
    return;
  }
  API = prevvar; // Установить новый URL API для получения предыдущей страницы
  count--; // Уменьшить номер страницы
  getFromApi(prevvar); // Получить данные для предыдущей страницы
}

next.addEventListener("click", nextClick); // Привязать обработчик события для кнопки "Следующая страница"
prev.addEventListener("click", prevClick); // Привязать обработчик события для кнопки "Предыдущая страница"

// Получить данные для первой страницы при загрузке страницы
getFromApi();