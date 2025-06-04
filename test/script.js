const quiz = [
    { q: "Как называется методика, при которой сайт узнаёт ваш IP, город и браузер?",
      a: [ "Фишинг", "Анализ цифрового следа", "DDoS-атака" ], correct: 1 },
    { q: "Какой алгоритм мы используем в модуле шифрования файлов?",
      a: [ "AES", "RSA", "DES" ], correct: 0 },
    { q: "Что из перечисленного НЕ является метаданным EXIF-фото?",
      a: [ "GPS-координаты", "Модель камеры", "Цветовой профиль экрана" ], correct: 2 },
    { q: "Сервис VirusTotal анализирует сайт с помощью:",
      a: [ "только одного антивируса", "более 90 антивирусных движков", "ручной экспертизы" ], correct: 1 },
    { q: "Как называется безопасный способ проверки пароля на утечки, при котором сам пароль не передаётся API?",
      a: [ "Rainbow table", "MD5-хеширование", "k-Anonymity" ], correct: 2 }
  ];

  let current = 0;
  let answers = Array(quiz.length).fill(null);
  const total = quiz.length;

  const qText = document.getElementById("question-text");
  const ansDiv = document.getElementById("answers");
  const counter = document.getElementById("question-counter");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const resultDiv = document.getElementById("result");
  const scoreInd = document.getElementById("score-indicator");

  function renderQuestion() {
    const item = quiz[current];
    counter.textContent = `Вопрос ${current+1} из ${total}`;
    qText.textContent = item.q;
    ansDiv.innerHTML = "";
    item.a.forEach((ans,i) => {
      const id = `q${current}_a${i}`;
      const lbl = document.createElement("label");
      lbl.htmlFor = id;
      lbl.innerHTML = `<input type="radio" name="q${current}" id="${id}" value="${i}" ${answers[current]===i?'checked':''}> ${ans}`;
      ansDiv.appendChild(lbl);
    });
    prevBtn.disabled = current===0;
    nextBtn.textContent = current===total-1 ? "Проверить результат" : "Вперёд";
    scoreInd.textContent = ""; // можно писать прогресс, но скрываем
  }

  prevBtn.addEventListener("click", ()=>{
    saveAnswer();
    current--;
    renderQuestion();
  });

  nextBtn.addEventListener("click", ()=>{
    saveAnswer();
    if (current < total-1) {
      current++;
      renderQuestion();
    } else {
      showResult();
    }
  });

  function saveAnswer() {
    const sel = document.querySelector(`input[name="q${current}"]:checked`);
    answers[current] = sel ? +sel.value : null;
  }

  function showResult() {
    saveAnswer();
    let score = 0;
    quiz.forEach((item,i)=>{
      if (answers[i]===item.correct) score++;
    });
    // Скрыть карточку
    document.getElementById("quiz-card").innerHTML = `
      <div id="result">Ваш результат: ${score} из ${total}</div>
    `;
  }

  // Инициализация
  renderQuestion();

  const modal = document.querySelector('dialog')
const modalBox = document.getElementById('modal-box')
const showModalBtn = document.getElementById('show-modal-btn')
const closeModalBtn = document.getElementById('close-modal-btn')

let isModalOpen = false

showModalBtn.addEventListener('click', (e) => {
  modal.showModal()
  isModalOpen = true
  e.stopPropagation()
})

closeModalBtn.addEventListener('click', () => {
  modal.close()
  isModalOpen = false
})

document.addEventListener('click', (e) => {
  if (isModalOpen && !modalBox.contains(e.target)) {
    modal.close()
  }
})