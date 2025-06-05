// Функция для получения IP и местоположения
async function getIPAndLocation() {
    try {
      const response = await fetch('/api/ip-info');
      const data = await response.json();
      return {
        ip: data.query,
        country: data.country,
        region: data.regionName,
        city: data.city,
        isp: data.isp,
        lat: data.lat,
        lon: data.lon
      };
    } catch (error) {
      return { ip: "Не удалось получить IP", country: "Неизвестно" };
    }
  }

  // Получения списка расширений
  function getPlugins() {
    return navigator.plugins.length ? 
        Array.from(navigator.plugins).map(plugin => plugin.name).join(", ") : 
        "Нет доступных плагинов";
}

// Проверка подключения девайсов
async function checkMediaDevices() {
  try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === "videoinput");
      const hasMicrophone = devices.some(device => device.kind === "audioinput");

      return `Камера: ${hasCamera ? "Есть" : "Нет"}, Микрофон: ${hasMicrophone ? "Есть" : "Нет"}`;
  } catch (error) {
      return "Не удалось определить";
  }
}


  // Получение User-Agent
  function getUserAgent() {
    return navigator.userAgent;
  }

  // Определение реферера (откуда пришел)
  function getReferrer() {
    return document.referrer || 'Не доступно';
  }

  

  // Главная функция проверки
  async function checkAnonymity() {
    const reportDiv = document.getElementById('report');
    //reportDiv.innerHTML = '<p style="font-weight: 600;font-size: 20px;margin-bottom: 5px;">Сайту известна следующая информация:</p><p>Загружаем данные...</p>';
    reportDiv.style.display = "block"
    reportDiv.style.backgroundColor = "none"
    reportDiv.style.border = "none"
    reportDiv.innerHTML = "<p style='text-align:center'>Проверка...</p>";

    try {
      const { ip, country, region, city, isp, lat, lon } = await getIPAndLocation();
      const userAgent = getUserAgent();
      const referrer = getReferrer();

      // Формируем отчет
      let report = `
        <p style="font-weight: 600;font-size: 18px;margin-bottom: 5px;">Сайту известна следующая информация:</p>
        <p><span style="font-weight:600;">🌐 IP-адрес:</span> ${ip}</p>
        <p><span style="font-weight:600;">📍 Местоположение:</span> Город: ${city}, Регион: ${region}, Страна: ${country} Координаты: ${lat}, ${lon}</p>
        <p><span style="font-weight:600;">🛰️ Провайдер:</span> ${isp}</p>
        <p><span style="font-weight:600;">💻 Браузер и устройство:</span> ${userAgent}</p>
        <p><span style="font-weight:600;">🔗 Откуда пришли (Referrer):</span> ${referrer}</p>
      `;

    
      reportDiv.innerHTML = "";
      reportDiv.style.backgroundColor = "#f8f9fa"
      reportDiv.style.border = "1px solid #ddd"

      // Вывод отчета
      reportDiv.innerHTML = report;
    } catch (error) {
      reportDiv.innerHTML = '<p>❌ Ошибка при получении данных. Попробуйте еще раз.</p>';
    }
  }


 

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}




const quiz = [
  {
    question: "Какая информация может быть определена по вашему IP-адресу?",
    answers: ["Ваш точный домашний адрес", "Вся история посещённых сайтов", "Примерное местоположение и провайдер", "Ваши пароли и логины"],
    correct: 2
  },
  {
    question: "Какой способ помогает повысить анонимность в интернете?",
    answers: ["Использование разных устройств", "Использование VPN или Tor", "Регистрация на большом количестве сайтов", "Очистка кэша"],
    correct: 1
  },
  {
    question: "Что означает, если сайт узнаёт ваш User-Agent?",
    answers: ["Сайт знает ваш логин", "Сайт знает ваш IP-адрес", "Сайт знает ваш пароль", "Сайт знает модель устройства и браузер"],
    correct: 3
  },
  {
    question: "Для чего чаще всего используется VPN?",
    answers: ["Чтобы ускорить интернет-соединение", "Для создания резервных копий данных", "Для скрытия реального IP-адреса и защиты трафика", "Для защиты устройства"],
    correct: 2
  },
  {
    question: "Что может сделать злоумышленник, если ему известны данные о вашем браузере и устройстве?",
    answers: ["Провести fingerprinting и отслеживать вашу активность в интернете", "Мгновенно получить доступ к банковскому счёту", "Заблокировать устройство удалённо", "Изменить настройки вашего браузера без разрешения"],
    correct: 0
  }
];

let currentQuestion = 0;
let selectedAnswers = Array(quiz.length).fill(null);

const modal = document.getElementById("quizModal");
const qText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers");
const counter = document.getElementById("question-counter");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const result = document.getElementById("test-result");

function openModal() {
  modal.style.display = "block";
  currentQuestion = 0;
  selectedAnswers = Array(quiz.length).fill(null);

  // Сброс текста и отображение кнопок
  prevBtn.style.display = "inline-block";
  nextBtn.style.display = "inline-block";

  // Убедимся, что кнопки и счётчик отображаются
  counter.textContent = "";
  qText.textContent = "";
  answersContainer.innerHTML = "";

  renderQuestion();
}

function closeModal() {
  modal.style.display = "none";
  qText.textContent = "";
  answersContainer.innerHTML = "";
  counter.textContent = "";
  prevBtn.style.display = "inline-block";
  nextBtn.style.display = "inline-block";
}

function renderQuestion() {
  result.textContent = ``
  const q = quiz[currentQuestion];
  qText.textContent = q.question;
  answersContainer.innerHTML = "";

  q.answers.forEach((answer, index) => {
    const id = `answer_${index}`;
    const label = document.createElement("label");
    label.innerHTML = `<input type="radio" name="answer" id="${id}" value="${index}" ${
      selectedAnswers[currentQuestion] === index ? "checked" : ""
    }> ${answer}`;
    answersContainer.appendChild(label);
  });

  counter.textContent = `${currentQuestion + 1} / ${quiz.length}`;
  prevBtn.disabled = currentQuestion === 0;
  nextBtn.textContent = currentQuestion === quiz.length - 1 ? "Завершить" : "Вперёд";
}

prevBtn.onclick = () => {
  saveAnswer();
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
};

nextBtn.onclick = () => {
  saveAnswer();
  if (currentQuestion < quiz.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResults();
  }
};

function saveAnswer() {
  const selected = document.querySelector("input[name='answer']:checked");
  if (selected) selectedAnswers[currentQuestion] = parseInt(selected.value);
}

function showResults() {
  let score = 0;
  quiz.forEach((q, i) => {
    if (selectedAnswers[i] === q.correct) score++;
  });
  qText.textContent = ``;
  result.textContent = `Вы набрали ${score} из ${quiz.length} баллов.`;
  answersContainer.innerHTML = "";
  counter.textContent = "";
  prevBtn.style.display = "none";
  nextBtn.style.display = "none";
}