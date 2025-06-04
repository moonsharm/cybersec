function setupDownloadButton(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const downloadButton = document.getElementById("download-button");
    
    downloadButton.disabled = false; // Разблокируем кнопку
    downloadButton.title = ""; // Убираем подсказку
    
    downloadButton.onclick = () => {
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
    };
}

function validateInputs() {
    const fileInput = document.getElementById("file-input").files[0];
    const password = document.getElementById("password").value;

    if (!fileInput) {
        alert("⚠ Файл не загружен!");
        return false;
    }
    if (!password.trim()) {
        alert("⚠ Введите ключ шифрования!");
        return false;
    }
    return true;
}

async function encryptFile() {
    if (!validateInputs()) return;

    const fileInput = document.getElementById("file-input").files[0];
    const password = document.getElementById("password").value;

    const formData = new FormData();
    formData.append("file", fileInput);
    formData.append("password", password);

    try {
        const response = await fetch("http://localhost:3000/api/encrypt", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error.error || "Произошла ошибка при шифровании файла");
            return;
        }

        const data = await response.json();
        const blob = new Blob([Uint8Array.from(atob(data.file), c => c.charCodeAt(0))]);
        setupDownloadButton(blob, `encrypted_file${data.extension}`);
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Не удалось зашифровать файл.");
    }
}

async function decryptFile() {
    if (!validateInputs()) return;

    const fileInput = document.getElementById("file-input").files[0];
    const password = document.getElementById("password").value;

    const formData = new FormData();
    formData.append("file", fileInput);
    formData.append("password", password);

    try {
        const response = await fetch("http://localhost:3000/api/decrypt", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error.error || "Произошла ошибка при расшифровке файла");
            return;
        }

        const data = await response.json();
        const blob = new Blob([Uint8Array.from(atob(data.file), c => c.charCodeAt(0))]);
        setupDownloadButton(blob, `decrypted_file${data.extension}`);
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Не удалось расшифровать файл.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const downloadButton = document.getElementById("download-button");
    downloadButton.disabled = true;
    downloadButton.title = "Файл не зашифрован или не расшифрован";

    document.getElementById("file-input").addEventListener("change", () => {
        downloadButton.disabled = true;
        downloadButton.title = "Файл не зашифрован или не расшифрован";
    });
});

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
    question: "Главная функция шифрования?",
    answers: ["Способ уменьшения размера файла", "Процесс уничтожения информации", "Преобразование информации в недоступный без ключа вид", "Восстановление удалённых файлов"],
    correct: 2
  },
  {
    question: "Для чего используется ключ при шифровании?",
    answers: ["Чтобы подписать файл", "Для сжатия данных", "Для доступа к данным", "Разрешение, имя файла"],
    correct: 2
  },
  {
    question: "На какие 2 вида можно разделить шифрование?",
    answers: ["Симметричное и асимметричное", "Локальное и сетевое", "Аппаратное и программное", "Простое и сложное"],
    correct: 0
  },
  {
    question: "Какой из этих алгоритмов основан на принципах симметричного шифрования?",
    answers: ["RSA", "ECC", "Diffie-Hellman", "AES"],
    correct: 3
  },
  {
    question: "Почему рекомендуется шифровать файлы локально на устройстве, а не через онлайн-сервисы?",
    answers: ["Чтобы сэкономить интернет", "Чтобы не передавать конфиденциальные данные третьим лицам", "Онлайн-сервисы не всегда могут быть доступны", "Такой файл потом нельзя будет расшифровать"],
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
  nextBtn.style.display = "none";
}