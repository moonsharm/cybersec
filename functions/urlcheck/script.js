document.getElementById("checkButton").addEventListener("click", checkDomainAndSecurity);

async function checkDomainAndSecurity() {
  const domain = document.getElementById("domain").value.trim();
  if (!domain) {
    alert("Введите домен!");
    return;
  }

  const resultContainer = document.getElementById("result");
  resultContainer.style.display = "block"
  resultContainer.style.backgroundColor = "none"
  resultContainer.style.border = "none"
  resultContainer.style.textAlign = "center"
  resultContainer.innerHTML = "<p>Проверка...</p>";
  

  try {
    const [domainData] = await Promise.allSettled([
      fetch(`/api/domain-check?domain=${domain}`).then(res => res.json())
    ]);

    resultContainer.innerHTML = "";
    resultContainer.style.backgroundColor = "#f8f9fa"
    resultContainer.style.border = "1px solid #ddd"
    resultContainer.style.textAlign = "left"

    // Обработка данных домена
    if (domainData.status === "fulfilled") {
      const data = domainData.value;
      const stats = data.stats || {};
      const reputation = data.reputation || 0;
      const analysisResults = data.detailedResult || {};

      let message = `<p style="font-size: 18px;font-weight: 500;">Общая информация</p>`;
      if (reputation >= 0) {
        message += `<p>✔️ Очки репутации: ${reputation}</p>`;
      }
      else {
        message += `<p>⚠️ Очки репутации: ${reputation}</p>`;
      }
      


      // Статистика (сохраняем для совместимости)
      if (stats.malicious > 0 || stats.suspicious > 0) {
        const malAndSus = stats.malicious + stats.suspicious;
        message += "<div>";
        if (malAndSus > 0) {
          message += `<p>⚠️ ${malAndSus} из 94 сервисов посчитали сайт небезопасным</p>`;
        }
        message += "</div>";
      }


      // Анализ результатов проверки
      const { malicious, suspicious, phishing, malware } = analyzeEngineResults(analysisResults);
      
      if (malicious.length > 0 || suspicious.length > 0 || phishing.length > 0 || malware.length > 0) {
        message += "<div><p style='font-size: 18px;font-weight: 500;'>Детальная информация</p>";
        
        if (malicious.length > 0) {
          message += `<p>- Данные сервисы посчитали сайт вредоносным: ${malicious.join(', ')}</p>`;
        }
        if (suspicious.length > 0) {
          message += `<p>- Данные сервисы посчитали сайт подозрительным: ${suspicious.join(', ')}</p>`;
        }
        if (malware.length > 0) {
          message += `<p>- Данные сервисы посчитали сайт с вредоносным ПО: ${malware.join(', ')}</p>`;
        }
        if (phishing.length > 0) {
          message += `<p>- Данные сервисы посчитали сайт фишинговым: ${phishing.join(', ')}</p>`;
        }
        message += "</div>";
      } else {
        message += `<p>✅ Подозрений не обнаружено.</p>`;
      }

      resultContainer.innerHTML = message;
    } else {
      resultContainer.innerHTML = "<p>Ошибка при проверке домена.</p>";
    }
  } catch (error) {
    resultContainer.innerHTML = `<p>Ошибка: ${error.message}</p>`;
  }
}

function analyzeEngineResults(results) {
  const malicious = [];
  const suspicious = [];
  const phishing = [];
  const malware = [];

  for (const [engine, data] of Object.entries(results)) {
    if (data.category === 'malicious' && data.result === 'malicious') {
      malicious.push(engine);
    } else if (data.category === 'malicious' && data.result === 'phishing') {
      phishing.push(engine);
    } else if (data.category === 'suspicious' && data.result === 'suspicious') {
      suspicious.push(engine);
    } else if (data.category === 'malicious' && data.result === 'malware') {
      malware.push(engine);
    }
  }

  return { malicious, suspicious, phishing, malware };
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
    question: "Какая информация помогает с большой уверенностью определить, безопасен ли сайт?",
    answers: ["Анализ из репутационных баз данных (антивирусов, фишинг-детекторов)", "Количество лайков в соцсетях", "Отзывы", "Дизайн сайта"],
    correct: 0
  },
  {
    question: "Что означает, если в результатах проверки сайта указано, что он был признан вредоносным?",
    answers: ["Он вызывает ошибки в браузере", "Несколько источников считают, что сайт может содержать вредоносный код или фишинг", "Он загружается медленно", "У сайта плохой рейтинг"],
    correct: 1
  },
  {
    question: "Почему нельзя полагаться только на наличие HTTPS при проверке сайта?",
    answers: ["HTTPS используется только крупными сайтами", "HTTPS влияет только на скорость загрузки", "HTTPS не гарантирует, что сайт не содержит вредоносный код", "HTTPS делает сайт уязвимым"],
    correct: 2
  },
  {
    question: "Как помогает сервис VirusTotal при проверке безопасности сайта?",
    answers: ["Он блокирует сайт в браузере", "Он создает резервную копию сайта", "Он отключает интернет на устройстве", "Он собирает отчёты от множества антивирусов и систем фильтрации"],
    correct: 3
  },
  {
    question: "Что такое фишинговый сайт?",
    answers: ["Сайт, связанный с рыбалкой", "Сайт, который пытается украсть личные данные, маскируясь под доверенный ресурс", "Сайт с большим количеством рекламы", "Сайт, на котором нельзя зарегистрироваться"],
    correct: 1
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
  nextBtn.style.display = "none";console.log(result)
}