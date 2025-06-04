const passwordInput = document.getElementById("password-input");

function checkPassword() {
  const password = document.getElementById("password-input").value;
  const strengthLabel = document.getElementById("strength-label");
  const barSegments = document.querySelectorAll(".bar-segment");

  // Оценка надежности пароля
  let strength = 0;
  if (password.length >= 12) strength += 2;
  else if (password.length >= 8) strength += 1;
  if (/[A-ZА-ЯЁ]/.test(password)) strength += 1;
  if (/[a-zа-яё]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-zА-Яа-яЁё0-9]/.test(password)) strength += 1;

  // Нормализуем уровень для отображения (максимум 5)
  const normalizedStrength = Math.min(strength, 5);

  const colors = ["darkred", "red", "orange", "darkgreen", "green"];
  const levels = ["Очень слабый", "Слабый", "Средний", "Надежный", "Очень надежный"];

  // Очистка сегментов
  barSegments.forEach((segment, index) => {
    segment.style.backgroundColor = index < normalizedStrength ? colors[normalizedStrength - 1] : "#eee";
  });

  strengthLabel.textContent = normalizedStrength > 0 ? levels[normalizedStrength - 1] : "Результат проверки надежности";
  strengthLabel.style.color = normalizedStrength > 0 ? colors[normalizedStrength - 1] : "#666";

  // Вызов отложенной проверки на утечку
  debouncedLeakCheck(password);
}



function generatePassword() {
    const lengthOfPassword = 16;
    const charset = ["abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "0123456789", "!@#$%^&*()"]
    let password = "";
    
    let shift = 0;
        
    for (let i = 0; i < lengthOfPassword; i++) {
        let charsetLength = charset[shift].length;
        const randomIndex = Math.floor(Math.random() * charsetLength);
        password += charset[shift][randomIndex];
        shift = (shift + 1) % 4;
    } 
    
    passwordInput.value = password;
    checkPassword();
}

function copyToClipboard() {
  navigator.clipboard.writeText(document.getElementById("password-input").value);
}




async function checkPasswordLeak(password) {
  const sha1 = await sha1Hash(password);
  const prefix = sha1.substring(0, 5);
  const suffix = sha1.substring(5).toUpperCase();

  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await response.text();

  const lines = text.split('\n');
  const found = lines.find(line => line.startsWith(suffix));
  
  if (found) {
      const count = found.split(':')[1];
      return `Проверка на утечки: ⚠️Пароль найден в утечках ${count} раз.`;
  } else {
      return "Проверка на утечки: ✅ Пароль не найден в известных утечках!";
  }
}

// SHA1 хеширование
async function sha1Hash(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}


async function handlePasswordLeakCheck(password) {
  const leakOutput = document.getElementById("leak-check-result");

  if (password.length > 3) {
      leakOutput.textContent = "Проверка на утечки: обнаружение...";
      try {
          const result = await checkPasswordLeak(password);
          leakOutput.textContent = result;
      } catch (error) {
          leakOutput.textContent = "Проверка на утечки: ❌ Ошибка при проверке утечки.";
          leakOutput.style.color = "gray";
      }
  } else {
      leakOutput.textContent = "Проверка на утечки: ";
  }
}

const debouncedLeakCheck = debounce(handlePasswordLeakCheck, 800);



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
    question: "Какой из этих паролей чаще встречается в утечках?",
    answers: ["A9f-", "cooladmin123", "neverguess", "8564091"],
    correct: 2
  },
  {
    question: "Какой подход к созданию паролей является наименее надёжным?",
    answers: ["Использование случайных символов", "Использование даты рождения", "Генерация пароля через менеджер паролей", "Создание уникального пароля для каждого сервиса"],
    correct: 1
  },
  {
    question: "Какой из этих паролей наименее надежный?",
    answers: ["adminadminadmin", "412341511", "F43f!", "fsdfawefeaga"],
    correct: 0
  },
  {
    question: "Какой из этих советов является неверным?",
    answers: ["Включите двухфакторную аутентификацию (2FA), где возможно", "Не передавайте пароли через мессенджеры или e-mail", "Используйте менеджер паролей", "Храните пароли в заметках"],
    correct: 3
  },
  {
    question: "Почему важно использовать длинные пароли?",
    answers: ["Длинный пароль легче запомнить", "Короткие пароли запрещены большинством сайтов", "Длинный пароль сложнее подобрать с помощью перебора (brute-force)", "Длинный пароль автоматически защищает от фишинга"],
    correct: 2
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